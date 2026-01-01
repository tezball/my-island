import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Icon from '../../components/ui/Icon'

export default function OwnerTaxSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [taxId, setTaxId] = useState('IE1234567T')
  const [vatNumber, setVatNumber] = useState('IE1234567T')
  const [businessName, setBusinessName] = useState('Murphy Camping Ltd')
  const [businessAddress, setBusinessAddress] = useState('123 Main Street, Galway, Ireland')

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <AppShell
      showBack
      headerTitle="Tax Information"
      showNav={false}
      headerRightAction={
        !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-primary font-medium text-sm">
            Edit
          </button>
        )
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Tax Details */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Tax Details
          </h3>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Business/Legal Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
              />
              <Input
                label="Tax ID / PPS Number"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="IE0000000X"
              />
              <Input
                label="VAT Number (if applicable)"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="IE0000000X"
              />
              <Input
                label="Business Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Full business address"
              />
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Business Name</p>
                <p className="font-medium text-slate-900 dark:text-white">{businessName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Tax ID</p>
                <p className="font-mono text-slate-900 dark:text-white">{taxId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">VAT Number</p>
                <p className="font-mono text-slate-900 dark:text-white">{vatNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Business Address</p>
                <p className="text-slate-900 dark:text-white">{businessAddress}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tax Documents */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Tax Documents
          </h3>
          <div className="space-y-3">
            {[
              { year: '2024', status: 'ready', type: 'Annual Tax Summary' },
              { year: '2023', status: 'ready', type: 'Annual Tax Summary' },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center">
                    <Icon name="description" size={20} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {doc.type}
                    </p>
                    <p className="text-sm text-slate-500">{doc.year}</p>
                  </div>
                </div>
                <button className="text-primary font-medium text-sm flex items-center gap-1">
                  <Icon name="download" size={18} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* VAT Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon name="info" size={24} className="text-amber-600 shrink-0" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-400 text-sm">
                  VAT Information
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                  If your annual turnover exceeds €37,500, you may need to register for VAT. Consult your accountant for advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button className="flex-1" isLoading={isSaving} onClick={handleSave} leftIcon="save">
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
