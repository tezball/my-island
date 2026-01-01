import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

const features = [
  { icon: 'camping', label: 'Camping' },
  { icon: 'notifications', label: 'Alerts' },
  { icon: 'map', label: 'Maps' },
]

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200)',
    }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Success icon */}
        <div className="size-20 rounded-full bg-primary flex items-center justify-center mb-8">
          <Icon name="check" size={48} className="text-white" />
        </div>

        {/* Welcome message */}
        <h1 className="text-3xl font-bold text-white text-center mb-3">
          Welcome to my-island
        </h1>
        <p className="text-white/80 text-center mb-8 max-w-sm">
          Your account has been successfully created. We're excited to help you find your next adventure.
        </p>

        {/* Feature icons */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {features.map(feature => (
            <div key={feature.icon} className="flex flex-col items-center gap-2">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon name={feature.icon} size={28} className="text-white" />
              </div>
              <span className="text-sm text-white/80">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full max-w-sm space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate('/')}
          >
            Start Exploring
          </Button>
          <button
            onClick={() => navigate('/profile/edit')}
            className="w-full py-3 text-white/80 hover:text-white font-medium transition-colors"
          >
            Complete Profile Later
          </button>
        </div>
      </div>
    </div>
  )
}
