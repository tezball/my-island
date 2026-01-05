import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import GuestCounter from '../components/ui/GuestCounter'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import BookingExpiredState from '../components/booking/BookingExpiredState'
import { campsitesApi } from '../lib/api/campsites'
import { extrasApi, type ExtraResponse } from '../lib/api/extras'

// Map common extra names to icons
function getExtraIcon(name: string): string {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('firewood') || lowerName.includes('fire')) return 'local_fire_department'
  if (lowerName.includes('breakfast') || lowerName.includes('meal')) return 'restaurant'
  if (lowerName.includes('kayak')) return 'kayaking'
  if (lowerName.includes('bike') || lowerName.includes('bicycle')) return 'pedal_bike'
  if (lowerName.includes('marshmallow')) return 'cake'
  if (lowerName.includes('canoe') || lowerName.includes('paddle')) return 'rowing'
  if (lowerName.includes('fish')) return 'phishing'
  if (lowerName.includes('bbq') || lowerName.includes('grill')) return 'outdoor_grill'
  if (lowerName.includes('wifi') || lowerName.includes('internet')) return 'wifi'
  if (lowerName.includes('parking')) return 'local_parking'
  if (lowerName.includes('pet') || lowerName.includes('dog')) return 'pets'
  return 'add_shopping_cart'
}

interface CampsiteInfo {
  name: string
  image: string
  pricePerNight: number
}

export default function GuestExtrasPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const { checkIn, checkOut } = (location.state as { checkIn?: string; checkOut?: string }) || {}

  const [campsite, setCampsite] = useState<CampsiteInfo | null>(null)
  const [extras, setExtras] = useState<ExtraResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [extrasLoading, setExtrasLoading] = useState(true)

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
      } catch (error) {
        console.error('Failed to fetch campsite:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampsite()
  }, [id])

  // Fetch extras from API
  useEffect(() => {
    async function fetchExtras() {
      if (!id) return

      try {
        const data = await extrasApi.getExtrasByCampsite(id)
        setExtras(data)
      } catch (error) {
        console.error('Failed to fetch extras:', error)
        setExtras([])
      } finally {
        setExtrasLoading(false)
      }
    }

    fetchExtras()
  }, [id])

  // If dates are missing, show expired state
  if (!checkIn || !checkOut) {
    return (
      <BookingExpiredState
        campsiteId={id}
        title="Booking dates missing"
        message="Please select your check-in and check-out dates to continue."
      />
    )
  }

  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [pets, setPets] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(e => e !== extraId)
        : [...prev, extraId]
    )
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const pricePerNight = campsite?.pricePerNight || 0
  const basePrice = nights * pricePerNight

  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find(e => e.id === extraId)
    if (!extra) return sum
    // If perNight, multiply by nights
    return sum + (extra.perNight ? extra.price * nights : extra.price)
  }, 0)

  const totalPrice = basePrice + extrasTotal

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Guests & Extras" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      </AppShell>
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Guests & Extras">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Guests & Extras" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Booking summary */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={campsite.image}
              alt={campsite.name}
              className="w-16 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{campsite.name}</p>
              <p className="text-sm text-slate-500">
                {checkIn && checkOut ? (
                  <>
                    {new Date(checkIn).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(checkOut).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })} ({nights} nights)
                  </>
                ) : (
                  'Dates not selected'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Who's Coming?
          </h3>
          <div className="space-y-4">
            <GuestCounter
              label="Adults"
              description="Ages 13 or above"
              value={adults}
              onChange={setAdults}
              min={1}
              max={10}
            />
            <GuestCounter
              label="Children"
              description="Ages 2-12"
              value={children}
              onChange={setChildren}
              min={0}
              max={6}
            />
            <GuestCounter
              label="Pets"
              description="Dogs, cats, etc."
              value={pets}
              onChange={setPets}
              min={0}
              max={3}
            />
          </div>
        </div>

        {/* Extras */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Add Extras
          </h3>
          {extrasLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : extras.length > 0 ? (
            <div className="space-y-3">
              {extras.map(extra => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                    selectedExtras.includes(extra.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon
                      name={getExtraIcon(extra.name)}
                      size={24}
                      className={selectedExtras.includes(extra.id) ? 'text-primary' : 'text-slate-400'}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${
                      selectedExtras.includes(extra.id)
                        ? 'text-primary'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {extra.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {extra.description || (extra.perNight ? 'Per night' : 'One-time charge')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      €{extra.price.toFixed(2)}{extra.perNight ? '/night' : ''}
                    </p>
                    {selectedExtras.includes(extra.id) && (
                      <Icon name="check_circle" size={20} className="text-primary ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Icon name="inventory_2" size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No extras available for this campsite.</p>
            </div>
          )}
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-500">
              {adults + children} guest{adults + children !== 1 ? 's' : ''}{pets > 0 ? `, ${pets} pet${pets !== 1 ? 's' : ''}` : ''}
            </p>
            {selectedExtras.length > 0 && (
              <p className="text-xs text-slate-400">
                +{selectedExtras.length} extra{selectedExtras.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            €{totalPrice.toFixed(2)}
          </span>
        </div>
        <Button
          className="w-full"
          onClick={() => navigate(`/book/${id}/payment`, {
            state: {
              checkIn,
              checkOut,
              guests: { adults, children, pets },
              extras: selectedExtras,
            }
          })}
        >
          Continue to Payment
        </Button>
      </div>
    </AppShell>
  )
}
