# Communication

## Status
Planned — Kafka event infrastructure exists, but no messaging UI or email delivery.

## Overview
Will provide guest-to-host messaging and email notifications. The Kafka topic infrastructure for domain events is already in place.

## Planned Features
- Direct messaging between guests and hosts
- Email notifications for booking events
- Check-in/check-out reminders
- Platform announcements

## Existing Infrastructure
- Kafka topics publish domain events (BookingCreated, OfferClaimed, etc.)
- `NotificationEventListener` consumes events and stores notifications (see [notification module](../notification/README.md))
- SES integration planned for email delivery

See [NOTES.md](./NOTES.md) for domain model details.
