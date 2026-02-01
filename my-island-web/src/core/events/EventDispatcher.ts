/**
 * Event Dispatcher - In-memory pub/sub for domain events
 *
 * Provides a simple mechanism for decoupling event producers (aggregates)
 * from event consumers (handlers). Events are dispatched explicitly after
 * persistence to ensure consistency.
 */

import type { DomainEvent } from './DomainEvent';

/**
 * Handler function type for domain events
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

/**
 * Interface for the event dispatcher
 */
export interface EventDispatcher {
  /**
   * Subscribe to events of a specific type
   * @param eventType - The event type to listen for
   * @param handler - Function to call when event occurs
   * @returns Unsubscribe function
   */
  subscribe<T extends DomainEvent = DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void;

  /**
   * Subscribe to all events regardless of type
   * @param handler - Function to call for any event
   * @returns Unsubscribe function
   */
  subscribeAll(handler: EventHandler): () => void;

  /**
   * Dispatch a single event to all subscribers
   * @param event - The event to dispatch
   */
  dispatch(event: DomainEvent): Promise<void>;

  /**
   * Dispatch multiple events in order
   * @param events - The events to dispatch
   */
  dispatchAll(events: DomainEvent[]): Promise<void>;

  /**
   * Remove all subscriptions (useful for testing)
   */
  clear(): void;
}

/**
 * Creates a new event dispatcher instance
 */
export function createEventDispatcher(): EventDispatcher {
  const handlers = new Map<string, Set<EventHandler>>();
  const globalHandlers = new Set<EventHandler>();

  return {
    subscribe<T extends DomainEvent = DomainEvent>(
      eventType: string,
      handler: EventHandler<T>
    ): () => void {
      if (!handlers.has(eventType)) {
        handlers.set(eventType, new Set());
      }
      handlers.get(eventType)!.add(handler as EventHandler);

      // Return unsubscribe function
      return () => {
        handlers.get(eventType)?.delete(handler as EventHandler);
      };
    },

    subscribeAll(handler: EventHandler): () => void {
      globalHandlers.add(handler);
      return () => {
        globalHandlers.delete(handler);
      };
    },

    async dispatch(event: DomainEvent): Promise<void> {
      const typeHandlers = handlers.get(event.eventType) ?? new Set();

      // Combine type-specific and global handlers
      const allHandlers = [...typeHandlers, ...globalHandlers];

      // Execute all handlers, isolating errors
      await Promise.all(
        allHandlers.map(async (handler) => {
          try {
            await handler(event);
          } catch (error) {
            // Log but don't fail - event handlers should not break the flow
            console.error(
              `Error in event handler for ${event.eventType}:`,
              error
            );
          }
        })
      );
    },

    async dispatchAll(events: DomainEvent[]): Promise<void> {
      for (const event of events) {
        await this.dispatch(event);
      }
    },

    clear(): void {
      handlers.clear();
      globalHandlers.clear();
    },
  };
}

// ============================================================================
// Global Event Dispatcher Singleton
// ============================================================================

let globalDispatcher: EventDispatcher | null = null;

/**
 * Returns the global event dispatcher instance
 * Creates one if it doesn't exist
 */
export function getGlobalEventDispatcher(): EventDispatcher {
  if (!globalDispatcher) {
    globalDispatcher = createEventDispatcher();
  }
  return globalDispatcher;
}

/**
 * Resets the global event dispatcher (useful for testing)
 */
export function resetGlobalEventDispatcher(): void {
  globalDispatcher?.clear();
  globalDispatcher = null;
}
