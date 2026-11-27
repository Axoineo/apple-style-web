import { useEffect } from "react";

const IDLE_MS = 900;

/**
 * Overlay-style scrollbars: any element that scrolls gets `is-scrolling` for a moment,
 * which shows its thin themed thumb (styles.css); it hides again once scrolling stops.
 * Moving the mouse near the page's right edge also reveals the page scrollbar so it
 * can be grabbed.
 */
export function ScrollActivity() {
  useEffect(() => {
    const timers = new Map<Element, number>();
    const show = (el: Element) => {
      el.classList.add("is-scrolling");
      window.clearTimeout(timers.get(el));
      timers.set(
        el,
        window.setTimeout(() => {
          el.classList.remove("is-scrolling");
          timers.delete(el);
        }, IDLE_MS),
      );
    };
    const onScroll = (e: Event) => {
      const t = e.target;
      if (t === document) show(document.documentElement);
      else if (t instanceof Element) show(t);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && window.innerWidth - e.clientX < 28)
        show(document.documentElement);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("pointermove", onMove);
      timers.forEach((id, el) => {
        window.clearTimeout(id);
        el.classList.remove("is-scrolling");
      });
    };
  }, []);
  return null;
}
