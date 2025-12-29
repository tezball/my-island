import { authHandlers } from './authHandlers'
import { campsiteHandlers } from './campsiteHandlers'
import { bookingHandlers } from './bookingHandlers'
import { offerHandlers } from './offerHandlers'
import { lotsHandlers } from './lotsHandlers'

export const handlers = [
  ...authHandlers,
  ...campsiteHandlers,
  ...bookingHandlers,
  ...offerHandlers,
  ...lotsHandlers,
]
