import { motion, useSpring, type MotionStyle } from "motion/react";
import type { ReactNode, PointerEvent } from "react";
import { useReducedMotionPreference as useReducedMotion } from "./useReducedMotion";

/**
 * Leans toward the mouse with critically damped springs and lights an edge glow
 * that follows the cursor. Touch input is ignored so scrolling never wobbles cards.
 */
export function Tilt({
  children,
  className = "",
  amount = 8,
  style,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  style?: MotionStyle;
}) {
  const reduced = useReducedMotion();
  // Soft, critically damped springs: the card eases into its lean, never snaps.
  const cfg = { stiffness: 90, damping: 20, mass: 1.1 };
  const rx = useSpring(0, cfg);
  const ry = useSpring(0, cfg);
  const lift = useSpring(0, cfg);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (reduced) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * amount * 0.7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * amount * 0.55);
    lift.set(-3);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    lift.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, y: lift, transformPerspective: 900, ...style }}
      className={`edge-glow ${className}`}
    >
      {children}
    </motion.div>
  );
}
