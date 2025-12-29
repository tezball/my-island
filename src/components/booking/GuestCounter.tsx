import { Icon } from '../ui'

interface GuestCounterProps {
  label: string
  description?: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function GuestCounter({
  label,
  description,
  value,
  min = 0,
  max = 10,
  onChange,
}: GuestCounterProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1)
  }

  const increment = () => {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white">{label}</h4>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="remove" size="md" />
        </button>
        <span className="w-8 text-center font-bold text-lg text-slate-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="add" size="md" />
        </button>
      </div>
    </div>
  )
}
