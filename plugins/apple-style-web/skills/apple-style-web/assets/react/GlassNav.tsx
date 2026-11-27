import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useReducedMotionPreference as useReducedMotion } from "./useReducedMotion";

type NavLink = { href: string; label: string };

/**
 * Global bar. At the top of the page it is a full-width 52px translucent material;
 * once the reader scrolls it eases into a floating glass pill, then back.
 * A faint pastel reading-progress hairline runs along its bottom edge.
 * Styles: .site-header, .bar, .bar-inner, .bar-links, .bar-progress, .nav-link,
 * .bar-toggle, .mobile-menu in tokens.css. Swap <a> for your router's Link if needed.
 */
export function GlassNav({
  brand,
  logoSrc,
  links,
  cta,
  currentPath,
}: {
  brand: string;
  logoSrc?: string;
  links: NavLink[];
  cta: NavLink;
  currentPath?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  const float = scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, focus first link, trap Tab, Escape closes, close on desktop resize.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      headerRef.current?.querySelector<HTMLElement>("#mobile-navigation a")?.focus(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        headerRef.current?.querySelectorAll<HTMLElement>("a[href],button") ?? [],
      ).filter((el) => el.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const spring = (delay: number) =>
    reduced ? { duration: 0 } : { type: "spring" as const, bounce: 0, duration: 0.5, delay };

  return (
    <header ref={headerRef} className="site-header">
      <div className="bar" data-float={float}>
        <nav aria-label="Main" className="bar-inner">
          <a href="/" className="bar-brand" onClick={() => setOpen(false)}>
            {logoSrc && <img src={logoSrc} alt="" width={24} height={24} />}
            {brand}
          </a>
          <ul className="bar-links">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-link"
                  aria-current={currentPath === l.href ? "page" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href={cta.href} className="btn btn-primary btn-sm">
              {cta.label}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="bar-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </div>
        </nav>
        {!reduced && (
          <motion.span aria-hidden className="bar-progress" style={{ scaleX: progress }} />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile"
            className="mobile-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[{ href: "/", label: "Home" }, ...links].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring(0.04 * i + 0.05)}
                >
                  <a href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring(0.32)}
              style={{ marginTop: 32 }}
            >
              <a href={cta.href} className="btn btn-primary" onClick={() => setOpen(false)}>
                {cta.label}
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
