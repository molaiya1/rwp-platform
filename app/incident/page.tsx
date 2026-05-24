'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './incident.module.css'

const REPORTER_TYPES = [
  { id: 'organization', label: 'Impact Organization (School / Nonprofit)' },
  { id: 'partner',      label: 'Business Partner' },
  { id: 'parent',       label: 'Parent / Guardian' },
  { id: 'student',      label: 'Student' },
  { id: 'staff',        label: 'RWP Staff' },
  { id: 'other',        label: 'Other / Anonymous' },
]

const SEVERITY_OPTIONS = [
  { id: 'low',      label: 'Low',      desc: 'Minor concern or policy question' },
  { id: 'medium',   label: 'Medium',   desc: 'Conduct issue requiring follow-up' },
  { id: 'high',     label: 'High',     desc: 'Serious safety or boundary violation' },
  { id: 'critical', label: 'Critical', desc: 'Immediate danger or abuse allegation' },
]

export default function IncidentPage() {
  const [reporterType,  setReporterType]  = useState('')
  const [reporterName,  setReporterName]  = useState('')
  const [reporterEmail, setReporterEmail] = useState('')
  const [incidentDate,  setIncidentDate]  = useState('')
  const [partnerName,   setPartnerName]   = useState('')
  const [location,      setLocation]      = useState('')
  const [severity,      setSeverity]      = useState('')
  const [description,   setDescription]  = useState('')
  const [anonymous,     setAnonymous]     = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [submitted,     setSubmitted]     = useState(false)
  const [error,         setError]         = useState('')

  const canSubmit = !!reporterType && !!severity && description.trim().length >= 20

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase.from('incident_reports').insert({
      reporter_type:  reporterType,
      reporter_name:  anonymous ? null : reporterName || null,
      reporter_email: anonymous ? null : reporterEmail || null,
      incident_date:  incidentDate || null,
      partner_name:   partnerName || null,
      location:       location || null,
      severity,
      description,
    })
    if (dbError) {
      setError('Something went wrong. Please try again or email us directly at safety@rwpathways.org')
      setSubmitting(false)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successInner}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={48} />
          </div>
          <h1 className={styles.successH1}>Report Received</h1>
          <p className={styles.successSub}>
            Your report has been submitted to the RWP Trust & Safety team. We treat every report seriously and will follow up within <strong>1 business day</strong> for high/critical severity reports, and <strong>3–5 business days</strong> for others.
          </p>
          <div className={styles.successCard}>
            <p className={styles.successCardLabel}>What happens next</p>
            <div className={styles.successStep}>
              <span className={styles.successNum}>1</span>
              <span>Your report is logged and assigned to a Trust & Safety reviewer</span>
            </div>
            <div className={styles.successStep}>
              <span className={styles.successNum}>2</span>
              <span>We may contact you for additional information (if not anonymous)</span>
            </div>
            <div className={styles.successStep}>
              <span className={styles.successNum}>3</span>
              <span>The involved partner's verification status is reviewed</span>
            </div>
            <div className={styles.successStep}>
              <span className={styles.successNum}>4</span>
              <span>You receive a resolution update if contact info was provided</span>
            </div>
          </div>
          <p className={styles.successEmergency}>
            If this is an emergency or a child is in immediate danger, call <strong>911</strong> immediately.
          </p>
          <div className={styles.successActions}>
            <Link href="/home" className={styles.btnPrimary}>Back to Home</Link>
            <Link href="/dashboard" className={styles.btnOutline}>Go to Dashboard</Link>
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
          <span>Trust & Safety</span>
        </div>
      </header>

      <div className={styles.layout}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarAlert}>
              <AlertTriangle size={16} className={styles.sidebarAlertIcon} />
              <div>
                <p className={styles.sidebarAlertTitle}>Emergency?</p>
                <p className={styles.sidebarAlertText}>If a child is in immediate danger, call <strong>911</strong> — do not wait.</p>
              </div>
            </div>

            <div className={styles.sidebarDivider} />

            <p className={styles.sidebarLabel}>What this form is for</p>
            <ul className={styles.sidebarList}>
              <li>Safety or boundary violations</li>
              <li>Inappropriate conduct by a partner</li>
              <li>Two-adult rule not followed</li>
              <li>Concerns about a Field Lab™ experience</li>
              <li>Any situation that made a youth feel unsafe</li>
            </ul>

            <div className={styles.sidebarDivider} />

            <p className={styles.sidebarLabel}>Your privacy</p>
            <p className={styles.sidebarText}>
              Anonymous reports are accepted. Only Trust & Safety staff can view submitted reports. We do not share your identity with the partner being reported.
            </p>

            <div className={styles.sidebarDivider} />

            <p className={styles.sidebarLabel}>Response times</p>
            <div className={styles.responseRow}><span className={styles.responseBadgeCritical}>Critical / High</span><span>Within 1 business day</span></div>
            <div className={styles.responseRow}><span className={styles.responseBadgeMedium}>Medium</span><span>Within 3 business days</span></div>
            <div className={styles.responseRow}><span className={styles.responseBadgeLow}>Low</span><span>Within 5 business days</span></div>
          </div>
        </aside>

        {/* Main form */}
        <main className={styles.main}>
          <div className={styles.mainInner}>
            <div className={styles.pageHeader}>
              <span className={styles.pageTag}><AlertTriangle size={12} /> Safety Report</span>
              <h1 className={styles.pageTitle}>File an Incident Report</h1>
              <p className={styles.pageDesc}>
                Use this form to report a safety concern, conduct issue, or any situation involving a RWP Verified Partner™ that made you or a young person feel unsafe or uncomfortable.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* Reporter type */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Who are you?</p>
                <div className={styles.typeGrid}>
                  {REPORTER_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`${styles.typeBtn} ${reporterType === t.id ? styles.typeBtnSelected : ''}`}
                      onClick={() => setReporterType(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous toggle */}
              <div className={styles.section}>
                <label className={styles.anonRow}>
                  <span
                    className={`${styles.checkbox} ${anonymous ? styles.checkboxChecked : ''}`}
                    onClick={() => setAnonymous(v => !v)}
                  >
                    {anonymous && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <span className={styles.anonLabel}>Submit anonymously — my name and email will not be recorded</span>
                </label>
              </div>

              {/* Contact info (shown unless anonymous) */}
              {!anonymous && (
                <div className={styles.section}>
                  <p className={styles.sectionTitle}>Your contact information <span className={styles.optional}>(optional but helps us follow up)</span></p>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Your Name</label>
                      <input className={styles.input} placeholder="Full name" value={reporterName} onChange={e => setReporterName(e.target.value)} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Your Email</label>
                      <input className={styles.input} type="email" placeholder="Email address" value={reporterEmail} onChange={e => setReporterEmail(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Incident details */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Incident details</p>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Date of Incident <span className={styles.optional}>(if known)</span></label>
                    <input className={styles.input} type="date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Business Partner Involved <span className={styles.optional}>(if known)</span></label>
                    <input className={styles.input} placeholder="Company name" value={partnerName} onChange={e => setPartnerName(e.target.value)} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Location / Setting <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} placeholder="e.g., Partner's office, Virtual, School gym" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>

              {/* Severity */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>How serious is this concern?</p>
                <div className={styles.severityGrid}>
                  {SEVERITY_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.severityBtn} ${styles[`severity_${s.id}`]} ${severity === s.id ? styles.severitySelected : ''}`}
                      onClick={() => setSeverity(s.id)}
                    >
                      <span className={styles.severityLabel}>{s.label}</span>
                      <span className={styles.severityDesc}>{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Describe what happened</p>
                <p className={styles.sectionSub}>Be as specific as possible — dates, times, names, what was said or done. The more detail you provide, the faster we can act.</p>
                <textarea
                  className={styles.textarea}
                  rows={7}
                  placeholder="Describe the incident in as much detail as you're comfortable sharing…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <p className={styles.charCount}>{description.length} characters {description.length < 20 && description.length > 0 ? '(minimum 20)' : ''}</p>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={!canSubmit || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Incident Report'}
                {!submitting && <ChevronRight size={16} />}
              </button>

              <p className={styles.footNote}>
                All reports are reviewed by RWP Trust & Safety staff. Filing a false report may result in account suspension.
              </p>

            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
