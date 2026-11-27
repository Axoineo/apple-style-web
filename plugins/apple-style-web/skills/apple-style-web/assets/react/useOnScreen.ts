import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is on screen (and the tab visible). Decorative loops
 * read this to pause offscreen so they never spend battery where nobody can see them.
 */
export function useOnScreen<T extends Element>(rootMargin = "0px") {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    let inView = false;
    const update = () => setOnScreen(inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        update();
      },
      { rootMargin },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [rootMargin]);
  return [ref, onScreen] as const;
}
