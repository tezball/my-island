import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M40: Revenue Dashboard Page
type TimePeriod = 'week' | 'month' | 'year'

interface Transaction {
  id: string
  type: 'booking' | 'refund' | 'payout'
  description: string
  amount: number
  date: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'booking',
    description: 'Riverside Tent #7 - Sarah J.',
    amount: 180,
    date: '2024-12-20',
  },
  {
    id: '2',
    type: 'booking',
    description: 'Forest Cabin #3 - Mike P.',
    amount: 450,
    date: '2024-12-19',
  },
  {
    id: '3',
    type: 'payout',
    description: 'Weekly payout to Bank ****1234',
    amount: -1250,
    date: '2024-12-18',
  },
  {
    id: '4',
    type: 'refund',
    description: 'Cancellation - Emma W.',
    amount: -120,
    date: '2024-12-17',
  },
  {
    id: '5',
    type: 'booking',
    description: 'Glamping Pod #1 - James B.',
    amount: 320,
    date: '2024-12-16',
  },
]

const TYPE_STYLES: Record<
  Transaction['type'],
  { icon: string; iconBg: string; iconColor: string }
> = {
  booking: {
    icon: 'payments',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600',
  },
  refund: {
    icon: 'replay',
    iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-600',
  },
  payout: {
    icon: 'account_balance',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600',
  },
}

export function RevenueDashboardPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<TimePeriod>('month')

  const stats = {
    totalRevenue: 4250,
    pendingPayout: 1450,
    thisMonth: 2800,
    lastMonth: 2400,
    change: '+16.7%',
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Revenue"
        rightAction={
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10">
            <Icon name="download" />
          </button>
        }
      />

      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        {/* Period Selector */}
        <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl mt-4 mb-6">
          {(['week', 'month', 'year'] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize',
                period === p
                  ? 'bg-white dark:bg-background-dark shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Revenue Summary Card */}
        <section className="bg-gradient-to-br from-primary to-emerald-500 rounded-2xl p-6 mb-6 text-black relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-black/70 mb-1">Total Revenue</p>
            <p className="text-4xl font-bold mb-4">
              €{stats.totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-black/20 px-2 py-0.5 rounded-full font-semibold">
                {stats.change}
              </span>
              <span className="text-black/70">vs last {period}</span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Icon name="schedule" className="text-lg" />
              <span className="text-xs font-medium uppercase">Pending</span>
            </div>
            <p className="text-2xl font-bold">€{stats.pendingPayout.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Next payout in 3 days</p>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Icon name="calendar_month" className="text-lg" />
              <span className="text-xs font-medium uppercase">This Month</span>
            </div>
            <p className="text-2xl font-bold">€{stats.thisMonth.toLocaleString()}</p>
            <p className="text-xs text-primary mt-1">
              vs €{stats.lastMonth.toLocaleString()} last month
            </p>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-6">
          <h3 className="font-bold mb-4">Revenue Trend</h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 70, 90].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-gray-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Transactions</h3>
            <button className="text-sm font-semibold text-primary">View All</button>
          </div>

          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((tx) => {
              const style = TYPE_STYLES[tx.type]
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      style.iconBg,
                      style.iconColor
                    )}
                  >
                    <Icon name={style.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <p
                    className={cn(
                      'font-bold text-sm',
                      tx.amount > 0 ? 'text-green-600' : 'text-gray-600'
                    )}
                  >
                    {tx.amount > 0 ? '+' : ''}€{Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Payout Settings Link */}
        <button
          onClick={() => navigate('/owner/settings')}
          className="w-full mt-6 flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-600">
              <Icon name="account_balance" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Payout Settings</p>
              <p className="text-xs text-gray-500">Bank account ending in 1234</p>
            </div>
          </div>
          <Icon name="chevron_right" className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}
