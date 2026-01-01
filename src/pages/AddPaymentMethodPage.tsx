import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Icon from '../components/ui/Icon'
import Toggle from '../components/ui/Toggle'

export default function AddPaymentMethodPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [saveCard, setSaveCard] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    navigate(`/book/${id}/payment-methods`)
  }

  const isValid = cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    cardholderName.trim().length > 0

  return (
    <AppShell showBack headerTitle="Add Card" showNav={false}>
      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit}>
          {/* Card Preview */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <Icon name="credit_card" size={32} className="text-white/60" />
                <Icon name="contactless" size={24} className="text-white/60" />
              </div>
              <p className="font-mono text-lg tracking-wider mb-4">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-white/60 uppercase">Card Holder</p>
                  <p className="font-medium">{cardholderName || 'Your Name'}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase">Expires</p>
                  <p className="font-medium">{expiryDate || 'MM/YY'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details Form */}
          <div className="p-4 space-y-4">
            <Input
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              leftIcon="credit_card"
              maxLength={19}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
              <Input
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                type="password"
                maxLength={4}
              />
            </div>

            <Input
              label="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on card"
              leftIcon="person"
            />

            <Toggle
              checked={saveCard}
              onChange={setSaveCard}
              label="Save card for future payments"
              description="Your card details are securely stored"
            />
          </div>

          {/* Security Info */}
          <div className="p-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-start gap-3">
                <Icon name="security" size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    Your payment is secure
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    We use industry-standard encryption to protect your card details. We never store your CVV.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-24" />

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid}
              isLoading={isSaving}
              leftIcon="add_card"
            >
              Add Card
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
