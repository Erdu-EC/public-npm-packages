import { TimeSpanComponents, TimeSpanString } from './TimeSpanString';

// ── Regex patterns ───────────────────────────────────────────────────────────

const TIMESPAN_RE = /^(-?)(\d+):(\d{2}):(\d{2})(?:\.(\d+))?$/;
const TIMESPAN_DAYS_RE = /^(-?)(\d+):(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/;

// ── Internal helpers ─────────────────────────────────────────────────────────

interface ParsedRaw {
  negative: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  fractional: number;
}

function parseTimeSpanRaw(value: string): ParsedRaw {
  const daysMatch = TIMESPAN_DAYS_RE.exec(value);
  const timeMatch = TIMESPAN_RE.exec(value);

  if (daysMatch) {
    return {
      negative: value.startsWith('-'),
      days: parseInt(daysMatch[2], 10),
      hours: parseInt(daysMatch[3], 10),
      minutes: parseInt(daysMatch[4], 10),
      seconds: parseInt(daysMatch[5], 10),
      fractional: daysMatch[6]
        ? parseInt(daysMatch[6], 10) / Math.pow(10, daysMatch[6].length)
        : 0,
    };
  }

  if (timeMatch) {
    return {
      negative: value.startsWith('-'),
      days: 0,
      hours: parseInt(timeMatch[2], 10),
      minutes: parseInt(timeMatch[3], 10),
      seconds: parseInt(timeMatch[4], 10),
      fractional: timeMatch[5]
        ? parseInt(timeMatch[5], 10) / Math.pow(10, timeMatch[5].length)
        : 0,
    };
  }

  throw new RangeError(`Failed to parse TimeSpan string: "${value}"`);
}

function rawToMilliseconds(raw: ParsedRaw): number {
  const totalMs =
    raw.days * 86400000 +
    raw.hours * 3600000 +
    raw.minutes * 60000 +
    Math.floor((raw.seconds + raw.fractional) * 1000);
  return raw.negative ? -totalMs : totalMs;
}

function componentsToMilliseconds(components: TimeSpanComponents): number {
  const totalMs =
    components.days * 86400000 +
    components.hours * 3600000 +
    components.minutes * 60000 +
    components.seconds * 1000 +
    components.milliseconds;
  return components.negative ? -totalMs : totalMs;
}

type TimeSpanInput = TimeSpanString | TimeSpanComponents;

function toMilliseconds(input: TimeSpanInput): number {
  if (typeof input === 'string') {
    return timeSpanToMilliseconds(input);
  }
  return componentsToMilliseconds(input);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Type guard: checks whether a string is a valid .NET TimeSpan format.
 */
export function isValidTimeSpanString(value: string): value is TimeSpanString {
  return TIMESPAN_RE.test(value) || TIMESPAN_DAYS_RE.test(value);
}

/**
 * Converts a .NET TimeSpan string to total milliseconds.
 * Note: .NET supports 7-digit fractional seconds (100ns ticks), but only
 * millisecond precision is preserved.
 *
 * @throws `RangeError` if the string is not a valid TimeSpan format.
 */
export function timeSpanToMilliseconds(value: TimeSpanString): number {
  if (!isValidTimeSpanString(value)) {
    throw new RangeError(`Invalid TimeSpan string: "${value}"`);
  }
  return rawToMilliseconds(parseTimeSpanRaw(value));
}

/**
 * Converts a duration in milliseconds to a .NET TimeSpan string.
 * The result always includes the `.fff` fractional part.
 */
export function millisecondsToTimeSpanString(milliseconds: number): TimeSpanString {
  const negative = milliseconds < 0;
  const absMs = Math.abs(milliseconds);

  const totalSeconds = Math.floor(absMs / 1000);
  const remainingMs = absMs % 1000;
  const fractional = String(remainingMs).padStart(3, '0');

  const days = Math.floor(totalSeconds / 86400);
  const remainingSeconds = totalSeconds % 86400;
  const hours = Math.floor(remainingSeconds / 3600);
  const remainingAfterHours = remainingSeconds % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = remainingAfterHours % 60;

  let result: string;
  if (days > 0) {
    result = `${days}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${fractional}`;
  } else {
    result = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${fractional}`;
  }

  if (negative) {
    result = `-${result}`;
  }

  return result as TimeSpanString;
}

/**
 * Splits a .NET TimeSpan string into its individual components.
 *
 * @throws `RangeError` if the string is not a valid TimeSpan format.
 */
export function splitTimeSpan(value: TimeSpanString): TimeSpanComponents {
  if (!isValidTimeSpanString(value)) {
    throw new RangeError(`Invalid TimeSpan string: "${value}"`);
  }

  const raw = parseTimeSpanRaw(value);
  const milliseconds = Math.floor(raw.fractional * 1000);

  const components: TimeSpanComponents = {
    days: raw.days,
    hours: raw.hours,
    minutes: raw.minutes,
    seconds: raw.seconds,
    milliseconds,
    negative: raw.negative,
    toString(): TimeSpanString {
      return millisecondsToTimeSpanString(componentsToMilliseconds(components));
    },
  };
  return components;
}

/**
 * Converts `TimeSpanComponents` to a .NET TimeSpan string.
 */
export function timeSpanComponentsToString(components: TimeSpanComponents): TimeSpanString {
  return millisecondsToTimeSpanString(componentsToMilliseconds(components));
}

/**
 * Adds two TimeSpan values and returns the result as a TimeSpan string.
 * Accepts both `TimeSpanString` and `TimeSpanComponents`.
 */
export function addTimeSpans(a: TimeSpanInput, b: TimeSpanInput): TimeSpanString {
  return millisecondsToTimeSpanString(toMilliseconds(a) + toMilliseconds(b));
}

/**
 * Subtracts the second TimeSpan from the first.
 * Accepts both `TimeSpanString` and `TimeSpanComponents`.
 */
export function subtractTimeSpans(a: TimeSpanInput, b: TimeSpanInput): TimeSpanString {
  return millisecondsToTimeSpanString(toMilliseconds(a) - toMilliseconds(b));
}

/**
 * Multiplies a TimeSpan by a scalar factor.
 * Accepts both `TimeSpanString` and `TimeSpanComponents`.
 */
export function multiplyTimeSpan(timeSpan: TimeSpanInput, factor: number): TimeSpanString {
  return millisecondsToTimeSpanString(toMilliseconds(timeSpan) * factor);
}

/**
 * Divides a TimeSpan by a scalar divisor (truncates toward zero, matching .NET behavior).
 * Accepts both `TimeSpanString` and `TimeSpanComponents`.
 *
 * @throws `RangeError` if the divisor is zero.
 */
export function divideTimeSpan(timeSpan: TimeSpanInput, divisor: number): TimeSpanString {
  if (divisor === 0) {
    throw new RangeError('Cannot divide TimeSpan by zero');
  }
  return millisecondsToTimeSpanString(Math.trunc(toMilliseconds(timeSpan) / divisor));
}

/**
 * Returns a zero TimeSpan string: `"00:00:00.000"`.
 */
export function zeroTimeSpan(): TimeSpanString {
  return '00:00:00.000';
}

/**
 * Checks if a TimeSpan represents zero duration.
 * Accepts both `TimeSpanString` and `TimeSpanComponents`.
 */
export function isTimeSpanZero(value: TimeSpanInput): boolean {
  return toMilliseconds(value) === 0;
}
