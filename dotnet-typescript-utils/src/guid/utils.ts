import { GUIDString } from './GUIDString';

const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Type guard: checks whether a string is a valid .NET Guid format.
 */
export function isValidGuidString(value: string): value is GUIDString {
  return GUID_RE.test(value);
}

/**
 * Normalizes a Guid string to lowercase.
 * @throws `RangeError` if the string is not a valid Guid format.
 */
export function normalizeGuidString(value: string): GUIDString {
  if (!isValidGuidString(value)) {
    throw new RangeError(`Invalid Guid string: "${value}"`);
  }
  return value.toLowerCase() as GUIDString;
}

/**
 * Returns the empty Guid (all zeros).
 */
export function emptyGuid(): GUIDString {
  return '00000000-0000-0000-0000-000000000000';
}

/**
 * Checks if the given Guid is the empty Guid (all zeros).
 */
export function isGuidEmpty(value: string): boolean {
  return value.toLowerCase() === emptyGuid();
}

/**
 * Checks whether two Guid strings are equal, ignoring case.
 * @throws `RangeError` if either string is not a valid Guid format.
 */
export function areGuidsEqual(a: string, b: string): boolean {
  return normalizeGuidString(a) === normalizeGuidString(b);
}
