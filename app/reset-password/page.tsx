'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './reset-password.module.css'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPw, setShowPw]             = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)
  const [error, setError]               = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash.
    // onAuthStateChange fires PASSWORD_RECOVERY when the hash is present.
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })
    // Also check if there's already an active session (user refreshed the page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-wwk-transparent.png" alt="Real-World Pathways™" className={styles.logoImg} />

        {done ? (
          <div className={styles.successBlock}>
            <div className={styles.successIcon}><CheckCircle2 size={32} /></div>
            <h1 className={styles.successTitle}>Password updated!</h1>
            <p className={styles.successSub}>Your password has been changed. Redirecting you to sign in…</p>
            <Link href="/login" className={styles.btnPrimary}>Go to Sign In →</Link>
          </div>
        ) : !sessionReady ? (
          <div className={styles.warningBlock}>
            <div className={styles.warningIcon}><AlertTriangle size={28} /></div>
            <h1 className={styles.warningTitle}>Link expired or invalid</h1>
            <p className={styles.warningSub}>
              This password reset link has expired or has already been used. Reset links are valid for 60 minutes.
            </p>
            <Link href="/forgot-password" className={styles.btnPrimary}>Request a new link</Link>
          </div>
        ) : (
          <>
            <div className={styles.iconWrap}><Lock size={24} /></div>
            <h1 className={styles.h1}>Set a new password</h1>
            <p className={styles.sub}>Choose something strong — at least 8 characters.</p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">New Password</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><Lock size={15} /></span>
                  <input
                    id="password"
                    className={styles.input}
                    type={showPw ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide' : 'Show'}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirm">Confirm New Password</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><Lock size={15} /></span>
                  <input
                    id="confirm"
                    className={styles.input}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Hide' : 'Show'}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <p className={styles.error} role="alert">{error}</p>}

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading
                  ? <><span className={styles.spinner} aria-hidden="true" />Updating…</>
                  : 'Update Password'
                }
              </button>
            </form>
          </>
        )}

        <div className={styles.footer}>
          <span>© 2026 WealthWise Kids LLC.</span>
          <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
          <Link href="/terms" className={styles.footerLink}>Terms</Link>
        </div>
      </div>
    </div>
  )
}
