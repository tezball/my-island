import type { LotType } from '@/data/types'
import Icon from '@/components/ui/Icon'
import Badge from '@/components/ui/Badge'

// Map lot types to display names
const LOT_TYPE_LABELS: Record<LotType, string> = {
  tent: 'Tent Pitch',
  caravan: 'Caravan',
  campervan: 'Campervan',
  rv: 'RV Site',
  glamping: 'Glamping Pod',
  cabin: 'Cabin',
  treehouse: 'Treehouse',
  yurt: 'Yurt',
  pod: 'Pod',
  apartment: 'Apartment',
  cottage: 'Cottage',
  safari_tent: 'Safari Tent',
}

// Map lot types to icons
const LOT_TYPE_ICONS: Record<LotType, string> = {
  tent: 'camping',
  caravan: 'rv_hookup',
  campervan: 'directions_car',
  rv: 'rv_hookup',
  glamping: 'holiday_village',
  cabin: 'cabin',
  treehouse: 'forest',
  yurt: 'home',
  pod: 'home',
  apartment: 'apartment',
  cottage: 'cottage',
  safari_tent: 'camping',
}

interface LotTypeCardProps {
  type: LotType
  totalCount: number
  availableCount: number
  minPrice: number
  maxPrice: number
  maxCapacity: number
  representativeImage: string
  isSelected?: boolean
  isAvailable?: boolean
  onSelect?: () => void
  className?: string
}

export default function LotTypeCard({
  type,
  totalCount: _totalCount,
  availableCount,
  minPrice,
  maxPrice,
  maxCapacity,
  representativeImage,
  isSelected = false,
  isAvailable = true,
  onSelect,
  className = '',
}: LotTypeCardProps) {
  const label = LOT_TYPE_LABELS[type] || type.replace(/_/g, ' ')
  const icon = LOT_TYPE_ICONS[type] || 'home'
  const hasAvailability = availableCount > 0

  const priceDisplay =
    minPrice === maxPrice
      ? `€${minPrice}/night`
      : `€${minPrice}-${maxPrice}/night`

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable || !hasAvailability}
      className={`
        w-full flex gap-3 p-3 rounded-xl border transition-all text-left
        ${isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark'
        }
        ${isAvailable && hasAvailability
          ? 'hover:border-primary/50 cursor-pointer'
          : 'opacity-50 cursor-not-allowed'
        }
        ${className}
      `}
    >
      {/* Image or Icon Fallback */}
      {representativeImage ? (
        <img
          src={representativeImage}
          alt={label}
          className="size-20 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="size-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={32} className="text-slate-400" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {label}
          </h3>
          <Badge
            variant={hasAvailability ? 'success' : 'error'}
            size="sm"
          >
            {hasAvailability ? `${availableCount} available` : 'Sold out'}
          </Badge>
        </div>

        <p className="text-sm text-slate-500 mt-0.5">
          Up to {maxCapacity} guests
        </p>

        <div className="flex items-center justify-between mt-2">
          <p className="text-primary font-bold">
            from {priceDisplay}
          </p>
          {isSelected && (
            <div className="flex items-center gap-1 text-primary text-sm font-medium">
              <Icon name="check_circle" size={16} />
              Selected
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
