import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isValidDateTimeString,
  isValidDateOnlyString,
  isDateTimeOffsetString,
  dateTimeStringToDate,
  dateOnlyStringToDate,
  dateToDateTimeString,
  dateToDateTimeOffsetString,
  dateToDateOnlyString,
} from '../utils';

describe('isValidDateTimeString', () => {
  it('accepts UTC with Z', () => {
    assert.ok(isValidDateTimeString('2026-02-02T01:27:20Z'));
  });

  it('accepts offset datetime', () => {
    assert.ok(isValidDateTimeString('2026-02-02T01:27:20+05:30'));
  });

  it('accepts datetime without timezone', () => {
    assert.ok(isValidDateTimeString('2026-02-02T01:27:20.366626'));
  });

  it('rejects invalid strings', () => {
    assert.ok(!isValidDateTimeString('not-a-date'));
    assert.ok(!isValidDateTimeString('2026-02-02'));
  });
});

describe('isValidDateOnlyString', () => {
  it('accepts valid date-only', () => {
    assert.ok(isValidDateOnlyString('2026-02-02'));
  });

  it('rejects datetime strings', () => {
    assert.ok(!isValidDateOnlyString('2026-02-02T01:27:20Z'));
  });
});

describe('dateTimeStringToDate', () => {
  it('parses UTC Z string', () => {
    const date = dateTimeStringToDate('2026-02-02T01:27:20Z');
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 1);
    assert.strictEqual(date.getUTCDate(), 2);
    assert.strictEqual(date.getUTCHours(), 1);
    assert.strictEqual(date.getUTCMinutes(), 27);
    assert.strictEqual(date.getUTCSeconds(), 20);
  });

  it('parses offset string and converts to UTC', () => {
    const date = dateTimeStringToDate('2026-02-02T01:27:20+05:30');
    assert.strictEqual(date.getUTCDate(), 1);
    assert.strictEqual(date.getUTCHours(), 19);
    assert.strictEqual(date.getUTCMinutes(), 57);
  });

  it('treats unspecified timezone as UTC', () => {
    const date = dateTimeStringToDate('2026-02-02T01:27:20.366626');
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 1);
    assert.strictEqual(date.getUTCDate(), 2);
    assert.strictEqual(date.getUTCHours(), 1);
    assert.strictEqual(date.getUTCMinutes(), 27);
    assert.strictEqual(date.getUTCSeconds(), 20);
    assert.strictEqual(date.getUTCMilliseconds(), 366);
  });

  it('throws on invalid string', () => {
    assert.throws(() => dateTimeStringToDate('invalid' as any), RangeError);
  });
});

describe('dateOnlyStringToDate', () => {
  it('parses date-only to midnight UTC', () => {
    const date = dateOnlyStringToDate('2026-02-02');
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 1);
    assert.strictEqual(date.getUTCDate(), 2);
    assert.strictEqual(date.getUTCHours(), 0);
  });
});

describe('dateToDateTimeString', () => {
  it('formats date as UTC ISO string with Z', () => {
    const date = new Date(Date.UTC(2026, 1, 2, 1, 27, 20, 366));
    const result = dateToDateTimeString(date);
    assert.strictEqual(result, '2026-02-02T01:27:20.366Z');
  });
});

describe('dateToDateOnlyString', () => {
  it('formats date as UTC date-only string', () => {
    const date = new Date(Date.UTC(2026, 1, 2, 1, 27, 20));
    assert.strictEqual(dateToDateOnlyString(date), '2026-02-02');
  });
});

describe('isDateTimeOffsetString', () => {
  it('accepts datetime with positive offset', () => {
    assert.ok(isDateTimeOffsetString('2026-02-02T01:27:20+05:30'));
  });

  it('accepts datetime with negative offset', () => {
    assert.ok(isDateTimeOffsetString('2026-02-02T01:27:20-04:00'));
  });

  it('accepts datetime with offset and fractional seconds', () => {
    assert.ok(isDateTimeOffsetString('2026-02-02T01:27:20.366+05:30'));
  });

  it('rejects UTC Z datetime', () => {
    assert.ok(!isDateTimeOffsetString('2026-02-02T01:27:20Z'));
  });

  it('rejects datetime without timezone', () => {
    assert.ok(!isDateTimeOffsetString('2026-02-02T01:27:20.366626'));
  });

  it('rejects invalid strings', () => {
    assert.ok(!isDateTimeOffsetString('not-a-date'));
    assert.ok(!isDateTimeOffsetString('2026-02-02'));
  });
});

describe('dateToDateTimeOffsetString', () => {
  it('formats date with local timezone offset', () => {
    const date = new Date(Date.UTC(2026, 1, 2, 1, 27, 20, 366));
    const result = dateToDateTimeOffsetString(date);
    const offset = date.getTimezoneOffset();
    const offsetSign = offset <= 0 ? '+' : '-';
    const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
    assert.strictEqual(result, `2026-02-02T01:27:20.366${offsetSign}${offsetHours}:${offsetMinutes}`);
  });

  it('returns a valid DateTimeOffset string', () => {
    const result = dateToDateTimeOffsetString(new Date());
    assert.ok(isDateTimeOffsetString(result));
  });
});

