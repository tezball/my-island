import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Icon from '../../components/ui/Icon'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

interface Review {
  id: string
  guestName: string
  guestAvatar?: string
  rating: number
  comment: string
  createdAt: string
  campsiteName: string
  response?: string
  respondedAt?: string
}

export default function OwnerReviewsPage() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('all')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Mock reviews - would come from API
        await new Promise((resolve) => setTimeout(resolve, 500))
        setReviews([
          {
            id: '1',
            guestName: 'Sarah Murphy',
            rating: 5,
            comment: 'Absolutely beautiful location! The sunset views over the Atlantic were breathtaking. Will definitely be back.',
            createdAt: '2025-12-28T10:00:00Z',
            campsiteName: 'Clifden Coastal Glamping',
            response: 'Thank you so much Sarah! We loved having you and hope to see you again soon.',
            respondedAt: '2025-12-29T09:00:00Z',
          },
          {
            id: '2',
            guestName: 'Michael O\'Brien',
            rating: 4,
            comment: 'Great facilities and friendly staff. The only downside was the noise from the nearby road, but overall a wonderful stay.',
            createdAt: '2025-12-25T14:30:00Z',
            campsiteName: 'Clifden Coastal Glamping',
          },
          {
            id: '3',
            guestName: 'Emma Walsh',
            rating: 5,
            comment: 'Perfect glamping experience! The pod was cozy and well-equipped. The kids loved exploring the beach.',
            createdAt: '2025-12-20T08:15:00Z',
            campsiteName: 'Clifden Coastal Glamping',
            response: 'Thank you Emma! So glad the kids had a great time. See you next summer!',
            respondedAt: '2025-12-21T11:00:00Z',
          },
          {
            id: '4',
            guestName: 'Conor Kelly',
            rating: 3,
            comment: 'Location is great but the check-in process was a bit confusing. Could use clearer signage.',
            createdAt: '2025-12-15T16:45:00Z',
            campsiteName: 'Clifden Coastal Glamping',
          },
        ])
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') return !review.response
    if (filter === 'responded') return !!review.response
    return true
  })

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const pendingCount = reviews.filter((r) => !r.response).length

  const handleSubmitResponse = (reviewId: string) => {
    if (!responseText.trim()) return

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, response: responseText, respondedAt: new Date().toISOString() }
          : r
      )
    )
    setRespondingTo(null)
    setResponseText('')
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={16}
            className={star <= rating ? 'text-amber-400' : 'text-slate-300'}
            filled={star <= rating}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Reviews" showNav={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton variant="rectangular" height={80} className="rounded-2xl" />
            <Skeleton variant="rectangular" height={80} className="rounded-2xl" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={150} className="rounded-2xl" />
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="Reviews"
      showNav={false}
      headerRightAction={
        <button onClick={() => navigate('/owner/settings')}>
          <Icon name="settings" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Stats */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="star" size={24} className="text-amber-400" filled />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-slate-500">Average rating</p>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {pendingCount}
            </p>
            <p className="text-sm text-slate-500">Pending response</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'pending', 'responded'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab
                    ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'all' && 'All'}
                {tab === 'pending' && `Pending (${pendingCount})`}
                {tab === 'responded' && 'Responded'}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 pb-4 space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="rate_review" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">
                      {review.guestName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {review.guestName}
                    </h4>
                    <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  {review.comment}
                </p>

                {/* Response */}
                {review.response ? (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 ml-4 border-l-2 border-primary">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="reply" size={14} className="text-primary" />
                      <span className="text-xs font-medium text-slate-500">Your response</span>
                      <span className="text-xs text-slate-400">
                        {review.respondedAt && formatDate(review.respondedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {review.response}
                    </p>
                  </div>
                ) : respondingTo === review.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write a thoughtful response..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setRespondingTo(null)
                          setResponseText('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitResponse(review.id)}
                        disabled={!responseText.trim()}
                      >
                        Submit Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setRespondingTo(review.id)}
                    className="flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary-dark transition-colors mt-2"
                  >
                    <Icon name="reply" size={16} />
                    Respond
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
