import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

interface PaymentMethod {
  id: string
  type: 'card' | 'apple_pay' | 'google_pay'
  label: string
  last4?: string
  expiry?: string
  icon: string
  brand?: string
}

export default function PaymentMethodsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card-1',
      type: 'card',
      label: 'Visa ending in 4242',
      last4: '4242',
      expiry: '12/26',
      icon: 'credit_card',
      brand: 'visa',
    },
    {
      id: 'card-2',
      type: 'card',
      label: 'Mastercard ending in 8888',
      last4: '8888',
      expiry: '09/25',
      icon: 'credit_card',
      brand: 'mastercard',
    },
  ])

  const [selectedMethod, setSelectedMethod] = useState<string>(paymentMethods[0]?.id || '')

  const handleContinue = () => {
    navigate(`/book/${id}/processing`)
  }

  return (
    <AppShell showBack headerTitle="Payment Method" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Quick Pay Options */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Quick Pay
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-black rounded-xl flex items-center justify-center gap-2">
              <Icon name="apple" size={24} className="text-white" />
              <span className="text-white font-medium">Pay</span>
            </button>
            <button className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2">
              <Icon name="g_mobiledata" size={24} color="#4285F4" />
              <span className="font-medium text-slate-900">Pay</span>
            </button>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">OR PAY WITH CARD</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {/* Saved Cards */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Saved Cards
          </h3>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon
                    name={method.icon}
                    size={24}
                    className={selectedMethod === method.id ? 'text-primary' : 'text-slate-400'}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${
                    selectedMethod === method.id
                      ? 'text-primary'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    •••• •••• •••• {method.last4}
                  </p>
                  <p className="text-sm text-slate-500">
                    Expires {method.expiry}
                  </p>
                </div>
                {selectedMethod === method.id && (
                  <Icon name="check_circle" size={24} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Add new card */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate(`/book/${id}/add-payment`)}
            className="w-full p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:border-primary transition-colors"
          >
            <Icon name="add" size={20} className="text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Add New Card
            </span>
          </button>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedMethod}
        >
          Pay Now
        </Button>
        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
          <Icon name="lock" size={12} />
          Secured by Stripe
        </p>
      </div>
    </AppShell>
  )
}
