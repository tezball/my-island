import { useState } from 'react'
import { Icon, Button, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

// Mock M21: Promo Code Modal
interface PromoCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (code: string, discount: number) => void
  currentTotal: number
}

interface PromoCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
  minSpend?: number
  expiresAt?: string
}

// Mock available promo codes
const AVAILABLE_PROMOS: PromoCode[] = [
  {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    description: '20% off your first booking',
    minSpend: 100,
  },
  {
    code: 'SUMMER10',
    type: 'fixed',
    value: 10,
    description: '€10 off summer bookings',
    minSpend: 50,
    expiresAt: '2024-09-30',
  },
]

export function PromoCodeModal({ isOpen, onClose, onApply, currentTotal }: PromoCodeModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleApply = async () => {
    setError('')
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const promo = AVAILABLE_PROMOS.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    )

    if (!promo) {
      setError('Invalid promo code')
      setIsLoading(false)
      return
    }

    if (promo.minSpend && currentTotal < promo.minSpend) {
      setError(`Minimum spend of €${promo.minSpend} required`)
      setIsLoading(false)
      return
    }

    setAppliedPromo(promo)
    setIsLoading(false)
  }

  const handleConfirm = () => {
    if (appliedPromo) {
      const discount =
        appliedPromo.type === 'percentage'
          ? (currentTotal * appliedPromo.value) / 100
          : appliedPromo.value
      onApply(appliedPromo.code, discount)
      onClose()
    }
  }

  const calculateDiscount = (promo: PromoCode) => {
    return promo.type === 'percentage'
      ? (currentTotal * promo.value) / 100
      : promo.value
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background-light dark:bg-background-dark rounded-t-3xl animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8" />
          <h2 className="text-lg font-bold">Enter Promo Code</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Input */}
          <div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase())
                    setError('')
                    setAppliedPromo(null)
                  }}
                  placeholder="Enter code"
                  className="uppercase"
                />
              </div>
              <Button
                onClick={handleApply}
                disabled={!code || isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <Icon name="progress_activity" className="animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <Icon name="error_outline" className="text-sm" />
                {error}
              </p>
            )}
          </div>

          {/* Applied Promo */}
          {appliedPromo && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name="check_circle" className="text-primary text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{appliedPromo.code}</span>
                    <span className="text-primary font-bold">
                      -€{calculateDiscount(appliedPromo).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {appliedPromo.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Available Promos */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              Available Promos
            </h3>
            <div className="space-y-2">
              {AVAILABLE_PROMOS.map((promo) => (
                <button
                  key={promo.code}
                  onClick={() => setCode(promo.code)}
                  className={cn(
                    'w-full p-3 rounded-xl border text-left transition-all',
                    code === promo.code
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{promo.code}</span>
                    <span className="text-xs font-bold text-primary">
                      {promo.type === 'percentage'
                        ? `${promo.value}% OFF`
                        : `€${promo.value} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{promo.description}</p>
                  {promo.minSpend && (
                    <p className="text-xs text-gray-400 mt-1">
                      Min. spend €{promo.minSpend}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pb-8 border-t border-gray-100 dark:border-gray-800">
          <Button
            className="w-full"
            size="lg"
            disabled={!appliedPromo}
            onClick={handleConfirm}
          >
            {appliedPromo
              ? `Apply Discount (-€${calculateDiscount(appliedPromo).toFixed(2)})`
              : 'Select a Promo Code'}
          </Button>
        </div>
      </div>
    </div>
  )
}
