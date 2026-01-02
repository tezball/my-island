import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export default function PersonalInfoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '')
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/profile')
  }

  return (
    <AppShell
      showBack
      headerTitle="Personal Info"
      showNav={false}
      headerRightAction={
        <button onClick={handleSave} className="text-primary font-medium text-sm">
          Save
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            leftIcon="mail"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+353 XX XXX XXXX"
            leftIcon="phone"
          />

          <Input
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            leftIcon="cake"
          />
        </div>

        {/* Address Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Address (Optional)
          </h3>
          <div className="space-y-4">
            <Input
              label="Street Address"
              placeholder="123 Main Street"
              leftIcon="home"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Dublin"
              />
              <Input
                label="Postcode"
                placeholder="D01 XXXX"
              />
            </div>
            <Input
              label="Country"
              value="Ireland"
              disabled
              leftIcon="flag"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Emergency Contact (Optional)
          </h3>
          <div className="space-y-4">
            <Input
              label="Contact Name"
              placeholder="Full name"
              leftIcon="person"
            />
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="+353 XX XXX XXXX"
              leftIcon="phone"
            />
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon="save"
        >
          Save Changes
        </Button>
      </div>
    </AppShell>
  )
}
