import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Booking } from '@/types'
import { cn } from '@/utils/cn'
import { Icon, BookingCardSkeleton } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import { TopAppBar, AppShell } from '@/components/layout'
import { BookingSummaryCard } from '@/components/booking'

type Tab = 'upcoming' | 'past'

export function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', activeTab],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings?status=${activeTab}`)
      return res.json()
    },
  })

  const bookings: Booking[] = data?.bookings || []

  return (
    <AppShell>
      <TopAppBar title="My Bookings" showBack={false} />

      <div className="px-4 pb-28">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'past'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-colors',
                activeTab === tab
                  ? 'bg-primary text-background-dark'
                  : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-gray-700'
              )}
            >
              {tab === 'upcoming' ? 'Upcoming' : 'Past'}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                name={activeTab === 'upcoming' ? 'calendar_today' : 'history'}
                size="xl"
                className="text-slate-300 dark:text-slate-600 mx-auto mb-4"
              />
              <p className="text-slate-500">
                {activeTab === 'upcoming'
                  ? 'No upcoming bookings'
                  : 'No past bookings'}
              </p>
              <p className="text-sm text-slate-400">
                {activeTab === 'upcoming'
                  ? 'Start planning your next adventure!'
                  : 'Your completed trips will appear here'}
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingSummaryCard
                key={booking.id}
                booking={booking}
                showActions={activeTab === 'upcoming'}
              />
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
