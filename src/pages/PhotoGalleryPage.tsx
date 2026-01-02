import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PhotoGallery from '../components/ui/PhotoGallery'
import { campsitesApi } from '../lib/api/campsites'

export default function PhotoGalleryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCampsite() {
      if (!id) return

      try {
        const data = await campsitesApi.getById(id)
        setImages(data.images)
        setTitle(data.name)
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Campsite not found</p>
      </div>
    )
  }

  return (
    <PhotoGallery
      images={images}
      title={title}
      onClose={() => navigate(`/campsite/${id}`)}
    />
  )
}
