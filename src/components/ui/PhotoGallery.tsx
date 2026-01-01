import { useState, useEffect, useCallback } from 'react'
import Icon from './Icon'

interface PhotoGalleryProps {
  images: string[]
  initialIndex?: number
  onClose: () => void
  title?: string
}

export default function PhotoGallery({
  images,
  initialIndex = 0,
  onClose,
  title,
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, onClose])

  // Touch handling for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrevious()
    }

    setTouchStart(null)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Photo',
          url: images[currentIndex],
        })
      } catch {
        // User cancelled or share failed
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onClose}
          className="size-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <Icon name="close" size={24} className="text-white" />
        </button>
        <div className="text-white text-center">
          {title && <p className="font-medium">{title}</p>}
          <p className="text-sm text-white/70">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
        <button
          onClick={handleShare}
          className="size-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <Icon name="share" size={24} className="text-white" />
        </button>
      </div>

      {/* Main image */}
      <div
        className="h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Icon name="chevron_left" size={32} className="text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Icon name="chevron_right" size={32} className="text-white" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all
                ${index === currentIndex
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-75'
                }
              `}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
