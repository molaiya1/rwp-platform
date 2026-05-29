'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2, CheckCircle2, Clock, AlertTriangle, XCircle,
  Plus, ChevronRight, Users, Calendar, MapPin, LogOut,
  Briefcase, ShieldCheck, Star, MessageSquare,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Toast, { type ToastData } from '@/app/components/Toast'
import styles from './portal.module.css'

type AppStatus = 'pending' | 'approved' | 'flagged' | 'denied'

interface Application {
  id: string
  company: string
  industry: string
  city: string
  contact_name: string
  contact_email: string
  status: AppStatus
  experiences: string[]
  bg_check: string
  training: string
  doc_safety: boolean
  doc_conduct: boolean
  doc_youth: boolean
  flag_note: string | null
  submitted_at: string
}

interface FieldLab {
  id: string
  title: string
  type: string
  description: string
  capacity: number
  duration: string
  grade_levels: string
  location: string
  is_virtual: boolean
  status: string
  created_at: string
}

interface Request {
  id: string
  field_lab_id: string
  org_name: string
  contact_name: string
  contact_email: string
  student_count: number
  grade_level: string
  preferred_date: string
  message: string
  status: string
  created_at: string
  field_labs: { title: string } | null
}

const EXP_TYPES = ['Site Visit', 'Job Shadow', 'Career Panel', 'Mentorship', 'Internship', 'Project Partnership']

export const dynamic = 'force-dynamic'

