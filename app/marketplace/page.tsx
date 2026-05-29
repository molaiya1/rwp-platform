'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Search, MapPin, Calendar, Filter, ChevronRight,
  ShieldCheck, Clock, Users, Building2, Star, X,
  DollarSign, Bus, CheckCircle2, LayoutGrid, List,
  Navigation,
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './marketplace.module.css'

/* ─── Data ─── */

const INDUSTRY_PHOTOS: Record<string, string> = {
  'Healthcare':     'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80',
  'Finance':        'https://images.unsplash.com/photo-1560472355-536de3962603?w=700&q=80',
  'Technology':     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
  'Logistics':      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80',
  'Hospitality':    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
  'Manufacturing':  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=80',
  'Skilled Trades': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&q=80',
  'Government':     'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&q=80',
  'Nonprofit':      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700&q=80',
  'Retail':         'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80',
  'Other':          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80',
}
const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80'

const EXP_TYPES = ['All Types', 'Site Visit', 'Job Shadow', 'Career Panel', 'Mentorship', 'Internship', 'Project Partnership']
const INDUSTRIES = ['All Industries', 'Healthcare', 'Finance', 'Technology', 'Skilled Trades', 'Hospitality', 'Logistics', 'Manufacturing', 'Government', 'Nonprofit']
const GRADE_LEVELS = ['All Grades', 'K–5', '6–8', '9–12', 'K–12']
const STATUS_OPTIONS = ['All Statuses', 'Open', 'Waitlisted', 'Closed']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const HOW_IT_WORKS = [
  { num: '01', title: 'Send a Request',         desc: 'Click any experience and submit your info. Takes under 2 minutes.' },
  { num: '02', title: 'Business Confirms',       desc: 'The business reviews and responds within 48 hours.' },
  { num: '03', title: 'Coordinate the Details',  desc: 'Finalize date, logistics, and student prep through the platform.' },
  { num: '04', title: 'Show Up & Learn',         desc: 'Your students experience the real world. We track the outcome.' },
]

