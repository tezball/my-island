import { useState } from 'react'
import { Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock M30: Linked Accounts Page
interface LinkedAccount {
  id: string
  provider: string
  icon: string
  email?: string
  connected: boolean
  color: string
}

const ACCOUNTS: LinkedAccount[] = [
  {
    id: 'google',
    provider: 'Google',
    icon: 'mail',
    email: 'sarah.jenkins@gmail.com',
    connected: true,
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  },
  {
    id: 'apple',
    provider: 'Apple',
    icon: 'phone_iphone',
    email: 's.jenkins@icloud.com',
    connected: true,
    color: 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800',
  },
  {
    id: 'facebook',
    provider: 'Facebook',
    icon: 'group',
    connected: false,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
]

export function LinkedAccountsPage() {
  const [accounts, setAccounts] = useState(ACCOUNTS)

  const toggleAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Linked Accounts" />

      <div className="flex-1 px-4 pb-8">
        {/* Info Banner */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex gap-3">
          <Icon name="info" className="text-blue-600 text-xl shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Link your accounts for faster sign-in and to sync your preferences
            across devices.
          </p>
        </div>

        {/* Connected Accounts */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Your Accounts
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            {accounts.map((account, idx) => (
              <div
                key={account.id}
                className={`flex items-center gap-4 p-4 ${
                  idx !== accounts.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-800'
                    : ''
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.color}`}
                >
                  <Icon name={account.icon} className="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{account.provider}</p>
                  {account.email ? (
                    <p className="text-sm text-gray-500 truncate">
                      {account.email}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">Not connected</p>
                  )}
                </div>
                <button
                  onClick={() => toggleAccount(account.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    account.connected
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
                      : 'bg-primary text-white hover:bg-green-400'
                  }`}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security Note */}
        <section className="mt-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 flex gap-3">
            <Icon
              name="shield"
              className="text-yellow-600 text-xl shrink-0 mt-0.5"
            />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                Security Tip
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Keep at least one account connected to ensure you can always
                access your my-island profile.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Account */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Primary Sign-in Method
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                  <Icon name="mail" />
                </div>
                <div>
                  <p className="font-bold">Google</p>
                  <p className="text-xs text-gray-500">
                    Used for signing in
                  </p>
                </div>
              </div>
              <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                Primary
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
