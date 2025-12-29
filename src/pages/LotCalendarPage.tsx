import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import type { CampsiteLot } from '@/types'

type DayStatus = 'available' | 'booked' | 'maintenance' | 'empty' | 'selected' | 'range-start' | 'range-middle' | 'range-end'

interface CalendarDay {
  date: number
  status: DayStatus
  isCurrentMonth: boolean
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function LotCalendarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedLotId, setSelectedLotId] = useState<string>('')
  const [selectedDates, setSelectedDates] = useState<number[]>([])

  const { data } = useQuery({
    queryKey: ['campsite', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/campsites/${id}`)
      return res.json()
    },
  })

  const lots: CampsiteLot[] = data?.campsite?.lots || []
  const selectedLot = lots.find((l) => l.id === selectedLotId) || lots[0]

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Get the day of week for the first day (0 = Sunday, we want Monday = 0)
    let startDayOfWeek = firstDay.getDay() - 1
    if (startDayOfWeek < 0) startDayOfWeek = 6

    const days: CalendarDay[] = []

    // Add previous month days
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        status: 'empty',
        isCurrentMonth: false,
      })
    }

    // Add current month days with mock statuses
    for (let day = 1; day <= daysInMonth; day++) {
      let status: DayStatus = 'empty'

      // Mock statuses based on date
      if (day >= 1 && day <= 4) status = 'available'
      else if (day === 5 || day === 6) status = 'booked'
      else if (day === 9 || day === 10) status = 'maintenance'
      else if (selectedDates.includes(day)) {
        if (selectedDates.length === 1) {
          status = 'selected'
        } else {
          const idx = selectedDates.indexOf(day)
          if (idx === 0) status = 'range-start'
          else if (idx === selectedDates.length - 1) status = 'range-end'
          else status = 'range-middle'
        }
      }

      days.push({
        date: day,
        status,
        isCurrentMonth: true,
      })
    }

    return days
  }, [currentMonth, selectedDates])

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth || day.status === 'booked' || day.status === 'maintenance') return

    if (selectedDates.includes(day.date)) {
      setSelectedDates(selectedDates.filter((d) => d !== day.date))
    } else {
      const newDates = [...selectedDates, day.date].sort((a, b) => a - b)
      // Fill in range between first and last
      if (newDates.length >= 2) {
        const filled: number[] = []
        for (let i = newDates[0]; i <= newDates[newDates.length - 1]; i++) {
          filled.push(i)
        }
        setSelectedDates(filled)
      } else {
        setSelectedDates(newDates)
      }
    }
  }

  const clearSelection = () => setSelectedDates([])

  const getDayClassName = (day: CalendarDay) => {
    const base = 'h-12 w-full flex items-center justify-center font-medium transition-colors'

    if (!day.isCurrentMonth) {
      return `${base} text-gray-300 dark:text-gray-700`
    }

    switch (day.status) {
      case 'available':
        return `${base} bg-primary/20 hover:bg-primary/30 text-green-800 dark:text-primary rounded-lg font-bold`
      case 'booked':
        return `${base} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg relative`
      case 'maintenance':
        return `${base} bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-lg flex-col gap-0.5`
      case 'selected':
        return `${base} bg-white dark:bg-surface-dark border-2 border-primary text-text-main dark:text-white rounded-lg font-bold shadow-md scale-105 z-10`
      case 'range-start':
        return `${base} bg-primary text-black rounded-l-lg rounded-r-none font-bold`
      case 'range-middle':
        return `${base} bg-primary/40 text-black rounded-none`
      case 'range-end':
        return `${base} bg-primary text-black rounded-r-lg rounded-l-none font-bold`
      default:
        return `${base} text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg`
    }
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const selectedDatesDisplay = selectedDates.length > 0
    ? `${currentMonth.toLocaleDateString('en-US', { month: 'short' })} ${selectedDates.join(', ')}`
    : 'None'

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex-none pt-4 px-4 pb-2 z-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <h2 className="text-lg font-bold">Availability</h2>
          <button className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Icon name="tune" />
          </button>
        </div>

        {/* Lot Selector */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Icon name="camping" className="text-primary" />
          </div>
          <select
            value={selectedLotId || selectedLot?.id}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-surface-dark border-0 rounded-xl py-3.5 pl-12 pr-10 font-semibold shadow-sm focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Icon name="expand_more" className="text-gray-400" />
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-64">
        {/* Month Stats Summary */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Occupancy</span>
              <span className="text-xl font-bold">74%</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Booked</span>
              <span className="text-xl font-bold">23 Days</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Revenue</span>
              <span className="text-xl font-bold text-primary">$1,240</span>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-6 py-6">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="chevron_left" />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">{monthName}</h2>
          <button
            onClick={handleNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="chevron_right" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="px-4 pb-4">
          {/* Days of Week */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-y-3 gap-x-2">
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => handleDateClick(day)}
                className={getDayClassName(day)}
                disabled={!day.isCurrentMonth || day.status === 'booked' || day.status === 'maintenance'}
              >
                {day.status === 'maintenance' ? (
                  <>
                    <span className="text-sm">{day.date}</span>
                    <Icon name="build" className="text-[10px]" />
                  </>
                ) : day.status === 'booked' ? (
                  <>
                    <span className="relative z-10">{day.date}</span>
                    <div className="absolute bottom-1 right-0 left-0 flex justify-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full" />
                    </div>
                  </>
                ) : (
                  day.date
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 px-4 justify-center opacity-80 mb-6">
          <div className="flex items-center gap-1.5 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-xs font-medium">Booked</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span className="text-xs font-medium">Maint.</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-white/5">
            <div className="w-2.5 h-2.5 rounded-full border border-text-main dark:border-white" />
            <span className="text-xs font-medium">Empty</span>
          </div>
        </div>
      </main>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] rounded-t-2xl z-30">
        <div className="max-w-md mx-auto flex flex-col p-5 gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              Selected: <span className="text-primary">{selectedDatesDisplay}</span>
            </p>
            <button
              onClick={clearSelection}
              className="text-xs font-medium text-gray-500 underline"
            >
              Clear selection
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary/10 hover:border-primary/50 border border-transparent transition-all group">
              <Icon name="check_circle" className="text-2xl text-gray-600 dark:text-gray-300 group-hover:text-primary" />
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary">Available</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all group">
              <Icon name="block" className="text-2xl text-gray-600 dark:text-gray-300 group-hover:text-red-500" />
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 group-hover:text-red-500">Block</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all group">
              <Icon name="build" className="text-2xl text-gray-600 dark:text-gray-300 group-hover:text-orange-500" />
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 group-hover:text-orange-500">Maintenance</span>
            </button>
          </div>

          <button className="w-full h-12 bg-text-main dark:bg-primary text-white dark:text-text-main rounded-xl font-bold text-base shadow-lg hover:opacity-90 transition-opacity">
            Update Availability
          </button>
        </div>

        {/* Safe Area Spacer */}
        <div className="h-4 w-full bg-surface-light dark:bg-surface-dark" />
      </div>
    </div>
  )
}
