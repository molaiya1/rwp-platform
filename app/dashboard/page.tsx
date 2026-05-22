'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home, Map, Compass, Building2, Users, TrendingUp, BookOpen,
  MessageSquare, Calendar, Search, Bell, Mail, ChevronDown,
  ChevronRight, MapPin, Clock, Award, Zap, CheckCircle2,
  Radio, Lightbulb, FlaskConical, Heart, HelpCircle, Settings,
  Quote,
} from 'lucide-react'
import styles from './dashboard.module.css'

/* ─── Static data ─── */
const NAV = [
  { label: 'Home',           icon: Home,          href: '/dashboard',              active: true  },
  { label: 'My Pathways',    icon: Map,           href: '/dashboard/pathways'                    },
  { label: 'Opportunities',  icon: Compass,       href: '/dashboard/opportunities'               },
  { label: 'Field Labs™',    icon: Building2,     href: '/dashboard/field-labs'                  },
  { label: 'Partners',       icon: Users,         href: '/dashboard/partners'                    },
  { label: 'My Progress',    icon: TrendingUp,    href: '/dashboard/progress'                    },
  { label: 'Resources',      icon: BookOpen,      href: '/dashboard/resources'                   },
  { label: 'Messages',       icon: MessageSquare, href: '/dashboard/messages',  badge: 2         },
  { label: 'Calendar',       icon: Calendar,      href: '/dashboard/calendar'                    },
]

const QUICK_ACTIONS = [
  { label: 'Find Opportunities', sub: 'Explore Field Labs™',    icon: Compass,  href: '/dashboard/opportunities' },
  { label: 'My Pathways',        sub: 'Track your journey',     icon: Map,      href: '/dashboard/pathways'      },
  { label: 'Partner Directory',  sub: 'Connect with partners',  icon: Users,    href: '/dashboard/partners'      },
  { label: 'Resource Library',   sub: 'Tools to help you grow', icon: BookOpen, href: '/dashboard/resources'     },
  { label: 'Leaderboard',        sub: 'See how you rank',       icon: Award,    href: '/dashboard/leaderboard'   },
]

const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Behind the Scenes: Media Production',
    type: 'Field Lab™',
    typeColor: 'purple',
    date: 'May 24, 2025',
    time: '10:00 AM',
    location: 'Atlanta, GA',
    desc: 'Explore the world of media and storytelling with industry pros.',
    img: 'https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=140&h=100&fit=crop',
  },
  {
    id: 2,
    title: 'Future Innovators: STEM Lab',
    type: 'Field Lab™',
    typeColor: 'purple',
    date: 'May 28, 2025',
    time: '2:00 PM',
    location: 'Virtual',
    desc: 'Hands-on experiments and challenges with real scientists.',
    img: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=140&h=100&fit=crop',
  },
  {
    id: 3,
    title: 'Community Impact Day',
    type: 'Community Experience',
    typeColor: 'teal',
    date: 'June 5, 2025',
    time: '9:00 AM',
    location: 'Atlanta, GA',
    desc: 'Give back, make connections, create change.',
    img: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=140&h=100&fit=crop',
  },
]

const PATHWAYS = [
  { label: 'Media & Communication Pathway', progress: 75, icon: Radio         },
  { label: 'Entrepreneurship Pathway',       progress: 60, icon: Lightbulb     },
  { label: 'STEM & Innovation Pathway',      progress: 40, icon: FlaskConical  },
  { label: 'Community Leadership Pathway',   progress: 20, icon: Heart         },
]

const ACTIVITY = [
  { label: 'You earned 50 XP',          sub: 'Completed "Budget Boss Battle"',          time: '2 hours ago', type: 'xp'        },
  { label: 'New opportunity matched',    sub: 'Behind the Scenes: Media Production',     time: '1 day ago',   type: 'match'     },
  { label: 'Pathway milestone reached',  sub: 'Media & Communication Pathway',           time: '2 days ago',  type: 'milestone' },
]

/* ─── Sidebar progress ring ─── */
const XP = 650
const XP_NEXT = 1000
const RADIUS = 26
const CIRC = 2 * Math.PI * RADIUS
const PROGRESS_DASH = (XP / XP_NEXT) * CIRC

