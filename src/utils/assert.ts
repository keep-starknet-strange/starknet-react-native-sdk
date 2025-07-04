/**
 * Assert function for validation
 * @param condition condition to check
 * @param message error message
 */
export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertUnreachable(value: never): never {
  throw new Error(`Unreachable code reached with value: ${value}`);
}

// Utility functions
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function parse(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error('Invalid JSON string');
  }
} 
