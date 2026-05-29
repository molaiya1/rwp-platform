import ComingSoon from '@/app/components/ComingSoon'
import { BookOpen } from 'lucide-react'

export default function ResourcesPage() {
  return (
    <ComingSoon
      title="Resource Library"
      description="Guides, prep materials, and tools to help you get the most out of every Field Lab™ experience — before, during, and after."
      icon={<BookOpen size={28} />}
    />
  )
}
