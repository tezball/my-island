import { useState, useEffect } from 'react'
import { useCampsiteWizard } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function WizardStepBasicInfo() {
  const { state, dispatch, canProceed } = useCampsiteWizard()
  const [name, setName] = useState(state.name)
  const [description, setDescription] = useState(state.description)

  // Update context when values change
  useEffect(() => {
    dispatch({ type: 'UPDATE_BASIC_INFO', name, description })
  }, [name, description, dispatch])

  const handleNext = () => {
    if (canProceed()) {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Tell us about your campsite
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Start with the basics - you can always add more details later.
          </p>
        </div>

        <Input
          label="Campsite Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Whispering Pines Campground"
          helperText="Choose a name that captures the essence of your location"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
            placeholder="Tell guests what makes your campsite special. Describe the scenery, atmosphere, and unique features..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/2000</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <Button className="w-full" onClick={handleNext} disabled={!canProceed()}>
          Next: Location
        </Button>
      </div>
    </div>
  )
}
