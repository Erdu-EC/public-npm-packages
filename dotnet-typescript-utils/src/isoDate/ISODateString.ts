/**
 * Represents a date-only string in ISO 8601 format.
 * Corresponds to .NET `DateOnly` (available since .NET 8).
 *
 * @example `"2026-02-02"`
 */
export type ISODateOnlyString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

/**
 * Represents a date-time string in ISO 8601 format.
 * Covers .NET `DateTime` (local, UTC with `Z`) and `DateTimeOffset` (with `+HH:MM`/`-HH:MM` offset).
 *
 * Supported formats:
 * - `"2026-02-02T01:27:20.366626"` — Local / Unspecified `DateTime`
 * - `"2026-02-02T01:27:20Z"` — UTC `DateTime`
 * - `"2026-02-02T01:27:20.366+05:00"` — `DateTimeOffset` with offset
 * - `"2026-02-02T01:27:20-04:00"` — `DateTimeOffset` with negative offset
 */
export type ISODateString =
  | `${ISODateOnlyString}T${number}:${number}:${number}`
  | `${ISODateOnlyString}T${number}:${number}:${number}.${number}`
  | `${ISODateOnlyString}T${number}:${number}:${number}Z`
  | `${ISODateOnlyString}T${number}:${number}:${number}.${number}Z`
  | `${ISODateOnlyString}T${number}:${number}:${number}${'+' | '-'}${number}:${number}`
  | `${ISODateOnlyString}T${number}:${number}:${number}.${number}${'+' | '-'}${number}:${number}`;

/**
 * Alias for `ISODateString` that always includes a timezone offset.
 * Corresponds to .NET `DateTimeOffset`.
 *
 * @example `"2026-02-02T01:27:20.366+05:00"`
 * @example `"2026-02-02T01:27:20-04:00"`
 */
export type DateTimeOffsetString = Extract<
  ISODateString,
  `${string}${'+' | '-'}${number}:${number}`
>;
