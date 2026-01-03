import { useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import WizardProgress from '../../components/wizard/WizardProgress'
import WizardStepPropertyDetails from '../../components/wizard/WizardStepPropertyDetails'
import WizardStepFacilitiesMedia from '../../components/wizard/WizardStepFacilitiesMedia'
import WizardStepLot from '../../components/wizard/WizardStepLot'
import { CampsiteWizardProvider, useCampsiteWizard } from '../../context/CampsiteWizardContext'
import { useToast } from '../../context/ToastContext'
import { ownerApi } from '../../lib/api/owner'

const STEPS = ['Property Details', 'Facilities & Media', 'First Accommodation']

function WizardContent() {
  const navigate = useNavigate()
  const toast = useToast()
  const { state, dispatch } = useCampsiteWizard()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!state.lot || state.lat === null || state.lng === null) {
      toast.error('Missing Information', 'Please complete all required steps.')
      return
    }

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })
    dispatch({ type: 'SET_ERROR', error: null })

    try {
      // Create the campsite
      const campsiteResponse = await ownerApi.createCampsite({
        name: state.name,
        description: state.description || undefined,
        location: {
          address: state.address,
          county: state.county,
          lat: state.lat,
          lng: state.lng,
        },
        images: state.images.length > 0 ? state.images : undefined,
        facilities: state.facilities.length > 0 ? state.facilities : undefined,
      })

      // Create the first lot
      await ownerApi.createLot({
        campsiteId: campsiteResponse.id,
        name: state.lot.name,
        type: state.lot.type,
        capacity: state.lot.capacity,
        pricePerNight: state.lot.pricePerNight,
        amenities: state.lot.amenities.length > 0 ? state.lot.amenities : undefined,
      })

      toast.success('Campsite Created!', 'Your campsite is now live and ready for bookings.')
      dispatch({ type: 'RESET' })
      navigate('/owner')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create campsite'
      dispatch({ type: 'SET_ERROR', error: message })
      toast.error('Error', message)
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
    }
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <WizardStepPropertyDetails />
      case 1:
        return <WizardStepFacilitiesMedia />
      case 2:
        return <WizardStepLot />
      default:
        return null
    }
  }

  return (
    <AppShell showBack headerTitle="Create Campsite" showNav={false}>
      <form id="wizard-form" onSubmit={handleSubmit} className="flex flex-col h-full">
        <WizardProgress steps={STEPS} currentStep={state.currentStep} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderStep()}
        </div>
        {state.isSubmitting && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300">Creating your campsite...</p>
            </div>
          </div>
        )}
      </form>
    </AppShell>
  )
}

export default function CampsiteCreateWizardPage() {
  return (
    <CampsiteWizardProvider>
      <WizardContent />
    </CampsiteWizardProvider>
  )
}
