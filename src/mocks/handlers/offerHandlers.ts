import { http, HttpResponse, delay } from 'msw'
import { mockOffers } from '../data/offers'

export const offerHandlers = [
  http.get('/api/offers', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const category = url.searchParams.get('category')

    let results = [...mockOffers]

    if (category && category !== 'all') {
      results = results.filter(o => o.category === category)
    }

    return HttpResponse.json({
      offers: results,
      total: results.length,
    })
  }),

  http.get('/api/offers/:id', async ({ params }) => {
    await delay(300)
    const offer = mockOffers.find(o => o.id === params.id)

    if (!offer) {
      return HttpResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ offer })
  }),
]
