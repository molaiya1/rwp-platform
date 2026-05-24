import Link from 'next/link'
import { ShieldCheck, Lock, Eye, Trash2, Mail } from 'lucide-react'
import styles from './privacy.module.css'

export const metadata = {
  title: 'Privacy Policy — Real-World Pathways™',
  description: 'How Real-World Pathways™ collects, uses, and protects your information.',
}

const LAST_UPDATED = 'May 2026'

export default function PrivacyPage() {
  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/home" className={styles.headerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wwk-transparent.png" alt="Real-World Pathways™" className={styles.headerLogoImg} />
          </Link>
          <Link href="/login" className={styles.headerBack}>← Back to Sign In</Link>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroIcon}><Lock size={28} /></div>
          <p className={styles.eyebrow}>Legal</p>
          <h1 className={styles.h1}>Privacy Policy</h1>
          <p className={styles.heroSub}>
            Real-World Pathways™ is built for youth. We take privacy seriously — especially when it comes to student data.
          </p>
          <p className={styles.lastUpdated}>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <main className={styles.main}>
        <div className={styles.mainInner}>

          {/* Quick summary cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <ShieldCheck size={20} className={styles.summaryIcon} />
              <strong className={styles.summaryTitle}>FERPA Compliant</strong>
              <p className={styles.summaryDesc}>Student education records are protected in full accordance with the Family Educational Rights and Privacy Act.</p>
            </div>
            <div className={styles.summaryCard}>
              <Eye size={20} className={styles.summaryIcon} />
              <strong className={styles.summaryTitle}>No Data Sales</strong>
              <p className={styles.summaryDesc}>We never sell, rent, or share your personal information or student data with third parties for marketing purposes.</p>
            </div>
            <div className={styles.summaryCard}>
              <Lock size={20} className={styles.summaryIcon} />
              <strong className={styles.summaryTitle}>COPPA-Aware</strong>
              <p className={styles.summaryDesc}>Students under 13 are not permitted to create accounts. Parental consent is required for youth participation in Field Labs.</p>
            </div>
            <div className={styles.summaryCard}>
              <Trash2 size={20} className={styles.summaryIcon} />
              <strong className={styles.summaryTitle}>Right to Delete</strong>
              <p className={styles.summaryDesc}>You may request deletion of your account and all associated data at any time by contacting us.</p>
            </div>
          </div>

          <div className={styles.prose}>

            <section className={styles.section}>
              <h2 className={styles.h2}>1. Who We Are</h2>
              <p>Real-World Pathways™ is a program of WealthWise Kids LLC ("we," "us," or "our"), a Georgia-based educational technology company. Our platform connects K–12 organizations with Certified Pathway Sites™ — vetted local businesses that host structured in-person career experiences for youth.</p>
              <p>Our registered address is: 3343 Peachtree Rd NE Suite 2235, Atlanta, GA 30326.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>2. Information We Collect</h2>
              <h3 className={styles.h3}>From Organizations (Schools, Nonprofits, Programs)</h3>
              <ul className={styles.list}>
                <li>Contact name, title, email address, and phone number</li>
                <li>Organization name, type, city, state, and zip code</li>
                <li>Grades served and approximate student count</li>
                <li>Emergency contact information</li>
                <li>Login credentials (email + hashed password via Supabase Auth)</li>
              </ul>
              <h3 className={styles.h3}>From Pathway Sites (Businesses)</h3>
              <ul className={styles.list}>
                <li>Company name, industry, and city</li>
                <li>Contact name and email address</li>
                <li>Types of experiences offered</li>
                <li>Compliance documentation status (background checks, insurance, training)</li>
                <li>Login credentials</li>
              </ul>
              <h3 className={styles.h3}>Automatically Collected</h3>
              <ul className={styles.list}>
                <li>Browser type and device information (for security and compatibility)</li>
                <li>Session activity logs (pages visited, actions taken, timestamps)</li>
                <li>IP address (used for fraud prevention only; not stored long-term)</li>
              </ul>
              <p><strong>We do not collect Social Security numbers, payment card information, or government-issued ID numbers on this platform.</strong></p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>3. How We Use Your Information</h2>
              <p>We use the information we collect only for the following purposes:</p>
              <ul className={styles.list}>
                <li>Creating and managing your account</li>
                <li>Matching organizations with appropriate Field Lab opportunities</li>
                <li>Processing and tracking Field Lab requests between organizations and Pathway Sites</li>
                <li>Communicating platform updates, safety notices, and match notifications</li>
                <li>Conducting internal analytics to improve the platform (aggregated and anonymized)</li>
                <li>Complying with legal obligations</li>
              </ul>
              <p>We do not use your information for advertising, do not build behavioral profiles for sale, and do not share data with data brokers.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>4. Student Data & FERPA</h2>
              <p>Real-World Pathways™ does not collect or store individual student records, grades, or personally identifiable information (PII) about students directly. Student participation data (e.g., headcount per Field Lab session) is collected only in aggregate and only from authorized organization contacts.</p>
              <p>If your organization chooses to connect students to The $100 Week™ financial literacy simulation (a separate WealthWise Kids LLC product), that data is governed by a separate FERPA-compliant data use agreement. No student data from The $100 Week™ is shared back to this platform without express written consent from the organization.</p>
              <p>Organizations are responsible for obtaining appropriate parent/guardian consent before submitting any student information to this platform, in accordance with FERPA.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>5. COPPA Notice</h2>
              <p>This platform is designed for use by adults (school administrators, nonprofit staff, and business representatives). We do not knowingly collect personal information from children under the age of 13. If you believe a child under 13 has provided us personal information, please contact us immediately at <a href="mailto:privacy@wealthwisekids.org" className={styles.link}>privacy@wealthwisekids.org</a> and we will delete that information promptly.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>6. Data Sharing</h2>
              <p>We do not sell your data. We share information only in these limited circumstances:</p>
              <ul className={styles.list}>
                <li><strong>Between matched parties:</strong> When an organization submits a Field Lab request, relevant contact information (organization name, contact name, email) is shared with the Pathway Site to facilitate the session.</li>
                <li><strong>Service providers:</strong> We use Supabase (database and authentication) and Vercel (hosting). These vendors are bound by data processing agreements and may not use your data for their own purposes.</li>
                <li><strong>Legal requirements:</strong> We may disclose information if required by law, subpoena, or to protect the safety of any person.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>7. Data Security</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul className={styles.list}>
                <li>All data encrypted in transit via TLS/HTTPS</li>
                <li>Passwords hashed using bcrypt via Supabase Auth (we never see your password)</li>
                <li>Row-level security policies on all database tables</li>
                <li>Access controls limiting data visibility to authorized users only</li>
                <li>Regular dependency audits and security patches</li>
              </ul>
              <p>No system is completely secure. If you believe your account has been compromised, contact us immediately.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>8. Data Retention</h2>
              <p>We retain your account information for as long as your account is active. If you request account deletion, we will delete your personal data within 30 days, except where we are required to retain it for legal compliance purposes (e.g., records of completed Field Lab sessions for up to 3 years).</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>9. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className={styles.list}>
                <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong>Correct</strong> — update inaccurate information in your account</li>
                <li><strong>Delete</strong> — request deletion of your account and associated data</li>
                <li><strong>Opt out</strong> — unsubscribe from non-essential communications at any time</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href="mailto:privacy@wealthwisekids.org" className={styles.link}>privacy@wealthwisekids.org</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>10. Cookies</h2>
              <p>We use essential session cookies only — required for authentication and to keep you logged in. We do not use advertising cookies, tracking pixels, or third-party analytics cookies. You may disable cookies in your browser, but this will prevent you from logging in.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page and, for material changes, notify registered users by email at least 14 days before the change takes effect.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>12. Contact Us</h2>
              <div className={styles.contactCard}>
                <Mail size={18} className={styles.contactIcon} />
                <div>
                  <strong className={styles.contactTitle}>Privacy inquiries</strong>
                  <p className={styles.contactDetail}>Email: <a href="mailto:privacy@wealthwisekids.org" className={styles.link}>privacy@wealthwisekids.org</a></p>
                  <p className={styles.contactDetail}>WealthWise Kids LLC · 3343 Peachtree Rd NE Suite 2235 · Atlanta, GA 30326</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
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
