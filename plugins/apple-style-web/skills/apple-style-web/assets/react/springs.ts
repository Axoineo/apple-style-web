import type { Transition } from "motion/react";

/**
 * Spring presets in Apple's damping/response terms, expressed with Motion's
 * bounce + duration (bounce 0 = critically damped). Use these instead of
 * fixed-duration tweens for anything people can touch or interrupt.
 */
export const springs = {
  /** Default UI movement: settles without overshoot. */
  ui: { type: "spring", bounce: 0, duration: 0.4 },
  /** Gentle reposition for larger surfaces. */
  surface: { type: "spring", bounce: 0, duration: 0.55 },
  /** After a flick or throw: a little overshoot because momentum preceded it. */
  flick: { type: "spring", bounce: 0.2, duration: 0.45 },
  /** Apple product-viewer pill expansion (measured ~4-9% overshoot). */
  pill: { type: "spring", bounce: 0.22, duration: 0.5 },
  /** Small controls popping into view. */
  pop: { type: "spring", bounce: 0.35, duration: 0.45 },
} satisfies Record<string, Transition>;

export const easeSoft = [0.22, 1, 0.36, 1] as const;
export const easeApple = [0.28, 0.11, 0.32, 1] as const;
