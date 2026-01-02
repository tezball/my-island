import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import StarRating from '../components/ui/StarRating'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import { campsitesApi } from '../lib/api/campsites'
import { reviewsApi, type ReviewResponse } from '../lib/api/reviews'

interface ReviewDisplay {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  createdAt: string
  helpfulCount: number
  categories: {
    cleanliness: number
    location: number
    value: number
    facilities: number
  }
}

function mapToReviewDisplay(r: ReviewResponse): ReviewDisplay {
  return {
    id: r.id,
    userName: r.user.name,
    userAvatar: r.user.avatar,
    rating: r.rating,
    title: '',
    content: r.comment,
    createdAt: r.createdAt,
    helpfulCount: r.helpfulCount,
    categories: {
      cleanliness: r.categories?.cleanliness ?? r.rating,
      location: r.categories?.location ?? r.rating,
      value: r.categories?.value ?? r.rating,
      facilities: r.categories?.facilities ?? r.rating,
    },
  }
}

export default function ReviewsPage() {
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [campsiteName, setCampsiteName] = useState('')
  const [campsiteRating, setCampsiteRating] = useState(0)
  const [reviews, setReviews] = useState<ReviewDisplay[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!id) return

      try {
        setIsLoading(true)
        const [campsiteData, reviewsData] = await Promise.all([
          campsitesApi.getById(id),
          reviewsApi.getByCampsite(id).catch(() => []),
        ])
        setCampsiteName(campsiteData.name)
        setCampsiteRating(campsiteData.rating)
        setReviews(reviewsData.map(mapToReviewDisplay))
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Reviews" showNotifications={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <Skeleton variant="rectangular" height={120} className="rounded-xl" />
          <Skeleton variant="rectangular" height={150} className="rounded-xl" />
          <Skeleton variant="rectangular" height={150} className="rounded-xl" />
        </div>
      </AppShell>
    )
  }

  if (!campsiteName) {
    return (
      <AppShell showBack headerTitle="Reviews">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const avgRatings = reviews.length > 0 ? {
    cleanliness: reviews.reduce((sum, r) => sum + r.categories.cleanliness, 0) / reviews.length,
    location: reviews.reduce((sum, r) => sum + r.categories.location, 0) / reviews.length,
    value: reviews.reduce((sum, r) => sum + r.categories.value, 0) / reviews.length,
    facilities: reviews.reduce((sum, r) => sum + r.categories.facilities, 0) / reviews.length,
  } : { cleanliness: 0, location: 0, value: 0, facilities: 0 }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <AppShell showBack headerTitle="Reviews" showNotifications={false}>
      <div className="flex-1 overflow-auto">
        {/* Summary */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">
                {campsiteRating}
              </p>
              <StarRating rating={campsiteRating} size={16} />
              <p className="text-sm text-slate-500 mt-1">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {Object.entries(avgRatings).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 w-20 capitalize">{key}</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-8">
                    {value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="p-4 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start gap-3 mb-3">
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <Icon name="person" size={24} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {review.userName}
                  </h3>
                  <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                </div>
                <StarRating rating={review.rating} size={16} />
              </div>

              {review.title && (
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  {review.title}
                </h4>
              )}
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {review.content}
              </p>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
                  <Icon name="thumb_up" size={16} />
                  Helpful ({review.helpfulCount})
                </button>
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
                  <Icon name="flag" size={16} />
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
