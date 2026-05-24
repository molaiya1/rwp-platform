'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Upload, CheckCircle2, Clock, AlertCircle, ChevronRight, FileText, Users, BookOpen, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './verify.module.css'

/* ─── Types ─── */
type StepItem = {
  id: string
  label: string
  type: string
  placeholder?: string
  options?: string[]
}

type StepAgreement = {
  id: string
  title: string
  desc: string
  href: string
}

type TrainingModule = {
  num: string
  title: string
  duration: string
}

type Step = {
  id: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  desc: string
  items?: StepItem[]
  note?: string
  trainingModules?: TrainingModule[]
  agreements?: StepAgreement[]
}

/* ─── Verification steps ─── */
const STEPS: Step[] = [
  {
    id: 'business',
    icon: FileText,
    title: 'Business Verification',
    desc: 'Confirm your organization is legitimate and legally operating.',
    items: [
      { id: 'ein',      label: 'Employer Identification Number (EIN)',   type: 'text',   placeholder: 'XX-XXXXXXX' },
      { id: 'license',  label: 'Business License or State Registration', type: 'upload', placeholder: 'Upload PDF or image' },
      { id: 'website',  label: 'Company Website',                        type: 'text',   placeholder: 'https://yourcompany.com' },
    ],
    note: 'Your EIN appears on your IRS determination letter, prior tax returns, or your state business registration. It follows the format XX-XXXXXXX. If you can\'t locate it, your accountant or the IRS Business & Specialty Tax Line (800-829-4933) can help.',
  },
  {
    id: 'insurance',
    icon: ShieldCheck,
    title: 'Insurance Documentation',
    desc: 'Upload proof of current general liability coverage. Minimum: $1M per occurrence.',
    items: [
      { id: 'coi',         label: 'Certificate of Insurance (COI)',                    type: 'upload', placeholder: 'Upload PDF' },
      { id: 'coverage',    label: 'Coverage Amount (per occurrence)',                  type: 'select', options: ['$1,000,000', '$2,000,000', '$5,000,000+'] },
      { id: 'exp',         label: 'Policy Expiration Date',                            type: 'date',   placeholder: '' },
      { id: 'abuse',       label: 'Abuse & Molestation Coverage (recommended)',        type: 'checkbox', placeholder: '' },
    ],
    note: 'Your Certificate of Insurance (COI) comes from your insurance broker or carrier — it\'s typically free to request. If you don\'t yet have general liability coverage, most brokers can bind a policy within 24 hours. Abuse & Molestation coverage is strongly recommended for any organization working with youth.',
  },
  {
    id: 'background',
    icon: Users,
    title: 'Background Screening',
    desc: 'All Youth-Contact Supervisors must complete a background check before your profile goes live.',
    items: [
      { id: 'supervisor',  label: 'Primary Youth-Contact Supervisor Name',   type: 'text',   placeholder: 'Full name' },
      { id: 'sup-title',   label: 'Supervisor Title / Role',                 type: 'text',   placeholder: 'e.g., HR Director, Community Manager' },
      { id: 'sup-email',   label: 'Supervisor Email',                        type: 'text',   placeholder: 'supervisor@company.com' },
      { id: 'bgcheck',     label: 'Background Check Authorization',          type: 'upload', placeholder: 'Upload signed authorization form' },
    ],
    note: 'We will initiate the background check within 2 business days of receiving your authorization. Results are reviewed by our Trust & Safety team.',
  },
  {
    id: 'training',
    icon: BookOpen,
    title: 'Youth Safety Orientation',
    desc: 'Your Youth-Contact Supervisor must complete our ~2-hour online safety orientation before hosting any experience.',
    items: [
      { id: 'training-confirm', label: 'I confirm the designated supervisor will complete the RWP Youth Safety Orientation before hosting youth.', type: 'checkbox', placeholder: '' },
    ],
    trainingModules: [
      { num: '01', title: 'Age-Appropriate Interaction Standards',       duration: '25 min' },
      { num: '02', title: 'Boundaries & the Two-Adult Rule',             duration: '20 min' },
      { num: '03', title: 'Recognizing Signs of Abuse or Distress',      duration: '30 min' },
      { num: '04', title: 'Mandatory Reporting — Your State\'s Laws',    duration: '20 min' },
      { num: '05', title: 'Incident Documentation & Platform Reporting', duration: '15 min' },
    ],
  },
  {
    id: 'agreements',
    icon: Lock,
    title: 'Legal Agreements',
    desc: 'Review and accept the three documents that govern your participation on the platform.',
    agreements: [
      {
        id: 'safety-agreement',
        title: 'Business Partner Safety Agreement',
        desc: 'Covers verification requirements, supervision standards, mandatory reporting, and annual renewal obligations.',
        href: '/docs/RWP_Business_Partner_Safety_Agreement.pdf',
      },
      {
        id: 'code-of-conduct',
        title: 'Code of Conduct',
        desc: 'Defines standards for professional behavior, communication, equity, and accountability with youth.',
        href: '/docs/RWP_Code_of_Conduct.pdf',
      },
      {
        id: 'youth-safety-policy',
        title: 'Youth Safety Policy',
        desc: 'Our platform-wide safety standards, shared responsibility model, and incident response procedures.',
        href: '/docs/RWP_Youth_Safety_Policy.pdf',
      },
    ],
  },
]

