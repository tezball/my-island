import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'

/**
 * MOCK PAGE (M04)
 * Password Reset Success - shows after password is successfully reset
 */
export function PasswordResetSuccessPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 w-full max-w-md mx-auto">
        {/* Success Icon */}
        <div className="mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl dark:bg-primary/10" />
          <div className="relative flex items-center justify-center w-32 h-32 bg-primary rounded-full shadow-lg shadow-primary/30">
            <Icon name="check" className="text-background-dark text-[64px]" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-4">
          Password Reset!
        </h1>

        {/* Body */}
        <div className="max-w-[300px] mx-auto text-center space-y-4 mb-8">
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
        </div>

        {/* Action */}
        <div className="w-full">
          <Button
            className="w-full"
            size="lg"
            rightIcon="arrow_forward"
            onClick={() => navigate('/login')}
          >
            Continue to Login
          </Button>
        </div>
      </div>

      {/* Decorative */}
      <div className="h-32 w-full bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </div>
  )
}
