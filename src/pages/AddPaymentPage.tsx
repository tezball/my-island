import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Button, Input } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock M18: Add Payment Page
export function AddPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [saveCard, setSaveCard] = useState(true)
  const [isDefault, setIsDefault] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleAddCard = () => {
    // Mock: Would submit card details
    navigate(`/book/${id}/payment-methods`)
  }

  const isValid = cardNumber.length >= 19 && expiryDate.length === 5 && cvv.length >= 3 && cardholderName.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Add Card" />

      <div className="flex-1 px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Card Preview */}
        <div className="relative h-48 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          {/* Card content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-12 h-10 rounded bg-gradient-to-br from-yellow-400 to-yellow-600" />
              <Icon name="contactless" className="text-white/60 text-2xl" />
            </div>

            <div className="space-y-3">
              <p className="text-white/90 font-mono text-lg tracking-widest">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-[10px] uppercase">Card Holder</p>
                  <p className="text-white/90 text-sm font-medium uppercase">
                    {cardholderName || 'YOUR NAME'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px] uppercase">Expires</p>
                  <p className="text-white/90 text-sm font-medium">
                    {expiryDate || 'MM/YY'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <div className="relative">
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/visa.svg" alt="Visa" className="h-6 w-auto opacity-50" />
                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/mastercard.svg" alt="Mastercard" className="h-6 w-auto opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <Input
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVV</label>
              <div className="relative">
                <Input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="•••"
                  maxLength={4}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="help_outline" className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
            <Input
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
            />
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Save card for future payments</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Set as default payment method</span>
            </label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-surface-dark rounded-xl">
          <Icon name="lock" className="text-primary text-xl mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your payment info is secure</p>
            <p className="text-xs text-gray-500 mt-1">
              We use 256-bit encryption to protect your card details. Your information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 pb-8 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <Button className="w-full" size="lg" disabled={!isValid} onClick={handleAddCard}>
            Add Card
          </Button>
        </div>
      </div>
    </div>
  )
}
