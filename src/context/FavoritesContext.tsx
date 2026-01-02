import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { campsites } from '../data/mockData'
import type { Campsite } from '../data/types'

interface FavoritesContextType {
  favoriteIds: string[]
  favorites: Campsite[]
  isLoading: boolean
  error: string | null
  isFavorite: (campsiteId: string) => boolean
  toggleFavorite: (campsiteId: string) => void
  addFavorite: (campsiteId: string) => void
  removeFavorite: (campsiteId: string) => void
  clearFavorites: () => void
  clearError: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'my-island-favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed)
        }
      }
    } catch (err) {
      console.error('Failed to load favorites:', err)
      setError('Failed to load your saved campsites. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Persist favorites to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
        setError(null) // Clear error on successful save
      } catch (err) {
        console.error('Failed to save favorites:', err)
        setError('Failed to save your favorites. Storage may be full.')
      }
    }
  }, [favoriteIds, isLoading])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Get full campsite objects for favorites
  const favorites = campsites.filter((c) => favoriteIds.includes(c.id))

  const isFavorite = useCallback(
    (campsiteId: string) => favoriteIds.includes(campsiteId),
    [favoriteIds]
  )

  const addFavorite = useCallback((campsiteId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(campsiteId)) return prev
      return [...prev, campsiteId]
    })
  }, [])

  const removeFavorite = useCallback((campsiteId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== campsiteId))
  }, [])

  const toggleFavorite = useCallback((campsiteId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(campsiteId)) {
        return prev.filter((id) => id !== campsiteId)
      }
      return [...prev, campsiteId]
    })
  }, [])

  const clearFavorites = useCallback(() => {
    setFavoriteIds([])
  }, [])

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favorites,
        isLoading,
        error,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
        clearError,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export default FavoritesContext
