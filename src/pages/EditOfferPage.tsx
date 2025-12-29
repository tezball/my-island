import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Toggle } from '@/components/ui'
import { cn } from '@/utils/cn'

// Edit Offer Page - from design
export function EditOfferPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('Sunset Glamping Spot')
  const [description, setDescription] = useState(
    'Experience the wild with our premium tent setup. Includes queen bed, heater, and private deck overlooking the valley. Perfect for couples.'
  )
  const [originalPrice, setOriginalPrice] = useState('150.00')
  const [discountedPrice, setDiscountedPrice] = useState('120.00')
  const [expiryDate, setExpiryDate] = useState('Oct 24, 2023')
  const [isActive, setIsActive] = useState(true)

  const handleSave = () => {
    // Would save via API
    navigate('/owner/offers')
  }

  const handleDelete = () => {
    // Would delete via API with confirmation
    if (confirm('Are you sure you want to delete this offer?')) {
      navigate('/owner/offers')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <header className="flex-none px-4 pt-12 pb-2 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            <Icon name="arrow_back_ios_new" className="text-2xl" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Edit Offer</h1>
          <button
            onClick={handleDelete}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-red-50 dark:active:bg-red-900/20 text-red-500 transition-colors"
          >
            <Icon name="delete" className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 dark:bg-background-dark pb-24">
        {/* Image Section */}
        <section className="p-4">
          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-800 group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1533873984035-25970ab07461?w=400")',
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <button className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-white dark:hover:bg-black/80 transition-all">
                <Icon name="photo_camera" className="text-primary text-xl" />
                <span className="text-xs font-semibold">Change Photo</span>
              </button>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <form className="flex flex-col gap-6 px-4 pb-8">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold ml-1"
              htmlFor="offer-title"
            >
              Offer Title
            </label>
            <div className="relative">
              <input
                id="offer-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-14 rounded-xl border-transparent bg-white dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-0 shadow-sm text-base font-medium pl-4 pr-10 transition-all"
              />
              <Icon
                name="edit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-xl"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold ml-1"
              htmlFor="offer-desc"
            >
              Description
            </label>
            <div className="relative">
              <textarea
                id="offer-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                className="w-full min-h-[140px] rounded-xl border-transparent bg-white dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-0 shadow-sm text-base font-normal p-4 resize-none transition-all leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-xs font-medium text-gray-400 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                {description.length}/300
              </div>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label
                className="text-sm font-semibold ml-1"
                htmlFor="price-original"
              >
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  id="price-original"
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full h-14 rounded-xl border-transparent bg-white dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-0 shadow-sm text-base font-medium pl-8 pr-4 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label
                className="text-sm font-semibold ml-1"
                htmlFor="price-discount"
              >
                Discounted Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-medium">
                  $
                </span>
                <input
                  id="price-discount"
                  type="number"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="w-full h-14 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-0 shadow-sm text-base font-bold text-primary pl-8 pr-4 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1" htmlFor="offer-expiry">
              Offer Expires
            </label>
            <button
              type="button"
              className="relative flex items-center w-full h-14 rounded-xl bg-white dark:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm px-4 transition-all group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 mr-3 group-hover:scale-105 transition-transform">
                <Icon name="calendar_today" className="text-primary text-xl" />
              </span>
              <span className="flex-1 text-left text-base font-medium">{expiryDate}</span>
              <Icon name="expand_more" className="text-gray-400 text-xl" />
            </button>
          </div>

          {/* Active Toggle */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-transparent">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Active Offer</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Make visible to campers
                </span>
              </div>
              <Toggle checked={isActive} onChange={setIsActive} />
            </div>
          </div>
        </form>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="flex-none bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3 max-w-[480px] mx-auto w-full">
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center rounded-xl h-14 bg-primary hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 text-black font-bold text-base tracking-wide"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center rounded-xl h-12 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium text-base transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
