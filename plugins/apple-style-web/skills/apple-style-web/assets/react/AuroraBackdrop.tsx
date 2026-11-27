// Soft pastel hero light. Needs .soft-glow from tokens.css; place inside a `position: relative; isolation: isolate` section.
import { useEffect, useRef, useState } from "react";

/**
 * Soft pastel light behind page heroes. Pure CSS (no WebGL), drifts slowly and
 * pauses when offscreen or in a hidden tab so it never costs battery unseen.
 */
export function AuroraBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-animating={visible ? "true" : undefined}
      className={`soft-glow ${className}`}
    >
      <span />
      <span />
      <span />
    </div>
  );
}
