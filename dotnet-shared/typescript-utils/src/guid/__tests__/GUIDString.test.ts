import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isGuidString,
  normalizeGuid,
  emptyGuid,
  isGuidEmpty,
  areGuidsEqual,
} from '../utils';

describe('isGuidString', () => {
  it('accepts valid lowercase GUID', () => {
    assert.ok(isGuidString('550e8400-e29b-41d4-a716-446655440000'));
  });

  it('accepts valid uppercase GUID', () => {
    assert.ok(isGuidString('550E8400-E29B-41D4-A716-446655440000'));
  });

  it('rejects invalid strings', () => {
    assert.ok(!isGuidString('not-a-guid'));
    assert.ok(!isGuidString('550e8400e29b41d4a716446655440000'));
    assert.ok(!isGuidString('a-b-c-d-e'));
  });
});

describe('normalizeGuid', () => {
  it('normalizes to lowercase', () => {
    const result = normalizeGuid('550E8400-E29B-41D4-A716-446655440000');
    assert.strictEqual(result, '550e8400-e29b-41d4-a716-446655440000');
  });

  it('throws on invalid string', () => {
    assert.throws(() => normalizeGuid('invalid'), RangeError);
  });
});

describe('emptyGuid', () => {
  it('returns all zeros', () => {
    assert.strictEqual(emptyGuid(), '00000000-0000-0000-0000-000000000000');
  });
});

describe('isGuidEmpty', () => {
  it('returns true for empty GUID', () => {
    assert.ok(isGuidEmpty('00000000-0000-0000-0000-000000000000'));
  });

  it('returns false for non-empty GUID', () => {
    assert.ok(!isGuidEmpty('550e8400-e29b-41d4-a716-446655440000'));
  });
});

describe('areGuidsEqual', () => {
  it('returns true for equal GUIDs', () => {
    assert.strictEqual(
      areGuidsEqual('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
      true
    );
  });

  it('is case-insensitive', () => {
    assert.strictEqual(
      areGuidsEqual('550E8400-E29B-41D4-A716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
      true
    );
  });

  it('returns false for different GUIDs', () => {
    assert.strictEqual(
      areGuidsEqual('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440000'),
      false
    );
  });

  it('throws on invalid string', () => {
    assert.throws(() => areGuidsEqual('invalid', '550e8400-e29b-41d4-a716-446655440000'), RangeError);
    assert.throws(() => areGuidsEqual('550e8400-e29b-41d4-a716-446655440000', 'invalid'), RangeError);
  });
});
