import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import SearchBar from '../../components/ui/SearchBar'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'

interface Offer {
  id: string
  title: string
  discount: string
  validUntil: string
  status: 'active' | 'expired'
  redemptions: number
}

type FilterStatus = 'all' | 'active' | 'expired'

export default function OfferManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [offers] = useState<Offer[]>([])

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
  ]

  return (
    <AppShell
      showBack
      headerTitle="Manage Offers"
      showNav={false}
      headerRightAction={
        <Link to="/owner/offers/new">
          <Icon name="add" size={24} className="text-primary" />
        </Link>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Search */}
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search offers..."
          />
        </div>

        {/* Filter tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 grid grid-cols-3 gap-3 pb-4">
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-primary">
              {offers.filter(o => o.status === 'active').length}
            </p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {offers.reduce((sum, o) => sum + o.redemptions, 0)}
            </p>
            <p className="text-xs text-slate-500">Redemptions</p>
          </div>
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-emerald-600">€0</p>
            <p className="text-xs text-slate-500">Revenue</p>
          </div>
        </div>

        {/* Offers list */}
        <div className="px-4 space-y-3 pb-24">
          {filteredOffers.map(offer => (
            <div
              key={offer.id}
              className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {offer.title}
                  </h3>
                  <p className="text-primary font-medium">{offer.discount}</p>
                </div>
                <Badge variant={offer.status === 'active' ? 'success' : 'info'}>
                  {offer.status === 'active' ? 'Active' : 'Expired'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <Icon name="schedule" size={16} />
                  Until {new Date(offer.validUntil).toLocaleDateString('en-IE', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="redeem" size={16} />
                  {offer.redemptions} used
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button size="sm" variant="secondary" className="flex-1">
                  <Icon name="edit" size={16} />
                  Edit
                </Button>
                <Button size="sm" variant="secondary" className="flex-1">
                  <Icon name="bar_chart" size={16} />
                  Stats
                </Button>
                {offer.status === 'active' && (
                  <button className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors">
                    <Icon name="pause" size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <Icon name="local_offer" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No offers found</p>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link
        to="/owner/offers/new"
        className="fixed bottom-6 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
      >
        <Icon name="add" size={28} />
      </Link>
    </AppShell>
  )
}
