'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './experiences.module.css'

const EXPERIENCES = [
  {
    title: 'Site Visits',
    desc: 'Students visit real workplaces and see careers in action. Businesses open their doors and show youth what a real workday looks like across any industry.',
    tag: 'In-Person · 2–4 hrs',
    audience: 'All grade levels',
    gradient: 'linear-gradient(135deg, #6B5A8E 0%, #4B2D8A 100%)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'Job Shadows',
    desc: 'Youth spend a half or full day following a professional through their real workday — building industry awareness and career clarity that a classroom can\'t provide.',
    tag: 'In-Person · 4–8 hrs',
    audience: 'Grades 7–12',
    gradient: 'linear-gradient(135deg, #4B2D8A 0%, #1C1635 100%)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
      </svg>
    ),
  },
  {
    title: 'Career Panels',
    desc: 'Industry professionals speak to groups about their career paths, daily realities, and advice. Perfect for career days, classroom visits, or virtual sessions.',
    tag: 'In-Person or Virtual · 1–2 hrs',
    audience: 'All grade levels',
    gradient: 'linear-gradient(135deg, #1C1635 0%, #6B5A8E 100%)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Mentorships',
    desc: 'Sustained relationships between youth and professionals over a semester or full year. Weekly or bi-weekly check-ins that build confidence, skills, and long-term vision.',
    tag: 'Ongoing · Weekly or Bi-weekly',
    audience: 'Grades 6–12',
    gradient: 'linear-gradient(135deg, #8B6AAE 0%, #6B5A8E 100%)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    title: 'Internships',
    desc: 'Structured paid or unpaid work experiences for high school and college-bound youth. Businesses gain motivated contributors; students gain real-world credentials.',
    tag: 'In-Person · 4–12 weeks',
    audience: 'Grades 10–12',
    gradient: 'linear-gradient(135deg, #1C1635 0%, #4B2D8A 100%)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    title: 'Project Partnerships',
    desc: 'Students tackle real business challenges as a team. Businesses get fresh perspectives on real problems; youth build portfolio-worthy collaborative experience.',
    tag: 'Hybrid · 4–8 weeks',
    audience: 'Grades 8–12',
    gradient: 'linear-gradient(135deg, #5A4A7E 0%, #8B72B0 100%)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

export default function ExperiencesPage() {
  return (
    <div className={styles.page}>

      <SiteNav />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Real-World Pathways™</p>
          <h1 className={styles.heroH1}>Every Experience<br />Changes a Career.</h1>
          <p className={styles.heroSub}>
            Six types of structured, verified real-world experiences — designed for every age,
            every industry, and every level of commitment.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register?type=org" className={styles.btnPrimary}>
              Find Experiences for My Students <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/register?type=biz" className={styles.btnOutline}>
              Offer an Experience
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE CARDS ── */}
      <section className={styles.grid} aria-label="Experience types">
        <div className={styles.gridInner}>
          {EXPERIENCES.map(e => (
            <div key={e.title} className={styles.card}>
              <div className={styles.cardTop} style={{ background: e.gradient }}>
                <div className={styles.cardIcon}>{e.icon}</div>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTag}>{e.tag}</span>
                  <span className={styles.cardAudience}>{e.audience}</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{e.title}</h2>
                <p className={styles.cardDesc}>{e.desc}</p>
                <div className={styles.cardActions}>
                  <Link href="/register?type=org" className={styles.cardCtaOrg}>
                    I need this for my students
                  </Link>
                  <Link href="/register?type=biz" className={styles.cardCtaBiz}>
                    I can offer this
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaInner}>
          <h2 className={styles.bottomCtaH2}>Not sure where to start?</h2>
          <p className={styles.bottomCtaSub}>
            Create a free profile and we'll match you with experiences and partners
            that fit your students, your industry, and your timeline.
          </p>
          <Link href="/register" className={styles.btnPrimary}>
            Get Started Free <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
            <a href="/terms"   className={styles.footerLink}>Terms of Use</a>
            <a href="/contact" className={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
