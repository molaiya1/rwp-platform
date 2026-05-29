import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const endpoint = process.env.FORMSPREE_NOTIFY

  const payload = {
    subject:        `Experience Request — ${body.listing_title} @ ${body.company}`,
    listing_title:  body.listing_title,
    company:        body.company,
    industry:       body.industry ?? '',
    requester_name: body.requester_name ?? '',
    requester_org:  body.requester_org ?? '',
    requester_email: body.requester_email ?? '',
    students:       body.students ?? '',
    preferred_dates: body.preferred_dates ?? '',
    message:        body.message ?? '',
    submitted_at:   new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    _replyto:       body.requester_email ?? '',
  }

  // Log server-side regardless of Formspree config
  console.log('[experience-request]', JSON.stringify(payload))

  if (!endpoint) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ ok: false, error: text }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
