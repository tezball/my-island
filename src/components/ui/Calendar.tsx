import { useState } from 'react'
import Icon from './Icon'

interface CalendarProps {
  selectedDates?: string[]
  availableDates?: string[]
  bookedDates?: string[]
  blockedDates?: string[]
  onDateSelect?: (date: string) => void
  onRangeSelect?: (startDate: string, endDate: string) => void
  rangeMode?: boolean
  initialMonth?: Date
  className?: string
}

export default function Calendar({
  selectedDates = [],
  availableDates = [],
  bookedDates = [],
  blockedDates = [],
  onDateSelect,
  onRangeSelect,
  rangeMode = false,
  initialMonth,
  className = '',
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date())
  const [rangeStart, setRangeStart] = useState<string | null>(null)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Get the day of week for the first day (0 = Sunday, we want Monday = 0)
    let startDayOfWeek = firstDay.getDay() - 1
    if (startDayOfWeek < 0) startDayOfWeek = 6

    const days: (number | null)[] = []

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const getDateStatus = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) return 'selected'
    if (blockedDates.includes(dateStr)) return 'blocked'
    if (bookedDates.includes(dateStr)) return 'booked'
    if (availableDates.length === 0 || availableDates.includes(dateStr)) return 'available'
    return 'unavailable'
  }

  const isInRange = (dateStr: string) => {
    if (!rangeMode || selectedDates.length !== 2) return false
    const date = new Date(dateStr)
    const start = new Date(selectedDates[0])
    const end = new Date(selectedDates[1])
    return date > start && date < end
  }

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(day)
    const status = getDateStatus(dateStr)

    if (status === 'blocked' || status === 'booked' || status === 'unavailable') return

    if (rangeMode && onRangeSelect) {
      if (!rangeStart) {
        setRangeStart(dateStr)
        onDateSelect?.(dateStr)
      } else {
        const start = rangeStart < dateStr ? rangeStart : dateStr
        const end = rangeStart < dateStr ? dateStr : rangeStart
        onRangeSelect(start, end)
        setRangeStart(null)
      }
    } else {
      onDateSelect?.(dateStr)
    }
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const days = getDaysInMonth(currentMonth)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={`bg-white dark:bg-surface-dark rounded-2xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
        >
          <Icon name="chevron_left" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
        >
          <Icon name="chevron_right" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10" />
          }

          const dateStr = formatDate(day)
          const status = getDateStatus(dateStr)
          const isToday = dateStr === today
          const inRange = isInRange(dateStr)
          const isPast = dateStr < today

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={status === 'blocked' || status === 'booked' || status === 'unavailable' || isPast}
              className={`
                h-10 rounded-lg text-sm font-medium transition-colors relative
                ${status === 'selected'
                  ? 'bg-primary text-white'
                  : status === 'blocked' || status === 'unavailable'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : status === 'booked'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 cursor-not-allowed'
                  : inRange
                  ? 'bg-primary/20 text-primary'
                  : isPast
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }
                ${isToday && status !== 'selected' ? 'ring-2 ring-primary ring-inset' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-primary" />
          <span className="text-xs text-slate-500">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
          <span className="text-xs text-slate-500">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-amber-100 dark:bg-amber-900/30" />
          <span className="text-xs text-slate-500">Booked</span>
        </div>
      </div>
    </div>
  )
}
