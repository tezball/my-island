/**
 * Value Object Utilities - Immutability patterns for domain value objects
 *
 * Value Objects are identified by their structural equality (all properties)
 * rather than by identity. They should be immutable once created.
 */

/**
 * Type alias for a readonly (immutable) value object
 */
export type ValueObject<T> = Readonly<T>;

/**
 * Creates an immutable value object from the given properties
 * Uses Object.freeze to enforce immutability at runtime
 */
export function createValueObject<T extends object>(props: T): ValueObject<T> {
  return Object.freeze({ ...props });
}

/**
 * Compares two value objects for structural equality
 * Returns true if all properties have the same values
 */
export function valueObjectEquals<T extends object>(
  a: ValueObject<T> | null | undefined,
  b: ValueObject<T> | null | undefined
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;

  const keysA = Object.keys(a) as (keyof T)[];
  const keysB = Object.keys(b) as (keyof T)[];

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => {
    const valA = a[key];
    const valB = b[key];

    // Handle nested objects recursively
    if (
      typeof valA === 'object' &&
      valA !== null &&
      typeof valB === 'object' &&
      valB !== null
    ) {
      return valueObjectEquals(
        valA as ValueObject<object>,
        valB as ValueObject<object>
      );
    }

    // Handle Date comparison
    if (valA instanceof Date && valB instanceof Date) {
      return valA.getTime() === valB.getTime();
    }

    return valA === valB;
  });
}

/**
 * Creates a new value object with some properties updated
 * Returns a new frozen object, leaving the original unchanged
 */
export function updateValueObject<T extends object>(
  vo: ValueObject<T>,
  updates: Partial<T>
): ValueObject<T> {
  return createValueObject({ ...vo, ...updates });
}

/**
 * Type guard to check if a value is a valid value object (non-null object)
 */
export function isValueObject<T extends object>(
  value: unknown
): value is ValueObject<T> {
  return typeof value === 'object' && value !== null;
}