export default function DashboardPage() {
  const [query, setQuery] = useState('')

  return (
    <div className={styles.shell}>

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside className={styles.sidebar}>

        {/* Logo */}
        <div className={styles.sidebarLogo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wwk-transparent.png" alt="WealthWise KIDS™ Real-World Pathways" className={styles.sidebarLogoImg} />
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV.map(({ label, icon: Icon, href, active, badge }) => (
            <Link key={label} href={href} className={`${styles.navItem} ${active ? styles.navActive : ''}`}>
              <Icon size={18} className={styles.navIcon} aria-hidden="true" />
              <span>{label}</span>
              {badge ? <span className={styles.navBadge}>{badge}</span> : null}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className={styles.sidebarBottom}>

          {/* Help */}
          <Link href="/help" className={styles.helpLink}>
            <HelpCircle size={15} />
            <span>Need help? <strong>Contact Support</strong></span>
          </Link>

          {/* Impact level */}
          <div className={styles.impactCard}>
            <p className={styles.impactCardLabel}>My Impact Level</p>
            <div className={styles.impactCardBody}>
              <div className={styles.impactRingWrap}>
                <svg width={64} height={64} viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#EDE9F6" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r={RADIUS}
                    fill="none"
                    stroke="#6B5A8E"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${PROGRESS_DASH} ${CIRC}`}
                    strokeDashoffset={CIRC * 0.25}
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                  />
                </svg>
                <div className={styles.impactRingInner}>
                  <Zap size={14} color="#6B5A8E" />
                </div>
              </div>
              <div>
                <p className={styles.impactLevel}>Pathfinder</p>
                <p className={styles.impactLevelSub}>Level 3</p>
              </div>
            </div>
            <div className={styles.impactXpBar}>
              <div className={styles.impactXpFill} style={{ width: `${(XP / XP_NEXT) * 100}%` }} />
            </div>
            <div className={styles.impactXpRow}>
              <span>{XP.toLocaleString()} / {XP_NEXT.toLocaleString()} XP</span>
              <span>Next: Change Maker</span>
            </div>
          </div>

        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN AREA
      ══════════════════════════════ */}
      <div className={styles.main}>

        {/* Top nav */}
        <header className={styles.topNav}>

          {/* Search */}
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} aria-hidden="true" />
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search Field Labs™, opportunities, partners…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search"
            />
          </div>

          <div className={styles.topNavRight}>
            {/* Notifications */}
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <Bell size={18} />
              <span className={styles.iconBadge}>3</span>
            </button>

            {/* Messages */}
            <button type="button" className={styles.iconBtn} aria-label="Messages">
              <Mail size={18} />
              <span className={styles.iconBadge}>2</span>
            </button>

            {/* Profile */}
            <button type="button" className={styles.profileBtn} aria-label="Account menu">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&facepad=3"
                alt="Jordan M."
                className={styles.avatar}
              />
              <div className={styles.profileMeta}>
                <span className={styles.profileName}>Jordan M.</span>
                <span className={styles.profileRole}>Student</span>
              </div>
              <ChevronDown size={14} className={styles.profileChevron} />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className={styles.content}>

          {/* Welcome */}
          <div className={styles.welcomeRow}>
            <div>
              <h1 className={styles.welcomeH1}>Welcome back, Jordan! <span aria-label="waving hand">👋</span></h1>
              <p className={styles.welcomeSub}>Let's explore real-world experiences and build your future.</p>
            </div>
            <Link href="/dashboard/settings" className={styles.settingsLink} aria-label="Settings">
              <Settings size={17} />
            </Link>
          </div>

          {/* ── Hero banner ── */}
          <div className={styles.hero}>
            <div className={styles.heroLeft}>
              <p className={styles.heroEyebrow}>Real-World Pathways™</p>
              <h2 className={styles.heroH2}>Real-world learning<br />that opens real worlds.</h2>
              <p className={styles.heroSub}>Connect. Explore. Grow.<br />Your pathway to opportunity starts here.</p>
              <Link href="/dashboard/opportunities" className={styles.heroCta}>
                Find Opportunities <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </div>

            {/* Milo + speech bubble */}
            <div className={styles.miloWrap}>
              <div className={styles.miloBubble}>
                <p className={styles.miloBubbleText}>
                  Hi Jordan! 👋 New opportunities are waiting for you. Let's go!
                </p>
                <p className={styles.miloBubbleBy}>— Milo</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/milo-3d.png" alt="Milo the owl" className={styles.miloImg} />
            </div>
          </div>

          {/* ── Quick actions ── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>What would you like to do today?</h2>
              <Link href="/dashboard/opportunities" className={styles.viewAll}>View all</Link>
            </div>
            <div className={styles.quickGrid}>
              {QUICK_ACTIONS.map(({ label, sub, icon: Icon, href }) => (
                <Link key={label} href={href} className={styles.quickCard}>
                  <span className={styles.quickIcon}><Icon size={22} aria-hidden="true" /></span>
                  <span className={styles.quickLabel}>{label}</span>
                  <span className={styles.quickSub}>{sub}</span>
                  <ChevronRight size={14} className={styles.quickArrow} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          {/* ── Three-column grid ── */}
          <div className={styles.threeCol}>

            {/* Column 1 — Upcoming Opportunities */}
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Upcoming Opportunities</h2>
                <Link href="/dashboard/opportunities" className={styles.viewAll}>View all</Link>
              </div>
              <div className={styles.oppList}>
                {OPPORTUNITIES.map(o => (
                  <div key={o.id} className={styles.oppCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.img} alt="" className={styles.oppImg} aria-hidden="true" />
                    <div className={styles.oppBody}>
                      <span className={`${styles.oppBadge} ${styles[`oppBadge_${o.typeColor}`]}`}>{o.type}</span>
                      <p className={styles.oppTitle}>{o.title}</p>
                      <div className={styles.oppMeta}>
                        <span><Clock size={11} aria-hidden="true" /> {o.date} · {o.time}</span>
                        <span><MapPin size={11} aria-hidden="true" /> {o.location}</span>
                      </div>
                      <p className={styles.oppDesc}>{o.desc}</p>
                    </div>
                    <button type="button" className={styles.oppBtn}>I'm Interested</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Column 2 — My Pathways */}
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>My Pathways</h2>
                <Link href="/dashboard/pathways" className={styles.viewAll}>View all</Link>
              </div>
              <div className={styles.pathwayList}>
                {PATHWAYS.map(({ label, progress, icon: Icon }) => (
                  <div key={label} className={styles.pathwayItem}>
                    <div className={styles.pathwayItemHead}>
                      <span className={styles.pathwayIcon}><Icon size={14} aria-hidden="true" /></span>
                      <span className={styles.pathwayLabel}>{label}</span>
                      <span className={styles.pathwayPct}>{progress}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/pathways" className={styles.pathwayCta}>
                Go to My Pathways
              </Link>
            </section>

            {/* Column 3 — Milo Insight + Recent Activity */}
            <div className={styles.colStack}>

              {/* Milo's Daily Insight */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle} style={{ marginBottom: 14 }}>Milo's Daily Insight</h2>
                <div className={styles.insightBody}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/milo-3d.png" alt="Milo" className={styles.insightMilo} />
                  <div className={styles.insightQuote}>
                    <Quote size={18} className={styles.insightQuoteIcon} aria-hidden="true" />
                    <p className={styles.insightText}>
                      Every big dream starts with a small step. Keep showing up, you've got this!
                    </p>
                  </div>
                </div>
              </section>

              {/* Recent Activity */}
              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>Recent Activity</h2>
                  <Link href="/dashboard/activity" className={styles.viewAll}>View all</Link>
                </div>
                <div className={styles.activityList}>
                  {ACTIVITY.map(({ label, sub, time, type }) => (
                    <div key={label} className={styles.activityItem}>
                      <span className={`${styles.activityDot} ${styles[`activityDot_${type}`]}`}>
                        {type === 'xp'        && <Zap size={11} aria-hidden="true" />}
                        {type === 'match'     && <Compass size={11} aria-hidden="true" />}
                        {type === 'milestone' && <CheckCircle2 size={11} aria-hidden="true" />}
                      </span>
                      <div className={styles.activityBody}>
                        <p className={styles.activityLabel}>{label}</p>
                        <p className={styles.activitySub}>{sub}</p>
                      </div>
                      <span className={styles.activityTime}>{time}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <span className={styles.footerLock}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <rect x="2" y="6" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="6.5" cy="9" r="1" fill="currentColor"/>
              </svg>
              Your safety is our priority.
            </span>
            <Link href="/privacy" className={styles.footerLink}>Learn how we protect your information.</Link>
            <div className={styles.footerRight}>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <span className={styles.footerDot}>·</span>
              <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
            </div>
          </footer>

        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        {NAV.slice(0, 5).map(({ label, icon: Icon, href, active }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.mobileNavItem} ${active ? styles.mobileNavItemActive : ''}`}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
