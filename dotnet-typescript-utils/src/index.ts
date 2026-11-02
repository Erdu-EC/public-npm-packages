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
  isValidDateTimeString,
  isValidDateOnlyString,
  isDateTimeOffsetString,
  dateTimeStringToDate,
  dateOnlyStringToDate,
  dateToDateTimeString,
  dateToDateTimeOffsetString,
  dateToDateOnlyString,
} from './isoDate';

// ─── Guid ────────────────────────────────────────────────────────────────────

export type { GUIDString } from './guid';
export {
  isValidGuidString,
  normalizeGuidString,
  emptyGuid,
  isGuidEmpty,
  areGuidsEqual,
} from './guid';

// ─── TimeSpan ────────────────────────────────────────────────────────────────

export type { TimeSpanString } from './timeSpan';
export {
  TimeSpanComponents,
  isValidTimeSpanString,
  timeSpanToMilliseconds,
  millisecondsToTimeSpanString,
  splitTimeSpan,
  timeSpanComponentsToString,
  addTimeSpans,
  subtractTimeSpans,
  multiplyTimeSpan,
  divideTimeSpan,
  zeroTimeSpan,
  isTimeSpanZero,
} from './timeSpan';
