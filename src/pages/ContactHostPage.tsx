import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import bookingsApi from '../lib/api/bookings'

const quickMessages = [
  'Running late - will arrive after check-in time',
  'Question about check-in instructions',
  'Need to request early check-in',
  'Question about amenities',
]

interface BookingData {
  id: string
  campsiteName: string
  campsiteImage?: string
  checkIn: string
  checkOut: string
  guests: number
}

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  createdAt: string
}

export default function ContactHostPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [existingMessages, _setExistingMessages] = useState<Message[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return

      try {
        setIsLoading(true)
        const data = await bookingsApi.getById(bookingId)
        setBooking({
          id: data.id,
          campsiteName: data.campsite?.name || '',
          campsiteImage: data.campsite?.imageUrl || '',
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
        })
        // In production, would also fetch messages from API
      } catch (error) {
        console.error('Failed to fetch booking:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Contact Host" showNav={false}>
        <div className="flex-1 overflow-auto p-4">
          <Skeleton variant="rectangular" height={80} className="rounded-xl mb-4" />
          <Skeleton variant="rectangular" height={100} className="rounded-xl" />
        </div>
      </AppShell>
    )
  }

  if (!booking) {
    return (
      <AppShell showBack headerTitle="Contact Host">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Booking not found</p>
        </div>
      </AppShell>
    )
  }

  const hostInfo = {
    name: 'Host',
    phone: '',
    email: '',
    avatar: undefined as string | undefined,
    responseTime: 'Usually responds within a few hours',
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSend = async () => {
    if (!message.trim()) return

    setIsSending(true)
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSending(false)

    // In real app, would send message via API
    navigate(`/bookings/${bookingId}`)
  }

  const selectQuickMessage = (msg: string) => {
    setSubject(msg)
    setMessage(`Hi ${hostInfo.name.split(' ')[0]},\n\n${msg.toLowerCase()}...\n\n`)
  }

  return (
    <AppShell showBack headerTitle="Contact Host" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Host info */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              {hostInfo.avatar ? (
                <img
                  src={hostInfo.avatar}
                  alt={hostInfo.name}
                  className="size-16 rounded-full object-cover"
                />
              ) : (
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="person" size={32} className="text-primary" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 size-4 bg-emerald-500 rounded-full border-2 border-white dark:border-surface-dark" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Message {hostInfo.name}
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Icon name="bolt" size={14} className="text-amber-500" />
                {hostInfo.responseTime}
              </p>
            </div>
          </div>
        </div>

        {/* Current booking context */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Current Booking
          </p>
          <div className="flex items-center gap-3">
            {booking.campsiteImage ? (
              <img
                src={booking.campsiteImage}
                alt={booking.campsiteName}
                className="w-16 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="camping" size={20} className="text-slate-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {booking.campsiteName}
              </p>
              <p className="text-sm text-slate-500">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} • {booking.guests} guests
              </p>
            </div>
          </div>
        </div>

        {/* Previous messages */}
        {existingMessages.length > 0 && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Previous Messages
            </p>
            <div className="space-y-3">
              {existingMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.senderId === 'user-1' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="size-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <Icon name="person" size={16} className="text-slate-500" />
                    </div>
                  )}
                  <div className={`flex-1 max-w-[80%] ${
                    msg.senderId === 'user-1' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      msg.senderId === 'user-1'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString('en-IE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick messages */}
        <div className="p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Quick Messages
          </p>
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, i) => (
              <button
                key={i}
                onClick={() => selectQuickMessage(msg)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div className="p-4 pt-0">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Subject
          </label>
          <div className="relative">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this about?"
              className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <Icon
              name="edit"
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Message */}
        <div className="p-4 pt-0">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${hostInfo.name.split(' ')[0]}, I wanted to ask about...`}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
          />
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          size="lg"
          disabled={!message.trim()}
          isLoading={isSending}
          onClick={handleSend}
          rightIcon="send"
        >
          Send Message
        </Button>
      </div>
    </AppShell>
  )
}
