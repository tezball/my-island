/**
 * Offer Entity - Represents a promotional offer from a supplier
 */

import { Entity, type OfferId, createOfferId, generateOfferId, type SupplierId } from '../../../core/domain';
import {
  type OfferCategory,
  createOfferCategory,
  type OfferCategoryType,
  type OfferValidity,
  createOfferValidity,
  isOfferValidNow,
  isExpiringSoon,
  getDaysUntilExpiry,
} from './valueObjects';

/**
 * Props for Offer entity
 */
export interface OfferProps {
  id: OfferId;
  supplierId: SupplierId;
  title: string;
  description: string;
  category: OfferCategory;
  discountPercent: number;
  validity: OfferValidity;
  maxClaims: number | null;
  claimCount: number;
  terms: string;
  active: boolean;
  imageUrl: string | null;
  createdAt: Date;
}

/**
 * Parameters for creating a new offer
 */
export interface CreateOfferParams {
  supplierId: SupplierId;
  title: string;
  description: string;
  category: OfferCategoryType;
  discountPercent: number;
  validFrom: Date;
  validUntil: Date;
  maxClaims: number | null;
  terms: string;
  imageUrl?: string;
}

/**
 * Offer status for display purposes
 */
export const OfferStatus = {
  ACTIVE: 'active',
  EXPIRING_SOON: 'expiring_soon',
  NEAR_LIMIT: 'near_limit',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  SOLD_OUT: 'sold_out',
} as const;

export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

/**
 * Offer Entity
 *
 * Represents a promotional deal offered by a supplier to guests.
 * Manages validity periods, claim limits, and activation status.
 */
export class Offer extends Entity<OfferId, OfferProps> {
  private constructor(props: OfferProps) {
    super(props);
  }

