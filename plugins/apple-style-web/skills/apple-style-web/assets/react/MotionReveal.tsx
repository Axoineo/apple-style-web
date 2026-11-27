import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function MotionReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !window.IntersectionObserver) {
      element.dataset["revealed"] = "true";
      return;
    }
    element.dataset["motionPending"] = "true";

    const reveal = () => {
      delete element.dataset["motionPending"];
      element.dataset["revealed"] = "true";
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        reveal();
      },
      { threshold: 0.01, rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(element);
    const onPreferenceChange = () => {
      if (!reduced.matches) return;
      observer.disconnect();
      reveal();
    };
    reduced.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", onPreferenceChange);
      delete element.dataset["motionPending"];
      delete element.dataset["revealed"];
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-reveal ${className}`}
      style={{ "--reveal-delay": `${Math.min(delay, 0.35)}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
