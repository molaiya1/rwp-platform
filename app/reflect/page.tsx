'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Building2, Calendar, ClipboardList, CheckCircle2,
  ChevronRight, ShieldCheck, Users, BookOpen,
} from 'lucide-react'
import styles from './reflect.module.css'

/* ─── Questions ─── */
const QUESTIONS = [
  {
    id: 'career_awareness',
    label: 'Career Awareness',
    question: 'Students could name at least one career path connected to this industry after the experience.',
  },
  {
    id: 'financial_connection',
    label: 'Financial Connection',
    question: 'Students made a connection between this experience and a real financial concept — earning, saving, or investing.',
  },
  {
    id: 'engagement',
    label: 'Student Engagement',
    question: 'Students were actively engaged and attentive throughout the experience.',
  },
  {
    id: 'knowledge_gain',
    label: 'Observable Learning',
    question: 'I observed a measurable increase in student knowledge about this industry or career path.',
  },
  {
    id: 'would_repeat',
    label: 'Experience Quality',
    question: 'I would recommend this experience and book it again for future student cohorts.',
  },
]

const SCALE_LABELS: Record<number, string> = {
  1: 'Strongly disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly agree',
}

/* ─── Score helpers ─── */
function computeScore(scores: Record<string, number>): number {
  const vals = Object.values(scores)
  if (vals.length < QUESTIONS.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / (QUESTIONS.length * 5)) * 100)
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Strong Experience'
  if (score >= 60) return 'Good Experience'
  return 'Needs Attention'
}

function scoreClass(score: number, s: typeof styles): string {
  if (score >= 80) return s.scoreGreen
  if (score >= 60) return s.scoreAmber
  return s.scoreRed
}

