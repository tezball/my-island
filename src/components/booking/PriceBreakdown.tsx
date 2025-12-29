import type { Extra } from '@/types'

interface PriceBreakdownProps {
  pricePerNight: number
  nights: number
  extras: Extra[]
  className?: string
}

export function PriceBreakdown({
  pricePerNight,
  nights,
  extras,
  className,
}: PriceBreakdownProps) {
  const accommodationTotal = pricePerNight * nights
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0)
  const total = accommodationTotal + extrasTotal

  return (
    <div className={className}>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
        Price Breakdown
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            €{pricePerNight} × {nights} night{nights > 1 ? 's' : ''}
          </span>
          <span className="text-slate-900 dark:text-white">
            €{accommodationTotal}
          </span>
        </div>

        {extras.map((extra) => (
          <div key={extra.id} className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {extra.name}
            </span>
            <span className="text-slate-900 dark:text-white">€{extra.price}</span>
          </div>
        ))}

        <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="font-bold text-slate-900 dark:text-white">Total</span>
          <span className="font-bold text-xl text-primary">€{total}</span>
        </div>
      </div>
    </div>
  )
}
