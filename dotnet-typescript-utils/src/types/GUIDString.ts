/**
 * Represents a .NET `Guid` string in the standard 8-4-4-4-12 format.
 * Accepts both lowercase and uppercase hex digits.
 *
 * Note: Use `isGUIDString()` for runtime validation.
 *
 * @example `"550e8400-e29b-41d4-a716-446655440000"`
 * @example `"550E8400-E29B-41D4-A716-446655440000"`
 */
type Hex4 = `${number}${number}${number}${number}`;
type Hex8 = `${Hex4}${Hex4}`;
type Hex12 = `${Hex8}${Hex4}`;
export type GUIDString = `${Hex8}-${Hex4}-${Hex4}-${Hex4}-${Hex12}`;
