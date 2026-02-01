/**
 * Marketplace Module
 *
 * Bounded Context: Marketplace
 * Purpose: Partner offers and local experiences
 *
 * Aggregates: Supplier, Offer
 * Key Operations:
 * - Create supplier profile
 * - Publish offers
 * - Browse marketplace
 * - View offer details
 * - Claim/redeem offers
 */

// Domain - Aggregate Root
export { Supplier } from './domain';
export type { SupplierProps, CreateSupplierParams } from './domain';

// Domain - Entities
export { Offer, OfferStatus, OfferClaim, ClaimStatus } from './domain';
export type {
  OfferProps,
  CreateOfferParams,
  OfferClaimProps,
  OfferClaimId,
} from './domain';
export { createOfferClaimId, generateOfferClaimId } from './domain';

// Domain - Value Objects
export type { OfferCategory, SupplierLocation, OfferValidity } from './domain';
export {
  OfferCategoryType,
  OfferCategoryDescriptions,
  createOfferCategory,
  getOfferCategoryDescription,
  isValidOfferCategory,
  createSupplierLocation,
  formatSupplierLocation,
  createOfferValidity,
  isOfferValidNow,
  isExpiringSoon,
} from './domain';

// Repositories - Interfaces
export type {
  ISupplierRepository,
  IOfferRepository,
  OfferFilter,
  IOfferClaimRepository,
  ClaimFilter,
} from './repos';

// Repositories - Mock implementations
export {
  MockSupplierRepository,
  createMockSupplierRepository,
  MockOfferRepository,
  createMockOfferRepository,
  MockOfferClaimRepository,
  createMockOfferClaimRepository,
} from './repos';

// Events
export {
  MarketplaceEventTypes,
  isMarketplaceEvent,
  isSupplierEvent,
  isOfferEvent,
} from './events';
export type {
  MarketplaceEventType,
  SupplierRegisteredPayload,
  OfferPublishedPayload,
  OfferClaimedPayload,
} from './events';
