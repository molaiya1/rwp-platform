'use client'

import Link from 'next/link'
import { ChevronRight, ShieldCheck, TrendingUp, Users, BookOpen } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './about.module.css'

const PILLARS = [
  {
    Icon: ShieldCheck,
    title: 'Safety First',
    desc: 'Every Pathway Site is vetted through a multi-step certification process — insurance verification, background checks, and youth safety training before any student sets foot inside.',
  },
  {
    Icon: TrendingUp,
    title: 'Measurable Outcomes',
    desc: 'We track career awareness, financial literacy connections, and student engagement after every Field Lab. The data belongs to the school — and eventually, to the student.',
  },
  {
    Icon: Users,
    title: 'Equity by Design',
    desc: 'Every experience on this platform is free for students and organizations. We remove financial barriers so that access to real-world opportunity is not determined by zip code.',
  },
  {
    Icon: BookOpen,
    title: 'Rooted in Curriculum',
    desc: 'Real-World Pathways™ is part of the WealthWise Kids® ecosystem — a full financial and economic literacy infrastructure that includes simulations, assessments, and field-based learning.',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteNav />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>About Real-World Pathways™</p>
          <h1 className={styles.h1}>
            The infrastructure connecting<br />Atlanta&apos;s students to its economy.
          </h1>
          <p className={styles.heroSub}>
            Real-World Pathways™ is a platform built to solve one of the most persistent
            problems in youth education: the gap between what students learn in school
            and what the real economy actually looks like.
          </p>
        </div>
      </section>

      {/* ── MISSION BLOCK ── */}
      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <div className={styles.missionText}>
            <h2 className={styles.sectionTitle}>Why We Built This</h2>
            <p className={styles.body}>
              Most students — especially in under-resourced communities — graduate without
              ever having seen the inside of a real workplace. They know what they&apos;ve
              been told careers look like. They don&apos;t know what those careers actually
              feel like at 10am on a Tuesday.
            </p>
            <p className={styles.body}>
              That&apos;s not a curriculum problem. It&apos;s an access problem.
            </p>
            <p className={styles.body}>
              Real-World Pathways™ exists to close that gap — systematically, safely,
              and at scale. We built the coordination infrastructure so schools and
              nonprofits can connect their students to real businesses, real professionals,
              and real career exposure without the overhead of doing it alone.
            </p>
          </div>
          <div className={styles.missionCard}>
            <p className={styles.missionQuote}>
              &ldquo;We didn&apos;t build another field trip app. We built the trust
              and coordination layer that makes sustained, structured, real-world
              learning possible for every student — regardless of what their
              school can afford.&rdquo;
            </p>
            <p className={styles.missionAttrib}>— Real-World Pathways™ Leadership Team</p>
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className={styles.founder}>
        <div className={styles.founderInner}>
          <div className={styles.founderPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wwk-transparent.png" alt="WealthWise Kids" className={styles.founderLogoImg} />
          </div>
          <div className={styles.founderText}>
            <p className={styles.founderEyebrow}>How We Work</p>
            <h2 className={styles.founderName}>Built by Educators, Operators &amp; Community Leaders</h2>
            <p className={styles.founderBio}>
              Real-World Pathways™ is developed by a cross-functional team spanning
              curriculum design, workforce development, youth program management,
              and technology. We work directly with Atlanta-area schools, nonprofits,
              and businesses to make sure the platform reflects what actually happens
              on the ground — not what looks good in a pitch deck.
            </p>
            <p className={styles.founderBio}>
              We operate as part of the WealthWise Kids® ecosystem — a suite of
              tools built to give every student a complete financial and economic
              literacy experience, from simulation to real-world exposure to
              measurable skill outcomes. Our mission is to close the access gap
              at scale, one career field trip at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className={styles.pillars}>
        <div className={styles.pillarsInner}>
          <h2 className={styles.sectionTitle}>What We Stand For</h2>
          <div className={styles.pillarsGrid}>
            {PILLARS.map(p => (
              <div key={p.title} className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <p.Icon size={24} />
                </div>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ── */}
      <section className={styles.ecosystem}>
        <div className={styles.ecosystemInner}>
          <h2 className={styles.sectionTitle}>Part of a Larger Ecosystem</h2>
          <p className={styles.ecosystemSub}>
            Real-World Pathways™ is one program within the WealthWise Kids® ecosystem —
            a connected suite of tools designed to give every student a complete
            financial and economic literacy experience.
          </p>
          <div className={styles.ecosystemCards}>
            {[
              { name: 'The $100 Week™', desc: 'A free 5-day browser simulation where students manage a real budget, make financial decisions, and earn a FLIQ Score™.', href: 'https://play.wealthwiselearning.com' },
              { name: 'Financial Foundations™', desc: 'A licensed K–12 curriculum delivering structured financial literacy instruction aligned to national standards.', href: null },
              { name: 'Real-World Pathways™', desc: 'The field experience and career exposure layer — connecting students to businesses, professionals, and real-world opportunity.', href: null, active: true },
            ].map(item => (
              <div key={item.name} className={`${styles.ecoCard} ${item.active ? styles.ecoCardActive : ''}`}>
                <h3 className={styles.ecoCardTitle}>{item.name}</h3>
                <p className={styles.ecoCardDesc}>{item.desc}</p>
                {item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.ecoCardLink}>
                    Visit <ChevronRight size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to be part of it?</h2>
          <p className={styles.ctaSub}>
            We&apos;re enrolling our founding cohort of Certified Pathway Sites™ and
            Impact Organizations™ in Atlanta now. Join early and help shape
            what this network becomes.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register?type=biz" className={styles.btnPrimary}>
              Apply as a Business <ChevronRight size={15} />
            </Link>
            <Link href="/register?type=org" className={styles.btnOutline}>
              Register as an Organization
            </Link>
          </div>
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
