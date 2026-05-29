import ComingSoon from '@/app/components/ComingSoon'
import { TrendingUp } from 'lucide-react'

export default function ProgressPage() {
  return (
    <ComingSoon
      title="My Progress"
      description="See your full impact history — XP earned, Field Labs completed, FLIQ Score™ growth, and milestones reached across every pathway."
      icon={<TrendingUp size={28} />}
    />
  )
}