const TRUST_SIGNALS = [
  'Background checks initiated within 2 business days',
  'Verification typically completed in 5–7 business days',
  'Verified Partner badge displayed on your public profile',
  'Annual renewal keeps your status current',
]

export default function VerifyPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [fieldValues, setFieldValues] = useState<Record<string, string | boolean>>({})
  const [checkedAgreements, setCheckedAgreements] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const step = STEPS[activeStep]
  const totalSteps = STEPS.length
  const allAgreementsChecked = STEPS[4].agreements?.every(a => checkedAgreements.has(a.id))

  const markComplete = async () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]))
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1)
    } else {
      setSubmitting(true)
      const supabase = createClient()
      const supervisorEmail = fieldValues['sup-email'] as string
      await supabase.from('pathway_site_applications').update({
        ein:              (fieldValues['ein'] as string) || undefined,
        insurance_amount: (fieldValues['coverage'] as string) || undefined,
        insurance_exp:    (fieldValues['exp'] as string) || undefined,
        bg_check:         'Submitted',
        training:         fieldValues['training-confirm'] ? 'Confirmed' : 'Not Started',
        doc_safety:       checkedAgreements.has('safety-agreement'),
        doc_conduct:      checkedAgreements.has('code-of-conduct'),
        doc_youth:        checkedAgreements.has('youth-safety-policy'),
      }).eq('contact_email', supervisorEmail)
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const canContinue = () => {
    if (activeStep === STEPS.length - 1) return allAgreementsChecked
    return true
  }

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successInner}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={48} />
          </div>
          <h1 className={styles.successH1}>Application Submitted</h1>
          <p className={styles.successSub}>
            Thank you for completing your verification. Our Trust & Safety team will review your submission and follow up within <strong>5–7 business days</strong>.
          </p>
          <div className={styles.successSteps}>
            <p className={styles.successStepsLabel}>What happens next:</p>
            {[
              'Your background check is initiated (2 business days)',
              'Insurance and business documents are reviewed',
              'Your supervisor receives the Youth Safety Orientation link',
              'You receive an email confirming Verified Partner status',
              'Your profile goes live in the RWP marketplace',
            ].map((item, i) => (
              <div key={i} className={styles.successStep}>
                <span className={styles.successStepNum}>{i + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className={styles.successActions}>
            <Link href="/dashboard" className={styles.btnPrimary}>
              Go to Dashboard <ChevronRight size={16} />
            </Link>
            <Link href="/home" className={styles.btnOutline}>Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <Link href="/home" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wwk-transparent.png" alt="RWP" className={styles.logoImg} />
          <span className={styles.logoText}>Real-World Pathways™</span>
        </Link>
        <div className={styles.headerBadge}>
          <ShieldCheck size={14} />
          <span>Partner Verification</span>
        </div>
      </header>

      <div className={styles.layout}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <p className={styles.sidebarTitle}>Verification Checklist</p>

            <div className={styles.stepList}>
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const isComplete = completedSteps.has(i)
                const isActive = activeStep === i
                return (
                  <button
                    key={s.id}
                    className={`${styles.stepBtn} ${isActive ? styles.stepBtnActive : ''} ${isComplete ? styles.stepBtnComplete : ''}`}
                    onClick={() => setActiveStep(i)}
                  >
                    <span className={styles.stepBtnIcon}>
                      {isComplete ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </span>
                    <span className={styles.stepBtnLabel}>{s.title}</span>
                    {isComplete && <span className={styles.stepBtnCheck}><CheckCircle2 size={14} /></span>}
                  </button>
                )
              })}
            </div>

            <div className={styles.sidebarDivider} />

            <div className={styles.trustBlock}>
              <p className={styles.trustBlockTitle}>
                <ShieldCheck size={14} className={styles.trustBlockIcon} />
                RWP Verified Partner™
              </p>
              {TRUST_SIGNALS.map(t => (
                <p key={t} className={styles.trustSignal}>
                  <span className={styles.trustDot} />
                  {t}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className={styles.main}>

          {/* Progress bar */}
          <div className={styles.progressBar}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`${styles.progressSeg} ${i <= activeStep ? styles.progressSegFilled : ''} ${completedSteps.has(i) ? styles.progressSegDone : ''}`}
              />
            ))}
          </div>

          <div className={styles.mainInner}>
            <div className={styles.stepMeta}>
              <span className={styles.stepCounter}>Step {activeStep + 1} of {totalSteps}</span>
              {completedSteps.has(activeStep) && (
                <span className={styles.completeBadge}><CheckCircle2 size={13} /> Complete</span>
              )}
            </div>

            <h1 className={styles.stepTitle}>{step.title}</h1>
            <p className={styles.stepDesc}>{step.desc}</p>

            {/* ── STEP: BUSINESS / INSURANCE / BACKGROUND ── */}
            {step.items && step.id !== 'training' && step.id !== 'agreements' && (
              <div className={styles.formGrid}>
                {step.items.map(item => (
                  <div key={item.id} className={`${styles.fieldGroup} ${item.type === 'checkbox' ? styles.fieldGroupFull : ''}`}>
                    {item.type === 'checkbox' ? (
                      <label className={styles.checkboxRow}>
                        <span
                          className={`${styles.checkbox} ${fieldValues[item.id] ? styles.checkboxChecked : ''}`}
                          onClick={() => setFieldValues(v => ({ ...v, [item.id]: !v[item.id] }))}
                        >
                          {fieldValues[item.id] && (
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        <span className={styles.checkboxLabel}>{item.label}</span>
                      </label>
                    ) : item.type === 'upload' ? (
                      <>
                        <label className={styles.label}>{item.label}</label>
                        <label className={styles.uploadZone}>
                          <Upload size={20} className={styles.uploadIcon} />
                          <span className={styles.uploadText}>
                            {fieldValues[item.id] ? (fieldValues[item.id] as string) : 'Click to upload or drag & drop'}
                          </span>
                          <span className={styles.uploadSub}>PDF, PNG, JPG — max 10MB</span>
                          <input
                            type="file"
                            className={styles.uploadInput}
                            onChange={e => setFieldValues(v => ({ ...v, [item.id]: e.target.files?.[0]?.name || '' }))}
                          />
                        </label>
                      </>
                    ) : item.type === 'select' ? (
                      <>
                        <label className={styles.label}>{item.label}</label>
                        <select
                          className={styles.select}
                          value={(fieldValues[item.id] as string) || ''}
                          onChange={e => setFieldValues(v => ({ ...v, [item.id]: e.target.value }))}
                        >
                          <option value="">Select amount</option>
                          {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </>
                    ) : item.type === 'date' ? (
                      <>
                        <label className={styles.label}>{item.label}</label>
                        <input
                          type="date"
                          className={styles.input}
                          value={(fieldValues[item.id] as string) || ''}
                          onChange={e => setFieldValues(v => ({ ...v, [item.id]: e.target.value }))}
                        />
                      </>
                    ) : (
                      <>
                        <label className={styles.label}>{item.label}</label>
                        <input
                          className={styles.input}
                          placeholder={item.placeholder}
                          value={(fieldValues[item.id] as string) || ''}
                          onChange={e => setFieldValues(v => ({ ...v, [item.id]: e.target.value }))}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP: TRAINING ── */}
            {step.id === 'training' && (
              <div className={styles.trainingContent}>
                <div className={styles.moduleList}>
                  {step.trainingModules?.map(m => (
                    <div key={m.num} className={styles.moduleRow}>
                      <span className={styles.moduleNum}>{m.num}</span>
                      <span className={styles.moduleTitle}>{m.title}</span>
                      <span className={styles.moduleDuration}>
                        <Clock size={12} />
                        {m.duration}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.trainingNote}>
                  <AlertCircle size={15} className={styles.trainingNoteIcon} />
                  <p>The orientation link will be sent to your designated supervisor's email after your application is approved. Training must be completed before your first experience is posted.</p>
                </div>
                {step.items?.map(item => (
                  <label key={item.id} className={styles.checkboxRow}>
                    <span
                      className={`${styles.checkbox} ${fieldValues[item.id] ? styles.checkboxChecked : ''}`}
                      onClick={() => setFieldValues(v => ({ ...v, [item.id]: !v[item.id] }))}
                    >
                      {fieldValues[item.id] && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    <span className={styles.checkboxLabel}>{item.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* ── STEP: AGREEMENTS ── */}
            {step.id === 'agreements' && step.agreements && (
              <div className={styles.agreementList}>
                {step.agreements.map(a => (
                  <div key={a.id} className={`${styles.agreementCard} ${checkedAgreements.has(a.id) ? styles.agreementCardSigned : ''}`}>
                    <div className={styles.agreementTop}>
                      <div className={styles.agreementInfo}>
                        <p className={styles.agreementTitle}>{a.title}</p>
                        <p className={styles.agreementDesc}>{a.desc}</p>
                      </div>
                      <a href={a.href} target="_blank" rel="noopener noreferrer" className={styles.agreementRead}>
                        Read <ChevronRight size={14} />
                      </a>
                    </div>
                    <label className={styles.agreementCheckRow}>
                      <span
                        className={`${styles.checkbox} ${checkedAgreements.has(a.id) ? styles.checkboxChecked : ''}`}
                        onClick={() => setCheckedAgreements(prev => {
                          const next = new Set(prev)
                          next.has(a.id) ? next.delete(a.id) : next.add(a.id)
                          return next
                        })}
                      >
                        {checkedAgreements.has(a.id) && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </span>
                      <span className={styles.checkboxLabel}>
                        I have read and agree to the <strong>{a.title}</strong>
                      </span>
                    </label>
                  </div>
                ))}
                {allAgreementsChecked && (
                  <div className={styles.allSignedNote}>
                    <CheckCircle2 size={16} />
                    All three documents accepted. You're ready to submit.
                  </div>
                )}
              </div>
            )}

            {/* ── NOTE (background step) ── */}
            {step.note && (
              <div className={styles.infoNote}>
                <AlertCircle size={15} className={styles.infoNoteIcon} />
                <p>{step.note}</p>
              </div>
            )}

            {/* ── ACTIONS ── */}
            <div className={styles.actions}>
              {activeStep > 0 && (
                <button
                  type="button"
                  className={styles.btnBack}
                  onClick={() => setActiveStep(s => s - 1)}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                className={styles.btnNext}
                onClick={markComplete}
                disabled={!canContinue() || submitting}
              >
                {submitting ? 'Submitting…' : activeStep === totalSteps - 1 ? 'Submit Verification Application' : 'Save & Continue'}
                {!submitting && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
