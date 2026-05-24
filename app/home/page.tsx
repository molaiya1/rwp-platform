'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ShieldCheck, Lock, TrendingUp, Scale, ChevronRight } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './home.module.css'

/* ─── Stats data ─── */
const STATS = [
  { number: 'Atlanta',  label: 'Home Market\nExpanding Nationally', iconPos: '0% 0%'     },
  { number: '6',        label: 'Structured\nExperience Types',       iconPos: '100% 0%'   },
  { number: 'Free',     label: 'To Join for\nAll Partners',          iconPos: '100% 100%' },
  { number: '2026',     label: 'Founding Cohort\nNow Enrolling',     iconPos: '0% 100%'   },
]

/* ─── How It Works steps ─── */
const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Create Your Profile',
    desc: 'Sign up as a school, nonprofit, business, or Impact Partner™. Your profile tells the community who you are and what you bring to the table.',
  },
  {
    num: '02',
    title: 'Discover & Connect',
    desc: 'Browse verified partners and real-world opportunities matched to your community. Send a connection request and start the conversation.',
  },
  {
    num: '03',
    title: 'Collaborate & Launch',
    desc: 'Co-manage programs, field experiences, and mentorships — all in one place. Every partnership is built to create measurable outcomes for youth.',
  },
]

/* ─── Partner cards ─── */
const PARTNERS = [
  {
    id: 'org',
    badge: 'For Organizations',
    features: [
      'Find business partners',
      'Discover real-world experiences',
      'Manage programs & partnerships',
      'Track youth outcomes',
    ],
    ctaPrefix: 'Explore as an',
    ctaHighlight: 'Organization',
    visual: 'building-org',
  },
  {
    id: 'biz',
    badge: 'For Businesses',
    features: [
      'Build your talent pipeline early',
      'Get first access to motivated youth',
      'Strengthen your employer brand',
      'Measure your community impact',
    ],
    ctaPrefix: 'Explore as a',
    ctaHighlight: 'Business',
    visual: 'building-biz',
  },
  {
    id: 'partner',
    badge: 'For Impact Partners™',
    features: [
      'Expand your reach',
      'Collaborate across sectors',
      'Amplify your impact',
      'Be part of lasting change',
    ],
    ctaPrefix: 'Explore as an',
    ctaHighlight: 'Impact Partner™',
    visual: 'people',
  },
]

/* ─── Trust pillars ─── */
const TRUST = [
  { label: 'Mandatory 6-Step Vetting',  desc: 'Every Pathway Site passes background checks, insurance verification, and youth safety training before any student sets foot inside.',  Icon: ShieldCheck },
  { label: 'FERPA & COPPA Compliant',   desc: 'Student data is never sold, never shared without consent, and handled in full compliance with federal education privacy law.',          Icon: Lock        },
  { label: 'Measurable Outcomes',       desc: 'We track what happens after the Field Lab — career interest, financial literacy growth, and employer brand impact.',                   Icon: TrendingUp  },
  { label: 'Equity by Design',          desc: 'Every experience on this platform is free for students and organizations. Zip code does not determine access to opportunity.',         Icon: Scale       },
]

