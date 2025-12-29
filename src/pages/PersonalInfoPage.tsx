import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock M28: Personal Information Page
export function PersonalInfoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const personalInfo = {
    firstName: user?.name?.split(' ')[0] || 'Sarah',
    lastName: user?.name?.split(' ')[1] || 'Jenkins',
    email: user?.email || 'sarah.jenkins@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'January 15, 1990',
    gender: 'Female',
    address: '123 Camping Lane',
    city: 'Boulder',
    state: 'Colorado',
    zipCode: '80302',
    country: 'United States',
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Personal Information" />

      <div className="flex-1 px-4 pb-8">
        {/* Basic Info */}
        <section className="mt-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Basic Information
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <InfoRow label="First Name" value={personalInfo.firstName} />
            <InfoRow label="Last Name" value={personalInfo.lastName} />
            <InfoRow
              label="Email"
              value={personalInfo.email}
              verified
              locked
            />
            <InfoRow label="Phone" value={personalInfo.phone} verified />
            <InfoRow
              label="Date of Birth"
              value={personalInfo.dateOfBirth}
              isLast
            />
          </div>
        </section>

        {/* Address */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Address
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <InfoRow label="Street Address" value={personalInfo.address} />
            <InfoRow label="City" value={personalInfo.city} />
            <InfoRow label="State/Province" value={personalInfo.state} />
            <InfoRow label="ZIP/Postal Code" value={personalInfo.zipCode} />
            <InfoRow label="Country" value={personalInfo.country} isLast />
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Emergency Contact
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <InfoRow label="Contact Name" value="John Jenkins" />
            <InfoRow label="Relationship" value="Spouse" />
            <InfoRow label="Phone" value="+1 (555) 987-6543" isLast />
          </div>
        </section>

        {/* Edit Button */}
        <div className="mt-8">
          <Button
            className="w-full h-14"
            size="lg"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Information
          </Button>
        </div>

        {/* Delete Account */}
        <div className="mt-6 text-center">
          <button className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors">
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: string
  verified?: boolean
  locked?: boolean
  isLast?: boolean
}

function InfoRow({ label, value, verified, locked, isLast }: InfoRowProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 ${
        !isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''
      }`}
    >
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
      <div className="flex items-center gap-2">
        {verified && (
          <div className="flex items-center gap-1 text-primary text-xs">
            <Icon name="verified" className="text-sm" />
            <span>Verified</span>
          </div>
        )}
        {locked && <Icon name="lock" className="text-gray-400 text-lg" />}
      </div>
    </div>
  )
}
