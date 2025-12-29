import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '@/components/ui'
import { ImageGallery } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'

// Mock M12: Photo Gallery Page
const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
  'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
  'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
  'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
  'https://images.unsplash.com/photo-1487730116445-4e1f5364b69a?w=800',
  'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800',
]

type PhotoCategory = 'all' | 'campsite' | 'lots' | 'amenities' | 'surroundings'

export function PhotoGalleryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('all')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  const { data } = useQuery({
    queryKey: ['campsite', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/campsites/${id}`)
      return res.json()
    },
  })

  const campsiteName = data?.campsite?.name || 'Campsite'

  const categories: { id: PhotoCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: 'photo_library' },
    { id: 'campsite', label: 'Campsite', icon: 'camping' },
    { id: 'lots', label: 'Lots', icon: 'landscape' },
    { id: 'amenities', label: 'Amenities', icon: 'shower' },
    { id: 'surroundings', label: 'Area', icon: 'forest' },
  ]

  // Filter photos by category (mock - just returns all for now)
  const filteredPhotos = activeCategory === 'all'
    ? MOCK_PHOTOS
    : MOCK_PHOTOS.slice(0, Math.floor(Math.random() * 4) + 3)

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Photos</h1>
            <p className="text-sm text-gray-500">{campsiteName}</p>
          </div>
          <button className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Icon name="share" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat.id
                  ? 'bg-primary text-text-main'
                  : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
              )}
            >
              <Icon name={cat.icon} className="text-base" />
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Photo Grid */}
      <main className="flex-1 p-4">
        <p className="text-sm text-gray-500 mb-4">{filteredPhotos.length} photos</p>

        <div className="grid grid-cols-2 gap-2">
          {filteredPhotos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-xl group',
                idx === 0 && 'col-span-2 aspect-video'
              )}
            >
              <img
                src={photo}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Icon
                  name="zoom_in"
                  className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {idx === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                  <span className="text-xs font-medium text-white">Featured</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredPhotos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon name="photo_library" className="text-5xl text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 font-medium">No photos in this category</p>
          </div>
        )}
      </main>

      {/* Full Screen Gallery */}
      {selectedPhotoIndex !== null && (
        <ImageGallery
          images={filteredPhotos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  )
}
