import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type { LotType } from '@/data/types'
import { lotsApi, type LotTypeAggregation, type AutoAssignResponse } from '@/lib/api/lots'

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'booking-wizard-state'
const DEBOUNCE_MS = 500

// ============================================
// Types
// ============================================

export type BookingWizardStep = 'dates' | 'type' | 'guests' | 'extras' | 'payment'

export interface SelectedExtra {
  id: string
  name: string
  price: number
  quantity: number
}

export interface PriceBreakdown {
  nights: number
  nightlyRate: number
  accommodationTotal: number
  extrasTotal: number
  serviceFee: number
  total: number
}

export interface BookingWizardState {
  // Step tracking
  currentStep: BookingWizardStep
  completedSteps: BookingWizardStep[]

  // Campsite info
  campsiteId: string | null
  campsiteName: string | null
  campsiteImage: string | null

  // Step 1: Dates
  checkIn: Date | null
  checkOut: Date | null

  // Step 2: Lot Type
  selectedLotType: LotType | null
  availableLotTypes: LotTypeAggregation[]

  // Step 3: Guests
  adults: number
  children: number
  maxCapacity: number

  // Auto-assigned lot
  assignedLot: AutoAssignResponse | null

  // Step 4: Extras
  selectedExtras: SelectedExtra[]

  // Loading/error states
  isLoading: boolean
  error: string | null
}

// ============================================
// Initial State
// ============================================

const initialState: BookingWizardState = {
  currentStep: 'dates',
  completedSteps: [],

  campsiteId: null,
  campsiteName: null,
  campsiteImage: null,

  checkIn: null,
  checkOut: null,

  selectedLotType: null,
  availableLotTypes: [],

  adults: 2,
  children: 0,
  maxCapacity: 4,

  assignedLot: null,

  selectedExtras: [],

  isLoading: false,
  error: null,
}

// ============================================
// Actions
// ============================================

type WizardAction =
  | { type: 'SET_CAMPSITE'; payload: { id: string; name: string; image: string } }
  | { type: 'SET_DATES'; payload: { checkIn: Date; checkOut: Date } }
  | { type: 'SET_CHECK_IN'; payload: Date }
  | { type: 'SET_LOT_TYPE'; payload: LotType }
  | { type: 'SET_AVAILABLE_LOT_TYPES'; payload: LotTypeAggregation[] }
  | { type: 'SET_GUESTS'; payload: { adults: number; children: number } }
  | { type: 'SET_MAX_CAPACITY'; payload: number }
  | { type: 'SET_ASSIGNED_LOT'; payload: AutoAssignResponse }
  | { type: 'TOGGLE_EXTRA'; payload: SelectedExtra }
  | { type: 'UPDATE_EXTRA_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_STEP'; payload: BookingWizardStep }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'COMPLETE_STEP'; payload: BookingWizardStep }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_STATE'; payload: Partial<BookingWizardState> }
  | { type: 'RESET' }

// ============================================
// Step Order
// ============================================

const STEP_ORDER: BookingWizardStep[] = ['dates', 'type', 'guests', 'extras', 'payment']

function getStepIndex(step: BookingWizardStep): number {
  return STEP_ORDER.indexOf(step)
}

function getNextStep(current: BookingWizardStep): BookingWizardStep | null {
  const index = getStepIndex(current)
  return index < STEP_ORDER.length - 1 ? STEP_ORDER[index + 1] : null
}

function getPrevStep(current: BookingWizardStep): BookingWizardStep | null {
  const index = getStepIndex(current)
  return index > 0 ? STEP_ORDER[index - 1] : null
}

// ============================================
// Reducer
// ============================================

