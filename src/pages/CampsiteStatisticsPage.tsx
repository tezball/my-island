import { useState } from 'react'
import { Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Campsite Statistics Page - from design
type DateRange = 'week' | 'month' | 'year'

interface KPICard {
  icon: string
  iconColor: string
  label: string
  value: string
  change: string
}

const KPI_CARDS: KPICard[] = [
  {
    icon: 'payments',
    iconColor: 'bg-primary/10 text-primary',
    label: 'Revenue',
    value: '$4,250',
    change: '+15%',
  },
  {
    icon: 'bed',
    iconColor: 'bg-blue-100 dark:bg-blue-900/20 text-blue-500',
    label: 'Occupancy',
    value: '78%',
    change: '+5%',
  },
  {
    icon: 'visibility',
    iconColor: 'bg-orange-100 dark:bg-orange-900/20 text-orange-500',
    label: 'Page Views',
    value: '1,204',
    change: '+12%',
  },
]

const BOOKING_DATA = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 65 },
  { month: 'Mar', value: 85 },
  { month: 'Apr', value: 55 },
  { month: 'May', value: 70 },
]

const POPULAR_DATES = [
  {
    month: 'Aug',
    day: 24,
    title: 'Labor Day Weekend',
    subtitle: '3 nights min.',
    status: 'sold_out' as const,
  },
  {
    month: 'Sep',
    day: 2,
    title: 'Early Autumn Special',
    subtitle: 'High demand',
    status: 'high_demand' as const,
    percentage: 85,
  },
]

export function CampsiteStatisticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('month')
  const [selectedCampsite, setSelectedCampsite] = useState('1')

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Performance"
        rightAction={
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10">
            <Icon name="download" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
        {/* Campsite Selector */}
        <div className="px-4 py-2">
          <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Select Campsite
          </label>
          <div className="relative">
            <select
              value={selectedCampsite}
              onChange={(e) => setSelectedCampsite(e.target.value)}
              className="w-full h-14 pl-4 pr-10 rounded-xl bg-white dark:bg-surface-dark border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary font-semibold text-base appearance-none shadow-sm"
            >
              <option value="1">Sunny Valley Camp</option>
              <option value="2">Pine Ridge Haven</option>
              <option value="3">Emerald Lake Spot</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-primary">
              <Icon name="expand_more" />
            </div>
          </div>
        </div>

        {/* Date Range Segmented Control */}
        <div className="px-4 py-4">
          <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl">
            {(['week', 'month', 'year'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize',
                  dateRange === range
                    ? 'bg-white dark:bg-background-dark shadow-sm ring-1 ring-black/5 dark:ring-white/10 font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3 px-4 pb-2">
          {KPI_CARDS.map((card) => (
            <div
              key={card.label}
              className="p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col gap-2"
            >
              <div
                className={cn(
                  'p-2 rounded-full w-fit',
                  card.iconColor
                )}
              >
                <Icon name={card.icon} className="text-lg" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="text-xl font-bold tracking-tight">
                  {card.value}
                </p>
              </div>
              <div className="flex items-center gap-1 text-primary text-[10px] font-bold bg-primary/10 w-fit px-1.5 py-0.5 rounded-md">
                <Icon name="trending_up" className="text-xs" />
                <span>{card.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Views Over Time Chart */}
        <div className="px-4 py-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-base font-bold">Views Over Time</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Daily traffic for current month
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">1,204</p>
              </div>
            </div>

            {/* Simple Chart Placeholder */}
            <div className="relative w-full h-48 bg-gradient-to-t from-primary/10 to-transparent rounded-lg flex items-end">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,40 Q10,35 20,25 T40,20 T60,30 T80,10 T100,25"
                  fill="none"
                  stroke="#13ec80"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>
        </div>

        {/* Booking Trends & Revenue Breakdown */}
        <div className="flex flex-col gap-6 px-4">
          {/* Booking Trends */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5">
            <h3 className="text-base font-bold mb-4">Booking Trends</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {BOOKING_DATA.map((item, idx) => (
                <div
                  key={item.month}
                  className="flex flex-col items-center gap-2 flex-1 group cursor-pointer"
                >
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg relative h-full flex items-end overflow-hidden">
                    <div
                      className={cn(
                        'w-full rounded-t-lg transition-all',
                        idx === 2 ? 'bg-primary' : 'bg-primary/40 group-hover:bg-primary/60'
                      )}
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      idx === 2 ? 'font-bold' : 'text-gray-500'
                    )}
                  >
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5">
            <h3 className="text-base font-bold mb-6">Revenue Breakdown</h3>
            <div className="flex items-center gap-6">
              {/* Donut Chart Placeholder */}
              <div className="relative w-32 h-32 shrink-0">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      'conic-gradient(#13ec80 0% 70%, #064e3b 70% 85%, #d1fae5 85% 100%)',
                  }}
                />
                <div className="absolute inset-0 m-auto w-20 h-20 bg-white dark:bg-surface-dark rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-gray-500">Source</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm">Stays</span>
                  </div>
                  <span className="text-sm font-bold">70%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-900" />
                    <span className="text-sm">Services</span>
                  </div>
                  <span className="text-sm font-bold">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-100" />
                    <span className="text-sm">Goods</span>
                  </div>
                  <span className="text-sm font-bold">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Dates */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Popular Dates</h3>
              <button className="text-sm font-semibold text-primary hover:text-primary/80">
                View All
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {POPULAR_DATES.map((date) => (
                <div
                  key={`${date.month}-${date.day}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-background-light dark:bg-background-dark/50"
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-surface-dark shadow-sm text-center">
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase',
                        date.status === 'sold_out' ? 'text-red-500' : 'text-primary'
                      )}
                    >
                      {date.month}
                    </span>
                    <span className="text-lg font-bold leading-none">{date.day}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{date.title}</p>
                    <p className="text-xs text-gray-500">{date.subtitle}</p>
                  </div>
                  {date.status === 'sold_out' ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-red-500">Sold Out</span>
                      <Icon name="lock" className="text-red-500 text-sm" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-primary">
                        {date.percentage}% Booked
                      </span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${date.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
