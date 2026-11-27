# Component kit

Small kit, reused everywhere. Ready-made React files are in `assets/react/`; the vanilla versions are in `assets/html/starter.html`. Class names below refer to `tokens.css`.

## Buttons

| Kind | Look | Class |
|---|---|---|
| Primary | Ink pill, white 17px text, min-height 44px, padding 0 22px | `.btn .btn-primary` |
| Ghost | Transparent pill, 1px `rgb(0 0 0 / 20%)` border, ink text | `.btn .btn-ghost` |
| Text link | Accent colour, `›` chevron that nudges 4px right on hover | `.link-chevron` |
| Small nav CTA | Ink pill, 14px, min-height 32px | `.btn .btn-primary .btn-sm` |

All: `transition: background-color .3s, box-shadow .3s, transform .3s; :active { transform: scale(.96); transition-duration: .1s }`. Primary hover: `#000` + `0 10px 24px -8px rgb(0 0 0 / 35%)`. Never more than two buttons side by side.

## Headings

```tsx
<p className="eyebrow">Pricing</p>
<TextReveal as="h2" className="h-section" text="Clear prices. No agency markup." dimFrom={2} />
```
`dimFrom` = index of the first grey word. Lead paragraphs use `.lead` (grey, ~24px, `max-width: 34em`) with `<b>` for the black key phrase.

## Navbar (`GlassNav.tsx`)

Props: `brand`, `logoSrc?`, `links: {href,label}[]`, `cta: {href,label}`, `currentPath?`. Uses `.bar`, `.bar[data-float="true"]`, `.bar-inner`, `.bar-progress`, `.nav-link`. Renders plain `<a>` tags — swap for the router's `Link` component in an app with client routing.

## Cards

- **Surface card**: white, 28px radius, `box-shadow: 0 0 0 1px rgb(0 0 0 / 8%)` (a ring, not a border, so it never shifts layout), padding `clamp(24px, 3vw, 32px)`.
- **Store card**: 400×500-ish, media fills top, title + one line + price, `+` circle bottom-right that opens a detail modal.
- **Tilt card**: wrap any card in `<Tilt amount={5}>`; it adds `.edge-glow` and sets `--mx/--my`.
- **Featured card**: `.spin-border` (conic gradient ink → sky → lilac → peach, 6s spin) for exactly one card per page.
- Hover inside cards: icon rotates −3° and scales 1.05 over 700ms soft; chevron nudges right.

## Device frames

MacBook: a rounded dark bezel (radius ~2% of width) containing a 16:10 screen, then a thin aluminium base wider than the lid with a centred notch. Build it in CSS/SVG (no Apple product photos). Phone: rounded rectangle 9:19.5, 8–10px bezel, dynamic-island pill. Screens contain real screenshots (`object-fit: cover; object-position: top`) or muted `playsInline loop` video with a poster painted underneath so the screen is never a black slab while loading. Load the video only when on screen and only for the frame CSS is showing.

## Segmented control

Container: `#e8e8ed` at 72% + blur pill, padding 4px. Options: 14–17px text, padding 8px 18px. Selected: solid ink pill with white text, which slides between options (`motion` `layoutId` + `springs.pill`). `role="tablist"` / `role="tab"` / `aria-selected`, arrow keys move selection.

## Accordion

Rows separated by hairlines, question 19–21px 600, a `+` icon that rotates 45° to ×. Use `<details>/<summary>` or a button with `aria-expanded` + region. Animate height with a spring (or CSS `interpolate-size: allow-keywords` where supported); content fades up 8px.

## Range slider (estimator)

Track 6px tall, filled part in ink (`--fill` percentage gradient), unfilled `#e3e3e8`; thumb 28px white circle with layered soft shadow, scales to 1.15 while dragging with the pop curve. See `.range` in `tokens.css`. Show the running total in a large number that springs to new values.

## Icons

Clean duotone inline SVG: 2.4px rounded ink stroke, one pastel fill (`#2f6db5`, `#ffb27a`, `#9fd3b8`, `#d6baff`) on a shape behind. No filters, no hand-drawn wobble. 24px in UI, 56px in cards. Optionally "ink in" once on enter (stroke-dashoffset animation).

## Aurora backdrop

Three absolutely-positioned radial gradients (sky top-left, lilac top-right, peach centre), each 36–52vw, drifting with 24–33s alternate animations. `AuroraBackdrop.tsx` pauses it offscreen. Put it behind page heroes and the closing CTA only.

## Scrollbars

Thin (10px track, 4px visual thumb via transparent border + `background-clip: padding-box`), arrowless, transparent until scrolling; `ScrollActivity.tsx` adds `.is-scrolling` to whatever is scrolling for 900ms. Firefox fallback uses `scrollbar-width: thin`.

## Forms

Inputs 48px tall, 12px radius, `#f5f5f7` fill, no border until focus (2px accent ring, 3px offset). Labels above in 14px 600. Choice groups as pills. Errors in `#c42b1c` 14px under the field, announced with `aria-live="polite"`.
