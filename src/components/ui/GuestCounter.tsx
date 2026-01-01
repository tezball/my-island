import Icon from './Icon'

interface GuestCounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
  description?: string
}

export default function GuestCounter({
  value,
  onChange,
  min = 0,
  max = 10,
  label,
  description,
}: GuestCounterProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1)
  }

  const increment = () => {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={`
            size-10 rounded-full border-2 flex items-center justify-center
            transition-colors
            ${value <= min
              ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
            }
          `}
        >
          <Icon name="remove" size={20} />
        </button>
        <span className="w-8 text-center font-semibold text-lg text-slate-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={`
            size-10 rounded-full border-2 flex items-center justify-center
            transition-colors
            ${value >= max
              ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
            }
          `}
        >
          <Icon name="add" size={20} />
        </button>
      </div>
    </div>
  )
}
