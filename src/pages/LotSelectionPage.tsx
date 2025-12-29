import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'
import type { CampsiteLot } from '@/types'

// Mock M15: Lot Selection Page (P0 Critical)
export function LotSelectionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const { data, isLoading } = useQuery({
    queryKey: ['campsite', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/campsites/${id}`)
      return res.json()
    },
  })

  const lots: CampsiteLot[] = data?.campsite?.lots || []
  const campsiteName = data?.campsite?.name || 'Campsite'

  const handleSelectLot = (lotId: string) => {
    setSelectedLotId(lotId)
  }

  const handleContinue = () => {
    if (selectedLotId) {
      navigate(`/book/${id}/dates?lot=${selectedLotId}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Select a Lot</h1>
            <p className="text-sm text-gray-500">{campsiteName}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex-1 h-10 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2',
              viewMode === 'list'
                ? 'bg-primary text-text-main'
                : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
            )}
          >
            <Icon name="format_list_bulleted" className="text-lg" />
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              'flex-1 h-10 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2',
              viewMode === 'map'
                ? 'bg-primary text-text-main'
                : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
            )}
          >
            <Icon name="map" className="text-lg" />
            Map View
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        {viewMode === 'list' ? (
          <div className="p-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-100 dark:bg-surface-dark rounded-xl animate-pulse"
                />
              ))
            ) : (
              lots.map((lot) => (
                <button
                  key={lot.id}
                  onClick={() => handleSelectLot(lot.id)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all text-left',
                    selectedLotId === lot.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark hover:border-primary/50'
                  )}
                >
                  <div className="flex gap-4">
                    {/* Lot Image */}
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200')`,
                        }}
                      />
                    </div>

                    {/* Lot Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-sm">{lot.name}</h3>
                        {selectedLotId === lot.id && (
                          <Icon name="check_circle" filled className="text-primary text-xl" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Icon name="person" className="text-sm" />
                          {lot.maxGuests} guests
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="straighten" className="text-sm" />
                          {lot.size}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {lot.amenities?.slice(0, 3).map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-medium text-gray-600 dark:text-gray-400"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <span className="font-bold text-primary">
                          €{lot.pricePerNight}/night
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          /* Map View - Mock */
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <Icon name="map" className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">Interactive Lot Map</p>
                <p className="text-sm text-gray-400 mt-1">Coming Soon</p>
              </div>
            </div>

            {/* Mock lot pins */}
            <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              A1
            </div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              A2
            </div>
            <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-xs font-bold shadow-lg text-white">
              B1
            </div>
          </div>
        )}
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-white/5 p-4 pb-8 z-30">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              {selectedLotId ? (
                <>
                  <p className="text-sm text-gray-500">Selected lot</p>
                  <p className="font-bold">{lots.find((l) => l.id === selectedLotId)?.name}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Select a lot to continue</p>
              )}
            </div>
            {selectedLotId && (
              <p className="text-xl font-bold text-primary">
                €{lots.find((l) => l.id === selectedLotId)?.pricePerNight}/night
              </p>
            )}
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={!selectedLotId}
            onClick={handleContinue}
          >
            Continue to Dates
          </Button>
        </div>
      </div>
    </div>
  )
}
