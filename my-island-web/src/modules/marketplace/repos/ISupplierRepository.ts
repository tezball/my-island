/**
 * ISupplierRepository - Repository interface for Supplier aggregate
 */

import type { SupplierId, UserId } from '../../../core/domain';
import type { Supplier } from '../domain/Supplier';

/**
 * Repository interface for Supplier persistence
 */
export interface ISupplierRepository {
  /**
   * Finds a supplier by their unique ID
   */
  findById(id: SupplierId): Promise<Supplier | null>;

  /**
   * Finds a supplier by the user ID who owns it
   * (A user can have at most one supplier profile)
   */
  findByUserId(userId: UserId): Promise<Supplier | null>;

  /**
   * Finds all active suppliers
   */
  findAllActive(): Promise<Supplier[]>;

  /**
   * Saves a supplier (create or update)
   */
  save(supplier: Supplier): Promise<void>;

  /**
   * Deletes a supplier
   */
  delete(id: SupplierId): Promise<void>;

  /**
   * Checks if a supplier exists by ID
   */
  exists(id: SupplierId): Promise<boolean>;

  /**
   * Checks if a user already has a supplier profile
   */
  existsByUserId(userId: UserId): Promise<boolean>;
}
