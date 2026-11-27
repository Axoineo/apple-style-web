---
name: apple-style-web
description: Design and build premium, white-first marketing websites in the style of apple.com and KelperZone — quiet canvases, huge tight headlines, one accent colour, frosted-glass navigation, spring physics, scroll-triggered reveals, draggable card rails and product-screenshot heroes. Use this skill whenever someone asks for an Apple-like, Apple-inspired, "premium", "clean and minimal", "high-end", "luxury tech", "SaaS landing page that feels like Apple", agency, portfolio, product or launch website, or wants to redesign/polish an existing site so it feels expensive, smooth and calm — even if they never say "Apple". Also use it when reviewing or fixing motion, glass navbars, typography scale, hero sections, or animation jank on such a site.
---

# Apple-style websites

Build sites that feel like apple.com: quiet pages, loud content. The product (screenshots, photos, video) is the colour; typography does the decorating; motion follows the reader and never shows off. This skill packages a measured design system (taken from apple.com's live CSS) and a production-tested implementation (the KelperZone redesign) so the result looks premium on the first try and stays fast, accessible and SEO-clean.

**Borrow the discipline, not the brand.** Never use Apple's logo, product images, copy, icons, or the SF Pro webfont (licensed for Apple platforms only). Use the system font stack, which shows SF Pro on Apple devices legally and falls back to Inter elsewhere. Give every site its own accent colour and its own words.

## Workflow

Work through these steps in order. Each step names the reference file to read; read it when you reach that step, not all up front.

**Reading budget.** The references are long, so read only what the job needs:
- *Single static page (HTML/CSS/JS):* start from `assets/html/starter.html` + `assets/react/tokens.css` — they already implement the components and motion. Read `layouts.md` §2 (homepage) and §9 (recipes) to plan sections, and `checklist.md` at the end. Skip `components.md`; open `motion.md` only for a motion pattern the starter lacks.
- *React app:* copy the files in `assets/react/` instead of rewriting them (don't re-read them line by line). Read `layouts.md` for the pages you're building and `checklist.md`. Open `motion.md` only when you write motion beyond the kit.
- *Redesigning an existing page:* read the original first, then `tokens.md` §1–2 and `checklist.md`; pull in other references only for the sections you rebuild.

### 1. Brief (2 minutes, don't skip)

Pin down before writing code. If the user didn't say, pick sensible defaults and state them in one line rather than interrogating them:

- **Brand**: name, one-line promise, accent colour (default a calm blue like `#2f6db5`; must hit 4.5:1 on white for text use).
- **Pages**: default set is Home, Services/Product, Work/Case studies, Pricing, About, Contact (+ Blog if they have content).
- **Proof**: real screenshots, product shots or short screen recordings. This style reads thin with stock imagery — if the user has no visuals, build device-framed screenshots of their product/UI, or tasteful CSS/SVG scenes; never drawn people or clip-art.
- **Stack**: if a project exists, use its stack. For new projects default to **React + Vite (or Next.js) + Tailwind v4 + `motion`** (the `motion` npm package, formerly Framer Motion). If they want zero build, use `assets/html/starter.html`.
- **Content**: keep all editable copy (nav links, services, prices, contact) in one data file (e.g. `src/lib/site.ts`) so components never hold copy.

### 2. Tokens → read `references/tokens.md`

Install the design tokens first: copy `assets/react/tokens.css` (plain CSS, framework-agnostic) into the project and import it globally. Swap `--accent` for the brand colour. Everything else (ink greys, canvas grey `#f5f5f7`, type scale, radii, glass recipes, easing) should stay as is unless the brand truly needs otherwise — the numbers are measured, and small deviations are what make copies look cheap.

### 3. Page structure → read `references/layouts.md`

Plan each page as a stack of sections where **each section holds one idea**: one headline, one line of copy, one visual, at most two actions. Use the page anatomies there (homepage, service/product page, pricing, about, article, contact). Cut ruthlessly: a homepage of ~6 strong sections beats 12 weak ones.

### 4. Components → read `references/components.md`

Build from the small kit: glass navbar that becomes a floating pill on scroll, pill buttons, eyebrow + two-tone heading, bento grid, store-style card rail, tilt cards with edge glow, segmented control, accordion FAQ, compare table, process steps, link-directory footer. Ready-made React versions are in `assets/react/` — copy the ones you need rather than rewriting them:

| File | What it is |
|---|---|
| `tokens.css` | All tokens + glass, buttons, reveals, nav bar, aurora glow, edge glow, scrollbars, reduced-motion |
| `springs.ts` | Spring presets (`ui`, `surface`, `flick`, `pill`, `pop`) and easing curves |
| `useReducedMotion.ts`, `useOnScreen.ts` | Hydration-safe reduced-motion hook; pause-offscreen hook |
| `TextReveal.tsx` | Whole-word-safe character reveal for headings, two-tone support |
| `MotionReveal.tsx` | Fade-up-and-focus entrance for sections |
| `GlassNav.tsx` | 52px translucent bar → floating glass pill, scroll progress hairline, accessible mobile menu |
| `SnapRail.tsx` | Draggable horizontal rail: 1:1 drag, rubber-band, flick projection, keyboard + trackpad |
| `Tilt.tsx` | Mouse-only 3D lean on springs + cursor-following edge glow |
| `AuroraBackdrop.tsx` | Soft pastel CSS glow behind heroes, paused offscreen |
| `ScrollActivity.tsx` | Overlay-style scrollbars that appear only while scrolling |
| `head-script.html` | Inline `<head>` snippet that prevents the "flash then re-animate" bug |

Components import each other with relative paths (`./springs`); adjust to the project's alias if it has one.

### 5. Motion → read `references/motion.md`

Motion is where most "Apple-like" attempts fail. The short version:

- **Springs, not durations**, for anything the user can touch or interrupt. Bounce 0 by default; overshoot only after a flick or for small pops.
- **Every curve decelerates**: fast to start, slow to settle. Signature curve `cubic-bezier(.28,.11,.32,1)`.
- Entrances: elements rise ~20px and fade in once when they enter the viewport. Headlines reveal per character but blur per *word*, and never split a word across lines.
- Nothing loops for decoration unless it is on screen; every loop pauses offscreen and in hidden tabs.
- `prefers-reduced-motion` gets instant, fully readable content — never hidden content.

### 6. Build

Build page by page, homepage first. Keep page-level layout on the shared container (`.page-container`: max 78rem with a fluid gutter) so nav, sections and footer edges align; reserve narrow reading widths (~42rem) for article bodies only. Give every route a unique `<title>`, meta description, canonical URL and Open Graph tags; emit JSON-LD (Organization, WebSite, Service, Article, FAQPage, BreadcrumbList) where relevant.

### 7. Verify → read `references/checklist.md`

Before calling it done, open the site in a browser and run the checklist: phone width (375px) with no horizontal scroll, reduced motion, keyboard-only navigation, no layout shift on load, no animation restarting on hydration, Lighthouse ≥ 90 on mobile for performance, accessibility and SEO. Fix what fails; report what you couldn't verify.

## Taste rules (the things that make or break it)

These are the judgment calls that separate "Apple-like" from "template with blur". Explain them to yourself before you break one.

1. **Colour is rationed.** Pages are white, `#f5f5f7`, or (rarely, for one cinematic section) black. Text is near-black `#1d1d1f` and greys. One accent, used for links, focus and maybe one highlight. Pastels only as soft light (aurora glow, gradient wordmark), never as flat section fills.
2. **Type does the decorating.** Headlines 600 weight, line-height 1.03–1.1, negative tracking that tightens as size grows. Two-tone headings: same size and weight, the second sentence in grey ("Clear prices. *No agency markup.*"). Body copy grey with the key phrase **bold near-black**, so a skimmer reading only bold still gets the point.
3. **Generous outside, tight inside.** Sections breathe (≈128px desktop / 80 tablet / 64 phone vertical padding) but tiles in a grid sit 12–20px apart so the grid reads as one object.
4. **Glass is for chrome only.** Frosted blur (`blur(20px) saturate(180%)`) on nav, sticky sub-nav, floating controls, overlays. Never blur content. On phones, replace backdrop blur with a near-opaque fill — it's cheaper and looks the same.
5. **Shadows are rare and soft.** `0 4px 12px rgb(0 0 0 / 8%)` for cards; one deep shadow for a hero device. No neon glows, no heavy drop shadows, no gradients on buttons.
6. **Radii are consistent.** Cards 28px (or 16–24 for small cards), media 12px, floating nav 18–26px, buttons fully pill-shaped.
7. **Real visuals over illustration.** Hero visuals are product screenshots in device frames, short muted looping screen recordings, or a gradient wordmark. No drawn people, no stock-photo handshakes. Icons are clean duotone SVGs without filters.
8. **Copy is short and confident.** Headlines of 2–6 words, often two short sentences. One supporting line. Buttons say what happens ("Start a project", "See pricing"), with a chevron link (`Learn more ›`) as the tertiary action.
9. **One idea per screen.** If a section needs three paragraphs, it is two sections or a card that opens a detail view.
10. **Performance is part of the look.** A janky blur or a 4MB hero kills the premium feel faster than any colour choice. Lazy-load below-the-fold media, give images width/height, keep the first paint server-rendered and fully styled.

## When improving an existing site

Don't rewrite everything. Audit against the taste rules and `references/checklist.md`, list the top issues (usually: too many colours, weak type scale, decorative motion, inconsistent container widths, heavy effects), then fix in that order: tokens → type → layout rhythm → motion → performance. Preserve the project's stack, routing and content structure.

## Output expectations

When you finish, tell the user in plain words: what pages and sections exist, which accent and fonts you used, what's placeholder (copy, images) that they should replace, and what you verified in a browser versus what you didn't.
