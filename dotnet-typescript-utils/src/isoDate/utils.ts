import {ISODateOnlyString, ISODateString, DateTimeOffsetString} from './ISODateString';

const ISO_DATETIME_RE =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?((?:[+-]\d{2}:\d{2})|Z)?$/;

const ISO_DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Type guard: checks whether a string is a valid .NET DateTime format.
 * Accepts local (no timezone), UTC (`Z`), and offset (`+HH:MM`/`-HH:MM`) formats.
 */
export function isDateTimeString(value: string): value is ISODateString {
    return ISO_DATETIME_RE.test(value);
}

/**
 * Type guard: checks whether a string is a .NET DateTimeOffset format (always includes an offset).
 * This is a subset of `ISODateString` — use this to distinguish offset strings from
 * local or UTC strings.
 */
export function isOffsetDateTime(value: string): value is DateTimeOffsetString {
    return ISO_DATETIME_RE.test(value) && /[+-]\d{2}:\d{2}$/.test(value);
}

/**
 * Type guard: checks whether a string is a valid .NET DateOnly format.
 */
export function isDateOnlyString(value: string): value is ISODateOnlyString {
    return ISO_DATE_ONLY_RE.test(value);
}

/**
 * Parses a .NET DateTime string and returns a JavaScript `Date` object.
 * - Strings with `Z` or without a timezone designator are parsed as UTC.
 * - Strings with an offset (e.g. `+05:30`) are parsed via the native Date constructor.
 *
 * @throws `RangeError` if the string is not a valid DateTime format.
 */
export function parseDateTime(value: ISODateString): Date {
    if (!isDateTimeString(value)) {
        throw new RangeError(`Invalid DateTime string: "${value}"`);
    }

    const match = ISO_DATETIME_RE.exec(value);
    if (!match) {
        throw new RangeError(`Failed to parse DateTime string: "${value}"`);
    }

    const [, year, month, day, hour, minute, second, fractional, timezone] = match;

    if (timezone === 'Z' || !timezone) {
        const y = parseInt(year, 10);
        const m = parseInt(month, 10) - 1;
        const d = parseInt(day, 10);
        const h = parseInt(hour, 10);
        const mi = parseInt(minute, 10);
        const s = parseInt(second, 10);
        const ms = fractional ? Math.floor(parseInt(fractional, 10) / Math.pow(10, fractional.length - 3)) : 0;

        return new Date(Date.UTC(y, m, d, h, mi, s, ms));
    } else {
        return new Date(value);
    }
}

/**
 * Parses a .NET DateOnly string and returns a JavaScript `Date` at midnight UTC.
 *
 * @throws `RangeError` if the string is not a valid DateOnly format.
 */
export function parseDateOnly(value: ISODateOnlyString): Date {
    if (!isDateOnlyString(value)) {
        throw new RangeError(`Invalid DateOnly string: "${value}"`);
    }

    const match = ISO_DATE_ONLY_RE.exec(value);
    if (!match) {
        throw new RangeError(`Failed to parse DateOnly string: "${value}"`);
    }

    const [, year, month, day] = match;

    return new Date(Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
    ));
}

/**
 * Converts a JavaScript `Date` to a .NET DateTime string in UTC format (ends with `Z`).
 * Since JavaScript `Date` is inherently a UTC point in time, `toISOString()` is the
 * most faithful representation.
 */
export function toDateTimeString(date: Date): ISODateString {
    return date.toISOString() as ISODateString;
}

/**
 * Converts a JavaScript `Date` to a .NET DateOnly string (UTC date portion).
 */
export function toDateOnlyString(date: Date): ISODateOnlyString {
    const year = String(date.getUTCFullYear()).padStart(4, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}` as ISODateOnlyString;
}
