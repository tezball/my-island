/**
 * MockSupplierRepository - In-memory implementation using MOCK_DB
 */

import type { SupplierId, UserId } from '../../../../core/domain';
import { MOCK_DB } from '../../../../services/mockData';
import type { ISupplierRepository } from '../ISupplierRepository';
import { Supplier } from '../../domain/Supplier';
import type { OfferCategoryType } from '../../domain/valueObjects';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation of ISupplierRepository
 * Wraps the existing MOCK_DB.suppliers array
 */
export class MockSupplierRepository implements ISupplierRepository {
  async findById(id: SupplierId): Promise<Supplier | null> {
    await delay(100);
    const data = MOCK_DB.suppliers?.find((s) => s.id === id);
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByUserId(userId: UserId): Promise<Supplier | null> {
    await delay(100);
    const data = MOCK_DB.suppliers?.find((s) => s.userId === userId);
    if (!data) return null;
    return this.toDomain(data);
  }

  async findAllActive(): Promise<Supplier[]> {
    await delay(150);
    const suppliers = MOCK_DB.suppliers?.filter((s) => s.active) ?? [];
    return suppliers.map((s) => this.toDomain(s));
  }

  async save(supplier: Supplier): Promise<void> {
    await delay(200);
    const data = this.toData(supplier);
    const index = MOCK_DB.suppliers?.findIndex((s) => s.id === supplier.id);

    if (index !== undefined && index !== -1 && MOCK_DB.suppliers) {
      MOCK_DB.suppliers[index] = data;
    } else {
      MOCK_DB.suppliers?.push(data);
    }
  }

  async delete(id: SupplierId): Promise<void> {
    await delay(100);
    const index = MOCK_DB.suppliers?.findIndex((s) => s.id === id);
    if (index !== undefined && index !== -1 && MOCK_DB.suppliers) {
      MOCK_DB.suppliers.splice(index, 1);
    }
  }

  async exists(id: SupplierId): Promise<boolean> {
    await delay(50);
    return MOCK_DB.suppliers?.some((s) => s.id === id) ?? false;
  }

  async existsByUserId(userId: UserId): Promise<boolean> {
    await delay(50);
    return MOCK_DB.suppliers?.some((s) => s.userId === userId) ?? false;
  }

  /**
   * Converts raw data to Supplier domain object
   */
  private toDomain(data: NonNullable<typeof MOCK_DB.suppliers>[number]): Supplier {
    return Supplier.fromRaw({
      id: data.id,
      userId: data.userId,
      businessName: data.businessName,
      description: data.description,
      logo: data.logo,
      category: data.category as OfferCategoryType,
      location: data.location,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      active: data.active,
      createdAt: data.createdAt,
    });
  }

  /**
   * Converts Supplier domain object to raw data
   */
  private toData(supplier: Supplier): NonNullable<typeof MOCK_DB.suppliers>[number] {
    const obj = supplier.toObject();
    return {
      id: obj.id,
      userId: obj.userId,
      businessName: obj.businessName,
      description: obj.description,
      logo: obj.logo,
      category: obj.category,
      location: obj.location,
      contactEmail: obj.contactEmail,
      contactPhone: obj.contactPhone,
      active: obj.active,
      createdAt: obj.createdAt,
    };
  }
}

/**
 * Creates a new MockSupplierRepository instance
 */
export function createMockSupplierRepository(): ISupplierRepository {
  return new MockSupplierRepository();
}
