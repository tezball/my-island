import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { StarRating } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'
import type { Booking } from '@/types'

const HIGHLIGHTS = [
  { id: 'views', label: 'Great Views', icon: 'visibility' },
  { id: 'family', label: 'Family-Friendly', icon: 'family_restroom' },
  { id: 'clean', label: 'Clean Water', icon: 'water_drop' },
  { id: 'quiet', label: 'Quiet Area', icon: 'volume_off' },
  { id: 'signal', label: 'Good Signal', icon: 'wifi' },
  { id: 'facilities', label: 'Great Facilities', icon: 'shower' },
  { id: 'staff', label: 'Friendly Staff', icon: 'support_agent' },
  { id: 'location', label: 'Perfect Location', icon: 'location_on' },
]

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}

export function ReviewSubmissionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings/${id}`)
      return res.json()
    },
  })

  const booking: Booking | undefined = data?.booking

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
    'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
  ])

  const toggleHighlight = (highlightId: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(highlightId)
        ? prev.filter((h) => h !== highlightId)
        : [...prev, highlightId]
    )
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Would submit review via API
    navigate('/bookings')
  }

  const canSubmit = rating > 0

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 justify-between border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
        >
          <Icon name="close" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">Write a Review</h1>
        <div className="size-10" />
      </header>

      <div className="flex-1 pb-28">
        {/* Campsite Info */}
        {booking && (
          <div className="px-4 py-6 flex items-center gap-4">
            <div className="size-16 rounded-2xl overflow-hidden shrink-0 shadow-sm">
              <img
                src={booking.campsiteImage}
                alt={booking.campsiteName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-0.5">Rating</p>
              <h2 className="text-xl font-bold leading-tight">{booking.campsiteName}</h2>
            </div>
          </div>
        )}

        {/* Rating Section */}
        <section className="flex flex-col items-center justify-center px-4 py-4">
          <h3 className="text-2xl font-bold text-center mb-4">How was your stay?</h3>
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating > 0 && (
            <p className="mt-2 text-primary font-medium text-sm">
              {RATING_LABELS[rating]}
            </p>
          )}
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-4" />

        {/* Review Text Area */}
        <section className="px-4 py-2">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full min-h-[160px] rounded-3xl bg-gray-50 dark:bg-surface-dark border-0 p-5 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 resize-none transition-shadow"
            placeholder="Share your experience about this campsite... Was it quiet? How were the facilities?"
          />
        </section>

        {/* Highlights / Tags */}
        <section className="px-4 py-4">
          <h3 className="text-lg font-bold mb-4 px-1">What stood out?</h3>
          <div className="flex flex-wrap gap-2.5">
            {HIGHLIGHTS.map((highlight) => (
              <button
                key={highlight.id}
                onClick={() => toggleHighlight(highlight.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all active:scale-95',
                  selectedHighlights.includes(highlight.id)
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'bg-gray-100 dark:bg-surface-dark border border-transparent hover:border-primary/30 text-text-main dark:text-gray-300'
                )}
              >
                <Icon name={highlight.icon} className="text-lg" />
                {highlight.label}
              </button>
            ))}
          </div>
        </section>

        {/* Photo Upload */}
        <section className="px-4 py-4 mb-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold">Add Photos</h3>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {/* Add Button */}
            <button className="flex flex-col items-center justify-center size-24 shrink-0 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors group">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary mb-1 group-hover:scale-110 transition-transform">
                <Icon name="add_a_photo" className="text-xl" />
              </div>
              <span className="text-xs font-semibold text-primary">Add New</span>
            </button>

            {/* Uploaded Photos */}
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative size-24 shrink-0 group rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src={photo}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 size-6 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <Icon name="close" className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full h-14"
            size="lg"
            disabled={!canSubmit}
            onClick={handleSubmit}
            rightIcon="send"
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  )
}
