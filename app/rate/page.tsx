'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './rate.module.css'

const RATING_CATEGORIES = [
  {
    id: 'safety_score',
    label: 'Youth Safety',
    desc: 'Two-adult rule followed, appropriate boundaries, no unsafe situations',
  },
  {
    id: 'professionalism_score',
    label: 'Professionalism',
    desc: 'Partner was prepared, respectful, and presented positively to youth',
  },
  {
    id: 'engagement_score',
    label: 'Youth Engagement',
    desc: 'Students were actively engaged and the experience was age-appropriate',
  },
  {
    id: 'overall_score',
    label: 'Overall Experience',
    desc: 'How would you rate this experience overall?',
  },
]

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`${styles.star} ${n <= (hover || value) ? styles.starFilled : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
        >
          <Star size={28} fill={n <= (hover || value) ? 'currentColor' : 'none'} />
        </button>
      ))}
      <span className={styles.starLabel}>
        {(hover || value) === 1 && 'Poor'}
        {(hover || value) === 2 && 'Fair'}
        {(hover || value) === 3 && 'Good'}
        {(hover || value) === 4 && 'Great'}
        {(hover || value) === 5 && 'Excellent'}
      </span>
    </div>
  )
}

export default function RatePage() {
  const [partnerName,   setPartnerName]   = useState('')
  const [orgName,       setOrgName]       = useState('')
  const [expTitle,      setExpTitle]      = useState('')
  const [expDate,       setExpDate]       = useState('')
  const [scores, setScores] = useState<Record<string, number>>({
    safety_score: 0, professionalism_score: 0, engagement_score: 0, overall_score: 0,
  })
  const [notes,         setNotes]         = useState('')
  const [flagReview,    setFlagReview]    = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [submitted,     setSubmitted]     = useState(false)
  const [error,         setError]         = useState('')

  const allScored = Object.values(scores).every(v => v > 0)
  const canSubmit = !!partnerName && allScored

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase.from('experience_ratings').insert({
      partner_name:          partnerName,
      org_name:              orgName || null,
      experience_title:      expTitle || null,
      experience_date:       expDate || null,
      safety_score:          scores.safety_score,
      professionalism_score: scores.professionalism_score,
      engagement_score:      scores.engagement_score,
      overall_score:         scores.overall_score,
      notes:                 notes || null,
      flag_for_review:       flagReview,
    })
    if (dbError) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4)
    return (
      <div className={styles.successPage}>
        <div className={styles.successInner}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={48} />
          </div>
          <h1 className={styles.successH1}>Rating Submitted</h1>
          <p className={styles.successSub}>
            Thank you for rating your experience with <strong>{partnerName}</strong>. Your feedback helps keep the RWP network safe and high-quality.
          </p>
          <div className={styles.successScore}>
            <p className={styles.successScoreLabel}>Overall Rating</p>
            <div className={styles.successStars}>
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={24} fill={n <= avg ? '#F4B223' : 'none'} color={n <= avg ? '#F4B223' : '#DDD8EE'} />
              ))}
            </div>
          </div>
          {flagReview && (
            <div className={styles.flagNote}>
              Your concern has been flagged for Trust & Safety review. We will follow up within 2 business days.
            </div>
          )}
          <div className={styles.successActions}>
            <Link href="/dashboard" className={styles.btnPrimary}>Back to Dashboard <ChevronRight size={16} /></Link>
            <Link href="/marketplace" className={styles.btnOutline}>Browse Partners</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <Link href="/home" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wwk-transparent.png" alt="RWP" className={styles.logoImg} />
          <span className={styles.logoText}>Real-World Pathways™</span>
        </Link>
        <div className={styles.headerBadge}>
          <ShieldCheck size={14} />
          <span>Post-Experience Rating</span>
        </div>
      </header>

      <div className={styles.layout}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <p className={styles.sidebarLabel}>Why ratings matter</p>
            <p className={styles.sidebarText}>
              Your feedback is the primary signal we use to maintain partner quality. Low scores trigger an internal review. Consistently high scores can unlock partner badges and priority placement.
            </p>

            <div className={styles.sidebarDivider} />

            <p className={styles.sidebarLabel}>Rating categories</p>
            <ul className={styles.sidebarList}>
              <li><strong>Youth Safety</strong> — Did the partner follow the Two-Adult Rule and maintain appropriate boundaries?</li>
              <li><strong>Professionalism</strong> — Was the partner prepared and respectful?</li>
              <li><strong>Youth Engagement</strong> — Were students actively involved?</li>
              <li><strong>Overall</strong> — Your holistic take.</li>
            </ul>

            <div className={styles.sidebarDivider} />

            <p className={styles.sidebarLabel}>Concerns?</p>
            <p className={styles.sidebarText}>
              If this experience involved a safety issue, please also file a formal incident report in addition to this rating.
            </p>
            <Link href="/incident" className={styles.incidentLink}>
              <ShieldCheck size={13} />
              File an Incident Report
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <div className={styles.mainInner}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Rate a Field Lab™ Experience</h1>
              <p className={styles.pageDesc}>
                Complete this form after each experience to help us maintain quality standards and protect every student on the platform.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* Experience details */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Experience details</p>
                <div className={styles.fieldGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Business Partner Name <span className={styles.required}>*</span></label>
                    <input className={styles.input} placeholder="Company name" value={partnerName} onChange={e => setPartnerName(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Your Organization <span className={styles.optional}>(optional)</span></label>
                    <input className={styles.input} placeholder="School or nonprofit name" value={orgName} onChange={e => setOrgName(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Experience Title <span className={styles.optional}>(optional)</span></label>
                    <input className={styles.input} placeholder="e.g., Job Shadow: Delta Air Lines" value={expTitle} onChange={e => setExpTitle(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Date of Experience <span className={styles.optional}>(optional)</span></label>
                    <input className={styles.input} type="date" value={expDate} onChange={e => setExpDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Rate each category <span className={styles.required}>*</span></p>
                <div className={styles.ratingCards}>
                  {RATING_CATEGORIES.map(cat => (
                    <div key={cat.id} className={`${styles.ratingCard} ${scores[cat.id] > 0 ? styles.ratingCardFilled : ''}`}>
                      <div className={styles.ratingCardLeft}>
                        <p className={styles.ratingCardTitle}>{cat.label}</p>
                        <p className={styles.ratingCardDesc}>{cat.desc}</p>
                      </div>
                      <StarRating
                        value={scores[cat.id]}
                        onChange={v => setScores(prev => ({ ...prev, [cat.id]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Additional notes <span className={styles.optional}>(optional)</span></p>
                <textarea
                  className={styles.textarea}
                  rows={5}
                  placeholder="Anything else you want to share about the experience — what worked well, what could improve, specific moments that stood out…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {/* Flag for review */}
              <div className={styles.section}>
                <label className={styles.flagRow}>
                  <span
                    className={`${styles.checkbox} ${flagReview ? styles.checkboxChecked : ''}`}
                    onClick={() => setFlagReview(v => !v)}
                  >
                    {flagReview && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <span className={styles.flagLabel}>
                    I want to flag this partner for Trust & Safety review (for concerns not rising to a formal incident report)
                  </span>
                </label>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={!canSubmit || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Rating'}
                {!submitting && <ChevronRight size={16} />}
              </button>

              {!canSubmit && (
                <p className={styles.footNote}>
                  Please enter a partner name and rate all four categories to submit.
                </p>
              )}

            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
