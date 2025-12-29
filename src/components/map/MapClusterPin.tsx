import { cn } from '@/utils/cn'

// Mock M10: Map Cluster Pin Component
interface MapClusterPinProps {
  count: number
  isSelected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function MapClusterPin({
  count,
  isSelected = false,
  onClick,
  size = 'md',
}: MapClusterPinProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full font-bold shadow-lg transition-all duration-200',
        sizeClasses[size],
        isSelected
          ? 'bg-primary-dark text-white scale-110 ring-4 ring-primary/30'
          : 'bg-primary text-text-main hover:scale-105'
      )}
    >
      {count}
    </button>
  )
}

// Single campsite pin
interface MapCampsitePinProps {
  price: number
  isSelected?: boolean
  isFavorite?: boolean
  onClick?: () => void
}

export function MapCampsitePin({
  price,
  isSelected = false,
  isFavorite = false,
  onClick,
}: MapCampsitePinProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-3 py-1.5 rounded-full font-bold text-sm shadow-lg transition-all duration-200',
        isSelected
          ? 'bg-text-main dark:bg-white text-white dark:text-text-main scale-110'
          : 'bg-white dark:bg-surface-dark text-text-main dark:text-white hover:scale-105'
      )}
    >
      €{price}
      {isFavorite && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-[8px]">❤</span>
        </span>
      )}
      {/* Pin tail */}
      <div
        className={cn(
          'absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0',
          'border-l-[6px] border-r-[6px] border-t-[8px] border-transparent',
          isSelected
            ? 'border-t-text-main dark:border-t-white'
            : 'border-t-white dark:border-t-surface-dark'
        )}
      />
    </button>
  )
}

// Preview card that shows on pin hover/click
interface MapPreviewCardProps {
  name: string
  imageUrl: string
  price: number
  rating: number
  reviewCount: number
  onClose?: () => void
  onViewDetails?: () => void
}

export function MapPreviewCard({
  name,
  imageUrl,
  price,
  rating,
  reviewCount,
  onClose,
  onViewDetails,
}: MapPreviewCardProps) {
  return (
    <div className="w-72 bg-white dark:bg-surface-dark rounded-2xl shadow-float overflow-hidden">
      {/* Image */}
      <div className="relative h-32">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          <span className="text-sm">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-sm mb-1 line-clamp-1">{name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{rating}</span>
          <span>({reviewCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">€{price}/night</span>
          <button
            onClick={onViewDetails}
            className="text-xs font-bold text-primary hover:underline"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}
