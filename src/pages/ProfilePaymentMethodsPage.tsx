import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useToast } from '../context/ToastContext'

interface PaymentMethod {
  id: string
  type: 'visa' | 'mastercard' | 'amex'
  last4: string
  expiry: string
  isDefault: boolean
}

// Mock saved payment methods
const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '03/25', isDefault: false },
]

const cardIcons: Record<PaymentMethod['type'], string> = {
  visa: 'credit_card',
  mastercard: 'credit_card',
  amex: 'credit_card',
}

const cardLabels: Record<PaymentMethod['type'], string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
}

export default function ProfilePaymentMethodsPage() {
  const toast = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({
        ...m,
        isDefault: m.id === id,
      }))
    )
    toast.success('Default updated', 'Your default payment method has been changed.')
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setPaymentMethods(methods => methods.filter(m => m.id !== id))
    setIsDeleting(null)
    toast.success('Card removed', 'Payment method has been removed from your account.')
  }

  const handleAddNew = () => {
    // In a real app, this would open a modal or navigate to add card page
    toast.info('Coming soon', 'Adding new payment methods will be available soon.')
  }

  return (
    <AppShell
      showBack
      headerTitle="Payment Methods"
      showNav={false}
    >
      <div className="flex-1 overflow-auto">
        {/* Quick Pay Options */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Quick Pay
          </h3>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple Pay"
                className="h-5 w-5 dark:invert"
              />
              <span className="font-medium text-slate-900 dark:text-white text-sm">Apple Pay</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                alt="Google Pay"
                className="h-4"
              />
              <span className="font-medium text-slate-900 dark:text-white text-sm">Pay</span>
            </button>
          </div>
        </div>

        {/* Saved Cards */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Saved Cards
          </h3>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="credit_card_off" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No saved payment methods</p>
              <p className="text-sm text-slate-400 mt-1">Add a card to make checkout faster</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon name={cardIcons[method.type]} size={24} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {cardLabels[method.type]} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">Expires {method.expiry}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Set as default"
                      >
                        <Icon name="check_circle" size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      disabled={isDeleting === method.id}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Remove card"
                    >
                      {isDeleting === method.id ? (
                        <Icon name="progress_activity" size={20} className="animate-spin" />
                      ) : (
                        <Icon name="delete" size={20} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="px-4 pb-4">
          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <Icon name="lock" size={20} className="text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Secure Storage
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Your payment information is encrypted and securely stored. We never store your full card number.
              </p>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          onClick={handleAddNew}
          leftIcon="add"
        >
          Add Payment Method
        </Button>
      </div>
    </AppShell>
  )
}