const LISTINGS = [
  {
    id: '1',
    company: 'Grady Health System',
    industry: 'Healthcare',
    city: 'Atlanta, GA',
    type: 'Job Shadow',
    title: 'A Day in the Life: Emergency Medicine',
    desc: 'Students spend a half-day with ER physicians and nurses. See triage, patient care, and hospital operations in action. No clinical experience needed.',
    grades: '9–12',
    duration: '4 hrs',
    format: 'In-Person',
    capacity: 8,
    spotsAvailable: 3,
    status: 'Open' as const,
    distance: '4.1 miles away',
    months: ['Sep', 'Oct', 'Nov'],
    verified: true,
    rating: 4.9,
    reviews: 14,
    photo: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=700&q=80',
    cost: 'Free',
    transportation: 'Not provided — site is accessible by MARTA',
    upcoming: 'Oct 14, 2026',
  },
  {
    id: '2',
    company: 'Delta Air Lines',
    industry: 'Logistics',
    city: 'Atlanta, GA',
    type: 'Site Visit',
    title: 'Behind the Terminal: Aviation & Operations',
    desc: "Tour Delta's operations center and learn how 5,000+ daily flights are coordinated. Meet engineers, logistics coordinators, and operations analysts.",
    grades: 'K–12',
    duration: '3 hrs',
    format: 'In-Person',
    capacity: 24,
    spotsAvailable: 18,
    status: 'Open' as const,
    distance: '8.7 miles away',
    months: ['Oct', 'Nov', 'Feb', 'Mar'],
    verified: true,
    rating: 4.8,
    reviews: 22,
    photo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80',
    cost: 'Free',
    transportation: 'Not provided — school must arrange',
    upcoming: 'Nov 5, 2026',
  },
  {
    id: '3',
    company: 'Truist Bank',
    industry: 'Finance',
    city: 'Atlanta, GA',
    type: 'Career Panel',
    title: 'Money, Markets & Careers in Finance',
    desc: 'Four Truist professionals — from wealth management to commercial lending — share their career paths and answer student questions live.',
    grades: '6–12',
    duration: '90 min',
    format: 'Virtual or In-Person',
    capacity: 60,
    spotsAvailable: 45,
    status: 'Open' as const,
    distance: '2.3 miles away',
    months: ['Oct', 'Jan', 'Feb', 'Apr'],
    verified: true,
    rating: 4.7,
    reviews: 9,
    photo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=700&q=80',
    cost: 'Free',
    transportation: 'N/A — virtual option available',
    upcoming: 'Oct 22, 2026',
  },
  {
    id: '4',
    company: 'Chick-fil-A Corporate',
    industry: 'Hospitality',
    city: 'College Park, GA',
    type: 'Mentorship',
    title: 'Leadership & Entrepreneurship Mentorship',
    desc: 'A semester-long mentorship pairing students with Chick-fil-A restaurant operators and franchise leaders. Weekly 45-min virtual check-ins focused on business ownership and leadership.',
    grades: '9–12',
    duration: 'Semester',
    format: 'Virtual',
    capacity: 10,
    spotsAvailable: 2,
    status: 'Waitlisted' as const,
    distance: '12.4 miles away',
    months: ['Sep', 'Jan'],
    verified: true,
    rating: 5.0,
    reviews: 6,
    photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
    cost: 'Free',
    transportation: 'N/A — fully virtual',
    upcoming: 'Jan 12, 2027',
  },
  {
    id: '5',
    company: 'Georgia Power',
    industry: 'Skilled Trades',
    city: 'Atlanta, GA',
    type: 'Site Visit',
    title: 'Power Grid & Infrastructure Tour',
    desc: 'Explore how electricity is generated and distributed across Georgia. Meet lineworkers, engineers, and grid analysts at a working facility.',
    grades: '9–12',
    duration: '2.5 hrs',
    format: 'In-Person',
    capacity: 20,
    spotsAvailable: 12,
    status: 'Open' as const,
    distance: '5.9 miles away',
    months: ['Oct', 'Mar', 'Apr'],
    verified: true,
    rating: 4.6,
    reviews: 11,
    photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&q=80',
    cost: 'Free',
    transportation: 'Not provided — school must arrange',
    upcoming: 'Mar 10, 2027',
  },
  {
    id: '6',
    company: 'Dekalb Medical Center',
    industry: 'Healthcare',
    city: 'Decatur, GA',
    type: 'Internship',
    title: 'Summer Health Sciences Internship',
    desc: 'A 6-week paid summer internship for rising 11th and 12th graders exploring healthcare careers. Rotations through 3 departments: nursing, lab, and administration.',
    grades: '9–12',
    duration: '6 weeks',
    format: 'In-Person',
    capacity: 5,
    spotsAvailable: 1,
    status: 'Waitlisted' as const,
    distance: '7.2 miles away',
    months: ['Jun', 'Jul'],
    verified: true,
    rating: 4.9,
    reviews: 4,
    photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80',
    cost: 'Paid — $12/hr',
    transportation: 'Not provided — MARTA accessible',
    upcoming: 'Jun 1, 2027',
  },
  {
    id: '7',
    company: 'Cox Enterprises',
    industry: 'Technology',
    city: 'Atlanta, GA',
    type: 'Project Partnership',
    title: 'Real Business Challenge: Digital Marketing',
    desc: 'Student teams tackle a real Cox marketing challenge over 6 weeks. Finalists present to Cox leadership. All teams receive professional feedback and portfolio documentation.',
    grades: '9–12',
    duration: '6 weeks',
    format: 'Hybrid',
    capacity: 30,
    spotsAvailable: 22,
    status: 'Open' as const,
    distance: '6.8 miles away',
    months: ['Feb', 'Mar'],
    verified: true,
    rating: 4.8,
    reviews: 3,
    photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80',
    cost: 'Free',
    transportation: 'N/A — primarily remote with one in-person presentation',
    upcoming: 'Feb 2, 2027',
  },
  {
    id: '8',
    company: 'Atlanta Fire Rescue',
    industry: 'Government',
    city: 'Atlanta, GA',
    type: 'Career Panel',
    title: 'Public Safety Careers — From the Frontline',
    desc: 'Firefighters, paramedics, and fire inspectors discuss career paths, training requirements, and what a day on shift actually looks like.',
    grades: 'K–12',
    duration: '1 hr',
    format: 'In-Person or Virtual',
    capacity: 100,
    spotsAvailable: 87,
    status: 'Open' as const,
    distance: '1.8 miles away',
    months: ['Sep', 'Oct', 'Nov', 'Feb', 'Mar', 'Apr'],
    verified: false,
    rating: 4.5,
    reviews: 7,
    photo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&q=80',
    cost: 'Free',
    transportation: 'N/A — they can come to your school',
    upcoming: 'Oct 8, 2026',
  },
  {
    id: '9',
    company: 'UPS Supply Chain Solutions',
    industry: 'Logistics',
    city: 'Sandy Springs, GA',
    type: 'Job Shadow',
    title: 'Global Logistics: How the World Ships',
    desc: 'Follow a UPS supply chain analyst through a real workday. Learn how global shipping, customs, and last-mile delivery are coordinated at scale.',
    grades: '6–12',
    duration: '6 hrs',
    format: 'In-Person',
    capacity: 6,
    spotsAvailable: 2,
    status: 'Open' as const,
    distance: '14.3 miles away',
    months: ['Oct', 'Nov', 'Jan', 'Mar'],
    verified: true,
    rating: 4.7,
    reviews: 8,
    photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80',
    cost: 'Free',
    transportation: 'Not provided — school must arrange',
    upcoming: 'Nov 19, 2026',
  },
]

