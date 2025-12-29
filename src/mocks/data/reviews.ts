// Mock reviews data
export interface Review {
  id: string
  campsiteId: string
  campsiteName: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  date: string
  photos?: string[]
  helpful: number
  response?: {
    from: string
    content: string
    date: string
  }
}

export const reviews: Review[] = [
  {
    id: '1',
    campsiteId: '1',
    campsiteName: 'Wild Atlantic Camp',
    userId: 'user-1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Absolutely magical experience!',
    content: 'We had the most incredible weekend here. The views of the Atlantic are breathtaking, especially at sunset. The facilities were spotless and the hosts were so welcoming. Can\'t wait to come back!',
    date: '2024-12-10',
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=400',
    ],
    helpful: 12,
    response: {
      from: 'Wild Atlantic Camp',
      content: 'Thank you so much Sarah! We loved having you and hope to see you again soon!',
      date: '2024-12-11',
    },
  },
  {
    id: '2',
    campsiteId: '1',
    campsiteName: 'Wild Atlantic Camp',
    userId: 'user-2',
    userName: 'Mike O\'Brien',
    rating: 4,
    title: 'Great location, minor issues',
    content: 'The location is unbeatable and the glamping pods are cozy. Only issue was the WiFi was a bit spotty. But honestly, you\'re here to disconnect anyway!',
    date: '2024-12-05',
    helpful: 8,
  },
  {
    id: '3',
    campsiteId: '2',
    campsiteName: 'Connemara Glamping',
    userId: 'user-3',
    userName: 'Emma Walsh',
    rating: 5,
    title: 'Perfect romantic getaway',
    content: 'Booked this for our anniversary and it exceeded all expectations. The hot tub under the stars was amazing. Staff arranged a lovely champagne welcome.',
    date: '2024-12-01',
    photos: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400',
    ],
    helpful: 15,
  },
  {
    id: '4',
    campsiteId: '3',
    campsiteName: 'Burren Basecamp',
    userId: 'user-4',
    userName: 'James K.',
    rating: 5,
    title: 'Best family camping trip ever',
    content: 'Kids loved the adventure activities. The rock climbing and caving experiences were well organized and safe. Facilities are excellent for families.',
    date: '2024-11-28',
    helpful: 20,
  },
  {
    id: '5',
    campsiteId: '4',
    campsiteName: 'Ring of Kerry RV Park',
    userId: 'user-5',
    userName: 'David & Sue',
    rating: 4,
    title: 'Great for touring the Ring',
    content: 'Perfect base for exploring the Ring of Kerry. Spacious pitches, clean facilities, and the on-site cafe does a lovely breakfast.',
    date: '2024-11-20',
    helpful: 6,
  },
  {
    id: '6',
    campsiteId: '5',
    campsiteName: 'Cliffs of Moher Camping',
    userId: 'user-6',
    userName: 'Anna P.',
    rating: 5,
    title: 'Wake up to the best views in Ireland',
    content: 'Literally 5 minutes walk to the Cliffs. Watched the sunset from our tent and it was unforgettable. Simple facilities but everything you need.',
    date: '2024-11-15',
    photos: [
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400',
      'https://images.unsplash.com/photo-1564668662824-6c1ba8f82e66?w=400',
    ],
    helpful: 25,
  },
  {
    id: '7',
    campsiteId: '1',
    campsiteName: 'Wild Atlantic Camp',
    userId: 'user-7',
    userName: 'Tom H.',
    rating: 5,
    title: 'Exceeded expectations',
    content: 'Third time staying here and it just keeps getting better. New outdoor kitchen is a game changer. The stargazing nights they run are brilliant.',
    date: '2024-11-10',
    helpful: 9,
  },
  {
    id: '8',
    campsiteId: '6',
    campsiteName: 'Dingle Peninsula Pods',
    userId: 'user-8',
    userName: 'Rachel D.',
    rating: 4,
    title: 'Cozy pods, beautiful area',
    content: 'Loved the pod - so warm and comfortable. Dingle town is a short drive with amazing restaurants. Would have liked better parking closer to the pods.',
    date: '2024-11-05',
    helpful: 7,
  },
]
