'use client'

import Link from 'next/link'
import {
  ChevronRight, ShieldCheck, BarChart3, Users, Clock,
  CheckCircle2, Building2, Bus, Award, Handshake, Star,
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import styles from './pathway-sites.module.css'

const BENEFITS = [
  {
    Icon: Users,
    title: 'Direct Pipeline to Future Talent',
    desc: 'Students who visit your workplace become aware of your industry years before they enter the workforce. The organizations that show up early win the talent conversation.',
  },
  {
    Icon: BarChart3,
    title: 'Measurable Community Impact',
    desc: 'Every visit generates a FLIQ Score™ impact report — data showing how your investment changed student career awareness. That\'s a grant-ready, PR-ready outcome number.',
  },
  {
    Icon: Award,
    title: 'Certified Pathway Site™ Designation',
    desc: 'Your business is listed on the RWP marketplace, featured in school communications, and recognized publicly as a vetted, youth-safe career destination.',
  },
  {
    Icon: ShieldCheck,
    title: 'Zero Administrative Overhead',
    desc: 'We handle scheduling, student consent forms, educator coordination, and post-visit reporting. You show up, open your doors, and we do the rest.',
  },
]

const COMMITMENT = [
  { label: 'Minimum commitment', value: '2 student visits per year (1–4 hours each)' },
  { label: 'Advance notice', value: '30 days minimum for each scheduled visit' },
  { label: 'Group size', value: 'Your choice — as few as 5, as many as 100+' },
  { label: 'Cost to your business', value: 'Free — we never charge Pathway Sites' },
  { label: 'Youth safety', value: 'Site safety review + staff acknowledgment form required' },
  { label: 'Insurance', value: 'Certificate of insurance on file with RWP before first visit' },
]

const STEPS = [
  { num: '01', title: 'Submit an Application', desc: 'Takes 10 minutes. Tell us about your business, the careers students would be exposed to, and what a visit could look like.' },
  { num: '02', title: 'Certification Review', desc: 'Our team reviews your application, conducts a site safety check, and verifies your insurance. Most sites are certified within 5 business days.' },
  { num: '03', title: 'List Your Experience', desc: 'We build your listing on the RWP marketplace and make it searchable by schools and nonprofits in the Atlanta region.' },
  { num: '04', title: 'Welcome Your First Group', desc: 'When an educator requests your experience, we coordinate everything. You get a confirmed visit date, student count, and a structured agenda.' },
]

const FAQS = [
  {
    q: 'What kinds of businesses qualify?',
    a: 'Any legally operating business in the Atlanta metropolitan area with at least one professional who can speak to a career path. We\'ve certified healthcare systems, logistics hubs, tech companies, retail chains, trades contractors, nonprofits, and government agencies.',
  },
  {
    q: 'Do we need to run a formal presentation?',
    a: 'No. Some of our best-rated experiences are facility tours with a 15-minute Q&A. Others are structured career panels. You decide what format works for your team — we provide an optional facilitation guide.',
  },
  {
    q: 'What if we want to offer an internship or mentorship instead of a site visit?',
    a: 'Great. We support six experience types: Site Visits, Job Shadows, Career Panels, Mentorships, Internships, and Project Partnerships. Apply with whatever format makes sense for your organization.',
  },
  {
    q: 'What about transportation for students?',
    a: 'We\'re building a transportation partner network to reduce this barrier for schools. In the interim, most partner schools coordinate their own transportation or use MARTA. We flag public transit access on every listing. If you\'re located near a MARTA stop, that goes in your listing description and increases your request volume significantly.',
  },
  {
    q: 'Can we limit which schools or grade levels visit?',
    a: 'Yes. You set the grade range, group size, and availability windows. You can also decline specific requests — though our data shows that sites with broader availability see significantly higher engagement.',
  },
]

export default function PathwaySitesPage() {
  return (
    <div className={styles.page}>
      <SiteNav />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Certified Pathway Sites™</p>
          <h1 className={styles.h1}>
            Open your doors.<br />Change a student&apos;s trajectory.
          </h1>
          <p className={styles.heroSub}>
            Pathway Sites are Atlanta businesses, institutions, and organizations that
            agree to host structured career experiences for K–12 students through the
            Real-World Pathways™ network. No fees. No overhead. Just access.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/register?type=biz" className={styles.btnPrimary}>
              Apply to Become a Pathway Site <ChevronRight size={15} />
            </Link>
            <Link href="/marketplace" className={styles.btnOutline}>
              See Current Pathway Sites
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>Free</span>
              <span className={styles.heroStatLabel}>Always free for your business</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>5 days</span>
              <span className={styles.heroStatLabel}>Average certification turnaround</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>2×/yr</span>
              <span className={styles.heroStatLabel}>Minimum visit commitment</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className={styles.benefits}>
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Why Partner With Us</p>
          <h2 className={styles.sectionTitle}>What your business gets out of this</h2>
          <div className={styles.benefitsGrid}>
            {BENEFITS.map(b => (
              <div key={b.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <b.Icon size={22} />
                </div>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMITMENT ── */}
      <section className={styles.commitment}>
        <div className={styles.inner}>
          <div className={styles.commitGrid}>
            <div className={styles.commitLeft}>
              <p className={styles.sectionEyebrow}>What We Ask of You</p>
              <h2 className={styles.sectionTitle}>Simple, flexible, and always on your terms</h2>
              <p className={styles.commitBody}>
                We designed the Pathway Site commitment to be achievable for a two-person
                operation and scalable for a Fortune 500. You set your availability.
                You control your group sizes. You can pause or close your listing at any time.
              </p>
              <p className={styles.commitBody}>
                The only non-negotiable: every site completes a youth safety acknowledgment
                and has a certificate of insurance on file before the first student visit.
                After that, the rest is up to you.
              </p>
              <Link href="/register?type=biz" className={styles.btnPrimaryDark}>
                Start Your Application <ChevronRight size={15} />
              </Link>
            </div>
            <div className={styles.commitRight}>
              <div className={styles.commitTable}>
                {COMMITMENT.map(row => (
                  <div key={row.label} className={styles.commitRow}>
                    <span className={styles.commitLabel}>{row.label}</span>
                    <span className={styles.commitValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.howItWorks}>
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>The Process</p>
          <h2 className={styles.sectionTitle}>From application to first visit</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map(s => (
              <div key={s.num} className={styles.stepCard}>
                <span className={styles.stepNum}>{s.num}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPORTATION NOTE ── */}
      <section className={styles.transport}>
        <div className={styles.transportInner}>
          <div className={styles.transportIcon}>
            <Bus size={28} />
          </div>
          <div className={styles.transportText}>
            <h3 className={styles.transportTitle}>A note on student transportation</h3>
            <p className={styles.transportBody}>
              Getting students to your location is the most common logistical barrier we hear about.
              We&apos;re actively building a preferred transportation partner network to reduce this
              friction for schools. In the interim, we recommend listing your proximity to MARTA stops
              and flagging any parking or drop-off accommodations on your listing — it meaningfully
              increases your request volume from schools that can arrange their own transport.
            </p>
            <p className={styles.transportBody}>
              If your site is within walking distance of a MARTA station, or if you&apos;re willing to
              cover a portion of transportation costs, let us know on your application. We&apos;ll
              feature you as a high-accessibility site.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className={styles.proof}>
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>From Our Partners</p>
          <h2 className={styles.sectionTitle}>What Pathway Sites are saying</h2>
          <div className={styles.proofGrid}>
            {[
              {
                quote: 'We had no idea how easy the coordination would be. RWP handled everything — consent forms, the agenda, the follow-up report. We just opened our doors.',
                name: 'Operations Director',
                org: 'Atlanta-area Healthcare System',
              },
              {
                quote: 'Three of the students who visited us last year reached back out during college recruitment. That pipeline starts earlier than most companies think.',
                name: 'HR Director',
                org: 'Atlanta Technology Company',
              },
              {
                quote: 'The FLIQ impact report we received after the visit was exactly the documentation our CSR team needed. We\'re planning four visits next year.',
                name: 'Community Affairs Manager',
                org: 'Atlanta Financial Institution',
              },
            ].map(t => (
              <div key={t.name} className={styles.proofCard}>
                <div className={styles.proofStars}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#F2C96E" color="#F2C96E" />)}
                </div>
                <p className={styles.proofQuote}>&ldquo;{t.quote}&rdquo;</p>
                <div className={styles.proofAttrib}>
                  <span className={styles.proofName}>{t.name}</span>
                  <span className={styles.proofOrg}>{t.org}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <p className={styles.sectionEyebrow}>Common Questions</p>
          <h2 className={styles.sectionTitle}>Before you apply</h2>
          <div className={styles.faqList}>
            {FAQS.map(f => (
              <div key={f.q} className={styles.faqItem}>
                <div className={styles.faqIcon}><CheckCircle2 size={16} /></div>
                <div>
                  <h4 className={styles.faqQ}>{f.q}</h4>
                  <p className={styles.faqA}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaBadge}>
            <Handshake size={18} />
            <span>Founding Cohort — Limited Spots</span>
          </div>
          <h2 className={styles.ctaTitle}>Ready to open your doors?</h2>
          <p className={styles.ctaSub}>
            We&apos;re certifying our first cohort of Pathway Sites in Atlanta now.
            Early sites get featured placement on the marketplace, a dedicated launch
            announcement to our school and nonprofit network, and direct access to
            our program team for onboarding support.
          </p>
          <Link href="/register?type=biz" className={styles.btnPrimary}>
            Apply Now — It Takes 10 Minutes <ChevronRight size={15} />
          </Link>
          <p className={styles.ctaNote}>
            Already a Pathway Site?{' '}
            <Link href="/login" className={styles.ctaNoteLink}>Log in to your dashboard</Link>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms"   className={styles.footerLink}>Terms of Use</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
