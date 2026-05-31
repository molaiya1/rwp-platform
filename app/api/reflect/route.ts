import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  // Validation
  if (!body.facilitatorEmail || typeof body.facilitatorEmail !== 'string' ||
      !body.facilitatorEmail.includes('@')) {
    return NextResponse.json({ ok: false, error: 'Valid facilitator email required' }, { status: 400 })
  }
  if (!body.company || !body.school) {
    return NextResponse.json({ ok: false, error: 'company and school are required' }, { status: 400 })
  }
  const studentCount = parseInt(String(body.studentCount ?? '0'), 10)
  if (isNaN(studentCount) || studentCount < 0) {
    return NextResponse.json({ ok: false, error: 'Invalid student count' }, { status: 400 })
  }

  const portalUrl = process.env.PORTAL_API_URL
  const apiSecret = process.env.RWP_API_SECRET

  if (portalUrl && apiSecret) {
    try {
      const res = await fetch(`${portalUrl}/api/activity`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiSecret}`,
        },
        body: JSON.stringify({
          app_source:    'rwp',
          event_type:    'rwp_experience_completed',
          student_id:    body.studentId ?? undefined,   // fixed: was incorrectly using facilitatorEmail
          cohort_id:     body.cohortId  ?? undefined,
          pathway_score: body.pathwayScore,
          fliq_score:    null,
          event_data: {
            expId:        body.expId,
            company:      body.company,
            expType:      body.expType,
            expDate:      body.expDate,
            facilitator:  body.facilitator,
            school:       body.school,
            gradeLevel:   body.gradeLevel,
            studentCount,
            scores:       body.scores,
            pathwayScore: body.pathwayScore,
            highlight:    body.highlight,
            notes:        body.notes,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        console.error('[RWP Reflect] Portal rejected event:', res.status, err)
      }
    } catch (err) {
      console.error('[RWP Reflect] Failed to reach portal:', err)
    }
  }

  // Notify admin + facilitator via Formspree
  const formspreeNotify = process.env.FORMSPREE_NOTIFY
  if (formspreeNotify && body.facilitatorEmail) {
    try {
      await fetch(formspreeNotify, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject:          `New Reflection Submitted — ${body.company ?? 'Unknown Site'} (${body.school ?? ''})`,
          facilitator:      body.facilitatorEmail,
          school:           body.school ?? '',
          company:          body.company ?? '',
          experience_type:  body.expType ?? '',
          grade_level:      body.gradeLevel ?? '',
          student_count:    studentCount,
          pathway_score:    body.pathwayScore ?? '',
          cohort_id:        body.cohortId ?? 'none',
          highlight:        body.highlight ?? '',
          notes:            body.notes ?? '',
          submitted_at:     new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
          _replyto:         body.facilitatorEmail,
        }),
      })
    } catch (err) {
      console.error('[RWP Reflect] Notification email failed:', err)
    }
  }

  return NextResponse.json({ ok: true, pathwayScore: body.pathwayScore })
}
