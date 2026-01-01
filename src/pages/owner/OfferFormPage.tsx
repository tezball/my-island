import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'

const discountTypes = [
  { id: 'percentage', label: 'Percentage Off', icon: 'percent' },
  { id: 'fixed', label: 'Fixed Amount', icon: 'euro' },
  { id: 'free_night', label: 'Free Night', icon: 'hotel' },
]

export default function OfferFormPage() {
  const { offerId } = useParams<{ offerId: string }>()
  const navigate = useNavigate()
  const isEditing = !!offerId

  const [name, setName] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [code, setCode] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minNights, setMinNights] = useState(1)
  const [usageLimit, setUsageLimit] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !discountValue) return
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/owner/offers')
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCode(result)
  }

  return (
    <AppShell
      showBack
      headerTitle={isEditing ? 'Edit Offer' : 'Create Offer'}
      showNav={false}
    >
      <div className="flex-1 overflow-auto">
        {/* Basic Info */}
        <div className="p-4 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Offer Details
          </h3>

          <Input
            label="Offer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Summer Special"
          />

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Discount Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {discountTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setDiscountType(type.id)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                    discountType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon
                    name={type.icon}
                    size={24}
                    className={discountType === type.id ? 'text-primary' : 'text-slate-400'}
                  />
                  <span className={`text-xs font-medium text-center ${
                    discountType === type.id
                      ? 'text-primary'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount Value */}
          {discountType !== 'free_night' && (
            <Input
              label={discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 15.00'}
              leftIcon={discountType === 'percentage' ? 'percent' : 'euro'}
            />
          )}

          {discountType === 'free_night' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Guests will receive a free night when booking 3+ nights
              </p>
            </div>
          )}
        </div>

        {/* Promo Code */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Promo Code
          </h3>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="Code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., SUMMER20"
              />
            </div>
            <div className="pt-7">
              <Button variant="secondary" onClick={generateCode} size="sm">
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Validity Period
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Restrictions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Restrictions
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Minimum Nights
            </label>
            <div className="flex items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">
              <button
                onClick={() => setMinNights(Math.max(1, minNights - 1))}
                className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center"
              >
                <Icon name="remove" size={18} />
              </button>
              <span className="font-bold text-xl text-slate-900 dark:text-white w-8 text-center">
                {minNights}
              </span>
              <button
                onClick={() => setMinNights(Math.min(14, minNights + 1))}
                className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center"
              >
                <Icon name="add" size={18} />
              </button>
            </div>
          </div>

          <Input
            label="Usage Limit (leave empty for unlimited)"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="e.g., 100"
            leftIcon="group"
          />
        </div>

        {/* Status */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Toggle
            checked={isActive}
            onChange={setIsActive}
            label="Active"
            description="This offer will be available immediately"
          />
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate('/owner/offers')}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!name.trim() || (discountType !== 'free_night' && !discountValue)}
            isLoading={isSaving}
            onClick={handleSave}
            leftIcon="save"
          >
            {isEditing ? 'Save Changes' : 'Create Offer'}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
