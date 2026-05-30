import React, {type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';

import styles from './styles.module.css';

// A faithful rebuild of the marketing site's floating "pill" header so the main menu
// is identical across home, /app, auth, and the docs. Because the docs are proxied
// under the same origin as the Next app (localhost:3000/docs), marketing paths like
// "/pricing" resolve to the Next marketing pages.
//
// Mobile behaviour matches what each page needs:
//   • Landing (/docs)  → a home-style dropdown card (no page sidebar to show).
//   • Doc pages (/docs/*) → the Docusaurus drawer, which hosts the page sidebar.

type Item = {label: string; href: string};

// Mirrors mainNav in the Next app.
const MAIN: Item[] = [
  {label: 'Docs', href: '/docs'},
  {label: 'Pricing', href: '/pricing'},
];

export default function Navbar(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const mobileSidebar = useNavbarMobileSidebar();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // The docs landing page is served at the baseUrl root; doc pages have a sidebar.
  const base = siteConfig.baseUrl.replace(/\/$/, ''); // e.g. "/docs"
  const isLanding = location.pathname.replace(/\/$/, '') === base;

  // Close the dropdown whenever we navigate.
  React.useEffect(() => setMenuOpen(false), [location.pathname]);

  const close = () => setMenuOpen(false);
  const mobileOpen = isLanding ? menuOpen : mobileSidebar.shown;
  const onBurger = () => (isLanding ? setMenuOpen((v) => !v) : mobileSidebar.toggle());

  return (
    // Keep the `navbar` class — Docusaurus's TOC-highlight hook measures
    // `.navbar`.clientHeight; without it, scroll pages (e.g. quickstart) crash.
    <header
      className={`navbar ${styles.wrap}${
        !isLanding && mobileSidebar.shown ? ' navbar-sidebar--show' : ''
      }`}
    >
      <div className={styles.inner}>
        <div className={styles.pill}>
          {/* Logo — identical sail mark + wordmark to the marketing SiteHeader. */}
          <a href="/" className={styles.logo} aria-label="Vela home">
            <svg viewBox="0 0 32 32" className={styles.logoMark} aria-hidden="true">
              <defs>
                <linearGradient id="velaMark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f0f0ee" />
                  <stop offset="0.5" stopColor="#111317" />
                  <stop offset="1" stopColor="#4a4d55" />
                </linearGradient>
              </defs>
              <path
                d="M16 2 L28 26 A14 14 0 0 1 4 26 Z"
                fill="none"
                stroke="url(#velaMark)"
                strokeWidth="1.6"
                opacity="0.55"
              />
              <path d="M16 5 L25 24 L16 20 Z" fill="url(#velaMark)" />
            </svg>
            <span className={styles.logoWord}>Vela</span>
          </a>

          {/* Nav + CTAs, grouped on the right */}
          <div className={styles.cta}>
            <nav className={styles.nav}>
              {MAIN.map((item) => (
                <a key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="/sign-in" className={styles.signin}>
              Sign in
            </a>
            <a href="/sign-up" className={styles.tryBtn}>
              Try the API
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Mobile burger: landing → dropdown card, doc pages → Docusaurus drawer. */}
          <button className={styles.burger} aria-label="Toggle menu" onClick={onBurger}>
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Landing-page mobile menu: a home-style dropdown card. */}
        {isLanding && menuOpen ? (
          <div className={styles.mobileMenu}>
            {MAIN.map((item) => (
              <a key={item.href} href={item.href} onClick={close} className={styles.mobileItem}>
                {item.label}
              </a>
            ))}
            <div className={styles.mobileDivider} />
            <a href="/sign-in" onClick={close} className={styles.mobileItem}>
              Sign in
            </a>
            <a href="/sign-up" onClick={close} className={styles.mobileTryBtn}>
              Try the API
            </a>
          </div>
        ) : null}
      </div>

      {/* Doc pages keep the Docusaurus drawer (it hosts the page sidebar). */}
      {!isLanding ? (
        <>
          <div
            role="presentation"
            className="navbar-sidebar__backdrop"
            onClick={() => mobileSidebar.toggle()}
          />
          <NavbarMobileSidebar />
        </>
      ) : null}
    </header>
  );
}
