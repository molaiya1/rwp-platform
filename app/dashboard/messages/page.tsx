import ComingSoon from '@/app/components/ComingSoon'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  return (
    <ComingSoon
      title="Messages"
      description="Communicate directly with Pathway Sites™, Impact Partners™, and your organization — all in one secure place."
      icon={<MessageSquare size={28} />}
    />
  )
}
