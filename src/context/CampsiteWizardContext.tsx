import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Facility, LotType } from '../data/types'

export type { LotType }

export interface LotBatch {
  id: string
  type: LotType
  count: number
  namePrefix: string
  capacity: number
  pricePerNight: number
  amenities: string[]
}

// Supported lot types for the wizard (subset of all LotType values)
export const WIZARD_LOT_TYPES: LotType[] = [
  'tent', 'caravan', 'campervan', 'glamping', 'cabin', 'yurt', 'pod', 'treehouse'
]

// Smart defaults per lot type
export const LOT_TYPE_DEFAULTS: Partial<Record<LotType, { capacity: number; amenities: string[] }>> = {
  tent: { capacity: 4, amenities: ['Fire Pit', 'Picnic Table'] },
  caravan: { capacity: 4, amenities: ['Electric Hookup', 'Water Hookup'] },
  campervan: { capacity: 2, amenities: ['Electric Hookup'] },
  glamping: { capacity: 2, amenities: ['Private Bathroom', 'Wi-Fi'] },
  cabin: { capacity: 4, amenities: ['Private Bathroom', 'Wi-Fi', 'BBQ Grill'] },
  yurt: { capacity: 4, amenities: ['Fire Pit'] },
  pod: { capacity: 2, amenities: ['Electric Hookup', 'Wi-Fi'] },
  treehouse: { capacity: 2, amenities: ['Wi-Fi'] },
}

export const LOT_TYPE_LABELS: Partial<Record<LotType, string>> = {
  tent: 'Tent Pitch',
  caravan: 'Caravan Bay',
  campervan: 'Campervan Spot',
  glamping: 'Glamping Unit',
  cabin: 'Cabin',
  yurt: 'Yurt',
  pod: 'Glamping Pod',
  treehouse: 'Treehouse',
}

interface WizardState {
  currentStep: number
  // Step 1: Property Details
  name: string
  description: string
  address: string
  county: string
  lat: number | null
  lng: number | null
  // Step 2: Facilities & Media
  facilities: Facility[]
  images: string[]
  // Step 3: Accommodations (batch lot creation)
  lotBatches: LotBatch[]
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
  | { type: 'ADD_LOT_BATCH'; batch: LotBatch }
  | { type: 'UPDATE_LOT_BATCH'; id: string; batch: Partial<LotBatch> }
  | { type: 'REMOVE_LOT_BATCH'; id: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' }

function createDefaultBatch(): LotBatch {
  const tentDefaults = LOT_TYPE_DEFAULTS.tent!
  return {
    id: crypto.randomUUID(),
    type: 'tent',
    count: 1,
    namePrefix: 'Pitch',
    capacity: tentDefaults.capacity,
    pricePerNight: 25,
    amenities: [...tentDefaults.amenities],
  }
}

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
  lotBatches: [createDefaultBatch()],
  isSubmitting: false,
  error: null,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step }
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 2) }
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
    case 'ADD_LOT_BATCH':
      return { ...state, lotBatches: [...state.lotBatches, action.batch] }
    case 'UPDATE_LOT_BATCH':
      return {
        ...state,
        lotBatches: state.lotBatches.map((batch) =>
          batch.id === action.id ? { ...batch, ...action.batch } : batch
        ),
      }
    case 'REMOVE_LOT_BATCH':
      return {
        ...state,
        lotBatches: state.lotBatches.filter((batch) => batch.id !== action.id),
      }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'RESET':
      return { ...initialState, lotBatches: [createDefaultBatch()] }
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
  addLotBatch: () => void
  removeLotBatch: (id: string) => void
  updateLotBatch: (id: string, updates: Partial<LotBatch>) => void
  getTotalLots: () => number
}

const CampsiteWizardContext = createContext<CampsiteWizardContextType | undefined>(undefined)

export function CampsiteWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)

  const nextStep = () => dispatch({ type: 'NEXT_STEP' })
  const prevStep = () => dispatch({ type: 'PREV_STEP' })

  const addLotBatch = () => {
    dispatch({ type: 'ADD_LOT_BATCH', batch: createDefaultBatch() })
  }

  const removeLotBatch = (id: string) => {
    dispatch({ type: 'REMOVE_LOT_BATCH', id })
  }

  const updateLotBatch = (id: string, updates: Partial<LotBatch>) => {
    dispatch({ type: 'UPDATE_LOT_BATCH', id, batch: updates })
  }

  const getTotalLots = () => {
    return state.lotBatches.reduce((sum, batch) => sum + batch.count, 0)
  }

  // Validate each step before allowing to proceed
  const canProceed = (): boolean => {
    switch (state.currentStep) {
      case 0: // Property Details
        return (
          state.name.trim().length >= 3 &&
          state.address.trim().length > 0 &&
          state.county.trim().length > 0 &&
          state.lat !== null &&
          state.lng !== null
        )
      case 1: // Facilities & Media
        return true // Optional step
      case 2: // Accommodations
        return (
          state.lotBatches.length > 0 &&
          state.lotBatches.every(
            (batch) =>
              batch.count >= 1 &&
              batch.namePrefix.trim().length > 0 &&
              batch.capacity >= 1 &&
              batch.pricePerNight > 0
          )
        )
      default:
        return false
    }
  }

  return (
    <CampsiteWizardContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        canProceed,
        addLotBatch,
        removeLotBatch,
        updateLotBatch,
        getTotalLots,
      }}
    >
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
