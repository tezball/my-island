import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'staff'
  avatar?: string
  status: 'active' | 'pending'
}

const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Murphy', email: 'john@murphy-camping.ie', role: 'owner', status: 'active' },
  { id: '2', name: 'Sarah O\'Brien', email: 'sarah@murphy-camping.ie', role: 'manager', status: 'active' },
]

const roleLabels = {
  owner: 'Owner',
  manager: 'Manager',
  staff: 'Staff',
}

const roleDescriptions = {
  owner: 'Full access to all features',
  manager: 'Manage bookings, respond to guests',
  staff: 'View bookings only',
}

export default function OwnerTeamSettingsPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'manager' | 'staff'>('manager')
  const [isSending, setIsSending] = useState(false)

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setIsSending(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSending(false)
    setShowInvite(false)
    setInviteEmail('')
  }

  return (
    <AppShell
      showBack
      headerTitle="Team Members"
      showNav={false}
      headerRightAction={
        <button onClick={() => setShowInvite(true)} className="text-primary font-medium text-sm">
          Invite
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Team Members */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            {teamMembers.length} Team Members
          </h3>
          <div className="space-y-3">
            {teamMembers.map(member => (
              <div
                key={member.id}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={member.role === 'owner' ? 'info' : 'default'}>
                    {roleLabels[member.role]}
                  </Badge>
                </div>
                {member.role !== 'owner' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button className="text-primary text-sm font-medium">
                      Edit Role
                    </button>
                    <span className="text-slate-300">|</span>
                    <button className="text-red-500 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Roles Explanation */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Role Permissions
          </h3>
          <div className="space-y-3">
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <div
                key={role}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={role === 'owner' ? 'admin_panel_settings' : role === 'manager' ? 'manage_accounts' : 'person'}
                    size={20}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {roleLabels[role as keyof typeof roleLabels]}
                    </p>
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white dark:bg-surface-dark rounded-t-3xl p-6 safe-area-pb animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Invite Team Member
              </h2>
              <button onClick={() => setShowInvite(false)}>
                <Icon name="close" size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                leftIcon="email"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['manager', 'staff'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setInviteRole(role)}
                      className={`p-3 rounded-xl border-2 text-left transition-colors ${
                        inviteRole === role
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <p className={`font-medium ${
                        inviteRole === role ? 'text-primary' : 'text-slate-900 dark:text-white'
                      }`}>
                        {roleLabels[role]}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {roleDescriptions[role]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleInvite}
                isLoading={isSending}
                disabled={!inviteEmail.trim()}
                leftIcon="send"
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