/* ─── Inner form (uses useSearchParams) ─── */
function ReflectForm() {
  const params   = useSearchParams()
  const company  = params.get('company')  ?? ''
  const expType  = params.get('type')     ?? ''
  const expDate  = params.get('date')     ?? ''
  const expId    = params.get('expId')    ?? ''
  const cohortIdParam = params.get('cohortId') ?? ''

  const [facilitator,      setFacilitator]      = useState('')
  const [facilitatorEmail, setFacilitatorEmail] = useState('')
  const [school,           setSchool]           = useState('')
  const [gradeLevel,       setGradeLevel]       = useState('')
  const [studentCount,     setStudentCount]      = useState('')
  const [cohortId,         setCohortId]          = useState(cohortIdParam)
  const [scores,           setScores]            = useState<Record<string, number>>({})
  const [highlight,        setHighlight]         = useState('')
  const [notes,            setNotes]             = useState('')
  const [submitted,        setSubmitted]         = useState(false)
  const [submitting,       setSubmitting]        = useState(false)
  const [pathwayScore,     setPathwayScore]      = useState(0)

  const allScored = QUESTIONS.every(q => scores[q.id] !== undefined)
  const canSubmit = allScored && facilitator.trim() && school.trim()

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    const score = computeScore(scores)

    await fetch('/api/reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expId,
        company,
        expType,
        expDate,
        facilitator,
        facilitatorEmail,
        school,
        gradeLevel,
        studentCount: parseInt(studentCount) || 0,
        cohortId:   cohortId.trim() || undefined,
        scores,
        pathwayScore: score,
        highlight,
        notes,
        submittedAt: new Date().toISOString(),
      }),
    })

    setPathwayScore(score)
    setSubmitting(false)
    setSubmitted(true)
  }

  /* ── Success screen ── */
  if (submitted) {
    const label = scoreLabel(pathwayScore)
    const cls   = scoreClass(pathwayScore, styles)
    return (
      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={`${styles.scoreRing} ${cls}`}>
            <span className={styles.scoreNum}>{pathwayScore}</span>
            <span className={styles.scoreMax}>/100</span>
          </div>
          <h2 className={styles.successH}>RWP Pathway Score™ Recorded</h2>
          <p className={`${styles.successLabel} ${cls}`}>{label}</p>
          <p className={styles.successSub}>
            This experience reflection has been logged to the student activity record.
            The score will contribute to cohort outcome data and your iPartner performance report.
          </p>

          <div className={styles.successSteps}>
            <p className={styles.successStepsLabel}>What happens next</p>
            {[
              "Your score is added to the cohort's RWP Pathway data",
              'The business partner receives aggregated feedback (no individual data)',
              'This experience appears in the student Pathways Portfolio™',
              'Cohort outcome reports update automatically in the admin dashboard',
            ].map((s, i) => (
              <div key={i} className={styles.successStep}>
                <CheckCircle2 size={14} className={styles.successStepIcon} />
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className={styles.successActions}>
            <a href="/marketplace" className={styles.btnPrimary}>
              Back to Marketplace <ChevronRight size={14} />
            </a>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                setSubmitted(false)
                setScores({})
                setHighlight('')
                setNotes('')
                setFacilitator('')
                setSchool('')
                setStudentCount('')
              }}
            >
              Submit Another
            </button>
          </div>

          <div className={styles.successTrust}>
            <ShieldCheck size={13} className={styles.trustIcon} />
            <span>Logged as a verified RWP experience event. Powered by Real-World Pathways™.</span>
          </div>
        </div>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <div className={styles.wrap}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <ClipboardList size={18} className={styles.headerIcon} />
            <span>Real-World Pathways™</span>
          </div>
          <span className={styles.headerTag}>Post-Experience Reflection</span>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.container}>

          {/* Experience summary card */}
          {(company || expType || expDate) && (
            <div className={styles.expCard}>
              <p className={styles.expCardLabel}>You are reflecting on</p>
              <div className={styles.expCardBody}>
                {company && (
                  <div className={styles.expCardItem}>
                    <Building2 size={14} className={styles.expCardIcon} />
                    <strong>{company}</strong>
                  </div>
                )}
                {expType && (
                  <div className={styles.expCardItem}>
                    <BookOpen size={14} className={styles.expCardIcon} />
                    {expType}
                  </div>
                )}
                {expDate && (
                  <div className={styles.expCardItem}>
                    <Calendar size={14} className={styles.expCardIcon} />
                    {expDate}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intro */}
          <div className={styles.intro}>
            <h1 className={styles.introH}>Post-Experience Reflection</h1>
            <p className={styles.introSub}>
              This form captures how your students experienced this Real-World Pathway™.
              Your responses generate a <strong>RWP Pathway Score™</strong> that feeds
              your cohort's outcome data — the same way FLIQ Score™ measures financial literacy growth.
            </p>
          </div>

          {/* Facilitator info */}
          <section className={styles.section}>
            <p className={styles.sectionLabel}>
              <Users size={13} /> Facilitator Information
            </p>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Name *</label>
                <input
                  className={styles.input}
                  placeholder="First and last name"
                  value={facilitator}
                  onChange={e => setFacilitator(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="your@school.org"
                  value={facilitatorEmail}
                  onChange={e => setFacilitatorEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>School or Organization *</label>
                <input
                  className={styles.input}
                  placeholder="e.g. South Atlanta High School"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Grade Level</label>
                <select
                  className={styles.select}
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value)}
                >
                  <option value="">Select grade</option>
                  <option>K–5</option>
                  <option>6–8</option>
                  <option>9–12</option>
                  <option>Mixed grades</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Number of Students</label>
                <input
                  className={styles.input}
                  type="number"
                  min="1"
                  placeholder="e.g. 24"
                  value={studentCount}
                  onChange={e => setStudentCount(e.target.value)}
                />
              </div>
              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.fieldLabel}>
                  Portal Cohort ID{' '}
                  <span style={{ fontWeight: 400, color: '#9C8FBF', fontSize: '11px' }}>
                    (optional — links this reflection to your students&apos; activity records)
                  </span>
                </label>
                <input
                  className={styles.input}
                  placeholder="Paste your cohort UUID from portal.wealthwiselearning.com"
                  value={cohortId}
                  onChange={e => setCohortId(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '12.5px' }}
                />
                {!cohortId && (
                  <p style={{ fontSize: '11.5px', color: '#9C8FBF', marginTop: 4, lineHeight: 1.5 }}>
                    Find this in your iMPACT Partner portal under your cohort&apos;s settings. Without it, the reflection still records — just without per-cohort tracking.
                  </p>
                )}
                {cohortId && (
                  <p style={{ fontSize: '11.5px', color: '#3A8C6E', fontWeight: 600, marginTop: 4 }}>
                    ✓ This reflection will be linked to cohort {cohortId.slice(0, 8)}…
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Score questions */}
          <section className={styles.section}>
            <p className={styles.sectionLabel}>
              <ClipboardList size={13} /> Rate Your Students' Experience
            </p>
            <p className={styles.sectionSub}>
              Answer each statement based on what you observed. All 5 are required.
            </p>

            <div className={styles.questions}>
              {QUESTIONS.map((q, qi) => (
                <div key={q.id} className={styles.questionCard}>
                  <div className={styles.questionTop}>
                    <span className={styles.questionNum}>{String(qi + 1).padStart(2, '0')}</span>
                    <div>
                      <p className={styles.questionLabel}>{q.label}</p>
                      <p className={styles.questionText}>{q.question}</p>
                    </div>
                  </div>
                  <div className={styles.scaleWrap}>
                    <span className={styles.scaleEnd}>Strongly disagree</span>
                    <div className={styles.scaleBtns}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          className={`${styles.scaleBtn} ${scores[q.id] === n ? styles.scaleBtnActive : ''}`}
                          onClick={() => setScores(prev => ({ ...prev, [q.id]: n }))}
                          title={SCALE_LABELS[n]}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <span className={styles.scaleEnd}>Strongly agree</span>
                  </div>
                  {scores[q.id] && (
                    <p className={styles.scaleFeedback}>{SCALE_LABELS[scores[q.id]]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Live score preview */}
          {allScored && (
            <div className={`${styles.scorePreview} ${scoreClass(computeScore(scores), styles)}`}>
              <div className={styles.scorePreviewLeft}>
                <p className={styles.scorePreviewLabel}>RWP Pathway Score™ Preview</p>
                <p className={styles.scorePreviewSub}>{scoreLabel(computeScore(scores))}</p>
              </div>
              <div className={styles.scorePreviewNum}>{computeScore(scores)}</div>
            </div>
          )}

          {/* Optional text */}
          <section className={styles.section}>
            <p className={styles.sectionLabel}>
              <BookOpen size={13} /> Additional Observations <span className={styles.optional}>(optional)</span>
            </p>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Most impactful moment from this experience</label>
              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="Describe the moment that had the most visible impact on students…"
                value={highlight}
                onChange={e => setHighlight(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Logistics or coordination notes for future bookings</label>
              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="Anything the business or RWP team should know to improve the experience next time…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </section>

          {/* Submit */}
          <div className={styles.submitRow}>
            <button
              className={`${styles.submitBtn} ${!canSubmit ? styles.submitBtnDisabled : ''}`}
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting…' : (
                <>Submit Reflection & Generate Pathway Score™ <ChevronRight size={16} /></>
              )}
            </button>
            {!allScored && (
              <p className={styles.submitHint}>Rate all 5 statements to unlock submission.</p>
            )}
            {allScored && (!facilitator.trim() || !school.trim()) && (
              <p className={styles.submitHint}>Add your name and school to submit.</p>
            )}
          </div>

          <div className={styles.footerTrust}>
            <ShieldCheck size={13} className={styles.trustIcon} />
            <span>
              Reflection data is logged as a verified <strong>RWP experience event</strong> and feeds
              your cohort's outcome report. Individual student names are never shared with the business partner.
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ─── Page export with Suspense ─── */
export default function ReflectPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#6B5A8E' }}>Loading…</div>}>
      <ReflectForm />
    </Suspense>
  )
}
