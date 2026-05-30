import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';

import styles from './styles.module.css';

// A faithful rebuild of the marketing site's floating "pill" header so the main menu
// is identical across home, /app, auth, and the docs. Because the docs are proxied
// under the same origin as the Next app (localhost:3000/docs), marketing paths like
// "/pricing" resolve to the Next marketing pages; "/docs/*" stays in the docs app.

type Item = {label: string; href: string; external?: boolean};

// Mirrors mainNav in the Next app.
const MAIN: Item[] = [
  {label: 'Docs', href: '/docs'},
  {label: 'Pricing', href: '/pricing'},
];

function NavLink({item, className}: {item: Item; className?: string}) {
  // /docs/* are in-app (client routing); everything else is a marketing page on Next.
  if (item.href.startsWith('/docs')) {
    return (
      <Link to={item.href} className={className}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className}>
      {item.label}
    </a>
  );
}

export default function Navbar(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    // Keep the `navbar` class — Docusaurus's TOC-highlight hook measures
    // `.navbar`.clientHeight; without it, scroll pages (e.g. quickstart) crash.
    <header className={`navbar ${styles.wrap}`}>
      <div className={styles.inner}>
        <div className={styles.pill}>
          {/* Logo — matches the marketing wordmark */}
          <a href="/" className={styles.logo} aria-label="Vela home">
            <span className={styles.logoMark}>V</span>
            <span className={styles.logoWord}>Vela</span>
          </a>

          {/* Nav + CTAs, grouped on the right */}
          <div className={styles.cta}>
            <nav className={styles.nav}>
              {MAIN.map((item) => (
                <NavLink key={item.href} item={item} className={styles.navLink} />
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

          {/* Mobile: toggle the docs sidebar */}
          <button
            className={styles.burger}
            aria-label="Toggle menu"
            onClick={() => mobileSidebar.toggle()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {/* Keep Docusaurus's mobile drawer (holds the docs sidebar on small screens). */}
      <NavbarMobileSidebar />
    </header>
  );
}
