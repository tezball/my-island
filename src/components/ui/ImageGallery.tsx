import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ImageGalleryProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function ImageGallery({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  if (!isOpen) return null

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Icon name="close" className="text-white text-[24px]" />
        </button>
        <span className="text-white font-medium">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Image */}
      <div className="h-full flex items-center justify-center p-4">
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm',
              'flex items-center justify-center hover:bg-white/20 transition-colors'
            )}
          >
            <Icon name="chevron_left" className="text-white text-[32px]" />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm',
              'flex items-center justify-center hover:bg-white/20 transition-colors'
            )}
          >
            <Icon name="chevron_right" className="text-white text-[32px]" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex gap-2 justify-center overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                  index === currentIndex
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
