import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOwner?: boolean
  requireSupplier?: boolean
}

/**
 * Route guard component that redirects unauthenticated users to login.
 * Optionally requires owner or supplier role for admin routes.
 */
export default function ProtectedRoute({ children, requireOwner = false, requireSupplier = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Check owner role if required
  if (requireOwner && !user?.isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
        <div className="text-center max-w-md">
          <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto flex items-center justify-center mb-6">
            <Icon name="block" size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            This area is only accessible to campsite owners. If you own a campsite, please register as an owner.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  // Check supplier role if required
  if (requireSupplier && !user?.isSupplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
        <div className="text-center max-w-md">
          <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto flex items-center justify-center mb-6">
            <Icon name="block" size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            This area is only accessible to suppliers. Please sign in with Apple to access the supplier portal.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
