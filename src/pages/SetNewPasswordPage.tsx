import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Icon } from '@/components/ui'

export function SetNewPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checks = {
    minLength: password.length >= 8,
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    matches: password === confirmPassword && password.length > 0,
  }

  const strengthLevel = Object.values(checks).filter(Boolean).length + (password.length > 0 ? 1 : 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checks.minLength || !checks.matches) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    navigate('/password-reset-success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark relative">
      {/* Header */}
      <div className="flex items-center px-4 py-4 pt-12 pb-2 justify-between sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Icon name="arrow_back_ios_new" />
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <Icon name="forest" className="text-background-dark text-sm" />
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-text-secondary">
              my-island
            </span>
          </div>
        </div>
        <div className="w-10" />
      </div>

      <main className="flex-1 flex flex-col px-6 pb-8 max-w-md mx-auto w-full">
        {/* Headline */}
        <div className="mt-4 mb-2">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">
            Set New Password
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-text-secondary dark:text-gray-400 text-base leading-relaxed">
            Create a strong password to secure your account. Your new password must be different from previously used passwords.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            leftIcon="lock"
            rightIcon={showPassword ? 'visibility' : 'visibility_off'}
            onRightIconClick={() => setShowPassword(!showPassword)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
            leftIcon="lock_reset"
            rightIcon={showConfirmPassword ? 'visibility' : 'visibility_off'}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Password Requirements */}
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 mt-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
              Password Strength
            </p>

            {/* Strength Meter */}
            <div className="flex gap-1 h-1.5 mb-4">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-1/4 rounded-full transition-colors ${
                    level <= strengthLevel ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <CheckItem checked={checks.minLength} label="At least 8 characters" />
              <CheckItem checked={checks.hasSpecial} label="Contains a special character" />
              <CheckItem checked={checks.matches} label="Passwords match" />
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              rightIcon="arrow_forward"
              isLoading={isLoading}
              disabled={!checks.minLength || !checks.matches}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </main>

      {/* Decorative Background */}
      <div className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none -z-10" />
    </div>
  )
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${checked ? 'text-text-secondary dark:text-gray-400' : 'text-slate-400 dark:text-slate-500'}`}>
      <Icon
        name={checked ? 'check_circle' : 'radio_button_unchecked'}
        className={`text-[18px] ${checked ? 'text-primary' : ''}`}
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
