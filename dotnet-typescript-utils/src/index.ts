/**
 * dotnet-typescript-utils
 *
 * TypeScript types and utilities for .NET Core 10 date, time, and value types.
 * All date operations handle dates as UTC.
 *
 * @module
 */

// ─── DateTime, DateTimeOffset & DateOnly ─────────────────────────────────────

export type { ISODateOnlyString, ISODateString, DateTimeOffsetString } from './isoDate';
export {
  isDateTimeString,
  isDateOnlyString,
  isOffsetDateTime,
  parseDateTime,
  parseDateOnly,
  toDateTimeString,
  toDateOnlyString,
} from './isoDate';

// ─── Guid ────────────────────────────────────────────────────────────────────

export type { GUIDString } from './guid';
export {
  isGuidString,
  normalizeGuid,
  emptyGuid,
  isGuidEmpty,
  areGuidsEqual,
} from './guid';

// ─── TimeSpan ────────────────────────────────────────────────────────────────

export type { TimeSpanString } from './timeSpan';
export {
  TimeSpanComponents,
  isTimeSpanString,
  timeSpanToMilliseconds,
  millisecondsToTimeSpan,
  splitTimeSpan,
  addTimeSpans,
  subtractTimeSpans,
  multiplyTimeSpan,
  divideTimeSpan,
  zeroTimeSpan,
  isTimeSpanZero,
} from './timeSpan';