type Listing = typeof LISTINGS[0]

export default function MarketplacePage() {
  const [typeFilter,     setTypeFilter]     = useState('All Types')
  const [industryFilter, setIndustryFilter] = useState('All Industries')
  const [gradeFilter,    setGradeFilter]    = useState('All Grades')
  const [statusFilter,   setStatusFilter]   = useState('All Statuses')
  const [monthFilter,    setMonthFilter]    = useState<string | null>(null)
  const [search,         setSearch]         = useState('')
  const [zipCode,        setZipCode]        = useState('')
  const [selected,       setSelected]       = useState<Listing | null>(null)
  const [viewMode,       setViewMode]       = useState<'grid' | 'list'>('grid')
  const [dbListings,     setDbListings]     = useState<Listing[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('field_labs')
      .select('*, pathway_site_applications(company, industry, city)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data?.length) return
        const fresh: Listing[] = data.map((lab: {
          id: string; title: string; type: string; description: string;
          capacity: number; duration: string; grade_levels: string;
          location: string; is_virtual: boolean;
          pathway_site_applications: { company: string; industry: string; city: string } | null
        }) => ({
          id: lab.id,
          company: lab.pathway_site_applications?.company ?? 'Certified Pathway Site™',
          industry: lab.pathway_site_applications?.industry ?? 'Other',
          city: lab.pathway_site_applications?.city ?? 'Atlanta, GA',
          type: lab.type,
          title: lab.title,
          desc: lab.description ?? `A real-world ${lab.type.toLowerCase()} experience for students.`,
          grades: lab.grade_levels ?? 'K–12',
          duration: lab.duration ?? 'Varies',
          format: lab.is_virtual ? 'Virtual' : 'In-Person',
          capacity: lab.capacity ?? 20,
          spotsAvailable: lab.capacity ?? 20,
          status: 'Open' as const,
          distance: '—',
          months: [] as string[],
          verified: true,
          rating: 0,
          reviews: 0,
          photo: INDUSTRY_PHOTOS[lab.pathway_site_applications?.industry ?? ''] ?? DEFAULT_PHOTO,
          cost: 'Free',
          transportation: lab.is_virtual ? 'N/A — virtual' : 'Contact for details',
          upcoming: 'Contact to schedule',
        }))
        setDbListings(fresh)
      })
  }, [])

  const ALL_LISTINGS = [...LISTINGS, ...dbListings]

  const filtered = ALL_LISTINGS.filter(l => {
    if (typeFilter !== 'All Types' && l.type !== typeFilter) return false
    if (industryFilter !== 'All Industries' && l.industry !== industryFilter) return false
    if (gradeFilter !== 'All Grades' && l.grades !== gradeFilter) return false
    if (statusFilter !== 'All Statuses' && l.status !== statusFilter) return false
    if (monthFilter && !l.months.includes(monthFilter)) return false
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.company.toLowerCase().includes(search.toLowerCase()) &&
        !l.industry.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const clearFilters = () => {
    setTypeFilter('All Types')
    setIndustryFilter('All Industries')
    setGradeFilter('All Grades')
    setStatusFilter('All Statuses')
    setMonthFilter(null)
    setSearch('')
    setZipCode('')
  }

  const hasFilters = typeFilter !== 'All Types' || industryFilter !== 'All Industries' ||
    gradeFilter !== 'All Grades' || statusFilter !== 'All Statuses' ||
    monthFilter !== null || search !== ''

  const statusClass = (s: string) => {
    if (s === 'Open') return styles.statusOpen
    if (s === 'Waitlisted') return styles.statusWaitlisted
    return styles.statusClosed
  }

  const spotsLabel = (l: Listing) => {
    if (l.spotsAvailable === 0) return 'Full'
    if (l.spotsAvailable === 1) return '1 spot left'
    return `${l.spotsAvailable} spots left`
  }

  return (
    <div className={styles.page}>
      <SiteNav />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Real-World Pathways™ Marketplace</p>
          <h1 className={styles.heroH1}>Find the Right Experience<br />for Your Students.</h1>
          <p className={styles.heroSub}>
            Browse verified real-world experiences by type, industry, grade level, and availability.
            Every listing shows cost, transportation info, and next available date — upfront.
          </p>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchBarIcon} />
            <input
              className={styles.searchBarInput}
              placeholder="Search by experience, company, or industry…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FOUNDING COHORT BANNER ── */}
      <div style={{
        background: 'linear-gradient(90deg, #1F3C88 0%, #6B5A8E 100%)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap' as const,
      }}>
        <span style={{ fontSize: 13, color: '#F4B223', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
          Preview Directory
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>|</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
          These listings show what the marketplace will look like. We&apos;re enrolling our founding cohort of Certified Pathway Sites™ now.
        </span>
        <a href="/register?type=biz" style={{
          background: '#F4B223', color: '#1F3C88', fontSize: 12, fontWeight: 800,
          padding: '6px 14px', borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap' as const,
          letterSpacing: '0.02em',
        }}>
          Apply to Be Listed →
        </a>
      </div>

      {/* ── HOW IT WORKS STRIP ── */}
      <div className={styles.howStrip}>
        <div className={styles.howStripInner}>
          <p className={styles.howStripLabel}>How requesting works</p>
          <div className={styles.howSteps}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} className={styles.howStep}>
                <div className={styles.howStepLeft}>
                  <span className={styles.howNum}>{step.num}</span>
                  <div>
                    <p className={styles.howTitle}>{step.title}</p>
                    <p className={styles.howDesc}>{step.desc}</p>
                  </div>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight size={16} className={styles.howArrow} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CALENDAR STRIP ── */}
      <div className={styles.calendarStrip}>
        <div className={styles.calendarInner}>
          <div className={styles.calendarLabel}>
            <Calendar size={14} />
            <span>Filter by Month</span>
          </div>
          <div className={styles.monthPills}>
            {MONTHS.map(m => (
              <button
                key={m}
                className={`${styles.monthPill} ${monthFilter === m ? styles.monthPillActive : ''}`}
                onClick={() => setMonthFilter(monthFilter === m ? null : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className={styles.body}>

        {/* Filter sidebar */}
        <aside className={styles.filterSidebar}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitle}>
              <Filter size={14} />
              <span>Filters</span>
            </div>
            {hasFilters && (
              <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
            )}
          </div>

          {/* ZIP Code */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Near ZIP Code</p>
            <div className={styles.zipInputWrap}>
              <Navigation size={13} className={styles.zipIcon} />
              <input
                type="text"
                maxLength={5}
                className={styles.zipInput}
                placeholder="e.g. 30308"
                value={zipCode}
                onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {zipCode.length === 5 && (
              <p className={styles.zipNote}>Showing distances from {zipCode}</p>
            )}
          </div>

          {/* Status */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Availability</p>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                className={`${styles.filterOption} ${statusFilter === s ? styles.filterOptionActive : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                <span className={styles.filterOptionInner}>
                  {s !== 'All Statuses' && (
                    <span className={`${styles.statusDot} ${s === 'Open' ? styles.dotOpen : s === 'Waitlisted' ? styles.dotWaitlisted : styles.dotClosed}`} />
                  )}
                  {s}
                </span>
                {statusFilter === s && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Experience Type</p>
            {EXP_TYPES.map(t => (
              <button
                key={t}
                className={`${styles.filterOption} ${typeFilter === t ? styles.filterOptionActive : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t}
                {typeFilter === t && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Industry</p>
            {INDUSTRIES.map(i => (
              <button
                key={i}
                className={`${styles.filterOption} ${industryFilter === i ? styles.filterOptionActive : ''}`}
                onClick={() => setIndustryFilter(i)}
              >
                {i}
                {industryFilter === i && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Grade Level</p>
            {GRADE_LEVELS.map(g => (
              <button
                key={g}
                className={`${styles.filterOption} ${gradeFilter === g ? styles.filterOptionActive : ''}`}
                onClick={() => setGradeFilter(g)}
              >
                {g}
                {gradeFilter === g && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>
        </aside>

        {/* Listing area */}
        <div className={styles.listingArea}>

          <div className={styles.listingTopBar}>
            <p className={styles.resultCount}>
              <strong>{filtered.length}</strong> experience{filtered.length !== 1 ? 's' : ''} available
              {monthFilter && <span className={styles.activeFilterTag}>{monthFilter} <button onClick={() => setMonthFilter(null)}>×</button></span>}
              {typeFilter !== 'All Types' && <span className={styles.activeFilterTag}>{typeFilter} <button onClick={() => setTypeFilter('All Types')}>×</button></span>}
              {industryFilter !== 'All Industries' && <span className={styles.activeFilterTag}>{industryFilter} <button onClick={() => setIndustryFilter('All Industries')}>×</button></span>}
              {statusFilter !== 'All Statuses' && <span className={styles.activeFilterTag}>{statusFilter} <button onClick={() => setStatusFilter('All Statuses')}>×</button></span>}
            </p>
            <div className={styles.topBarRight}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List size={15} />
                </button>
              </div>
              <Link href="/register?type=biz" className={styles.listYoursBtn}>
                + List Your Experience
              </Link>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyH}>No experiences match your filters.</p>
              <p className={styles.emptySub}>Try adjusting your filters or <button onClick={clearFilters} className={styles.emptyLink}>clear all</button> to see everything.</p>
            </div>
          ) : viewMode === 'grid' ? (

            /* ── GRID VIEW ── */
            <div className={styles.grid}>
              {filtered.map(listing => (
                <div
                  key={listing.id}
                  className={`${styles.card} ${selected?.id === listing.id ? styles.cardSelected : ''}`}
                  onClick={() => setSelected(listing)}
                >
                  {/* Card photo top */}
                  <div className={styles.cardPhoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.photo} alt={listing.title} className={styles.cardImg} />
                    <div className={styles.cardPhotoOverlay} />
                    <div className={styles.cardPhotoContent}>
                      <div className={styles.cardTopRow}>
                        <span className={styles.cardType}>{listing.type}</span>
                        {listing.verified && (
                          <span className={styles.verifiedBadge}>
                            <ShieldCheck size={11} /> Verified
                          </span>
                        )}
                      </div>
                      <div className={styles.cardBottomRow}>
                        <span className={`${styles.statusBadge} ${statusClass(listing.status)}`}>
                          {listing.status}
                        </span>
                        <span className={styles.spotsTag}>
                          {spotsLabel(listing)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardTopMeta}>
                      <div className={styles.cardCompany}>
                        <Building2 size={12} className={styles.cardCompanyIcon} />
                        {listing.company}
                      </div>
                      <span className={styles.distanceChip}>
                        <MapPin size={10} />
                        {listing.distance}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{listing.title}</h3>
                    <p className={styles.cardDesc}>{listing.desc}</p>

                    {/* Cost + transportation quick-facts */}
                    <div className={styles.cardFacts}>
                      <span className={styles.cardFact}>
                        <DollarSign size={12} className={styles.cardFactIcon} />
                        {listing.cost}
                      </span>
                      <span className={styles.cardFact}>
                        <Bus size={12} className={styles.cardFactIcon} />
                        {listing.transportation}
                      </span>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.cardFooterLeft}>
                        <span className={styles.cardInfo}>
                          <Users size={12} /> {listing.grades}
                        </span>
                        <span className={styles.cardInfo}>
                          <Clock size={12} /> {listing.duration}
                        </span>
                      </div>
                      <div className={styles.cardRating}>
                        <Star size={12} className={styles.starIcon} />
                        <span>{listing.rating}</span>
                        <span className={styles.ratingCount}>({listing.reviews})</span>
                      </div>
                    </div>

                    <div className={styles.cardUpcoming}>
                      <Calendar size={12} />
                      Next: <strong>{listing.upcoming}</strong>
                    </div>

                    <button
                      className={styles.cardCta}
                      onClick={e => { e.stopPropagation(); setSelected(listing) }}
                    >
                      Request This Experience <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            /* ── LIST VIEW ── */
            <div className={styles.listGrid}>
              {filtered.map(listing => (
                <div
                  key={listing.id}
                  className={`${styles.listCard} ${selected?.id === listing.id ? styles.cardSelected : ''}`}
                  onClick={() => setSelected(listing)}
                >
                  {/* Left: photo */}
                  <div className={styles.listCardPhoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.photo} alt={listing.title} className={styles.listCardImg} />
                    <div className={styles.listCardPhotoOverlay} />
                    <div className={styles.listCardPhotoBadges}>
                      <span className={`${styles.statusBadge} ${statusClass(listing.status)}`}>
                        {listing.status}
                      </span>
                      {listing.verified && (
                        <span className={styles.verifiedBadge}>
                          <ShieldCheck size={11} /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className={styles.listCardBody}>
                    <div className={styles.listCardTopRow}>
                      <div className={styles.listCardLeft}>
                        <div className={styles.cardCompany}>
                          <Building2 size={12} className={styles.cardCompanyIcon} />
                          {listing.company}
                        </div>
                        <h3 className={styles.listCardTitle}>{listing.title}</h3>
                      </div>
                      <div className={styles.listCardRight}>
                        <span className={styles.distanceChip}>
                          <MapPin size={10} />
                          {listing.distance}
                        </span>
                        <span className={styles.spotsTagLg}>
                          {spotsLabel(listing)}
                        </span>
                        <div className={styles.cardRating}>
                          <Star size={12} className={styles.starIcon} />
                          <span>{listing.rating}</span>
                          <span className={styles.ratingCount}>({listing.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <p className={styles.listCardDesc}>{listing.desc}</p>

                    <div className={styles.listCardMeta}>
                      <span className={styles.listMetaTag}>{listing.type}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}><Users size={12} /> {listing.grades}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}><Clock size={12} /> {listing.duration}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}><DollarSign size={12} /> {listing.cost}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}><Calendar size={12} /> Next: {listing.upcoming}</span>
                    </div>
                  </div>

                  {/* CTA column */}
                  <div className={styles.listCardCta}>
                    <button
                      className={styles.cardCta}
                      onClick={e => { e.stopPropagation(); setSelected(listing) }}
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>

            {/* Modal photo header */}
            <div className={styles.modalPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.photo} alt={selected.title} className={styles.modalImg} />
              <div className={styles.modalPhotoOverlay} />
              <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
              <div className={styles.modalPhotoContent}>
                <div className={styles.modalTopRow}>
                  <span className={styles.cardType}>{selected.type}</span>
                  {selected.verified && (
                    <span className={styles.verifiedBadge}>
                      <ShieldCheck size={11} /> Verified Partner
                    </span>
                  )}
                </div>
                <div className={styles.modalStatusRow}>
                  <span className={`${styles.statusBadge} ${statusClass(selected.status)}`}>
                    {selected.status}
                  </span>
                  <span className={styles.spotsTag}>{spotsLabel(selected)}</span>
                </div>
                <h2 className={styles.modalTitle}>{selected.title}</h2>
                <p className={styles.modalCompany}>{selected.company} · {selected.city}</p>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <div className={styles.modalMetaItem}>
                  <Clock size={14} />
                  <span>{selected.duration}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <Users size={14} />
                  <span>Grades {selected.grades}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <MapPin size={14} />
                  <span>{selected.format}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <Users size={14} />
                  <span>{selected.spotsAvailable} of {selected.capacity} spots open</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <DollarSign size={14} />
                  <span>{selected.cost}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <Bus size={14} />
                  <span>{selected.transportation}</span>
                </div>
              </div>

              <p className={styles.modalDesc}>{selected.desc}</p>

              {/* What happens next */}
              <div className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>What happens after you request</p>
                <div className={styles.modalSteps}>
                  {[
                    'We send your request to the business within minutes',
                    'They confirm availability within 48 hours',
                    'You coordinate date, group size, and logistics on the platform',
                    'Day-of support and a post-experience survey are included',
                  ].map((s, i) => (
                    <div key={i} className={styles.modalStep}>
                      <CheckCircle2 size={14} className={styles.modalStepIcon} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Available Months</p>
                <div className={styles.modalMonths}>
                  {selected.months.map(m => (
                    <span key={m} className={styles.modalMonthPill}>{m}</span>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Next Available Date</p>
                <div className={styles.modalUpcoming}>
                  <Calendar size={15} />
                  <strong>{selected.upcoming}</strong>
                </div>
              </div>

              <div className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Rating & Reviews</p>
                <div className={styles.modalRating}>
                  <Star size={16} className={styles.starIconLg} />
                  <strong>{selected.rating}</strong>
                  <span>out of 5 — {selected.reviews} reviews from schools</span>
                </div>
              </div>

              <div className={styles.modalActions}>
                <Link href="/register?type=org" className={styles.modalCta}>
                  Request This Experience <ChevronRight size={16} />
                </Link>
                <button className={styles.modalSave} onClick={() => setSelected(null)}>
                  Save for Later
                </button>
                <Link
                  href={`/reflect?expId=${selected.id}&company=${encodeURIComponent(selected.company)}&type=${encodeURIComponent(selected.type)}&date=${encodeURIComponent(selected.upcoming)}`}
                  className={styles.modalReflect}
                >
                  Already completed this experience? Submit a reflection →
                </Link>
              </div>

              {selected.verified && (
                <div className={styles.modalTrust}>
                  <ShieldCheck size={14} className={styles.modalTrustIcon} />
                  <span>This business is an RWP Verified Partner™ — background checked, insured, and safety-trained.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
            <a href="/terms" className={styles.footerLink}>Terms of Use</a>
            <a href="/contact" className={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
