interface WizardProgressProps {
  steps: string[]
  currentStep: number
}

export default function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="px-4 py-3 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  index < currentStep
                    ? 'bg-primary text-slate-900'
                    : index === currentStep
                    ? 'bg-primary text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {index < currentStep ? (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  index <= currentStep
                    ? 'text-slate-900 dark:text-white font-medium'
                    : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  index < currentStep
                    ? 'bg-primary'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
                style={{ minWidth: '20px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
