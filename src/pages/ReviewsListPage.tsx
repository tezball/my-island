import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Rating } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'
import type { Campsite } from '@/types'

// Mock M11: Reviews List Page
interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  date: string
  text: string
  highlights: string[]
  photos?: string[]
  helpful: number
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    rating: 5,
    date: '2024-10-15',
    text: 'Absolutely beautiful campsite! The riverside spots are amazing and the facilities were very clean. Would definitely come back.',
    highlights: ['Great Views', 'Clean Water', 'Quiet Area'],
    photos: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200'],
    helpful: 12,
  },
  {
    id: '2',
    userName: 'Mike T.',
    rating: 4,
    date: '2024-10-10',
    text: 'Great location and friendly staff. The only downside was the wifi could be better, but who needs wifi when camping anyway!',
    highlights: ['Friendly Staff', 'Perfect Location'],
    helpful: 8,
  },
  {
    id: '3',
    userName: 'Emma L.',
    rating: 5,
    date: '2024-09-28',
    text: 'Perfect family getaway. Kids loved the playground and we enjoyed the peace and quiet in the evenings.',
    highlights: ['Family-Friendly', 'Quiet Area', 'Great Facilities'],
    photos: [
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=200',
    ],
    helpful: 15,
  },
]

type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1'

export function ReviewsListPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterOption>('all')

  const { data } = useQuery({
    queryKey: ['campsite', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/campsites/${id}`)
      return res.json()
    },
  })

  const campsite: Campsite | undefined = data?.campsite

  const filteredReviews =
    filter === 'all'
      ? MOCK_REVIEWS
      : MOCK_REVIEWS.filter((r) => r.rating === parseInt(filter))

  const averageRating =
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: MOCK_REVIEWS.filter((r) => r.rating === star).length,
    percentage: (MOCK_REVIEWS.filter((r) => r.rating === star).length / MOCK_REVIEWS.length) * 100,
  }))

  return (
    <AppShell>
      <TopAppBar
        showHome
        title="Reviews" />

      <div className="pb-28">
        {/* Rating Summary */}
        <div className="px-4 py-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4">
            <div className="flex items-start gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
                <div className="flex gap-0.5 justify-center my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="star"
                      filled={star <= Math.round(averageRating)}
                      className={cn(
                        'text-sm',
                        star <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{MOCK_REVIEWS.length} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 space-y-1.5">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{star}</span>
                    <Icon name="star" filled className="text-yellow-500 text-xs" />
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-6">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(['all', '5', '4', '3', '2', '1'] as FilterOption[]).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  filter === option
                    ? 'bg-primary text-text-main'
                    : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
                )}
              >
                {option === 'all' ? 'All' : `${option} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-surface-dark rounded-2xl p-4"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {review.userName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{review.userName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name="star"
                          filled={star <= review.rating}
                          className={cn(
                            'text-xs',
                            star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                {review.text}
              </p>

              {/* Highlights */}
              {review.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {review.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                  <Icon name="thumb_up" className="text-sm" />
                  Helpful ({review.helpful})
                </button>
                <button className="text-xs text-gray-400 hover:text-gray-600">
                  Report
                </button>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <Icon name="rate_review" className="text-5xl text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500">No reviews with this rating</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
