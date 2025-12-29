import type { User } from '@/types'

// Visitor user - logs in with email/password
export const mockVisitorUser: User = {
  id: 'u1',
  email: 'visitor@my-island.com',
  name: 'Alex Murphy',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  savedCampsites: ['1', '3', '5', '7', '9', '12', '15', '18'],
  role: 'visitor',
}

// Owner/Admin user - logs in with Google
export const mockOwnerUser: User = {
  id: 'u2',
  email: 'owner@my-island.com',
  name: 'Jordan Blake',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  savedCampsites: [],
  role: 'owner',
}

export const mockUsers: User[] = [mockVisitorUser, mockOwnerUser]

// Test credentials
export const testCredentials = {
  visitor: {
    email: 'visitor@my-island.com',
    password: 'visitor123',
  },
  owner: {
    // Google OAuth - no password needed
    email: 'owner@my-island.com',
  },
}

// Default current user (visitor)
export const mockCurrentUser = mockVisitorUser
