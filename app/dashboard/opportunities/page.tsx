import ComingSoon from '@/app/components/ComingSoon'
import { Compass } from 'lucide-react'

export default function OpportunitiesPage() {
  return (
    <ComingSoon
      title="Opportunities"
      description="Discover Field Labs™, job shadows, career panels, mentorships, and more — all matched to your pathway and grade level."
      icon={<Compass size={28} />}
    />
  )
}
