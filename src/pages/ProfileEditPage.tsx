import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getInitials } from '../lib/utils'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { user, updateUser, isLoading: authLoading } = useAuth()
  const toast = useToast()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email'
    if (bio.length > 200) newErrors.bio = 'Bio must be 200 characters or less'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateUser({ name, email, phone, bio })
      toast.success('Profile updated', 'Your changes have been saved.')
      navigate('/profile')
    } catch {
      toast.error('Update failed', 'Please try again later.')
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading) {
    return (
      <AppShell showBack headerTitle="Edit Profile" showNav={false} showNotifications={false}>
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center">
            <Skeleton variant="circular" width={112} height={112} />
            <Skeleton variant="text" className="w-24 h-4 mt-3" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton variant="text" className="w-20 h-4 mb-2" />
                <Skeleton variant="rectangular" height={48} className="rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Edit Profile" showNav={false} showNotifications={false}>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                />
              ) : (
                <div className="size-28 rounded-full bg-primary/20 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {getInitials(name || '')}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 size-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
                <Icon name="photo_camera" size={20} className="text-slate-900" />
              </button>
            </div>
            <button className="mt-3 text-primary font-medium hover:underline">Change Photo</button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                }}
                className={`w-full h-12 px-4 bg-white dark:bg-surface-dark border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                }}
                className={`w-full h-12 px-4 bg-white dark:bg-surface-dark border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+353 87 123 4567"
                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value.slice(0, 200))
                  if (errors.bio) setErrors((prev) => ({ ...prev, bio: '' }))
                }}
                placeholder="Tell us a bit about yourself..."
                rows={4}
                className={`w-full px-4 py-3 bg-white dark:bg-surface-dark border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.bio ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              <p className={`text-sm mt-1 ${bio.length > 180 ? 'text-amber-500' : 'text-slate-400'}`}>
                {bio.length}/200 characters
              </p>
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
