import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
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
} from '../utils';

describe('isValidTimeSpanString', () => {
  it('accepts HH:MM:SS format', () => {
    assert.ok(isValidTimeSpanString('01:23:45'));
  });

  it('accepts with fractional seconds', () => {
    assert.ok(isValidTimeSpanString('01:23:45.1234567'));
  });

  it('accepts days format', () => {
    assert.ok(isValidTimeSpanString('7:01:23:45'));
  });

  it('accepts negative TimeSpan', () => {
    assert.ok(isValidTimeSpanString('-01:23:45'));
  });

  it('rejects invalid strings', () => {
    assert.ok(!isValidTimeSpanString('not-a-timespan'));
  });
});

describe('timeSpanToMilliseconds', () => {
  it('parses HH:MM:SS', () => {
    assert.strictEqual(timeSpanToMilliseconds('01:23:45'), 5025000);
  });

  it('parses with fractional seconds', () => {
    const ms = timeSpanToMilliseconds('01:23:45.1234567');
    assert.ok(ms >= 5025123 && ms <= 5025124);
  });

  it('parses days format', () => {
    assert.strictEqual(timeSpanToMilliseconds('7:01:23:45'), 609825000);
  });

  it('parses negative TimeSpan', () => {
    assert.strictEqual(timeSpanToMilliseconds('-01:23:45'), -5025000);
  });
});

describe('millisecondsToTimeSpanString', () => {
  it('converts ms to HH:MM:SS', () => {
    assert.strictEqual(millisecondsToTimeSpanString(5025000), '01:23:45.000');
  });

  it('converts ms with days', () => {
    assert.strictEqual(millisecondsToTimeSpanString(609825000), '7:01:23:45.000');
  });

  it('converts negative ms', () => {
    assert.strictEqual(millisecondsToTimeSpanString(-5025000), '-01:23:45.000');
  });

  it('converts zero', () => {
    assert.strictEqual(millisecondsToTimeSpanString(0), '00:00:00.000');
  });
});

describe('splitTimeSpan', () => {
  it('returns destructurable components', () => {
    const { days, hours, minutes, seconds, milliseconds, negative } =
      splitTimeSpan('7:01:23:45.123');
    assert.strictEqual(days, 7);
    assert.strictEqual(hours, 1);
    assert.strictEqual(minutes, 23);
    assert.strictEqual(seconds, 45);
    assert.strictEqual(milliseconds, 123);
    assert.strictEqual(negative, false);
  });

  it('handles negative TimeSpan', () => {
    const { negative } = splitTimeSpan('-01:23:45');
    assert.strictEqual(negative, true);
  });

  it('toString reconstructs the string', () => {
    const components = splitTimeSpan('01:23:45.500');
    assert.strictEqual(components.toString(), '01:23:45.500');
  });
});

describe('timeSpanComponentsToString', () => {
  it('converts components to string', () => {
    const components = { days: 0, hours: 1, minutes: 23, seconds: 45, milliseconds: 0, negative: false, toString: () => '' as any };
    assert.strictEqual(timeSpanComponentsToString(components), '01:23:45.000');
  });
});

describe('addTimeSpans', () => {
  it('adds two string TimeSpans', () => {
    assert.strictEqual(addTimeSpans('01:23:45', '02:00:00'), '03:23:45.000');
  });

  it('adds components to string', () => {
    const a = splitTimeSpan('01:23:45');
    assert.strictEqual(addTimeSpans(a, '02:00:00'), '03:23:45.000');
  });
});

describe('subtractTimeSpans', () => {
  it('subtracts two TimeSpans', () => {
    assert.strictEqual(subtractTimeSpans('03:23:45', '02:00:00'), '01:23:45.000');
  });
});

describe('multiplyTimeSpan', () => {
  it('multiplies by scalar', () => {
    assert.strictEqual(multiplyTimeSpan('01:00:00', 3), '03:00:00.000');
  });
});

describe('divideTimeSpan', () => {
  it('divides by scalar', () => {
    assert.strictEqual(divideTimeSpan('03:00:00', 3), '01:00:00.000');
  });

  it('throws on zero divisor', () => {
    assert.throws(() => divideTimeSpan('01:00:00', 0), RangeError);
  });
});

describe('zeroTimeSpan', () => {
  it('returns zero string', () => {
    assert.strictEqual(zeroTimeSpan(), '00:00:00.000');
  });
});

describe('isTimeSpanZero', () => {
  it('returns true for zero', () => {
    assert.ok(isTimeSpanZero('00:00:00.000'));
  });

  it('returns false for non-zero', () => {
    assert.ok(!isTimeSpanZero('01:00:00'));
  });

  it('works with components', () => {
    const components = { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, negative: false, toString: () => '' as any };
    assert.ok(isTimeSpanZero(components));
  });
});
