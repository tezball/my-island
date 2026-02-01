/**
 * Domain Event - Represents something significant that happened in the domain
 *
 * Domain events are immutable records of facts that have occurred. They are
 * used to communicate between aggregates and bounded contexts.
 */

import type { BrandedId } from '../domain/types/BrandedId';

/**
 * Base interface for all domain events
 */
export interface DomainEvent {
  /** Unique identifier for this event instance */
  readonly eventId: string;
  /** The type/name of the event (e.g., 'BookingCreated') */
  readonly eventType: string;
  /** ID of the aggregate that raised this event */
  readonly aggregateId: string;
  /** Type of the aggregate (e.g., 'Booking', 'Offer') */
  readonly aggregateType: string;
  /** When the event occurred */
  readonly occurredAt: Date;
  /** Optional event payload/data */
  readonly payload?: Record<string, unknown>;
}

/**
 * Options for creating a domain event
 */
export interface CreateDomainEventOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  eventType: string;
  aggregateId: BrandedId<string> | string;
  aggregateType: string;
  payload?: T;
  occurredAt?: Date;
}

/**
 * Creates a new domain event with a unique ID and timestamp
 */
export function createDomainEvent<T extends Record<string, unknown> = Record<string, unknown>>(
  options: CreateDomainEventOptions<T>
): DomainEvent {
  return Object.freeze({
    eventId: crypto.randomUUID(),
    eventType: options.eventType,
    aggregateId: options.aggregateId as string,
    aggregateType: options.aggregateType,
    occurredAt: options.occurredAt ?? new Date(),
    payload: options.payload,
  });
}

// ============================================================================
// Pre-defined Event Types (from DOMAIN_MODEL.md)
// ============================================================================

// Booking Events
export const BookingEventTypes = {
  BOOKING_CREATED: 'BookingCreated',
  BOOKING_CONFIRMED: 'BookingConfirmed',
  BOOKING_CANCELLED: 'BookingCancelled',
  BOOKING_COMPLETED: 'BookingCompleted',
} as const;

// Offer Events
export const OfferEventTypes = {
  OFFER_CREATED: 'OfferCreated',
  OFFER_PUBLISHED: 'OfferPublished',
  OFFER_UNPUBLISHED: 'OfferUnpublished',
  OFFER_UPDATED: 'OfferUpdated',
  OFFER_DELETED: 'OfferDeleted',
} as const;

// User Events
export const UserEventTypes = {
  USER_REGISTERED: 'UserRegistered',
  USER_VERIFIED: 'UserVerified',
  USER_PROFILE_UPDATED: 'UserProfileUpdated',
} as const;

// Supplier Events
export const SupplierEventTypes = {
  SUPPLIER_REGISTERED: 'SupplierRegistered',
  SUPPLIER_VERIFIED: 'SupplierVerified',
  SUPPLIER_PROFILE_UPDATED: 'SupplierProfileUpdated',
} as const;

// Review Events
export const ReviewEventTypes = {
  REVIEW_SUBMITTED: 'ReviewSubmitted',
  REVIEW_APPROVED: 'ReviewApproved',
  REVIEW_REJECTED: 'ReviewRejected',
} as const;

// Payment Events
export const PaymentEventTypes = {
  PAYMENT_INITIATED: 'PaymentInitiated',
  PAYMENT_COMPLETED: 'PaymentCompleted',
  PAYMENT_FAILED: 'PaymentFailed',
  REFUND_INITIATED: 'RefundInitiated',
  REFUND_COMPLETED: 'RefundCompleted',
} as const;

// Message Events
export const MessageEventTypes = {
  MESSAGE_SENT: 'MessageSent',
  MESSAGE_READ: 'MessageRead',
  CONVERSATION_STARTED: 'ConversationStarted',
} as const;

/**
 * All domain event types combined
 */
export const DomainEventTypes = {
  ...BookingEventTypes,
  ...OfferEventTypes,
  ...UserEventTypes,
  ...SupplierEventTypes,
  ...ReviewEventTypes,
  ...PaymentEventTypes,
  ...MessageEventTypes,
} as const;

export type DomainEventType = (typeof DomainEventTypes)[keyof typeof DomainEventTypes];
