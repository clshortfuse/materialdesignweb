import { assert } from '@esm-bundle/chai';

import {
  defineObservableProperty,
  observeFunction,
} from '../../core/observe.js';

describe('observe utilities', () => {
  it('collects shallow and deep props from observeFunction', () => {
    const fn = function (data) {
      return this.a + data.b.c + data.b.d;
    };

    const result = observeFunction.call({ a: 1 }, fn, { b: { c: 2, d: 3 } });

    assert.sameMembers(result.props.this, ['a']);
    assert.sameMembers(result.props.args[0], ['b']);
    assert.sameMembers(result.deepPropStrings.args[0], ['b.c', 'b.d']);
    const deepArgs = result.deepProps.args[0].map((parts) => parts.join('.'));
    assert.sameMembers(deepArgs, ['b.c', 'b.d']);
  });

  it('triggers change callbacks for defined properties', () => {
    const changes = [];
    const obj = {};

    defineObservableProperty(obj, 'name', {
      type: 'string',
      changedCallback(oldValue, newValue, patch) {
        changes.push({ oldValue, newValue, patch });
      },
    });

    obj.name = 'alpha';
    obj.name = 'beta';

    assert.equal(obj.name, 'beta');
    assert.equal(changes.length, 2);
    assert.equal(changes[0].oldValue, null);
    assert.equal(changes[0].newValue, 'alpha');
    assert.equal(changes[1].oldValue, 'alpha');
    assert.equal(changes[1].newValue, 'beta');
  });

  it('emits patch changes for proxy deep mutations', () => {
    const patches = [];
    const obj = {};

    defineObservableProperty(obj, 'state', {
      type: 'proxy',
      changedCallback(oldValue, newValue, patch) {
        patches.push(patch);
      },
    });

    obj.state = { user: { name: 'Ada' } };
    assert.equal(patches.length, 1);

    obj.state.user.name = 'Bea';
    assert.deepEqual(patches[1], { user: { name: 'Bea' } });
  });
});
