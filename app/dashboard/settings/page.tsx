import ComingSoon from '@/app/components/ComingSoon'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Manage your profile, notification preferences, and account details."
      icon={<Settings size={28} />}
    />
  )
}
