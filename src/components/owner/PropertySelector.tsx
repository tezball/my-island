import Icon from '../ui/Icon'
import { useProperty } from '../../context/PropertyContext'

interface PropertySelectorProps {
  showAllOption?: boolean
  label?: string
  className?: string
}

export default function PropertySelector({
  showAllOption = true,
  label = 'Property',
  className = '',
}: PropertySelectorProps) {
  const { campsites, selectedCampsiteId, setSelectedCampsiteId, isLoading } = useProperty()

  // Don't render if only one property and no "all" option needed
  if (campsites.length <= 1 && !showAllOption) {
    return null
  }

  // Don't render if no properties
  if (campsites.length === 0) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={selectedCampsiteId}
          onChange={(e) => setSelectedCampsiteId(e.target.value as string | 'all')}
          disabled={isLoading}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showAllOption && campsites.length > 1 && (
            <option value="all">All Properties ({campsites.length})</option>
          )}
          {campsites.map((campsite) => (
            <option key={campsite.id} value={campsite.id}>
              {campsite.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon
            name={isLoading ? 'sync' : 'expand_more'}
            size={20}
            className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}
