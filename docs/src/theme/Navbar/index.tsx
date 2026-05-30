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

const PRODUCT: Item[] = [
  {label: 'On-Model Imagery', href: '/features/on-model'},
  {label: 'Virtual Try-On', href: '/features/try-on'},
  {label: 'Editing & Background', href: '/features/editing'},
  {label: 'Ad Creative', href: '/features/ad-creative'},
  {label: 'Enterprise API', href: '/features/enterprise-api'},
];

// Mirrors mainNav in the Next app (Platform → Docs).
const MAIN: Item[] = [
  {label: 'Docs', href: '/docs/intro'},
  {label: 'Solutions', href: '/solutions'},
  {label: 'Use cases', href: '/use-cases'},
  {label: 'Developers', href: '/developers'},
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
  const [productOpen, setProductOpen] = React.useState(false);

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

          {/* Desktop nav */}
          <nav className={styles.nav}>
            <div
              className={styles.productWrap}
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}>
              <button className={styles.navBtn} aria-expanded={productOpen}>
                Product
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={productOpen ? styles.chevUp : styles.chev}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {productOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownCard}>
                    {PRODUCT.map((p) => (
                      <a key={p.href} href={p.href} className={styles.dropdownItem}>
                        <span className={styles.dot} />
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {MAIN.map((item) => (
              <NavLink key={item.href} item={item} className={styles.navLink} />
            ))}
          </nav>

          {/* CTAs */}
          <div className={styles.cta}>
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
