import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

const slides = [
  {
    id: 1,
    icon: 'explore',
    title: 'Discover Amazing Campsites',
    description: 'Find the perfect camping spot across Ireland. From coastal retreats to mountain hideaways.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
  },
  {
    id: 2,
    icon: 'calendar_today',
    title: 'Book with Confidence',
    description: 'Secure your spot instantly with verified hosts and transparent pricing. No hidden fees.',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
  },
  {
    id: 3,
    icon: 'favorite',
    title: 'Create Lasting Memories',
    description: 'Experience nature at its finest. Save your favorites and share adventures with friends.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      navigate('/')
    }
  }

  const handleSkip = () => {
    navigate('/')
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      {/* Skip Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-slate-500 text-sm font-medium"
        >
          Skip
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 relative">
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-surface-dark via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 pb-8">
        {/* Icon */}
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Icon name={slide.icon} size={32} className="text-primary" />
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
          {slide.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-xs mx-auto">
          {slide.description}
        </p>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" onClick={handleNext}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>

          {currentSlide === slides.length - 1 && (
            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-medium"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
