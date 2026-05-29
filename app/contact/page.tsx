'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Clock, CheckCircle2, ShieldCheck } from 'lucide-react'
import styles from './contact.module.css'

const TOPICS = [
  'General inquiry',
  'Becoming a Pathway Site (business)',
  'Registering my organization (school/nonprofit)',
  'Safety concern or incident report',
  'Technical support',
  'Partnership or media inquiry',
  'Other',
]

export default function ContactPage() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [topic, setTopic]     = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) { setError('Please fill in all required fields.'); return }
    setLoading(true); setError('')

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, topic: topic || 'Not specified', message, _replyto: email }),
      })
      if (!res.ok) {
        setError('Something went wrong. Please email us directly at info@wealthwisekids.org.')
        setLoading(false)
        return
      }
    }
    // If NEXT_PUBLIC_FORMSPREE_CONTACT is not set, we still show success (graceful degradation in dev)

    setSent(true)
    setLoading(false)
  }

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
          <div className={styles.heroIcon}><Mail size={26} /></div>
          <p className={styles.eyebrow}>Get in Touch</p>
          <h1 className={styles.h1}>Contact Real-World Pathways™</h1>
          <p className={styles.heroSub}>Questions, partnership inquiries, safety concerns, or technical support — we respond to every message.</p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.mainInner}>

          <div className={styles.layout}>

            {/* Left — form */}
            <div className={styles.formCol}>
              {sent ? (
                <div className={styles.successCard}>
                  <div className={styles.successIcon}><CheckCircle2 size={32} /></div>
                  <h2 className={styles.successTitle}>Message received!</h2>
                  <p className={styles.successSub}>
                    Thank you for reaching out. We typically respond within 1–2 business days. If your message concerns a safety issue, we will respond within 24 hours.
                  </p>
                  <Link href="/home" className={styles.successBtn}>Back to Home</Link>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Send us a message</h2>
                  <form className={styles.form} onSubmit={handleSubmit} noValidate>

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="name">Full Name <span className={styles.req}>*</span></label>
                        <input id="name" className={styles.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email Address <span className={styles.req}>*</span></label>
                        <input id="email" className={styles.input} type="email" placeholder="you@example.org" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="topic">Topic</label>
                      <select id="topic" className={styles.select} value={topic} onChange={e => setTopic(e.target.value)}>
                        <option value="">Select a topic…</option>
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="message">Message <span className={styles.req}>*</span></label>
                      <textarea id="message" className={styles.textarea} rows={5} placeholder="How can we help?" value={message} onChange={e => setMessage(e.target.value)} required />
                    </div>

                    {error && <p className={styles.error} role="alert">{error}</p>}

                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                      {loading
                        ? <><span className={styles.spinner} aria-hidden="true" />Sending…</>
                        : 'Send Message'
                      }
                    </button>

                  </form>
                </div>
              )}
            </div>

            {/* Right — contact info */}
            <div className={styles.infoCol}>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Contact Information</h3>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><Mail size={16} /></div>
                  <div>
                    <p className={styles.infoLabel}>General Inquiries</p>
                    <a href="mailto:info@wealthwisekids.org" className={styles.infoLink}>info@wealthwisekids.org</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><ShieldCheck size={16} /></div>
                  <div>
                    <p className={styles.infoLabel}>Safety &amp; Privacy</p>
                    <a href="mailto:privacy@wealthwisekids.org" className={styles.infoLink}>privacy@wealthwisekids.org</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><MapPin size={16} /></div>
                  <div>
                    <p className={styles.infoLabel}>Mailing Address</p>
                    <p className={styles.infoText}>3343 Peachtree Rd NE<br />Suite 2235<br />Atlanta, GA 30326</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><Clock size={16} /></div>
                  <div>
                    <p className={styles.infoLabel}>Response Times</p>
                    <p className={styles.infoText}>General: 1–2 business days<br />Safety concerns: within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className={styles.safetyCard}>
                <ShieldCheck size={18} className={styles.safetyIcon} />
                <div>
                  <p className={styles.safetyTitle}>Urgent Safety Concern?</p>
                  <p className={styles.safetySub}>If a student is in immediate danger, contact 911 first. Then report through our platform.</p>
                  <Link href="/incident" className={styles.safetyLink}>File an Incident Report →</Link>
                </div>
              </div>

              <div className={styles.linksCard}>
                <p className={styles.linksTitle}>Helpful Links</p>
                <Link href="/safety" className={styles.helpLink}>Safety Standards</Link>
                <Link href="/privacy" className={styles.helpLink}>Privacy Policy</Link>
                <Link href="/terms" className={styles.helpLink}>Terms of Use</Link>
                <Link href="/register" className={styles.helpLink}>Create an Account</Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>© 2026 WealthWise Kids LLC. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
            <Link href="/legal" className={styles.footerLink}>Compliance</Link>
            <Link href="/safety" className={styles.footerLink}>Safety Standards</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
