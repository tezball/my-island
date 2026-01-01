import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Icon from '../../components/ui/Icon'
import { useToast } from '../../context/ToastContext'
import type { SupplierProfile } from '../../data/types'

// Mock supplier profile data
const mockProfile: SupplierProfile = {
  id: 'supplier-1',
  userId: 'user-1',
  businessName: '',
  description: '',
  location: '',
  contactEmail: '',
  phoneNumber: '',
  logoUrl: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export default function BusinessProfilePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<SupplierProfile>(mockProfile)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!profile.businessName.trim()) {
      toast.warning('Required Field', 'Please enter your business name.')
      return
    }

    setIsSaving(true)
    try {
      // TODO: Call API to save profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile Updated', 'Your business profile has been saved.')
      navigate('/supplier')
    } catch {
      toast.error('Error', 'Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/supplier')
  }

  return (
    <AppShell showBack headerTitle="Business Profile" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Logo Upload Section */}
        <div className="flex flex-col items-center py-6 bg-white dark:bg-surface-dark">
          <button
            onClick={handleLogoClick}
            className="relative group"
            type="button"
          >
            <div className="size-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
              {logoPreview || profile.logoUrl ? (
                <img
                  src={logoPreview || profile.logoUrl}
                  alt="Business logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="storefront" size={40} className="text-slate-400" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-surface-dark">
              <Icon name="photo_camera" size={16} className="text-white" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          <p className="mt-2 font-medium text-slate-900 dark:text-white">Business Logo</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tap to update your public image</p>
        </div>

        {/* Public Details Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="badge" size={18} className="text-primary" />
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Public Details
            </h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Business Name"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              placeholder="e.g. Sunny Side Camping"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Tell campers what makes your site unique..."
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="contact_page" size={18} className="text-primary" />
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contact Information
            </h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="e.g. 123 Forest Road, Green Valley"
              leftIcon="location_on"
            />
            <Input
              label="Contact Email"
              type="email"
              value={profile.contactEmail}
              onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
              placeholder="contact@business.com"
              leftIcon="mail"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profile.phoneNumber}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              placeholder="+1 (555) 000-0000"
              leftIcon="phone"
            />
          </div>
        </div>

        <div className="h-32" />
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
        <button
          onClick={handleCancel}
          className="w-full mt-2 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </AppShell>
  )
}
