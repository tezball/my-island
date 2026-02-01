/**
 * Marketplace Domain Events
 */

import type { DomainEvent } from '../../../core/events';
import type { OfferCategoryType } from '../domain/valueObjects';

/**
 * Event types for the Marketplace context
 */
export const MarketplaceEventTypes = {
  // Supplier events
  SUPPLIER_REGISTERED: 'SupplierRegistered',
  SUPPLIER_PROFILE_UPDATED: 'SupplierProfileUpdated',
  SUPPLIER_VERIFIED: 'SupplierVerified',
  SUPPLIER_DEACTIVATED: 'SupplierDeactivated',

  // Offer events
  OFFER_PUBLISHED: 'OfferPublished',
  OFFER_UPDATED: 'OfferUpdated',
  OFFER_UNPUBLISHED: 'OfferUnpublished',
  OFFER_DELETED: 'OfferDeleted',
  OFFER_EXPIRED: 'OfferExpired',
  OFFER_SOLD_OUT: 'OfferSoldOut',

  // Claim events
  OFFER_CLAIMED: 'OfferClaimed',
  OFFER_REDEEMED: 'OfferRedeemed',
  CLAIM_EXPIRED: 'ClaimExpired',
} as const;

export type MarketplaceEventType =
  (typeof MarketplaceEventTypes)[keyof typeof MarketplaceEventTypes];

// ============================================================================
// Event Payload Types
// ============================================================================

export interface SupplierRegisteredPayload {
  userId: string;
  businessName: string;
}

export interface SupplierProfileUpdatedPayload {
  updates: string[];
}

export interface OfferPublishedPayload {
  offerId: string;
  title: string;
  category: OfferCategoryType;
}

export interface OfferClaimedPayload {
  offerId: string;
  claimId: string;
  userId: string;
  supplierId: string;
}

export interface OfferRedeemedPayload {
  offerId: string;
  claimId: string;
  userId: string;
  supplierId: string;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isMarketplaceEvent(event: DomainEvent): boolean {
  return Object.values(MarketplaceEventTypes).includes(
    event.eventType as MarketplaceEventType
  );
}

export function isSupplierEvent(event: DomainEvent): boolean {
  return event.aggregateType === 'Supplier';
}

export function isOfferEvent(event: DomainEvent): boolean {
  return (
    event.eventType.startsWith('Offer') || event.eventType.startsWith('Claim')
  );
}
