import { http, HttpResponse, delay } from 'msw'

export interface Lot {
  id: string
  name: string
  type: 'tent' | 'rv' | 'cabin' | 'glamping'
  capacity: number
  price: number
  status: 'available' | 'booked' | 'maintenance'
  image: string
  size?: string
  amenities?: string[]
}

// In-memory store for lots (persists during session)
let lots: Lot[] = [
  {
    id: '1',
    name: 'Riverside Tent Site #1',
    type: 'tent',
    capacity: 4,
    price: 45,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
    amenities: ['Fire Pit', 'Picnic Table'],
  },
  {
    id: '2',
    name: 'Forest Cabin #3',
    type: 'cabin',
    capacity: 6,
    price: 150,
    status: 'booked',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=200',
    amenities: ['Electric', 'Water', 'Wi-Fi'],
  },
  {
    id: '3',
    name: 'Lakeside Glamping Pod',
    type: 'glamping',
    capacity: 2,
    price: 180,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
    amenities: ['Electric', 'Water', 'Wi-Fi', 'Fire Pit'],
  },
  {
    id: '4',
    name: 'RV Hookup Spot #5',
    type: 'rv',
    capacity: 8,
    price: 65,
    status: 'maintenance',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200',
    amenities: ['Electric', 'Water'],
  },
]

// Default images by type
const DEFAULT_IMAGES: Record<Lot['type'], string> = {
  tent: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
  rv: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200',
  cabin: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=200',
  glamping: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
}

export const lotsHandlers = [
  // Get all lots
  http.get('/api/lots', async () => {
    await delay(300)
    return HttpResponse.json({ lots })
  }),

  // Get single lot by ID
  http.get('/api/lots/:id', async ({ params }) => {
    await delay(200)
    const lot = lots.find((l) => l.id === params.id)
    if (!lot) {
      return HttpResponse.json({ error: 'Lot not found' }, { status: 404 })
    }
    return HttpResponse.json({ lot })
  }),

  // Create new lot
  http.post('/api/lots', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as Partial<Lot>

    const newLot: Lot = {
      id: String(Date.now()),
      name: body.name || 'New Lot',
      type: body.type || 'tent',
      capacity: body.capacity || 4,
      price: body.price || 50,
      status: body.status || 'available',
      image: body.image || DEFAULT_IMAGES[body.type || 'tent'],
      size: body.size,
      amenities: body.amenities || [],
    }

    lots = [...lots, newLot]

    return HttpResponse.json({ lot: newLot }, { status: 201 })
  }),

  // Update lot
  http.patch('/api/lots/:id', async ({ params, request }) => {
    await delay(300)
    const body = (await request.json()) as Partial<Lot>
    const index = lots.findIndex((l) => l.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: 'Lot not found' }, { status: 404 })
    }

    lots[index] = { ...lots[index], ...body }
    return HttpResponse.json({ lot: lots[index] })
  }),

  // Delete lot
  http.delete('/api/lots/:id', async ({ params }) => {
    await delay(300)
    const index = lots.findIndex((l) => l.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: 'Lot not found' }, { status: 404 })
    }

    lots = lots.filter((l) => l.id !== params.id)
    return HttpResponse.json({ success: true })
  }),
]
