import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Facility } from '../data/types'

export interface WizardLot {
  name: string
  type: 'tent' | 'caravan' | 'campervan' | 'glamping' | 'cabin'
  capacity: number
  pricePerNight: number
  amenities: string[]
}

interface WizardState {
  currentStep: number
  // Step 1: Basic Info
  name: string
  description: string
  // Step 2: Location
  address: string
  county: string
  lat: number | null
  lng: number | null
  // Step 3: Facilities
  facilities: Facility[]
  // Step 4: Photos
  images: string[]
  // Step 5: First Lot
  lot: WizardLot | null
  // Submission state
  isSubmitting: boolean
  error: string | null
}

type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_BASIC_INFO'; name: string; description: string }
  | { type: 'UPDATE_LOCATION'; address: string; county: string; lat: number; lng: number }
  | { type: 'UPDATE_FACILITIES'; facilities: Facility[] }
  | { type: 'UPDATE_IMAGES'; images: string[] }
  | { type: 'UPDATE_LOT'; lot: WizardLot }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' }

const initialState: WizardState = {
  currentStep: 0,
  name: '',
  description: '',
  address: '',
  county: '',
  lat: null,
  lng: null,
  facilities: [],
  images: [],
  lot: null,
  isSubmitting: false,
  error: null,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step }
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
    case 'UPDATE_BASIC_INFO':
      return { ...state, name: action.name, description: action.description }
    case 'UPDATE_LOCATION':
      return {
        ...state,
        address: action.address,
        county: action.county,
        lat: action.lat,
        lng: action.lng,
      }
    case 'UPDATE_FACILITIES':
      return { ...state, facilities: action.facilities }
    case 'UPDATE_IMAGES':
      return { ...state, images: action.images }
    case 'UPDATE_LOT':
      return { ...state, lot: action.lot }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface CampsiteWizardContextType {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  // Helper methods
  nextStep: () => void
  prevStep: () => void
  canProceed: () => boolean
}

const CampsiteWizardContext = createContext<CampsiteWizardContextType | undefined>(undefined)

export function CampsiteWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)

  const nextStep = () => dispatch({ type: 'NEXT_STEP' })
  const prevStep = () => dispatch({ type: 'PREV_STEP' })

  // Validate each step before allowing to proceed
  const canProceed = (): boolean => {
    switch (state.currentStep) {
      case 0: // Basic Info
        return state.name.trim().length >= 3
      case 1: // Location
        return (
          state.address.trim().length > 0 &&
          state.county.trim().length > 0 &&
          state.lat !== null &&
          state.lng !== null
        )
      case 2: // Facilities
        return true // Optional step
      case 3: // Photos
        return true // Optional step
      case 4: // First Lot
        return state.lot !== null && state.lot.name.trim().length > 0
      default:
        return false
    }
  }

  return (
    <CampsiteWizardContext.Provider value={{ state, dispatch, nextStep, prevStep, canProceed }}>
      {children}
    </CampsiteWizardContext.Provider>
  )
}

export function useCampsiteWizard() {
  const context = useContext(CampsiteWizardContext)
  if (context === undefined) {
    throw new Error('useCampsiteWizard must be used within a CampsiteWizardProvider')
  }
  return context
}

export default CampsiteWizardContext
