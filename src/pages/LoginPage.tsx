import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button, Input, Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="my-island" showBack={false} />

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pb-8">
        {/* Hero Image */}
        <div className="mt-2 mb-6 relative group overflow-hidden rounded-2xl aspect-[16/9] shadow-soft">
          <div className="absolute inset-0 bg-black/10 z-10" />
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800')",
            }}
          />
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-background-dark/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <Icon name="location_on" size="sm" className="text-primary" />
            <span className="text-xs font-medium text-white tracking-wide">
              Connemara, Ireland
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome back
            <br />
            to camp.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Enter your details to access your dashboard.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="camp@my-island.com"
            leftIcon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility' : 'visibility_off'}
              onRightIconClick={() => setShowPassword(!showPassword)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            rightIcon="arrow_forward"
          >
            Log In
          </Button>

          {/* Face ID Option */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors group"
            >
              <Icon
                name="face"
                size="xl"
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-medium">Face ID</span>
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.0003 20.45c-2.43 0-4.66-.96-6.27-2.52l-2.07 2.07c2.18 2.18 5.25 3.55 8.34 3.55 6.09 0 11.23-4.52 11.91-10.45H12.0003v4.09h7.02c-1.14 3.29-4.31 5.26-7.02 5.26z" fill="#34A853" />
              <path d="M23.9103 12.09c0-.68-.06-1.34-.17-1.98h-11.74v3.74h6.73c-.29 1.54-1.17 2.85-2.48 3.73l2.03 2.03c2.72-2.5 4.38-6.19 3.63-7.52z" fill="#4285F4" />
              <path d="M5.7302 6.57L3.6602 4.5C1.4802 6.68.1002 9.75.1002 13c0 1.25.21 2.45.58 3.58l2.95-1.46C3.2102 14.15 3.1002 13.09 3.1002 12c0-2.31.84-4.42 2.63-5.43z" fill="#FBBC05" />
              <path d="M12.0003 3.55c1.55 0 2.95.53 4.05 1.58l3.05-3.05C17.3403.74 14.8103 0 12.0003 0 6.6203 0 1.9903 3.09.5803 7.58l2.95 1.46c.86-3.23 3.82-5.49 8.47-5.49z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button variant="secondary" className="gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.75 3.37 1.74-2.92 1.63-2.38 5.76.54 7.02-.37 1.48-1.02 2.87-2.5 4.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Apple
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-6 bg-white dark:bg-surface-dark/50 border-t border-slate-100 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Don't have an account?
          </span>
          <a
            href="#"
            className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            Sign Up
          </a>
        </div>
      </footer>
    </div>
  )
}
