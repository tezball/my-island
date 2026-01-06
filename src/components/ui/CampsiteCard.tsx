import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Campsite } from '../../data/types'
import Icon from './Icon'
import { useFavorites } from '../../context/FavoritesContext'

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop'

interface CampsiteCardProps {
  campsite: Campsite
  variant?: 'default' | 'compact' | 'featured'
  showFavoriteButton?: boolean
}

export default function CampsiteCard({
  campsite,
  variant = 'default',
  showFavoriteButton = true,
}: CampsiteCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFav = isFavorite(campsite.id)
  const [imgError, setImgError] = useState(false)

  const imageUrl = (!imgError && campsite.images?.[0]) || PLACEHOLDER_IMAGE

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(campsite.id)
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/campsite/${campsite.id}`}
        className="flex gap-3 bg-white dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <img
          src={imageUrl}
          alt={campsite.name}
          className="size-20 rounded-lg object-cover flex-shrink-0"
          onError={() => setImgError(true)}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {campsite.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Icon name="location_on" size={14} />
            {campsite.location.county}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-sm">
              <Icon name="star" size={14} className="text-amber-500" filled />
              <span className="font-medium text-slate-900 dark:text-white">{campsite.rating}</span>
              <span className="text-slate-400">({campsite.reviewCount})</span>
            </div>
            <p className="text-sm font-semibold text-primary">
              €{campsite.pricePerNight}/night
            </p>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/campsite/${campsite.id}`}
        className="relative flex-shrink-0 w-72 rounded-2xl overflow-hidden shadow-lg"
      >
        <img
          src={imageUrl}
          alt={campsite.name}
          className="w-full h-48 object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 size-8 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Icon
              name="favorite"
              size={18}
              filled={isFav}
              className={isFav ? 'text-red-500' : 'text-slate-600'}
            />
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg">{campsite.name}</h3>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <Icon name="location_on" size={14} />
            {campsite.location.county}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-sm text-white">
              <Icon name="star" size={14} className="text-amber-400" filled />
              <span className="font-medium">{campsite.rating}</span>
              <span className="text-white/70">({campsite.reviewCount})</span>
            </div>
            <p className="text-white font-bold">
              €{campsite.pricePerNight}<span className="text-sm font-normal">/night</span>
            </p>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      to={`/campsite/${campsite.id}`}
      className="block bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={campsite.name}
          className="w-full h-44 object-cover"
          onError={() => setImgError(true)}
        />
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 size-9 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-sm"
          >
            <Icon
              name="favorite"
              size={20}
              filled={isFav}
              className={isFav ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}
            />
          </button>
        )}
        {campsite.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary rounded-full">
            <span className="text-xs font-bold text-slate-900">Featured</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate">
              {campsite.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Icon name="location_on" size={14} />
              {campsite.location.address}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Icon name="star" size={16} className="text-amber-500" filled />
            <span className="font-bold text-slate-900 dark:text-white">{campsite.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {campsite.facilities.slice(0, 4).map((facility) => (
            <span
              key={facility}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 capitalize"
            >
              {facility}
            </span>
          ))}
          {campsite.facilities.length > 4 && (
            <span className="text-xs text-slate-400">
              +{campsite.facilities.length - 4} more
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {campsite.reviewCount} reviews
          </p>
          <p className="font-bold text-slate-900 dark:text-white">
            €{campsite.pricePerNight}
            <span className="text-sm font-normal text-slate-500">/night</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
