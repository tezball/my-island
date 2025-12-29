import { authHandlers } from './authHandlers'
import { campsiteHandlers } from './campsiteHandlers'
import { bookingHandlers } from './bookingHandlers'
import { offerHandlers } from './offerHandlers'

export const handlers = [
  ...authHandlers,
  ...campsiteHandlers,
  ...bookingHandlers,
  ...offerHandlers,
]
