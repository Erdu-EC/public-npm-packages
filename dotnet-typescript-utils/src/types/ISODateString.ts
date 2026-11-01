/**
 * Represents a date-only string in ISO 8601 format.
 * Corresponds to .NET `DateOnly` (available since .NET 8).
 *
 * @example `"2026-02-02"`
 */
export type ISODateOnlyString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

/**
 * Represents a date-time string in ISO 8601 format.
 * Corresponds to .NET `DateTime` and `OffsetDateTime` types.
 *
 * Supported formats:
 * - `"2026-02-02T01:27:20.366626"` — Local / Unspecified `DateTime`
 * - `"2026-02-02T01:27:20.366626+00:00"` — `OffsetDateTime` with timezone offset
 * - `"2026-02-02T01:27:20Z"` — UTC `DateTime`
 *
 * @example `"2026-02-02T01:27:20.366626"`
 * @example `"2026-02-02T01:27:20.366626+05:30"`
 * @example `"2026-02-02T01:27:20Z"`
 */
export type ISODateString =
  | `${ISODateOnlyString}T${number}:${number}:${number}`
  | `${ISODateOnlyString}T${number}:${number}:${number}.${number}`
  | `${ISODateOnlyString}T${number}:${number}:${number}Z`
  | `${ISODateOnlyString}T${number}:${number}:${number}.${number}Z`
  | `${ISODateOnlyString}T${number}:${number}:${number}${'+' | '-'}${number}:${number}`
  | `${ISODateOnlyString}T${number}:${number}:${number}.${number}${'+' | '-'}${number}:${number}`;
