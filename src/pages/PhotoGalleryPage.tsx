import { useParams, useNavigate } from 'react-router-dom'
import PhotoGallery from '../components/ui/PhotoGallery'
import { getCampsiteById } from '../data/mockData'

export default function PhotoGalleryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const campsite = getCampsiteById(id || '')

  if (!campsite) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Campsite not found</p>
      </div>
    )
  }

  return (
    <PhotoGallery
      images={campsite.images}
      title={campsite.name}
      onClose={() => navigate(`/campsite/${id}`)}
    />
  )
}
