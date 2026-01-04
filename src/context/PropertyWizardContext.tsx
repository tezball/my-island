import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type {
  PropertyType,
  PropertyWizardState,
  AccommodationType,
  AccommodationConfig,
  Facility,
  WizardStepConfig,
  PropertyDraftRequest,
} from '@/data/types'
import {
  ACCOMMODATION_AMENITIES,
  ACCOMMODATION_DEFAULT_CAPACITY,
} from '@/data/types'

// ============================================
// Constants
// ============================================

const DRAFT_STORAGE_KEY = 'property-wizard-draft'
const DRAFT_DEBOUNCE_MS = 500

// Base steps that apply to all property types
const BASE_STEPS: WizardStepConfig[] = [
  { id: 'welcome', title: 'Welcome', isRequired: true, appliesTo: 'both' },
  { id: 'basic-info', title: 'Basic Info', isRequired: true, appliesTo: 'both' },
]

// Step for accommodation type selection (campsite only)
const ACCOMMODATION_TYPES_STEP: WizardStepConfig = {
  id: 'accommodation-types',
  title: 'Accommodation Types',
  isRequired: true,
  appliesTo: 'campsite',
}

// Configuration steps per accommodation type
const CONFIG_STEPS: Record<AccommodationType, WizardStepConfig> = {
  TENT: { id: 'configure-tent', title: 'Tent Pitches', isRequired: true, appliesTo: 'campsite' },
  RV: { id: 'configure-rv', title: 'RV Pitches', isRequired: true, appliesTo: 'campsite' },
  MOBILE_HOME: { id: 'configure-mobile-home', title: 'Mobile Homes', isRequired: true, appliesTo: 'campsite' },
  GLAMPING: { id: 'configure-glamping', title: 'Glamping Pods', isRequired: true, appliesTo: 'campsite' },
  CABIN: { id: 'configure-cabin', title: 'Cabins', isRequired: true, appliesTo: 'campsite' },
  APARTMENT: { id: 'configure-apartment', title: 'Apartments', isRequired: true, appliesTo: 'campsite' },
  BED_AND_BREAKFAST: { id: 'configure-bnb-rooms', title: 'B&B Rooms', isRequired: true, appliesTo: 'bnb' },
}

// Final review step
const REVIEW_STEP: WizardStepConfig = {
  id: 'review',
  title: 'Review',
  isRequired: true,
  appliesTo: 'both',
}

// ============================================
// Initial State
// ============================================

const initialState: PropertyWizardState = {
  // Flow control
  propertyType: null,
  currentStepIndex: 0,
  completedStepIds: [],

  // Basic info
  name: '',
  description: '',
  address: '',
  county: '',
  lat: 53.3498, // Default to Dublin
  lng: -6.2603,
  images: [],
  facilities: [],

  // Accommodation selection
  selectedAccommodationTypes: [],
  accommodationConfigs: {},

  // Draft management
  isDraft: true,
  draftId: null,
  lastSaved: null,

  // Submission state
  isSubmitting: false,
  error: null,
}

// ============================================
// Actions
// ============================================

type WizardAction =
  | { type: 'SET_PROPERTY_TYPE'; propertyType: PropertyType }
  | { type: 'SET_STEP'; stepIndex: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'COMPLETE_STEP'; stepId: string }
  | { type: 'UPDATE_BASIC_INFO'; name: string; description: string }
  | { type: 'UPDATE_LOCATION'; address: string; county: string; lat: number; lng: number }
  | { type: 'UPDATE_FACILITIES'; facilities: Facility[] }
  | { type: 'UPDATE_IMAGES'; images: string[] }
  | { type: 'TOGGLE_ACCOMMODATION_TYPE'; accommodationType: AccommodationType }
  | { type: 'UPDATE_ACCOMMODATION_CONFIG'; accommodationType: AccommodationType; config: Partial<AccommodationConfig> }
  | { type: 'SET_DRAFT_ID'; draftId: string }
  | { type: 'SET_LAST_SAVED'; lastSaved: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'LOAD_DRAFT'; state: Partial<PropertyWizardState> }
  | { type: 'RESET' }

