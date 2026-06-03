'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Search, MapPin, Calendar, Filter, ChevronRight,
  ShieldCheck, Clock, Users, Building2, Star, X,
  DollarSign, Bus, CheckCircle2, LayoutGrid, List,
  Navigation, Award,
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './marketplace.module.css'

/* ─── Static Data ─── */

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

const EXP_TYPES    = ['All Types', 'Site Visit', 'Job Shadow', 'Career Panel', 'Mentorship', 'Internship', 'Project Partnership']
const INDUSTRIES   = ['All Industries', 'Healthcare', 'Finance', 'Technology', 'Skilled Trades', 'Hospitality', 'Logistics', 'Manufacturing', 'Government', 'Nonprofit']
const GRADE_LEVELS = ['All Grades', 'K–5', '6–8', '9–12', 'K–12']
const STATUS_OPTIONS = ['All Statuses', 'Open', 'Waitlisted', 'Closed']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const QUICK_CHIPS = [
  'Healthcare', 'Technology', 'Finance', 'Aviation',
  'Skilled Trades', 'Government', 'Entrepreneurship', 'Hospitality',
  'Manufacturing', 'STEM',
]


const TIER_CONFIG = {
  gold:      { label: 'Gold Certified',     bg: '#C9951A', color: '#FFF9E6' },
  silver:    { label: 'Silver Certified',   bg: '#6B7280', color: '#FFFFFF' },
  founding:  { label: 'Founding Partner',   bg: '#4B2D8A', color: '#F2C96E' },
  community: { label: 'Community Champion', bg: '#6B5A8E', color: '#FFFFFF' },
}

