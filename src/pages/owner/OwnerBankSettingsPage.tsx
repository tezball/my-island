import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Icon from '../../components/ui/Icon'

export default function OwnerBankSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [accountHolder, setAccountHolder] = useState('John Murphy')
  const [iban, setIban] = useState('IE29 AIBK 9311 5212 3456 78')
  const [bic, setBic] = useState('AIBKIE2D')

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <AppShell
      showBack
      headerTitle="Bank Account"
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
        {/* Current Account */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Payout Account
          </h3>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Account Holder Name"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Full name as on bank account"
              />
              <Input
                label="IBAN"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="IE00 XXXX 0000 0000 0000 00"
              />
              <Input
                label="BIC/SWIFT"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                placeholder="XXXXXXXX"
              />
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center">
                  <Icon name="account_balance" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {accountHolder}
                  </p>
                  <p className="text-sm text-slate-500">Account Holder</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 mb-1">IBAN</p>
                <p className="font-mono text-slate-900 dark:text-white">{iban}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">BIC/SWIFT</p>
                <p className="font-mono text-slate-900 dark:text-white">{bic}</p>
              </div>
            </div>
          )}
        </div>

        {/* Verification Status */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Verification Status
          </h3>
          <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Icon name="verified" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-800 dark:text-emerald-400">
                Verified
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-500">
                Your bank account has been verified
              </p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon name="security" size={24} className="text-slate-400 shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  Your information is secure
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  We use bank-level encryption to protect your financial details. Your full account numbers are never displayed.
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
