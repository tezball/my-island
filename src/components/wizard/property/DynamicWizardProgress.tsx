import { usePropertyWizard } from '@/context/PropertyWizardContext'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

interface DynamicWizardProgressProps {
  className?: string
}

export function DynamicWizardProgress({ className }: DynamicWizardProgressProps) {
  const { steps, state, goToStep } = usePropertyWizard()

  // Show condensed view if more than 5 steps
  const isCondensed = steps.length > 5

  if (isCondensed) {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        {steps.map((step, index) => {
          const isCompleted = state.completedStepIds.includes(step.id)
          const isCurrent = index === state.currentStepIndex
          const isClickable = isCompleted || index <= state.currentStepIndex

          return (
            <button
              key={step.id}
              onClick={() => isClickable && goToStep(index)}
              disabled={!isClickable}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                isCurrent && 'w-8 bg-green-600',
                !isCurrent && isCompleted && 'bg-green-600',
                !isCurrent && !isCompleted && 'bg-gray-300 dark:bg-gray-600',
                isClickable && !isCurrent && 'hover:scale-110 cursor-pointer',
                !isClickable && 'cursor-not-allowed'
              )}
              title={step.title}
            >
              {isCurrent && (
                <span className="sr-only">{step.title} (current)</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Full progress bar for 5 or fewer steps
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = state.completedStepIds.includes(step.id)
        const isCurrent = index === state.currentStepIndex
        const isClickable = isCompleted || index <= state.currentStepIndex

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step indicator */}
            <button
              onClick={() => isClickable && goToStep(index)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-2 group',
                isClickable && 'cursor-pointer',
                !isClickable && 'cursor-not-allowed'
              )}
            >
              {/* Circle/Check */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  isCompleted && 'bg-green-600 text-white',
                  isCurrent && !isCompleted && 'bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-900/30',
                  !isCurrent && !isCompleted && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                  isClickable && !isCurrent && 'group-hover:bg-green-100 dark:group-hover:bg-green-900/30'
                )}
              >
                {isCompleted ? (
                  <Icon name="check" size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label (hidden on mobile) */}
              <span
                className={cn(
                  'hidden sm:block text-sm font-medium transition-colors',
                  isCurrent && 'text-green-600 dark:text-green-400',
                  isCompleted && 'text-gray-900 dark:text-white',
                  !isCurrent && !isCompleted && 'text-gray-500 dark:text-gray-400'
                )}
              >
                {step.title}
              </span>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default DynamicWizardProgress
