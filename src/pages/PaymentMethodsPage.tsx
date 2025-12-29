import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M17: Payment Methods Page
interface PaymentMethod {
  id: string
  type: 'card' | 'apple' | 'google' | 'paypal'
  label: string
  icon: string
  lastFour?: string
  expiryDate?: string
  isDefault?: boolean
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    label: 'Visa',
    icon: 'credit_card',
    lastFour: '4242',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    label: 'Mastercard',
    icon: 'credit_card',
    lastFour: '8888',
    expiryDate: '03/26',
  },
  {
    id: '3',
    type: 'apple',
    label: 'Apple Pay',
    icon: 'phone_iphone',
  },
  {
    id: '4',
    type: 'google',
    label: 'Google Pay',
    icon: 'payments',
  },
]

export function PaymentMethodsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string>(
    MOCK_PAYMENT_METHODS.find((m) => m.isDefault)?.id || ''
  )

  const handleSelect = (methodId: string) => {
    setSelectedId(methodId)
  }

  const handleAddCard = () => {
    navigate(`/book/${id}/add-payment`)
  }

  const handleContinue = () => {
    navigate(`/book/${id}/summary`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Payment Methods" />

      <div className="flex-1 px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Saved Payment Methods */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Saved Methods
          </h3>
          <div className="space-y-3">
            {MOCK_PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
                  selectedId === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    selectedId === method.id ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'
                  )}
                >
                  <Icon
                    name={method.icon}
                    className={cn(
                      'text-2xl',
                      selectedId === method.id ? 'text-primary' : 'text-gray-500'
                    )}
                  />
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{method.label}</span>
                    {method.isDefault && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  {method.lastFour && (
                    <p className="text-xs text-gray-500">
                      •••• {method.lastFour} · Expires {method.expiryDate}
                    </p>
                  )}
                </div>

                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                    selectedId === method.id
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  {selectedId === method.id && (
                    <Icon name="check" className="text-white text-sm" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add New Method */}
        <button
          onClick={handleAddCard}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Icon name="add" className="text-2xl text-gray-500" />
          </div>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Add new payment method
          </span>
        </button>

        {/* Other Options */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Other Options
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark">
              <div className="w-12 h-12 rounded-xl bg-[#003087]/10 flex items-center justify-center">
                <Icon name="account_balance" className="text-2xl text-[#003087]" />
              </div>
              <span className="font-medium">PayPal</span>
              <Icon name="chevron_right" className="ml-auto text-gray-400" />
            </button>

            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark">
              <div className="w-12 h-12 rounded-xl bg-[#635bff]/10 flex items-center justify-center">
                <Icon name="account_balance_wallet" className="text-2xl text-[#635bff]" />
              </div>
              <span className="font-medium">Klarna</span>
              <span className="text-xs text-gray-500 ml-2">Pay later</span>
              <Icon name="chevron_right" className="ml-auto text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 pb-8 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <Button className="w-full" size="lg" onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
