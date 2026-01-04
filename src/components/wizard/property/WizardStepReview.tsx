import { usePropertyWizard } from '@/context/PropertyWizardContext'
import { ACCOMMODATION_LABELS } from '@/data/types'
import Icon from '@/components/ui/Icon'
import { useState } from 'react'
import { ownerApi } from '@/lib/api/owner'
import { stateToPropertyDraftRequest } from '@/context/PropertyWizardContext'
import { useToast } from '@/context/ToastContext'
import { useNavigate } from 'react-router-dom'

export function WizardStepReview() {
  const { state, goToStep, getTotalAccommodations, clearDraft, dispatch } = usePropertyWizard()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // First save the draft to get an ID
      const draftRequest = stateToPropertyDraftRequest(state)
      const draftResponse = await ownerApi.saveDraft(draftRequest)

      // Then publish it
      const property = await ownerApi.publishDraft(draftResponse.id)

      // Clear local draft
      clearDraft()

      toast.success('Property published successfully!')

      navigate(`/campsites/${property.id}`)
    } catch (error) {
      console.error('Failed to publish property:', error)
      toast.error('Failed to publish property. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const draftRequest = stateToPropertyDraftRequest(state)
      const response = await ownerApi.saveDraft(draftRequest)

      dispatch({ type: 'SET_DRAFT_ID', draftId: response.id })
      dispatch({ type: 'SET_LAST_SAVED', lastSaved: new Date().toISOString() })

      toast.success('Draft saved successfully!')

      navigate('/owner')
    } catch (error) {
      console.error('Failed to save draft:', error)
      toast.error('Failed to save draft. Please try again.')
    } finally {
      setIsSavingDraft(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          Review Your Property
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Make sure everything looks correct before publishing
        </p>
      </div>

      {/* Basic Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="home" size={20} className="text-green-600" />
            Basic Information
          </h3>
          <button
            onClick={() => goToStep(1)}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <Icon name="edit" size={16} />
            Edit
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500">Property Name</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {state.name || 'Not set'}
            </p>
          </div>

          {state.description && (
            <div>
              <span className="text-sm text-gray-500">Description</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                {state.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="location_on" size={20} className="text-green-600" />
            Location
          </h3>
          <button
            onClick={() => goToStep(1)}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <Icon name="edit" size={16} />
            Edit
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-gray-900 dark:text-white">{state.address || 'Not set'}</p>
          <p className="text-gray-600 dark:text-gray-400">{state.county || 'County not set'}</p>
          {state.lat !== null && state.lng !== null && (
            <p className="text-sm text-gray-500">
              {state.lat.toFixed(4)}, {state.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Accommodations Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="bed" size={20} className="text-green-600" />
            Accommodations
          </h3>
          <button
            onClick={() => goToStep(2)}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <Icon name="edit" size={16} />
            Edit
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {getTotalAccommodations()} total units
          </p>

          <div className="space-y-2">
            {Object.entries(state.accommodationConfigs).map(([type, config]) => (
              <div
                key={type}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {ACCOMMODATION_LABELS[type as keyof typeof ACCOMMODATION_LABELS] || type}
                </span>
                <div className="text-right">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {config.quantity} units
                  </span>
                  <span className="text-gray-500 ml-2">
                    @ {config.pricePerNight}/night
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleSaveDraft}
          disabled={isSavingDraft || isPublishing}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {isSavingDraft ? (
            <span className="flex items-center justify-center gap-2">
              <Icon name="progress_activity" size={16} className="animate-spin" />
              Saving...
            </span>
          ) : (
            'Save as Draft'
          )}
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing || isSavingDraft}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPublishing ? (
            <>
              <Icon name="progress_activity" size={16} className="animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Icon name="check" size={20} />
              Publish Property
            </>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        You can always edit your property details after publishing
      </p>
    </div>
  )
}

export default WizardStepReview