// ============================================
// Reducer
// ============================================

function createDefaultConfig(type: AccommodationType): AccommodationConfig {
  return {
    type,
    quantity: 1,
    defaultCapacity: ACCOMMODATION_DEFAULT_CAPACITY[type],
    pricePerNight: 50,
    amenities: [...ACCOMMODATION_AMENITIES[type]],
    customAmenities: [],
  }
}

function wizardReducer(state: PropertyWizardState, action: WizardAction): PropertyWizardState {
  switch (action.type) {
    case 'SET_PROPERTY_TYPE':
      return {
        ...state,
        propertyType: action.propertyType,
        // Reset accommodation selections when property type changes
        selectedAccommodationTypes: action.propertyType === 'bnb' ? ['BED_AND_BREAKFAST'] : [],
        accommodationConfigs: action.propertyType === 'bnb'
          ? { BED_AND_BREAKFAST: createDefaultConfig('BED_AND_BREAKFAST') }
          : {},
      }

    case 'SET_STEP':
      return { ...state, currentStepIndex: action.stepIndex }

    case 'NEXT_STEP':
      return { ...state, currentStepIndex: state.currentStepIndex + 1 }

    case 'PREV_STEP':
      return { ...state, currentStepIndex: Math.max(0, state.currentStepIndex - 1) }

    case 'COMPLETE_STEP':
      if (state.completedStepIds.includes(action.stepId)) {
        return state
      }
      return { ...state, completedStepIds: [...state.completedStepIds, action.stepId] }

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

    case 'TOGGLE_ACCOMMODATION_TYPE': {
      const type = action.accommodationType
      const isSelected = state.selectedAccommodationTypes.includes(type)

      if (isSelected) {
        // Remove type and its config
        const newConfigs = { ...state.accommodationConfigs }
        delete newConfigs[type]
        return {
          ...state,
          selectedAccommodationTypes: state.selectedAccommodationTypes.filter((t) => t !== type),
          accommodationConfigs: newConfigs,
        }
      } else {
        // Add type with default config
        return {
          ...state,
          selectedAccommodationTypes: [...state.selectedAccommodationTypes, type],
          accommodationConfigs: {
            ...state.accommodationConfigs,
            [type]: createDefaultConfig(type),
          },
        }
      }
    }

    case 'UPDATE_ACCOMMODATION_CONFIG': {
      const existingConfig = state.accommodationConfigs[action.accommodationType]
      if (!existingConfig) return state

      return {
        ...state,
        accommodationConfigs: {
          ...state.accommodationConfigs,
          [action.accommodationType]: {
            ...existingConfig,
            ...action.config,
          },
        },
      }
    }

    case 'SET_DRAFT_ID':
      return { ...state, draftId: action.draftId }

    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.lastSaved }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting }

    case 'SET_ERROR':
      return { ...state, error: action.error }

    case 'LOAD_DRAFT': {
      // When loading draft, preserve default lat/lng if stored values are null
      const loadedState = { ...action.state }
      if (loadedState.lat === null) {
        loadedState.lat = initialState.lat
      }
      if (loadedState.lng === null) {
        loadedState.lng = initialState.lng
      }
      return { ...state, ...loadedState }
    }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

// ============================================
// Dynamic Step Computation
// ============================================

function computeSteps(state: PropertyWizardState): WizardStepConfig[] {
  const steps: WizardStepConfig[] = [...BASE_STEPS]

  if (state.propertyType === 'campsite') {
    // Add accommodation type selection step
    steps.push(ACCOMMODATION_TYPES_STEP)

    // Add config step for each selected accommodation type
    for (const type of state.selectedAccommodationTypes) {
      const configStep = CONFIG_STEPS[type]
      if (configStep) {
        steps.push(configStep)
      }
    }
  } else if (state.propertyType === 'bnb') {
    // B&B only needs the rooms configuration step
    steps.push(CONFIG_STEPS.BED_AND_BREAKFAST)
  }

  // Always end with review step
  steps.push(REVIEW_STEP)

  return steps
}

