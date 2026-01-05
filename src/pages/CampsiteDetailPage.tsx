import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import StarRating from '../components/ui/StarRating'
import MapView from '../components/ui/MapView'
import Skeleton from '../components/ui/Skeleton'
import { campsitesApi, type CampsiteDetailResponse } from '../lib/api/campsites'
import { reviewsApi, type ReviewResponse } from '../lib/api/reviews'
import type { Campsite, Review, Facility } from '../data/types'
import { useFavorites } from '../context/FavoritesContext'

// Map API response to Campsite type
function mapToCampsite(data: CampsiteDetailResponse): Campsite {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    images: data.images,
    rating: data.rating,
    reviewCount: data.reviewCount,
    pricePerNight: data.priceFrom,
    facilities: data.facilities.map(f => f.toLowerCase() as Facility),
    ownerId: data.ownerId,
    lots: [],
    featured: data.featured,
  }
}

// Map API response to Review type
function mapToReview(data: ReviewResponse, campsiteId: string): Review {
  return {
    id: data.id,
    campsiteId,
    userId: data.user.id,
    userName: data.user.name,
    userAvatar: data.user.avatar,
    rating: data.rating,
    title: '',
    content: data.comment,
    photos: [],
    createdAt: data.createdAt,
    helpfulCount: data.helpfulCount,
    categories: {
      cleanliness: data.categories?.cleanliness ?? data.rating,
      location: data.categories?.location ?? data.rating,
      value: data.categories?.value ?? data.rating,
      facilities: data.categories?.facilities ?? data.rating,
    },
  }
}

const facilityIcons: Record<string, string> = {
  wifi: 'wifi',
  electric: 'bolt',
  water: 'water_drop',
  toilet: 'wc',
  shower: 'shower',
  laundry: 'local_laundry_service',
  shop: 'store',
  restaurant: 'restaurant',
  playground: 'sports_soccer',
  beach: 'beach_access',
  fishing: 'phishing',
  hiking: 'hiking',
  cycling: 'directions_bike',
  pets: 'pets',
}

type Section = 'overview' | 'reviews' | 'location'

