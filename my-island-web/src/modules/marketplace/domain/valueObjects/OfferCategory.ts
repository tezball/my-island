/**
 * OfferCategory - Value object representing the category of an offer
 */

import { createValueObject, type ValueObject } from '../../../../core/domain';

/**
 * Offer categories as defined in DOMAIN_MODEL.md
 */
export const OfferCategoryType = {
  FOOD: 'FOOD',
  ACTIVITIES: 'ACTIVITIES',
  GEAR: 'GEAR',
  ATTRACTIONS: 'ATTRACTIONS',
  TRANSPORT: 'TRANSPORT',
} as const;

export type OfferCategoryType = (typeof OfferCategoryType)[keyof typeof OfferCategoryType];

/**
 * Category descriptions for display
 */
export const OfferCategoryDescriptions: Record<OfferCategoryType, string> = {
  FOOD: 'Restaurants, cafes, food vendors',
  ACTIVITIES: 'Tours, experiences, sports',
  GEAR: 'Equipment rental',
  ATTRACTIONS: 'Local attractions, museums',
  TRANSPORT: 'Car rental, bikes, shuttles',
};

interface OfferCategoryProps {
  type: OfferCategoryType;
}

export type OfferCategory = ValueObject<OfferCategoryProps>;

/**
 * Creates an OfferCategory value object
 */
export function createOfferCategory(type: OfferCategoryType): OfferCategory {
  if (!Object.values(OfferCategoryType).includes(type)) {
    throw new Error(`Invalid offer category: ${type}`);
  }
  return createValueObject({ type });
}

/**
 * Gets the description for a category
 */
export function getOfferCategoryDescription(category: OfferCategory): string {
  return OfferCategoryDescriptions[category.type];
}

/**
 * Type guard to check if a string is a valid OfferCategoryType
 */
export function isValidOfferCategory(value: string): value is OfferCategoryType {
  return Object.values(OfferCategoryType).includes(value as OfferCategoryType);
}
