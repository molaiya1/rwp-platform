'use client'

import Link from 'next/link'
import {
  ShieldCheck, CheckCircle2, FileText, Users, Lock,
  AlertTriangle, ChevronRight, Eye, BookOpen, Award,
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './safety.module.css'

const CERT_STEPS = [
  {
    num: '01',
    icon: FileText,
    title: 'Application Review',
    desc: 'Every business submits a formal application including company details, contact information, EIN verification, and the types of experiences they intend to offer. No business goes live without a completed application.',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Background Screening',
    desc: 'All designated site contacts who will interact with youth must submit to a background check before any student activity is approved. This is non-negotiable and is re-verified annually.',
  },
  {
    num: '03',
    icon: Award,
    title: 'Insurance Verification',
    desc: 'Pathway Sites must carry a minimum of $1,000,000 in general liability insurance and provide proof of coverage. Insurance expiration is tracked in our admin system and must be renewed to maintain active status.',
  },
  {
    num: '04',
    icon: BookOpen,
    title: 'Youth Safety Training',
    desc: 'All site contacts complete mandatory youth safety and professional conduct training before their first Field Lab. Training covers appropriate interactions, emergency procedures, and mandatory reporting obligations.',
  },
  {
    num: '05',
    icon: FileText,
    title: 'Document Submission',
    desc: 'Pathway Sites must have three documents on file: a Youth Safety Policy, a Professional Code of Conduct, and a Youth Protection Agreement. All documents are reviewed by our admin team.',
  },
  {
    num: '06',
    icon: CheckCircle2,
    title: 'Admin Approval',
    desc: 'Every application is manually reviewed and approved by the RWP admin team before a business is listed or permitted to host any student experience. No auto-approvals.',
  },
]

const DATA_PRACTICES = [
  {
    Icon: Lock,
    title: 'FERPA Compliant',
    desc: 'Real-World Pathways™ operates as a "school official" under FERPA when receiving student data from partnering organizations. We do not share, sell, or disclose student records without proper authorization.',
  },
  {
    Icon: Eye,
    title: 'COPPA-Aware',
    desc: 'For students under 13, we require verifiable parental or guardian consent before any personal information is collected or processed. Organizations are responsible for obtaining and documenting consent prior to student participation.',
  },
  {
    Icon: ShieldCheck,
    title: 'Minimal Data Collection',
    desc: 'We collect only what is necessary to coordinate experiences and track outcomes. Student data is never used for advertising, never sold to third parties, and never retained beyond program participation.',
  },
  {
    Icon: FileText,
    title: 'Data Retention Policy',
    desc: 'Student records are retained only for the duration of program participation plus one academic year for outcome tracking, then securely deleted. Organizations can request deletion at any time.',
  },
]

const FOR_ORGS = [
  'Verify that every business you connect with has passed our 6-step certification process',
  'Review the full certification status of any Pathway Site before approving student participation',
  'Download our Parental Consent Template for use with your students and families',
  'Access our Youth Labor Law Reference Guide before placing students in work-based experiences',
  'Contact our admin team directly at safety@wealthwisekids.org with any concern — we respond within 24 hours',
]

const FOR_BIZ = [
  'Complete all six certification steps before hosting any student activity',
  'Maintain current background checks and insurance documentation in your Pathway Site portal',
  'Report any safety incident or concern immediately using the in-platform reporting tool',
  'Never allow uncertified staff to interact with student groups',
  'Follow all applicable child labor laws and age restrictions for your industry',
]

export default function SafetyPage() {
  return (
    <div className={styles.page}>
      <SiteNav />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroShield}>
            <ShieldCheck size={32} />
          </div>
          <p className={styles.eyebrow}>Safety & Compliance</p>
          <h1 className={styles.h1}>
            Every student who walks through a Pathway Site<br />
            is protected before they arrive.
          </h1>
          <p className={styles.heroSub}>
            Real-World Pathways™ is the only youth field experience platform with a
            mandatory 6-step certification process for every business partner — including
            background checks, insurance verification, and youth safety training.
            No exceptions. No auto-approvals.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}><CheckCircle2 size={13} /> FERPA Compliant</span>
            <span className={styles.heroBadge}><CheckCircle2 size={13} /> COPPA-Aware</span>
            <span className={styles.heroBadge}><CheckCircle2 size={13} /> Background Checked</span>
            <span className={styles.heroBadge}><CheckCircle2 size={13} /> Insurance Verified</span>
            <span className={styles.heroBadge}><CheckCircle2 size={13} /> Youth Safety Trained</span>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATION PROCESS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>The Certified Pathway Site™ Process</h2>
            <p className={styles.sectionSub}>
              Six mandatory steps. Every business. No exceptions.
              A business cannot appear in our marketplace or host any student experience
              until all six are complete and approved by our admin team.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            {CERT_STEPS.map((step, i) => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepTop}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <div className={styles.stepIconWrap}>
                    <step.icon size={20} />
                  </div>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {i < CERT_STEPS.length - 1 && (
                  <div className={styles.stepConnector} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DATA & PRIVACY ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Student Data & Privacy</h2>
            <p className={styles.sectionSub}>
              We take our obligation to protect student data seriously.
              Here is exactly how we handle the information entrusted to us.
            </p>
          </div>
          <div className={styles.dataGrid}>
            {DATA_PRACTICES.map(d => (
              <div key={d.title} className={styles.dataCard}>
                <div className={styles.dataIcon}>
                  <d.Icon size={22} />
                </div>
                <h3 className={styles.dataTitle}>{d.title}</h3>
                <p className={styles.dataDesc}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR ORGS + FOR BIZ ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.twoCol}>

            <div className={styles.colCard}>
              <div className={styles.colCardHead}>
                <Users size={20} className={styles.colCardIcon} />
                <h2 className={styles.colCardTitle}>For Schools & Organizations</h2>
              </div>
              <p className={styles.colCardSub}>
                Before connecting your students to any Pathway Site, here is what you should know and do:
              </p>
              <ul className={styles.checkList}>
                {FOR_ORGS.map(item => (
                  <li key={item} className={styles.checkItem}>
                    <CheckCircle2 size={15} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?type=org" className={styles.colCta}>
                Register Your Organization <ChevronRight size={14} />
              </Link>
            </div>

            <div className={styles.colCard}>
              <div className={styles.colCardHead}>
                <ShieldCheck size={20} className={styles.colCardIcon} />
                <h2 className={styles.colCardTitle}>For Pathway Site Businesses</h2>
              </div>
              <p className={styles.colCardSub}>
                Becoming a Certified Pathway Site™ means committing to the highest standard of youth safety. Here is what that requires:
              </p>
              <ul className={styles.checkList}>
                {FOR_BIZ.map(item => (
                  <li key={item} className={styles.checkItem}>
                    <CheckCircle2 size={15} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?type=biz" className={styles.colCta}>
                Apply as a Pathway Site <ChevronRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── INCIDENT REPORTING ── */}
      <section className={styles.incidentBanner}>
        <div className={styles.incidentInner}>
          <AlertTriangle size={24} className={styles.incidentIcon} />
          <div>
            <h2 className={styles.incidentTitle}>Report a Safety Concern</h2>
            <p className={styles.incidentSub}>
              If you witness or experience anything that puts a student at risk, report it immediately.
              All reports are reviewed within 24 hours. A business can be suspended from the platform
              instantly pending investigation.
            </p>
          </div>
          <Link href="/incident" className={styles.incidentCta}>
            Submit a Report <ChevronRight size={14} />
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
