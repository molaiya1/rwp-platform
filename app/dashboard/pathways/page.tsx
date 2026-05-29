import ComingSoon from '@/app/components/ComingSoon'
import { Map } from 'lucide-react'

export default function PathwaysPage() {
  return (
    <ComingSoon
      title="My Pathways"
      description="Track your progress across career pathways — Media, Entrepreneurship, STEM, Community Leadership, and more. Your personalized roadmap to opportunity."
      icon={<Map size={28} />}
    />
  )
}
