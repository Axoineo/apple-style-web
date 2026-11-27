import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { useReducedMotionPreference as useReducedMotion } from "./useReducedMotion";
import { springs } from "./springs";

export type SnapRailHandle = { go: (index: number) => void; index: () => number };

type Props = {
  children: ReactNode;
  label: string;
  className?: string;
  trackClassName?: string;
  onIndexChange?: (index: number) => void;
  onUserInteract?: () => void;
};

/** Apple's flick projection: where scrolling at this velocity would come to rest. */
function project(velocity: number, deceleration = 0.998) {
  return ((velocity / 1000) * deceleration) / (1 - deceleration);
}

/**
 * Horizontal rail that follows the pointer 1:1, rubber-bands at the ends, projects a
 * flick forward and lands on the nearest card carrying the release velocity.
 * Native vertical scrolling stays untouched (touch-action: pan-y).
 */
export const SnapRail = forwardRef<SnapRailHandle, Props>(function SnapRail(
  { children, label, className = "", trackClassName = "", onIndexChange, onUserInteract },
  ref,
) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduced = useReducedMotion();
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const snaps = useRef<number[]>([0]);
  const current = useRef(0);
  const dragged = useRef(false);

  const measure = useCallback(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const pad = parseFloat(getComputedStyle(tr).paddingLeft) || 0;
    const min = Math.min(0, vp.clientWidth - tr.scrollWidth);
    snaps.current = Array.from(tr.children).map((child) =>
      Math.max(min, Math.min(0, -((child as HTMLElement).offsetLeft - pad))),
    );
    setBounds({ left: min, right: 0 });
  }, []);

  const go = useCallback(
    (index: number, velocity = 0) => {
      const list = snaps.current;
      const i = Math.max(0, Math.min(list.length - 1, index));
      current.current = i;
      onIndexChange?.(i);
      const target = list[i] ?? 0;
      if (reduced) x.set(target);
      else
        animate(x, target, {
          ...(Math.abs(velocity) > 300 ? springs.flick : springs.surface),
          velocity,
        });
    },
    [onIndexChange, reduced, x],
  );

  useImperativeHandle(ref, () => ({ go: (i: number) => go(i), index: () => current.current }), [
    go,
  ]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => {
      measure();
      x.set(snaps.current[current.current] ?? 0);
    });
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, [measure, x]);

  const nearest = (value: number) => {
    let best = 0;
    snaps.current.forEach((s, i) => {
      if (Math.abs(s - value) < Math.abs((snaps.current[best] ?? 0) - value)) best = i;
    });
    return best;
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const v = info.velocity.x;
    let target = nearest(x.get() + project(v));
    if (target === current.current && Math.abs(v) > 350) target += v < 0 ? 1 : -1;
    go(target, v);
    setTimeout(() => (dragged.current = false), 0);
  };

  /* trackpad horizontal swipe */
  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    let timer = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      onUserInteract?.();
      x.stop();
      x.set(Math.max(bounds.left - 60, Math.min(60, x.get() - e.deltaX)));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => go(nearest(x.get())), 120);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  });

  return (
    <div
      ref={viewport}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={className}
      style={{ overflow: "hidden", outlineOffset: -2 }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onUserInteract?.();
          go(current.current + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onUserInteract?.();
          go(current.current - 1);
        }
      }}
      onClickCapture={(e) => {
        if (dragged.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <motion.div
        ref={track}
        drag="x"
        style={{
          x,
          touchAction: "pan-y",
          display: "flex",
          width: "max-content",
          gap: 20,
          cursor: "grab",
          userSelect: "none",
          // First card aligns with the page container; the rail still bleeds to the edge.
          paddingInline: "max(var(--gutter), calc((100vw - var(--container)) / 2))",
        }}
        dragConstraints={bounds}
        dragElastic={0.18}
        dragMomentum={false}
        onDragStart={() => {
          dragged.current = true;
          onUserInteract?.();
        }}
        onDragEnd={onDragEnd}
        className={trackClassName}
      >
        {children}
      </motion.div>
    </div>
  );
});
