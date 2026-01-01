import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'

const tickets = [
  {
    id: 'TKT-001',
    subject: 'Refund not received',
    status: 'open',
    createdAt: '2025-01-15T10:30:00',
    lastReply: '2025-01-15T14:22:00',
    category: 'Payment',
  },
  {
    id: 'TKT-002',
    subject: 'Cannot modify booking dates',
    status: 'resolved',
    createdAt: '2025-01-10T09:15:00',
    lastReply: '2025-01-11T16:45:00',
    category: 'Booking',
  },
]

export default function SupportTicketsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="warning">Open</Badge>
      case 'pending':
        return <Badge variant="info">Pending</Badge>
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AppShell
      showBack
      headerTitle="Support Tickets"
      showNav={false}
      headerRightAction={
        <Link to="/support/contact">
          <Icon name="add" size={24} className="text-primary" />
        </Link>
      }
    >
      <div className="flex-1 overflow-auto">
        {tickets.length > 0 ? (
          <div className="p-4 space-y-3">
            {tickets.map(ticket => (
              <Link
                key={ticket.id}
                to={`/support/tickets/${ticket.id}`}
                className="block bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {ticket.id} • {ticket.category}
                    </p>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon name="schedule" size={16} />
                    <span>Created {formatDate(ticket.createdAt)}</span>
                  </div>
                  <Icon name="chevron_right" size={20} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Icon name="confirmation_number" size={32} className="text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No Support Tickets
            </h2>
            <p className="text-slate-500 mb-6 max-w-xs">
              You haven't submitted any support requests yet.
            </p>
            <Link
              to="/support/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
            >
              <Icon name="add" size={18} />
              Create Ticket
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
