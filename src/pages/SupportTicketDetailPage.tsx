import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'

interface Message {
  id: string
  sender: 'user' | 'support'
  content: string
  timestamp: string
}

const ticketData: Record<string, {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved'
  category: string
  createdAt: string
  messages: Message[]
}> = {
  'TKT-001': {
    id: 'TKT-001',
    subject: 'Refund not received',
    status: 'open',
    category: 'Payment',
    createdAt: '2025-01-15T10:30:00',
    messages: [
      {
        id: '1',
        sender: 'user',
        content: 'I cancelled my booking last week but haven\'t received my refund yet. The booking reference was BK-789.',
        timestamp: '2025-01-15T10:30:00',
      },
      {
        id: '2',
        sender: 'support',
        content: 'Hi there! Thank you for reaching out. I\'ve looked into your booking and can see the refund was processed on January 12th. Refunds typically take 5-7 business days to appear in your account. Could you please check again in a couple of days?',
        timestamp: '2025-01-15T14:22:00',
      },
    ],
  },
  'TKT-002': {
    id: 'TKT-002',
    subject: 'Cannot modify booking dates',
    status: 'resolved',
    category: 'Booking',
    createdAt: '2025-01-10T09:15:00',
    messages: [
      {
        id: '1',
        sender: 'user',
        content: 'I\'m trying to change my booking dates but the modify button isn\'t working.',
        timestamp: '2025-01-10T09:15:00',
      },
      {
        id: '2',
        sender: 'support',
        content: 'I\'ve checked and it looks like the new dates you selected aren\'t available. I\'ve helped modify your booking to the closest available dates. Please check your email for the updated confirmation.',
        timestamp: '2025-01-11T16:45:00',
      },
      {
        id: '3',
        sender: 'user',
        content: 'Thank you! That works perfectly.',
        timestamp: '2025-01-11T17:00:00',
      },
    ],
  },
}

export default function SupportTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const ticket = ticketId ? ticketData[ticketId] : null

  if (!ticket) {
    return (
      <AppShell showBack headerTitle="Ticket Not Found" showNav={false}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Icon name="error_outline" size={32} className="text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Ticket Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            This support ticket doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/support/tickets')}>
            View All Tickets
          </Button>
        </div>
      </AppShell>
    )
  }

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

  const handleSend = async () => {
    if (!newMessage.trim()) return
    setIsSending(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSending(false)
    setNewMessage('')
  }

  return (
    <AppShell showBack headerTitle={ticket.id} showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Ticket Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {ticket.subject}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {ticket.category} • Created {formatDate(ticket.createdAt)}
              </p>
            </div>
            {getStatusBadge(ticket.status)}
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4">
          {ticket.messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                }`}
              >
                {message.sender === 'support' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Icon name="support_agent" size={14} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Support Team
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-slate-500'
                }`}>
                  {formatDate(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-32" />
      </div>

      {/* Reply Input */}
      {ticket.status !== 'resolved' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
          <div className="flex gap-2">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-0 resize-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
                rows={2}
              />
            </div>
            <Button
              onClick={handleSend}
              isLoading={isSending}
              disabled={!newMessage.trim()}
              leftIcon="send"
            >
              Send
            </Button>
          </div>
        </div>
      )}

      {ticket.status === 'resolved' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3">
            <Icon name="check_circle" size={24} className="text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-800 dark:text-emerald-400">
                Ticket Resolved
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-500">
                Need more help? <button className="underline" onClick={() => navigate('/support/contact')}>Create a new ticket</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
