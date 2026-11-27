# Ship checklist

Run this in a real browser before calling the site done. Report anything you could not check.

## Look
- [ ] Only white / `#f5f5f7` / (one) black band; one accent colour; no stray hues in UI chrome.
- [ ] Headline sizes follow the scale; headings 600 weight, tight line-height, negative tracking; `text-wrap: balance`.
- [ ] Every section has one idea and ≤ 2 actions.
- [ ] Page container edges line up across nav, hero, sections and footer at 1440, 1024, 768, 375px.
- [ ] Radii consistent (cards 24–28, media 12, buttons pill).
- [ ] Glass only on chrome; no blurred content.
- [ ] No drawn people, stock clichés, or Apple-owned assets/fonts/copy.

## Motion
- [ ] Entrances play once, on enter, with decelerating curves; nothing bounces on load.
- [ ] No text flashes visible then re-animates after hydration (hard-reload with cache disabled and watch).
- [ ] Headline reveals never split a word across lines; descenders and gradient text aren't clipped.
- [ ] Drag rails track 1:1, rubber-band at ends, respond to flicks, work with keyboard and trackpad swipe.
- [ ] All loops (glow, marquee, video, autoplay gallery) pause offscreen and in hidden tabs.
- [ ] `prefers-reduced-motion: reduce` (emulate in DevTools): everything visible immediately, no autoplay, no parallax.

## Responsive (phone first)
- [ ] 375px: no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`), 16–20px side gutter.
- [ ] Touch targets ≥ 44px; mobile menu traps focus, Escape closes, body doesn't scroll behind it.
- [ ] Backdrop blur replaced by near-opaque fill below 768px; hover-only effects disabled for touch.
- [ ] Device frame swaps MacBook → phone without layout shift.

## Performance (Lighthouse mobile ≥ 90)
- [ ] Hero renders from server HTML with CSS only; LCP image has `fetchpriority="high"`, explicit width/height.
- [ ] Below-the-fold images `loading="lazy" decoding="async"`, modern formats (AVIF/WebP), sized `srcset`.
- [ ] Videos: `muted playsInline preload="none"`, poster first, load only when on screen.
- [ ] Fonts don't block render (system stack first, Inter loaded async).
- [ ] CLS < 0.05; no JS-dependent layout on first paint.
- [ ] Animate only transform/opacity/filter; no long tasks during scroll (check Performance panel).

## Accessibility
- [ ] One `h1` per page, logical heading order; split-text headings expose full text via `aria-label`.
- [ ] Body text contrast ≥ 4.5:1 (`#6e6e73` on white passes; `#86868b` only for large text).
- [ ] Visible focus ring (2px accent, 3px offset) on every interactive element; skip link to main.
- [ ] Carousels are focusable regions with arrow-key support and visible pause for autoplay.
- [ ] Forms have labels, error messages announced, success state focusable.

## SEO
- [ ] Each route: unique `<title>` (≤ 60 chars) and meta description (≤ 155), canonical URL, OG + Twitter tags, OG image 1200×630.
- [ ] JSON-LD: Organization + WebSite on home; Service on service pages; Article + BreadcrumbList on posts; FAQPage where FAQs render.
- [ ] `sitemap.xml` and `robots.txt` present; no duplicate canonicals.
- [ ] Real text in HTML (not images of text); descriptive alt on meaningful images, `alt=""` on decorative ones.

## Content hygiene
- [ ] All editable copy in one data file; components hold no copy.
- [ ] Secrets (email API keys etc.) only on the server.
- [ ] Placeholder copy/images listed for the user to replace.
