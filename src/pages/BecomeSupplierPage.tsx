import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import WizardProgress from '../components/wizard/WizardProgress'
import SupplierWizardStepBusinessInfo from '../components/wizard/SupplierWizardStepBusinessInfo'
import SupplierWizardStepContactLocation from '../components/wizard/SupplierWizardStepContactLocation'
import { SupplierWizardProvider, useSupplierWizard } from '../context/SupplierWizardContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supplierApi } from '../lib/api/supplier'

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

const STEPS = ['Business Info', 'Contact & Location']

function WizardContent() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, updateUser } = useAuth()
  const { state, dispatch } = useSupplierWizard()

  // If already a supplier, redirect to supplier dashboard
  useEffect(() => {
    if (user?.isSupplier) {
      navigate('/supplier', { replace: true })
    }
  }, [user?.isSupplier, navigate])

  // Don't render content if user is already a supplier (will redirect)
  if (user?.isSupplier) {
    return null
  }

  const handleSubmit = async () => {
    if (state.category === null) {
      toast.error('Missing Information', 'Please select a business category.')
      return
    }

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })
    dispatch({ type: 'SET_ERROR', error: null })

    try {
      if (USE_REAL_API) {
        await supplierApi.becomeSupplier({
          businessName: state.businessName,
          description: state.description,
          location: state.location,
          contactEmail: state.contactEmail,
          phoneNumber: state.phoneNumber,
          category: state.category,
          eircode: state.eircode || undefined,
          latitude: state.latitude ?? undefined,
          longitude: state.longitude ?? undefined,
        })
      } else {
        // Mock mode: simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Update user context
      updateUser({ ...user, isSupplier: true })

      toast.success(
        'Welcome, Partner!',
        'You are now registered as a supplier. Set up your business profile to start attracting customers.'
      )

      dispatch({ type: 'RESET' })
      navigate('/supplier')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register as supplier'
      dispatch({ type: 'SET_ERROR', error: message })
      toast.error('Error', message)
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
    }
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <SupplierWizardStepBusinessInfo />
      case 1:
        return (
          <SupplierWizardStepContactLocation
            onSubmit={handleSubmit}
            isSubmitting={state.isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <AppShell showBack headerTitle="Become a Supplier" showNav={false}>
      <div className="flex flex-col h-full">
        <WizardProgress steps={STEPS} currentStep={state.currentStep} />
        <div className="flex-1 flex flex-col overflow-hidden">{renderStep()}</div>
        {state.isSubmitting && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300">Setting up your account...</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default function BecomeSupplierPage() {
  return (
    <SupplierWizardProvider>
      <WizardContent />
    </SupplierWizardProvider>
  )
}
