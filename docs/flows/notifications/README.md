# Notifications Flow

The notifications flow manages user alerts, updates, and communication preferences.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Notification Center | `01-notification-center.png` | Main notifications hub |
| 2 | Notifications List | `02-notifications-list.png` | All notifications inbox |
| 3 | Notification Detail | `03-notification-detail.png` | Expanded notification view |
| 4 | Notification Settings | `04-notification-settings.png` | Preferences and toggles |

## User Stories

### US-NOTIF-001: View Notification Center
**As a** user
**I want to** access my notification center
**So that** I can see all my alerts and updates

**Acceptance Criteria:**
- Bell icon in header shows unread count badge
- Tapping opens notification center
- Recent notifications displayed
- Clear visual hierarchy (unread vs read)
- Quick access to all notifications

---

### US-NOTIF-002: View All Notifications
**As a** user
**I want to** see all my notifications
**So that** I don't miss any important updates

**Acceptance Criteria:**
- Full list of all notifications
- Sorted by date (newest first)
- Unread notifications highlighted
- Notification type icons (booking, offer, review, etc.)
- Infinite scroll or pagination
- Pull to refresh

---

### US-NOTIF-003: View Notification Detail
**As a** user
**I want to** view full notification content
**So that** I can understand the complete message

**Acceptance Criteria:**
- Tap notification to expand
- Full message displayed
- Related action buttons (view booking, etc.)
- Timestamp shown
- Mark as read automatically
- Back navigation to list

---

### US-NOTIF-004: Mark Notification as Read
**As a** user
**I want to** mark notifications as read
**So that** I can track what I've seen

**Acceptance Criteria:**
- Auto-mark read when opened
- Manual mark read option
- Mark all as read action
- Visual change when read (dimmed/no badge)
- Unread count updates

---

### US-NOTIF-005: Delete Notification
**As a** user
**I want to** delete notifications
**So that** I can clean up my inbox

**Acceptance Criteria:**
- Swipe to delete gesture
- Delete confirmation (or undo)
- Batch delete option
- Clear all notifications option
- Cannot recover deleted notifications

---

### US-NOTIF-006: Manage Notification Preferences
**As a** user
**I want to** control which notifications I receive
**So that** I only get relevant alerts

**Acceptance Criteria:**
- Toggle for push notifications (master on/off)
- Category toggles:
  - Booking confirmations
  - Booking reminders
  - Check-in reminders
  - Price alerts
  - Promotional offers
  - New reviews
  - Messages from hosts
- Email notification preferences
- Changes saved automatically
- Test notification option

---

### US-NOTIF-007: Receive Push Notification
**As a** user with notifications enabled
**I want to** receive push notifications
**So that** I'm alerted to important updates in real-time

**Acceptance Criteria:**
- Push notification appears on device
- Tapping opens relevant screen
- Badge count on app icon
- Notification sound/vibration (based on device settings)
- Works when app is closed

---

### US-NOTIF-008: Filter Notifications by Type
**As a** user with many notifications
**I want to** filter by notification type
**So that** I can find specific alerts

**Acceptance Criteria:**
- Filter chips: All, Bookings, Offers, Reviews, System
- Active filter highlighted
- Results update immediately
- Count per filter shown

---

## Flow Diagram

```
┌─────────────────────────────────┐
│        Any Screen               │
│                                 │
│    Header: [...] [🔔 3] [👤]   │
└──────────────┬──────────────────┘
               │ Tap Bell
               ▼
┌─────────────────────────────────┐
│     Notification Center         │
│                                 │
│  Recent Notifications           │
│  ┌─────────────────────────┐   │
│  │ 🔵 Booking Confirmed    │   │
│  │    Your stay at...      │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🔵 New Offer Available  │   │
│  │    20% off at...        │   │
│  └─────────────────────────┘   │
│                                 │
│  [See All Notifications]        │
│  [Notification Settings ⚙️]     │
└──────────────┬──────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│Notifications│ │Notification │
│    List     │ │  Settings   │
└──────┬──────┘ └─────────────┘
       │
       ▼ Tap Notification
┌─────────────────────────────────┐
│    Notification Detail          │
│                                 │
│  Booking Confirmed! ✓           │
│                                 │
│  Your booking at Sunny Valley   │
│  Campsite has been confirmed.   │
│                                 │
│  Check-in: Jan 15, 2025         │
│  Check-out: Jan 18, 2025        │
│                                 │
│  [View Booking]                 │
└─────────────────────────────────┘
```

## Notification Types

| Type | Icon | Description |
|------|------|-------------|
| Booking Confirmed | ✓ | Reservation confirmation |
| Booking Reminder | 📅 | Upcoming check-in reminder |
| Booking Modified | ✏️ | Changes to reservation |
| Booking Cancelled | ✗ | Cancellation confirmation |
| Payment | 💳 | Payment received/failed |
| New Offer | 🏷️ | Promotional deal available |
| Price Alert | 📉 | Price drop on favorited campsite |
| New Review | ⭐ | Review received (for owners) |
| Message | 💬 | Message from host/guest |
| System | ℹ️ | App updates, policy changes |

## Related Pages

- `src/pages/NotificationsListPage.tsx`
- `src/pages/NotificationDetailPage.tsx`
- `src/pages/NotificationSettingsPage.tsx`

## Notes

- Push notifications require user permission
- Implement notification grouping for similar alerts
- Consider quiet hours setting
- Store notification preferences server-side
- Rate limit notifications to prevent spam
