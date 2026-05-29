'use client'

import Link from 'next/link'
import {
  ShieldCheck, CheckCircle2, FileText, Users, Lock,
  AlertTriangle, ChevronRight, Eye, BookOpen, Award,
  XCircle, Phone,
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './safety.module.css'

const CERT_STEPS = [
  {
    num: '01',
    icon: FileText,
    title: 'Application Review',
    policy: 'Required before activation',
    desc: 'Every business submits a formal application including company details, contact information, EIN verification, and a description of the experiences they intend to offer. Incomplete applications are rejected — not deferred.',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Background Screening',
    policy: 'Mandatory · Re-verified annually',
    desc: 'All designated site contacts who will interact with youth must pass a background check before any student activity is approved. This requirement is non-negotiable and cannot be waived. Re-verification occurs every 12 months.',
  },
  {
    num: '03',
    icon: Award,
    title: 'Insurance Verification',
    policy: 'Minimum $1M general liability',
    desc: 'Pathway Sites must carry a minimum of $1,000,000 in general liability insurance and submit current proof of coverage. Insurance expiration is tracked by our admin system. Lapsed coverage results in automatic suspension.',
  },
  {
    num: '04',
    icon: BookOpen,
    title: 'Youth Safety Training',
    policy: 'Required before first Field Lab',
    desc: 'All site contacts complete mandatory youth safety and professional conduct training before hosting any student. Training covers appropriate adult-student interactions, emergency procedures, and mandatory reporting obligations under state law.',
  },
  {
    num: '05',
    icon: FileText,
    title: 'Document Submission',
    policy: '3 documents required on file',
    desc: 'Pathway Sites must have three documents on file before activation: a Youth Safety Policy, a Professional Code of Conduct, and a signed Youth Protection Agreement. All three are reviewed and approved by our admin team — no exceptions.',
  },
  {
    num: '06',
    icon: CheckCircle2,
    title: 'Manual Admin Approval',
    policy: 'No auto-approvals. Ever.',
    desc: 'Every application is reviewed and approved by a member of the RWP admin team before a business can appear in the marketplace or host any student experience. There are no automated approvals on this platform.',
  },
]

const DATA_DO = [
  'Operate as a "school official" under FERPA when receiving student data',
  'Collect only what is necessary to coordinate experiences and track outcomes',
  'Secure all data in transit and at rest using industry-standard encryption',
  'Provide organizations with the ability to request full data deletion at any time',
  'Retain student records for the duration of program participation plus one academic year for outcome tracking only',
  'Require verifiable parental consent for any student under 13 (COPPA)',
]

const DATA_NEVER = [
  'Sell, rent, or trade student data to any third party — ever',
  'Use student information for advertising or profiling',
  'Retain student records beyond the program participation window without explicit consent',
  'Share student data without proper FERPA authorization from the partnering organization',
  'Allow businesses to access individual student identities without organizational approval',
]

const FOR_ORGS = [
  'Verify every business you connect with has passed all six certification steps before approving student participation',
  'Review the full certification status of any Pathway Site directly in the platform before scheduling any Field Lab',
  'Download our Parental Consent Template for distribution to student families prior to any experience',
  'Consult our Youth Labor Law Reference Guide before placing students in work-based learning environments',
  'Contact our safety team at safety@wealthwisekids.org with any concern — we respond within 24 hours',
]

const FOR_BIZ = [
  'Complete all six certification steps before hosting any student activity — no exceptions or partial exceptions',
  'Maintain current background checks and insurance documentation in your Pathway Site portal at all times',
  'Report any safety incident or concern immediately using the in-platform incident reporting tool',
  'Ensure only certified and trained staff interact directly with student groups during Field Labs',
  'Follow all applicable federal and state child labor laws and age restrictions for your industry',
]

export default function SafetyPage() {
  return (
    <div className={styles.page}>
      <SiteNav />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroEyebrow}>Safety & Compliance</span>
          </div>

          <h1 className={styles.h1}>
            Every student who walks through a Pathway Site<br className={styles.hBr} />
            {' '}is protected before they ever arrive.
          </h1>

          <p className={styles.heroSub}>
            Real-World Pathways™ operates under a mandatory 6-step certification
            process for every business partner — background checks, insurance verification,
            youth safety training, and manual admin review. No business goes live without
            passing all six. No exceptions. No auto-approvals.
          </p>

          <div className={styles.complianceTags}>
            <span className={styles.compTag}><ShieldCheck size={13} /> FERPA Compliant</span>
            <span className={styles.compTag}><ShieldCheck size={13} /> COPPA-Aware</span>
            <span className={styles.compTag}><ShieldCheck size={13} /> Background Checked</span>
            <span className={styles.compTag}><ShieldCheck size={13} /> $1M Liability Insured</span>
            <span className={styles.compTag}><ShieldCheck size={13} /> Youth Safety Trained</span>
          </div>

          <p className={styles.lastReviewed}>Policy last reviewed: May 2026 · Questions? <a href="mailto:safety@wealthwisekids.org" className={styles.lastReviewedLink}>safety@wealthwisekids.org</a></p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMMITMENT BAND
      ══════════════════════════════════════ */}
      <div className={styles.commitBand}>
        <div className={styles.commitInner}>
          <ShieldCheck size={20} className={styles.commitIcon} />
          <p className={styles.commitText}>
            <strong>Our commitment:</strong> No student sets foot inside a Pathway Site until that business has been manually verified, background-checked, insured, and trained. This is a platform policy — not a goal.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          6-STEP CERTIFICATION PROCESS
      ══════════════════════════════════════ */}
      <section className={styles.certSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Certification Process</span>
            <h2 className={styles.sectionTitle}>The Certified Pathway Site™ Standard</h2>
            <p className={styles.sectionSub}>
              Six mandatory steps. Every business. Completed in full before any student interaction is permitted.
              A business cannot appear in the marketplace, accept connection requests, or host any Field Lab
              until all six steps are verified and manually approved by our admin team.
            </p>
          </div>

          <div className={styles.timeline}>
            {CERT_STEPS.map((step, i) => (
              <div key={step.num} className={styles.timelineItem}>

                {/* Rail */}
                <div className={styles.timelineRail}>
                  <div className={styles.timelineNumWrap}>
                    <span className={styles.timelineNum}>{step.num}</span>
                  </div>
                  {i < CERT_STEPS.length - 1 && <div className={styles.timelineLine} />}
                </div>

                {/* Content */}
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <div className={styles.timelineIconWrap}>
                      <step.icon size={18} />
                    </div>
                    <div>
                      <h3 className={styles.timelineTitle}>{step.title}</h3>
                      <span className={styles.timelinePolicy}>{step.policy}</span>
                    </div>
                  </div>
                  <p className={styles.timelineDesc}>{step.desc}</p>
                  {i < CERT_STEPS.length - 1 && <div className={styles.timelineContentGap} />}
                </div>

              </div>
            ))}
          </div>

          {/* Approval stamp */}
          <div className={styles.approvalStamp}>
            <CheckCircle2 size={22} className={styles.approvalIcon} />
            <div>
              <p className={styles.approvalTitle}>Only after all six steps are verified does a business receive Certified Pathway Site™ status.</p>
              <p className={styles.approvalSub}>Certification is revoked immediately upon any lapse in background checks, insurance, or conduct violations. The platform admin team reviews every application manually.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DATA & PRIVACY
      ══════════════════════════════════════ */}
      <section className={styles.dataSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Data & Privacy</span>
            <h2 className={styles.sectionTitle}>How We Handle Student Data</h2>
            <p className={styles.sectionSub}>
              We operate under FERPA and are COPPA-aware. Below is an explicit accounting of
              what we do — and what we are prohibited from doing — with any student information
              that passes through this platform.
            </p>
          </div>

          <div className={styles.dataTable}>

            <div className={styles.dataCol}>
              <div className={styles.dataColHead}>
                <CheckCircle2 size={18} className={styles.dataDoIcon} />
                <span className={styles.dataColLabel}>What we DO</span>
              </div>
              <ul className={styles.dataList}>
                {DATA_DO.map(item => (
                  <li key={item} className={styles.dataItem}>
                    <CheckCircle2 size={14} className={styles.dataItemIconDo} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.dataCol} ${styles.dataColNever}`}>
              <div className={styles.dataColHead}>
                <XCircle size={18} className={styles.dataNeverIcon} />
                <span className={styles.dataColLabelNever}>What we NEVER do</span>
              </div>
              <ul className={styles.dataList}>
                {DATA_NEVER.map(item => (
                  <li key={item} className={styles.dataItem}>
                    <XCircle size={14} className={styles.dataItemIconNever} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className={styles.dataFootnote}>
            <Lock size={13} className={styles.dataFootnoteIcon} />
            <span>All data is encrypted in transit (TLS 1.3) and at rest (AES-256). For the full policy, see our <Link href="/privacy" className={styles.dataFootnoteLink}>Privacy Policy →</Link></span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOR ORGS + FOR BIZ
      ══════════════════════════════════════ */}
      <section className={styles.rolesSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Your Responsibilities</span>
            <h2 className={styles.sectionTitle}>What Each Partner Is Accountable For</h2>
            <p className={styles.sectionSub}>
              Safety on this platform is a shared obligation. Here is what each partner type is responsible for maintaining.
            </p>
          </div>

          <div className={styles.rolesGrid}>

            <div className={styles.roleCard}>
              <div className={styles.roleCardHead}>
                <div className={styles.roleIconWrap}>
                  <Users size={18} />
                </div>
                <h3 className={styles.roleTitle}>Schools & Organizations</h3>
              </div>
              <p className={styles.roleSub}>Before connecting your students to any Pathway Site, you are expected to:</p>
              <ul className={styles.roleList}>
                {FOR_ORGS.map(item => (
                  <li key={item} className={styles.roleItem}>
                    <CheckCircle2 size={14} className={styles.roleCheck} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?type=org" className={styles.roleCta}>
                Register Your Organization <ChevronRight size={14} />
              </Link>
            </div>

            <div className={styles.roleCard}>
              <div className={styles.roleCardHead}>
                <div className={styles.roleIconWrap}>
                  <ShieldCheck size={18} />
                </div>
                <h3 className={styles.roleTitle}>Pathway Site Businesses</h3>
              </div>
              <p className={styles.roleSub}>Becoming a Certified Pathway Site™ means committing to the following at all times:</p>
              <ul className={styles.roleList}>
                {FOR_BIZ.map(item => (
                  <li key={item} className={styles.roleItem}>
                    <CheckCircle2 size={14} className={styles.roleCheck} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?type=biz" className={styles.roleCta}>
                Apply as a Pathway Site <ChevronRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INCIDENT REPORTING
      ══════════════════════════════════════ */}
      <section className={styles.incidentSection}>
        <div className={styles.incidentInner}>
          <div className={styles.incidentLeft}>
            <div className={styles.incidentIconWrap}>
              <AlertTriangle size={28} />
            </div>
            <div>
              <h2 className={styles.incidentTitle}>Report a Safety Concern</h2>
              <p className={styles.incidentSub}>
                If you witness or experience anything that puts a student at risk —
                inappropriate conduct, a safety hazard, a policy violation — report it
                immediately through the platform. All reports are reviewed within 24 hours.
                A business can be suspended instantly pending investigation.
              </p>
              <div className={styles.incidentClauses}>
                <span className={styles.incidentClause}><ShieldCheck size={13} /> Anonymous reporting available</span>
                <span className={styles.incidentClause}><ShieldCheck size={13} /> 24-hour response commitment</span>
                <span className={styles.incidentClause}><ShieldCheck size={13} /> Immediate suspension authority</span>
              </div>
            </div>
          </div>

          <div className={styles.incidentActions}>
            <Link href="/incident" className={styles.incidentCta}>
              Submit an Incident Report <ChevronRight size={15} />
            </Link>
            <div className={styles.incidentEmergency}>
              <Phone size={13} className={styles.incidentPhoneIcon} />
              <span>Student in immediate danger? <strong>Call 911 first.</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT STRIP
      ══════════════════════════════════════ */}
      <div className={styles.contactStrip}>
        <div className={styles.contactStripInner}>
          <p className={styles.contactStripText}>
            Questions about our safety protocols, certification requirements, or data practices?
          </p>
          <a href="mailto:safety@wealthwisekids.org" className={styles.contactStripLink}>
            safety@wealthwisekids.org →
          </a>
        </div>
      </div>

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