export default function HomePage() {
  useEffect(() => {
    const els = document.querySelectorAll(`.${styles.animateEl}`)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(styles.animateVisible) }),
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.page}>

      <SiteNav />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroLeft}>
          <h1 className={styles.heroH1}>
            Connect. Collaborate.<br />
            Create <span className={styles.heroAccent}>Real-World Impact.</span>
          </h1>
          <p className={styles.heroSub}>
            The only platform purpose-built for in-person, structured career experiences — connecting Atlanta&apos;s students to real workplaces, real professionals, and real futures.
          </p>
          <p className={styles.heroBody}>
            Schools find vetted Pathway Sites™. Businesses build their talent pipeline early.
            Every Field Lab™ is tracked, measured, and connected to student outcomes — no other platform in America closes that loop.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/register?type=org" className={styles.ctaCard}>
              <span className={styles.ctaIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              <div>
                <strong className={styles.ctaLabel}>I'm an Organization</strong>
                <span className={styles.ctaSub}>Schools, nonprofits, programs</span>
              </div>
              <ChevronRight size={18} className={styles.ctaArrow} aria-hidden="true" />
            </Link>

            <Link href="/register?type=biz" className={styles.ctaCardOutline}>
              <span className={styles.ctaIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                </svg>
              </span>
              <div>
                <strong className={styles.ctaLabel}>I'm a Business</strong>
                <span className={styles.ctaSub}>Employers, partners, sponsors</span>
              </div>
              <ChevronRight size={18} className={styles.ctaArrow} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.trustSignal}>
            <ShieldCheck size={15} className={styles.trustSignalIcon} aria-hidden="true" />
            <span>FERPA-compliant · Background-checked partners · Youth safety trained · <Link href="/safety" className={styles.trustSignalLink}>See our safety standards →</Link></span>
          </div>
        </div>

        <div className={styles.heroRight}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rwp-hero-girl.png" alt="Student looking toward future opportunities" className={styles.heroImg} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════ */}
      <section className={styles.statsBand} aria-label="Platform impact statistics">
        <div className={styles.statsInner}>
          {STATS.map((s, i) => (
            <div key={s.number} className={`${styles.statItem} ${styles.animateEl}`} style={{ transitionDelay: `${i * 80}ms` }}>
              {i > 0 && <div className={styles.statDivider} aria-hidden="true" />}
              <div
                className={styles.statIconWrap}
                aria-hidden="true"
                style={{
                  backgroundImage: "url('/rwp-stat-icons.png')",
                  backgroundSize: '200% 200%',
                  backgroundPosition: s.iconPos,
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div>
                <p className={styles.statNumber}>{s.number}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className={styles.howItWorks} id="how-it-works" aria-labelledby="how-heading">
        <div className={styles.howBg} aria-hidden="true" />
        <div className={styles.howInner}>
          <h2 id="how-heading" className={`${styles.howTitle} ${styles.animateEl}`}>How It Works</h2>
          <p className={`${styles.howSub} ${styles.animateEl}`}>Three steps from connection to real-world impact.</p>
          <div className={styles.howSteps}>
            {HOW_IT_WORKS.flatMap((step, i) => {
              const card = (
                <div key={step.num} className={`${styles.howStep} ${styles.animateEl}`} style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className={styles.howStepNum}>{step.num}</div>
                  <h3 className={styles.howStepTitle}>{step.title}</h3>
                  <p className={styles.howStepDesc}>{step.desc}</p>
                </div>
              )
              if (i < HOW_IT_WORKS.length - 1) {
                return [card, (
                  <div key={`conn-${i}`} className={styles.howConnector} aria-hidden="true">
                    <ChevronRight size={20} />
                  </div>
                )]
              }
              return [card]
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUSTED BY STRIP
      ══════════════════════════════════════ */}
      <section className={styles.trustedBy} aria-label="Partner types">
        <p className={styles.trustedByLabel}>Built for every stakeholder in the youth opportunity ecosystem</p>
        <div className={styles.trustedByLogos}>
          {['K–12 Schools', 'Youth Nonprofits', 'Regional Businesses', 'Community Foundations', 'Workforce Boards', 'Faith-Based Programs'].map(name => (
            <span key={name} className={styles.trustedByTag}>{name}</span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLATFORM FOR EVERY PARTNER
      ══════════════════════════════════════ */}
      <section className={styles.partners} id="partners" aria-labelledby="partners-heading">
        <div className={styles.sectionWrap}>
          <h2 id="partners-heading" className={styles.sectionTitle}>A Platform Built for Every Partner</h2>
          <p className={styles.sectionSub}>
            Whether you're creating opportunities or looking for them, we make it simple to connect and collaborate.
          </p>
          <div className={styles.partnerGrid}>
            {PARTNERS.map((p, i) => (
              <div key={p.id} className={`${styles.partnerCard} ${styles.animateEl}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={styles.partnerVisual}>
                  {p.visual === 'people' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/rwp-partners-photo.png" alt="Impact Partners™ collaborating" className={styles.partnerPeopleImg} />
                  ) : (
                    <div
                      aria-hidden="true"
                      className={styles.partnerBuildingDiv}
                      style={{
                        backgroundImage: "url('/rwp-buildings.png')",
                        backgroundSize: '200% auto',
                        backgroundPosition: p.visual === 'building-org' ? '0% center' : '100% center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  )}
                </div>
                <div className={styles.partnerContent}>
                  <span className={styles.partnerBadge}>{p.badge}</span>
                  <ul className={styles.partnerFeatures}>
                    {p.features.map(f => (
                      <li key={f} className={styles.partnerFeatureItem}>
                        <span className={styles.partnerBullet} aria-hidden="true">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/register?type=${p.id}`} className={styles.partnerCta}>
                    {p.ctaPrefix} <span className={styles.ctaGold}>{p.ctaHighlight}</span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST / SAFETY BAND
      ══════════════════════════════════════ */}
      <section className={styles.trustBand} aria-label="Trust and safety commitments">
        <div className={styles.trustInner}>
          <div className={styles.trustGrid}>
            {TRUST.map(t => (
              <div key={t.label} className={styles.trustItem}>
                <div className={styles.trustIconWrap} aria-hidden="true">
                  <t.Icon size={26} className={styles.trustIconSvg} />
                </div>
                <div>
                  <strong className={styles.trustLabel}>{t.label}</strong>
                  <p className={styles.trustDesc}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLOSING CTA BAND
      ══════════════════════════════════════ */}
      <section className={styles.closingBand}>
        <div className={styles.closingInner}>
          <p className={styles.closingHeading}>The only platform that connects<br />career exposure to measurable outcomes.</p>
          <div className={styles.closingActions}>
            <Link href="/register" className={styles.btnSignup}>Join the Founding Cohort</Link>
            <Link href="/safety" className={styles.btnSafety}>Our Safety Standards →</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
            <a href="/terms"   className={styles.footerLink}>Terms of Use</a>
            <a href="/contact" className={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
