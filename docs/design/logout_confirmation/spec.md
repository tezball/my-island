# Logout Confirmation

**Priority:** LOW
**Status:** To Design
**Flow:** Settings > Logout (Modal)

## Purpose
Optional confirmation modal before logging out. Prevents accidental logouts and reminds users of implications.

## Screen Elements

### Modal Overlay
- Semi-transparent dark background
- Centered modal card
- Tap outside to dismiss (acts as cancel)

### Modal Content

#### Header
- **Icon:** Door with arrow / logout icon
- **Heading:** "Log out?"

#### Body
- **Text:** "Are you sure you want to log out of my-island?"

#### Additional Info (optional)
- "You'll need to sign in again to access your bookings."
- Or: "You're currently signed in on 2 other devices"

### Actions (horizontal buttons)
- **Secondary:** "Cancel" (left, outlined)
- **Primary:** "Log Out" (right, filled green)

## Design Notes
- This is a modal, not a full page
- Keep it simple and quick
- Cancel should be easy to tap
- Consider not showing this for power users (setting)

## Events

### Kafka Events
- `onLogout` → `user.logged_out`
  - Triggers: Session invalidation, Audit log

### UI Events
- `onConfirm`: Execute logout, navigate to welcome
- `onCancel`: Dismiss modal, stay on current screen
- `onOutsideTap`: Same as cancel

## Related Screens
- `settings_&_preferences` - Where logout is triggered
- `welcome_to_my-island!` - Destination after logout
- `login_page_1` - Alternative destination

## Implementation Notes
- Can be implemented as bottom sheet on mobile
- Or centered modal on tablet/desktop
- Animation: slide up or fade in
