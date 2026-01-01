import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function SetNewPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
  ]

  const allRequirementsMet = requirements.every(r => r.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allRequirementsMet || !passwordsMatch) {
      setError('Please meet all password requirements')
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    navigate('/password-reset-success')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <Icon name="arrow_back" size={24} className="text-slate-900 dark:text-white" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Set New Password
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Create a strong password for your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              leftIcon="lock"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400"
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            leftIcon="lock"
            error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined}
          />

          {/* Password requirements */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Password Requirements
            </p>
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon
                  name={req.met ? 'check_circle' : 'radio_button_unchecked'}
                  size={18}
                  className={req.met ? 'text-emerald-500' : 'text-slate-300'}
                />
                <span className={`text-sm ${req.met ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
              <Icon name="error" size={18} className="text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!allRequirementsMet || !passwordsMatch}
            isLoading={isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  )
}
