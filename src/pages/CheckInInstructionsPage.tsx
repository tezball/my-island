import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { apiFetch } from '@/utils/api'
import type { Booking } from '@/types'

// Mock M24: Check-In Instructions Page
export function CheckInInstructionsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings/${id}`)
      return res.json()
    },
  })

  const booking: Booking | undefined = data?.booking

  const checkInSteps = [
    {
      icon: 'schedule',
      title: 'Check-in Time',
      description: 'Arrive between 3:00 PM - 8:00 PM. Early check-in may be available upon request.',
    },
    {
      icon: 'location_on',
      title: 'Reception Location',
      description: 'Head to the main reception building at the campsite entrance. Look for the green welcome sign.',
    },
    {
      icon: 'badge',
      title: 'Identification',
      description: 'Please bring a valid ID and your booking confirmation (digital or printed).',
    },
    {
      icon: 'key',
      title: 'Get Your Keys',
      description: 'Collect your lot keys, facility access cards, and welcome pack from reception.',
    },
    {
      icon: 'directions_car',
      title: 'Find Your Lot',
      description: 'Follow the numbered signs to your assigned lot. Staff can assist if needed.',
    },
  ]

  const amenityCodes = [
    { name: 'WiFi Password', value: 'CAMP2024' },
    { name: 'Gate Code', value: '4567#' },
    { name: 'Shower Block', value: 'B12' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        title="Check-in Info"
        rightAction={
          <button className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
            <Icon name="share" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Booking Summary */}
        {booking && (
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
            <div
              className="w-14 h-14 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url('${booking.campsiteImage}')` }}
            />
            <div className="flex-1">
              <h3 className="font-bold text-sm">{booking.campsiteName}</h3>
              <p className="text-xs text-gray-500">
                {new Date(booking.checkIn).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="px-2 py-1 bg-primary/10 rounded-lg">
              <span className="text-xs font-bold text-primary">Confirmed</span>
            </div>
          </div>
        )}

        {/* Check-in Steps */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
            Check-in Steps
          </h3>

          <div className="space-y-4">
            {checkInSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={step.icon} className="text-primary text-xl" />
                  </div>
                  {idx < checkInSteps.length - 1 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Codes */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
            Access Codes
          </h3>

          <div className="space-y-3">
            {amenityCodes.map((code, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <span className="text-sm text-gray-500">{code.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm">{code.value}</span>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                    <Icon name="content_copy" className="text-gray-400 text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Icon name="emergency" className="text-red-500 text-xl mt-0.5" />
            <div>
              <h4 className="font-bold text-sm mb-1">Emergency Contact</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Available 24/7 for urgent matters
              </p>
              <a href="tel:+353871234567" className="text-sm font-bold text-red-600">
                +353 87 123 4567
              </a>
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <Icon name="map" className="text-4xl text-gray-400" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Get Directions</h4>
              <p className="text-xs text-gray-500">Open in Maps app</p>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="directions" className="mr-1" />
              Navigate
            </Button>
          </div>
        </div>

        {/* Contact Host */}
        <button
          onClick={() => navigate(`/booking/${id}/contact`)}
          className="w-full flex items-center justify-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors"
        >
          <Icon name="chat" className="text-primary" />
          <span className="font-medium">Contact Host</span>
        </button>
      </div>
    </div>
  )
}
