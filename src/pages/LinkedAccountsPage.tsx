import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

interface LinkedAccount {
  id: string
  provider: 'google' | 'apple' | 'facebook'
  email?: string
  connected: boolean
  icon: string
  label: string
  color: string
}

export default function LinkedAccountsPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    {
      id: 'google',
      provider: 'google',
      email: 'user@gmail.com',
      connected: true,
      icon: 'g_mobiledata',
      label: 'Google',
      color: '#4285F4',
    },
    {
      id: 'apple',
      provider: 'apple',
      connected: false,
      icon: 'apple',
      label: 'Apple',
      color: '#000000',
    },
    {
      id: 'facebook',
      provider: 'facebook',
      connected: false,
      icon: 'facebook',
      label: 'Facebook',
      color: '#1877F2',
    },
  ])

  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const handleToggleAccount = async (id: string) => {
    setIsConnecting(id)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAccounts(prev =>
      prev.map(acc =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    )
    setIsConnecting(null)
  }

  return (
    <AppShell showBack headerTitle="Linked Accounts" showNav={false}>
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Connect your social accounts for faster sign-in and enhanced security.
          </p>

          <div className="space-y-3">
            {accounts.map(account => (
              <div
                key={account.id}
                className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${account.color}15` }}
                    >
                      <Icon name={account.icon} size={24} color={account.color} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {account.label}
                      </p>
                      {account.connected && account.email ? (
                        <p className="text-sm text-slate-500">{account.email}</p>
                      ) : (
                        <p className="text-sm text-slate-400">Not connected</p>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={account.connected ? 'secondary' : 'primary'}
                    onClick={() => handleToggleAccount(account.id)}
                    isLoading={isConnecting === account.id}
                  >
                    {account.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {account.connected && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Icon name="check_circle" size={16} />
                      <span className="text-sm">Connected for sign-in</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="p-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon name="security" size={24} className="text-primary shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  Enhanced Security
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Linked accounts use industry-standard OAuth 2.0 authentication. We never store your social media passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
