'use client'

import { useState, useEffect } from 'react'
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, ChevronRight, Eye, Download, MoreHorizontal,
  Building2, Users, FileText, TrendingUp, Bell, LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './admin.module.css'

type Partner = {
  id: string
  company: string
  industry: string
  city: string
  contact: string
  email: string
  submitted: string
  status: string
  experiences: string[]
  ein: string
  insurance: string
  insuranceExp: string
  bgCheck: string
  training: string
  docs: { safety: boolean; conduct: boolean; youth: boolean }
  flag: string | null
}

function rowToPartner(row: Record<string, unknown>): Partner {
  return {
    id: String(row.id),
    company: String(row.company ?? ''),
    industry: String(row.industry ?? ''),
    city: String(row.city ?? ''),
    contact: String(row.contact_name ?? ''),
    email: String(row.contact_email ?? ''),
    submitted: String(row.submitted_at ?? ''),
    status: String(row.status ?? 'pending'),
    experiences: Array.isArray(row.experiences) ? row.experiences as string[] : [],
    ein: String(row.ein ?? ''),
    insurance: String(row.insurance_amount ?? ''),
    insuranceExp: String(row.insurance_exp ?? ''),
    bgCheck: String(row.bg_check ?? 'Not Submitted'),
    training: String(row.training ?? 'Not Started'),
    docs: {
      safety:  Boolean(row.doc_safety),
      conduct: Boolean(row.doc_conduct),
      youth:   Boolean(row.doc_youth),
    },
    flag: row.flag_note ? String(row.flag_note) : null,
  }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:  { label: 'Pending Review', cls: 'badgePending'  },
    approved: { label: 'Verified',       cls: 'badgeApproved' },
    flagged:  { label: 'Flagged',        cls: 'badgeFlagged'  },
    denied:   { label: 'Denied',         cls: 'badgeDenied'   },
  }
  const m = map[status] || map.pending
  return <span className={`${styles.badge} ${styles[m.cls]}`}>{m.label}</span>
}

