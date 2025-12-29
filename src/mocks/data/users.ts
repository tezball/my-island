import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'demo@my-island.com',
    name: 'Alex Murphy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    savedCampsites: ['1', '3', '5', '7', '9', '12', '15', '18'],
  },
]

export const mockCurrentUser = mockUsers[0]