export default function CampsiteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [campsite, setCampsite] = useState<Campsite | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const { isFavorite, toggleFavorite } = useFavorites()

  const overviewRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const isFav = isFavorite(id || '')

  // Fetch campsite data from API
  useEffect(() => {
    async function fetchData() {
      if (!id) return

      try {
        setIsLoading(true)
        const [campsiteData, reviewsData] = await Promise.all([
          campsitesApi.getById(id),
          reviewsApi.getByCampsite(id).catch(() => []), // Reviews may not exist yet
        ])

        setCampsite(mapToCampsite(campsiteData))
        setReviews(reviewsData.map(review => mapToReview(review, id)))
      } catch (error) {
        console.error('Failed to fetch campsite:', error)
        setCampsite(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const scrollToSection = (section: Section) => {
    setActiveSection(section)
    const refs = {
      overview: overviewRef,
      reviews: reviewsRef,
      location: locationRef,
    }
    refs[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (isLoading) {
    return (
      <AppShell showHeader={false} showNav={false}>
        <div className="flex-1 flex flex-col">
          {/* Image Skeleton */}
          <Skeleton variant="rectangular" className="w-full aspect-[4/3]" />

          {/* Content Skeleton */}
          <div className="flex-1 bg-background-light dark:bg-background-dark -mt-4 rounded-t-3xl p-5">
            <Skeleton variant="text" className="w-3/4 h-8 mb-2" />
            <Skeleton variant="text" className="w-1/2 h-5 mb-6" />

            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={80} className="rounded-xl" />
              ))}
            </div>

            <Skeleton variant="text" className="w-full h-4 mb-2" />
            <Skeleton variant="text" className="w-full h-4 mb-2" />
            <Skeleton variant="text" className="w-3/4 h-4 mb-6" />

            {/* Facilities Skeleton */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} variant="rectangular" height={60} className="rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Campsite">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'info' },
    { id: 'reviews', label: 'Reviews', icon: 'reviews' },
    { id: 'location', label: 'Location', icon: 'location_on' },
  ]

  return (
    <AppShell showHeader={false} showNav={false}>
      <div className="flex-1 flex flex-col">
        {/* Image Gallery */}
        <div className="relative">
          <Link to={`/campsite/${id}/photos`} className="block">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={campsite.images[currentImage]}
                alt={campsite.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Photo count badge */}
            <div className="absolute bottom-16 right-4 bg-black/60 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Icon name="photo_library" size={16} className="text-white" />
              <span className="text-white text-sm font-medium">{campsite.images.length}</span>
            </div>
          </Link>

          {/* Back & Home buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="size-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg flex items-center justify-center"
            >
              <Icon name="arrow_back" size={20} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="size-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg flex items-center justify-center"
            >
              <Icon name="home" size={20} />
            </button>
          </div>

          {/* Favorite & Share */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => toggleFavorite(id || '')}
              className="size-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg flex items-center justify-center"
            >
              <Icon
                name="favorite"
                size={20}
                filled={isFav}
                className={isFav ? 'text-red-500' : ''}
              />
            </button>
            <button className="size-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg flex items-center justify-center">
              <Icon name="share" size={20} />
            </button>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {campsite.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentImage(i)
                }}
                className={`size-2 rounded-full transition-colors ${
                  i === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-background-light dark:bg-background-dark -mt-4 rounded-t-3xl relative">
          {/* Section Navigation Tabs */}
          <div className="sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-slate-100 dark:border-slate-800 px-4 pt-4">
            <div className="flex overflow-x-auto gap-1 pb-3 scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon name={section.icon} size={16} />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-6">
            {/* SECTION: Overview */}
            <div ref={overviewRef} className="scroll-mt-20">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {campsite.name}
                  </h1>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                    <Icon name="star" size={16} className="text-amber-500" filled />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {campsite.rating}
                    </span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <Icon name="location_on" size={16} />
                  {campsite.location.address}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <Icon name="star" size={24} className="text-amber-500 mx-auto mb-1" filled />
                  <p className="font-bold text-slate-900 dark:text-white">{campsite.rating}</p>
                  <p className="text-xs text-slate-500">{campsite.reviewCount} reviews</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <Icon name="euro" size={24} className="text-emerald-500 mx-auto mb-1" />
                  <p className="font-bold text-slate-900 dark:text-white">€{campsite.pricePerNight}</p>
                  <p className="text-xs text-slate-500">per night</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-2">
                  About this campsite
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {campsite.description}
                </p>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-3">
                  Facilities & Amenities
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {campsite.facilities.map((facility) => (
                    <div
                      key={facility}
                      className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                    >
                      <Icon
                        name={facilityIcons[facility] || 'check'}
                        size={24}
                        className="text-primary"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 capitalize text-center">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700 my-8" />
            </div>

            {/* SECTION: Reviews */}
            <div ref={reviewsRef} className="scroll-mt-20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Guest Reviews
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={campsite.rating} size={16} />
                    <span className="text-sm text-slate-500">
                      {campsite.rating} • {campsite.reviewCount} reviews
                    </span>
                  </div>
                </div>
                <Link
                  to={`/campsite/${id}/reviews`}
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  See all
                  <Icon name="chevron_right" size={16} />
                </Link>
              </div>

              {/* Review Summary */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">4.9</p>
                    <p className="text-xs text-slate-500">Cleanliness</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">4.8</p>
                    <p className="text-xs text-slate-500">Location</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">4.7</p>
                    <p className="text-xs text-slate-500">Value</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">4.8</p>
                    <p className="text-xs text-slate-500">Facilities</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="size-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size={14} />
                          <span className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString('en-IE', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Write Review Button */}
              <Link
                to={`/campsite/${id}/review`}
                className="block w-full p-3 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors"
              >
                <Icon name="edit" size={18} className="inline mr-2" />
                Write a Review
              </Link>

              {/* Section Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700 my-8" />
            </div>

            {/* SECTION: Location */}
            <div ref={locationRef} className="scroll-mt-20">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Location & Directions
              </h2>
              {campsite.location.lat && campsite.location.lng ? (
                <MapView
                  markers={[{
                    id: campsite.id,
                    position: [campsite.location.lat, campsite.location.lng],
                    name: campsite.name,
                    price: campsite.pricePerNight,
                    type: 'campsite'
                  }]}
                  center={[campsite.location.lat, campsite.location.lng]}
                  zoom={14}
                  className="aspect-video mb-4"
                />
              ) : (
                <div className="aspect-video mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Icon name="map" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Map coordinates not available</p>
                  </div>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Icon name="location_on" size={24} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {campsite.location.address}
                    </p>
                    <p className="text-sm text-slate-500">Co. {campsite.location.county}, Ireland</p>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                leftIcon="directions"
                onClick={() => {
                  // Use coordinates for accurate pin placement, fall back to address search
                  if (campsite.location.lat && campsite.location.lng) {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${campsite.location.lat},${campsite.location.lng}`,
                      '_blank'
                    )
                  } else {
                    const address = encodeURIComponent(
                      `${campsite.location.address}, ${campsite.location.county}, Ireland`
                    )
                    window.open(`https://maps.google.com/?q=${address}`, '_blank')
                  }
                }}
              >
                Get Directions
              </Button>
            </div>
          </div>

          {/* Bottom spacing for fixed button */}
          <div className="h-28" />
        </div>

        {/* Fixed Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 px-5 py-4 safe-area-pb">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                €{campsite.pricePerNight}
                <span className="text-sm font-normal text-slate-500">/night</span>
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              rightIcon="arrow_forward"
              onClick={() => navigate(`/book/${id}/wizard`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
