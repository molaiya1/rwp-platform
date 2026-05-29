import ComingSoon from '@/app/components/ComingSoon'
import { Zap } from 'lucide-react'

export default function ActivityPage() {
  return (
    <ComingSoon
      title="Activity Feed"
      description="Your full history — XP earned, Field Labs attended, milestones reached, and connections made."
      icon={<Zap size={28} />}
    />
  )
}
