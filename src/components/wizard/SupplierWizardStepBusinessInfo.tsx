import { useState, useEffect } from 'react'
import { useSupplierWizard, SUPPLIER_CATEGORIES } from '../../context/SupplierWizardContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Icon from '../ui/Icon'
import type { SupplierCategory } from '../../data/types'

export default function SupplierWizardStepBusinessInfo() {
  const { state, dispatch, canProceed } = useSupplierWizard()

  const [businessName, setBusinessName] = useState(state.businessName)
  const [description, setDescription] = useState(state.description)
  const [category, setCategory] = useState<SupplierCategory | null>(state.category)

  // Update context when fields change
  useEffect(() => {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', businessName, description, category })
  }, [businessName, description, category, dispatch])

  const handleNext = () => {
    if (canProceed()) {
      dispatch({ type: 'NEXT_STEP' })
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
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value.slice(0, 255))}
          placeholder="e.g., Murphy's Farm Shop"
          helperText="Choose a name that represents your business"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
            placeholder="Tell customers what makes your business special. Describe your products, services, and what sets you apart..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/2000</p>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Business Category
          </label>
          <div className="grid grid-cols-3 gap-3">
            {SUPPLIER_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  category === cat.value
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center ${
                    category === cat.value
                      ? 'bg-primary text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon name={cat.icon} size={20} />
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    category === cat.value
                      ? 'text-primary'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
          {category && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              {SUPPLIER_CATEGORIES.find((c) => c.value === category)?.description}
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
