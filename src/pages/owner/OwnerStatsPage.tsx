import { useState, useEffect } from 'react'
import AppShell from '../../components/layout/AppShell'
import StatCard from '../../components/ui/StatCard'
import Icon from '../../components/ui/Icon'
import LineChart from '../../components/charts/LineChart'
import BarChart from '../../components/charts/BarChart'
import Skeleton from '../../components/ui/Skeleton'
import { ownerApi, type OwnerStats, type CampsiteResponse, type RevenueDataPoint } from '../../lib/api/owner'

type TimePeriod = 'week' | 'month' | 'year'

export default function OwnerStatsPage() {
  const [period, setPeriod] = useState<TimePeriod>('month')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [campsite, setCampsite] = useState<CampsiteResponse | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const monthsMap: Record<TimePeriod, number> = { week: 1, month: 6, year: 12 }
        const [statsData, campsitesData, revenueResponse] = await Promise.all([
          ownerApi.getStats(),
          ownerApi.getMyCampsites(),
          ownerApi.getRevenueData(monthsMap[period]),
        ])
        setStats(statsData)
        if (campsitesData.length > 0) {
          setCampsite(campsitesData[0])
        }
        setRevenueData(revenueResponse.monthlyData)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
        setStats({
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          upcomingBookings: 0,
          totalRevenue: 0,
          thisMonthRevenue: 0,
          lastMonthRevenue: 0,
          revenueChange: 0,
          occupancyRate: 0,
          averageRating: 0,
          totalReviews: 0,
          totalCampsites: 0,
          totalLots: 0,
        })
        setRevenueData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [period])

  // Transform revenue data for charts
  const revenueChartData = revenueData.map((d: RevenueDataPoint) => ({
    name: d.month,
    value: d.revenue,
  }))

  const bookingsChartData = revenueData.map((d: RevenueDataPoint) => ({
    name: d.month,
    value: d.bookings,
  }))

  // Revenue breakdown - currently stays are 100% since we only track lot bookings
  // TODO: Add backend support for services and goods revenue tracking
  const totalRevenue = stats?.totalRevenue || 0
  const revenueBreakdown = [
    { label: 'Stays', value: totalRevenue > 0 ? 100 : 0, color: '#13ec80' },
    { label: 'Services', value: 0, color: '#0eb562' },
    { label: 'Goods', value: 0, color: '#84ffc2' },
  ]

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Performance" showNav={false}>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </AppShell>
    )
  }

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
            value={`€${(stats?.totalRevenue || 0).toLocaleString()}`}
            label="Revenue"
            trend={stats?.revenueChange ? Math.round(stats.revenueChange) : 0}
            trendDirection={(stats?.revenueChange || 0) >= 0 ? 'up' : 'down'}
          />
          <StatCard
            icon="hotel"
            value={`${stats?.occupancyRate || 0}%`}
            label="Occupancy"
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
                    strokeDasharray={`${totalRevenue > 0 ? 100 : 0} 100`}
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
                        {item.value === 0 && item.label !== 'Stays' && (
                          <span className="text-xs text-slate-400 ml-1">(Coming soon)</span>
                        )}
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

        {/* Popular Dates - Preview/placeholder until analytics endpoint is built */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Popular Dates
              </h3>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                Preview
              </span>
            </div>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
            Booking trends will appear here once you have more reservations.
          </p>
          <div className="space-y-2 opacity-60">
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
