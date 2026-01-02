import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Calendar from '../components/ui/Calendar'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import { campsitesApi } from '../lib/api/campsites'

interface CampsiteInfo {
  name: string
  image: string
  pricePerNight: number
}

export default function SelectDatesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [campsite, setCampsite] = useState<CampsiteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [blockedDates, setBlockedDates] = useState<string[]>([])

  useEffect(() => {
    async function fetchCampsite() {
      if (!id) return

      try {
        const data = await campsitesApi.getById(id)
        setCampsite({
          name: data.name,
          image: data.images[0] || '',
          pricePerNight: data.priceFrom,
        })

        // For now, generate available dates (next 90 days)
        // In production, would fetch from availability API
      } catch (error) {
        console.error('Failed to fetch campsite:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampsite()
  }, [id])

  const handleDateSelect = (dateStr: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr)
      setCheckOut(null)
    } else if (dateStr > checkIn) {
      setCheckOut(dateStr)
    } else {
      setCheckIn(dateStr)
      setCheckOut(null)
    }
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const pricePerNight = campsite?.pricePerNight || 0
  const totalPrice = nights * pricePerNight

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Select'
    return new Date(dateStr).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
  }

  // Build selected dates array for Calendar
  const selectedDates: string[] = []
  if (checkIn) selectedDates.push(checkIn)
  if (checkOut) selectedDates.push(checkOut)

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Select Dates" showNav={false}>
        <div className="flex-1 overflow-auto p-4">
          <Skeleton variant="rectangular" height={60} className="rounded-lg mb-4" />
          <Skeleton variant="rectangular" height={300} className="rounded-xl" />
        </div>
      </AppShell>
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Select Dates">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Select Dates" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Campsite summary */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={campsite.image}
              alt={campsite.name}
              className="w-16 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{campsite.name}</p>
              <p className="text-sm text-slate-500">€{pricePerNight}/night</p>
            </div>
          </div>
        </div>

        {/* Date selection summary */}
        <div className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Check-in</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {formatDate(checkIn)}
              </p>
            </div>
            <div className="flex items-center">
              <Icon name="arrow_forward" size={20} className="text-slate-400" />
            </div>
            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Check-out</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {formatDate(checkOut)}
              </p>
            </div>
          </div>
          {nights > 0 && (
            <p className="text-center text-sm text-slate-500 mt-3">
              {nights} night{nights !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Calendar */}
        <div className="px-4">
          <Calendar
            selectedDates={selectedDates}
            bookedDates={bookedDates}
            blockedDates={blockedDates}
            onDateSelect={handleDateSelect}
            rangeMode
          />
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        {nights > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-600 dark:text-slate-400">
              {pricePerNight} × {nights} nights
            </span>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              {totalPrice.toFixed(2)}
            </span>
          </div>
        )}
        <Button
          className="w-full"
          disabled={!checkIn || !checkOut}
          onClick={() => navigate(`/book/${id}/guests`, {
            state: { checkIn, checkOut }
          })}
        >
          Continue to Guests
        </Button>
      </div>
    </AppShell>
  )
}
