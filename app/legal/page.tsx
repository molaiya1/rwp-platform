import Link from 'next/link'
import { ShieldCheck, Lock, FileText, Users, AlertTriangle, Database, Eye, Mail } from 'lucide-react'
import styles from './legal.module.css'

export const metadata = {
  title: 'Legal & Compliance | Real-World Pathways™',
  description: 'FERPA compliance, COPPA notice, privacy policy, terms of use, and safety standards for the Real-World Pathways™ platform.',
}

const BADGES = [
  { icon: ShieldCheck, label: 'FERPA Compliant', sub: 'Student education records protected under 20 U.S.C. § 1232g' },
  { icon: Users,      label: 'COPPA-Aware',    sub: 'Platform restricted to users 13+ through institutional enrollment' },
  { icon: Lock,       label: 'Data Security',  sub: 'AES-256 encryption at rest · TLS 1.2+ in transit' },
  { icon: Eye,        label: 'No Data Sales',  sub: 'Student data is never sold, rented, or used for advertising' },
]

const DOCS = [
  {
    icon: Lock,
    title: 'Privacy Policy',
    href: '/privacy',
    summary: 'What data we collect, how we use it, your rights to access and deletion, and how we protect student records under FERPA.',
    tags: ['FERPA', 'COPPA', 'Data Rights', 'Student Privacy'],
  },
  {
    icon: FileText,
    title: 'Terms of Use',
    href: '/terms',
    summary: 'Platform eligibility, acceptable use, institutional responsibilities, prohibited conduct, intellectual property, and governing law.',
    tags: ['Eligibility', 'Acceptable Use', 'IP', 'Georgia Law'],
  },
  {
    icon: ShieldCheck,
    title: 'Safety Standards',
    href: '/safety',
    summary: 'Background verification requirements for Pathway Sites, supervision protocols, incident reporting, and our youth protection framework.',
    tags: ['Background Checks', 'Supervision', 'Incident Reports', 'Youth Protection'],
  },
]

const PRACTICES = [
  {
    title: 'FERPA Compliance',
    body: 'Real-World Pathways™ operates as a "school official" under FERPA (20 U.S.C. § 1232g) when contracted with educational institutions. We access student education records only to the extent required to provide the platform\'s services, never for secondary commercial purposes. Institutional partners retain full ownership of student records. Parents and eligible students may request access, amendment, or deletion by contacting privacy@wealthwisekids.org.',
  },
  {
    title: 'COPPA Notice',
    body: 'The platform is designed for users aged 13 and older and is accessed exclusively through verified institutional accounts (schools, nonprofits, and registered organizations). We do not knowingly collect personal information directly from children under 13. Students participate only after institutional enrollment by a verified school or program administrator. If you believe a minor under 13 has accessed the platform without institutional authorization, contact privacy@wealthwisekids.org immediately.',
  },
  {
    title: 'Data Collection',
    body: 'We collect only what is necessary to operate the platform: name, institutional email address, role (student/educator/site staff), program participation records, and activity logs within Field Lab experiences. We do not collect Social Security numbers, financial account data, health information, or location data beyond what is voluntarily provided in a program profile.',
  },
  {
    title: 'How Student Data Is Used',
    body: 'Student data is used exclusively to: (1) authenticate accounts and maintain session security; (2) display appropriate content based on program enrollment; (3) generate anonymized aggregate impact reports for institutional partners; and (4) support program facilitation by authorized educators. Student data is never used for behavioral advertising, third-party profiling, or sold to any external party under any circumstance.',
  },
  {
    title: 'Data Security',
    body: 'All data is encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Our infrastructure runs on Supabase (hosted on AWS), which maintains SOC 2 Type II certification. Access to production databases is restricted to authorized engineering personnel via multi-factor authentication. We conduct periodic access reviews and revoke credentials upon role changes.',
  },
  {
    title: 'Data Retention & Deletion',
    body: 'Active user records are retained for the duration of program enrollment plus 12 months to support institutional reporting. Records may be deleted upon written request from the institution or the user. Institutional partners may request bulk data deletion at the end of a contract term. Anonymized, aggregated outcome data (no individual identifiers) may be retained indefinitely for research and platform improvement.',
  },
  {
    title: 'Third-Party Vendors',
    body: 'We use a limited number of sub-processors: Supabase (database and authentication infrastructure), Vercel (hosting and CDN), and Formspree (contact form routing). None of these vendors are granted access to student education records. Data processing agreements are maintained with each vendor consistent with FERPA\'s school official exception requirements.',
  },
  {
    title: 'Incident Response',
    body: 'In the event of a data security incident affecting student records, we will notify affected institutions within 72 hours of confirmed breach discovery, consistent with applicable state notification laws. Notifications will include the nature of the incident, categories of data affected, and remediation steps. Urgent safety incidents involving student welfare should be reported via the platform\'s Incident Report tool or directly to privacy@wealthwisekids.org.',
  },
  {
    title: 'Cookies & Tracking',
    body: 'We use session cookies strictly necessary for authentication and platform functionality. We do not use third-party advertising cookies, cross-site tracking pixels, or behavioral analytics tools that profile individual users. Basic aggregate analytics (page load counts, error rates) may be collected to monitor platform performance — these are never tied to individual student identities.',
  },
  {
    title: 'Governing Law',
    body: 'This platform is operated by WealthWise Kids LLC, a Georgia limited liability company. All disputes are governed by the laws of the State of Georgia without regard to conflict-of-law principles. Exclusive jurisdiction and venue for any legal proceedings shall be the state and federal courts located in Fulton County, Georgia.',
  },
]

