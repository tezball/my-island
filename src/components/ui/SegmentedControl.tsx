import { cn } from '@/utils/cn'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'flex h-12 p-1 w-full items-center justify-center rounded-xl',
        'bg-gray-100 dark:bg-surface-dark/50',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex cursor-pointer h-full flex-1 items-center justify-center',
              'rounded-[10px] text-sm font-semibold transition-all duration-200',
              isSelected
                ? 'bg-white dark:bg-surface-dark text-primary-dark shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <input
              type="radio"
              name="segment"
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
