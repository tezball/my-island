import type { Booking } from '@/types'
import { Badge } from '../ui'

interface BookingStatusBadgeProps {
  status: Booking['status']
  className?: string
}

const statusConfig: Record<Booking['status'], { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  completed: { variant: 'info', label: 'Completed' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} className={className}>{config.label}</Badge>
}
