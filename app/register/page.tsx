'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Lock, TrendingUp, Users, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './register.module.css'

/* ─── Data ─── */

const ORG_TYPES = [
  {
    id: 'k12', label: 'K-12 School',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'nonprofit', label: 'Nonprofit Organization',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  },
  {
    id: 'afterschool', label: 'After-School Program',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    id: 'faithbased', label: 'Faith-Based Organization',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M3 22V10l9-8 9 8v12"/><path d="M9 22V12h6v10"/><path d="M12 2v4"/></svg>,
  },
  {
    id: 'community', label: 'Community Organization',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    id: 'other', label: 'Other',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
  },
]

const INDUSTRIES = [
  { id: 'healthcare',     label: 'Healthcare',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { id: 'finance',        label: 'Finance',         icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { id: 'technology',     label: 'Technology',      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { id: 'manufacturing',  label: 'Manufacturing',   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'skilled-trades', label: 'Skilled Trades',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> },
  { id: 'logistics',      label: 'Logistics',       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { id: 'hospitality',    label: 'Hospitality',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> },
  { id: 'retail',         label: 'Retail',          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { id: 'government',     label: 'Government',      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M3 22V10l9-8 9 8v12"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'nonprofit',      label: 'Nonprofit',       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { id: 'other',          label: 'Other',           icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg> },
]

const EXP_TYPES = [
  { id: 'site-visits',           label: 'Site Visits',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'job-shadows',           label: 'Job Shadows',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg> },
  { id: 'career-panels',         label: 'Career Panels',         icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { id: 'mentorships',           label: 'Mentorships',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { id: 'internships',           label: 'Internships',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
  { id: 'project-partnerships',  label: 'Project Partnerships',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
]

const INTEREST_AREAS = ['STEM','Healthcare','Entrepreneurship','Finance','Skilled Trades','Technology','Creative Arts','Civic Leadership','Other']
const GRADES = ['K–2','3–5','6–8','9–12','K–12','Mixed']
const COMPANY_SIZES = ['1–10 employees','11–50 employees','51–200 employees','201–500 employees','500–1,000 employees','1,000+ employees']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const TRUST_ITEMS = [
  { Icon: ShieldCheck, label: 'Youth Safety First',   desc: 'Every experience on our platform follows strict safety standards.' },
  { Icon: Lock,        label: 'Privacy Protected',    desc: 'We protect your data and your community\'s information.' },
  { Icon: TrendingUp,  label: 'Built for Impact',     desc: 'Structured partnerships that create measurable outcomes for youth.' },
  { Icon: Users,       label: 'Stronger Together',    desc: 'Schools, organizations, and businesses building pathways for the future.' },
]

/* ─── Main Component ─── */

function RegisterContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get('type') || 'org'
  const isOrg = type !== 'biz'

  const [step, setStep]       = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted,  setSubmitted]  = useState(false)

  // Org form state
  const [orgType,      setOrgType]      = useState('')
  const [orgName,      setOrgName]      = useState('')
  const [orgCity,      setOrgCity]      = useState('')
  const [orgState,     setOrgState]     = useState('')
  const [orgZip,       setOrgZip]       = useState('')
  const [orgGrades,    setOrgGrades]    = useState('')
  const [orgStudents,  setOrgStudents]  = useState('')
  const [orgNotes,     setOrgNotes]     = useState('')
  const [orgExpTypes,  setOrgExpTypes]  = useState(EXP_TYPES.map(e => e.id))
  const [orgInterests, setOrgInterests] = useState<string[]>([])
  const [cName,        setCName]        = useState('')
  const [cTitle,       setCTitle]       = useState('')
  const [cEmail,       setCEmail]       = useState('')
  const [cPhone,       setCPhone]       = useState('')
  const [agreed,       setAgreed]       = useState(false)

  // Biz form state
  const [industry,     setIndustry]     = useState('')
  const [bizName,      setBizName]      = useState('')
  const [bizSize,      setBizSize]      = useState('')
  const [bizCity,      setBizCity]      = useState('')
  const [bizState,     setBizState]     = useState('')
  const [bizWebsite,   setBizWebsite]   = useState('')
  const [bizLinkedin,  setBizLinkedin]  = useState('')
  const [bizExpTypes,  setBizExpTypes]  = useState(EXP_TYPES.map(e => e.id))
  const [availability, setAvailability] = useState<'one-time'|'recurring'>('recurring')
  const [months,       setMonths]       = useState<string[]>(['Jun','Jul','Aug','Sep'])
  const [bName,        setBName]        = useState('')
  const [bTitle,       setBTitle]       = useState('')
  const [bEmail,       setBEmail]       = useState('')
  const [bPhone,       setBPhone]       = useState('')
  const [motivation,   setMotivation]   = useState('')

  // Shared account
  const [password,     setPassword]     = useState('')
  const [showPw,       setShowPw]       = useState(false)

  const toggle = (list: string[], set: (l: string[]) => void, item: string) =>
    set(list.includes(item) ? list.filter(i => i !== item) : [...list, item])

  const canAdvance = () => {
    if (step === 1) return isOrg ? !!orgType : !!industry
    return true
  }

  const handleNext = async () => {
    if (step < 4) { setStep(s => s + 1); return }

    setSubmitting(true)
    setSubmitError('')
    const supabase = createClient()

    if (isOrg) {
      if (!cEmail || !password) {
        setSubmitError('Please enter your email and a password.')
        setSubmitting(false)
        return
      }
      const { error } = await supabase.auth.signUp({ email: cEmail, password })
      if (error) {
        setSubmitError(error.message)
        setSubmitting(false)
        return
      }
      await supabase.from('impact_organizations').insert({
        org_type:     orgType,
        org_name:     orgName,
        city:         orgCity,
        state:        orgState,
        zip:          orgZip,
        grades:       orgGrades,
        students:     orgStudents,
        notes:        orgNotes,
        exp_types:    orgExpTypes,
        interests:    orgInterests,
        contact_name: cName,
        contact_title:cTitle,
        contact_email:cEmail,
        contact_phone:cPhone,
      })
      router.push('/dashboard')
    } else {
      await supabase.from('pathway_site_applications').insert({
        company:          bizName,
        industry,
        city:             bizCity,
        contact_name:     bName,
        contact_email:    bEmail,
        experiences:      bizExpTypes,
        status:           'pending',
        bg_check:         'Not Submitted',
        training:         'Not Started',
        doc_safety:       false,
        doc_conduct:      false,
        doc_youth:        false,
      })
      setSubmitted(true)
      setSubmitting(false)
    }
  }

  /* ─── Step renderers ─── */

  const renderOrgStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>Let's build opportunities together.</h2>
      <p className={styles.stepSub}>Tell us what type of organization you represent.</p>
      <div className={styles.typeGrid}>
        {ORG_TYPES.map(t => (
          <button
            key={t.id}
            type="button"
            className={`${styles.typeCard} ${orgType === t.id ? styles.typeCardSelected : ''}`}
            onClick={() => setOrgType(t.id)}
          >
            <span className={styles.typeIcon}>{t.icon}</span>
            <span className={styles.typeLabel}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderOrgStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>Tell us about your community.</h2>
      <p className={styles.stepSub}>This helps us match you with the right opportunities.</p>
      <div className={styles.formStack}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Organization Name</label>
          <input className={styles.input} placeholder="Enter organization name" value={orgName} onChange={e => setOrgName(e.target.value)} autoCapitalize="words" autoComplete="organization" />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>City</label>
            <input className={styles.input} placeholder="Enter city" value={orgCity} onChange={e => setOrgCity(e.target.value)} autoCapitalize="words" autoComplete="address-level2" />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>State</label>
            <select className={styles.select} value={orgState} onChange={e => setOrgState(e.target.value)}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>ZIP Code</label>
          <input className={styles.input} placeholder="Enter ZIP code" value={orgZip} onChange={e => setOrgZip(e.target.value)} inputMode="numeric" autoComplete="postal-code" />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Grades Served</label>
            <select className={styles.select} value={orgGrades} onChange={e => setOrgGrades(e.target.value)}>
              <option value="">Select grades</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Approx. # of Students Served</label>
            <input className={styles.input} placeholder="Enter number" value={orgStudents} onChange={e => setOrgStudents(e.target.value)} inputMode="numeric" />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Anything else we should know? <span className={styles.optional}>(optional)</span></label>
          <textarea className={styles.textarea} placeholder="Optional details about your program" value={orgNotes} onChange={e => setOrgNotes(e.target.value)} rows={3} />
        </div>
      </div>
    </div>
  )

  const renderOrgStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>What types of experiences are you hoping to create?</h2>
      <p className={styles.stepSub}>Select all that apply.</p>
      <div className={styles.expCheckGrid}>
        {EXP_TYPES.map(e => (
          <button
            key={e.id}
            type="button"
            className={`${styles.expCheckRow} ${orgExpTypes.includes(e.id) ? styles.expCheckRowSelected : ''}`}
            onClick={() => toggle(orgExpTypes, setOrgExpTypes, e.id)}
          >
            <span className={styles.expCheckIcon}>{e.icon}</span>
            <span className={styles.expCheckLabel}>{e.label}</span>
            <span className={`${styles.checkbox} ${orgExpTypes.includes(e.id) ? styles.checkboxChecked : ''}`}>
              {orgExpTypes.includes(e.id) && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
            </span>
          </button>
        ))}
      </div>
      <p className={styles.interestLabel}>Areas of Interest <span className={styles.optional}>(optional)</span></p>
      <div className={styles.pillWrap}>
        {INTEREST_AREAS.map(a => (
          <button
            key={a}
            type="button"
            className={`${styles.pill} ${orgInterests.includes(a) ? styles.pillSelected : ''}`}
            onClick={() => toggle(orgInterests, setOrgInterests, a)}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  )

  const renderOrgStep4 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>Who should we coordinate with?</h2>
      <p className={styles.stepSub}>This will be our primary contact person.</p>
      <div className={styles.formStack}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Full Name</label>
          <input className={styles.input} placeholder="Enter full name" value={cName} onChange={e => setCName(e.target.value)} autoCapitalize="words" autoComplete="name" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title / Role</label>
          <input className={styles.input} placeholder="Enter your role" value={cTitle} onChange={e => setCTitle(e.target.value)} autoCapitalize="words" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
          <input className={styles.input} type="email" placeholder="Enter email address" value={cEmail} onChange={e => setCEmail(e.target.value)} autoCapitalize="none" autoComplete="email" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Number</label>
          <input className={styles.input} type="tel" placeholder="Enter phone number" value={cPhone} onChange={e => setCPhone(e.target.value)} autoComplete="tel" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Create a Password</label>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              type={showPw ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide' : 'Show'}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <label className={styles.safetyRow}>
          <span className={`${styles.checkbox} ${agreed ? styles.checkboxChecked : ''}`} onClick={() => setAgreed(v => !v)}>
            {agreed && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
          </span>
          <span className={styles.safetyText}>
            <ShieldCheck size={14} className={styles.safetyIcon} />
            Youth safety and privacy are our priority. I agree to the platform{' '}
            <Link href="/terms" className={styles.safetyLink}>terms</Link> and youth safety standards.
          </span>
        </label>
      </div>
    </div>
  )

  const renderBizStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>Help shape the next generation of talent.</h2>
      <p className={styles.stepSub}>Tell us about your business.</p>
      <p className={styles.fieldLabel}>Business Industry</p>
      <div className={styles.industryGrid}>
        {INDUSTRIES.map(ind => (
          <button
            key={ind.id}
            type="button"
            className={`${styles.industryTile} ${industry === ind.id ? styles.industryTileSelected : ''}`}
            onClick={() => setIndustry(ind.id)}
          >
            <span className={styles.industryIcon}>{ind.icon}</span>
            <span className={styles.industryLabel}>{ind.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderBizStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>Tell us about your organization.</h2>
      <p className={styles.stepSub}>This helps us connect the right opportunities.</p>
      <div className={styles.formStack}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Company Name</label>
          <input className={styles.input} placeholder="Enter company name" value={bizName} onChange={e => setBizName(e.target.value)} autoCapitalize="words" autoComplete="organization" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Company Size</label>
          <select className={styles.select} value={bizSize} onChange={e => setBizSize(e.target.value)}>
            <option value="">Select company size</option>
            {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>City</label>
            <input className={styles.input} placeholder="Enter city" value={bizCity} onChange={e => setBizCity(e.target.value)} autoCapitalize="words" autoComplete="address-level2" />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>State</label>
            <select className={styles.select} value={bizState} onChange={e => setBizState(e.target.value)}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Website <span className={styles.optional}>(optional)</span></label>
          <input className={styles.input} placeholder="www.yourcompany.com" value={bizWebsite} onChange={e => setBizWebsite(e.target.value)} inputMode="url" autoCapitalize="none" autoComplete="url" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>LinkedIn Profile <span className={styles.optional}>(optional)</span></label>
          <input className={styles.input} placeholder="https://linkedin.com/company/yourcompany" value={bizLinkedin} onChange={e => setBizLinkedin(e.target.value)} inputMode="url" autoCapitalize="none" />
        </div>
      </div>
    </div>
  )

  const renderBizStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>What experiences can your organization provide?</h2>
      <p className={styles.stepSub}>Select all that apply.</p>
      <div className={styles.expCheckGrid}>
        {EXP_TYPES.map(e => (
          <button
            key={e.id}
            type="button"
            className={`${styles.expCheckRow} ${bizExpTypes.includes(e.id) ? styles.expCheckRowSelected : ''}`}
            onClick={() => toggle(bizExpTypes, setBizExpTypes, e.id)}
          >
            <span className={styles.expCheckIcon}>{e.icon}</span>
            <span className={styles.expCheckLabel}>{e.label}</span>
            <span className={`${styles.checkbox} ${bizExpTypes.includes(e.id) ? styles.checkboxChecked : ''}`}>
              {bizExpTypes.includes(e.id) && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
            </span>
          </button>
        ))}
      </div>

      <p className={styles.interestLabel}>Availability</p>
      <div className={styles.availRow}>
        {(['one-time','recurring'] as const).map(opt => (
          <button
            key={opt}
            type="button"
            className={`${styles.availBtn} ${availability === opt ? styles.availBtnSelected : ''}`}
            onClick={() => setAvailability(opt)}
          >
            <span className={`${styles.radio} ${availability === opt ? styles.radioSelected : ''}`} />
            {opt === 'one-time' ? 'One-Time' : 'Recurring'}
          </button>
        ))}
      </div>

      <p className={styles.interestLabel}>Preferred Months</p>
      <div className={styles.monthGrid}>
        {MONTHS.map(m => (
          <button
            key={m}
            type="button"
            className={`${styles.monthPill} ${months.includes(m) ? styles.monthPillSelected : ''}`}
            onClick={() => toggle(months, setMonths, m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )

  const renderBizStep4 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>Who will lead your partnership efforts?</h2>
      <p className={styles.stepSub}>We'll use this to stay in touch and support you.</p>
      <div className={styles.formStack}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Full Name</label>
          <input className={styles.input} placeholder="Enter full name" value={bName} onChange={e => setBName(e.target.value)} autoCapitalize="words" autoComplete="name" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} placeholder="Enter your title" value={bTitle} onChange={e => setBTitle(e.target.value)} autoCapitalize="words" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
          <input className={styles.input} type="email" placeholder="Enter email address" value={bEmail} onChange={e => setBEmail(e.target.value)} autoCapitalize="none" autoComplete="email" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Number</label>
          <input className={styles.input} type="tel" placeholder="Enter phone number" value={bPhone} onChange={e => setBPhone(e.target.value)} autoComplete="tel" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>What motivates your organization to participate? <span className={styles.optional}>(optional)</span></label>
          <textarea className={styles.textarea} placeholder="Optional" value={motivation} onChange={e => setMotivation(e.target.value)} rows={3} />
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    if (isOrg) {
      if (step === 1) return renderOrgStep1()
      if (step === 2) return renderOrgStep2()
      if (step === 3) return renderOrgStep3()
      return renderOrgStep4()
    } else {
      if (step === 1) return renderBizStep1()
      if (step === 2) return renderBizStep2()
      if (step === 3) return renderBizStep3()
      return renderBizStep4()
    }
  }

  const submitLabel = isOrg ? 'Create Organization Profile →' : 'Submit Application →'

  if (submitted) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px 24px', background: '#FDFBFF' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <ShieldCheck size={32} color="#3A8C6E" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3C88', marginBottom: 12 }}>Application Received!</h1>
          <p style={{ fontSize: 15, color: '#555', maxWidth: 420, lineHeight: 1.6, marginBottom: 32 }}>
            Thank you for applying to become a Certified Pathway Site™. Our team will review your application and reach out within <strong>3–5 business days</strong>.
          </p>
          <Link href="/home" style={{ background: '#6B5A8E', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* ── LEFT PANEL ── */}
        <aside className={styles.left}>
          <div className={styles.leftBg} aria-hidden="true" />
          <div className={styles.leftInner}>
            <Link href="/home" className={styles.leftLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-wwk-transparent.png" alt="Real-World Pathways™" className={styles.leftLogoImg} />
              <span className={styles.leftLogoText}>Real-World Pathways™<br /><span className={styles.leftLogoBy}>by WealthWise Kids®</span></span>
            </Link>

            <span className={`${styles.flowBadge} ${!isOrg ? styles.flowBadgeBiz : ''}`}>
              {isOrg ? 'FLOW 1' : 'FLOW 2'}
            </span>

            <h2 className={styles.leftTitle}>
              {isOrg ? 'For Schools &\nOrganizations' : 'For Businesses'}
            </h2>
            <p className={styles.leftDesc}>
              {isOrg
                ? 'Together, we create real-world experiences that expand opportunity and build brighter futures for our students.'
                : 'Help shape the next generation of talent and build stronger communities through real-world experiences.'}
            </p>
            {!isOrg && (
              <p className={styles.leftGold}>
                Your partnership today builds the <strong>workforce of tomorrow.</strong>
              </p>
            )}
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className={styles.right}>

          {/* Step header */}
          <div className={styles.stepHeader}>
            <span className={styles.stepLabel}>Step {step} of 4</span>
            <div className={styles.progressBar}>
              {[1,2,3,4].map(n => (
                <div key={n} className={`${styles.progressSeg} ${n <= step ? styles.progressSegFilled : ''}`} />
              ))}
            </div>
          </div>

          {/* Step content — scrollable */}
          <div className={styles.stepScroll}>
            {renderStep()}
          </div>

          {/* Actions */}
          {submitError && (
            <p style={{ color: '#C0392B', fontSize: 13, padding: '0 24px 8px', textAlign: 'center' }} role="alert">
              {submitError}
            </p>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnBack}
              onClick={() => setStep(s => s - 1)}
              style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
            >
              Back
            </button>
            <button
              type="button"
              className={styles.btnNext}
              onClick={handleNext}
              disabled={!canAdvance() || submitting}
            >
              {submitting ? 'Submitting…' : step === 4 ? submitLabel : 'Next'}
            </button>
          </div>
        </main>
      </div>

      {/* ── TRUST BAR ── */}
      <div className={styles.trustBar}>
        {TRUST_ITEMS.map(t => (
          <div key={t.label} className={styles.trustItem}>
            <t.Icon size={20} className={styles.trustIcon} />
            <div>
              <p className={styles.trustLabel}>{t.label}</p>
              <p className={styles.trustDesc}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
}
