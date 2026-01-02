import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import StarRating from '../components/ui/StarRating'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import { campsitesApi } from '../lib/api/campsites'
import { reviewsApi } from '../lib/api/reviews'

interface CampsiteInfo {
  name: string
  image: string
  location: string
}

export default function WriteReviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [campsite, setCampsite] = useState<CampsiteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [overallRating, setOverallRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    location: 0,
    value: 0,
    facilities: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchCampsite() {
      if (!id) return

      try {
        const data = await campsitesApi.getById(id)
        setCampsite({
          name: data.name,
          image: data.images[0] || '',
          location: data.location.county,
        })
      } catch (error) {
        console.error('Failed to fetch campsite:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampsite()
  }, [id])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Write Review" showNav={false}>
        <div className="flex-1 overflow-auto p-4">
          <div className="flex gap-3 mb-6">
            <Skeleton variant="rectangular" width={64} height={64} className="rounded-xl" />
            <div>
              <Skeleton variant="text" className="w-32 h-5 mb-2" />
              <Skeleton variant="text" className="w-20 h-4" />
            </div>
          </div>
          <Skeleton variant="rectangular" height={150} className="rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Write Review" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const handleSubmit = async () => {
    if (!id) return

    setIsSubmitting(true)
    try {
      await reviewsApi.create({
        campsiteId: id,
        rating: overallRating,
        title: 'Review',
        comment: content,
        categories: ratings,
      })
      navigate(`/campsite/${id}`, { replace: true })
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = overallRating > 0 && title.length >= 5 && content.length >= 20

  return (
    <AppShell showBack headerTitle="Write Review" showNav={false} showNotifications={false}>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Campsite Preview */}
          <div className="flex gap-3">
            <img
              src={campsite.image}
              alt={campsite.name}
              className="size-16 rounded-xl object-cover"
            />
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                {campsite.name}
              </h2>
              <p className="text-sm text-slate-500">{campsite.location}</p>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="text-center py-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-slate-500 mb-3">How was your overall experience?</p>
            <StarRating
              rating={overallRating}
              size={40}
              interactive
              onChange={setOverallRating}
            />
            <p className="text-sm text-slate-400 mt-2">
              {overallRating === 0 && 'Tap to rate'}
              {overallRating === 1 && 'Poor'}
              {overallRating === 2 && 'Fair'}
              {overallRating === 3 && 'Good'}
              {overallRating === 4 && 'Great'}
              {overallRating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Category Ratings */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Rate by Category
            </h3>
            <div className="space-y-4">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 capitalize">{key}</span>
                  <StarRating
                    rating={value}
                    size={24}
                    interactive
                    onChange={(r) => setRatings((prev) => ({ ...prev, [key]: r }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-slate-500 mb-1 block">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-slate-500 mb-1 block">Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={5}
              className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
            <p className="text-sm text-slate-400 mt-1">
              {content.length}/500 characters (minimum 20)
            </p>
          </div>

          {/* Add Photos */}
          <div>
            <label className="text-sm text-slate-500 mb-2 block">Add Photos (optional)</label>
            <button className="w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
              <Icon name="add_photo_alternate" size={32} className="text-slate-400" />
              <span className="text-sm text-slate-500">Tap to add photos</span>
            </button>
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              Review Guidelines
            </h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Be honest and helpful to other campers</li>
              <li>• Focus on your experience at this campsite</li>
              <li>• Avoid offensive language or personal attacks</li>
              <li>• Maximum 5 photos allowed</li>
            </ul>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!isValid}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </AppShell>
  )
}
