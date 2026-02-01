/**
 * Type Safety Tests - These tests verify compile-time type safety
 *
 * Run with: npx tsc --noEmit src/core/domain/__tests__/type-safety.test.ts
 *
 * If this file compiles successfully, the type safety is working.
 * The @ts-expect-error comments should trigger errors - if they don't, something is wrong.
 */

import type { UserId, SupplierId } from '../index';
import {
  createUserId,
  createSupplierId,
  generateUserId,
  ok,
  err,
  isOk,
  isErr,
  map,
  unwrap,
  createValueObject,
  valueObjectEquals,
} from '../index';

// ============================================================================
// Branded ID Type Safety Tests
// ============================================================================

// Test: Cannot assign UserId to SupplierId
function acceptSupplierId(id: SupplierId): void {
  console.log('Supplier ID:', id);
}
const supplierId: SupplierId = createSupplierId('supplier-456');
acceptSupplierId(supplierId); // Should work with correct type
const userId: UserId = createUserId('user-123');

// @ts-expect-error - UserId should not be assignable to SupplierId
acceptSupplierId(userId);

// Test: Can use the correct type
function acceptUserId(id: UserId): void {
  console.log('User ID:', id);
}
acceptUserId(userId); // Should work

// Test: Branded IDs are still strings for JSON serialization
const userIdString: string = userId; // Should work - branded types are still strings
console.log(userIdString);

// ============================================================================
// Result Type Safety Tests
// ============================================================================

// Test: ok() creates a successful result
const successResult = ok<number, string>(42);
if (isOk(successResult)) {
  const value: number = successResult.value; // Type should be number
  console.log(value);
}

// Test: err() creates a failed result
const errorResult = err<string, number>('Something went wrong');
if (isErr(errorResult)) {
  const error: string = errorResult.error; // Type should be string
  console.log(error);
}

// Test: map preserves types
const mappedResult = map(successResult, (n) => n.toString());
if (isOk(mappedResult)) {
  const value: string = mappedResult.value; // Type should be string
  console.log(value);
}

// Test: unwrap returns the correct type
const unwrapped: number = unwrap(successResult);
console.log(unwrapped);

// ============================================================================
// Value Object Tests
// ============================================================================

interface Address {
  street: string;
  city: string;
  country: string;
}

const address1 = createValueObject<Address>({
  street: '123 Main St',
  city: 'Dublin',
  country: 'Ireland',
});

const address2 = createValueObject<Address>({
  street: '123 Main St',
  city: 'Dublin',
  country: 'Ireland',
});

// Test: Value objects should be equal by structure
const areEqual = valueObjectEquals(address1, address2); // Should be true
console.log('Addresses equal:', areEqual);

// Test: Value objects should be immutable (readonly)
// @ts-expect-error - Should not be able to modify a frozen value object
address1.street = '456 Other St';

// ============================================================================
// Integration Test
// ============================================================================

// Test: Typical usage pattern
function findUser(_id: UserId): { id: UserId; name: string } | null {
  return { id: _id, name: 'John Doe' };
}

const newUserId = generateUserId();
const user = findUser(newUserId);
if (user) {
  console.log(`Found user: ${user.name} with ID: ${user.id}`);
}

console.log('All type safety tests passed!');
