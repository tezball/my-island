/**
 * Entity Base Class - Identity-based domain objects
 *
 * Entities are distinguished by their identity (ID) rather than their attributes.
 * Two entities with the same ID are considered equal, regardless of other properties.
 */

import type { BrandedId } from './types/BrandedId';

/**
 * Abstract base class for all domain entities
 *
 * @typeParam IdType - The branded ID type for this entity
 * @typeParam Props - The properties interface for this entity (must include id)
 */
export abstract class Entity<
  IdType extends BrandedId<string>,
  Props extends { id: IdType },
> {
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  /**
   * Returns the unique identifier for this entity
   */
  get id(): IdType {
    return this.props.id;
  }

  /**
   * Compares entities by identity (ID)
   * Two entities are equal if they have the same ID, regardless of other properties
   */
  equals(other: Entity<IdType, Props> | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    // Compare by ID - the defining characteristic of entity equality
    return this.id === other.id;
  }

  /**
   * Returns the ID as a string for debugging/logging
   */
  toString(): string {
    return `${this.constructor.name}(${this.id})`;
  }
}
