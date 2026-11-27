# Design tokens

Measured from apple.com's computed styles (1024px viewport) and refined in production on KelperZone. `assets/react/tokens.css` implements all of this as plain CSS custom properties; this file explains the *why* so you can adapt without breaking it.

## Contents
1. Colour
2. Typography
3. Spacing and layout
4. Radii
5. Materials (glass) and shadows
6. Easing
7. Tailwind v4 mapping

## 1. Colour

Counted on one Apple product page: white used 91×, `#f5f5f7` 41×, `#1d1d1f` 32×, action blue 4×. Colour is rationed so imagery wins.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Main canvas, cards on grey |
| `--surface` | `#f5f5f7` | Alternate bands, nav fill, footer |
| `--ink` | `#1d1d1f` | Headlines, body emphasis, primary buttons, dark tiles |
| `--ink-2` | `#6e6e73` | Paragraphs, captions (5.1:1 on white — AA) |
| `--ink-3` | `#86868b` | Dimmed half of two-tone headings, legal (large text only — 3.6:1) |
| `--hairline` | `#d2d2d7` / `rgb(0 0 0 / 8%)` | Dividers, card borders, glass ring |
| `--accent` | brand colour (KelperZone `#2f6db5`) | Links, focus ring, one highlight per view |
| `--black` | `#000000` | Optional single cinematic section |

Primary buttons are **near-black ink**, not the accent. That's the KelperZone choice and it reads more premium than coloured buttons; the accent stays for links and focus. If a brand insists on coloured buttons, use the accent for the filled button and keep everything else grey.

Soft pastels for light only (aurora glow, gradient wordmark, progress hairline): `#a0c4ff` (sky), `#d6baff` (lilac), `#ffd6ba` (peach), `#9fd3b8` (mint). Use them at 30–45% opacity in radial gradients, never as solid section fills.

Picking the accent: test it on white and on `#1d1d1f`; it must reach 4.5:1 on white for link text. Desaturated mid-blues, teals, deep greens and warm oranges (`#bf4800`) all work. Avoid pure saturated primaries.

## 2. Typography

Font stack (no webfont licensing issues; SF Pro appears on Apple devices automatically):

