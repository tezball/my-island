/**
 * MockOfferRepository - In-memory implementation using MOCK_DB
 */

import type { OfferId, SupplierId } from '../../../../core/domain';
import { MOCK_DB } from '../../../../services/mockData';
import type { IOfferRepository, OfferFilter } from '../IOfferRepository';
import { Offer } from '../../domain/Offer';
import type { OfferCategoryType } from '../../domain/valueObjects';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation of IOfferRepository
 * Wraps the existing MOCK_DB.offers array
 */
export class MockOfferRepository implements IOfferRepository {
  async findById(id: OfferId): Promise<Offer | null> {
    await delay(100);
    const data = MOCK_DB.offers?.find((o) => o.id === id);
    if (!data) return null;
    return this.toDomain(data);
  }

  async findBySupplierId(supplierId: SupplierId): Promise<Offer[]> {
    await delay(150);
    const offers = MOCK_DB.offers?.filter((o) => o.supplierId === supplierId) ?? [];
    return offers.map((o) => this.toDomain(o));
  }

  async findByFilter(filter: OfferFilter): Promise<Offer[]> {
    await delay(150);
    let offers = [...(MOCK_DB.offers ?? [])];

    if (filter.supplierId) {
      offers = offers.filter((o) => o.supplierId === filter.supplierId);
    }

    if (filter.category) {
      offers = offers.filter((o) => o.category === filter.category);
    }

    if (filter.activeOnly) {
      offers = offers.filter((o) => o.active);
    }

    if (filter.validNow) {
      const now = new Date();
      offers = offers.filter((o) => {
        const validFrom = new Date(o.validFrom);
        const validUntil = new Date(o.validUntil);
        return validFrom <= now && now <= validUntil;
      });
    }

    return offers.map((o) => this.toDomain(o));
  }

  async findAllClaimable(): Promise<Offer[]> {
    await delay(150);
    const now = new Date();
    const offers =
      MOCK_DB.offers?.filter((o) => {
        if (!o.active) return false;
        const validFrom = new Date(o.validFrom);
        const validUntil = new Date(o.validUntil);
        if (validFrom > now || validUntil < now) return false;
        if (o.maxClaims !== null && o.claimCount >= o.maxClaims) return false;
        return true;
      }) ?? [];

    return offers.map((o) => this.toDomain(o));
  }

  async save(offer: Offer): Promise<void> {
    await delay(200);
    const data = this.toData(offer);
    const index = MOCK_DB.offers?.findIndex((o) => o.id === offer.id);

    if (index !== undefined && index !== -1 && MOCK_DB.offers) {
      MOCK_DB.offers[index] = data;
    } else {
      MOCK_DB.offers?.push(data);
    }
  }

  async delete(id: OfferId): Promise<void> {
    await delay(100);
    const index = MOCK_DB.offers?.findIndex((o) => o.id === id);
    if (index !== undefined && index !== -1 && MOCK_DB.offers) {
      MOCK_DB.offers.splice(index, 1);
    }
  }

  async incrementClaimCount(id: OfferId): Promise<Offer> {
    await delay(100);
    const index = MOCK_DB.offers?.findIndex((o) => o.id === id);
    if (index === undefined || index === -1 || !MOCK_DB.offers) {
      throw new Error(`Offer not found: ${id}`);
    }

    MOCK_DB.offers[index].claimCount++;
    return this.toDomain(MOCK_DB.offers[index]);
  }

  /**
   * Converts raw data to Offer domain object
   */
  private toDomain(data: NonNullable<typeof MOCK_DB.offers>[number]): Offer {
    return Offer.fromRaw({
      id: data.id,
      supplierId: data.supplierId,
      title: data.title,
      description: data.description,
      category: data.category as OfferCategoryType,
      discountPercent: data.discountPercent,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      maxClaims: data.maxClaims,
      claimCount: data.claimCount,
      terms: data.terms,
      active: data.active,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt,
    });
  }

  /**
   * Converts Offer domain object to raw data
   */
  private toData(offer: Offer): NonNullable<typeof MOCK_DB.offers>[number] {
    const obj = offer.toObject();
    return {
      id: obj.id,
      supplierId: obj.supplierId,
      title: obj.title,
      description: obj.description,
      category: obj.category,
      discountPercent: obj.discountPercent,
      validFrom: obj.validFrom,
      validUntil: obj.validUntil,
      maxClaims: obj.maxClaims,
      claimCount: obj.claimCount,
      terms: obj.terms,
      active: obj.active,
      imageUrl: obj.imageUrl ?? undefined,
      createdAt: obj.createdAt,
    };
  }
}

/**
 * Creates a new MockOfferRepository instance
 */
export function createMockOfferRepository(): IOfferRepository {
  return new MockOfferRepository();
}
