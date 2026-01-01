import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import StatCard from '../../components/ui/StatCard'
import Icon from '../../components/ui/Icon'
import LineChart from '../../components/charts/LineChart'
import BarChart from '../../components/charts/BarChart'
import { ownerStats, revenueData, ownerCampsites } from '../../data/mockData'

type TimePeriod = 'week' | 'month' | 'year'

export default function OwnerStatsPage() {
  const [period, setPeriod] = useState<TimePeriod>('month')

  const campsite = ownerCampsites[0]

  // Transform revenue data for charts
  const revenueChartData = revenueData.map(d => ({
    name: d.month,
    value: d.revenue,
  }))

  const bookingsChartData = revenueData.map(d => ({
    name: d.month,
    value: d.bookings,
  }))

  // Calculate revenue breakdown (mock data)
  const revenueBreakdown = [
    { label: 'Stays', value: 70, color: '#13ec80' },
    { label: 'Services', value: 15, color: '#0eb562' },
    { label: 'Goods', value: 15, color: '#84ffc2' },
  ]

  return (
    <AppShell
      showBack
      headerTitle="Performance"
      showNav={false}
      headerRightAction={
        <button>
          <Icon name="download" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Campsite Selector */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white">
            <option>{campsite?.name || 'Select Campsite'}</option>
          </select>
        </div>

        {/* Period Tabs */}
        <div className="p-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['week', 'month', 'year'] as TimePeriod[]).map(p => (
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
            value={`€${ownerStats.revenue.toLocaleString()}`}
            label="Revenue"
            trend={ownerStats.revenueChange}
            trendDirection={ownerStats.revenueChange >= 0 ? 'up' : 'down'}
          />
          <StatCard
            icon="hotel"
            value={`${ownerStats.occupancyRate}%`}
            label="Occupancy"
            trend={5}
            trendDirection="up"
          />
        </div>

        {/* Revenue Chart */}
        <div className="p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Revenue Over Time
            </h3>
            <LineChart data={revenueChartData} height={180} />
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="px-4 pb-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Booking Trends
            </h3>
            <BarChart data={bookingsChartData} height={180} />
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="px-4 pb-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Revenue Breakdown
            </h3>
            <div className="flex items-center gap-6">
              {/* Simple donut visualization */}
              <div className="relative size-24 shrink-0">
                <svg viewBox="0 0 36 36" className="size-24">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#13ec80"
                    strokeWidth="3"
                    strokeDasharray="70 100"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#0eb562"
                    strokeWidth="3"
                    strokeDasharray="15 100"
                    strokeDashoffset="-70"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                {revenueBreakdown.map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Dates */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Popular Dates
            </h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Bank Holiday Weekend
                </p>
                <p className="text-sm text-slate-500">3 nights min.</p>
              </div>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                <Icon name="lock" size={12} />
                Sold Out
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Early Autumn Special
                </p>
                <p className="text-sm text-slate-500">High demand</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs font-medium rounded-full">
                85% Booked
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
