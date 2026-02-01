/**
 * Supplier Aggregate Root - Business partner offering deals to guests
 */

import {
  AggregateRoot,
  type SupplierId,
  type UserId,
  createSupplierId,
  generateSupplierId,
} from '../../../core/domain';
import { createDomainEvent } from '../../../core/events';
import {
  type OfferCategory,
  createOfferCategory,
  type OfferCategoryType,
  type SupplierLocation,
  createSupplierLocation,
  formatSupplierLocation,
} from './valueObjects';
import { Offer, type CreateOfferParams } from './Offer';

/**
 * Props for Supplier aggregate
 */
export interface SupplierProps {
  id: SupplierId;
  userId: UserId;
  businessName: string;
  description: string;
  logo: string;
  category: OfferCategory;
  location: SupplierLocation;
  contactEmail: string;
  contactPhone: string;
  website: string | null;
  active: boolean;
  createdAt: Date;
  offers: Offer[];
}

/**
 * Parameters for creating a new supplier
 */
export interface CreateSupplierParams {
  userId: UserId;
  businessName: string;
  description: string;
  category: OfferCategoryType;
  town: string;
  county: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  logo?: string;
}

/**
 * Supplier Aggregate Root
 *
 * Represents a business partner who can publish promotional offers.
 * A user with isSupplier=true can create one Supplier profile.
 * The Supplier owns and manages their collection of Offers.
 */
export class Supplier extends AggregateRoot<SupplierId, SupplierProps> {
  private constructor(props: SupplierProps) {
    super(props);
  }

  protected get aggregateType(): string {
    return 'Supplier';
  }

  // Getters
  get userId(): UserId {
    return this.props.userId;
  }

  get businessName(): string {
    return this.props.businessName;
  }

  get description(): string {
    return this.props.description;
  }

  get logo(): string {
    return this.props.logo;
  }

  get category(): OfferCategory {
    return this.props.category;
  }

  get location(): SupplierLocation {
    return this.props.location;
  }

  get formattedLocation(): string {
    return formatSupplierLocation(this.props.location);
  }

  get contactEmail(): string {
    return this.props.contactEmail;
  }

  get contactPhone(): string {
    return this.props.contactPhone;
  }

  get website(): string | null {
    return this.props.website;
  }