export default function LegalPage() {
  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wwk-transparent.png" alt="Real-World Pathways™" className={styles.logoImg} />
          </Link>
          <Link href="/home" className={styles.headerBack}>← Back to Home</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroIcon}><ShieldCheck size={26} /></div>
          <p className={styles.eyebrow}>Compliance & Legal</p>
          <h1 className={styles.h1}>Trust &amp; Compliance Center</h1>
          <p className={styles.heroSub}>
            Everything in one place — our privacy practices, FERPA and COPPA compliance, safety standards, terms of use, and data security policies.
          </p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.mainInner}>

          {/* Compliance badges */}
          <div className={styles.badgeGrid}>
            {BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className={styles.badge}>
                <div className={styles.badgeIcon}><Icon size={20} /></div>
                <div>
                  <p className={styles.badgeLabel}>{label}</p>
                  <p className={styles.badgeSub}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Policy document cards */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Policy Documents</h2>
            <div className={styles.docGrid}>
              {DOCS.map(({ icon: Icon, title, href, summary, tags }) => (
                <Link key={href} href={href} className={styles.docCard}>
                  <div className={styles.docCardHeader}>
                    <div className={styles.docIcon}><Icon size={18} /></div>
                    <span className={styles.docTitle}>{title}</span>
                    <span className={styles.docArrow}>→</span>
                  </div>
                  <p className={styles.docSummary}>{summary}</p>
                  <div className={styles.docTags}>
                    {tags.map(t => <span key={t} className={styles.docTag}>{t}</span>)}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Detailed practices */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Practices in Plain Language</h2>
            <p className={styles.sectionSub}>
              We believe compliance should be readable, not just legal. Here is exactly how we handle data and safety on this platform.
            </p>
            <div className={styles.practiceList}>
              {PRACTICES.map(({ title, body }) => (
                <div key={title} className={styles.practiceItem}>
                  <h3 className={styles.practiceTitle}>{title}</h3>
                  <p className={styles.practiceBody}>{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact block */}
          <section className={styles.contactBlock}>
            <div className={styles.contactIcon}><Mail size={22} /></div>
            <div>
              <h2 className={styles.contactTitle}>Questions about compliance or your data?</h2>
              <p className={styles.contactSub}>
                We respond to all privacy inquiries within 2 business days. Safety and FERPA-related requests are prioritized within 24 hours.
              </p>
              <div className={styles.contactLinks}>
                <a href="mailto:privacy@wealthwisekids.org" className={styles.contactEmail}>privacy@wealthwisekids.org</a>
                <Link href="/contact" className={styles.contactLink}>Contact Form →</Link>
              </div>
            </div>
          </section>

          {/* Urgent safety */}
          <div className={styles.safetyAlert}>
            <AlertTriangle size={18} className={styles.safetyAlertIcon} />
            <div>
              <p className={styles.safetyAlertTitle}>Urgent Safety Concern?</p>
              <p className={styles.safetyAlertSub}>If a student is in immediate danger, call 911 first. Then use our platform to file a formal incident report.</p>
              <Link href="/incident" className={styles.safetyAlertLink}>File an Incident Report →</Link>
            </div>
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved. Real-World Pathways™ is a program of WealthWise Kids LLC.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
            <Link href="/safety" className={styles.footerLink}>Safety Standards</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
