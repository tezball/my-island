/**
 * IOfferClaimRepository - Repository interface for OfferClaim entity
 */

import type { OfferId, UserId } from '../../../core/domain';
import type { OfferClaim, OfferClaimId, ClaimStatus } from '../domain/OfferClaim';

/**
 * Filter options for querying claims
 */
export interface ClaimFilter {
  offerId?: OfferId;
  userId?: UserId;
  status?: ClaimStatus;
  claimedAfter?: Date;
  claimedBefore?: Date;
}

/**
 * Repository interface for OfferClaim persistence
 */
export interface IOfferClaimRepository {
  /**
   * Finds a claim by its unique ID
   */
  findById(id: OfferClaimId): Promise<OfferClaim | null>;

  /**
   * Finds all claims for a specific offer
   */
  findByOfferId(offerId: OfferId): Promise<OfferClaim[]>;

  /**
   * Finds all claims by a specific user
   */
  findByUserId(userId: UserId): Promise<OfferClaim[]>;

  /**
   * Finds claims matching the given filter
   */
  findByFilter(filter: ClaimFilter): Promise<OfferClaim[]>;

  /**
   * Checks if a user has already claimed a specific offer
   */
  hasUserClaimedOffer(userId: UserId, offerId: OfferId): Promise<boolean>;

  /**
   * Saves a claim (create or update)
   */
  save(claim: OfferClaim): Promise<void>;

  /**
   * Gets the count of claims for an offer
   */
  getClaimCount(offerId: OfferId): Promise<number>;

  /**
   * Gets claims for a supplier's offers within a date range
   */
  getSupplierClaimsInPeriod(
    offerIds: OfferId[],
    startDate: Date,
    endDate: Date
  ): Promise<OfferClaim[]>;
}
