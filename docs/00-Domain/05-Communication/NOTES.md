# Communication Context Notes

## Purpose
Messaging between guests and hosts.

## Aggregates

- Message
- Notification

## Enums

### NotificationType
- `BOOKING`: Confirmation, updates
- `REVIEW`: New review, owner response
- `OFFER`: Promotional deals
- `SYSTEM`: Platform announcements
- `REMINDER`: Check-in/check-out reminders

## Domain Events
- `MessageSent`: New message -> Recipient notification
