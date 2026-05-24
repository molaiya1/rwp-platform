'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './forgot-password.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (authError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wwk-transparent.png" alt="Real-World Pathways™" className={styles.logoImg} />
        </div>

        {sent ? (
          /* ── Success state ── */
          <div className={styles.successBlock}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={32} />
            </div>
            <h1 className={styles.successTitle}>Check your inbox</h1>
            <p className={styles.successSub}>
              We sent a password reset link to <strong>{email}</strong>. It may take a minute to arrive — check your spam folder if you don&apos;t see it.
            </p>
            <p className={styles.successNote}>
              The link expires in 60 minutes.
            </p>
            <Link href="/login" className={styles.backBtn}>
              <ArrowLeft size={15} /> Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className={styles.headBlock}>
              <div className={styles.iconWrap}>
                <Mail size={24} />
              </div>
              <h1 className={styles.h1}>Forgot your password?</h1>
              <p className={styles.sub}>
                Enter the email address on your account and we&apos;ll send you a link to reset your password.
              </p>
            </div>

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

              {error && <p className={styles.error} role="alert">{error}</p>}

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading
                  ? <><span className={styles.spinner} aria-hidden="true" />Sending…</>
                  : 'Send Reset Link'
                }
              </button>
            </form>

            <div className={styles.backRow}>
              <Link href="/login" className={styles.backLink}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </>
        )}

        <div className={styles.footer}>
          <span>© 2026 WealthWise Kids LLC.</span>
          <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
        </div>
      </div>
    </div>
  )
}
