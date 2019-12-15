import chai from 'chai';

import { mergeData } from './mergeData';

var assert = chai.assert;

describe('mergeData', () => {
  it('should leave values that dont match any keys with the same reference', () => {
    const original = { a: { name: 'jason' } };
    const fresh = { b: { name: 'stan' } };

    assert.strictEqual(mergeData(original, fresh).a, original.a);
  });

  it('should update the value of an old model with the correct value and a new reference', () => {
    const original = { a: { name: 'jason' } };
    const fresh = { a: { name: 'stan' } };

    const result = mergeData(original, fresh);
    assert.deepEqual(result.a, fresh.a);
    assert.notStrictEqual(original, result);
    assert.notStrictEqual(original.a, result.a);
  });

  it('should not change deep property references if not updated', () => {
    const original = { a: { aa: { name: 'jason' }, bb: { name: 'sara' } } };
    const fresh = { a: { aa: { name: 'sophie' } } };

    const result = mergeData(original, fresh);
    assert.strictEqual(result.a.bb, original.a.bb);
  });

  it('should change reference of base and deep reference if new object has difference', () => {
    const original = { a: { aa: { name: 'jason' }, bb: { name: 'sara' } } };
    const fresh = { a: { aa: { name: 'sophie' } } };

    const result = mergeData(original, fresh);
    assert.notStrictEqual(result.a.aa, original.a.aa);
  });
});
