import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const endpoint = process.env.FORMSPREE_NOTIFY

  if (!endpoint) {
    // No notification service configured — log server-side and return OK
    console.warn('[notify] FORMSPREE_NOTIFY not set — skipping notification', body)
    return NextResponse.json({ ok: true, skipped: true })
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      subject:      `New Pathway Site Application — ${body.company}`,
      company:      body.company,
      industry:     body.industry ?? '',
      city:         body.city ?? '',
      contact_name: body.contact_name ?? '',
      contact_email: body.contact_email ?? '',
      experiences:  (body.experiences ?? []).join(', '),
      submitted_at: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      _replyto:     body.contact_email ?? '',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[notify] Formspree error', res.status, text)
    return NextResponse.json({ ok: false, error: text }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
