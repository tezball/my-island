import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import Icon from '../../components/ui/Icon'
import Toggle from '../../components/ui/Toggle'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import { useProperty } from '../../context/PropertyContext'
import { ownerApi, type OwnerStats } from '../../lib/api/owner'

interface BroadcastAlert {
  id: string
  message: string
  sentAt: string
  sentTo: number
}

export default function OwnerDashboardPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { campsites, isLoading: campsitesLoading } = useProperty()
  const [propertyVisibility, setPropertyVisibility] = useState<Record<string, boolean>>({})
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [broadcastAlerts, setBroadcastAlerts] = useState<BroadcastAlert[]>([])

  // Initialize visibility state and select first property when campsites load
  useEffect(() => {
    if (campsites.length > 0) {
      const visibility: Record<string, boolean> = {}
      campsites.forEach(c => {
        visibility[c.id] = true // Default to visible
      })
      setPropertyVisibility(visibility)
      // Select first property by default for broadcasts
      if (!selectedPropertyId) {
        setSelectedPropertyId(campsites[0].id)
      }
    }
  }, [campsites, selectedPropertyId])

  useEffect(() => {
    async function fetchData() {
      try {
        const statsData = await ownerApi.getStats()
        setStats(statsData)
        // Mock broadcast alerts since no API endpoint exists
        setBroadcastAlerts([])
      } catch (err) {
        console.error('Failed to fetch owner data:', err)
        // Set default stats on error
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
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const togglePropertyVisibility = (propertyId: string) => {
    setPropertyVisibility(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }))
    // In real app, would update via API
    const property = campsites.find(c => c.id === propertyId)
    const newState = !propertyVisibility[propertyId]
    toast.success(
      newState ? 'Property Visible' : 'Property Hidden',
      `${property?.name || 'Property'} is now ${newState ? 'visible' : 'hidden'} on the map`
    )
  }

  // Active guests per property - using mock data until we have a dedicated endpoint
  // In real app, this would come from an API that returns guests per property
  const getActiveGuestsForProperty = (propertyId: string): number => {
    // Mock: distribute confirmed bookings across properties
    const totalConfirmed = stats?.confirmedBookings || 0
    if (campsites.length === 0 || totalConfirmed === 0) return 0
    // Simple distribution for demo - in real app this would be actual per-property data
    const propertyIndex = campsites.findIndex(c => c.id === propertyId)
    if (propertyIndex === -1) return 0
    return Math.floor(totalConfirmed / campsites.length) + (propertyIndex === 0 ? totalConfirmed % campsites.length : 0)
  }

  const selectedProperty = campsites.find(c => c.id === selectedPropertyId)
  const activeGuestsForSelectedProperty = selectedPropertyId ? getActiveGuestsForProperty(selectedPropertyId) : 0

  const handleBroadcast = () => {
    if (!selectedPropertyId || !selectedProperty) {
      toast.error('No Property Selected', 'Please select a property to send the alert to.')
      return
    }
    if (broadcastMessage.trim() && activeGuestsForSelectedProperty > 0) {
      // In real app, would send broadcast via API with propertyId
      toast.success('Alert Sent', `Your message was sent to ${activeGuestsForSelectedProperty} guests at ${selectedProperty.name}.`)
      setBroadcastMessage('')
    } else if (activeGuestsForSelectedProperty === 0) {
      toast.info('No Active Guests', `There are no guests currently checked in at ${selectedProperty.name}.`)
    }
  }

  if (isLoading || campsitesLoading) {
    return (
      <AppShell showBack headerTitle="Admin Dashboard" showNav={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton variant="rectangular" height={100} className="rounded-2xl" />
            <Skeleton variant="rectangular" height={100} className="rounded-2xl" />
          </div>
          {/* Campsite Status Skeleton */}
          <Skeleton variant="rectangular" height={120} className="rounded-2xl" />
          {/* Broadcast Skeleton */}
          <Skeleton variant="rectangular" height={180} className="rounded-2xl" />
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={120} className="rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="Admin Dashboard"
      showNav={false}
      headerRightAction={
        <button onClick={() => navigate('/owner/settings')}>
          <Icon name="settings" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Stats Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <StatCard
            icon="calendar_month"
            value={stats?.totalBookings || 0}
            label="Total bookings"
            trend={stats?.revenueChange && stats.revenueChange > -100 && stats.revenueChange < 1000 ? Math.round(stats.revenueChange) : undefined}
            trendDirection={(stats?.revenueChange || 0) >= 0 ? 'up' : 'down'}
            trendLabel="vs last month"
          />
          <StatCard
            icon="pending_actions"
            value={stats?.pendingBookings || 0}
            label="Pending approval"
          />
        </div>

        {/* Properties Status - Multi-property support */}
        <div className="px-4 mb-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {campsites.length > 1 ? 'Properties Status' : 'Property Status'}
              </h3>
              {campsites.length > 1 && (
                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                  {campsites.length} properties
                </span>
              )}
            </div>

            {/* Property list with toggles */}
            <div className="space-y-3">
              {campsites.map(property => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="location_on" size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {property.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {propertyVisibility[property.id] ? 'Visible on map' : 'Hidden from map'}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={propertyVisibility[property.id] ?? true}
                    onChange={() => togglePropertyVisibility(property.id)}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mt-3">
              <Icon name="info" size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <p>Toggle visibility to show or hide properties from the guest map.</p>
            </div>
          </div>
        </div>

        {/* Broadcast Alert */}
        <div className="px-4 mb-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Send Guest Alert
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Notify guests about fresh supplies, happy hours, or local events.
            </p>

            {/* Property Selector */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Select Property
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm appearance-none cursor-pointer"
              >
                {campsites.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} ({getActiveGuestsForProperty(property.id)} guests)
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value.slice(0, 140))}
              placeholder="Examples: 'Fresh fish market opens in 10 mins!' or 'Live music at the bonfire tonight.'"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">
                {broadcastMessage.length}/140
              </span>
              <Button
                size="sm"
                disabled={!broadcastMessage.trim() || !selectedPropertyId}
                onClick={handleBroadcast}
                rightIcon="send"
              >
                Send Alert
              </Button>
            </div>
            {broadcastMessage.trim() && selectedProperty && (
              <p className="text-xs text-slate-500 mt-2">
                This will send a push notification to {activeGuestsForSelectedProperty} active guests at {selectedProperty.name}.
              </p>
            )}
          </div>
        </div>

        {/* Recent Broadcasts */}
        {broadcastAlerts.length > 0 && (
          <div className="px-4 mb-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Recent Broadcasts
            </h3>
            <div className="space-y-2">
              {broadcastAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Sent to {alert.sentTo} guests • {new Date(alert.sentAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/owner/bookings"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="calendar_month" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                View Bookings
              </span>
              <span className="text-xs text-slate-500">
                {stats?.upcomingBookings || 0} upcoming
              </span>
            </Link>
            <Link
              to="/owner/lots"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="grid_view" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Manage Lots
              </span>
              <span className="text-xs text-slate-500">
                {stats?.totalLots || 0} active
              </span>
            </Link>
            <Link
              to="/owner/extras"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="add_shopping_cart" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Manage Extras
              </span>
              <span className="text-xs text-slate-500">
                Firewood, rentals
              </span>
            </Link>
            <Link
              to="/owner/stats"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="bar_chart" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                View Stats
              </span>
              <span className="text-xs text-slate-500">
                €{(stats?.totalRevenue || 0).toLocaleString()}
              </span>
            </Link>
            <Link
              to="/owner/campsites"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="home" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                My Properties
              </span>
              <span className="text-xs text-slate-500">
                {stats?.totalCampsites || 0} properties
              </span>
            </Link>
            <Link
              to="/owner/property/new"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="add_home" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Add Property
              </span>
              <span className="text-xs text-slate-500">
                Campsite or B&B
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
