import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { ownerApi, type CampsiteResponse } from '../lib/api/owner'
import { useAuth } from './AuthContext'

const PROPERTY_STORAGE_KEY = 'my-island-selected-property'

interface PropertyContextValue {
  campsites: CampsiteResponse[]
  selectedCampsiteId: string | 'all'
  selectedCampsite: CampsiteResponse | null
  setSelectedCampsiteId: (id: string | 'all') => void
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const PropertyContext = createContext<PropertyContextValue | undefined>(undefined)

interface PropertyProviderProps {
  children: ReactNode
}

export function PropertyProvider({ children }: PropertyProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const [campsites, setCampsites] = useState<CampsiteResponse[]>([])
  const [selectedCampsiteId, setSelectedCampsiteIdState] = useState<string | 'all'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch campsites when user is an authenticated owner
  const fetchCampsites = useCallback(async () => {
    if (!isAuthenticated || !user?.isOwner) {
      setCampsites([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await ownerApi.getMyCampsites()
      setCampsites(data)

      // Restore saved selection if valid
      const savedId = localStorage.getItem(PROPERTY_STORAGE_KEY)
      if (savedId && (savedId === 'all' || data.some(c => c.id === savedId))) {
        setSelectedCampsiteIdState(savedId as string | 'all')
      } else if (data.length === 1) {
        // Auto-select if only one property
        setSelectedCampsiteIdState(data[0].id)
      } else {
        setSelectedCampsiteIdState('all')
      }
    } catch (err) {
      console.error('Failed to fetch campsites:', err)
      setError('Failed to load properties')
      setCampsites([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.isOwner])

  useEffect(() => {
    fetchCampsites()
  }, [fetchCampsites])

  // Update selection and persist to localStorage
  const setSelectedCampsiteId = useCallback((id: string | 'all') => {
    setSelectedCampsiteIdState(id)
    localStorage.setItem(PROPERTY_STORAGE_KEY, id)
  }, [])

  // Get the currently selected campsite object
  const selectedCampsite = selectedCampsiteId === 'all'
    ? null
    : campsites.find(c => c.id === selectedCampsiteId) || null

  const value: PropertyContextValue = {
    campsites,
    selectedCampsiteId,
    selectedCampsite,
    setSelectedCampsiteId,
    isLoading,
    error,
    refetch: fetchCampsites,
  }

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  )
}

export function useProperty() {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider')
  }
  return context
}

export default PropertyContext
