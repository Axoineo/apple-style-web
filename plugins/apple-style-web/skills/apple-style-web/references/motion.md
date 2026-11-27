# Motion

Apple's motion model: **fast to start, slow to settle, always interruptible, never decorative.** Interfaces move like physical objects (springs carrying velocity), content arrives as the reader reaches it, and nothing performs for its own sake.

## Contents
1. Springs
2. Entrances (sections and headings)
3. The no-flash pattern (SSR/hydration)
4. Scroll-linked motion
5. Gestures: drag, flick, rubber-band
6. Hover and press
7. Loops and battery
8. Reduced motion
9. Anti-patterns

## 1. Springs

Use springs for anything a person can touch, drag or interrupt. Express them as **bounce + duration** (Apple's damping/response model) — with the `motion` library that's `{ type: "spring", bounce, duration }`. Presets in `assets/react/springs.ts`:

| Preset | bounce · duration | When |
|---|---|---|
| `ui` | 0 · 0.4s | Default UI movement; settles without overshoot |
| `surface` | 0 · 0.55s | Larger surfaces: rails, sheets, panels |
| `flick` | 0.2 · 0.45s | After a throw — overshoot is earned because momentum preceded it |
| `pill` | 0.22 · 0.5s | Pill/segmented-control expansion (Apple measured ~4–9% overshoot) |
| `pop` | 0.35 · 0.45s | Small controls popping into view |

Bounce 0 is the default. Bounce only after a flick or for small pops; a bouncing card on page load looks cheap.

Pass the gesture's release velocity into the spring (`animate(x, target, { ...springs.flick, velocity })`) so motion continues seamlessly from the finger instead of restarting.

For pointer-following values (tilt, magnetic hover), use a soft critically-damped spring: `useSpring(0, { stiffness: 90, damping: 20, mass: 1.1 })`. For scroll progress smoothing: `{ stiffness: 140–260, damping: 30–40, restDelta: 0.001 }`.

## 2. Entrances

**Sections (`MotionReveal`)**: when an element enters the viewport (IntersectionObserver, threshold ~0.01, `rootMargin: "0px 0px -24px 0px"`), play once:

```css
@keyframes soft-entrance {
  from { opacity: 0; transform: translateY(20px); filter: blur(6px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
/* 720ms cubic-bezier(.22,1,.36,1); phones: 600ms, 14px, blur 2px */
```

Stagger siblings with a CSS variable delay, capped at ~0.35s total so long lists don't drag.

**Headings (`TextReveal`)**: split into words → characters. Each character rises `0.3em` and fades (850ms, `cubic-bezier(.22,.61,.36,1)`); each *word* un-blurs from 6px as its first letter enters. Rules that took iterations to learn:

- Wrap every word in `display:inline-block; white-space:nowrap` so a word never breaks mid-reveal across lines.
- Give glyphs padding (`padding-block: .12em; margin-block: -.12em` on words, `padding-inline: .08em; margin-inline: -.08em` on chars) so ascenders, descenders and gradient-clipped text aren't cropped.
- Blur words, not characters — a filter on every character creates hundreds of paint layers and stutters.
- Bound the total sweep (≈650ms desktop, 420ms phone) by shrinking the per-character stagger for long headlines; a hard delay cap makes the last letters arrive together and looks broken.
- Use the Web Animations API (`el.animate`) and `cancel()` the animations when finished so they release their layers.
- Put the full text in `aria-label` and `aria-hidden` the split spans, so screen readers read one string.

**Above-the-fold hero**: animate with pure CSS keyframes from first paint (per-char `animation-delay` via CSS variables) instead of JS, so hydration can't restart it and LCP isn't delayed.

**Load order**: copy first, imagery second. Eyebrow → headline → lead (+0.3s) → buttons (+0.4s) → visual (+0.2–0.5s).

Never nest an independently-triggered TextReveal inside an animated MotionReveal wrapper: the wrapper's opacity hides the heading's own entrance and they fight.

## 3. The no-flash pattern

Server-rendered pages show content before JS runs. If reveal-hidden state is applied only after hydration, users see text → it vanishes → it animates back in. Fix:

1. An inline script in `<head>` adds a class before first paint: `document.documentElement.classList.add('js')` (see `assets/react/head-script.html`).
2. CSS hides reveal targets only under that class until revealed:
   ```css
   .js .motion-reveal:not([data-revealed]) { opacity: 0; transform: translateY(20px); }
   .js .text-reveal:not(.text-reveal-on-load):not([data-revealed]) [data-char] { opacity: 0; }
   ```
3. Without JS, or with reduced motion, content is simply visible.

## 4. Scroll-linked motion

Use sparingly, for one or two signature moments per page:

- **Device settle**: hero MacBook scales 0.92 → 1 and the lid rotates 12° → 0° as it scrolls into place (`useScroll({ target, offset: ["start end", "start 15%"] })` → `useSpring` → `useTransform`).
- **Reading progress**: a 1px pastel hairline along the nav's bottom edge, `scaleX` bound to smoothed `scrollYProgress`.
- **Pinned scrub**: a section pins (`position: sticky`) while a sequence advances with scroll — Apple scrubs video frames; on the web, prefer swapping screenshots or transforming layers over scrubbing video (video seeking is janky on many browsers).
- **Statement / zoom reveal**: a large phrase whose words brighten from grey to ink as the reader scrolls through.

Only animate `transform`, `opacity` and (briefly) `filter`. Never animate `width`, `top`, `box-shadow` per frame on large elements.

## 5. Gestures (see `assets/react/SnapRail.tsx`)

- **1:1 tracking**: while dragging, the content moves exactly with the pointer. No easing during drag.
- **Rubber-band** at the ends: `dragElastic ≈ 0.18`.
- **Flick projection**: where would momentum carry it? `projected = (v/1000) * d / (1 - d)` with deceleration `d = 0.998`. Snap to the card nearest the projected point; if that's the current card but velocity > 350px/s, advance one.
- Land with the release velocity (`springs.flick` if |v| > 300, else `springs.surface`).
- `touch-action: pan-y` so vertical page scroll still works on touch.
- Trackpad horizontal swipe: listen to `wheel` with `|deltaX| > |deltaY|`, follow directly, snap 120ms after the last event.
- Keyboard: arrow keys move one card; the rail is a focusable `role="region" aria-roledescription="carousel"`.
- Suppress click on cards after a drag (capture-phase click handler).

## 6. Hover and press

- Cards: tilt toward the mouse (≤ 8° total, springs above), lift −3px, and an edge glow that follows the cursor (radial gradient at `--mx/--my`, masked to a 1.5px border). **Mouse only** — ignore touch pointers so scrolling never wobbles cards.
- Buttons: colour change 300ms; `:active { transform: scale(.96) }` with 100ms duration; primary gets a soft shadow on hover.
- Nav links: 1px underline grows from left on hover (`scaleX` with origin swap), stays under the current page.
- Logo: rotate 8° on hover with the soft curve.

## 7. Loops and battery

Anything that loops (aurora glow, marquee, spinning conic border, gradient wordmark, autoplay gallery, video) must pause when offscreen and when the tab is hidden. Use `useOnScreen` (IntersectionObserver + `visibilitychange`) to set `data-animating="true"`, and CSS `animation-play-state: paused` by default. A global rule `[data-paused="true"] * { animation-play-state: paused !important }` lets one wrapper pause a whole scene.

Autoplay galleries (Apple's "Get the highlights"): advance every ~6s, show a progress dot that stretches into a filling bar, provide a visible pause button, stop autoplay forever once the user interacts.

## 8. Reduced motion

With `prefers-reduced-motion: reduce`:
- Reveals resolve to visible instantly (never leave anything at opacity 0).
- Springs become `x.set(target)` jumps; drag still works.
- Loops stop at a pleasing static frame; videos don't autoplay (show controls instead).
- Scroll progress line and parallax are removed.
- Global safety net: `*, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }`

Read the preference with a hydration-safe hook (`useSyncExternalStore` with server snapshot `false`) so SSR and client markup match.

## 9. Anti-patterns (seen, removed)

- WebGL/particle backgrounds and heavy aurora shaders → replaced with three CSS radial gradients drifting over 24–33s.
- SVG turbulence/displacement filters for a "hand-drawn" look → jittery on scroll; removed.
- Letter-by-letter reveals on every paragraph → reserve for headings only.
- Bouncy entrances on page load, parallax on everything, cursor trails, scroll hijacking, smooth-scroll libraries that override native momentum.
- Fixed-duration tweens on draggable things (they ignore the user's velocity and feel dead).
