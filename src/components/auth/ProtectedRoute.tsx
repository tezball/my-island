import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOwner?: boolean
}

export function ProtectedRoute({ children, requireOwner = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check owner role if required
  if (requireOwner && user?.role !== 'owner') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
