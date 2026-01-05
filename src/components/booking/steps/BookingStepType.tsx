import { useEffect } from 'react'
import { useBookingWizard } from '@/context/BookingWizardContext'
import LotTypeCard from '@/components/booking/LotTypeCard'
import Icon from '@/components/ui/Icon'

export default function BookingStepType() {
  const { state, setLotType, fetchLotTypes } = useBookingWizard()

  useEffect(() => {
    fetchLotTypes()
  }, [fetchLotTypes])

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-4">
        <Icon name="progress_activity" size={32} className="text-primary animate-spin mb-4" />
        <p className="text-slate-500">Loading accommodation types...</p>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-4">
        <Icon name="error" size={48} className="text-red-500 mb-4" />
        <p className="text-slate-900 dark:text-white font-semibold mb-2">
          Something went wrong
        </p>
        <p className="text-slate-500 text-center mb-4">{state.error}</p>
        <button
          type="button"
          onClick={fetchLotTypes}
          className="text-primary font-medium"
        >
          Try again
        </button>
      </div>
    )
  }

  const availableTypes = state.availableLotTypes.filter(lt => lt.availableCount > 0)
  const unavailableTypes = state.availableLotTypes.filter(lt => lt.availableCount === 0)

  return (
    <div className="p-4 pb-32">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Choose your accommodation
      </h2>
      <p className="text-slate-500 mb-6">
        Select the type of pitch or accommodation you prefer
      </p>

      {availableTypes.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="hotel" size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white font-semibold mb-2">
            No availability for these dates
          </p>
          <p className="text-slate-500">
            Try selecting different dates to see available options.
          </p>
        </div>
      ) : (
        <>
          {/* Available Types */}
          <div className="space-y-3 mb-6">
            {availableTypes.map((lt) => (
              <LotTypeCard
                key={lt.type}
                type={lt.type}
                totalCount={lt.totalCount}
                availableCount={lt.availableCount}
                minPrice={lt.minPrice}
                maxPrice={lt.maxPrice}
                maxCapacity={lt.maxCapacity}
                representativeImage={lt.representativeImage}
                isSelected={state.selectedLotType === lt.type}
                isAvailable={true}
                onSelect={() => setLotType(lt.type)}
              />
            ))}
          </div>

          {/* Unavailable Types */}
          {unavailableTypes.length > 0 && (
            <>
              <p className="text-sm text-slate-500 mb-3">
                Sold out for these dates:
              </p>
              <div className="space-y-3 opacity-60">
                {unavailableTypes.map((lt) => (
                  <LotTypeCard
                    key={lt.type}
                    type={lt.type}
                    totalCount={lt.totalCount}
                    availableCount={lt.availableCount}
                    minPrice={lt.minPrice}
                    maxPrice={lt.maxPrice}
                    maxCapacity={lt.maxCapacity}
                    representativeImage={lt.representativeImage}
                    isAvailable={false}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
