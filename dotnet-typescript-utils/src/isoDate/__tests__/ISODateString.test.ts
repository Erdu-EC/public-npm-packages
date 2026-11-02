import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isDateTimeString,
  isDateOnlyString,
  isOffsetDateTime,
  parseDateTime,
  parseDateOnly,
  toDateTimeString,
  toDateTimeOffsetString,
  toDateOnlyString,
} from '../utils';

describe('isDateTimeString', () => {
  it('accepts UTC with Z', () => {
    assert.ok(isDateTimeString('2026-02-02T01:27:20Z'));
  });

  it('accepts offset datetime', () => {
    assert.ok(isDateTimeString('2026-02-02T01:27:20+05:30'));
  });

  it('accepts datetime without timezone', () => {
    assert.ok(isDateTimeString('2026-02-02T01:27:20.366626'));
  });

  it('rejects invalid strings', () => {
    assert.ok(!isDateTimeString('not-a-date'));
    assert.ok(!isDateTimeString('2026-02-02'));
  });
});

describe('isDateOnlyString', () => {
  it('accepts valid date-only', () => {
    assert.ok(isDateOnlyString('2026-02-02'));
  });

  it('rejects datetime strings', () => {
    assert.ok(!isDateOnlyString('2026-02-02T01:27:20Z'));
  });
});

describe('parseDateTime', () => {
  it('parses UTC Z string', () => {
    const date = parseDateTime('2026-02-02T01:27:20Z');
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 1);
    assert.strictEqual(date.getUTCDate(), 2);
    assert.strictEqual(date.getUTCHours(), 1);
    assert.strictEqual(date.getUTCMinutes(), 27);
    assert.strictEqual(date.getUTCSeconds(), 20);
  });

  it('parses offset string and converts to UTC', () => {
    const date = parseDateTime('2026-02-02T01:27:20+05:30');
    assert.strictEqual(date.getUTCDate(), 1);
    assert.strictEqual(date.getUTCHours(), 19);
    assert.strictEqual(date.getUTCMinutes(), 57);
  });

  it('treats unspecified timezone as UTC', () => {
    const date = parseDateTime('2026-02-02T01:27:20.366626');
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 1);
    assert.strictEqual(date.getUTCDate(), 2);
    assert.strictEqual(date.getUTCHours(), 1);
    assert.strictEqual(date.getUTCMinutes(), 27);
    assert.strictEqual(date.getUTCSeconds(), 20);
    assert.strictEqual(date.getUTCMilliseconds(), 366);
  });

  it('throws on invalid string', () => {
    assert.throws(() => parseDateTime('invalid' as any), RangeError);
  });
});

describe('parseDateOnly', () => {
  it('parses date-only to midnight UTC', () => {
    const date = parseDateOnly('2026-02-02');
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 1);
    assert.strictEqual(date.getUTCDate(), 2);
    assert.strictEqual(date.getUTCHours(), 0);
  });
});

describe('toDateTimeString', () => {
  it('formats date as UTC ISO string with Z', () => {
    const date = new Date(Date.UTC(2026, 1, 2, 1, 27, 20, 366));
    const result = toDateTimeString(date);
    assert.strictEqual(result, '2026-02-02T01:27:20.366Z');
  });
});

describe('toDateOnlyString', () => {
  it('formats date as UTC date-only string', () => {
    const date = new Date(Date.UTC(2026, 1, 2, 1, 27, 20));
    assert.strictEqual(toDateOnlyString(date), '2026-02-02');
  });
});

describe('isOffsetDateTime', () => {
  it('accepts datetime with positive offset', () => {
    assert.ok(isOffsetDateTime('2026-02-02T01:27:20+05:30'));
  });

  it('accepts datetime with negative offset', () => {
    assert.ok(isOffsetDateTime('2026-02-02T01:27:20-04:00'));
  });

  it('accepts datetime with offset and fractional seconds', () => {
    assert.ok(isOffsetDateTime('2026-02-02T01:27:20.366+05:30'));
  });

  it('rejects UTC Z datetime', () => {
    assert.ok(!isOffsetDateTime('2026-02-02T01:27:20Z'));
  });

  it('rejects datetime without timezone', () => {
    assert.ok(!isOffsetDateTime('2026-02-02T01:27:20.366626'));
  });

  it('rejects invalid strings', () => {
    assert.ok(!isOffsetDateTime('not-a-date'));
    assert.ok(!isOffsetDateTime('2026-02-02'));
  });
});

describe('toDateTimeOffsetString', () => {
  it('formats date with local timezone offset', () => {
    const date = new Date(Date.UTC(2026, 1, 2, 1, 27, 20, 366));
    const result = toDateTimeOffsetString(date);
    const offset = date.getTimezoneOffset();
    const offsetSign = offset <= 0 ? '+' : '-';
    const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
    assert.strictEqual(result, `2026-02-02T01:27:20.366${offsetSign}${offsetHours}:${offsetMinutes}`);
  });

  it('returns a valid DateTimeOffset string', () => {
    const result = toDateTimeOffsetString(new Date());
    assert.ok(isOffsetDateTime(result));
  });
});

