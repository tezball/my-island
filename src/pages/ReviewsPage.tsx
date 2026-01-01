import { useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import StarRating from '../components/ui/StarRating'
import Icon from '../components/ui/Icon'
import { getCampsiteById, getReviewsByCampsite } from '../data/mockData'

export default function ReviewsPage() {
  const { id } = useParams<{ id: string }>()
  const campsite = getCampsiteById(id || '')
  const reviews = getReviewsByCampsite(id || '')

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Reviews">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const avgRatings = {
    cleanliness: reviews.reduce((sum, r) => sum + r.categories.cleanliness, 0) / reviews.length || 0,
    location: reviews.reduce((sum, r) => sum + r.categories.location, 0) / reviews.length || 0,
    value: reviews.reduce((sum, r) => sum + r.categories.value, 0) / reviews.length || 0,
    facilities: reviews.reduce((sum, r) => sum + r.categories.facilities, 0) / reviews.length || 0,
  }

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
                {campsite.rating}
              </p>
              <StarRating rating={campsite.rating} size={16} />
              <p className="text-sm text-slate-500 mt-1">
                {reviews.length} reviews
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
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {review.userName}
                  </h3>
                  <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                </div>
                <StarRating rating={review.rating} size={16} />
              </div>

              <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                {review.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {review.content}
              </p>

              {review.photos.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {review.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Review photo ${i + 1}`}
                      className="size-20 rounded-lg object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

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
