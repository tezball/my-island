import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { currentUser } from '../data/mockData'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [phone, setPhone] = useState(currentUser.phone || '')
  const [bio, setBio] = useState(currentUser.bio || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/profile')
  }

  return (
    <AppShell showBack headerTitle="Edit Profile" showNav={false} showNotifications={false}>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="size-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              />
              <button className="absolute bottom-0 right-0 size-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Icon name="photo_camera" size={20} className="text-slate-900" />
              </button>
            </div>
            <button className="mt-3 text-primary font-medium">Change Photo</button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500 mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500 mb-1 block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+353 87 123 4567"
                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500 mb-1 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
              />
              <p className="text-sm text-slate-400 mt-1">{bio.length}/200 characters</p>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSave}
          isLoading={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </AppShell>
  )
}
