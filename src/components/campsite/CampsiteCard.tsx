import { Link } from 'react-router-dom'
import type { Campsite } from '@/types'
import { cn } from '@/utils/cn'
import { Icon, Rating, Badge } from '../ui'

interface CampsiteCardProps {
  campsite: Campsite
  isFavorite?: boolean
  onToggleFavorite?: () => void
  className?: string
}

export function CampsiteCard({
  campsite,
  isFavorite = false,
  onToggleFavorite,
  className,
}: CampsiteCardProps) {
  return (
    <Link
      to={`/campsite/${campsite.id}`}
      className={cn(
        'block bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card',
        'border border-gray-100 dark:border-white/5 transition-shadow hover:shadow-float',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <img
          src={campsite.imageUrl}
          alt={campsite.name}
          className="w-full h-full object-cover"
        />
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorite?.()
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Icon
            name="favorite"
            filled={isFavorite}
            size="md"
            className={isFavorite ? 'text-red-500' : 'text-slate-400'}
          />
        </button>
        {/* Superhost Badge */}
        {campsite.isSuperhost && (
          <Badge variant="success" className="absolute top-3 left-3">
            Superhost
          </Badge>
        )}
        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background-dark/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
          <Icon name="location_on" size="sm" className="text-primary" />
          <span className="text-xs font-medium text-white tracking-wide">
            {campsite.location.split(',')[0]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white truncate">
          {campsite.name}
        </h3>
        <Rating value={campsite.rating} reviewCount={campsite.reviewCount} size="sm" />

        {/* Facilities */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {campsite.facilities.slice(0, 4).map((facility) => (
            <span
              key={facility.id}
              className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <Icon name={facility.icon} size="sm" className="text-primary" />
              <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {facility.name}
              </span>
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">per night</span>
          <span className="text-lg font-bold text-primary">
            €{campsite.pricePerNight}
          </span>
        </div>
      </div>
    </Link>
  )
}
