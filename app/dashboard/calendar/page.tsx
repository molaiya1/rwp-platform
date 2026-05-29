import ComingSoon from '@/app/components/ComingSoon'
import { Calendar } from 'lucide-react'

export default function CalendarPage() {
  return (
    <ComingSoon
      title="Calendar"
      description="View upcoming Field Labs™, session dates, and deadlines. Stay organized and never miss an opportunity."
      icon={<Calendar size={28} />}
    />
  )
}
