import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import StatCard from '../../components/ui/StatCard'
import Icon from '../../components/ui/Icon'
import LineChart from '../../components/charts/LineChart'
import BarChart from '../../components/charts/BarChart'

type TimePeriod = 'week' | 'month' | 'quarter' | 'year'

const revenueBySource = [
  { name: 'Stays', value: 12500 },
  { name: 'Services', value: 2300 },
  { name: 'Shop', value: 1800 },
  { name: 'Events', value: 900 },
]

const revenueByMonth = [
  { name: 'Jan', value: 3200 },
  { name: 'Feb', value: 2800 },
  { name: 'Mar', value: 4100 },
  { name: 'Apr', value: 5200 },
  { name: 'May', value: 6800 },
  { name: 'Jun', value: 8500 },
]

const topLots = [
  { name: 'Lakeside Premium A1', revenue: 4250, bookings: 28 },
  { name: 'Forest View B3', revenue: 3800, bookings: 24 },
  { name: 'Riverside Spot C2', revenue: 3200, bookings: 21 },
  { name: 'Mountain View D1', revenue: 2900, bookings: 19 },
]

export default function RevenueDashboardPage() {
  const [period, setPeriod] = useState<TimePeriod>('month')

  return (
    <AppShell
      showBack
      headerTitle="Revenue"
      showNav={false}
      headerRightAction={
        <button>
          <Icon name="download" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Period Tabs */}
        <div className="p-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['week', 'month', 'quarter', 'year'] as TimePeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="px-4 grid grid-cols-2 gap-3">
          <StatCard
            icon="payments"
            value="€17,500"
            label="Total Revenue"
            trend={12.5}
            trendDirection="up"
          />
          <StatCard
            icon="trending_up"
            value="€583"
            label="Avg/Day"
            trend={8.2}
            trendDirection="up"
          />
          <StatCard
            icon="receipt_long"
            value="142"
            label="Transactions"
            trend={-3}
            trendDirection="down"
          />
          <StatCard
            icon="person"
            value="€123"
            label="Avg/Booking"
            trend={5.1}
            trendDirection="up"
          />
        </div>

        {/* Revenue Chart */}
        <div className="p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Revenue Trend
              </h3>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Icon name="trending_up" size={14} />
                +23% vs last period
              </span>
            </div>
            <LineChart data={revenueByMonth} height={200} />
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="p-4 pt-0">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Revenue by Source
            </h3>
            <BarChart data={revenueBySource} height={180} />
          </div>
        </div>

        {/* Top Performing Lots */}
        <div className="p-4 pt-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Top Performing Lots
            </h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {topLots.map((lot, i) => (
              <div
                key={lot.name}
                className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    {lot.name}
                  </p>
                  <p className="text-xs text-slate-500">{lot.bookings} bookings</p>
                </div>
                <p className="font-semibold text-emerald-600">€{lot.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Summary */}
        <div className="p-4 pt-0">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <Icon name="account_balance" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium">Next Payout</p>
                <p className="font-bold text-xl text-emerald-700 dark:text-emerald-400">
                  €4,250.00
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-600">Processing: Jan 15, 2025</span>
              <button className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                View Details
                <Icon name="chevron_right" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-4 pt-0 pb-8">
          <button className="w-full flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-medium">
            <Icon name="download" size={20} />
            Export Revenue Report
          </button>
        </div>
      </div>
    </AppShell>
  )
}
