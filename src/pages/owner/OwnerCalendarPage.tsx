import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Icon from '../../components/ui/Icon'
import Skeleton from '../../components/ui/Skeleton'

interface Booking {
  id: string
  guestName: string
  lotName: string
  checkIn: string
  checkOut: string
  guests: number
  status: 'confirmed' | 'pending' | 'checked_in' | 'checked_out'
}

interface BlockedDate {
  date: string
  reason: string
}

export default function OwnerCalendarPage() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Mock data - would come from API
        await new Promise((resolve) => setTimeout(resolve, 500))

        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)
        const twoWeeks = new Date(today)
        twoWeeks.setDate(twoWeeks.getDate() + 14)

        setBookings([
          {
            id: '1',
            guestName: 'Sarah Murphy',
            lotName: 'Ocean View Pod',
            checkIn: tomorrow.toISOString().split('T')[0],
            checkOut: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            guests: 2,
            status: 'confirmed',
          },
          {
            id: '2',
            guestName: 'Michael O\'Brien',
            lotName: 'Forest Cabin',
            checkIn: nextWeek.toISOString().split('T')[0],
            checkOut: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            guests: 4,
            status: 'pending',
          },
          {
            id: '3',
            guestName: 'Emma Walsh',
            lotName: 'Beach Tent',
            checkIn: twoWeeks.toISOString().split('T')[0],
            checkOut: new Date(twoWeeks.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            guests: 3,
            status: 'confirmed',
          },
        ])

        // Mock blocked dates
        const maintenanceDate = new Date(today)
        maintenanceDate.setDate(maintenanceDate.getDate() + 21)
        setBlockedDates([
          { date: maintenanceDate.toISOString().split('T')[0], reason: 'Maintenance' },
        ])
      } catch (error) {
        console.error('Failed to fetch calendar data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    // Add padding for days from previous month
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    for (let i = startPadding; i > 0; i--) {
      const day = new Date(year, month, 1 - i)
      days.push(day)
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add padding for days from next month
    const endPadding = 42 - days.length
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }, [currentMonth])

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]

    // Check if blocked
    const blocked = blockedDates.find((b) => b.date === dateStr)
    if (blocked) return 'blocked'

    // Check if has booking
    const booking = bookings.find((b) => {
      const checkIn = new Date(b.checkIn)
      const checkOut = new Date(b.checkOut)
      return date >= checkIn && date < checkOut
    })

    if (booking) {
      if (booking.status === 'pending') return 'pending'
      if (booking.status === 'checked_in') return 'active'
      return 'booked'
    }

    return 'available'
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((b) => {
      const checkIn = new Date(b.checkIn)
      const checkOut = new Date(b.checkOut)
      return date >= checkIn && date < checkOut
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
    setSelectedDate(null)
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-IE', { month: 'long', year: 'numeric' })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Calendar" showNav={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <Skeleton variant="rectangular" height={300} className="rounded-2xl" />
          <Skeleton variant="rectangular" height={150} className="rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : []

  return (
    <AppShell
      showBack
      headerTitle="Calendar"
      showNav={false}
      headerRightAction={
        <button onClick={() => navigate('/owner/settings/calendar')}>
          <Icon name="settings" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Month Navigation */}
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="chevron_left" size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {formatMonthYear(currentMonth)}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="chevron_right" size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="px-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-slate-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {daysInMonth.map((date, index) => {
                const status = getDateStatus(date)
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString()

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square p-1 border-b border-r border-slate-100 dark:border-slate-800 transition-colors ${
                      !isCurrentMonth(date)
                        ? 'opacity-40'
                        : ''
                    } ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center rounded-lg ${
                        isToday(date)
                          ? 'bg-primary text-white'
                          : ''
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        isToday(date)
                          ? 'text-white'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {date.getDate()}
                      </span>
                      {status !== 'available' && !isToday(date) && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                            status === 'booked'
                              ? 'bg-primary'
                              : status === 'pending'
                              ? 'bg-amber-400'
                              : status === 'active'
                              ? 'bg-green-500'
                              : 'bg-red-400'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-slate-500">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-500">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-500">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-slate-500">Blocked</span>
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="px-4 pb-4">
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                {selectedDate.toLocaleDateString('en-IE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>

              {selectedBookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => navigate(`/owner/bookings`)}
                    >
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold">
                          {booking.guestName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {booking.guestName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.lotName} • {booking.guests} guests
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-primary/10 text-primary'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : booking.status === 'checked_in'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Icon name="event_available" size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No bookings on this date</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Bookings Summary */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Upcoming Bookings
          </h3>
          <div className="space-y-2">
            {bookings
              .filter((b) => new Date(b.checkIn) >= new Date())
              .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
              .slice(0, 3)
              .map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon name="person" size={20} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                      {booking.guestName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(booking.checkIn).toLocaleDateString('en-IE', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      -{' '}
                      {new Date(booking.checkOut).toLocaleDateString('en-IE', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <Icon name="chevron_right" size={20} className="text-slate-400" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
