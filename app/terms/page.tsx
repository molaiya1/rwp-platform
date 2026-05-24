import Link from 'next/link'
import { FileText, Mail } from 'lucide-react'
import styles from './terms.module.css'

export const metadata = {
  title: 'Terms of Use — Real-World Pathways™',
  description: 'Terms of Use for the Real-World Pathways™ platform.',
}

const LAST_UPDATED = 'May 2026'

export default function TermsPage() {
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
          <div className={styles.heroIcon}><FileText size={28} /></div>
          <p className={styles.eyebrow}>Legal</p>
          <h1 className={styles.h1}>Terms of Use</h1>
          <p className={styles.heroSub}>
            By using Real-World Pathways™ you agree to these terms. Please read them carefully before creating an account.
          </p>
          <p className={styles.lastUpdated}>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.prose}>

            <section className={styles.section}>
              <h2 className={styles.h2}>1. Acceptance of Terms</h2>
              <p>By accessing or using the Real-World Pathways™ platform ("Platform"), operated by WealthWise Kids LLC ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree, you may not use the Platform.</p>
              <p>These Terms apply to all users including organizational representatives, Pathway Site contacts, and administrators.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>2. Eligibility</h2>
              <p>You must be at least 18 years old to create an account on this Platform. By registering, you represent and warrant that you are 18 or older and have the authority to bind your organization to these Terms.</p>
              <p>This Platform is intended for institutional use by schools, nonprofits, community organizations, and business entities — not by individual students or minors directly.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>3. Account Registration & Security</h2>
              <p>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to:</p>
              <ul className={styles.list}>
                <li>Provide accurate and complete registration information</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Not share your login credentials with unauthorized individuals</li>
                <li>Not create accounts on behalf of others without authorization</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that we determine, in our sole discretion, have been used in violation of these Terms.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>4. Platform Use — Organizations</h2>
              <p>Organizations (schools, nonprofits, community programs) that register on the Platform may:</p>
              <ul className={styles.list}>
                <li>Browse and request Field Lab experiences from approved Pathway Sites</li>
                <li>Submit contact and organizational information for matching purposes</li>
                <li>Track request status and Field Lab confirmations</li>
              </ul>
              <p>Organizations agree to:</p>
              <ul className={styles.list}>
                <li>Only register with accurate organizational information</li>
                <li>Obtain appropriate parent/guardian consent before bringing students to any Field Lab</li>
                <li>Supervise students appropriately during all Field Lab activities</li>
                <li>Follow all safety guidelines provided by Pathway Sites</li>
                <li>Report any safety concerns or incidents via the platform's reporting system</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>5. Platform Use — Pathway Sites (Businesses)</h2>
              <p>Businesses that register as Pathway Sites agree to:</p>
              <ul className={styles.list}>
                <li>Complete and maintain all six steps of the Certified Pathway Site™ certification process</li>
                <li>Provide accurate information about their Field Lab offerings</li>
                <li>Host students in a safe, professional, and age-appropriate environment</li>
                <li>Comply with all applicable local, state, and federal laws regarding minors in the workplace</li>
                <li>Maintain valid general liability insurance throughout their participation</li>
                <li>Respond promptly to Field Lab requests and communications</li>
                <li>Report any incidents or safety concerns immediately</li>
              </ul>
              <p>We reserve the right to revoke Pathway Site status at any time for non-compliance, safety violations, or failure to maintain certification requirements.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>6. Prohibited Conduct</h2>
              <p>You may not use the Platform to:</p>
              <ul className={styles.list}>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Engage in or facilitate discrimination based on race, color, religion, sex, national origin, disability, or any other protected characteristic</li>
                <li>Harass, threaten, or harm any other user or student</li>
                <li>Collect or harvest personal information about other users without consent</li>
                <li>Reverse engineer, scrape, or otherwise extract data from the Platform</li>
                <li>Use the Platform for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the Platform</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>7. Youth Safety</h2>
              <p>The safety of youth participants is our highest priority. All users agree to:</p>
              <ul className={styles.list}>
                <li>Report any suspected abuse, neglect, or unsafe conditions immediately to the appropriate authorities and to us via our incident reporting system</li>
                <li>Not engage in any one-on-one, unsupervised contact with minors outside of the structured Field Lab program</li>
                <li>Comply with all applicable mandatory reporter laws</li>
              </ul>
              <p>Violations of youth safety standards will result in immediate account termination and may be referred to law enforcement.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>8. Intellectual Property</h2>
              <p>The Platform, including all content, features, and functionality (including but not limited to "Real-World Pathways™," "Field Lab™," "Pathway Site™," "Certified Pathway Site™," and associated logos), is owned by WealthWise Kids LLC and is protected by copyright, trademark, and other intellectual property laws.</p>
              <p>You may not copy, reproduce, distribute, or create derivative works from any content on the Platform without our prior written permission.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>9. Disclaimers</h2>
              <p>The Platform is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or that any defects will be corrected.</p>
              <p>We facilitate connections between organizations and Pathway Sites but are not responsible for the conduct of any user, the outcome of any Field Lab, or any injury, loss, or damage arising from a Field Lab experience. All Pathway Site certifications are based on documentation submitted by the Pathway Site and do not constitute an endorsement by WealthWise Kids LLC.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>10. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, WealthWise Kids LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of revenue, or personal injury, arising from your use of the Platform.</p>
              <p>Our total liability to you for any claim arising from your use of the Platform shall not exceed the total fees paid by you to us in the twelve (12) months preceding the claim, or $100, whichever is greater.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>11. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of Georgia, without regard to its conflict of law provisions. Any dispute arising from these Terms shall be resolved exclusively in the state or federal courts located in Fulton County, Georgia.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>12. Changes to These Terms</h2>
              <p>We reserve the right to modify these Terms at any time. When we make material changes, we will notify registered users by email at least 14 days before the changes take effect. Your continued use of the Platform after changes become effective constitutes your acceptance of the revised Terms.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>13. Contact</h2>
              <div className={styles.contactCard}>
                <Mail size={18} className={styles.contactIcon} />
                <div>
                  <strong className={styles.contactTitle}>Legal inquiries</strong>
                  <p className={styles.contactDetail}>Email: <a href="mailto:info@wealthwisekids.org" className={styles.link}>info@wealthwisekids.org</a></p>
                  <p className={styles.contactDetail}>WealthWise Kids LLC · 3343 Peachtree Rd NE Suite 2235 · Atlanta, GA 30326</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

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
