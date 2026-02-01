// Base classes
export { Entity } from './Entity';
export { AggregateRoot } from './AggregateRoot';

// Value Object utilities
export type { ValueObject } from './ValueObject';
export {
  createValueObject,
  valueObjectEquals,
  updateValueObject,
  isValueObject,
} from './ValueObject';

// Types - Branded IDs
export type {
  BrandedId,
  UserId,
  SupplierId,
  OfferId,
  BookingId,
  ReviewId,
  MessageId,
  ConversationId,
  PaymentId,
  ImageId,
  AmenityId,
  CategoryId,
} from './types/BrandedId';

export {
  createId,
  generateId,
  createUserId,
  generateUserId,
  createSupplierId,
  generateSupplierId,
  createOfferId,
  generateOfferId,
  createBookingId,
  generateBookingId,
  createReviewId,
  generateReviewId,
  createMessageId,
  generateMessageId,
  createConversationId,
  generateConversationId,
  createPaymentId,
  generatePaymentId,
  createImageId,
  generateImageId,
  createAmenityId,
  generateAmenityId,
  createCategoryId,
  generateCategoryId,
} from './types/BrandedId';

// Types - Result
export type { Result } from './types/Result';
export {
  ok,
  err,
  isOk,
  isErr,
  map,
  mapErr,
  flatMap,
  unwrap,
  unwrapOr,
  unwrapErr,
  match,
  all,
  tryCatch,
  tryCatchAsync,
} from './types/Result';
