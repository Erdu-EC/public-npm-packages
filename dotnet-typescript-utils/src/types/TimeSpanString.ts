/**
 * Represents a .NET `TimeSpan` string in the standard format.
 *
 * Supported formats:
 * - `"HH:MM:SS"` — Hours, minutes, seconds
 * - `"HH:MM:SS.fffffff"` — With fractional seconds
 * - `"d:HH:MM:SS"` — With days component
 * - `"-HH:MM:SS"` — Negative timespan
 *
 * @example `"01:23:45"`
 * @example `"01:23:45.1234567"`
 * @example `"7:01:23:45"`
 * @example `"-01:23:45"`
 */
export type TimeSpanString =
  | `-${number}:${number}:${number}`
  | `-${number}:${number}:${number}.${number}`
  | `${number}:${number}:${number}`
  | `${number}:${number}:${number}.${number}`
  | `${number}:${number}:${number}:${number}`
  | `${number}:${number}:${number}:${number}.${number}`;
