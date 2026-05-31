import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  // Validation
  if (!body.listing_title || !body.company) {
    return NextResponse.json({ ok: false, error: 'listing_title and company are required' }, { status: 400 })
  }
  const email = typeof body.requester_email === 'string' ? body.requester_email.trim() : ''
  if (!email || !email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ ok: false, error: 'Valid requester email required' }, { status: 400 })
  }

  const endpoint = process.env.FORMSPREE_NOTIFY
  const payload = {
    subject:          `Experience Request — ${body.listing_title} @ ${body.company}`,
    listing_title:    body.listing_title,
    company:          body.company,
    industry:         body.industry ?? '',
    requester_name:   body.requester_name ?? '',
    requester_org:    body.requester_org ?? '',
    requester_email:  email,
    students:         body.students ?? '',
    preferred_dates:  body.preferred_dates ?? '',
    message:          body.message ?? '',
    submitted_at:     new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    _replyto:         email,
  }

  if (!endpoint) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ ok: false, error: text }, { status: 502 })
    }
  } catch (err) {
    console.error('[request-experience] Formspree failed:', err)
    return NextResponse.json({ ok: false, error: 'Notification failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
