/**
 * Branded ID Types - Type-safe entity identifiers with zero runtime overhead
 *
 * Uses TypeScript's structural typing workaround via branded types to ensure
 * that different ID types cannot be accidentally mixed up at compile time.
 */

// Brand symbol for type safety
declare const __brand: unique symbol;

/**
 * Base branded ID type - creates a nominal type from a primitive
 */
export type BrandedId<Brand extends string> = string & {
  readonly [__brand]: Brand;
};

// ============================================================================
// Pre-defined Domain ID Types
// ============================================================================

export type UserId = BrandedId<'UserId'>;
export type SupplierId = BrandedId<'SupplierId'>;
export type OfferId = BrandedId<'OfferId'>;
export type BookingId = BrandedId<'BookingId'>;
export type ReviewId = BrandedId<'ReviewId'>;
export type MessageId = BrandedId<'MessageId'>;
export type ConversationId = BrandedId<'ConversationId'>;
export type PaymentId = BrandedId<'PaymentId'>;
export type ImageId = BrandedId<'ImageId'>;
export type AmenityId = BrandedId<'AmenityId'>;
export type CategoryId = BrandedId<'CategoryId'>;

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates a branded ID from an existing string value
 * Use when you have an ID from an external source (e.g., API response)
 */
export function createId<B extends string>(value: string): BrandedId<B> {
  return value as BrandedId<B>;
}

/**
 * Generates a new unique branded ID
 * Uses crypto.randomUUID for globally unique identifiers
 */
export function generateId<B extends string>(): BrandedId<B> {
  return crypto.randomUUID() as BrandedId<B>;
}

// ============================================================================
// Type-specific Factory Functions (for convenience)
// ============================================================================

export const createUserId = (value: string): UserId => createId<'UserId'>(value);
export const generateUserId = (): UserId => generateId<'UserId'>();

export const createSupplierId = (value: string): SupplierId => createId<'SupplierId'>(value);
export const generateSupplierId = (): SupplierId => generateId<'SupplierId'>();

export const createOfferId = (value: string): OfferId => createId<'OfferId'>(value);
export const generateOfferId = (): OfferId => generateId<'OfferId'>();

export const createBookingId = (value: string): BookingId => createId<'BookingId'>(value);
export const generateBookingId = (): BookingId => generateId<'BookingId'>();

export const createReviewId = (value: string): ReviewId => createId<'ReviewId'>(value);
export const generateReviewId = (): ReviewId => generateId<'ReviewId'>();

export const createMessageId = (value: string): MessageId => createId<'MessageId'>(value);
export const generateMessageId = (): MessageId => generateId<'MessageId'>();

export const createConversationId = (value: string): ConversationId => createId<'ConversationId'>(value);
export const generateConversationId = (): ConversationId => generateId<'ConversationId'>();

export const createPaymentId = (value: string): PaymentId => createId<'PaymentId'>(value);
export const generatePaymentId = (): PaymentId => generateId<'PaymentId'>();

export const createImageId = (value: string): ImageId => createId<'ImageId'>(value);
export const generateImageId = (): ImageId => generateId<'ImageId'>();

export const createAmenityId = (value: string): AmenityId => createId<'AmenityId'>(value);
export const generateAmenityId = (): AmenityId => generateId<'AmenityId'>();

export const createCategoryId = (value: string): CategoryId => createId<'CategoryId'>(value);
export const generateCategoryId = (): CategoryId => generateId<'CategoryId'>();
