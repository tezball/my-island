import { useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '../ui'

interface DateRangePickerProps {
  checkIn: string | null
  checkOut: string | null
  unavailableDates?: string[]
  onSelect: (checkIn: string, checkOut: string) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Add empty days for padding
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(new Date(0)) // placeholder
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  return days
}

export function DateRangePicker({
  checkIn,
  checkOut,
  unavailableDates = [],
  onSelect,
}: DateRangePickerProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn')

  const days = getDaysInMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (date: Date) => {
    const dateKey = formatDateKey(date)

    if (selecting === 'checkIn') {
      onSelect(dateKey, '')
      setSelecting('checkOut')
    } else {
      if (checkIn && dateKey > checkIn) {
        onSelect(checkIn, dateKey)
        setSelecting('checkIn')
      } else {
        onSelect(dateKey, '')
        setSelecting('checkOut')
      }
    }
  }

  const isInRange = (date: Date): boolean => {
    if (!checkIn || !checkOut) return false
    const dateKey = formatDateKey(date)
    return dateKey > checkIn && dateKey < checkOut
  }

  const isSelected = (date: Date): boolean => {
    const dateKey = formatDateKey(date)
    return dateKey === checkIn || dateKey === checkOut
  }

  const isUnavailable = (date: Date): boolean => {
    const dateKey = formatDateKey(date)
    return unavailableDates.includes(dateKey) || date < today
  }

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <Icon name="chevron_left" className="text-slate-600 dark:text-slate-300" />
        </button>
        <h3 className="font-bold text-slate-900 dark:text-white">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <Icon name="chevron_right" className="text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (date.getTime() === 0) {
            return <div key={`empty-${i}`} />
          }

          const unavailable = isUnavailable(date)
          const selected = isSelected(date)
          const inRange = isInRange(date)

          return (
            <button
              key={formatDateKey(date)}
              onClick={() => !unavailable && handleDayClick(date)}
              disabled={unavailable}
              className={cn(
                'aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-colors',
                unavailable && 'text-slate-300 dark:text-slate-600 line-through cursor-not-allowed',
                !unavailable && !selected && !inRange && 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                inRange && 'bg-primary/20 text-primary',
                selected && 'bg-primary text-background-dark'
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {/* Selection Status */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <span className="text-slate-500">Check-in</span>
            <p className="font-semibold text-slate-900 dark:text-white">
              {checkIn ? formatDisplayDate(checkIn) : 'Select date'}
            </p>
          </div>
          <div className="flex-1">
            <span className="text-slate-500">Check-out</span>
            <p className="font-semibold text-slate-900 dark:text-white">
              {checkOut ? formatDisplayDate(checkOut) : 'Select date'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