function DocCheck({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle2 size={15} className={styles.docOk} />
    : <XCircle size={15} className={styles.docMissing} />
}

function insExpDaysLeft(expStr: string): number | null {
  if (!expStr || expStr === 'undefined' || expStr === '') return null
  const exp = new Date(expStr)
  if (isNaN(exp.getTime())) return null
  return Math.ceil((exp.getTime() - Date.now()) / 86400000)
}

function InsExpWarning({ expStr }: { expStr: string }) {
  const days = insExpDaysLeft(expStr)
  if (days === null || days > 60) return null
  const critical = days <= 30
  return (
    <span className={critical ? styles.insWarnCritical : styles.insWarnSoon}>
      <AlertCircle size={11} />
      {days <= 0 ? 'EXPIRED' : `Exp. in ${days}d`}
    </span>
  )
}

const ADMIN_EMAILS = ['michael@versassists.com', 'rwp.demo@gmail.com']

export default function AdminDashboard() {
  const [activeTab, setActiveTab]     = useState('all')
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState<Partner | null>(null)
  const [partners, setPartners]       = useState<Partner[]>([])
  const [loading, setLoading]         = useState(true)
  const [authorized, setAuthorized]   = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
        window.location.href = '/dashboard'
        return
      }
      setAuthorized(true)
    })
  }, [])

  useEffect(() => {
    if (!authorized) return
    const supabase = createClient()
    supabase
      .from('pathway_site_applications')
      .select('*')
      .order('submitted_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPartners(data.map(rowToPartner))
        setLoading(false)
      })
  }, [authorized])

  const filtered = partners.filter(p => {
    const matchTab = activeTab === 'all' || p.status === activeTab
    const matchSearch = search === '' ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.contact.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const STATUS_TABS = [
    { id: 'all',      label: 'All',      count: partners.length },
    { id: 'pending',  label: 'Pending',  count: partners.filter(p => p.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: partners.filter(p => p.status === 'approved').length },
    { id: 'flagged',  label: 'Flagged',  count: partners.filter(p => p.status === 'flagged').length },
    { id: 'denied',   label: 'Denied',   count: partners.filter(p => p.status === 'denied').length },
  ]

  const STATS = [
    { label: 'Total Applications', value: String(partners.length),                                           sub: 'All time',        Icon: Building2,   color: '#6B5A8E' },
    { label: 'Pending Review',     value: String(partners.filter(p => p.status === 'pending').length),       sub: 'Awaiting action', Icon: Clock,       color: '#C9952A' },
    { label: 'Verified Partners',  value: String(partners.filter(p => p.status === 'approved').length),      sub: 'Active & live',   Icon: ShieldCheck, color: '#3A8C6E' },
    { label: 'Flagged / Issues',   value: String(partners.filter(p => p.status === 'flagged' || p.status === 'denied').length), sub: 'Needs attention', Icon: AlertCircle, color: '#C0392B' },
  ]

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase
      .from('pathway_site_applications')
      .update({ status })
      .eq('id', id)
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  if (!authorized) return null

  return (
    <div className={styles.page}>

      {/* ── SIDEBAR ── */}
      <aside className={styles.nav}>
        <div className={styles.navTop}>
          <div className={styles.navLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wwk-transparent.png" alt="RWP" className={styles.navLogoImg} />
            <div>
              <p className={styles.navLogoTitle}>RWP Admin</p>
              <p className={styles.navLogoSub}>Trust & Safety</p>
            </div>
          </div>

          <nav className={styles.navLinks}>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
              <ShieldCheck size={17} />
              <span>Verification Queue</span>
            </a>
            <a href="#" className={styles.navLink}>
              <Building2 size={17} />
              <span>All Partners</span>
            </a>
            <a href="#" className={styles.navLink}>
              <Users size={17} />
              <span>Organizations</span>
            </a>
            <a href="#" className={styles.navLink}>
              <FileText size={17} />
              <span>Documents</span>
            </a>
            <a href="#" className={styles.navLink}>
              <TrendingUp size={17} />
              <span>Reports</span>
            </a>
          </nav>
        </div>

        <div className={styles.navBottom}>
          <a href="#" className={styles.navLink}>
            <Bell size={17} />
            <span>Notifications</span>
            <span className={styles.notifDot}>2</span>
          </a>
          <a href="/home" className={styles.navLink}>
            <LogOut size={17} />
            <span>Back to Site</span>
          </a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={styles.main}>

        {/* Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Verification Queue</h1>
            <p className={styles.pageSub}>Review and approve Business Partner applications</p>
          </div>
          <button className={styles.exportBtn}>
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${s.color}18`, color: s.color }}>
                <s.Icon size={20} />
              </div>
              <div>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statSub}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table area */}
        <div className={styles.tableCard}>

          {/* Filters */}
          <div className={styles.tableTop}>
            <div className={styles.tabs}>
              {STATUS_TABS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                  <span className={styles.tabCount}>{t.count}</span>
                </button>
              ))}
            </div>
            <div className={styles.searchRow}>
              <div className={styles.searchWrap}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search company, contact, or industry…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className={styles.filterBtn}>
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Contact</th>
                  <th>Submitted</th>
                  <th>Docs</th>
                  <th>BG Check</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr
                    key={p.id}
                    className={`${styles.row} ${selected?.id === p.id ? styles.rowSelected : ''}`}
                    onClick={() => setSelected(p)}
                  >
                    <td>
                      <div className={styles.companyCell}>
                        <div className={styles.companyAvatar}>
                          {p.company.charAt(0)}
                        </div>
                        <div>
                          <p className={styles.companyName}>
                            {p.company}
                            <InsExpWarning expStr={p.insuranceExp} />
                          </p>
                          <p className={styles.companyCity}>{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.industryTag}>{p.industry}</span></td>
                    <td>
                      <p className={styles.contactName}>{p.contact}</p>
                      <p className={styles.contactEmail}>{p.email}</p>
                    </td>
                    <td className={styles.dateCell}>{p.submitted}</td>
                    <td>
                      <div className={styles.docDots}>
                        <DocCheck ok={p.docs.safety} />
                        <DocCheck ok={p.docs.conduct} />
                        <DocCheck ok={p.docs.youth} />
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.bgTag} ${
                        p.bgCheck === 'Cleared'        ? styles.bgCleared  :
                        p.bgCheck === 'Submitted'      ? styles.bgSubmitted :
                        p.bgCheck === 'Issues Found'   ? styles.bgIssues   :
                        styles.bgNone
                      }`}>
                        {p.bgCheck}
                      </span>
                    </td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <button className={styles.rowAction} onClick={e => { e.stopPropagation(); setSelected(p) }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={8} className={styles.emptyRow}>Loading applications…</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className={styles.emptyRow}>No applications match your filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      {selected && (
        <aside className={styles.detail}>
          <div className={styles.detailHeader}>
            <div>
              <p className={styles.detailCompany}>{selected.company}</p>
              <p className={styles.detailCity}>{selected.city}</p>
            </div>
            <button className={styles.detailClose} onClick={() => setSelected(null)}>✕</button>
          </div>

          <StatusBadge status={selected.status} />

          {selected.flag && (
            <div className={styles.flagBanner}>
              <AlertCircle size={14} className={styles.flagIcon} />
              <p>{selected.flag}</p>
            </div>
          )}

          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Contact</p>
            <p className={styles.detailRow}><span>Name</span><strong>{selected.contact}</strong></p>
            <p className={styles.detailRow}><span>Email</span><a href={`mailto:${selected.email}`} className={styles.detailLink}>{selected.email}</a></p>
          </div>

          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Business Info</p>
            <p className={styles.detailRow}><span>EIN</span><strong>{selected.ein || '—'}</strong></p>
            <p className={styles.detailRow}><span>Industry</span><strong>{selected.industry}</strong></p>
            <p className={styles.detailRow}><span>Submitted</span><strong>{selected.submitted}</strong></p>
          </div>

          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Insurance</p>
            <p className={styles.detailRow}><span>Coverage</span><strong>{selected.insurance || '—'}</strong></p>
            <p className={styles.detailRow}>
              <span>Expires</span>
              <strong className={styles.insExpRow}>
                {selected.insuranceExp || '—'}
                <InsExpWarning expStr={selected.insuranceExp} />
              </strong>
            </p>
          </div>

          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Verification Checklist</p>
            <div className={styles.checklist}>
              {[
                { label: 'Safety Agreement',   ok: selected.docs.safety  },
                { label: 'Code of Conduct',    ok: selected.docs.conduct },
                { label: 'Youth Safety Policy',ok: selected.docs.youth   },
                { label: 'Background Check',   ok: selected.bgCheck === 'Cleared' },
                { label: 'Safety Training',    ok: selected.training === 'Complete' },
              ].map(item => (
                <div key={item.label} className={styles.checklistRow}>
                  {item.ok
                    ? <CheckCircle2 size={15} className={styles.docOk} />
                    : <XCircle size={15} className={styles.docMissing} />
                  }
                  <span className={item.ok ? styles.checklistLabelOk : styles.checklistLabelMissing}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Experiences Offered</p>
            <div className={styles.expTags}>
              {selected.experiences.map(e => (
                <span key={e} className={styles.expTag}>{e}</span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.detailActions}>
            {selected.status !== 'approved' && (
              <button
                className={styles.btnApprove}
                onClick={() => updateStatus(selected.id, 'approved')}
              >
                <CheckCircle2 size={16} />
                Approve & Issue Badge
              </button>
            )}
            {selected.status !== 'flagged' && selected.status !== 'denied' && (
              <button
                className={styles.btnFlag}
                onClick={() => updateStatus(selected.id, 'flagged')}
              >
                <AlertCircle size={16} />
                Flag for Follow-Up
              </button>
            )}
            {selected.status !== 'denied' && (
              <button
                className={styles.btnDeny}
                onClick={() => updateStatus(selected.id, 'denied')}
              >
                <XCircle size={16} />
                Deny Application
              </button>
            )}
            <button className={styles.btnEmail}>
              <MoreHorizontal size={16} />
              Send Email to Partner
            </button>
          </div>

          <button
            className={styles.detailFull}
            onClick={() => setSelected(null)}
          >
            Close Panel <ChevronRight size={14} />
          </button>
        </aside>
      )}

    </div>
  )
}
