/**
 * Aggregate Root Base Class - Consistency boundary for domain objects
 *
 * An Aggregate Root is the entry point to an aggregate - a cluster of domain
 * objects that are treated as a single unit for data changes. The root is
 * responsible for enforcing invariants and collecting domain events.
 */

import { Entity } from './Entity';
import type { BrandedId } from './types/BrandedId';
import type { DomainEvent } from '../events/DomainEvent';

/**
 * Abstract base class for all aggregate roots
 *
 * Extends Entity with domain event management capabilities.
 * Events are collected during operations and pulled out after persistence.
 *
 * @typeParam IdType - The branded ID type for this aggregate
 * @typeParam Props - The properties interface (must include id)
 */
export abstract class AggregateRoot<
  IdType extends BrandedId<string>,
  Props extends { id: IdType },
> extends Entity<IdType, Props> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(props: Props) {
    super(props);
  }

  /**
   * Returns the type name of this aggregate (used in events)
   * Override in subclasses to provide specific aggregate type names
   */
  protected get aggregateType(): string {
    return this.constructor.name;
  }

  /**
   * Adds a domain event to be dispatched after persistence
   *
   * Events should describe what happened, not what should happen.
   * They are facts about state changes in the aggregate.
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Returns and clears all pending domain events
   *
   * Call this after successfully persisting the aggregate to get
   * events that should be dispatched to event handlers.
   *
   * Pattern:
   * 1. Perform operation on aggregate (events collected)
   * 2. Persist aggregate to database
   * 3. If persistence succeeds, call pullDomainEvents()
   * 4. Dispatch events to handlers
   */
  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  /**
   * Returns the current domain events without clearing them
   * Useful for debugging or testing
   */
  peekDomainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Returns true if there are pending domain events
   */
  hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  /**
   * Clears all pending domain events without returning them
   * Use with caution - typically you want pullDomainEvents()
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
