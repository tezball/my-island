import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { bookingsApi, type BookingDetailResponse } from '../lib/api/bookings'

export default function CheckInInstructionsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [bookingDetail, setBookingDetail] = useState<BookingDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) return
      setIsLoading(true)
      try {
        const data = await bookingsApi.getDetailById(bookingId)
        setBookingDetail(data)
      } catch (err) {
        console.error('Failed to fetch booking details:', err)
        setError('Booking not found')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookingDetails()
  }, [bookingId])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Check-In Guide">
        <div className="flex-1">
          <Skeleton className="w-full h-40" />
          <div className="p-4 space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !bookingDetail) {
    return (
      <AppShell showBack headerTitle="Check-In Guide">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">{error || 'Booking not found'}</p>
        </div>
      </AppShell>
    )
  }

  const { campsite, checkInInstructions: instructions } = bookingDetail

  // If no instructions, show placeholder
  if (!instructions) {
    return (
      <AppShell showBack headerTitle="Check-In Guide">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Icon name="info" size={48} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Instructions Coming Soon
          </h2>
          <p className="text-slate-500 text-center mb-6">
            Check-in instructions will be available closer to your arrival date.
          </p>
          <Button variant="secondary" onClick={() => navigate(`/bookings/${bookingId}`)}>
            Back to Booking
          </Button>
        </div>
      </AppShell>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In real app, would show toast notification
  }

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${campsite.location.lat},${campsite.location.lng}`
    window.open(url, '_blank')
  }

  return (
    <AppShell
      showBack
      headerTitle="Check-In Guide"
      showNav={false}
      headerRightAction={
        <button className="text-primary font-medium text-sm">
          Help
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Header with booking info */}
        <div className="relative">
          <img
            src={campsite.images[0]}
            alt={campsite.name}
            className="w-full h-40 object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="success" className="mb-2">Confirmed</Badge>
            <h2 className="text-white font-bold text-lg drop-shadow-lg">
              {campsite.name}
            </h2>
            <p className="text-white/80 text-sm drop-shadow">
              Booking #{bookingDetail.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Arrival Times */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Arrival Times
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="login" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Check-in</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {instructions.checkInTime}
                  </p>
                  <p className="text-xs text-slate-400">Onwards</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Icon name="logout" size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Check-out</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {instructions.checkOutTime}
                  </p>
                  <p className="text-xs text-slate-400">Latest</p>
                </div>
              </div>
            </div>
          </div>

          {/* Access Instructions */}
          {(instructions.accessCode || instructions.gateCode) && (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Access Instructions
              </h3>
              <div className="flex items-start gap-3 mb-4">
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Icon name="key" size={20} className="text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Keybox Access
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    The keybox is located on the wooden post right of the main gate.
                  </p>
                </div>
              </div>
              {instructions.accessCode && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Entry Code</p>
                    <p className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                      {instructions.accessCode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(instructions.accessCode!)}
                  >
                    Copy
                  </Button>
                </div>
              )}
              {instructions.gateCode && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mt-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Gate Code</p>
                    <p className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                      {instructions.gateCode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(instructions.gateCode!)}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Site Essentials */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Site Essentials
            </h3>
            <div className="space-y-3">
              {instructions.wifiName && (
                <div className="flex items-center gap-3">
                  <Icon name="wifi" size={20} className="text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">WiFi</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {instructions.wifiName}
                    </p>
                    {instructions.wifiPassword && (
                      <p className="text-sm text-slate-500">
                        Password: <span className="font-mono">{instructions.wifiPassword}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
              {instructions.rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon name="info" size={20} className="text-slate-400 mt-0.5" />
                  <p className="text-slate-600 dark:text-slate-400">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Getting There */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Getting There
            </h3>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl h-32 flex items-center justify-center mb-3">
              <Icon name="map" size={48} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {instructions.directions}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              <Icon name="location_on" size={16} className="inline mr-1" />
              {campsite.location.address}
            </p>
            <Button
              variant="outline"
              className="w-full"
              leftIcon="directions"
              onClick={openMaps}
            >
              Get Directions
            </Button>
          </div>

          {/* Host Contact */}
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            leftIcon="call"
            onClick={() => window.open(`tel:${instructions.hostContact.phone}`)}
          >
            Call Host for Help
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
