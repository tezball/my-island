import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { favoritesApi, type FavoriteResponse } from '../lib/api/favorites'
import { campsitesApi } from '../lib/api/campsites'
import { useAuth } from './AuthContext'
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

// Map API response to Campsite type for backwards compatibility
function mapFavoriteToCompsite(fav: FavoriteResponse): Campsite {
  return {
    id: fav.campsiteId,
    name: fav.campsiteName,
    description: '',
    location: {
      address: fav.location,
      county: fav.location.split(',').pop()?.trim() || '',
      lat: 0,
      lng: 0,
    },
    images: [fav.campsiteImage],
    rating: fav.rating,
    reviewCount: 0,
    pricePerNight: fav.priceFrom,
    facilities: [],
    ownerId: '',
    lots: [],
    featured: false,
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [favoritesData, setFavoritesData] = useState<FavoriteResponse[]>([])
  const [localCampsites, setLocalCampsites] = useState<Campsite[]>([]) // Campsites fetched by ID when API unavailable
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load favorites from API if logged in, otherwise from localStorage
  useEffect(() => {
    async function loadFavorites() {
      setIsLoading(true)
      try {
        if (user) {
          // Fetch from API for logged-in users
          const data = await favoritesApi.list()
          setFavoritesData(data)
          setFavoriteIds(data.map(f => f.campsiteId))
        } else {
          // Fall back to localStorage for guests
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed)) {
              setFavoriteIds(parsed)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load favorites:', err)
        // Fall back to localStorage on API error
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setFavoriteIds(parsed)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadFavorites()
  }, [user])

  // Persist favorites to localStorage as backup
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
        setError(null)
      } catch (err) {
        console.error('Failed to save favorites:', err)
      }
    }
  }, [favoriteIds, isLoading])

  // Fetch campsite details when we have IDs but no API data (localStorage fallback)
  useEffect(() => {
    async function fetchCampsiteDetails() {
      if (isLoading || favoriteIds.length === 0) return
      if (favoritesData.length > 0) return // Already have API data

      // Fetch campsite details for IDs we have in localStorage
      const campsites: Campsite[] = []
      for (const id of favoriteIds) {
        try {
          const data = await campsitesApi.getById(id)
          campsites.push({
            id: data.id,
            name: data.name,
            description: data.description,
            location: data.location,
            images: data.images,
            rating: data.rating,
            reviewCount: data.reviewCount,
            pricePerNight: data.priceFrom,
            facilities: data.facilities.map(f => f.toLowerCase() as Campsite['facilities'][number]),
            ownerId: data.ownerId,
            lots: [],
            featured: data.featured,
          })
        } catch (err) {
          console.error(`Failed to fetch campsite ${id}:`, err)
        }
      }
      setLocalCampsites(campsites)
    }
    fetchCampsiteDetails()
  }, [favoriteIds, favoritesData.length, isLoading])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Get full campsite objects for favorites - prefer API data, fall back to locally fetched
  const favorites = favoritesData.length > 0
    ? favoritesData.map(mapFavoriteToCompsite)
    : localCampsites

  const isFavorite = useCallback(
    (campsiteId: string) => favoriteIds.includes(campsiteId),
    [favoriteIds]
  )

  const addFavorite = useCallback(async (campsiteId: string) => {
    if (favoriteIds.includes(campsiteId)) return

    // Optimistic update - this also saves to localStorage via the useEffect
    setFavoriteIds((prev) => [...prev, campsiteId])

    if (user) {
      try {
        await favoritesApi.add(campsiteId)
        // Refresh the full favorites list to get campsite details
        const data = await favoritesApi.list()
        setFavoritesData(data)
      } catch (err) {
        // Don't revert - localStorage backup keeps working
        // This allows favorites to work even when API is unavailable
        console.error('Failed to sync favorite to server:', err)
      }
    }
  }, [favoriteIds, user])

  const removeFavorite = useCallback(async (campsiteId: string) => {
    // Optimistic update - this also saves to localStorage via the useEffect
    setFavoriteIds((prev) => prev.filter((id) => id !== campsiteId))
    setFavoritesData((prev) => prev.filter((f) => f.campsiteId !== campsiteId))

    if (user) {
      try {
        await favoritesApi.remove(campsiteId)
      } catch (err) {
        // Don't revert - localStorage backup keeps working
        // This allows favorites to work even when API is unavailable
        console.error('Failed to sync favorite removal to server:', err)
      }
    }
  }, [user])

  const toggleFavorite = useCallback(async (campsiteId: string) => {
    if (favoriteIds.includes(campsiteId)) {
      await removeFavorite(campsiteId)
    } else {
      await addFavorite(campsiteId)
    }
  }, [favoriteIds, addFavorite, removeFavorite])

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