/* ─── ZIP Coordinate Lookup (Atlanta metro) ─── */
const ZIP_COORDS: Record<string, { lat: number; lng: number }> = {
  '30301': { lat: 33.749, lng: -84.388 }, '30303': { lat: 33.754, lng: -84.390 },
  '30305': { lat: 33.838, lng: -84.366 }, '30306': { lat: 33.779, lng: -84.350 },
  '30307': { lat: 33.773, lng: -84.337 }, '30308': { lat: 33.773, lng: -84.375 },
  '30309': { lat: 33.802, lng: -84.384 }, '30310': { lat: 33.724, lng: -84.418 },
  '30311': { lat: 33.726, lng: -84.453 }, '30312': { lat: 33.745, lng: -84.371 },
  '30313': { lat: 33.762, lng: -84.394 }, '30314': { lat: 33.763, lng: -84.424 },
  '30315': { lat: 33.709, lng: -84.382 }, '30316': { lat: 33.723, lng: -84.342 },
  '30317': { lat: 33.751, lng: -84.315 }, '30318': { lat: 33.779, lng: -84.432 },
  '30319': { lat: 33.875, lng: -84.338 }, '30322': { lat: 33.794, lng: -84.325 },
  '30324': { lat: 33.817, lng: -84.368 }, '30326': { lat: 33.848, lng: -84.361 },
  '30327': { lat: 33.851, lng: -84.404 }, '30328': { lat: 33.920, lng: -84.372 },
  '30331': { lat: 33.694, lng: -84.511 }, '30332': { lat: 33.775, lng: -84.396 },
  '30338': { lat: 33.943, lng: -84.351 }, '30339': { lat: 33.870, lng: -84.466 },
  '30340': { lat: 33.891, lng: -84.289 }, '30341': { lat: 33.885, lng: -84.295 },
  '30342': { lat: 33.870, lng: -84.374 }, '30344': { lat: 33.651, lng: -84.441 },
  '30346': { lat: 33.924, lng: -84.342 }, '30350': { lat: 33.969, lng: -84.341 },
  '30354': { lat: 33.649, lng: -84.408 }, '30363': { lat: 33.792, lng: -84.401 },
  '30002': { lat: 33.772, lng: -84.274 }, '30030': { lat: 33.774, lng: -84.296 },
  '30032': { lat: 33.740, lng: -84.296 }, '30033': { lat: 33.797, lng: -84.313 },
  '30034': { lat: 33.683, lng: -84.316 }, '30058': { lat: 33.722, lng: -84.196 },
  '30067': { lat: 33.905, lng: -84.477 }, '30068': { lat: 33.979, lng: -84.463 },
  '30075': { lat: 34.014, lng: -84.374 }, '30076': { lat: 34.027, lng: -84.340 },
  '30080': { lat: 33.851, lng: -84.496 }, '30082': { lat: 33.854, lng: -84.498 },
  '30083': { lat: 33.789, lng: -84.268 }, '30084': { lat: 33.858, lng: -84.264 },
  '30092': { lat: 33.967, lng: -84.236 }, '30093': { lat: 33.967, lng: -84.173 },
  '30096': { lat: 33.978, lng: -84.145 }, '30097': { lat: 34.025, lng: -84.137 },
  '30144': { lat: 34.034, lng: -84.583 }, '30168': { lat: 33.831, lng: -84.521 },
  '30188': { lat: 34.097, lng: -84.519 }, '30189': { lat: 34.069, lng: -84.561 },
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function TierBadge({ tier }: { tier: keyof typeof TIER_CONFIG }) {
  const cfg = TIER_CONFIG[tier]
  return (
    <span className={styles.tierBadge} style={{ background: cfg.bg, color: cfg.color }}>
      <Award size={9} />
      {cfg.label}
    </span>
  )
}

/* ─── Listings ─── */
const LISTINGS = [
  {
    id: '1', company: 'Grady Health System', industry: 'Healthcare', city: 'Atlanta, GA', lat: 33.756, lng: -84.380,
    type: 'Job Shadow', tier: 'gold' as const,
    title: 'A Day in the Life: Emergency Medicine',
    desc: 'Students spend a half-day with ER physicians and nurses. See triage, patient care, and hospital operations in action. No clinical experience needed.',
    outcomes: ['Meet ER physicians and nurses', 'Tour triage and patient care areas', 'Observe real hospital workflows'],
    careerAreas: ['Healthcare', 'Medicine', 'Leadership'],
    fliqOutcomes: ['Career Awareness', 'Systems Understanding', 'Workplace Exposure'],
    grades: '9–12', duration: '4 hrs', format: 'In-Person', capacity: 8, spotsAvailable: 3,
    status: 'Open' as const, distance: '4.1 miles away', months: ['Sep', 'Oct', 'Nov'],
    verified: true, rating: 4.9, reviews: 14,
    photo: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — site is accessible by MARTA', upcoming: 'Oct 14, 2026',
  },
  {
    id: '2', company: 'Delta Air Lines', industry: 'Logistics', city: 'Atlanta, GA', lat: 33.641, lng: -84.428,
    type: 'Site Visit', tier: 'gold' as const,
    title: 'Behind the Terminal: Aviation & Operations',
    desc: "Tour Delta's operations center and learn how 5,000+ daily flights are coordinated. Meet engineers, logistics coordinators, and operations analysts.",
    outcomes: ['Tour the Delta operations center', 'Meet engineers and analysts', 'Learn how 5,000+ daily flights are coordinated'],
    careerAreas: ['Aviation', 'Logistics', 'Technology'],
    fliqOutcomes: ['Career Awareness', 'Future Readiness', 'Systems Understanding'],
    grades: 'K–12', duration: '3 hrs', format: 'In-Person', capacity: 24, spotsAvailable: 18,
    status: 'Open' as const, distance: '8.7 miles away', months: ['Oct', 'Nov', 'Feb', 'Mar'],
    verified: true, rating: 4.8, reviews: 22,
    photo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — school must arrange', upcoming: 'Nov 5, 2026',
  },
  {
    id: '3', company: 'Truist Bank', industry: 'Finance', city: 'Atlanta, GA', lat: 33.774, lng: -84.388,
    type: 'Career Panel', tier: 'silver' as const,
    title: 'Money, Markets & Careers in Finance',
    desc: 'Four Truist professionals — from wealth management to commercial lending — share their career paths and answer student questions live.',
    outcomes: ['Hear from 4 finance professionals', 'Explore wealth management and lending careers', 'Ask career questions in real time'],
    careerAreas: ['Finance', 'Banking', 'Communication'],
    fliqOutcomes: ['Financial Literacy', 'Career Awareness', 'Communication'],
    grades: '6–12', duration: '90 min', format: 'Virtual or In-Person', capacity: 60, spotsAvailable: 45,
    status: 'Open' as const, distance: '2.3 miles away', months: ['Oct', 'Jan', 'Feb', 'Apr'],
    verified: true, rating: 4.7, reviews: 9,
    photo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=700&q=80',
    cost: 'Free', transportation: 'N/A — virtual option available', upcoming: 'Oct 22, 2026',
  },
  {
    id: '4', company: 'Chick-fil-A Corporate', industry: 'Hospitality', city: 'College Park, GA', lat: 33.648, lng: -84.450,
    type: 'Mentorship', tier: 'founding' as const,
    title: 'Leadership & Entrepreneurship Mentorship',
    desc: 'A semester-long mentorship pairing students with Chick-fil-A restaurant operators and franchise leaders. Weekly 45-min virtual check-ins focused on business ownership and leadership.',
    outcomes: ['Weekly mentor check-ins with operators', 'Build a personal leadership growth plan', 'Learn business ownership fundamentals'],
    careerAreas: ['Entrepreneurship', 'Leadership', 'Hospitality'],
    fliqOutcomes: ['Leadership', 'Problem Solving', 'Future Readiness'],
    grades: '9–12', duration: 'Semester', format: 'Virtual', capacity: 10, spotsAvailable: 2,
    status: 'Waitlisted' as const, distance: '12.4 miles away', months: ['Sep', 'Jan'],
    verified: true, rating: 5.0, reviews: 6,
    photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
    cost: 'Free', transportation: 'N/A — fully virtual', upcoming: 'Jan 12, 2027',
  },
  {
    id: '5', company: 'Georgia Power', industry: 'Skilled Trades', city: 'Atlanta, GA', lat: 33.749, lng: -84.388,
    type: 'Site Visit', tier: 'community' as const,
    title: 'Power Grid & Infrastructure Tour',
    desc: 'Explore how electricity is generated and distributed across Georgia. Meet lineworkers, engineers, and grid analysts at a working facility.',
    outcomes: ['Explore power generation and distribution', 'Meet lineworkers and grid engineers', 'See working energy infrastructure in action'],
    careerAreas: ['Energy', 'Engineering', 'Skilled Trades'],
    fliqOutcomes: ['Career Awareness', 'STEM Readiness', 'Systems Understanding'],
    grades: '9–12', duration: '2.5 hrs', format: 'In-Person', capacity: 20, spotsAvailable: 12,
    status: 'Open' as const, distance: '5.9 miles away', months: ['Oct', 'Mar', 'Apr'],
    verified: true, rating: 4.6, reviews: 11,
    photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — school must arrange', upcoming: 'Mar 10, 2027',
  },
  {
    id: '6', company: 'Dekalb Medical Center', industry: 'Healthcare', city: 'Decatur, GA', lat: 33.776, lng: -84.297,
    type: 'Internship', tier: 'gold' as const,
    title: 'Summer Health Sciences Internship',
    desc: 'A 6-week paid summer internship for rising 11th and 12th graders exploring healthcare careers. Rotations through 3 departments: nursing, lab, and administration.',
    outcomes: ['Rotate through 3 clinical departments', 'Work alongside nursing and lab professionals', 'Earn a program completion certificate'],
    careerAreas: ['Healthcare', 'Clinical Research', 'STEM'],
    fliqOutcomes: ['Career Awareness', 'Confidence', 'Future Readiness'],
    grades: '9–12', duration: '6 weeks', format: 'In-Person', capacity: 5, spotsAvailable: 1,
    status: 'Waitlisted' as const, distance: '7.2 miles away', months: ['Jun', 'Jul'],
    verified: true, rating: 4.9, reviews: 4,
    photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80',
    cost: 'Paid — $12/hr', transportation: 'Not provided — MARTA accessible', upcoming: 'Jun 1, 2027',
  },
  {
    id: '7', company: 'Cox Enterprises', industry: 'Technology', city: 'Atlanta, GA', lat: 33.849, lng: -84.356,
    type: 'Project Partnership', tier: 'founding' as const,
    title: 'Real Business Challenge: Digital Marketing',
    desc: 'Student teams tackle a real Cox marketing challenge over 6 weeks. Finalists present to Cox leadership. All teams receive professional feedback and portfolio documentation.',
    outcomes: ['Tackle a real Cox business challenge', 'Present strategy to Cox leadership', 'Build a portfolio-ready project'],
    careerAreas: ['Technology', 'Marketing', 'Entrepreneurship'],
    fliqOutcomes: ['Problem Solving', 'Communication', 'Leadership'],
    grades: '9–12', duration: '6 weeks', format: 'Hybrid', capacity: 30, spotsAvailable: 22,
    status: 'Open' as const, distance: '6.8 miles away', months: ['Feb', 'Mar'],
    verified: true, rating: 4.8, reviews: 3,
    photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80',
    cost: 'Free', transportation: 'N/A — primarily remote with one in-person presentation', upcoming: 'Feb 2, 2027',
  },
  {
    id: '8', company: 'Atlanta Fire Rescue', industry: 'Government', city: 'Atlanta, GA', lat: 33.749, lng: -84.388,
    type: 'Career Panel', tier: null,
    title: 'Public Safety Careers — From the Frontline',
    desc: 'Firefighters, paramedics, and fire inspectors discuss career paths, training requirements, and what a day on shift actually looks like.',
    outcomes: ['Hear from firefighters and paramedics', 'Learn public safety career paths', 'Ask real frontline professionals questions'],
    careerAreas: ['Public Safety', 'Government', 'Healthcare'],
    fliqOutcomes: ['Career Awareness', 'Communication', 'Future Readiness'],
    grades: 'K–12', duration: '1 hr', format: 'In-Person or Virtual', capacity: 100, spotsAvailable: 87,
    status: 'Open' as const, distance: '1.8 miles away', months: ['Sep', 'Oct', 'Nov', 'Feb', 'Mar', 'Apr'],
    verified: false, rating: 4.5, reviews: 7,
    photo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&q=80',
    cost: 'Free', transportation: 'N/A — they can come to your school', upcoming: 'Oct 8, 2026',
  },
  {
    id: '9', company: 'UPS Supply Chain Solutions', industry: 'Logistics', city: 'Sandy Springs, GA', lat: 33.931, lng: -84.373,
    type: 'Job Shadow', tier: 'silver' as const,
    title: 'Global Logistics: How the World Ships',
    desc: 'Follow a UPS supply chain analyst through a real workday. Learn how global shipping, customs, and last-mile delivery are coordinated at scale.',
    outcomes: ['Shadow a supply chain analyst all day', 'Learn how global shipping is coordinated', 'See customs and last-mile delivery in action'],
    careerAreas: ['Logistics', 'Technology', 'Operations'],
    fliqOutcomes: ['Systems Understanding', 'Career Awareness', 'Future Readiness'],
    grades: '6–12', duration: '6 hrs', format: 'In-Person', capacity: 6, spotsAvailable: 2,
    status: 'Open' as const, distance: '14.3 miles away', months: ['Oct', 'Nov', 'Jan', 'Mar'],
    verified: true, rating: 4.7, reviews: 8,
    photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — school must arrange', upcoming: 'Nov 19, 2026',
  },
  {
    id: '10', company: 'NCR Voyix', industry: 'Technology', city: 'Atlanta, GA', lat: 33.780, lng: -84.384,
    type: 'Site Visit', tier: 'community' as const,
    title: 'How Software Powers Every Transaction',
    desc: 'See how NCR Voyix engineers build the point-of-sale and digital banking software used by millions of businesses worldwide. Meet product managers, software developers, and UX designers.',
    outcomes: ['See enterprise software built in real time', 'Meet product managers, developers, and UX designers', 'Explore tech career pathways'],
    careerAreas: ['Technology', 'Software', 'Innovation'],
    fliqOutcomes: ['Career Awareness', 'STEM Readiness', 'Future Readiness'],
    grades: '9–12', duration: '3 hrs', format: 'In-Person', capacity: 20, spotsAvailable: 16,
    status: 'Open' as const, distance: '3.2 miles away', months: ['Oct', 'Nov', 'Feb', 'Mar'],
    verified: true, rating: 4.8, reviews: 5,
    photo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — school must arrange', upcoming: 'Nov 12, 2026',
  },
  {
    id: '11', company: 'The Coca-Cola Company', industry: 'Manufacturing', city: 'Atlanta, GA', lat: 33.761, lng: -84.403,
    type: 'Career Panel', tier: 'gold' as const,
    title: 'From Formula to Shelf: Careers Across a Global Brand',
    desc: 'Five Coca-Cola professionals — spanning food science, supply chain, marketing, and finance — share what it takes to bring a global brand to market and answer student questions live.',
    outcomes: ['Hear from 5 global brand professionals', 'Explore food science, supply chain, and marketing', 'Understand how consumer brands go to market'],
    careerAreas: ['Manufacturing', 'Marketing', 'Business'],
    fliqOutcomes: ['Career Awareness', 'Financial Literacy', 'Systems Understanding'],
    grades: '6–12', duration: '90 min', format: 'In-Person or Virtual', capacity: 60, spotsAvailable: 44,
    status: 'Open' as const, distance: '2.0 miles away', months: ['Oct', 'Feb', 'Apr'],
    verified: true, rating: 4.9, reviews: 7,
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=80',
    cost: 'Free', transportation: 'N/A — virtual option available', upcoming: 'Oct 29, 2026',
  },
  {
    id: '12', company: 'Emory University Hospital', industry: 'Healthcare', city: 'Atlanta, GA', lat: 33.799, lng: -84.324,
    type: 'Job Shadow', tier: 'gold' as const,
    title: 'Research Medicine: Inside a Teaching Hospital',
    desc: 'Spend a half-day with Emory researchers and residents. Students rotate through clinical research, lab science, and patient advocacy roles to see where medicine meets innovation.',
    outcomes: ['Rotate through clinical research and lab science', 'Meet Emory researchers and residents', 'See where medicine meets innovation'],
    careerAreas: ['Healthcare', 'Research', 'STEM'],
    fliqOutcomes: ['Career Awareness', 'STEM Readiness', 'Workplace Exposure'],
    grades: '9–12', duration: '4 hrs', format: 'In-Person', capacity: 10, spotsAvailable: 7,
    status: 'Open' as const, distance: '6.5 miles away', months: ['Nov', 'Jan', 'Mar'],
    verified: true, rating: 4.9, reviews: 6,
    photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — MARTA accessible', upcoming: 'Jan 21, 2027',
  },
  {
    id: '13', company: 'Warner Bros. Discovery / CNN', industry: 'Technology', city: 'Atlanta, GA', lat: 33.759, lng: -84.397,
    type: 'Site Visit', tier: 'community' as const,
    title: 'Behind the Broadcast: How News Gets Made',
    desc: "Tour CNN's Atlanta headquarters. Meet journalists, video editors, data analysts, and producers. Students see a live control room and learn how digital storytelling works at global scale.",
    outcomes: ['Tour CNN Atlanta headquarters', 'See a live news control room', 'Meet journalists, editors, and data analysts'],
    careerAreas: ['Media', 'Technology', 'Communication'],
    fliqOutcomes: ['Career Awareness', 'Communication', 'Future Readiness'],
    grades: '6–12', duration: '2 hrs', format: 'In-Person', capacity: 25, spotsAvailable: 19,
    status: 'Open' as const, distance: '1.5 miles away', months: ['Sep', 'Oct', 'Feb', 'Mar', 'Apr'],
    verified: true, rating: 4.8, reviews: 11,
    photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — walkable from MARTA Centennial Park', upcoming: 'Oct 16, 2026',
  },
  {
    id: '14', company: 'Atlanta Hawks / State Farm Arena', industry: 'Hospitality', city: 'Atlanta, GA', lat: 33.757, lng: -84.396,
    type: 'Project Partnership', tier: null,
    title: 'Sports Business Lab: Run a Real Campaign',
    desc: 'Student teams take on a real sports marketing challenge — fan engagement, merchandise, or community outreach — and present their strategy to Hawks business staff.',
    outcomes: ['Build a real sports marketing campaign', 'Present strategy to Hawks business staff', 'Gain portfolio-ready project experience'],
    careerAreas: ['Sports Business', 'Marketing', 'Entrepreneurship'],
    fliqOutcomes: ['Leadership', 'Problem Solving', 'Communication'],
    grades: '9–12', duration: '4 weeks', format: 'Hybrid', capacity: 24, spotsAvailable: 18,
    status: 'Open' as const, distance: '2.8 miles away', months: ['Jan', 'Feb'],
    verified: false, rating: 4.7, reviews: 3,
    photo: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=700&q=80',
    cost: 'Free', transportation: 'Not provided — MARTA State Farm Arena station', upcoming: 'Jan 26, 2027',
  },
]

type Listing = typeof LISTINGS[0]

/* ─── Page Component ─── */
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
  const [dbLoading,      setDbLoading]      = useState(true)
  const [distanceFilter, setDistanceFilter] = useState(25)
  const [userCoords,     setUserCoords]     = useState<{ lat: number; lng: number } | null>(null)
  const [zipInvalid,     setZipInvalid]     = useState(false)

  const [requesting,    setRequesting]    = useState(false)
  const [reqName,       setReqName]       = useState('')
  const [reqOrg,        setReqOrg]        = useState('')
  const [reqEmail,      setReqEmail]      = useState('')
  const [reqStudents,   setReqStudents]   = useState('')
  const [reqDates,      setReqDates]      = useState('')
  const [reqMessage,    setReqMessage]    = useState('')
  const [reqSubmitting, setReqSubmitting] = useState(false)
  const [reqDone,       setReqDone]       = useState(false)
  const [reqError,      setReqError]      = useState('')

  const openRequest = () => { setRequesting(true); setReqDone(false); setReqError('') }

  const closeModal = () => {
    setSelected(null); setRequesting(false); setReqDone(false)
    setReqName(''); setReqOrg(''); setReqEmail('')
    setReqStudents(''); setReqDates(''); setReqMessage(''); setReqError('')
  }

  const submitRequest = async () => {
    if (!reqName || !reqOrg || !reqEmail) { setReqError('Please fill in your name, organization, and email.'); return }
    setReqSubmitting(true); setReqError('')
    try {
      await fetch('/api/request-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_title: selected?.title, company: selected?.company, industry: selected?.industry,
          requester_name: reqName, requester_org: reqOrg, requester_email: reqEmail,
          students: reqStudents, preferred_dates: reqDates, message: reqMessage,
        }),
      })
      setReqDone(true)
    } catch { setReqError('Something went wrong. Please try again.') }
    finally { setReqSubmitting(false) }
  }

  const handleChipClick = (chip: string) => {
    setSearch(chip)
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOutcomeClick = (outcomeName: string) => {
    setSearch(outcomeName)
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('field_labs')
      .select('*, pathway_site_applications(company, industry, city)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDbLoading(false)
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
          type: lab.type, tier: null,
          title: lab.title,
          desc: lab.description ?? `A real-world ${lab.type.toLowerCase()} experience for students.`,
          outcomes: [], careerAreas: [], fliqOutcomes: [],
          grades: lab.grade_levels ?? 'K–12', duration: lab.duration ?? 'Varies',
          format: lab.is_virtual ? 'Virtual' : 'In-Person',
          capacity: lab.capacity ?? 20, spotsAvailable: lab.capacity ?? 20,
          status: 'Open' as const, distance: '—', months: [] as string[],
          verified: true, rating: 0, reviews: 0,
          photo: INDUSTRY_PHOTOS[lab.pathway_site_applications?.industry ?? ''] ?? DEFAULT_PHOTO,
          cost: 'Free',
          transportation: lab.is_virtual ? 'N/A — virtual' : 'Contact for details',
          upcoming: 'Contact to schedule',
          lat: 33.749, lng: -84.388,
        }))
        setDbListings(fresh)
      })
  }, [])

  useEffect(() => {
    if (zipCode.length < 5) { setUserCoords(null); setZipInvalid(false); return }
    const coords = ZIP_COORDS[zipCode]
    if (coords) { setUserCoords(coords); setZipInvalid(false) }
    else { setUserCoords(null); setZipInvalid(true) }
  }, [zipCode])

  const ALL_LISTINGS = [...LISTINGS, ...dbListings]

  const filtered = ALL_LISTINGS.filter(l => {
    if (typeFilter !== 'All Types' && l.type !== typeFilter) return false
    if (industryFilter !== 'All Industries' && l.industry !== industryFilter) return false
    if (gradeFilter !== 'All Grades' && l.grades !== gradeFilter) return false
    if (statusFilter !== 'All Statuses' && l.status !== statusFilter) return false
    if (monthFilter && !l.months.includes(monthFilter)) return false
    if (userCoords) {
      const dist = haversineDistance(userCoords.lat, userCoords.lng, l.lat, l.lng)
      if (dist > distanceFilter) return false
    }
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.company.toLowerCase().includes(search.toLowerCase()) &&
        !l.industry.toLowerCase().includes(search.toLowerCase()) &&
        !(l.careerAreas ?? []).some((a: string) => a.toLowerCase().includes(search.toLowerCase())) &&
        !(l.fliqOutcomes ?? []).some((o: string) => o.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  const clearFilters = () => {
    setTypeFilter('All Types'); setIndustryFilter('All Industries')
    setGradeFilter('All Grades'); setStatusFilter('All Statuses')
    setMonthFilter(null); setSearch(''); setZipCode('')
    setUserCoords(null); setZipInvalid(false); setDistanceFilter(25)
  }

  const hasFilters = typeFilter !== 'All Types' || industryFilter !== 'All Industries' ||
    gradeFilter !== 'All Grades' || statusFilter !== 'All Statuses' ||
    monthFilter !== null || search !== '' || userCoords !== null

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
          <p className={styles.heroEyebrow}>Real-World Pathways™</p>
          <h1 className={styles.heroH1}>Find the Right Career Experience<br />for Every Student.</h1>
          <p className={styles.heroSub}>
            Vetted workplace experiences across Atlanta — site visits, job shadows, mentorships, career panels, and more.
          </p>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchBarIcon} />
            <input
              className={styles.searchBarInput}
              placeholder="Search by industry, company, or experience type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <div className={styles.heroChips}>
            {QUICK_CHIPS.map(chip => (
              <button
                key={chip}
                className={`${styles.heroChip} ${search === chip ? styles.heroChipActive : ''}`}
                onClick={() => handleChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL FILTER BAR ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarInner}>
          <select className={styles.filterDrop} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className={styles.filterDrop} value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select className={styles.filterDrop} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
            {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select className={styles.filterDrop} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {hasFilters && (
            <button className={styles.filterClearBtn} onClick={clearFilters}>
              <X size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className={styles.body} id="listings">

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

          {/* ZIP + Distance slider */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Near ZIP Code</p>
            <div className={styles.zipInputWrap}>
              <Navigation size={13} className={styles.zipIcon} />
              <input
                type="text" maxLength={5} className={styles.zipInput}
                placeholder="e.g. 30308" value={zipCode}
                onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {zipInvalid && <p className={styles.zipInvalidNote}>ZIP not found — try an Atlanta-area ZIP</p>}
            {userCoords && (
              <>
                <div className={styles.distanceSliderRow}>
                  <span className={styles.distanceSliderLabel}>Within</span>
                  <span className={styles.distanceSliderVal}>{distanceFilter} mi</span>
                </div>
                <input
                  type="range" min={1} max={50} value={distanceFilter}
                  className={styles.distanceSlider}
                  style={{ '--fill': `${((distanceFilter - 1) / 49) * 100}%` } as React.CSSProperties}
                  onChange={e => setDistanceFilter(Number(e.target.value))}
                />
                <div className={styles.distanceSliderTicks}>
                  <span>1 mi</span><span>25 mi</span><span>50 mi</span>
                </div>
                <p className={styles.zipNote}>Filtering from ZIP {zipCode}</p>
              </>
            )}
            {!userCoords && !zipInvalid && zipCode.length === 0 && (
              <p className={styles.distanceSliderHint}>Enter ZIP to filter by distance</p>
            )}
          </div>

          <div className={styles.filterGroupDivider} />

          {/* Availability */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Availability</p>
            {STATUS_OPTIONS.map(s => (
              <button key={s} className={`${styles.filterOption} ${statusFilter === s ? styles.filterOptionActive : ''}`} onClick={() => setStatusFilter(s)}>
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

          <div className={styles.filterGroupDivider} />

          {/* Experience Type */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Experience Type</p>
            {EXP_TYPES.map(t => (
              <button key={t} className={`${styles.filterOption} ${typeFilter === t ? styles.filterOptionActive : ''}`} onClick={() => setTypeFilter(t)}>
                {t}
                {typeFilter === t && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          <div className={styles.filterGroupDivider} />

          {/* Industry */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Industry</p>
            {INDUSTRIES.map(i => (
              <button key={i} className={`${styles.filterOption} ${industryFilter === i ? styles.filterOptionActive : ''}`} onClick={() => setIndustryFilter(i)}>
                {i}
                {industryFilter === i && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          <div className={styles.filterGroupDivider} />

          {/* Grade Level */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Grade Level</p>
            {GRADE_LEVELS.map(g => (
              <button key={g} className={`${styles.filterOption} ${gradeFilter === g ? styles.filterOptionActive : ''}`} onClick={() => setGradeFilter(g)}>
                {g}
                {gradeFilter === g && <span className={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          <div className={styles.filterGroupDivider} />

          {/* Month */}
          <div className={styles.filterGroup}>
            <p className={styles.filterGroupLabel}>Month Available</p>
            <div className={styles.sidebarMonthGrid}>
              {MONTHS.map(m => (
                <button
                  key={m}
                  className={`${styles.sidebarMonthPill} ${monthFilter === m ? styles.sidebarMonthPillActive : ''}`}
                  onClick={() => setMonthFilter(monthFilter === m ? null : m)}
                >
                  {m}
                </button>
              ))}
            </div>
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
              {search && <span className={styles.activeFilterTag}>&ldquo;{search}&rdquo; <button onClick={() => setSearch('')}>×</button></span>}
            </p>
            <div className={styles.topBarRight}>
              <div className={styles.viewToggle}>
                <button className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`} onClick={() => setViewMode('grid')} title="Grid view"><LayoutGrid size={15} /></button>
                <button className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`} onClick={() => setViewMode('list')} title="List view"><List size={15} /></button>
              </div>
              <Link href="/register?type=biz" className={styles.listYoursBtn}>
                + List Your Experience
              </Link>
            </div>
          </div>

          {dbLoading ? (
            <div className={styles.grid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={styles.card} style={{ pointerEvents: 'none' }}>
                  <div className={styles.cardPhoto} style={{ background: '#EDE9F5' }} />
                  <div className={styles.cardBody}>
                    <div style={{ height: 11, width: '50%', background: '#EDE9F5', borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ height: 16, width: '85%', background: '#E8E4F4', borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 11, width: '65%', background: '#F0EDF8', borderRadius: 6, marginBottom: 18 }} />
                    <div style={{ height: 11, width: '45%', background: '#F5F3FB', borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
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
                  {/* Photo */}
                  <div className={styles.cardPhoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.photo} alt={listing.title} className={styles.cardImg} />
                    <div className={styles.cardPhotoOverlay} />
                    <div className={styles.cardPhotoContent}>
                      <div className={styles.cardTopRow}>
                        <span className={styles.cardType}>{listing.type}</span>
                        {listing.tier && <TierBadge tier={listing.tier as keyof typeof TIER_CONFIG} />}
                      </div>
                      <div className={styles.cardBottomRow}>
                        <span className={`${styles.statusBadge} ${statusClass(listing.status)}`}>{listing.status}</span>
                        <span className={styles.spotsTag}>{spotsLabel(listing)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardCompany}>
                      <Building2 size={12} className={styles.cardCompanyIcon} />
                      {listing.company}
                    </div>
                    <h3 className={styles.cardTitle}>{listing.title}</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardInfo}><Users size={12} /> {listing.grades}</span>
                      <span className={styles.cardInfo}><Clock size={12} /> {listing.duration}</span>
                    </div>
                    <button className={styles.cardCta} onClick={e => { e.stopPropagation(); setSelected(listing) }}>
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            /* ── LIST VIEW ── */
            <div className={styles.listGrid}>
              {filtered.map(listing => (
                <div key={listing.id} className={`${styles.listCard} ${selected?.id === listing.id ? styles.cardSelected : ''}`} onClick={() => setSelected(listing)}>
                  <div className={styles.listCardPhoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.photo} alt={listing.title} className={styles.listCardImg} />
                    <div className={styles.listCardPhotoOverlay} />
                    <span className={`${styles.statusBadge} ${statusClass(listing.status)}`} style={{ position: 'absolute', bottom: 8, left: 8 }}>{listing.status}</span>
                  </div>
                  <div className={styles.listCardBody}>
                    <div className={styles.cardCompany}><Building2 size={12} className={styles.cardCompanyIcon} />{listing.company}</div>
                    <h3 className={styles.listCardTitle}>{listing.title}</h3>
                    <div className={styles.listCardMeta}>
                      <span className={styles.listMetaTag}>{listing.type}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}><Users size={12} /> {listing.grades}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}><Clock size={12} /> {listing.duration}</span>
                      <span className={styles.listMetaDot}>·</span>
                      <span className={styles.listMetaItem}>{listing.city}</span>
                    </div>
                  </div>
                  <div className={styles.listCardCta}>
                    <button className={styles.cardCta} onClick={e => { e.stopPropagation(); setSelected(listing) }}>
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
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.photo} alt={selected.title} className={styles.modalImg} />
              <div className={styles.modalPhotoOverlay} />
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
              <div className={styles.modalPhotoContent}>
                <div className={styles.modalTopRow}>
                  <span className={styles.cardType}>{selected.type}</span>
                  {selected.tier && <TierBadge tier={selected.tier as keyof typeof TIER_CONFIG} />}
                  {selected.verified && !selected.tier && <span className={styles.verifiedBadge}><ShieldCheck size={11} /> Verified Partner</span>}
                </div>
                <div className={styles.modalStatusRow}>
                  <span className={`${styles.statusBadge} ${statusClass(selected.status)}`}>{selected.status}</span>
                  <span className={styles.spotsTag}>{spotsLabel(selected)}</span>
                </div>
                <h2 className={styles.modalTitle}>{selected.title}</h2>
                <p className={styles.modalCompany}>{selected.company} · {selected.city}</p>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <div className={styles.modalMetaItem}><Clock size={14} /><span>{selected.duration}</span></div>
                <div className={styles.modalMetaItem}><Users size={14} /><span>Grades {selected.grades}</span></div>
                <div className={styles.modalMetaItem}><MapPin size={14} /><span>{selected.format}</span></div>
                <div className={styles.modalMetaItem}><Users size={14} /><span>{selected.spotsAvailable} of {selected.capacity} spots open</span></div>
                <div className={styles.modalMetaItem}><DollarSign size={14} /><span>{selected.cost}</span></div>
                <div className={styles.modalMetaItem}><Bus size={14} /><span>{selected.transportation}</span></div>
              </div>

              <p className={styles.modalDesc}>{selected.desc}</p>

              {selected.outcomes?.length > 0 && (
                <div className={styles.modalSection}>
                  <p className={styles.modalSectionLabel}>Students Will</p>
                  <div className={styles.modalSteps}>
                    {selected.outcomes.map((o, i) => (
                      <div key={i} className={styles.modalStep}>
                        <CheckCircle2 size={14} className={styles.modalStepIcon} />
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.fliqOutcomes?.length > 0 && (
                <div className={styles.modalSection}>
                  <p className={styles.modalSectionLabel}>FLIQ™ Outcomes Measured</p>
                  <div className={styles.modalFliqRow}>
                    {selected.fliqOutcomes.map((o, i) => (
                      <span key={i} className={styles.modalFliqChip}>{o}</span>
                    ))}
                  </div>
                </div>
              )}

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
                  {selected.months.map(m => <span key={m} className={styles.modalMonthPill}>{m}</span>)}
                </div>
              </div>

              <div className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Next Available Date</p>
                <div className={styles.modalUpcoming}><Calendar size={15} /><strong>{selected.upcoming}</strong></div>
              </div>

              <div className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Rating & Reviews</p>
                <div className={styles.modalRating}>
                  <Star size={16} className={styles.starIconLg} />
                  <strong>{selected.rating}</strong>
                  <span>out of 5 — {selected.reviews} reviews from schools</span>
                </div>
              </div>

              {!requesting && !reqDone && (
                <div className={styles.modalActions}>
                  <button className={styles.modalCta} onClick={openRequest}>
                    Request This Experience <ChevronRight size={16} />
                  </button>
                  <button className={styles.modalSave} onClick={closeModal}>Close</button>
                  <Link
                    href={`/reflect?expId=${selected.id}&company=${encodeURIComponent(selected.company)}&type=${encodeURIComponent(selected.type)}&date=${encodeURIComponent(selected.upcoming)}`}
                    className={styles.modalReflect}
                  >
                    Already completed this experience? Submit a reflection →
                  </Link>
                </div>
              )}

              {requesting && !reqDone && (
                <div className={styles.requestForm}>
                  <p className={styles.requestFormTitle}>Request This Experience</p>
                  <p className={styles.requestFormSub}>Tell us about your group. We&apos;ll connect you with <strong>{selected.company}</strong> within 48 hours.</p>
                  <div className={styles.requestFormFields}>
                    <div className={styles.requestFieldGroup}>
                      <label className={styles.requestLabel}>Your Full Name *</label>
                      <input className={styles.requestInput} placeholder="Jane Smith" value={reqName} onChange={e => setReqName(e.target.value)} />
                    </div>
                    <div className={styles.requestFieldGroup}>
                      <label className={styles.requestLabel}>Organization / School Name *</label>
                      <input className={styles.requestInput} placeholder="Lincoln High School" value={reqOrg} onChange={e => setReqOrg(e.target.value)} />
                    </div>
                    <div className={styles.requestFieldGroup}>
                      <label className={styles.requestLabel}>Your Email *</label>
                      <input className={styles.requestInput} type="email" placeholder="jane@school.org" value={reqEmail} onChange={e => setReqEmail(e.target.value)} />
                    </div>
                    <div className={styles.requestFieldRow}>
                      <div className={styles.requestFieldGroup}>
                        <label className={styles.requestLabel}>Number of Students</label>
                        <input className={styles.requestInput} placeholder="e.g. 24" value={reqStudents} onChange={e => setReqStudents(e.target.value)} inputMode="numeric" />
                      </div>
                      <div className={styles.requestFieldGroup}>
                        <label className={styles.requestLabel}>Preferred Dates</label>
                        <input className={styles.requestInput} placeholder="e.g. Oct or Nov 2026" value={reqDates} onChange={e => setReqDates(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.requestFieldGroup}>
                      <label className={styles.requestLabel}>Anything else we should know? <span style={{ fontWeight: 400, color: '#9C8FBF' }}>(optional)</span></label>
                      <textarea className={styles.requestTextarea} placeholder="Grade level, learning goals, accessibility needs…" value={reqMessage} onChange={e => setReqMessage(e.target.value)} rows={3} />
                    </div>
                  </div>
                  {reqError && <p className={styles.requestError}>{reqError}</p>}
                  <div className={styles.requestFormActions}>
                    <button className={styles.modalCta} onClick={submitRequest} disabled={reqSubmitting}>
                      {reqSubmitting ? 'Sending…' : 'Send Request'} {!reqSubmitting && <ChevronRight size={16} />}
                    </button>
                    <button className={styles.modalSave} onClick={() => setRequesting(false)}>← Back</button>
                  </div>
                </div>
              )}

              {reqDone && (
                <div className={styles.requestSuccess}>
                  <CheckCircle2 size={36} className={styles.requestSuccessIcon} />
                  <p className={styles.requestSuccessTitle}>Request Sent!</p>
                  <p className={styles.requestSuccessSub}>
                    We&apos;ve notified <strong>{selected.company}</strong>. Expect a response within 48 hours at <strong>{reqEmail}</strong>.
                  </p>
                  <div className={styles.reflectLinkBox}>
                    <p className={styles.reflectLinkLabel}>Bookmark your post-experience reflection link</p>
                    <p className={styles.reflectLinkSub}>After the experience, open this link to submit your RWP Pathway Score™.</p>
                    <a className={styles.reflectLinkUrl} href={`/reflect?company=${encodeURIComponent(selected.company)}&type=${encodeURIComponent(selected.type)}&expId=${selected.id}`} target="_blank" rel="noreferrer">
                      Open Reflection Form <ChevronRight size={13} />
                    </a>
                  </div>
                  <button className={styles.modalCta} onClick={closeModal} style={{ marginTop: 8 }}>Back to Marketplace</button>
                </div>
              )}

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
