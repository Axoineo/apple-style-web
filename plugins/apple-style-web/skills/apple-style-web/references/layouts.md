# Page anatomy and section recipes

Every page is a vertical stack of bands. Each band = **one idea**: eyebrow (optional) → headline → one line → one visual → up to two actions. Bands alternate white and `#f5f5f7` (or sit on white separated by space alone). The same order every time is what makes the site feel engineered.

## Contents
1. Global chrome
2. Homepage
3. Service / product page
4. Work / case study
5. Pricing
6. About
7. Article / blog
8. Contact
9. Section recipe catalogue

## 1. Global chrome (every route, identical)

- **Navbar**: fixed, 52px, translucent `#f5f5f7` at 80% with blur. Logo + wordmark left, 4–6 text links (12–14px) centre/right, one small pill CTA ("Start a project"). After 24px of scroll it eases into a floating glass pill (max 1000px wide, 10px from top, radius 26px). A faint pastel scroll-progress hairline runs along its bottom. Mobile: two-line hamburger morphing to ×, full-screen frosted menu with large 32px links that stagger in, focus trap, Escape closes, body scroll locked.
- **Optional promo ribbon** above the hero: one line, one link ("Websites from $30. Get a quote ›"), drops in over 800ms.
- **Sticky local nav** on long service/product pages: sits under the global bar (top ≈ 72px), product name left, section anchors, "Get a quote" pill right. White 80% glass, radius 18px.
- **Footer**: `#f5f5f7`, 12px grey text, a link directory in 4 columns (Services · Company · Contact · Follow), a hairline, then copyright and legal links. No promotional block in the footer.

## 2. Homepage (~6–10 bands; fewer is better)

1. **Hero** — eyebrow, huge two-tone headline (2–6 words), one-line lead with a bold key phrase, primary + ghost button, then the visual: a product/work showreel inside a device frame (MacBook on desktop, phone frame below 768px — both in server HTML, CSS picks one so nothing shifts). Soft aurora glow behind. As the device scrolls up it settles from a 12° lid tilt to upright.
2. **Brand moment** — the wordmark huge (`clamp(52px, 15vw, 240px)`), filled with a slow-moving pastel gradient, scaling 0.86 → 1 and tightening its tracking as it scrolls in. Tagline below in grey.
3. **Highlights** — autoplay card gallery ("Get the highlights"): 4–6 cards with screenshot + one sentence, progress-dot controls in a glass pill, pause button.
4. **Statement** — one large sentence whose words brighten from grey to ink as you scroll through it.
5. **Services / features** — bento grid: two large tiles then smaller ones, 12px gaps, each tile = icon or mini-scene, title, one line, price chip, "Learn more ›". Tilt + edge glow on hover.
6. **Process / how it works** — 3–5 numbered steps; optionally a pinned section where a visual changes per step.
7. **Work rail** — store-style horizontal rail of case-study cards (screenshot, client, one-line result), draggable with flick, ‹ › buttons.
8. **Pricing tiers** — 3 cards, middle one featured with a slow spinning conic border and a "Most popular" badge.
9. **FAQ** — two-tone heading + accordion (6–8 questions), emits FAQPage JSON-LD.
10. **Closing CTA / contact** — big two-tone line ("Have a project? Let's talk.") + primary button or an inline inquiry form.

Variation: one dark (`#000`/`#1d1d1f`) cinematic band is allowed per page for drama; everything else stays light.

## 3. Service / product page

Floating local nav → **Hero** (PageHero: breadcrumb, eyebrow, two-tone title, lead, actions, device screenshot aside) → **Highlights** (3–4 benefit cards) → **Story chapters** (eyebrow → big head → media → grey copy with bold lead-ins, alternating sides) → **Feature tabs** (segmented control swapping the visual above it) → **What's included / compare** table → **Process steps** → **Pricing estimator** (Apple-style range slider) → **FAQ** → **Closing CTA**.

Keep service copy in a data file (one object per service) and render all service pages with one shared `ServicePage` component — never duplicate a layout per service.

## 4. Work / case study

Index: two-tone heading + filterable grid of screenshot cards (16:10 media, 12px radius media inside 28px card). Detail: hero with project name, one-line outcome, stack tags; full-bleed screenshot in a MacBook frame; 3 short chapters (Challenge · Approach · Result) with bold lead-ins; metrics row (big numbers, small grey labels); next-project link.

## 5. Pricing

Two-tone hero ("Clear prices. No agency markup.") → 3 tier cards (name, price with small "from", one-line who-it's-for, 5–7 check items, button) → compare table with sticky header and checkmarks → estimator (slider for pages, toggles for add-ons, live total animating with a spring) → FAQ → CTA.

## 6. About

Editorial hero (large serif-free title, short paragraph) → principles as a numbered list or 2-up cards → story with one photo or screenshot → tools/stack row → no page-level "start a project" promo (the nav CTA already covers it).

## 7. Article / blog

Index: editorial cover cards (title, category eyebrow, date, reading time) — first post as a large featured card. Article: centred narrow column (~42rem), breadcrumb, category, title (2.25 → 5rem fluid), meta row, cover, body in a reading style (17px, line-height 1.8, generous paragraph spacing, h2 1.7rem), table of contents on wide screens, related posts, Article + BreadcrumbList JSON-LD.

## 8. Contact

Two-column: left is two-tone heading, response promise ("Replies within one business day"), email/WhatsApp links; right is the form in a white card (name, email, project type as segmented pills, budget as pills, message). Large 44px+ touch targets, inline validation, success state that replaces the form with a calm confirmation. Send email server-side only (API keys never reach the browser) and rate-limit / honeypot the endpoint.

## 9. Section recipe catalogue

Use these as building blocks; each is one band.

| Recipe | Structure | Motion |
|---|---|---|
| Two-tone heading | Eyebrow + `Sentence one.` black + `Sentence two.` grey (`dimFrom` word index) | TextReveal on enter |
| Device hero | Copy column + MacBook/phone frame with screenshot or muted loop | CSS entrance on load; scroll-settle tilt |
| Bento | 6-col grid; tiles span 3/3 then 2/2/2; 12px gap; 28px radius | Staggered MotionReveal, Tilt on hover |
| Card rail | Full-bleed track aligned to container, 300–400px cards, ‹ › buttons bottom-right | SnapRail drag/flick |
| Autoplay gallery | Card rail + glass pill with progress dots + pause | Advances every 6s while on screen |
| Statement | One sentence, display size, centred | Word-by-word grey→ink on scroll |
| Feature tabs | Segmented control (selected pill = solid ink, white text) above a media stage | Crossfade media with `springs.ui`; pill slides with `layoutId` + `springs.pill` |
| Story chapter | Eyebrow → head → media → grey paragraph with bold lead-in | MotionReveal |
| Metrics row | 3–4 big numbers (48–64px, 600) + grey labels | Count up once on enter (respect reduced motion) |
| Compare table | Sticky header row, ✓ in ink, — in grey, featured column tinted `#f5f5f7` | None |
| Accordion FAQ | Hairline-separated rows, + rotates to × | Height animates with `springs.ui` |
| Process steps | Numbered circles connected by a hairline; one sentence each | Line draws as you scroll |
| Closing CTA | Two-tone big line + one primary button, aurora glow | TextReveal |
| Marquee of logos/tech | Greyscale, 40s linear loop, edge fade masks | Paused offscreen |
