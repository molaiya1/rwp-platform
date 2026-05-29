'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description: string
  icon: React.ReactNode
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F5FF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'inherit',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '48px 40px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(107,90,142,0.10)',
      }}>
        <div style={{
          width: 64,
          height: 64,
          background: '#EDE9F6',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#6B5A8E',
        }}>
          {icon}
        </div>

        <div style={{
          display: 'inline-block',
          background: '#F4B22320',
          color: '#C9952A',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '4px 12px',
          borderRadius: 20,
          marginBottom: 16,
        }}>
          Founding Cohort — Coming Soon
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1C1635', margin: '0 0 12px' }}>
          {title}
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: '0 0 28px' }}>
          {description}
        </p>

        <p style={{ fontSize: 12, color: '#8880A0', lineHeight: 1.6, margin: '0 0 28px' }}>
          You&apos;re part of the Founding Cohort — you&apos;ll get first access as features roll out. Watch your email for updates.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#6B5A8E',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            padding: '11px 22px',
            borderRadius: 10,
            textDecoration: 'none',
          }}
        >
          <ChevronLeft size={15} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