  // Getters
  get supplierId(): SupplierId {
    return this.props.supplierId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get category(): OfferCategory {
    return this.props.category;
  }

  get discountPercent(): number {
    return this.props.discountPercent;
  }

  get validity(): OfferValidity {
    return this.props.validity;
  }

  get validFrom(): Date {
    return this.props.validity.validFrom;
  }

  get validUntil(): Date {
    return this.props.validity.validUntil;
  }

  get maxClaims(): number | null {
    return this.props.maxClaims;
  }

  get claimCount(): number {
    return this.props.claimCount;
  }

  get terms(): string {
    return this.props.terms;
  }

  get active(): boolean {
    return this.props.active;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a new offer
   * Enforces invariant: validUntil > validFrom (via OfferValidity)
   */
  static create(params: CreateOfferParams): Offer {
    if (!params.title || params.title.trim().length === 0) {
      throw new Error('Offer title is required');
    }
    if (params.discountPercent < 0 || params.discountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }
    if (params.maxClaims !== null && params.maxClaims < 1) {
      throw new Error('Max claims must be at least 1 or null for unlimited');
    }

    return new Offer({
      id: generateOfferId(),
      supplierId: params.supplierId,
      title: params.title.trim(),
      description: params.description.trim(),
      category: createOfferCategory(params.category),
      discountPercent: params.discountPercent,
      validity: createOfferValidity(params.validFrom, params.validUntil),
      maxClaims: params.maxClaims,
      claimCount: 0,
      terms: params.terms,
      active: true,
      imageUrl: params.imageUrl ?? null,
      createdAt: new Date(),
    });
  }

  /**
   * Reconstitutes an offer from persistence
   */
  static reconstitute(props: OfferProps): Offer {
    return new Offer(props);
  }

  /**
   * Reconstitutes from raw data (e.g., from API/database)
   */
  static fromRaw(data: {
    id: string;
    supplierId: string;
    title: string;
    description: string;
    category: OfferCategoryType;
    discountPercent: number;
    validFrom: string | Date;
    validUntil: string | Date;
    maxClaims: number | null;
    claimCount: number;
    terms: string;
    active: boolean;
    imageUrl?: string | null;
    createdAt: string | Date;
  }): Offer {
    return new Offer({
      id: createOfferId(data.id),
      supplierId: data.supplierId as SupplierId,
      title: data.title,
      description: data.description,
      category: createOfferCategory(data.category),
      discountPercent: data.discountPercent,
      validity: createOfferValidity(
        new Date(data.validFrom),
        new Date(data.validUntil)
      ),
      maxClaims: data.maxClaims,
      claimCount: data.claimCount,
      terms: data.terms,
      active: data.active,
      imageUrl: data.imageUrl ?? null,
      createdAt: new Date(data.createdAt),
    });
  }

  /**
   * Determines the current status of the offer
   */
  getStatus(): OfferStatus {
    if (!this.props.active) {
      return OfferStatus.INACTIVE;
    }

    if (!isOfferValidNow(this.props.validity)) {
      const daysUntil = getDaysUntilExpiry(this.props.validity);
      return daysUntil < 0 ? OfferStatus.EXPIRED : OfferStatus.INACTIVE;
    }

    if (this.props.maxClaims !== null && this.props.claimCount >= this.props.maxClaims) {
      return OfferStatus.SOLD_OUT;
    }

    // Near claim limit (80%+ claimed)
    if (
      this.props.maxClaims !== null &&
      this.props.claimCount >= this.props.maxClaims * 0.8
    ) {
      return OfferStatus.NEAR_LIMIT;
    }

    if (isExpiringSoon(this.props.validity, 30)) {
      return OfferStatus.EXPIRING_SOON;
    }

    return OfferStatus.ACTIVE;
  }

  /**
   * Checks if the offer can be claimed
   */
  canBeClaimed(): boolean {
    if (!this.props.active) return false;
    if (!isOfferValidNow(this.props.validity)) return false;
    if (this.props.maxClaims !== null && this.props.claimCount >= this.props.maxClaims) {
      return false;
    }
    return true;
  }

  /**
   * Returns the remaining claims available
   */
  getRemainingClaims(): number | null {
    if (this.props.maxClaims === null) return null;
    return Math.max(0, this.props.maxClaims - this.props.claimCount);
  }

  /**
   * Increments the claim count
   * Returns a new Offer instance with updated count
   */
  incrementClaimCount(): Offer {
    if (!this.canBeClaimed()) {
      throw new Error('Offer cannot be claimed');
    }

    return new Offer({
      ...this.props,
      claimCount: this.props.claimCount + 1,
    });
  }

  /**
   * Activates the offer
   */
  activate(): Offer {
    return new Offer({
      ...this.props,
      active: true,
    });
  }

  /**
   * Deactivates the offer
   */
  deactivate(): Offer {
    return new Offer({
      ...this.props,
      active: false,
    });
  }

  /**
   * Updates offer details
   */
  update(updates: Partial<{
    title: string;
    description: string;
    terms: string;
    imageUrl: string | null;
  }>): Offer {
    return new Offer({
      ...this.props,
      title: updates.title?.trim() ?? this.props.title,
      description: updates.description?.trim() ?? this.props.description,
      terms: updates.terms ?? this.props.terms,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : this.props.imageUrl,
    });
  }

  /**
   * Returns a plain object representation for persistence/serialization
   */
  toObject(): {
    id: string;
    supplierId: string;
    title: string;
    description: string;
    category: OfferCategoryType;
    discountPercent: number;
    validFrom: string;
    validUntil: string;
    maxClaims: number | null;
    claimCount: number;
    terms: string;
    active: boolean;
    imageUrl: string | null;
    createdAt: string;
  } {
    return {
      id: this.props.id,
      supplierId: this.props.supplierId,
      title: this.props.title,
      description: this.props.description,
      category: this.props.category.type,
      discountPercent: this.props.discountPercent,
      validFrom: this.props.validity.validFrom.toISOString(),
      validUntil: this.props.validity.validUntil.toISOString(),
      maxClaims: this.props.maxClaims,
      claimCount: this.props.claimCount,
      terms: this.props.terms,
      active: this.props.active,
      imageUrl: this.props.imageUrl,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
