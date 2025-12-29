import { http, HttpResponse, delay } from 'msw'
import { mockCampsites } from '../data/campsites'
import { mockCurrentUser } from '../data/users'

export const campsiteHandlers = [
  http.get('/api/campsites', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase()
    const type = url.searchParams.get('type')
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')

    let results = [...mockCampsites]

    if (query) {
      results = results.filter(
        c => c.name.toLowerCase().includes(query) ||
             c.location.toLowerCase().includes(query)
      )
    }

    if (type) {
      results = results.filter(c => c.type === type)
    }

    if (minPrice) {
      results = results.filter(c => c.pricePerNight >= Number(minPrice))
    }

    if (maxPrice) {
      results = results.filter(c => c.pricePerNight <= Number(maxPrice))
    }

    return HttpResponse.json({
      campsites: results,
      total: results.length,
    })
  }),

  http.get('/api/campsites/:id', async ({ params }) => {
    await delay(300)
    const campsite = mockCampsites.find(c => c.id === params.id)

    if (!campsite) {
      return HttpResponse.json(
        { error: 'Campsite not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ campsite })
  }),

  http.get('/api/campsites/:id/availability', async ({ params }) => {
    await delay(300)
    const campsite = mockCampsites.find(c => c.id === params.id)
    if (!campsite) {
      return HttpResponse.json(
        { error: 'Campsite not found' },
        { status: 404 }
      )
    }

    // Generate mock availability (most days available)
    const unavailableDates = ['2024-03-10', '2024-03-11', '2024-03-25', '2024-03-26']

    return HttpResponse.json({
      campsiteId: params.id,
      unavailableDates,
    })
  }),

  http.get('/api/favorites', async () => {
    await delay(300)
    const favorites = mockCampsites.filter(c =>
      mockCurrentUser.savedCampsites.includes(c.id)
    )
    return HttpResponse.json({ favorites })
  }),

  http.post('/api/favorites/:campsiteId', async ({ params }) => {
    await delay(200)
    const { campsiteId } = params
    const index = mockCurrentUser.savedCampsites.indexOf(campsiteId as string)

    if (index > -1) {
      mockCurrentUser.savedCampsites.splice(index, 1)
      return HttpResponse.json({ saved: false })
    } else {
      mockCurrentUser.savedCampsites.push(campsiteId as string)
      return HttpResponse.json({ saved: true })
    }
  }),
]
