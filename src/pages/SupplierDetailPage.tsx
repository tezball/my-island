import { useParams, useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock M14: Supplier Detail Page
interface SupplierInfo {
  id: string
  name: string
  logo: string
  coverImage: string
  category: string
  rating: number
  reviewCount: number
  distance: string
  description: string
  address: string
  phone: string
  website: string
  hours: { day: string; hours: string }[]
  offers: {
    id: string
    title: string
    discount: string
    image: string
    description: string
  }[]
}

const MOCK_SUPPLIER: SupplierInfo = {
  id: '1',
  name: 'Island Fresh Markets',
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy2YKoUpMvPMp7dqUbWbqh8IzXZiCGK5_PAjJ3iVTCm_kkibKtD55vsQ3uxt5VWDkLr6wFzAZ2xd7KiXWHmzqWyiwdv5YbqmXopfD0HvSTb8E2KwkUvgcr_sd4Sr1t5JKrsFdwXaWSrWFlvCyg50ttQl0FEyXLTP_F1CfzgFCAFxQVPGgNdglAyKcy5N_q_TRITSflGuBN3shCcztMoxAE4R2s-4Hm0qKV0weMM4QpwKeYSJfYZ5jFpN0aigXba0aqIN-xT8OKrg',
  coverImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ369Gz9AIhqHB2R3f_0tL5409TFclpMdLnP-R18b06NOp9p6d8r6Nry-ktYfHlrKht0LJPUpc2LYVC7IkURttx5-XCQRoJXbGblIpAFmiLCGFbnXSsqHyyB67D68fgOz2O-_CqkJTSY5ONh1o43exLjSl_c21soDSmFz2sOJO5DTz7Bgts8xLlfW5YZw5axZmJWkLOGZdQEIZiUjvgYgNIt7ctTyoG3KBbZWt8yv3777nA2-bYg_pgmD9mFdCAwTK0g3yvjtt-g',
  category: 'Food & Groceries',
  rating: 4.8,
  reviewCount: 127,
  distance: '1.2km away',
  description:
    'Your one-stop shop for fresh camping provisions. We specialize in ready-to-grill meats, local produce, and all the essentials for your outdoor adventure.',
  address: '42 Harbor Road, Island Bay',
  phone: '+1 (555) 234-5678',
  website: 'www.islandfresh.com',
  hours: [
    { day: 'Monday - Friday', hours: '7:00 AM - 9:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 10:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 8:00 PM' },
  ],
  offers: [
    {
      id: '1',
      title: 'Campfire Kit Special',
      discount: '15% OFF',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ369Gz9AIhqHB2R3f_0tL5409TFclpMdLnP-R18b06NOp9p6d8r6Nry-ktYfHlrKht0LJPUpc2LYVC7IkURttx5-XCQRoJXbGblIpAFmiLCGFbnXSsqHyyB67D68fgOz2O-_CqkJTSY5ONh1o43exLjSl_c21soDSmFz2sOJO5DTz7Bgts8xLlfW5YZw5axZmJWkLOGZdQEIZiUjvgYgNIt7ctTyoG3KBbZWt8yv3777nA2-bYg_pgmD9mFdCAwTK0g3yvjtt-g',
      description:
        'Everything you need for the perfect grill night. Includes marinated steaks, corn, and spice rub.',
    },
    {
      id: '2',
      title: 'Breakfast Bundle',
      discount: '10% OFF',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBPiK77LOZOJmO4mkpRFQ1kClmAN4lyzLTjXQDUD3DQaTOgAjOFaTKHyT-C6Rehm4xmNSHAbzVbswGIjguVnJBEWaV4PtL53rq6AYEEPCmSXIczxfLVwQDkS_xNy1PKpJsdAxwBZ3AYavnggk5s_ua0F2iT7-xORwUZOqvifDedMjgoXnD9x9YuffaW2fomuurtKElbRKKdPaclKQCLHSfGJgJrxWASg42kqDp2jlUSI3QiAe5sOBpcrTi7OTy2FVHqg8kvcJSXnA',
      description:
        'Fresh eggs, bacon, orange juice, and pancake mix - wake up right!',
    },
  ],
}

export function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const supplier = MOCK_SUPPLIER

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={supplier.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
        >
          <Icon name="arrow_back" />
        </button>

        {/* Share Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
          <Icon name="share" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="relative px-4 -mt-12">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-2xl bg-white dark:bg-surface-dark shadow-lg overflow-hidden border-4 border-background-light dark:border-background-dark">
            <img
              src={supplier.logo}
              alt={supplier.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-xl font-bold">{supplier.name}</h1>
            <p className="text-sm text-gray-500">{supplier.category}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <Icon name="star" filled className="text-yellow-500" />
            <span className="font-bold">{supplier.rating}</span>
            <span className="text-gray-500 text-sm">
              ({supplier.reviewCount})
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-1 text-gray-500">
            <Icon name="location_on" className="text-sm" />
            <span className="text-sm">{supplier.distance}</span>
          </div>
          <div className="flex-1" />
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            Open Now
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mt-6">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {supplier.description}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6 flex gap-3">
        <Button className="flex-1" leftIcon="near_me">
          Directions
        </Button>
        <Button variant="secondary" className="flex-1" leftIcon="phone">
          Call
        </Button>
        <button className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-surface-dark flex items-center justify-center">
          <Icon name="bookmark_border" />
        </button>
      </div>

      {/* Current Offers */}
      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4">Current Offers</h2>
        <div className="space-y-4">
          {supplier.offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative aspect-video">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                  {offer.discount}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{offer.title}</h3>
                <p className="text-sm text-gray-500">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4">Contact & Hours</h2>
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <Icon name="location_on" className="text-gray-400" />
            <div>
              <p className="font-medium">{supplier.address}</p>
              <p className="text-sm text-primary">Get directions</p>
            </div>
          </div>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <Icon name="phone" className="text-gray-400" />
            <div>
              <p className="font-medium">{supplier.phone}</p>
              <p className="text-sm text-primary">Call now</p>
            </div>
          </div>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <Icon name="language" className="text-gray-400" />
            <div>
              <p className="font-medium">{supplier.website}</p>
              <p className="text-sm text-primary">Visit website</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-4">
              <Icon name="schedule" className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                {supplier.hours.map((schedule, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span className="text-gray-500">{schedule.day}</span>
                    <span className="font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Padding */}
      <div className="h-8" />
    </div>
  )
}