function wizardReducer(state: BookingWizardState, action: WizardAction): BookingWizardState {
  switch (action.type) {
    case 'SET_CAMPSITE':
      return {
        ...state,
        campsiteId: action.payload.id,
        campsiteName: action.payload.name,
        campsiteImage: action.payload.image,
      }

    case 'SET_DATES':
      return {
        ...state,
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
        // Reset lot selection when dates change
        selectedLotType: null,
        assignedLot: null,
      }

    case 'SET_CHECK_IN':
      return {
        ...state,
        checkIn: action.payload,
        checkOut: null, // Clear checkout when starting new selection
        selectedLotType: null,
        assignedLot: null,
      }

    case 'SET_LOT_TYPE': {
      const lotType = state.availableLotTypes.find(lt => lt.type === action.payload)
      return {
        ...state,
        selectedLotType: action.payload,
        maxCapacity: lotType?.maxCapacity ?? 4,
        assignedLot: null,
      }
    }

    case 'SET_AVAILABLE_LOT_TYPES':
      return {
        ...state,
        availableLotTypes: action.payload,
      }

    case 'SET_GUESTS': {
      const cappedAdults = Math.min(action.payload.adults, state.maxCapacity)
      const cappedChildren = Math.min(action.payload.children, state.maxCapacity - cappedAdults)
      return {
        ...state,
        adults: cappedAdults,
        children: cappedChildren,
      }
    }

    case 'SET_MAX_CAPACITY':
      return {
        ...state,
        maxCapacity: action.payload,
      }

    case 'SET_ASSIGNED_LOT':
      return {
        ...state,
        assignedLot: action.payload,
      }

    case 'TOGGLE_EXTRA': {
      const exists = state.selectedExtras.find(e => e.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          selectedExtras: state.selectedExtras.filter(e => e.id !== action.payload.id),
        }
      }
      return {
        ...state,
        selectedExtras: [...state.selectedExtras, action.payload],
      }
    }

    case 'UPDATE_EXTRA_QUANTITY':
      return {
        ...state,
        selectedExtras: state.selectedExtras.map(e =>
          e.id === action.payload.id ? { ...e, quantity: action.payload.quantity } : e
        ),
      }

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      }

    case 'NEXT_STEP': {
      const next = getNextStep(state.currentStep)
      if (!next) return state
      return {
        ...state,
        currentStep: next,
        completedSteps: state.completedSteps.includes(state.currentStep)
          ? state.completedSteps
          : [...state.completedSteps, state.currentStep],
      }
    }

    case 'PREV_STEP': {
      const prev = getPrevStep(state.currentStep)
      if (!prev) return state
      return {
        ...state,
        currentStep: prev,
      }
    }

    case 'COMPLETE_STEP':
      if (state.completedSteps.includes(action.payload)) {
        return state
      }
      return {
        ...state,
        completedSteps: [...state.completedSteps, action.payload],
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

// ============================================
// Context
// ============================================

interface BookingWizardContextType {
  state: BookingWizardState
  dispatch: React.Dispatch<WizardAction>

  // Navigation helpers
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: BookingWizardStep) => void
  canProceed: () => boolean

  // Step info
  currentStepIndex: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean

  // Computed values
  nights: number
  totalGuests: number
  priceBreakdown: PriceBreakdown | null

  // Actions
  setCampsite: (id: string, name: string, image: string) => void
  setDates: (checkIn: Date, checkOut: Date) => void
  setCheckIn: (date: Date) => void
  setLotType: (type: LotType) => void
  setGuests: (adults: number, children: number) => void
  toggleExtra: (extra: SelectedExtra) => void
  fetchLotTypes: () => Promise<void>
  autoAssignLot: () => Promise<void>
  reset: () => void
}

const BookingWizardContext = createContext<BookingWizardContextType | undefined>(undefined)

// ============================================
// Provider
// ============================================

interface BookingWizardProviderProps {
  children: ReactNode
  campsiteId?: string
  campsiteName?: string
  campsiteImage?: string
}