  get active(): boolean {
    return this.props.active;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get offers(): readonly Offer[] {
    return this.props.offers;
  }

  /**
   * Creates a new supplier profile
   */
  static create(params: CreateSupplierParams): Supplier {
    if (!params.businessName || params.businessName.trim().length === 0) {
      throw new Error('Business name is required');
    }
    if (!params.contactEmail || !params.contactEmail.includes('@')) {
      throw new Error('Valid contact email is required');
    }

    const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(params.businessName)}&background=8b5cf6&color=fff`;

    const supplier = new Supplier({
      id: generateSupplierId(),
      userId: params.userId,
      businessName: params.businessName.trim(),
      description: params.description.trim(),
      logo: params.logo || defaultLogo,
      category: createOfferCategory(params.category),
      location: createSupplierLocation(params.town, params.county),
      contactEmail: params.contactEmail.trim(),
      contactPhone: params.contactPhone.trim(),
      website: params.website?.trim() || null,
      active: true,
      createdAt: new Date(),
      offers: [],
    });

    supplier.addDomainEvent(
      createDomainEvent({
        eventType: 'SupplierRegistered',
        aggregateId: supplier.id,
        aggregateType: 'Supplier',
        payload: {
          userId: params.userId,
          businessName: params.businessName,
        },
      })
    );

    return supplier;
  }

  /**
   * Reconstitutes a supplier from persistence
   */
  static reconstitute(props: SupplierProps): Supplier {
    return new Supplier(props);
  }

  /**
   * Reconstitutes from raw data (e.g., from API/database)
   */
  static fromRaw(data: {
    id: string;
    userId: string;
    businessName: string;
    description: string;
    logo: string;
    category: OfferCategoryType;
    location: string; // "Town, Co. County" format or {town, county}
    contactEmail: string;
    contactPhone: string;
    website?: string | null;
    active: boolean;
    createdAt: string | Date;
  }): Supplier {
    // Parse location string if needed
    let town = '';
    let county = '';
    if (typeof data.location === 'string') {
      const match = data.location.match(/^(.+),\s*Co\.\s*(.+)$/);
      if (match) {
        town = match[1].trim();
        county = match[2].trim();
      } else {
        town = data.location;
        county = 'Unknown';
      }
    }

    return new Supplier({
      id: createSupplierId(data.id),
      userId: data.userId as UserId,
      businessName: data.businessName,
      description: data.description,
      logo: data.logo,
      category: createOfferCategory(data.category),
      location: createSupplierLocation(town, county),
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      website: data.website ?? null,
      active: data.active,
      createdAt: new Date(data.createdAt),
      offers: [],
    });
  }

  /**
   * Creates and publishes a new offer
   */
  publishOffer(params: Omit<CreateOfferParams, 'supplierId'>): Offer {
    if (!this.props.active) {
      throw new Error('Cannot publish offer: Supplier is not active');
    }

    const offer = Offer.create({
      ...params,
      supplierId: this.id,
    });

    // Add to internal collection
    this.props.offers.push(offer);

    this.addDomainEvent(
      createDomainEvent({
        eventType: 'OfferPublished',
        aggregateId: this.id,
        aggregateType: 'Supplier',
        payload: {
          offerId: offer.id,
          title: offer.title,
          category: offer.category.type,
        },
      })
    );

    return offer;
  }

  /**
   * Gets an offer by ID
   */
  getOffer(offerId: string): Offer | undefined {
    return this.props.offers.find((o) => o.id === offerId);
  }

  /**
   * Gets all active offers
   */
  getActiveOffers(): Offer[] {
    return this.props.offers.filter((o) => o.canBeClaimed());
  }

  /**
   * Deactivates an offer
   */
  deactivateOffer(offerId: string): void {
    const index = this.props.offers.findIndex((o) => o.id === offerId);
    if (index === -1) {
      throw new Error(`Offer not found: ${offerId}`);
    }

    this.props.offers[index] = this.props.offers[index].deactivate();

    this.addDomainEvent(
      createDomainEvent({
        eventType: 'OfferUnpublished',
        aggregateId: this.id,
        aggregateType: 'Supplier',
        payload: { offerId },
      })
    );
  }

  /**
   * Removes an offer
   */
  removeOffer(offerId: string): void {
    const index = this.props.offers.findIndex((o) => o.id === offerId);
    if (index === -1) {
      throw new Error(`Offer not found: ${offerId}`);
    }

    this.props.offers.splice(index, 1);

    this.addDomainEvent(
      createDomainEvent({
        eventType: 'OfferDeleted',
        aggregateId: this.id,
        aggregateType: 'Supplier',
        payload: { offerId },
      })
    );
  }

  /**
   * Updates supplier profile
   */
  updateProfile(updates: Partial<{
    businessName: string;
    description: string;
    logo: string;
    contactEmail: string;
    contactPhone: string;
    website: string | null;
  }>): Supplier {
    const updatedSupplier = new Supplier({
      ...this.props,
      businessName: updates.businessName?.trim() ?? this.props.businessName,
      description: updates.description?.trim() ?? this.props.description,
      logo: updates.logo ?? this.props.logo,
      contactEmail: updates.contactEmail?.trim() ?? this.props.contactEmail,
      contactPhone: updates.contactPhone?.trim() ?? this.props.contactPhone,
      website: updates.website !== undefined ? updates.website : this.props.website,
    });

    updatedSupplier.addDomainEvent(
      createDomainEvent({
        eventType: 'SupplierProfileUpdated',
        aggregateId: this.id,
        aggregateType: 'Supplier',
        payload: { updates: Object.keys(updates) },
      })
    );

    return updatedSupplier;
  }

  /**
   * Activates the supplier
   */
  activate(): Supplier {
    return new Supplier({
      ...this.props,
      active: true,
    });
  }

  /**
   * Deactivates the supplier
   */
  deactivate(): Supplier {
    return new Supplier({
      ...this.props,
      active: false,
    });
  }

  /**
   * Returns a plain object representation for persistence/serialization
   */
  toObject(): {
    id: string;
    userId: string;
    businessName: string;
    description: string;
    logo: string;
    category: OfferCategoryType;
    location: string;
    contactEmail: string;
    contactPhone: string;
    website: string | null;
    active: boolean;
    createdAt: string;
  } {
    return {
      id: this.props.id,
      userId: this.props.userId,
      businessName: this.props.businessName,
      description: this.props.description,
      logo: this.props.logo,
      category: this.props.category.type,
      location: formatSupplierLocation(this.props.location),
      contactEmail: this.props.contactEmail,
      contactPhone: this.props.contactPhone,
      website: this.props.website,
      active: this.props.active,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
