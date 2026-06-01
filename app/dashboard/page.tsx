'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Home, Map, Compass, Building2, Users, TrendingUp, BookOpen,
  MessageSquare, Calendar, Search, Bell, Mail, ChevronDown,
  ChevronRight, MapPin, Clock, Award, Zap, CheckCircle2, X,
  Radio, Lightbulb, FlaskConical, Heart, HelpCircle, Settings,
  Quote, ShieldCheck,
} from 'lucide-react'
import Toast, { type ToastData } from '@/app/components/Toast'
import RWPBannerStrip from '@/app/components/RWPBannerStrip'
import styles from './dashboard.module.css'

/* ─── Types ─── */
interface FieldLabLive {
  id: string
  title: string
  type: string
  description: string
  capacity: number
  duration: string
  grade_levels: string
  location: string
  is_virtual: boolean
  pathway_site_applications: { company: string; city: string } | null
}

/* ─── Static data ─── */
const NAV = [
  { label: 'Home',           icon: Home,          href: '/dashboard',              active: true  },
  { label: 'My Pathways',    icon: Map,           href: '/dashboard/pathways',     soon: true    },
  { label: 'Opportunities',  icon: Compass,       href: '/dashboard/opportunities',soon: true    },
  { label: 'Field Labs™',    icon: Building2,     href: '/dashboard/field-labs',   soon: true    },
  { label: 'Partners',       icon: Users,         href: '/dashboard/partners',     soon: true    },
  { label: 'My Progress',    icon: TrendingUp,    href: '/dashboard/progress',     soon: true    },
  { label: 'Resources',      icon: BookOpen,      href: '/dashboard/resources',    soon: true    },
  { label: 'Messages',       icon: MessageSquare, href: '/dashboard/messages',     soon: true    },
  { label: 'Calendar',       icon: Calendar,      href: '/dashboard/calendar',     soon: true    },
]

const QUICK_ACTIONS = [
  { label: 'Find Opportunities', sub: 'Explore Field Labs™',    icon: Compass,  href: '/marketplace'             },
  { label: 'Submit a Reflection',sub: 'Log a completed visit',  icon: BookOpen, href: '/reflect'                 },
  { label: 'Rate an Experience', sub: 'Share your feedback',    icon: Award,    href: '/rate'                    },
  { label: 'Become a Partner',   sub: 'List your organization', icon: Building2,href: '/pathway-sites'           },
  { label: 'Contact Support',    sub: 'Get help',               icon: HelpCircle,href: '/help'                  },
]

