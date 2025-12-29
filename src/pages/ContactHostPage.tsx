import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button, Input } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { apiFetch } from '@/utils/api'
import type { Booking } from '@/types'

// Mock M25: Contact Host Page
interface Message {
  id: string
  sender: 'user' | 'host'
  text: string
  timestamp: Date
}

export function ContactHostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newMessage, setNewMessage] = useState('')

  const { data } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings/${id}`)
      return res.json()
    },
  })

  const booking: Booking | undefined = data?.booking

  // Mock messages
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'host',
      text: "Hi! Welcome to Whispering Pines. Looking forward to hosting you. Let me know if you have any questions!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      sender: 'user',
      text: "Thanks! What time can we check in on Saturday?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000),
    },
    {
      id: '3',
      sender: 'host',
      text: "Check-in is from 3 PM onwards. If you're arriving earlier, you can leave your bags at reception and explore the area!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 7200000),
    },
  ])

  const handleSend = () => {
    if (!newMessage.trim()) return
    // Would send message via API
    setNewMessage('')
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
          >
            <Icon name="arrow_back" />
          </button>

          {/* Host Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">JD</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark" />
            </div>
            <div>
              <h2 className="font-bold text-sm">John Doe</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>

          <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
            <Icon name="call" />
          </button>
        </div>

        {/* Booking Context */}
        {booking && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-surface-dark rounded-lg">
              <div
                className="w-8 h-8 rounded bg-cover bg-center"
                style={{ backgroundImage: `url('${booking.campsiteImage}')` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{booking.campsiteName}</p>
                <p className="text-[10px] text-gray-500">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                message.sender === 'user'
                  ? 'bg-primary text-background-dark rounded-br-md'
                  : 'bg-white dark:bg-surface-dark rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  message.sender === 'user' ? 'text-background-dark/60' : 'text-gray-400'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2 pt-4">
          {['Early check-in?', 'Parking info', 'WiFi password', 'Pet policy'].map((reply) => (
            <button
              key={reply}
              onClick={() => setNewMessage(reply)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-surface-dark rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </main>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 p-4 pb-8">
        <div className="max-w-md mx-auto flex items-end gap-2">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400">
            <Icon name="attach_file" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 pr-10 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 resize-none text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
              <Icon name="mood" className="text-xl" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    </div>
  )
}
