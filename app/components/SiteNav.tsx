'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import styles from './SiteNav.module.css'

const NAV_LINKS = [
  { label: 'How It Works',      href: '/#how-it-works'  },
  { label: 'Experiences',       href: '/experiences'    },
  { label: 'Marketplace',       href: '/marketplace'    },
  { label: 'For Businesses',    href: '/pathway-sites'  },
  { label: 'Safety',            href: '/safety'         },
  { label: 'About',             href: '/about'          },
]

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>

        <div className={styles.navLogo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wwk-transparent.png" alt="WealthWise KIDS® Real-World Pathways™" className={styles.navLogoImg} />
          <span className={styles.navLogoSub}>Connecting Learning<br />to Real-World Opportunity</span>
        </div>

        <nav className={styles.navLinks} aria-label="Main navigation">
          {NAV_LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              className={`${styles.navLink} ${pathname === l.href ? styles.navLinkActive : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.navActions}>
          <Link href="/login"    className={styles.btnLogin}>Log In</Link>
          <Link href="/register" className={styles.btnSignup}>Sign Up</Link>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className={styles.mobileActions}>
            <Link href="/login"    className={styles.btnLogin}>Log In</Link>
            <Link href="/register" className={styles.btnSignup}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  )
}
