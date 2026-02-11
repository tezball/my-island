# Notification

## Status
Partial — Backend stores and retrieves notifications; no email/push delivery yet.

## Overview
Event-driven notification system. Domain events (booking created, offer claimed, etc.) are published to Kafka and consumed by the `NotificationEventListener`, which creates notification records in the database. The frontend polls for notifications via the API.

## Key Entities

- **Notification** — A user-facing notification record. Contains the user ID, type, title, message, read status, and a reference to the related entity (booking, offer, etc.).

## Notification Types
`BOOKING` | `REVIEW` | `OFFER` | `SYSTEM` | `REMINDER`

## Domain Events Consumed

| Event | Notification Created |
|-------|---------------------|
| `BookingCreated` | Owner notified of new booking |
| `BookingConfirmed` | Guest notified of confirmation |
| `BookingCancelled` | Both parties notified |
| `OfferClaimed` | Supplier notified of claim |
| `ReviewSubmitted` | Owner/supplier notified |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notifications` | Get current user's notifications |
| PUT | `/api/notifications/{id}/read` | Mark notification as read |

## Frontend
- **NotificationService** — Fetches notifications from API
- Notification bell in Header component

## Email Notifications (Implemented)
- Welcome email on signup
- Booking created (to owner and guest)
- Booking confirmed (to guest)
- Booking cancelled (to owner and guest)
- Offer claimed (to supplier)
- Voucher (to guest)
- Password reset
- Email verification
- Weekly summary (to owner)
- **Pre-arrival email** — Sent 2 days before check-in with booking details, property contact info, Google Maps directions link, and marketplace CTA

## Not Yet Implemented
- Push notifications
- SMS notifications
- Real-time WebSocket updates
