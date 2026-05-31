'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './login.module.css'

/* ─── Stakeholder data ─── */
const STAKEHOLDERS = [
  {
    label: 'Impact Organizations',
    desc: 'Create life-changing experiences for the youth you serve.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="12" width="20" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M1 13L14 4L27 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="11" y="18" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="7" y="15" width="4" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="17" y="15" width="4" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    label: 'Pathway Sites',
    desc: 'Open your doors. Inspire the next generation.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="9" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3 13h22" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M9 9V6a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="14" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M14 20.5v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Impact Partners™',
    desc: 'Facilitate. Guide. Make an impact that lasts.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="20" cy="9" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 24c0-4.4 3.6-8 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M18 16c4.4 0 8 3.6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 24c0-3.3-2.7-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 24c0-3.3 2.7-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Parents & Guardians',
    desc: 'Stay informed. Stay connected. Stay confident.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="11" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="21" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M2 26c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M21 13c2.76 0 5 2.24 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Pathway Explorers',
    desc: 'Explore. Learn. Discover your path forward.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 12L14 7L24 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12v1a10 10 0 0020 0v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M24 12v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="22" r="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M14 7v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const TRUST_BADGES = [
  {
    label: 'Trusted & Verified',
    desc: 'Every Pathway Site is screened and verified.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2L3 5v6c0 5 3.5 8.7 8 10 4.5-1.3 8-5 8-10V5L11 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M7.5 11l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Secure & Private',
    desc: 'Your data is protected with enterprise-grade security.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="3" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M7 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <circle cx="11" cy="15" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Built for Impact',
    desc: "We're committed to equity, opportunity, and lifelong empowerment.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 19s-8-5.5-8-11a5 5 0 0110 0 5 5 0 0110 0c0 5.5-8 11-8 11h-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

/* ─── Cityscape SVG ─── */
function CityscapeSVG() {
  return (
    <svg
      viewBox="0 0 460 190"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ display: 'block', width: '100%' }}
    >
      <defs>
        <linearGradient id="csSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAE2F5" />
          <stop offset="100%" stopColor="#D4C2EE" />
        </linearGradient>
        <linearGradient id="csRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8B8E8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B8A8E0" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="460" height="190" fill="url(#csSky)" />

      {/* Far buildings — lightest purple */}
      <g fill="#D5C5EC">
        <rect x="0"   y="78" width="28" height="32" rx="1"/>
        <rect x="15"  y="62" width="18" height="48" rx="1"/>
        <rect x="32"  y="72" width="32" height="38" rx="1"/>
        <rect x="55"  y="58" width="20" height="52" rx="1"/>
        <rect x="72"  y="70" width="36" height="40" rx="1"/>
        <rect x="105" y="64" width="22" height="46" rx="1"/>
        <rect x="124" y="74" width="30" height="36" rx="1"/>
        <rect x="155" y="68" width="16" height="42" rx="1"/>
        <rect x="170" y="76" width="24" height="34" rx="1"/>
        <rect x="270" y="70" width="24" height="40" rx="1"/>
        <rect x="292" y="60" width="18" height="50" rx="1"/>
        <rect x="308" y="74" width="30" height="36" rx="1"/>
        <rect x="336" y="65" width="20" height="45" rx="1"/>
        <rect x="354" y="75" width="28" height="35" rx="1"/>
        <rect x="380" y="62" width="22" height="48" rx="1"/>
        <rect x="400" y="72" width="35" height="38" rx="1"/>
        <rect x="432" y="68" width="28" height="42" rx="1"/>
      </g>

      {/* Mid buildings — medium purple */}
      <g fill="#BCA8DE">
        <rect x="0"   y="88"  width="22" height="22" rx="1"/>
        <rect x="30"  y="82"  width="28" height="28" rx="1"/>
        <rect x="62"  y="78"  width="22" height="32" rx="1"/>
        <rect x="90"  y="84"  width="36" height="26" rx="1"/>
        <rect x="140" y="80"  width="26" height="30" rx="1"/>
        <rect x="168" y="86"  width="20" height="24" rx="1"/>
        <rect x="272" y="82"  width="28" height="28" rx="1"/>
        <rect x="304" y="78"  width="22" height="32" rx="1"/>
        <rect x="330" y="84"  width="36" height="26" rx="1"/>
        <rect x="374" y="80"  width="26" height="30" rx="1"/>
        <rect x="408" y="86"  width="20" height="24" rx="1"/>
        <rect x="435" y="82"  width="25" height="28" rx="1"/>
      </g>

      {/* Road / path — perspective trapezoid */}
      <path d="M200 108 L260 108 L330 190 L130 190 Z" fill="url(#csRoad)" />
      {/* Center stripe */}
      <path d="M230 115 L228 140 M230 115 L232 140" stroke="#E2D5F5" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5"/>

      {/* Front buildings — darkest purple */}
      <g fill="#9E88C8">
        <rect x="0"   y="95"  width="18" height="95" rx="1"/>
        <rect x="22"  y="88"  width="32" height="102" rx="1"/>
        <rect x="58"  y="92"  width="26" height="98" rx="1"/>
        <rect x="90"  y="96"  width="40" height="94" rx="1"/>
        <rect x="136" y="90"  width="22" height="100" rx="1"/>
        <rect x="164" y="97"  width="28" height="93" rx="1"/>
        <rect x="298" y="90"  width="32" height="100" rx="1"/>
        <rect x="334" y="95"  width="26" height="95" rx="1"/>
        <rect x="364" y="88"  width="38" height="102" rx="1"/>
        <rect x="408" y="93"  width="24" height="97" rx="1"/>
        <rect x="436" y="96"  width="24" height="94" rx="1"/>
      </g>

      {/* Ground */}
      <rect x="0" y="158" width="460" height="32" fill="#B8A6DC" />

      {/* Children silhouettes — dark purple */}
      <g fill="#3E2A74">
        {/* Child 1 — leftmost, smallest (further away) */}
        <circle cx="196" cy="148" r="5.5" />
        <ellipse cx="196" cy="158" rx="5" ry="6" />
        <rect x="191" y="163" width="4" height="8" rx="2" />
        <rect x="197" y="163" width="4" height="8" rx="2" />

        {/* Child 2 — center */}
        <circle cx="228" cy="142" r="6.5" />
        <ellipse cx="228" cy="153" rx="6" ry="7" />
        <rect x="222" y="158" width="5" height="10" rx="2" />
        <rect x="229" y="158" width="5" height="10" rx="2" />

        {/* Child 3 — rightmost, largest (closer) */}
        <circle cx="262" cy="136" r="7.5" />
        <ellipse cx="262" cy="148" rx="7" ry="8" />
        <rect x="255" y="154" width="6" height="12" rx="2" />
        <rect x="263" y="154" width="6" height="12" rx="2" />
      </g>
    </svg>
  )
}

/* ─── Main component ─── */
export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSso(provider: 'google' | 'apple' | 'microsoft') {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: provider === 'microsoft' ? 'azure' : provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <div className={styles.root}>

      {/* ══════════════════════════════════════
          LEFT — scrollable marketing panel
      ══════════════════════════════════════ */}
      <div className={styles.left}>

        {/* ── Hero photo section ── */}
        <section className={styles.hero}>


        </section>

        {/* ── Stakeholder ecosystem section ── */}
        <section className={styles.stakeholders}>
          <h2 className={styles.stakeholderHeading}>
            A trusted ecosystem for every stakeholder
          </h2>

          <div className={styles.stakeholderGrid}>
            {STAKEHOLDERS.map((s) => (
              <div key={s.label} className={styles.stakeholderItem}>
                <div className={styles.stakeholderIcon}>{s.icon}</div>
                <strong className={styles.stakeholderLabel}>{s.label}</strong>
                <p className={styles.stakeholderDesc}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.trustBadges}>
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className={styles.trustBadge}>
                <span className={styles.trustIcon}>{b.icon}</span>
                <div>
                  <strong className={styles.trustLabel}>{b.label}</strong>
                  <p className={styles.trustDesc}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════
          RIGHT — sticky login form
      ══════════════════════════════════════ */}
      <div className={styles.right}>

        {/* Scrollable form area */}
        <div className={styles.rightScroll}>

          {/* Back to home */}
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: '#9C8FBF', textDecoration: 'none', marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </a>

          {/* Heading */}
          <div className={styles.headingBlock}>
            <p className={styles.headingEyebrow}>Welcome to Real-World Pathways™</p>
            <h2 className={styles.h2}>Sign in to your account</h2>
            <p className={styles.subheading}>Continue your journey where you left off.</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><Mail size={15} /></span>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><Lock size={15} /></span>
                <input
                  id="password"
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className={styles.forgot}>
                Forgot password?
              </Link>
            </div>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} aria-hidden="true" />Signing in…</>
                : 'Sign In'
              }
            </button>

          </form>

          {/* SSO divider */}
          <div className={styles.divider}>or continue with</div>

          {/* SSO buttons */}
          <div className={styles.ssoRow}>
            <button type="button" className={styles.btnSso} onClick={() => handleSso('google')} aria-label="Sign in with Google">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className={styles.btnSso} onClick={() => handleSso('apple')} aria-label="Sign in with Apple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
            <button type="button" className={styles.btnSso} onClick={() => handleSso('microsoft')} aria-label="Sign in with Microsoft">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Microsoft
            </button>
          </div>

          {/* Create Account */}
          <div className={styles.createSection}>
            <p className={styles.createLabel}>
              New to Real-World Pathways?{' '}
              <Link href="/register" className={styles.createLink}>Create an account</Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className={styles.rightFooter}>
          <span>© 2026 WealthWise Kids LLC. All rights reserved.</span>
          <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
          <Link href="/legal" className={styles.footerLink}>Compliance</Link>
          <Link href="/help" className={styles.footerLink}>Help</Link>
        </div>

      </div>
    </div>
  )
}