```css
--font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif;
--font-text:    -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Helvetica Neue", Arial, sans-serif;
--font-mono:    ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

Load Inter **non-blocking** (it's only a fallback): inject the Google Fonts stylesheet from an inline script or use `media="print" onload="this.media='all'"`. Body gets `-webkit-font-smoothing: antialiased` and `letter-spacing: -0.022em`.

Scale (size / line-height · weight · tracking), measured:

| Role | Size | Notes |
|---|---|---|
| Hero | 80/84 · 600 · −1.2px | Use `clamp(2.75rem, 8.4vw, 6rem)`, line-height 1.03, tracking −0.025em |
| Display section | 64/68 · 600 | `clamp(3rem, 9vw, 6.5rem)` for a statement section |
| Section head | 48–56 / 52–60 · 600 | `clamp(2rem, 5.4vw, 3.5rem)`, line-height 1.07, tracking −0.012em |
| Tile head | 32/36 · 600 · +0.064px | Card titles in bento grids |
| Shelf head (two-tone) | 28/32 · 600 | Rails and store shelves |
| Lead / subhead | 21–24 / 1.3 · 400 · +0.008em | `clamp(1.1875rem, 2.2vw, 1.5rem)`, grey with bold black key phrase |
| Eyebrow | 19 · 600 · +0.012em | Grey, sits ~8px above a heading |
| Body | 17/25 · 400 · −0.374px | Also button text |
| Small | 14/20 · 400 · −0.224px | Card copy, ribbons |
| Micro | 12/16 · 400 · −0.12px | Nav links, footer, legal |

Rules: tracking is negative on small text and on huge text, near zero around 19–24px. Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs. Gradient-filled text (`background-clip: text`) only on a hero word or a wordmark — give it `padding-bottom: 0.06em` so descenders aren't clipped.

Article bodies: system UI font, 17px, line-height 1.8, max-width ~42rem.

## 3. Spacing and layout

| Token | Value |
|---|---|
| Page container | `width: calc(100% - var(--gutter) * 2); max-width: 78rem; margin-inline: auto` |
| Gutter | `clamp(1.25rem, 4vw, 3rem)` |
| Text column | ~980px max (≈ 61rem); lead paragraphs ~34em |
| Section padding | 128px desktop · 80 tablet · 64 phone → `clamp(4rem, 10vw, 8rem)` |
| Tile gap | 12px (Apple homepage) – 20px (cards with shadows) |
| Eyebrow → heading | ~8–10px |
| Heading → lead | 16–20px |
| Lead → buttons | 24–32px |
| Button gap | 12–16px |
| Anchor offset | `[id] { scroll-margin-top: 7rem }` so the fixed nav doesn't cover targets |

One container for everything page-level (hero, sections, nav inner, footer) so edges line up. Rails may bleed to the viewport edge but their first card aligns with the container: `padding-inline: max(var(--gutter), calc((100vw - 78rem) / 2))`.

## 4. Radii

Cards/galleries 28px (119 uses on Apple's page) · large panels 36px · floating local nav 18px · floating global pill 26px · small tiles/media 12px · buttons and pills `9999px`. KelperZone uses a 16px base (`--radius: 1rem`) and derives sm/md/lg/xl from it for UI; marketing cards still go to 24–28px.

## 5. Materials and shadows

Three glass recipes, nothing else. `saturate(180%)` is the secret — it keeps colours behind the glass vivid instead of muddy grey.

| Material | Recipe |
|---|---|
| Global nav | `background: rgb(245 245 247 / 80%); backdrop-filter: saturate(180%) blur(20px)` |
| Floating pill / light glass | `background: rgb(255 255 255 / 72–84%); backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 0 0 1px rgb(0 0 0 / 7%), 0 14px 40px -14px rgb(0 0 0 / 28%)` |
| Dark glass (controls over media) | `background: rgb(22 22 23 / 72%); backdrop-filter: saturate(180%) blur(20px)` |

On screens under 768px, swap glass for `rgb(255 255 255 / 94%)` with no backdrop filter: blur is expensive on phones and invisible at that opacity anyway.

Shadows: `--shadow-soft: 0 4px 12px rgb(0 0 0 / 8%)` (cards), `--shadow-deep: 0 24px 60px -12px rgb(0 0 0 / 18%)` (hero device, open modal). Card hover: scale ≈1.015 + deepen shadow over 300ms.

Optional texture: a 0.35-opacity SVG fractal-noise "paper grain" pseudo-element on large light bands removes banding in big gradients.

## 6. Easing

| Name | Curve | Use |
|---|---|---|
| Apple signature | `cubic-bezier(.28,.11,.32,1)` | Page-level transitions, scroll-linked reveals |
| Soft out | `cubic-bezier(.22,1,.36,1)` | Entrances, underline grows, hover lifts |
| UI hover | `cubic-bezier(0,0,.5,1)` · 300ms | Card lift, colour fades |
| Bar morph | `cubic-bezier(.32,.72,0,1)` · 750ms | Nav bar ↔ floating pill |
| Standard in-out | `cubic-bezier(.4,0,.6,1)` | Rare: looping, symmetric moves |
| Pop (small UI only) | `cubic-bezier(.34,1.56,.64,1)` | Toggle icons, slider thumbs |

Button colour changes: 100–250ms. Press: `transform: scale(.96)` with a 100ms duration on `:active`.

## 7. Tailwind v4 mapping

If the project uses Tailwind v4, import `tokens.css` and expose the variables:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-background: var(--bg);
  --color-surface: var(--surface);
  --color-foreground: var(--ink);
  --color-muted-foreground: var(--ink-2);
  --color-subtle: var(--ink-3);
  --color-accent: var(--accent);
  --color-border: var(--hairline);
  --font-display: var(--font-display);
  --font-sans: var(--font-text);
  --container-page: 78rem;
  --ease-apple: cubic-bezier(.28,.11,.32,1);
  --ease-soft: cubic-bezier(.22,1,.36,1);
}
```

Then `text-muted-foreground`, `bg-surface`, `ease-soft`, `max-w-page` etc. work as utilities.