export default function PortalPage() {
  const router = useRouter()

  const [loading, setLoading]       = useState(true)
  const [app, setApp]               = useState<Application | null>(null)
  const [fieldLabs, setFieldLabs]   = useState<FieldLab[]>([])
  const [requests, setRequests]     = useState<Request[]>([])
  const [tab, setTab]               = useState<'overview' | 'labs' | 'requests'>('overview')
  const [showAddLab, setShowAddLab] = useState(false)
  const [savingLab, setSavingLab]   = useState(false)
  const [toasts, setToasts]         = useState<ToastData[]>([])

  const addToast = (message: string, type: ToastData['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }
  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  // New Field Lab form state
  const [labTitle, setLabTitle]       = useState('')
  const [labType, setLabType]         = useState('Site Visit')
  const [labDesc, setLabDesc]         = useState('')
  const [labCapacity, setLabCapacity] = useState('30')
  const [labDuration, setLabDuration] = useState('')
  const [labGrades, setLabGrades]     = useState('')
  const [labLocation, setLabLocation] = useState('')
  const [labVirtual, setLabVirtual]   = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?redirect=/portal'); return }

      const { data: appData } = await supabase
        .from('pathway_site_applications')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!appData) { setLoading(false); return }
      setApp(appData)

      if (appData.status === 'approved') {
        const { data: labs } = await supabase
          .from('field_labs')
          .select('*')
          .eq('business_id', appData.id)
          .order('created_at', { ascending: false })
        setFieldLabs(labs ?? [])

        const labIds = (labs ?? []).map((l: FieldLab) => l.id)
        if (labIds.length > 0) {
          const { data: reqs } = await supabase
            .from('field_lab_requests')
            .select('*, field_labs(title)')
            .in('field_lab_id', labIds)
            .order('created_at', { ascending: false })
          setRequests(reqs ?? [])
        }
      }
      setLoading(false)
    }
    load()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/home')
  }

  const handleUpdateRequest = async (reqId: string, status: 'confirmed' | 'declined') => {
    const supabase = createClient()
    await supabase.from('field_lab_requests').update({ status }).eq('id', reqId)
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r))
    addToast(status === 'confirmed' ? 'Session confirmed — the organization will be notified.' : 'Request declined.', status === 'confirmed' ? 'success' : 'warning')
  }

  const handleAddLab = async () => {
    if (!app || !labTitle.trim()) return
    setSavingLab(true)
    const supabase = createClient()
    const { data } = await supabase.from('field_labs').insert({
      business_id: app.id,
      title:       labTitle,
      type:        labType,
      description: labDesc,
      capacity:    parseInt(labCapacity) || 30,
      duration:    labDuration,
      grade_levels: labGrades,
      location:    labVirtual ? 'Virtual' : labLocation,
      is_virtual:  labVirtual,
      status:      'active',
    }).select().single()
    if (data) setFieldLabs(prev => [data, ...prev])
    setLabTitle(''); setLabType('Site Visit'); setLabDesc('')
    setLabCapacity('30'); setLabDuration(''); setLabGrades('')
    setLabLocation(''); setLabVirtual(false)
    setShowAddLab(false)
    setSavingLab(false)
    addToast('Field Lab saved and now visible in the marketplace.')
  }

  if (loading) {
    return (
      <div className={styles.loadWrap}>
        <div className={styles.loadSpinner} />
        <p className={styles.loadText}>Loading your portal…</p>
      </div>
    )
  }

  if (!app) {
    return (
      <div className={styles.loadWrap}>
        <p className={styles.loadText}>No application found. <Link href="/register?type=biz" className={styles.link}>Apply now →</Link></p>
      </div>
    )
  }

  const pendingRequests   = requests.filter(r => r.status === 'pending')
  const confirmedRequests = requests.filter(r => r.status === 'confirmed')
  const totalStudentsReached = confirmedRequests.reduce((sum, r) => sum + (r.student_count || 0), 0)
  const totalCapacity        = fieldLabs.reduce((sum, l) => sum + (l.capacity || 0), 0)
  const uniqueOrgs           = new Set(requests.map(r => r.org_name || r.contact_name)).size

  const statusConfig: Record<AppStatus, { icon: React.ReactNode; label: string; color: string; bg: string; message: string }> = {
    pending: {
      icon: <Clock size={20} />,
      label: 'Application Under Review',
      color: '#B45309',
      bg: '#FFFBEB',
      message: 'Our team is reviewing your application. This typically takes 3–5 business days. We\'ll reach out to your contact email once a decision is made.',
    },
    approved: {
      icon: <CheckCircle2 size={20} />,
      label: 'Certified Pathway Site™',
      color: '#166534',
      bg: '#F0FFF4',
      message: 'Your business is an approved Pathway Site. You can now post Field Labs and start receiving requests from schools and nonprofits.',
    },
    flagged: {
      icon: <AlertTriangle size={20} />,
      label: 'Action Required',
      color: '#B45309',
      bg: '#FFFBEB',
      message: app.flag_note ?? 'Your application requires additional information. Please contact us to resolve the outstanding items.',
    },
    denied: {
      icon: <XCircle size={20} />,
      label: 'Application Not Approved',
      color: '#991B1B',
      bg: '#FFF5F5',
      message: app.flag_note ?? 'Unfortunately we were unable to approve your application at this time. Please contact us if you have questions.',
    },
  }

  const status = statusConfig[app.status]

  const checklist = [
    { label: 'Background Check',    value: app.bg_check,    done: app.bg_check === 'Cleared' || app.bg_check === 'Submitted' },
    { label: 'Safety Training',     value: app.training,    done: app.training === 'Complete' },
    { label: 'Safety Policy Doc',   value: app.doc_safety   ? 'On file' : 'Not submitted', done: app.doc_safety   },
    { label: 'Code of Conduct',     value: app.doc_conduct  ? 'On file' : 'Not submitted', done: app.doc_conduct  },
    { label: 'Youth Protection Doc',value: app.doc_youth    ? 'On file' : 'Not submitted', done: app.doc_youth    },
  ]

  return (
    <div className={styles.page}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wwk-transparent.png" alt="Real-World Pathways™" className={styles.headerLogoImg} />
            <div>
              <span className={styles.headerLogoTitle}>Pathway Site Portal</span>
              <span className={styles.headerLogoSub}>Real-World Pathways™</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerCompany}>
              <Building2 size={15} />
              <span>{app.company}</span>
            </div>
            <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className={styles.body}>

        {/* ── STATUS BANNER ── */}
        <div className={styles.statusBanner} style={{ background: status.bg, borderColor: status.color + '33' }}>
          <div className={styles.statusIcon} style={{ color: status.color }}>{status.icon}</div>
          <div className={styles.statusText}>
            <p className={styles.statusLabel} style={{ color: status.color }}>{status.label}</p>
            <p className={styles.statusMsg}>{status.message}</p>
          </div>
        </div>

        {/* ── TABS (approved only) ── */}
        {app.status === 'approved' && (
          <div className={styles.tabs}>
            {([
              { key: 'overview',  label: 'Overview' },
              { key: 'labs',      label: `Field Labs (${fieldLabs.length})` },
              { key: 'requests',  label: `Requests ${pendingRequests.length > 0 ? `(${pendingRequests.length} new)` : ''}` },
            ] as const).map(t => (
              <button
                key={t.key}
                type="button"
                className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {(tab === 'overview' || app.status !== 'approved') && (
          <div className={styles.grid}>

            {/* Profile card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}><Briefcase size={16} /> Business Profile</h2>
              <div className={styles.profileGrid}>
                <div className={styles.profileRow}><span className={styles.profileKey}>Company</span><span className={styles.profileVal}>{app.company}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>Industry</span><span className={styles.profileVal} style={{ textTransform: 'capitalize' }}>{app.industry}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>Location</span><span className={styles.profileVal}>{app.city}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>Contact</span><span className={styles.profileVal}>{app.contact_name}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>Email</span><span className={styles.profileVal}>{app.contact_email}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>Applied</span><span className={styles.profileVal}>{new Date(app.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
              </div>
            </div>

            {/* Checklist */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}><ShieldCheck size={16} /> Certification Checklist</h2>
              <p className={styles.cardSub}>Required to become a Certified Pathway Site™</p>
              <div className={styles.checklist}>
                {checklist.map(item => (
                  <div key={item.label} className={styles.checklistItem}>
                    <span className={`${styles.checkDot} ${item.done ? styles.checkDotDone : styles.checkDotPending}`}>
                      {item.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    </span>
                    <div className={styles.checkBody}>
                      <span className={styles.checkLabel}>{item.label}</span>
                      <span className={styles.checkValue}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiences offered */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}><Star size={16} /> Experiences You Offer</h2>
              <div className={styles.expPills}>
                {(app.experiences ?? []).map(e => (
                  <span key={e} className={styles.expPill}>{e}</span>
                ))}
                {(!app.experiences || app.experiences.length === 0) && (
                  <p className={styles.cardSub}>No experience types selected.</p>
                )}
              </div>
            </div>

            {/* Stats (approved only) */}
            {app.status === 'approved' && (
              <>
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}><Users size={16} /> Talent Pipeline Dashboard</h2>
                  <p className={styles.cardSub}>Your real-world impact — updated as schools confirm sessions.</p>
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{totalStudentsReached}</span>
                      <span className={styles.statLabel}>Students Reached</span>
                      <span className={styles.statSub}>confirmed sessions</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{uniqueOrgs}</span>
                      <span className={styles.statLabel}>Partner Organizations</span>
                      <span className={styles.statSub}>schools &amp; nonprofits</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{fieldLabs.filter(l => l.status === 'active').length}</span>
                      <span className={styles.statLabel}>Active Field Labs</span>
                      <span className={styles.statSub}>up to {totalCapacity} seats total</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{pendingRequests.length}</span>
                      <span className={styles.statLabel}>Awaiting Your Response</span>
                      <span className={styles.statSub}>action needed</span>
                    </div>
                  </div>
                </div>

                <div className={styles.moatBanner}>
                  <div className={styles.moatBannerIcon}><Star size={18} /></div>
                  <div className={styles.moatBannerBody}>
                    <p className={styles.moatBannerTitle}>Your employer brand is building with every Field Lab.</p>
                    <p className={styles.moatBannerSub}>
                      Each confirmed session adds to your verified community impact record — and gives you real data on students who've experienced your workplace firsthand.
                      RWP tracks participation, outcomes, and employer brand exposure so you can demonstrate community ROI with numbers, not anecdotes.
                    </p>
                  </div>
                  <Link href="/safety" className={styles.moatBannerCta}>How it works <ChevronRight size={14} /></Link>
                </div>
              </>
            )}

          </div>
        )}

        {/* ── FIELD LABS TAB ── */}
        {tab === 'labs' && app.status === 'approved' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHead}>
              <div>
                <h2 className={styles.tabTitle}>Your Field Labs</h2>
                <p className={styles.tabSub}>These are the experiences you're offering to schools and nonprofits.</p>
              </div>
              <button type="button" className={styles.addBtn} onClick={() => setShowAddLab(true)}>
                <Plus size={15} /> Add Field Lab
              </button>
            </div>

            {/* Add Lab Form */}
            {showAddLab && (
              <div className={styles.addLabForm}>
                <h3 className={styles.addLabTitle}>New Field Lab</h3>
                <div className={styles.addLabGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Title</label>
                    <input className={styles.input} placeholder="e.g. Behind the Scenes: Hospital Operations" value={labTitle} onChange={e => setLabTitle(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Experience Type</label>
                    <select className={styles.select} value={labType} onChange={e => setLabType(e.target.value)}>
                      {EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className={styles.fieldGroupFull}>
                    <label className={styles.label}>Description</label>
                    <textarea className={styles.textarea} rows={3} placeholder="What will students experience?" value={labDesc} onChange={e => setLabDesc(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Max Capacity</label>
                    <input className={styles.input} type="number" value={labCapacity} onChange={e => setLabCapacity(e.target.value)} min="1" />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Duration</label>
                    <input className={styles.input} placeholder="e.g. 2–4 hrs, Half day" value={labDuration} onChange={e => setLabDuration(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Grade Levels</label>
                    <input className={styles.input} placeholder="e.g. Grades 6–12" value={labGrades} onChange={e => setLabGrades(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Location</label>
                    <input className={styles.input} placeholder="City, State" value={labVirtual ? 'Virtual' : labLocation} disabled={labVirtual} onChange={e => setLabLocation(e.target.value)} />
                  </div>
                  <div className={styles.fieldGroup} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
                    <input type="checkbox" id="virtual" checked={labVirtual} onChange={e => setLabVirtual(e.target.checked)} style={{ width: 16, height: 16 }} />
                    <label htmlFor="virtual" className={styles.label} style={{ margin: 0 }}>This is a virtual experience</label>
                  </div>
                </div>
                <div className={styles.addLabActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowAddLab(false)}>Cancel</button>
                  <button type="button" className={styles.saveBtn} onClick={handleAddLab} disabled={savingLab || !labTitle.trim()}>
                    {savingLab ? 'Saving…' : 'Save Field Lab'}
                  </button>
                </div>
              </div>
            )}

            {fieldLabs.length === 0 && !showAddLab && (
              <div className={styles.emptyState}>
                <Building2 size={40} className={styles.emptyIcon} />
                <p className={styles.emptyTitle}>No Field Labs yet</p>
                <p className={styles.emptySub}>Add your first Field Lab so schools and nonprofits can find and request your experiences.</p>
                <button type="button" className={styles.addBtn} onClick={() => setShowAddLab(true)}>
                  <Plus size={15} /> Add Your First Field Lab
                </button>
              </div>
            )}

            <div className={styles.labsList}>
              {fieldLabs.map(lab => (
                <div key={lab.id} className={styles.labCard}>
                  <div className={styles.labCardTop}>
                    <div>
                      <span className={styles.labType}>{lab.type}</span>
                      <h3 className={styles.labTitle}>{lab.title}</h3>
                    </div>
                    <span className={`${styles.labStatus} ${lab.status === 'active' ? styles.labStatusActive : ''}`}>
                      {lab.status}
                    </span>
                  </div>
                  {lab.description && <p className={styles.labDesc}>{lab.description}</p>}
                  <div className={styles.labMeta}>
                    {lab.capacity && <span><Users size={12} /> Up to {lab.capacity} students</span>}
                    {lab.duration && <span><Calendar size={12} /> {lab.duration}</span>}
                    {lab.grade_levels && <span><ChevronRight size={12} /> {lab.grade_levels}</span>}
                    {lab.location && <span><MapPin size={12} /> {lab.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REQUESTS TAB ── */}
        {tab === 'requests' && app.status === 'approved' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHead}>
              <div>
                <h2 className={styles.tabTitle}>Incoming Requests</h2>
                <p className={styles.tabSub}>Schools and nonprofits who want to bring their students to your business.</p>
              </div>
            </div>

            {requests.length === 0 && (
              <div className={styles.emptyState}>
                <MessageSquare size={40} className={styles.emptyIcon} />
                <p className={styles.emptyTitle}>No requests yet</p>
                <p className={styles.emptySub}>Once you post Field Labs and organizations find your listing, requests will appear here.</p>
              </div>
            )}

            <div className={styles.requestsList}>
              {requests.map(req => (
                <div key={req.id} className={styles.requestCard}>
                  <div className={styles.requestHead}>
                    <div>
                      <p className={styles.requestOrg}>{req.org_name || req.contact_name}</p>
                      <p className={styles.requestLab}>{req.field_labs?.title ?? 'Field Lab'}</p>
                    </div>
                    <span className={`${styles.requestStatus} ${styles['requestStatus_' + req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className={styles.requestMeta}>
                    {req.student_count && <span><Users size={12} /> {req.student_count} students</span>}
                    {req.grade_level && <span><ChevronRight size={12} /> {req.grade_level}</span>}
                    {req.preferred_date && <span><Calendar size={12} /> Preferred: {req.preferred_date}</span>}
                    <span><MessageSquare size={12} /> {req.contact_email}</span>
                  </div>
                  {req.message && <p className={styles.requestMsg}>&ldquo;{req.message}&rdquo;</p>}
                  {req.status === 'pending' && (
                    <div className={styles.requestActions}>
                      <button type="button" className={styles.confirmBtn} onClick={() => handleUpdateRequest(req.id, 'confirmed')}>
                        <CheckCircle2 size={14} /> Confirm
                      </button>
                      <button type="button" className={styles.declineBtn} onClick={() => handleUpdateRequest(req.id, 'declined')}>
                        <XCircle size={14} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
          <a href="/terms"   className={styles.footerLink}>Terms of Use</a>
          <a href="/legal"   className={styles.footerLink}>Compliance</a>
          <a href="/contact" className={styles.footerLink}>Contact Support</a>
        </div>
      </footer>

    </div>
  )
}
