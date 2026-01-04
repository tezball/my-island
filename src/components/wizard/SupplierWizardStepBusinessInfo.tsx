import { useSupplierWizard, SUPPLIER_CATEGORIES } from '../../context/SupplierWizardContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Icon from '../ui/Icon'
import type { SupplierCategory } from '../../data/types'

export default function SupplierWizardStepBusinessInfo() {
  const { state, dispatch, nextStep, canProceed } = useSupplierWizard()

  const updateField = (field: 'businessName' | 'description', value: string) => {
    dispatch({
      type: 'UPDATE_BUSINESS_INFO',
      businessName: field === 'businessName' ? value : state.businessName,
      description: field === 'description' ? value : state.description,
      category: state.category,
    })
  }

  const updateCategory = (category: SupplierCategory) => {
    dispatch({
      type: 'UPDATE_BUSINESS_INFO',
      businessName: state.businessName,
      description: state.description,
      category,
    })
  }

  const handleNext = () => {
    if (canProceed()) {
      nextStep()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Section Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Tell us about your business
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Add basic details about your business to get started.
          </p>
        </div>

        {/* Business Name */}
        <Input
          label="Business Name"
          value={state.businessName}
          onChange={(e) => updateField('businessName', e.target.value.slice(0, 255))}
          placeholder="e.g., Murphy's Farm Shop"
          helperText="Choose a name that represents your business"
          error={
            state.businessName.trim().length > 0 && state.businessName.trim().length < 2
              ? 'Name must be at least 2 characters'
              : undefined
          }
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={state.description}
            onChange={(e) => updateField('description', e.target.value.slice(0, 2000))}
            placeholder="Tell customers what makes your business special. Describe your products, services, and what sets you apart..."
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              state.description.trim().length > 0 && state.description.trim().length < 10
                ? 'border-red-300 dark:border-red-700'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            <p className={`text-xs ${
              state.description.trim().length > 0 && state.description.trim().length < 10
                ? 'text-red-500'
                : 'text-slate-400'
            }`}>
              {state.description.trim().length > 0 && state.description.trim().length < 10
                ? `${10 - state.description.trim().length} more characters needed`
                : 'Minimum 10 characters'}
            </p>
            <p className="text-xs text-slate-400">{state.description.length}/2000</p>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Business Category
          </label>
          <p className="text-xs text-slate-400 mb-3">Select the category that best describes your business</p>
          <div className="grid grid-cols-3 gap-3">
            {SUPPLIER_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateCategory(cat.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  state.category === cat.value
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center ${
                    state.category === cat.value
                      ? 'bg-primary text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon name={cat.icon} size={20} />
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    state.category === cat.value
                      ? 'text-primary'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
          {state.category && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              {SUPPLIER_CATEGORIES.find((c) => c.value === state.category)?.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <Button className="w-full" onClick={handleNext} disabled={!canProceed()}>
          Next: Contact & Location
        </Button>
      </div>
    </div>
  )
}
