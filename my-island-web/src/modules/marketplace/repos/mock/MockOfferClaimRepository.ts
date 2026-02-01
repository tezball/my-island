/**
 * MockOfferClaimRepository - In-memory implementation using MOCK_DB
 */

import type { OfferId, UserId } from '../../../../core/domain';
import { MOCK_DB } from '../../../../services/mockData';
import type { IOfferClaimRepository, ClaimFilter } from '../IOfferClaimRepository';
import {
  OfferClaim,
  type OfferClaimId,
  type ClaimStatus,
  createOfferClaimId,
} from '../../domain/OfferClaim';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation of IOfferClaimRepository
 * Wraps the existing MOCK_DB.offerClaims array
 */
export class MockOfferClaimRepository implements IOfferClaimRepository {
  async findById(id: OfferClaimId): Promise<OfferClaim | null> {
    await delay(100);
    const data = MOCK_DB.offerClaims?.find((c) => c.id === id);
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByOfferId(offerId: OfferId): Promise<OfferClaim[]> {
    await delay(150);
    const claims = MOCK_DB.offerClaims?.filter((c) => c.offerId === offerId) ?? [];
    return claims.map((c) => this.toDomain(c));
  }

  async findByUserId(userId: UserId): Promise<OfferClaim[]> {
    await delay(150);
    const claims = MOCK_DB.offerClaims?.filter((c) => c.userId === userId) ?? [];
    return claims.map((c) => this.toDomain(c));
  }

  async findByFilter(filter: ClaimFilter): Promise<OfferClaim[]> {
    await delay(150);
    let claims = [...(MOCK_DB.offerClaims ?? [])];

    if (filter.offerId) {
      claims = claims.filter((c) => c.offerId === filter.offerId);
    }

    if (filter.userId) {
      claims = claims.filter((c) => c.userId === filter.userId);
    }

    if (filter.status) {
      claims = claims.filter((c) => c.status === filter.status);
    }

    if (filter.claimedAfter) {
      claims = claims.filter(
        (c) => new Date(c.claimedAt) >= filter.claimedAfter!
      );
    }

    if (filter.claimedBefore) {
      claims = claims.filter(
        (c) => new Date(c.claimedAt) <= filter.claimedBefore!
      );
    }

    return claims.map((c) => this.toDomain(c));
  }

  async hasUserClaimedOffer(userId: UserId, offerId: OfferId): Promise<boolean> {
    await delay(50);
    return (
      MOCK_DB.offerClaims?.some(
        (c) => c.userId === userId && c.offerId === offerId
      ) ?? false
    );
  }

  async save(claim: OfferClaim): Promise<void> {
    await delay(200);
    const data = this.toData(claim);
    const index = MOCK_DB.offerClaims?.findIndex((c) => c.id === claim.id);

    if (index !== undefined && index !== -1 && MOCK_DB.offerClaims) {
      MOCK_DB.offerClaims[index] = data;
    } else {
      MOCK_DB.offerClaims?.push(data);
    }
  }

  async getClaimCount(offerId: OfferId): Promise<number> {
    await delay(50);
    return MOCK_DB.offerClaims?.filter((c) => c.offerId === offerId).length ?? 0;
  }

  async getSupplierClaimsInPeriod(
    offerIds: OfferId[],
    startDate: Date,
    endDate: Date
  ): Promise<OfferClaim[]> {
    await delay(150);
    const claims =
      MOCK_DB.offerClaims?.filter((c) => {
        if (!offerIds.includes(c.offerId as OfferId)) return false;
        const claimedAt = new Date(c.claimedAt);
        return claimedAt >= startDate && claimedAt <= endDate;
      }) ?? [];

    return claims.map((c) => this.toDomain(c));
  }

  /**
   * Converts raw data to OfferClaim domain object
   */
  private toDomain(data: NonNullable<typeof MOCK_DB.offerClaims>[number]): OfferClaim {
    return OfferClaim.reconstitute({
      id: createOfferClaimId(data.id),
      offerId: data.offerId as OfferId,
      userId: data.userId as UserId,
      userName: data.userName,
      claimedAt: new Date(data.claimedAt),
      redeemedAt: data.redeemedAt ? new Date(data.redeemedAt) : null,
      status: data.status as ClaimStatus,
    });
  }

  /**
   * Converts OfferClaim domain object to raw data
   */
  private toData(
    claim: OfferClaim
  ): NonNullable<typeof MOCK_DB.offerClaims>[number] {
    const obj = claim.toObject();
    return {
      id: obj.id,
      offerId: obj.offerId,
      userId: obj.userId,
      userName: obj.userName,
      claimedAt: obj.claimedAt,
      redeemedAt: obj.redeemedAt,
      status: obj.status,
    };
  }
}

/**
 * Creates a new MockOfferClaimRepository instance
 */
export function createMockOfferClaimRepository(): IOfferClaimRepository {
  return new MockOfferClaimRepository();
}
