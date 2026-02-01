/**
 * OfferClaim Entity - Represents a guest's claim on an offer
 */

import {
  Entity,
  type BrandedId,
  createId,
} from '../../../core/domain';

// Use the core domain's BrandedId pattern
export type OfferClaimId = BrandedId<'OfferClaimId'>;

export function createOfferClaimId(value: string): OfferClaimId {
  return createId<'OfferClaimId'>(value);
}

export function generateOfferClaimId(): OfferClaimId {
  return `claim-${Date.now()}-${crypto.randomUUID().slice(0, 8)}` as OfferClaimId;
}

/**
 * Claim status enumeration
 */
export const ClaimStatus = {
  CLAIMED: 'claimed',
  REDEEMED: 'redeemed',
  EXPIRED: 'expired',
} as const;

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

/**
 * Props for OfferClaim entity
 */
export interface OfferClaimProps {
  id: OfferClaimId;
  offerId: BrandedId<'OfferId'>;
  userId: BrandedId<'UserId'>;
  userName: string;
  claimedAt: Date;
  redeemedAt: Date | null;
  status: ClaimStatus;
}

/**
 * OfferClaim Entity
 *
 * Represents when a guest claims (saves) an offer for later redemption.
 * Tracks the lifecycle from claimed → redeemed or expired.
 */
export class OfferClaim extends Entity<OfferClaimId, OfferClaimProps> {
  private constructor(props: OfferClaimProps) {
    super(props);
  }

  // Getters
  get offerId(): BrandedId<'OfferId'> {
    return this.props.offerId;
  }

  get userId(): BrandedId<'UserId'> {
    return this.props.userId;
  }

  get userName(): string {
    return this.props.userName;
  }

  get claimedAt(): Date {
    return this.props.claimedAt;
  }

  get redeemedAt(): Date | null {
    return this.props.redeemedAt;
  }

  get status(): ClaimStatus {
    return this.props.status;
  }

  /**
   * Creates a new claim for an offer
   */
  static create(
    offerId: BrandedId<'OfferId'>,
    userId: BrandedId<'UserId'>,
    userName: string
  ): OfferClaim {
    return new OfferClaim({
      id: generateOfferClaimId(),
      offerId,
      userId,
      userName,
      claimedAt: new Date(),
      redeemedAt: null,
      status: ClaimStatus.CLAIMED,
    });
  }

  /**
   * Reconstitutes a claim from persistence
   */
  static reconstitute(props: OfferClaimProps): OfferClaim {
    return new OfferClaim(props);
  }

  /**
   * Marks the claim as redeemed
   */
  redeem(): OfferClaim {
    if (this.props.status !== ClaimStatus.CLAIMED) {
      throw new Error(`Cannot redeem claim with status: ${this.props.status}`);
    }

    return new OfferClaim({
      ...this.props,
      status: ClaimStatus.REDEEMED,
      redeemedAt: new Date(),
    });
  }

  /**
   * Marks the claim as expired
   */
  expire(): OfferClaim {
    if (this.props.status !== ClaimStatus.CLAIMED) {
      throw new Error(`Cannot expire claim with status: ${this.props.status}`);
    }

    return new OfferClaim({
      ...this.props,
      status: ClaimStatus.EXPIRED,
    });
  }

  /**
   * Checks if the claim can be redeemed
   */
  canRedeem(): boolean {
    return this.props.status === ClaimStatus.CLAIMED;
  }

  /**
   * Returns a plain object representation for persistence/serialization
   */
  toObject(): {
    id: string;
    offerId: string;
    userId: string;
    userName: string;
    claimedAt: string;
    redeemedAt: string | null;
    status: ClaimStatus;
  } {
    return {
      id: this.props.id,
      offerId: this.props.offerId,
      userId: this.props.userId,
      userName: this.props.userName,
      claimedAt: this.props.claimedAt.toISOString(),
      redeemedAt: this.props.redeemedAt?.toISOString() ?? null,
      status: this.props.status,
    };
  }
}
