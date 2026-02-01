/**
 * IOfferRepository - Repository interface for Offer entity queries
 *
 * Note: Offers are typically managed through the Supplier aggregate,
 * but this repository provides additional query capabilities.
 */

import type { OfferId, SupplierId } from '../../../core/domain';
import type { Offer } from '../domain/Offer';
import type { OfferCategoryType } from '../domain/valueObjects';

/**
 * Filter options for querying offers
 */
export interface OfferFilter {
  supplierId?: SupplierId;
  category?: OfferCategoryType;
  activeOnly?: boolean;
  validNow?: boolean;
}

/**
 * Repository interface for Offer queries
 */
export interface IOfferRepository {
  /**
   * Finds an offer by its unique ID
   */
  findById(id: OfferId): Promise<Offer | null>;

  /**
   * Finds all offers for a specific supplier
   */
  findBySupplierId(supplierId: SupplierId): Promise<Offer[]>;

  /**
   * Finds all offers matching the given filter
   */
  findByFilter(filter: OfferFilter): Promise<Offer[]>;

  /**
   * Finds all currently claimable offers
   * (active, within validity period, not sold out)
   */
  findAllClaimable(): Promise<Offer[]>;

  /**
   * Saves an offer (create or update)
   */
  save(offer: Offer): Promise<void>;

  /**
   * Deletes an offer
   */
  delete(id: OfferId): Promise<void>;

  /**
   * Increments the claim count for an offer
   * Returns the updated offer
   */
  incrementClaimCount(id: OfferId): Promise<Offer>;
}
