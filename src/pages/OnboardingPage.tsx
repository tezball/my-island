import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'

const slides = [
  {
    icon: 'explore',
    title: 'Discover Amazing Campsites',
    description: 'Find the perfect camping spot from thousands of locations across the country.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
  },
  {
    icon: 'calendar_month',
    title: 'Book with Ease',
    description: 'Simple booking process with instant confirmation. Reserve your spot in minutes.',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
  },
  {
    icon: 'local_activity',
    title: 'Local Experiences',
    description: 'Discover local food, activities, and gear rentals near your campsite.',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
  },
  {
    icon: 'favorite',
    title: 'Save Your Favorites',
    description: 'Create your wishlist of dream campsites and get notified about deals.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
  },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      navigate('/welcome')
    }
  }

  const handleSkip = () => {
    navigate('/welcome')
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto">
        {/* Image */}
        <div className="w-full aspect-square max-w-[280px] mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl" />
          <div
            className="relative w-full h-full rounded-3xl bg-cover bg-center shadow-xl"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          {/* Icon overlay */}
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Icon name={slide.icon} className="text-background-dark text-[32px]" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {slide.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            {slide.description}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 pb-10 max-w-md mx-auto w-full">
        <Button className="w-full" size="lg" onClick={handleNext} rightIcon="arrow_forward">
          {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
        </Button>
      </div>
    </div>
  )
}
