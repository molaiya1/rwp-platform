import Link from 'next/link'

const FAQS = [
  {
    q: 'How do I apply to become a Certified Pathway Site™?',
    a: 'Click "Get Started" on the homepage or go to /register?type=biz. Complete the 4-step application and our team will review it within 3–5 business days.',
  },
  {
    q: 'What types of experiences can my organization offer?',
    a: 'Pathway Sites can offer site visits, job shadows, career panels, mentorships, internships, and project partnerships. You choose what fits your capacity.',
  },
  {
    q: 'How do Impact Organizations access the platform?',
    a: 'Schools, nonprofits, and after-school programs register at /register. Once approved, you can browse the marketplace and request experiences for your students.',
  },
  {
    q: 'How long does the approval process take?',
    a: 'Most applications are reviewed within 3–5 business days. You\'ll receive an email with next steps including compliance documentation and onboarding.',
  },
  {
    q: 'Is the platform free for schools and nonprofits?',
    a: 'Yes. Access to the Real-World Pathways™ platform is free for Impact Organizations (schools, nonprofits, after-school programs). Pathway Sites may be subject to partnership agreements.',
  },
  {
    q: 'How do I report a safety concern or incident?',
    a: 'Use our incident reporting form at /incident. Reports can be submitted anonymously. All submissions are reviewed by our safety team within 24 hours.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Click "Forgot password?" on the login page and enter your email address. You\'ll receive a reset link within a few minutes. Check your spam folder if you don\'t see it.',
  },
  {
    q: 'Who do I contact if I have a question not listed here?',
    a: 'Email us at info@wealthwisekids.org or use the contact form at /contact. We respond to all inquiries within 1–2 business days.',
  },
]

export default function HelpPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#1C1635', padding: '48px 24px 56px', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: 24, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
          ← Back to home
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
          Help Center
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.60)', margin: 0 }}>
          Answers to the most common questions about Real-World Pathways™
        </p>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: '#FFFFFF', border: '1.5px solid #EDE9F5', borderRadius: 14, padding: '24px 28px' }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#1C1635', margin: '0 0 10px', lineHeight: 1.4 }}>
                {faq.q}
              </p>
              <p style={{ fontSize: 14, color: '#5C5478', lineHeight: 1.75, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: 48, background: '#1C1635', borderRadius: 16, padding: '32px 36px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px' }}>
            Still have questions?
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)', margin: '0 0 24px' }}>
            Our team typically responds within one business day.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-block', padding: '12px 28px', background: '#6B5A8E', color: '#FFFFFF', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Contact Us
            </Link>
            <a href="mailto:info@wealthwisekids.org" style={{ display: 'inline-block', padding: '12px 28px', background: 'rgba(255,255,255,0.10)', color: '#FFFFFF', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              info@wealthwisekids.org
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
