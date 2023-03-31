import { assert } from '@esm-bundle/chai';

describe('sync test', () => {
  assert.equal('foo', 'foo');
});

describe('async test', async () => {
  const foo = Promise.resolve('foo');
  assert.equal(await foo, 'foo');
});
