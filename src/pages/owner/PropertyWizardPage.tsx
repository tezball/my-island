import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PropertyWizardProvider,
  usePropertyWizard,
} from '@/context/PropertyWizardContext'
import type { PropertyType } from '@/data/types'
import { DynamicWizardProgress } from '@/components/wizard/property/DynamicWizardProgress'
import { WizardStepWelcome } from '@/components/wizard/property/WizardStepWelcome'
import { WizardStepBasicInfo } from '@/components/wizard/property/WizardStepBasicInfo'
import { WizardStepReview } from '@/components/wizard/property/WizardStepReview'
import { WizardStepAccommodationTypes } from '@/components/wizard/property/campsite/WizardStepAccommodationTypes'
import { WizardStepConfigureTents } from '@/components/wizard/property/campsite/WizardStepConfigureTents'
import { WizardStepConfigureRV } from '@/components/wizard/property/campsite/WizardStepConfigureRV'
import { WizardStepConfigureGlamping } from '@/components/wizard/property/campsite/WizardStepConfigureGlamping'
import { WizardStepConfigureCabins } from '@/components/wizard/property/campsite/WizardStepConfigureCabins'
import { WizardStepConfigureApartments } from '@/components/wizard/property/campsite/WizardStepConfigureApartments'
import { WizardStepConfigureMobileHome } from '@/components/wizard/property/campsite/WizardStepConfigureMobileHome'
import { WizardStepConfigureRooms } from '@/components/wizard/property/bnb/WizardStepConfigureRooms'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

interface PropertyWizardPageProps {
  propertyType: PropertyType
}

// Step component mapping
const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  welcome: WizardStepWelcome,
  'basic-info': WizardStepBasicInfo,
  'accommodation-types': WizardStepAccommodationTypes,
  'configure-tent': WizardStepConfigureTents,
  'configure-rv': WizardStepConfigureRV,
  'configure-mobile-home': WizardStepConfigureMobileHome,
  'configure-glamping': WizardStepConfigureGlamping,
  'configure-cabin': WizardStepConfigureCabins,
  'configure-apartment': WizardStepConfigureApartments,
  'configure-bnb-rooms': WizardStepConfigureRooms,
  review: WizardStepReview,
}

function PropertyWizardContent() {
  const navigate = useNavigate()
  const {
    currentStep,
    nextStep,
    prevStep,
    canProceed,
    isFirstStep,
    isLastStep,
    state,
    loadDraftFromStorage,
  } = usePropertyWizard()

  // Try to load draft on mount
  useEffect(() => {
    loadDraftFromStorage()
  }, [loadDraftFromStorage])

  const handleClose = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be saved as a draft.')) {
      navigate('/owner')
    }
  }

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading wizard...</p>
      </div>
    )
  }

  const StepComponent = STEP_COMPONENTS[currentStep.id]

  if (!StepComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unknown step: {currentStep.id}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {state.propertyType === 'bnb' ? 'B&B Setup' : 'Property Setup'}
            </h1>
            <button
              onClick={handleClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Exit wizard"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Progress */}
          <DynamicWizardProgress />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <StepComponent />
        </div>
      </main>

      {/* Footer Navigation */}
      {currentStep.id !== 'welcome' && currentStep.id !== 'review' && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                isFirstStep
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Icon name="arrow_back" size={16} />
              Back
            </button>

            <div className="text-sm text-gray-500">
              {state.lastSaved && (
                <span>
                  Last saved: {new Date(state.lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors',
                canProceed()
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              )}
            >
              {isLastStep ? 'Review' : 'Continue'}
              <Icon name="arrow_forward" size={16} />
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

export function PropertyWizardPage({ propertyType }: PropertyWizardPageProps) {
  return (
    <PropertyWizardProvider initialPropertyType={propertyType}>
      <PropertyWizardContent />
    </PropertyWizardProvider>
  )
}

export default PropertyWizardPage
