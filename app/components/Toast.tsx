'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'error' | 'warning'

export interface ToastData {
  id: string
  message: string
  type: ToastType
}

interface Props {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export default function Toast({ toasts, onDismiss }: Props) {
  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`} role="status">
      <span className={styles.icon}>
        {toast.type === 'success' && <CheckCircle2 size={16} />}
        {toast.type === 'error'   && <XCircle size={16} />}
        {toast.type === 'warning' && <AlertTriangle size={16} />}
      </span>
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.dismiss}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
