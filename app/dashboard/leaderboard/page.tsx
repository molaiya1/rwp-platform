import ComingSoon from '@/app/components/ComingSoon'
import { Award } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <ComingSoon
      title="Leaderboard"
      description="See how you rank against other Pathway Explorers™. Earn XP, climb levels, and earn recognition for real-world impact."
      icon={<Award size={28} />}
    />
  )
}