// ============================================
// Context
// ============================================

interface PropertyWizardContextType {
  state: PropertyWizardState
  dispatch: React.Dispatch<WizardAction>

  // Computed values
  steps: WizardStepConfig[]
  currentStep: WizardStepConfig | null
  totalSteps: number
  progress: number

  // Navigation helpers
  nextStep: () => void
  prevStep: () => void
  goToStep: (stepIndex: number) => void
  canProceed: () => boolean
  isFirstStep: boolean
  isLastStep: boolean

  // Data helpers
  setPropertyType: (type: PropertyType) => void
  toggleAccommodationType: (type: AccommodationType) => void
  updateAccommodationConfig: (type: AccommodationType, config: Partial<AccommodationConfig>) => void
  getTotalAccommodations: () => number

  // Draft helpers
  saveDraftToStorage: () => void
  loadDraftFromStorage: () => boolean
  clearDraft: () => void
}

const PropertyWizardContext = createContext<PropertyWizardContextType | undefined>(undefined)

// ============================================
// Provider
// ============================================

interface PropertyWizardProviderProps {
  children: ReactNode
  initialPropertyType?: PropertyType
}

export function PropertyWizardProvider({
  children,
  initialPropertyType,
}: PropertyWizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    propertyType: initialPropertyType ?? null,
    selectedAccommodationTypes: initialPropertyType === 'bnb' ? ['BED_AND_BREAKFAST'] : [],
    accommodationConfigs: initialPropertyType === 'bnb'
      ? { BED_AND_BREAKFAST: createDefaultConfig('BED_AND_BREAKFAST') }
      : {},
  })

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Compute dynamic steps
  const steps = computeSteps(state)
  const currentStep = steps[state.currentStepIndex] ?? null
  const totalSteps = steps.length
  const progress = totalSteps > 0 ? ((state.currentStepIndex + 1) / totalSteps) * 100 : 0
  const isFirstStep = state.currentStepIndex === 0
  const isLastStep = state.currentStepIndex === totalSteps - 1

  // ============================================
  // Draft Persistence
  // ============================================

  const saveDraftToStorage = useCallback(() => {
    try {
      const draftData: Partial<PropertyWizardState> = {
        propertyType: state.propertyType,
        name: state.name,
        description: state.description,
        address: state.address,
        county: state.county,
        lat: state.lat,
        lng: state.lng,
        images: state.images,
        facilities: state.facilities,
        selectedAccommodationTypes: state.selectedAccommodationTypes,
        accommodationConfigs: state.accommodationConfigs,
        currentStepIndex: state.currentStepIndex,
        completedStepIds: state.completedStepIds,
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData))
      dispatch({ type: 'SET_LAST_SAVED', lastSaved: new Date().toISOString() })
    } catch (error) {
      console.error('Failed to save draft to localStorage:', error)
    }
  }, [state])

  const loadDraftFromStorage = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (stored) {
        const draftData = JSON.parse(stored) as Partial<PropertyWizardState>
        dispatch({ type: 'LOAD_DRAFT', state: draftData })
        return true
      }
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error)
    }
    return false
  }, [])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      dispatch({ type: 'RESET' })
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error)
    }
  }, [])

  // Auto-save on state changes (debounced)
  useEffect(() => {
    // Don't save if we're on the welcome step or have no property type yet
    if (state.currentStepIndex === 0 || !state.propertyType) {
      return
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDraftToStorage()
    }, DRAFT_DEBOUNCE_MS)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [
    state.name,
    state.description,
    state.address,
    state.county,
    state.lat,
    state.lng,
    state.images,
    state.facilities,
    state.selectedAccommodationTypes,
    state.accommodationConfigs,
    state.currentStepIndex,
    state.propertyType,
    saveDraftToStorage,
  ])

  // ============================================
  // Navigation
  // ============================================

  const nextStep = useCallback(() => {
    if (currentStep) {
      dispatch({ type: 'COMPLETE_STEP', stepId: currentStep.id })
    }
    dispatch({ type: 'NEXT_STEP' })
  }, [currentStep])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      dispatch({ type: 'SET_STEP', stepIndex })
    }
  }, [steps.length])

  // ============================================
  // Validation
  // ============================================

  const canProceed = useCallback((): boolean => {
    if (!currentStep) return false

    switch (currentStep.id) {
      case 'welcome':
        // Welcome step always allows proceeding
        return true

      case 'basic-info':
        // Require name, address, county, and location
        return (
          state.name.trim().length >= 3 &&
          state.address.trim().length > 0 &&
          state.county.trim().length > 0 &&
          state.lat !== null &&
          state.lng !== null
        )

      case 'accommodation-types':
        // At least one accommodation type must be selected
        return state.selectedAccommodationTypes.length > 0

      case 'review':
        // Review step - check all data is valid
        return (
          state.name.trim().length >= 3 &&
          state.address.trim().length > 0 &&
          state.selectedAccommodationTypes.length > 0 &&
          Object.values(state.accommodationConfigs).every(
            (config) => config.quantity >= 1 && config.pricePerNight > 0
          )
        )

      default:
        // Configuration steps - validate the specific type's config
        const configType = currentStep.id.replace('configure-', '').toUpperCase().replace(/-/g, '_') as AccommodationType
        const config = state.accommodationConfigs[configType]
        if (!config) return true // If no config yet, allow proceeding

        return (
          config.quantity >= 1 &&
          config.defaultCapacity >= 1 &&
          config.pricePerNight > 0
        )
    }
  }, [currentStep, state])

  // ============================================
  // Data Helpers
  // ============================================

  const setPropertyType = useCallback((type: PropertyType) => {
    dispatch({ type: 'SET_PROPERTY_TYPE', propertyType: type })
  }, [])

  const toggleAccommodationType = useCallback((type: AccommodationType) => {
    dispatch({ type: 'TOGGLE_ACCOMMODATION_TYPE', accommodationType: type })
  }, [])

  const updateAccommodationConfig = useCallback(
    (type: AccommodationType, config: Partial<AccommodationConfig>) => {
      dispatch({ type: 'UPDATE_ACCOMMODATION_CONFIG', accommodationType: type, config })
    },
    []
  )

  const getTotalAccommodations = useCallback((): number => {
    return Object.values(state.accommodationConfigs).reduce(
      (sum, config) => sum + config.quantity,
      0
    )
  }, [state.accommodationConfigs])

  // ============================================
  // Context Value
  // ============================================

  const contextValue: PropertyWizardContextType = {
    state,
    dispatch,

    // Computed
    steps,
    currentStep,
    totalSteps,
    progress,

    // Navigation
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    isFirstStep,
    isLastStep,

    // Data
    setPropertyType,
    toggleAccommodationType,
    updateAccommodationConfig,
    getTotalAccommodations,

    // Draft
    saveDraftToStorage,
    loadDraftFromStorage,
    clearDraft,
  }

  return (
    <PropertyWizardContext.Provider value={contextValue}>
      {children}
    </PropertyWizardContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function usePropertyWizard() {
  const context = useContext(PropertyWizardContext)
  if (context === undefined) {
    throw new Error('usePropertyWizard must be used within a PropertyWizardProvider')
  }
  return context
}

// ============================================
// Utility: Convert state to API request
// ============================================

export function stateToPropertyDraftRequest(state: PropertyWizardState): PropertyDraftRequest {
  return {
    propertyType: state.propertyType!,
    name: state.name || undefined,
    description: state.description || undefined,
    location: state.address
      ? {
          address: state.address,
          county: state.county,
          lat: state.lat!,
          lng: state.lng!,
        }
      : undefined,
    images: state.images.length > 0 ? state.images : undefined,
    facilities: state.facilities.length > 0 ? state.facilities : undefined,
    selectedAccommodationTypes:
      state.selectedAccommodationTypes.length > 0
        ? state.selectedAccommodationTypes
        : undefined,
    accommodationConfigs:
      Object.keys(state.accommodationConfigs).length > 0
        ? state.accommodationConfigs
        : undefined,
  }
}

export default PropertyWizardContext
