/**
 * Result Type - Functional error handling alternative to exceptions
 *
 * A discriminated union that represents either a successful value (Ok)
 * or an error (Err). Forces explicit error handling at compile time.
 */

// ============================================================================
// Core Result Types
// ============================================================================

interface Ok<T> {
  readonly _tag: 'Ok';
  readonly value: T;
}

interface Err<E> {
  readonly _tag: 'Err';
  readonly error: E;
}

/**
 * Result type - either a success with value T or an error with value E
 */
export type Result<T, E> = Ok<T> | Err<E>;

// ============================================================================
// Constructors
// ============================================================================

/**
 * Creates a successful Result containing the given value
 */
export function ok<T, E = never>(value: T): Result<T, E> {
  return { _tag: 'Ok', value };
}

/**
 * Creates a failed Result containing the given error
 */
export function err<E, T = never>(error: E): Result<T, E> {
  return { _tag: 'Err', error };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a Result is Ok
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === 'Ok';
}

/**
 * Type guard to check if a Result is Err
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === 'Err';
}

// ============================================================================
// Transformations
// ============================================================================

/**
 * Maps the success value using the provided function
 * If the Result is an Err, returns it unchanged
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return ok(fn(result.value));
  }
  return result;
}

/**
 * Maps the error value using the provided function
 * If the Result is Ok, returns it unchanged
 */
export function mapErr<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  if (isErr(result)) {
    return err(fn(result.error));
  }
  return result;
}

/**
 * Chains Results - applies fn if Ok, otherwise returns the Err
 * Useful for sequencing operations that can fail
 */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (isOk(result)) {
    return fn(result.value);
  }
  return result;
}

// ============================================================================
// Extraction
// ============================================================================

/**
 * Extracts the value from an Ok Result
 * Throws if the Result is an Err
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(`Called unwrap on an Err value: ${result.error}`);
}

/**
 * Extracts the value from an Ok Result, or returns the default value
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (isOk(result)) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Extracts the error from an Err Result
 * Throws if the Result is Ok
 */
export function unwrapErr<T, E>(result: Result<T, E>): E {
  if (isErr(result)) {
    return result.error;
  }
  throw new Error(`Called unwrapErr on an Ok value`);
}

/**
 * Pattern matches on a Result, calling the appropriate handler
 */
export function match<T, E, U>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => U;
    err: (error: E) => U;
  }
): U {
  if (isOk(result)) {
    return handlers.ok(result.value);
  }
  return handlers.err(result.error);
}

// ============================================================================
// Combinators
// ============================================================================

/**
 * Combines multiple Results into a single Result containing an array
 * Returns the first Err encountered, or Ok with all values
 */
export function all<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (isErr(result)) {
      return result;
    }
    values.push(result.value);
  }
  return ok(values);
}

/**
 * Wraps a function that might throw into one that returns a Result
 */
export function tryCatch<T, E = Error>(
  fn: () => T,
  onError: (e: unknown) => E = (e) => e as E
): Result<T, E> {
  try {
    return ok(fn());
  } catch (e) {
    return err(onError(e));
  }
}

/**
 * Wraps an async function that might throw into one that returns a Result
 */
export async function tryCatchAsync<T, E = Error>(
  fn: () => Promise<T>,
  onError: (e: unknown) => E = (e) => e as E
): Promise<Result<T, E>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(onError(e));
  }
}
