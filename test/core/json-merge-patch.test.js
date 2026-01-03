import { assert } from '@esm-bundle/chai';

import {
  applyMergePatch,
  buildMergePatch,
} from '../../core/jsonMergePatch.js';

describe('jsonMergePatch strategies', () => {
  it('reference strategy replaces arrays', () => {
    const target = { data: [1, 2, 3] };
    const patch = { data: [9] };
    const result = applyMergePatch(target, patch, 'reference');
    assert.deepEqual(result.data, [9]);
  });

  it('object strategy merges arrays by index', () => {
    const target = { data: [1, 2, 3] };
    const patch = { data: { 1: 9 } };
    const result = applyMergePatch(target, patch, 'object');
    assert.deepEqual(result.data, [1, 9, 3]);
  });

  it('buildMergePatch reference returns arrays as-is', () => {
    const previous = [1, 2];
    const current = [3, 4];
    assert.deepEqual(buildMergePatch(previous, current, 'reference'), [3, 4]);
  });

  it('buildMergePatch object returns index patch for arrays', () => {
    const previous = [{ a: 1 }, { a: 2 }];
    const current = [{ a: 1 }, { a: 3 }];
    assert.deepEqual(buildMergePatch(previous, current, 'object'), { 0: {}, 1: { a: 3 } });
  });

  it('applyMergePatch mutates target in place', () => {
    const target = { nested: { value: 1 } };
    const patch = { nested: { value: 2 } };
    const result = applyMergePatch(target, patch, 'object');
    assert.equal(result, target);
    assert.equal(target.nested.value, 2);
  });

  it('applyMergePatch preserves shared references when unchanged', () => {
    const shared = { value: 1 };
    const target = { shared };
    const patch = { other: { value: 2 } };
    applyMergePatch(target, patch, 'object');
    assert.equal(target.shared, shared);
  });

  it('buildMergePatch clone clones arrays', () => {
    const previous = [1, 2];
    const current = [3, 4];
    const patch = buildMergePatch(previous, current, 'clone');
    assert.deepEqual(patch, [3, 4]);
    assert.notEqual(patch, current);
  });
});
