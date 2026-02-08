/**
 * OfferValidity - Value object for offer validity period
 */

import { createValueObject, type ValueObject } from '../../../../core/domain';

interface OfferValidityProps {
  validFrom: Date;
  validUntil: Date;
}

export type OfferValidity = ValueObject<OfferValidityProps>;

/**
 * Creates an OfferValidity value object
 * Enforces invariant: validUntil must be after validFrom
 */
export function createOfferValidity(validFrom: Date, validUntil: Date): OfferValidity {
  if (validUntil <= validFrom) {
    throw new Error('Offer validUntil must be after validFrom');
  }

  return createValueObject({
    validFrom: new Date(validFrom),
    validUntil: new Date(validUntil),
  });
}

/**
 * Checks if the offer validity period includes the current date
 */
export function isOfferValidNow(validity: OfferValidity): boolean {
  const now = new Date();
  return now >= validity.validFrom && now <= validity.validUntil;
}

/**
 * Checks if the offer validity period includes a specific date
 */
export function isOfferValidOn(validity: OfferValidity, date: Date): boolean {
  return date >= validity.validFrom && date <= validity.validUntil;
}

/**
 * Gets the number of days remaining until the offer expires
 * Returns 0 if already expired, negative if not yet started
 */
export function getDaysUntilExpiry(validity: OfferValidity): number {
  const now = new Date();
  const diffMs = validity.validUntil.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks if the offer is expiring soon (within the specified days)
 */
export function isExpiringSoon(validity: OfferValidity, withinDays: number = 30): boolean {
  const daysRemaining = getDaysUntilExpiry(validity);
  return daysRemaining > 0 && daysRemaining <= withinDays;
}
