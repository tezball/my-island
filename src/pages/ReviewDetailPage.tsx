import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock: Review Detail Page (placeholder)
export function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock review data
  const review = {
    id,
    userName: 'Sarah M.',
    rating: 5,
    date: '2024-10-15',
    text: 'Absolutely beautiful campsite! The riverside spots are amazing and the facilities were very clean. The staff was incredibly helpful when we arrived late and made sure we were settled in comfortably. The hiking trails nearby were well-marked and offered stunning views. Would definitely come back again next summer!',
    highlights: ['Great Views', 'Clean Water', 'Quiet Area', 'Friendly Staff'],
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
    ],
    helpful: 12,
    campsite: {
      name: 'Emerald Bay Camp',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Review"
        rightAction={
          <button className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
            <Icon name="more_vert" />
          </button>
        }
      />

      <div className="flex-1 pb-8">
        {/* Campsite Info */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url('${review.campsite.image}')` }}
            />
            <div>
              <p className="text-xs text-gray-500">Review for</p>
              <p className="font-bold text-sm">{review.campsite.name}</p>
            </div>
          </div>
        </div>

        {/* Review Header */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {review.userName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{review.userName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="star"
                      filled={star <= review.rating}
                      className={cn(
                        'text-lg',
                        star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(review.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div className="px-4 py-4">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {review.text}
          </p>
        </div>

        {/* Highlights */}
        <div className="px-4 py-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Highlights
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Photos */}
        {review.photos.length > 0 && (
          <div className="px-4 py-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              Photos
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {review.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Icon name="thumb_up" className="text-xl" />
              <span className="text-sm font-medium">Helpful ({review.helpful})</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
              <Icon name="flag" className="text-xl" />
              <span className="text-sm font-medium">Report</span>
            </button>
          </div>
        </div>

        {/* Owner Response (placeholder) */}
        <div className="px-4 py-4">
          <div className="bg-gray-50 dark:bg-surface-dark rounded-xl p-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="storefront" className="text-background-dark text-sm" />
              </div>
              <div>
                <p className="font-bold text-sm">Owner Response</p>
                <p className="text-xs text-gray-500">October 16, 2024</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
              Thank you so much for your kind words, Sarah! We're thrilled you enjoyed your stay and hope to welcome you back soon. Happy camping!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
