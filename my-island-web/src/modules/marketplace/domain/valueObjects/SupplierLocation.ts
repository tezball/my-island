/**
 * SupplierLocation - Value object for supplier business location
 */

import { createValueObject, valueObjectEquals, type ValueObject } from '../../../../core/domain';

interface SupplierLocationProps {
  town: string;
  county: string;
}

export type SupplierLocation = ValueObject<SupplierLocationProps>;

/**
 * Creates a SupplierLocation value object
 */
export function createSupplierLocation(town: string, county: string): SupplierLocation {
  if (!town || town.trim().length === 0) {
    throw new Error('Town is required for supplier location');
  }
  if (!county || county.trim().length === 0) {
    throw new Error('County is required for supplier location');
  }

  return createValueObject({
    town: town.trim(),
    county: county.trim(),
  });
}

/**
 * Formats the location for display
 */
export function formatSupplierLocation(location: SupplierLocation): string {
  return `${location.town}, Co. ${location.county}`;
}

/**
 * Checks if two locations are equal
 */
export function supplierLocationEquals(
  a: SupplierLocation | null | undefined,
  b: SupplierLocation | null | undefined
): boolean {
  return valueObjectEquals(a, b);
}
