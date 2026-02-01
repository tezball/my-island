// Aggregate Root
export { Supplier } from './Supplier';
export type { SupplierProps, CreateSupplierParams } from './Supplier';

// Entities
export { Offer, OfferStatus } from './Offer';
export type { OfferProps, CreateOfferParams, OfferStatus as OfferStatusType } from './Offer';

export { OfferClaim, ClaimStatus } from './OfferClaim';
export type {
  OfferClaimProps,
  OfferClaimId,
  ClaimStatus as ClaimStatusType,
} from './OfferClaim';
export { createOfferClaimId, generateOfferClaimId } from './OfferClaim';

// Value Objects
export type { OfferCategory, SupplierLocation, OfferValidity } from './valueObjects';
export {
  OfferCategoryType,
  OfferCategoryDescriptions,
  createOfferCategory,
  getOfferCategoryDescription,
  isValidOfferCategory,
  createSupplierLocation,
  formatSupplierLocation,
  supplierLocationEquals,
  createOfferValidity,
  isOfferValidNow,
  isOfferValidOn,
  getDaysUntilExpiry,
  isExpiringSoon,
} from './valueObjects';
