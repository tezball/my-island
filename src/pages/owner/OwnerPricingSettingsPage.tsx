import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'

export default function OwnerPricingSettingsPage() {
  const [weekendPricing, setWeekendPricing] = useState(true)
  const [seasonalPricing, setSeasonalPricing] = useState(true)
  const [lastMinuteDiscount, setLastMinuteDiscount] = useState(false)
  const [weekendMarkup, setWeekendMarkup] = useState('15')
  const [minStay, setMinStay] = useState(1)

  return (
    <AppShell showBack headerTitle="Pricing Rules" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Weekend Pricing */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Weekend Pricing
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={weekendPricing}
              onChange={setWeekendPricing}
              label="Weekend Price Adjustment"
              description="Apply different rates for Fri-Sun"
            />

            {weekendPricing && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Weekend Markup
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={weekendMarkup}
                    onChange={(e) => setWeekendMarkup(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-20 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center font-medium"
                    maxLength={3}
                  />
                  <span className="text-slate-600 dark:text-slate-400">% increase</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seasonal Pricing */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Seasonal Pricing
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={seasonalPricing}
              onChange={setSeasonalPricing}
              label="Seasonal Adjustments"
              description="Set different prices for peak/off-peak seasons"
            />

            {seasonalPricing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon name="wb_sunny" size={20} className="text-amber-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Peak Season</p>
                      <p className="text-sm text-slate-500">Jun - Aug</p>
                    </div>
                  </div>
                  <span className="text-emerald-600 font-medium">+25%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon name="eco" size={20} className="text-emerald-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Shoulder Season</p>
                      <p className="text-sm text-slate-500">Apr-May, Sep-Oct</p>
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">Base price</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon name="ac_unit" size={20} className="text-blue-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Off Season</p>
                      <p className="text-sm text-slate-500">Nov - Mar</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-medium">-15%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Discounts */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Discounts
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={lastMinuteDiscount}
              onChange={setLastMinuteDiscount}
              label="Last-Minute Discount"
              description="10% off for bookings within 48 hours"
            />
          </div>
        </div>

        {/* Minimum Stay */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Booking Rules
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Minimum Stay (nights)
            </label>
            <div className="flex items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">
              <button
                onClick={() => setMinStay(Math.max(1, minStay - 1))}
                className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center"
              >
                <Icon name="remove" size={18} />
              </button>
              <span className="font-bold text-xl text-slate-900 dark:text-white w-8 text-center">
                {minStay}
              </span>
              <button
                onClick={() => setMinStay(Math.min(14, minStay + 1))}
                className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center"
              >
                <Icon name="add" size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button className="w-full" leftIcon="save">
          Save Pricing Rules
        </Button>
      </div>
    </AppShell>
  )
}