export function BookingWizardProvider({
  children,
  campsiteId,
  campsiteName,
  campsiteImage,
}: BookingWizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    campsiteId: campsiteId ?? null,
    campsiteName: campsiteName ?? null,
    campsiteImage: campsiteImage ?? null,
  })

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ============================================
  // Computed Values
  // ============================================

  const currentStepIndex = getStepIndex(state.currentStep)
  const totalSteps = STEP_ORDER.length
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === totalSteps - 1

  const nights =
    state.checkIn && state.checkOut
      ? Math.ceil((state.checkOut.getTime() - state.checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const totalGuests = state.adults + state.children

  const priceBreakdown: PriceBreakdown | null =
    state.assignedLot && nights > 0
      ? (() => {
          const nightlyRate = state.assignedLot.pricePerNight
          const accommodationTotal = nightlyRate * nights
          const extrasTotal = state.selectedExtras.reduce(
            (sum, e) => sum + e.price * e.quantity * nights,
            0
          )
          const serviceFee = (accommodationTotal + extrasTotal) * 0.05
          const total = accommodationTotal + extrasTotal + serviceFee
          return {
            nights,
            nightlyRate,
            accommodationTotal,
            extrasTotal,
            serviceFee,
            total,
          }
        })()
      : null

  // ============================================
  // Session Storage
  // ============================================

  const saveToStorage = useCallback(() => {
    try {
      const dataToSave = {
        campsiteId: state.campsiteId,
        campsiteName: state.campsiteName,
        campsiteImage: state.campsiteImage,
        checkIn: state.checkIn?.toISOString(),
        checkOut: state.checkOut?.toISOString(),
        selectedLotType: state.selectedLotType,
        adults: state.adults,
        children: state.children,
        selectedExtras: state.selectedExtras,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save booking wizard state:', error)
    }
  }, [state])

  const loadFromStorage = useCallback((): boolean => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            ...data,
            checkIn: data.checkIn ? new Date(data.checkIn) : null,
            checkOut: data.checkOut ? new Date(data.checkOut) : null,
          },
        })
        return true
      }
    } catch (error) {
      console.error('Failed to load booking wizard state:', error)
    }
    return false
  }, [])

  // Auto-save on state changes (debounced)
  useEffect(() => {
    if (!state.campsiteId) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToStorage()
    }, DEBOUNCE_MS)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state, saveToStorage])

  // Load from storage on mount
  useEffect(() => {
    if (!campsiteId) {
      loadFromStorage()
    }
  }, [campsiteId, loadFromStorage])

  // ============================================
  // Validation
  // ============================================

  const canProceed = useCallback((): boolean => {
    switch (state.currentStep) {
      case 'dates':
        return (
          state.checkIn !== null &&
          state.checkOut !== null &&
          state.checkOut > state.checkIn &&
          state.checkIn >= new Date(new Date().setHours(0, 0, 0, 0))
        )

      case 'type':
        return state.selectedLotType !== null

      case 'guests':
        return totalGuests >= 1 && totalGuests <= state.maxCapacity

      case 'extras':
        return true // Extras are optional

      case 'payment':
        return state.assignedLot !== null

      default:
        return false
    }
  }, [state, totalGuests])

  // ============================================
  // Navigation
  // ============================================

  const nextStep = useCallback(() => {
    if (canProceed()) {
      dispatch({ type: 'NEXT_STEP' })
    }
  }, [canProceed])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const goToStep = useCallback((step: BookingWizardStep) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }, [])

  // ============================================
  // Actions
  // ============================================

  const setCampsite = useCallback((id: string, name: string, image: string) => {
    dispatch({ type: 'SET_CAMPSITE', payload: { id, name, image } })
  }, [])

  const setDates = useCallback((checkIn: Date, checkOut: Date) => {
    dispatch({ type: 'SET_DATES', payload: { checkIn, checkOut } })
  }, [])

  const setCheckIn = useCallback((date: Date) => {
    dispatch({ type: 'SET_CHECK_IN', payload: date })
  }, [])

  const setLotType = useCallback((type: LotType) => {
    dispatch({ type: 'SET_LOT_TYPE', payload: type })
  }, [])

  const setGuests = useCallback((adults: number, children: number) => {
    dispatch({ type: 'SET_GUESTS', payload: { adults, children } })
  }, [])

  const toggleExtra = useCallback((extra: SelectedExtra) => {
    dispatch({ type: 'TOGGLE_EXTRA', payload: extra })
  }, [])

  const fetchLotTypes = useCallback(async () => {
    if (!state.campsiteId) return

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const lotTypes = await lotsApi.getLotTypes(state.campsiteId)
      dispatch({ type: 'SET_AVAILABLE_LOT_TYPES', payload: lotTypes })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load accommodation types' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.campsiteId])

  const autoAssignLot = useCallback(async () => {
    if (!state.campsiteId || !state.selectedLotType || !state.checkIn || !state.checkOut) {
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const assignedLot = await lotsApi.autoAssign({
        campsiteId: state.campsiteId,
        type: state.selectedLotType,
        checkIn: state.checkIn.toISOString().split('T')[0],
        checkOut: state.checkOut.toISOString().split('T')[0],
        guests: totalGuests,
      })
      dispatch({ type: 'SET_ASSIGNED_LOT', payload: assignedLot })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No availability for the selected dates. Please try different dates or accommodation type.',
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.campsiteId, state.selectedLotType, state.checkIn, state.checkOut, totalGuests])

  const reset = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'RESET' })
  }, [])

  // ============================================
  // Context Value
  // ============================================

  const contextValue: BookingWizardContextType = {
    state,
    dispatch,

    nextStep,
    prevStep,
    goToStep,
    canProceed,

    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,

    nights,
    totalGuests,
    priceBreakdown,

    setCampsite,
    setDates,
    setCheckIn,
    setLotType,
    setGuests,
    toggleExtra,
    fetchLotTypes,
    autoAssignLot,
    reset,
  }

  return (
    <BookingWizardContext.Provider value={contextValue}>
      {children}
    </BookingWizardContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useBookingWizard() {
  const context = useContext(BookingWizardContext)
  if (context === undefined) {
    throw new Error('useBookingWizard must be used within a BookingWizardProvider')
  }
  return context
}

export default BookingWizardContext
