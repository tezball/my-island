import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

export function EditProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Sarah')
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || 'Jenkins')
  const [phone, setPhone] = useState('+1 (555) 123-4567')
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAn5NlAlpoMuVOTWIlayU_bxfgXXJUudkPtdhtIyTfRxClx9d4hQFhs51wXDybpb4itUqW_xLqiDEhODOKS_6NQ1fkP3rWulMQi9LHMvvQrcVOraDoUtamd6-IICEUPtQY7oAX_B9SbA5p4h8N94q-CX715vLyJecM8EgNAdqF2wPzbIuz2LviahFqD6SOVyhd-mfzK71kzqSp5eBhek7apqJ3nvzloE2kJLMvkdf9mu2ICcbxA528kE9HjKZnV-tAP2mpoDd68uQ'
  )

  const handleSave = () => {
    // Would save via API
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Edit Profile" />

      <div className="flex-1 flex flex-col items-center w-full px-4 pb-8">
        {/* Profile Avatar Section */}
        <div className="flex flex-col items-center py-6 gap-4 w-full">
          <div className="relative group cursor-pointer">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 shadow-md ring-4 ring-white dark:ring-surface-dark relative overflow-hidden"
              style={{ backgroundImage: `url("${avatar}")` }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Icon name="photo_camera" className="text-white text-3xl" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-black p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center border-2 border-white dark:border-background-dark">
              <Icon name="edit" className="text-xl" />
            </button>
          </div>
          <button className="text-primary font-bold text-base hover:text-green-400 dark:hover:text-green-300 transition-colors">
            Change Profile Photo
          </button>
        </div>

        {/* Form Fields */}
        <form className="w-full flex flex-col gap-5 mt-2">
          {/* Name Row */}
          <div className="flex flex-row gap-4">
            <label className="flex flex-col min-w-0 flex-1 gap-2">
              <span className="text-sm font-semibold ml-1">First Name</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark h-14 px-4 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-all"
                placeholder="First Name"
              />
            </label>
            <label className="flex flex-col min-w-0 flex-1 gap-2">
              <span className="text-sm font-semibold ml-1">Last Name</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark h-14 px-4 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-all"
                placeholder="Last Name"
              />
            </label>
          </div>

          {/* Email (Locked) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold ml-1">Email Address</span>
            <div className="relative flex w-full items-center">
              <input
                type="email"
                value={user?.email || 'sarah.jenkins@example.com'}
                readOnly
                className="w-full rounded-xl border-none bg-gray-100 dark:bg-surface-dark/50 text-gray-500 h-14 pl-4 pr-12 text-base cursor-not-allowed focus:ring-0"
              />
              <Icon
                name="lock"
                className="absolute right-4 text-gray-400 text-xl"
              />
            </div>
          </label>

          {/* Phone */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold ml-1">Phone Number</span>
            <div className="relative flex w-full items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark h-14 pl-4 pr-10 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-all"
                placeholder="+1 (000) 000-0000"
              />
              {phone && (
                <Icon
                  name="check_circle"
                  className="absolute right-4 text-primary text-xl"
                />
              )}
            </div>
          </label>
        </form>

        {/* Spacing */}
        <div className="h-10" />

        {/* Action Buttons */}
        <div className="w-full mt-auto flex flex-col gap-3">
          <Button className="w-full h-14" size="lg" onClick={handleSave}>
            Save Changes
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center rounded-full bg-transparent h-12 px-8 text-gray-500 text-base font-medium hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
