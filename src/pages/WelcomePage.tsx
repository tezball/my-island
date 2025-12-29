import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'

export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-end p-6 pb-10 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Icon name="forest" className="text-background-dark text-[28px]" />
            </div>
            <span className="text-2xl font-bold text-white">my-island</span>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Welcome to
            <br />
            <span className="text-primary">my-island</span>
          </h1>
          <p className="text-slate-300 text-lg">
            Your gateway to unforgettable camping adventures. Discover, book, and explore the great outdoors.
          </p>
        </div>

        {/* Features */}
        <div className="flex gap-6 mb-8">
          <Feature icon="explore" label="Discover" />
          <Feature icon="calendar_month" label="Book" />
          <Feature icon="local_activity" label="Experience" />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button
            variant="ghost"
            className="w-full text-white hover:bg-white/10"
            size="lg"
            onClick={() => navigate('/login')}
          >
            I already have an account
          </Button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

function Feature({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
        <Icon name={icon} className="text-primary text-[24px]" />
      </div>
      <span className="text-xs font-medium text-slate-300">{label}</span>
    </div>
  )
}
