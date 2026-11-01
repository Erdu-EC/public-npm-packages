import {GUIDString} from '../types/GUIDString';

/**
 * Regex pattern that matches a .NET Guid string in the standard 8-4-4-4-12 format.
 */
const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Checks whether the given string is a valid .NET Guid string.
 *
 * @param value - The string to check.
 * @returns `true` if the string matches the Guid format.
 *
 * @example
 * ```typescript
 * isValidGuidString("550e8400-e29b-41d4-a716-446655440000");  // true
 * isValidGuidString("550E8400-E29B-41D4-A716-446655440000");  // true
 * isValidGuidString("not-a-guid");                            // false
 * ```
 */
export function isValidGuidString(value: string): value is GUIDString {
    return GUID_RE.test(value);
}

/**
 * Normalizes a Guid string to lowercase.
 *
 * @param value - The Guid string to normalize.
 * @returns The lowercase Guid string.
 * @throws `RangeError` if the string is not a valid Guid format.
 *
 * @example
 * ```typescript
 * normalizeGuidString("550E8400-E29B-41D4-A716-446655440000");
 * // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function normalizeGuidString(value: string): GUIDString {
    if (!isValidGuidString(value)) {
        throw new RangeError(`Invalid Guid string: "${value}"`);
    }
    return value.toLowerCase() as GUIDString;
}

/**
 * Returns the empty Guid (all zeros).
 *
 * @returns The empty Guid string.
 *
 * @example
 * ```typescript
 * emptyGuid();
 * // "00000000-0000-0000-0000-000000000000"
 * ```
 */
export function emptyGuid(): GUIDString {
    return '00000000-0000-0000-0000-000000000000';
}

/**
 * Checks if the given Guid is the empty Guid (all zeros).
 *
 * @param value - The Guid string to check.
 * @returns `true` if the Guid is all zeros.
 *
 * @example
 * ```typescript
 * isGuidEmpty("00000000-0000-0000-0000-000000000000");  // true
 * isGuidEmpty("550e8400-e29b-41d4-a716-446655440000");  // false
 * ```
 */
export function isGuidEmpty(value: string): boolean {
    return value.toLowerCase() === emptyGuid();
}

/**
 * Checks whether two Guid strings are equal, ignoring case.
 *
 * @param a - The first Guid string.
 * @param b - The second Guid string.
 * @returns `true` if both Guids are equal.
 * @throws `RangeError` if either string is not a valid Guid format.
 *
 * @example
 * ```typescript
 * areGuidsEqual("550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440000");
 * // true
 *
 * areGuidsEqual("550E8400-E29B-41D4-A716-446655440000", "550e8400-e29b-41d4-a716-446655440000");
 * // true (case-insensitive)
 *
 * areGuidsEqual("00000000-0000-0000-0000-000000000000", "550e8400-e29b-41d4-a716-446655440000");
 * // false
 * ```
 */
export function areGuidsEqual(a: string, b: string): boolean {
    return normalizeGuidString(a) === normalizeGuidString(b);
}