const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Behind the Scenes: Media Production',
    type: 'Field Lab™',
    typeColor: 'purple',
    date: 'Jun 12, 2026',
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
    date: 'Jun 18, 2026',
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
    date: 'Jun 25, 2026',
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
  const [query, setQuery]           = useState('')
  const [userName, setUserName]     = useState('there')
  const [userFirst, setUserFirst]   = useState('there')
  const [fieldLabs, setFieldLabs]   = useState<FieldLabLive[]>([])
  const [labsLoaded, setLabsLoaded] = useState(false)
  const [requesting, setRequesting] = useState<string | null>(null)
  const [requested, setRequested]   = useState<Set<string>>(new Set())
  const [orgId, setOrgId]           = useState<string | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [toasts, setToasts]           = useState<ToastData[]>([])
  const [onboardingDone, setOnboardingDone] = useState<Set<string>>(new Set())
  const [onboardingDismissed, setOnboardingDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismissed = localStorage.getItem('rwp_onboarding_dismissed') === '1'
    setOnboardingDismissed(dismissed)
    const done = JSON.parse(localStorage.getItem('rwp_onboarding_done') ?? '[]') as string[]
    setOnboardingDone(new Set(done))
  }, [])

  const markStep = (key: string) => {
    setOnboardingDone(prev => {
      const next = new Set([...prev, key])
      localStorage.setItem('rwp_onboarding_done', JSON.stringify([...next]))
      return next
    })
  }

  const dismissOnboarding = () => {
    setOnboardingDismissed(true)
    localStorage.setItem('rwp_onboarding_dismissed', '1')
  }

  const addToast = (message: string, type: ToastData['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }
  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  useEffect(() => {
    const supabase = createClient()

    // Load Field Labs from approved Pathway Sites
    supabase
      .from('field_labs')
      .select('*, pathway_site_applications(company, city)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setFieldLabs(data ?? [])
        setLabsLoaded(true)
      })

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const meta = user.user_metadata
      if (meta?.full_name || meta?.name) {
        const full = (meta.full_name || meta.name) as string
        setUserName(full)
        setUserFirst(full.split(' ')[0])
        return
      }
      const { data: org } = await supabase
        .from('impact_organizations')
        .select('id, contact_name, contact_email')
        .eq('contact_email', user.email)
        .single()
      if (org?.contact_name) {
        setUserName(org.contact_name)
        setUserFirst(org.contact_name.split(' ')[0])
        setOrgId(org.id)
        setContactName(org.contact_name)
        setContactEmail(org.contact_email ?? user.email ?? '')
        return
      }
      const prefix = user.email?.split('@')[0] ?? 'there'
      setUserName(prefix)
      setUserFirst(prefix)
      setContactEmail(user.email ?? '')
    })
  }, [])

  const handleInterest = async (lab: FieldLabLive) => {
    if (requested.has(lab.id)) return
    setRequesting(lab.id)
    const supabase = createClient()
    await supabase.from('field_lab_requests').insert({
      field_lab_id:  lab.id,
      org_id:        orgId ?? null,
      org_name:      userName,
      contact_name:  contactName || userName,
      contact_email: contactEmail,
      status:        'pending',
    })
    setRequested(prev => new Set([...prev, lab.id]))
    setRequesting(null)
    addToast(`Interest sent for "${lab.title}". The Pathway Site will follow up by email.`)
  }

  return (
    <div className={styles.shell}>

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside className={styles.sidebar}>

        {/* Logo */}
        <div className={styles.sidebarLogo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-rwp-web.png" alt="Real-World Pathways™" className={styles.sidebarLogoImg} />
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV.map(({ label, icon: Icon, href, active, soon }) => (
            soon ? (
              <div key={label} className={`${styles.navItem} ${styles.navItemDisabled}`} title={`${label} — coming soon`}>
                <Icon size={18} className={styles.navIcon} aria-hidden="true" />
                <span>{label}</span>
                <span className={styles.navComingSoon}>Beta</span>
              </div>
            ) : (
              <Link key={label} href={href} className={`${styles.navItem} ${active ? styles.navActive : ''}`}>
                <Icon size={18} className={styles.navIcon} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            )
          ))}
        </nav>

        {/* Beta notice */}
        <div className={styles.betaNotice}>
          <p className={styles.betaNoticeText}>
            You&apos;re in the <strong>Founding Cohort</strong>. Additional features unlock as your pathway progresses.
          </p>
        </div>

        {/* Bottom section */}
        <div className={styles.sidebarBottom}>

          {/* Rate an experience */}
          <Link href="/rate" className={styles.helpLink}>
            <Award size={15} />
            <span>Rate an Experience</span>
          </Link>

          {/* Report incident */}
          <Link href="/incident" className={styles.incidentLink}>
            <ShieldCheck size={15} />
            <span>Report a Safety Concern</span>
          </Link>

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
            </button>

            {/* Messages */}
            <button type="button" className={styles.iconBtn} aria-label="Messages">
              <Mail size={18} />
            </button>

            {/* Profile */}
            <button type="button" className={styles.profileBtn} aria-label="Account menu">
              <div className={styles.avatarInitials} aria-hidden="true">
                {userFirst.charAt(0).toUpperCase()}
              </div>
              <div className={styles.profileMeta}>
                <span className={styles.profileName}>{userName}</span>
                <span className={styles.profileRole}>Member</span>
              </div>
              <ChevronDown size={14} className={styles.profileChevron} />
            </button>
          </div>
        </header>

        {/* Banner strip */}
        <RWPBannerStrip height={130} mobileHeight={80} overlayOpacity={0.10} />

        {/* Scrollable content */}
        <main className={styles.content}>

          {/* Welcome */}
          <div className={styles.welcomeRow}>
            <div>
              <h1 className={styles.welcomeH1}>Welcome back, {userFirst}! <span aria-label="waving hand">👋</span></h1>
              <p className={styles.welcomeSub}>Let's explore real-world experiences and build your future.</p>
            </div>
            <Link href="/dashboard/settings" className={styles.settingsLink} aria-label="Settings">
              <Settings size={17} />
            </Link>
          </div>

          {/* ── Onboarding checklist ── */}
          {!onboardingDismissed && (
            <div className={styles.onboarding}>
              <div className={styles.onboardingHeader}>
                <div>
                  <p className={styles.onboardingTitle}>Get started with Real-World Pathways™</p>
                  <p className={styles.onboardingSub}>Complete these steps to get your first group into a Career Field Trip.</p>
                </div>
                <button type="button" className={styles.onboardingDismiss} onClick={dismissOnboarding} aria-label="Dismiss">
                  <X size={15} />
                </button>
              </div>
              <div className={styles.onboardingSteps}>
                {[
                  { key: 'account',   label: 'Create your account',              sub: 'You\'re in.',                                    done: true,                            href: null              },
                  { key: 'browse',    label: 'Browse Career Field Trips',         sub: 'Explore what\'s available in Atlanta.',          done: onboardingDone.has('browse'),    href: '/marketplace'    },
                  { key: 'request',   label: 'Request your first experience',     sub: 'Submit a request — takes under 2 minutes.',      done: onboardingDone.has('request'),   href: '/marketplace'    },
                  { key: 'reflect',   label: 'Submit a post-visit reflection',    sub: 'Log outcomes and earn a Pathway Score™.',        done: onboardingDone.has('reflect'),   href: '/reflect'        },
                  { key: 'profile',   label: 'Complete your organization profile', sub: 'Add your school or org details.',               done: onboardingDone.has('profile'),   href: '/dashboard/settings' },
                ].map(step => (
                  <div
                    key={step.key}
                    className={`${styles.onboardingStep} ${step.done ? styles.onboardingStepDone : ''}`}
                    onClick={() => { if (!step.done && step.href) markStep(step.key) }}
                  >
                    <div className={styles.onboardingCheck}>
                      {step.done
                        ? <CheckCircle2 size={18} />
                        : <div className={styles.onboardingCircle} />
                      }
                    </div>
                    <div className={styles.onboardingStepText}>
                      <span className={styles.onboardingStepLabel}>{step.label}</span>
                      <span className={styles.onboardingStepSub}>{step.sub}</span>
                    </div>
                    {step.href && !step.done && (
                      <Link href={step.href} className={styles.onboardingStepCta} onClick={() => markStep(step.key)}>
                        Go <ChevronRight size={13} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  Hi {userFirst}! 👋 New opportunities are waiting for you. Let's go!
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

            {/* Column 1 — Field Labs (live from Supabase) */}
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Available Field Labs™</h2>
                <Link href="/marketplace" className={styles.viewAll}>View all</Link>
              </div>
              <div className={styles.oppList}>
                {!labsLoaded && (
                  [1,2,3].map(i => (
                    <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #F0EDF8' }}>
                      <div style={{ height: 12, width: '40%', background: '#EDE9F5', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                      <div style={{ height: 14, width: '80%', background: '#F0EDF8', borderRadius: 6, marginBottom: 6 }} />
                      <div style={{ height: 11, width: '55%', background: '#F5F3FB', borderRadius: 6 }} />
                    </div>
                  ))
                )}
                {labsLoaded && fieldLabs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <Building2 size={32} style={{ color: '#C8BFEA', marginBottom: 10 }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1C1635', margin: '0 0 6px' }}>
                      Field Labs coming soon
                    </p>
                    <p style={{ fontSize: 12, color: '#8880A0', lineHeight: 1.6, margin: '0 0 14px' }}>
                      We&apos;re onboarding our founding cohort of Certified Pathway Sites™. New experiences will appear here as businesses are approved.
                    </p>
                    <Link href="/marketplace" style={{ fontSize: 12, fontWeight: 700, color: '#6B5A8E' }}>
                      Browse the Marketplace →
                    </Link>
                  </div>
                )}
                {fieldLabs.map(lab => (
                  <div key={lab.id} className={styles.oppCard}>
                    <div className={styles.oppBody}>
                      <span className={`${styles.oppBadge} ${styles.oppBadge_purple}`}>{lab.type}</span>
                      <p className={styles.oppTitle}>{lab.title}</p>
                      <div className={styles.oppMeta}>
                        <span><Clock size={11} aria-hidden="true" /> {lab.duration || 'Varies'}</span>
                        <span><MapPin size={11} aria-hidden="true" /> {lab.is_virtual ? 'Virtual' : lab.pathway_site_applications?.city || lab.location || 'Atlanta, GA'}</span>
                      </div>
                      {lab.description && <p className={styles.oppDesc}>{lab.description.length > 90 ? lab.description.slice(0, 90) + '…' : lab.description}</p>}
                    </div>
                    <button
                      type="button"
                      className={styles.oppBtn}
                      onClick={() => handleInterest(lab)}
                      disabled={requesting === lab.id || requested.has(lab.id)}
                    >
                      {requesting === lab.id ? 'Sending…' : requested.has(lab.id) ? '✓ Requested' : 'I\'m Interested'}
                    </button>
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

          {/* ── FLIQ Moat Banner ── */}
          <div style={{
            background: 'linear-gradient(135deg, #6B5A8E 0%, #6B5A8E 100%)',
            borderRadius: 16,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap' as const,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/milo-3d.png" alt="Milo" style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#F4B223', margin: '0 0 4px', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                  Track Financial Readiness Growth
                </p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1.5 }}>
                  After a Field Lab, send your students to <strong>The $100 Week™</strong> — a free 5-day sim that measures financial readiness and generates their FLIQ Score™. See how real-world exposure accelerates financial literacy.
                </p>
              </div>
            </div>
            <a
              href="https://play.wealthwiselearning.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#F4B223',
                color: '#6B5A8E',
                fontSize: 13,
                fontWeight: 800,
                padding: '11px 20px',
                borderRadius: 10,
                textDecoration: 'none',
                whiteSpace: 'nowrap' as const,
                flexShrink: 0,
              }}
            >
              Launch The $100 Week™ →
            </a>
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
              <span className={styles.footerDot}>·</span>
              <Link href="/legal" className={styles.footerLink}>Compliance</Link>
            </div>
          </footer>

        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />

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
