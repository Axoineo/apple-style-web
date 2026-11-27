import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string | undefined;
  className?: string;
  duration?: number;
  stagger?: number;
  gradientLastLine?: boolean;
  animateOnLoad?: boolean;
  /** Words from this index onward render in the dimmed second tone ("Two-tone. Headings."). */
  dimFrom?: number | undefined;
};

/** Animate once on entry; native animations release their paint layers when finished. */
export function TextReveal({
  text,
  as: Tag = "h1",
  id,
  className = "",
  duration = 0.85,
  stagger = 0.038,
  gradientLastLine = false,
  animateOnLoad = false,
  dimFrom,
}: Props) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // The first-viewport hero starts from server-rendered CSS, before hydration.
    if (animateOnLoad) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !element.animate || !window.IntersectionObserver) {
      element.dataset["revealed"] = "true";
      return;
    }

    const compact = window.matchMedia("(max-width: 767px)").matches;
    const characters = Array.from(element.querySelectorAll<HTMLElement>("[data-char]"));
    const words = Array.from(element.querySelectorAll<HTMLElement>("[data-word]"));
    // Spread every character across a bounded sweep. A hard delay cap makes the
    // last letters start together and breaks the end of longer headlines.
    const characterDuration = Math.min(duration, compact ? 0.68 : 0.9) * 1000;
    const staggerMs = Math.min(
      stagger * 1000,
      (compact ? 420 : 650) / Math.max(characters.length - 1, 1),
    );
    const animations: Animation[] = [];
    element.dataset["motionPending"] = "true";

    const settle = () => {
      delete element.dataset["motionPending"];
      animations.forEach((animation) => animation.cancel());
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        delete element.dataset["motionPending"];
        element.dataset["revealed"] = "true";

        characters.forEach((character, index) => {
          animations.push(
            character.animate(
              [
                { opacity: 0, transform: "translate3d(0, 0.3em, 0)" },
                { opacity: 0.85, transform: "translate3d(0, 0.05em, 0)", offset: 0.7 },
                { opacity: 1, transform: "translate3d(0, 0, 0)" },
              ],
              {
                duration: characterDuration,
                delay: index * staggerMs,
                easing: "cubic-bezier(.22,.61,.36,1)",
                fill: "backwards",
              },
            ),
          );
        });

        // Blur each word as its first letter enters, then release the filter.
        // This keeps the soft focus without a filter layer on every character.
        let firstCharacter = 0;
        words.forEach((word) => {
          const wordStart = firstCharacter * staggerMs;
          firstCharacter += word.querySelectorAll("[data-char]").length;
          animations.push(
            word.animate([{ filter: `blur(${compact ? 3 : 6}px)` }, { filter: "blur(0px)" }], {
              duration: compact ? 620 : 820,
              delay: wordStart,
              easing: "cubic-bezier(.22,.61,.36,1)",
              fill: "backwards",
            }),
          );
        });

        void Promise.all(animations.map((animation) => animation.finished)).then(settle, settle);
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(element);
    const onPreferenceChange = () => {
      if (!reduced.matches) return;
      observer.disconnect();
      element.dataset["revealed"] = "true";
      settle();
    };
    reduced.addEventListener("change", onPreferenceChange);

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", onPreferenceChange);
      settle();
    };
  }, [text, duration, stagger, animateOnLoad]);

  const lines = text.split("\n");
  let characterIndex = 0;
  let globalWord = 0;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`text-reveal ${animateOnLoad ? "text-reveal-on-load" : ""} ${className}`}
      aria-label={text.replaceAll("\n", " ")}
      style={
        animateOnLoad
          ? ({ "--headline-duration": `${Math.min(duration, 0.9) * 1000}ms` } as CSSProperties)
          : undefined
      }
    >
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span
            key={`${lineIndex}-${line}`}
            className={lines.length > 1 ? "reveal-line" : undefined}
          >
            {line.split(" ").map((word, wordIndex, words) => {
              const firstCharacter = characterIndex;
              const letters = Array.from(word);
              characterIndex += letters.length;
              const dimmed = dimFrom !== undefined && globalWord++ >= dimFrom;
              return (
                <span key={`${wordIndex}-${word}`}>
                  <span
                    data-word
                    className={`reveal-word ${dimmed ? "text-dim" : ""}`}
                    style={
                      animateOnLoad
                        ? ({
                            "--word-delay": `${firstCharacter * stagger * 1000}ms`,
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    {letters.map((character, index) => (
                      <span
                        key={index}
                        data-char
                        className={`reveal-char ${gradientLastLine && lineIndex === lines.length - 1 ? "text-sheen" : ""}`}
                        style={
                          animateOnLoad
                            ? ({
                                "--char-delay": `${(firstCharacter + index) * stagger * 1000}ms`,
                              } as CSSProperties)
                            : undefined
                        }
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}
