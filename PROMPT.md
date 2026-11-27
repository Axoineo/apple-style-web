# Apple-style website prompt

Copy everything below the line, fill in the [brackets] and delete any lines you don't need. It works best with the `apple-style-web` skill installed, but it is detailed enough to work without it (Claude, Claude Code, Lovable, Cursor, v0, etc.).

---

Build me a premium marketing website in the style of apple.com: quiet white pages, huge tight headlines, one accent colour, frosted-glass navigation and smooth physics-based motion. If you have the `apple-style-web` skill, use it and follow its workflow.

## About the business
- Name: [Brand name]
- What we do, in one sentence: [e.g. "We design and build fast, beautifully animated websites for small businesses."]
- Who it's for: [ideal customer]
- Tagline (2–6 words): [e.g. "Websites that feel effortless."]
- Tone: confident, calm, short sentences, no hype words ("revolutionary", "cutting-edge", "unleash").
- Accent colour: [hex, e.g. #2f6db5]. Must pass 4.5:1 contrast on white for link text.
- Logo: [path/URL, or "use the wordmark only"]

## Pages
[Keep or remove] Home · Services (one shared template, a page per service) · Work / Case studies · Pricing · About · Blog · Contact.

Services (title · one line · starting price):
1. [Service] · [one line] · [from $X]
2. [Service] · [one line] · [from $X]
3. [Service] · [one line] · [from $X]

Pricing tiers (name · price · who it's for · 4–6 included items): [fill in, mark one as "Most popular"]

Work / proof (project · industry · one-line result · screenshot path): [fill in, or "make tasteful placeholder screenshots I can replace"]

FAQ (6–8 real questions with short answers): [fill in, or "draft them and mark as placeholder"]

Contact: [email] · [WhatsApp/phone] · response promise: [e.g. "Replies within one business day"]. The form sends email server-side only; API keys must never reach the browser. Add a honeypot field.

## Tech
- Stack: [React + Vite + Tailwind v4 + `motion`] / [Next.js App Router] / [plain HTML/CSS/JS, no build] / [use my existing project].
- Keep every piece of editable copy (nav, services, prices, FAQ, contact) in one data file, e.g. `src/lib/site.ts`. Components read from it and contain no copy.
- Server-render pages so the first paint is complete and styled.

## Design system (follow exactly)
- Colours: white `#ffffff` canvas, `#f5f5f7` alternate bands and footer, near-black `#1d1d1f` text and primary buttons, greys `#6e6e73` (body) and `#86868b` (dimmed heading half). The accent is only for links, focus rings and one highlight per view. Pastels (sky `#a0c4ff`, lilac `#d6baff`, peach `#ffd6ba`) only as soft background light, never as flat fills.
- Fonts: system stack `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif`; load Inter without blocking render. Do not embed SF Pro (it isn't licensed for the web).
- Type: hero `clamp(2.75rem, 8.4vw, 6rem)`, weight 600, line-height 1.03, tracking −0.025em. Section heads `clamp(2rem, 5.4vw, 3.5rem)`, line-height 1.07. Lead paragraphs ~24px grey with the key phrase in **bold near-black**. Eyebrow 19px 600 grey above headings. Body 17px. `text-wrap: balance` on headings.
- Two-tone headings: same size and weight, second sentence grey ("Clear prices. No agency markup.").
- Layout: one page container (max 78rem, gutter `clamp(1.25rem, 4vw, 3rem)`) for nav, sections and footer so all edges align. Section padding `clamp(4rem, 10vw, 8rem)`. Grid gaps 12–20px. Each section = one idea: eyebrow, headline, one line, one visual, at most two buttons.
- Radii: cards 28px, media 12px, buttons fully pill-shaped.
- Buttons: primary = near-black pill, white 17px text, 44px tall; secondary = outlined pill; tertiary = accent text link with a `›` chevron. Press state `scale(.96)`.
- Materials: frosted glass (`blur(20px) saturate(180%)`) only on the navbar, sticky sub-nav and floating controls, never on content. On phones use a near-opaque fill instead of blur.
- Shadows: soft and rare (`0 4px 12px rgb(0 0 0 / 8%)`); cards use a 1px ring `0 0 0 1px rgb(0 0 0 / 8%)`.
- Visuals: real product or project screenshots inside CSS-built MacBook and phone frames, or short muted looping screen recordings. No stock photos, no drawn people, no clip-art. Icons are clean duotone SVGs (2.4px rounded ink stroke + one pastel fill), no SVG filters.
- Don't use Apple's logo, product images, copy or icons.

## Navigation and footer
- Fixed 52px navbar: translucent `#f5f5f7` at 80% with blur. Logo + name left, 4–6 small links, one small "Start a project" pill. After 24px of scroll it eases (750ms, `cubic-bezier(.32,.72,0,1)`) into a floating glass pill (max 1000px wide, 10px from the top, radius 26px). A faint pastel 1px reading-progress line runs along its bottom.
- Mobile: two-line hamburger that morphs into ×, full-screen frosted menu with 32px links that stagger in, focus trap, Escape closes, page scroll locked.
- Footer: `#f5f5f7`, 12px grey, link directory in 4 columns, hairline, copyright and legal. No promo block.

## Homepage sections (in this order)
1. Hero: eyebrow, two-tone headline, one-line lead, primary and secondary button, then a MacBook frame (phone frame under 768px) showing [showreel video / screenshot] with a soft pastel glow behind. As it scrolls up, the device settles from a 12° tilt to upright and scales from 0.92 to 1.
2. Brand moment: the brand name huge (`clamp(52px, 15vw, 240px)`) filled with a slow-moving pastel gradient, growing into place on scroll, tagline below.
3. Services bento: 6-column grid, two large tiles then smaller ones, icon, title, one line, price chip, "Learn more ›". Cards tilt slightly toward the mouse and get a cursor-following edge glow (mouse only).
4. Statement: one large sentence whose words brighten from grey to black as you scroll through it.
5. Work rail: horizontal row of case-study cards you can drag. It follows the pointer 1:1, rubber-bands at the ends, flicks to the right card, and works with arrow keys, trackpad swipe and ‹ › buttons.
6. Pricing: 3 tier cards; the featured one has a slowly spinning conic-gradient border and a "Most popular" badge.
7. FAQ: two-tone heading and an accordion where the + rotates into ×. Also output FAQPage JSON-LD.
8. Closing CTA: "[Have a project? Let's talk.]" with a pastel glow and one primary button or the inquiry form.

## Inner pages
- Service page: sticky glass sub-nav (name, section links, "Get a quote") under the global bar → hero with breadcrumb and device screenshot → 3–4 benefit cards → story chapters (eyebrow → big head → media → grey copy with bold lead-ins) → segmented-control feature tabs → what's included table → process steps → price estimator with an Apple-style slider → FAQ → CTA. Every service renders from data through one shared template.
- Pricing: tiers, a compare table with sticky header, the estimator, FAQ.
- Work: filterable screenshot grid; case-study pages with Challenge · Approach · Result and a metrics row.
- About: editorial hero, principles, story, tools. No page-level "start a project" promo (the nav has it).
- Blog: editorial cards with a large featured first post; articles in a ~42rem reading column, 17px, line-height 1.8, table of contents on wide screens.
- Contact: two columns, heading and promise left, form card right. 48px inputs, pill choices for project type and budget, inline errors, calm success state.

## Motion rules
- Use springs set by bounce + duration for anything you can touch: default bounce 0 / 0.4s; large surfaces 0 / 0.55s; after a flick 0.2 / 0.45s; small pops 0.35 / 0.45s. Pass the gesture's release velocity into the spring.
- Every curve decelerates. Signature `cubic-bezier(.28,.11,.32,1)`; entrances `cubic-bezier(.22,1,.36,1)`.
- Sections fade up 20px with a 6px blur over 720ms, once, when they enter the viewport. Stagger siblings, capped at 0.35s.
- Headings reveal letter by letter (rise 0.3em, about 850ms) but blur per word. Never split a word across lines, don't clip descenders, and keep the full text in `aria-label`. The hero headline animates with pure CSS from first paint.
- No flash on load: an inline `<head>` script adds a `js` class before first paint, and reveal targets are hidden only under that class, so server HTML never shows content, hides it and animates it back in.
- Nothing loops unless it's on screen. Pause every loop (glow, gradient, marquee, video, autoplay gallery) when it's offscreen or the tab is hidden.
- With `prefers-reduced-motion`, everything is visible immediately: no autoplay, no parallax, no progress line.
- Only animate transform, opacity and short filters. No WebGL backgrounds, particles, cursor trails, scroll hijacking or bouncy page-load entrances.
- Scrollbars are thin, arrowless, and only show while scrolling.

## SEO and accessibility
- Every route gets a unique title (≤60 chars), meta description (≤155), a canonical link to [https://yourdomain.com], Open Graph and Twitter tags, and a 1200×630 OG image.
- JSON-LD: Organization + WebSite on the homepage, Service on service pages, Article + BreadcrumbList on posts, FAQPage wherever FAQs show. Add sitemap.xml and robots.txt.
- One h1 per page, logical heading order, a skip link, a visible 2px accent focus ring, 44px+ touch targets, body text contrast of at least 4.5:1, labelled form fields with announced errors.

## Performance
- Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices and SEO. CLS < 0.05.
- The LCP image gets `fetchpriority="high"` and explicit width/height. Everything below the fold is lazy-loaded, in AVIF/WebP with `srcset`.
- Videos use `muted playsInline preload="none"` with a poster painted underneath, and load only when visible.

## Done means
1. Open the site in a browser at 1440, 1024, 768 and 375px: no horizontal scroll, and all edges aligned.
2. Test with reduced motion turned on, with only the keyboard, and with a hard reload (no animation flash).
3. Run Lighthouse on mobile and fix anything under 90.
4. Then tell me what you built, what's placeholder that I need to replace, and what you couldn't verify.
