import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { SupplierCategory } from '../data/types'

// Supplier category metadata for UI
export const SUPPLIER_CATEGORIES: { value: SupplierCategory; label: string; icon: string; description: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant', icon: 'restaurant', description: 'Full-service dining establishment' },
  { value: 'PUB', label: 'Pub', icon: 'sports_bar', description: 'Traditional Irish pub' },
  { value: 'FARM_SHOP', label: 'Farm Shop', icon: 'storefront', description: 'Local farm produce & goods' },
  { value: 'GROCERY', label: 'Grocery', icon: 'local_grocery_store', description: 'General grocery store' },
  { value: 'OUTDOOR_GEAR', label: 'Outdoor Gear', icon: 'hiking', description: 'Camping & outdoor equipment' },
  { value: 'KAYAK_RENTAL', label: 'Kayak Rental', icon: 'kayaking', description: 'Kayak & canoe rentals' },
  { value: 'BIKE_RENTAL', label: 'Bike Rental', icon: 'pedal_bike', description: 'Bicycle rentals' },
  { value: 'FISHING', label: 'Fishing', icon: 'phishing', description: 'Fishing supplies & guides' },
  { value: 'CONVENIENCE', label: 'Convenience', icon: 'local_convenience_store', description: 'Convenience store' },
]

interface WizardState {
  currentStep: number
  // Step 1: Business Info
  businessName: string
  description: string
  category: SupplierCategory | null
  // Step 2: Contact & Location
  location: string
  contactEmail: string
  phoneNumber: string
  eircode: string
  latitude: number | null
  longitude: number | null
  // Submission state
  isSubmitting: boolean
  error: string | null
}

type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_BUSINESS_INFO'; businessName: string; description: string; category: SupplierCategory | null }
  | { type: 'UPDATE_CONTACT_LOCATION'; location: string; contactEmail: string; phoneNumber: string; eircode: string; latitude: number | null; longitude: number | null }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' }

const initialState: WizardState = {
  currentStep: 0,
  businessName: '',
  description: '',
  category: null,
  location: '',
  contactEmail: '',
  phoneNumber: '',
  eircode: '',
  latitude: null,
  longitude: null,
  isSubmitting: false,
  error: null,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step }
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 1) }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
    case 'UPDATE_BUSINESS_INFO':
      return {
        ...state,
        businessName: action.businessName,
        description: action.description,
        category: action.category,
      }
    case 'UPDATE_CONTACT_LOCATION':
      return {
        ...state,
        location: action.location,
        contactEmail: action.contactEmail,
        phoneNumber: action.phoneNumber,
        eircode: action.eircode,
        latitude: action.latitude,
        longitude: action.longitude,
      }
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

interface SupplierWizardContextType {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  nextStep: () => void
  prevStep: () => void
  canProceed: () => boolean
}

const SupplierWizardContext = createContext<SupplierWizardContextType | undefined>(undefined)

export function SupplierWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)

  const nextStep = () => dispatch({ type: 'NEXT_STEP' })
  const prevStep = () => dispatch({ type: 'PREV_STEP' })

  const canProceed = (): boolean => {
    switch (state.currentStep) {
      case 0: // Business Info
        return (
          state.businessName.trim().length >= 2 &&
          state.businessName.length <= 255 &&
          state.description.trim().length >= 10 &&
          state.description.length <= 2000 &&
          state.category !== null
        )
      case 1: // Contact & Location
        return (
          state.location.trim().length > 0 &&
          state.contactEmail.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contactEmail)
        )
      default:
        return false
    }
  }

  return (
    <SupplierWizardContext.Provider
      value={{ state, dispatch, nextStep, prevStep, canProceed }}
    >
      {children}
    </SupplierWizardContext.Provider>
  )
}

export function useSupplierWizard() {
  const context = useContext(SupplierWizardContext)
  if (context === undefined) {
    throw new Error('useSupplierWizard must be used within a SupplierWizardProvider')
  }
  return context
}

export default SupplierWizardContext
