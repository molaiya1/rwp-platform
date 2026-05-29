import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const portalUrl = process.env.PORTAL_API_URL   // https://wwk-portal.vercel.app
  const apiSecret = process.env.RWP_API_SECRET   // shared secret — same value set in portal's RWP_API_SECRET

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
          student_id:    body.facilitatorEmail ?? undefined,
          cohort_id:     body.cohortId         ?? undefined,
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
            studentCount: body.studentCount,
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
      } else {
        console.log('[RWP Reflect] Event logged to portal — score:', body.pathwayScore, '| cohort:', body.cohortId ?? 'none')
      }
    } catch (err) {
      console.error('[RWP Reflect] Failed to reach portal:', err)
    }
  } else {
    console.log('[RWP Reflect] Event (no portal env set):', {
      event_type:   'rwp_experience_completed',
      company:      body.company,
      pathwayScore: body.pathwayScore,
      facilitator:  body.facilitator,
      school:       body.school,
      studentCount: body.studentCount,
      cohortId:     body.cohortId ?? null,
    })
  }

  // ── Notify admin + facilitator via Formspree (if configured) ──
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
          student_count:    body.studentCount ?? '',
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
