import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

/** @param {any} target */
function countRootRenders(target) {
  const originalRender = target.render;
  let count = 0;
  let changes;
  function render(...args) {
    count += 1;
    [changes] = args;
    return originalRender(...args);
  }
  Object.assign(render, originalRender);
  target.render = render;
  return {
    get count() { return count; },
    get changes() { return changes; },
  };
}

describe('CustomElement mutate transactions', () => {
  /** @type {HTMLElement} */
  let element;

  afterEach(() => {
    element?.remove();
  });

  function createElement() {
    const tag = `mutate-transaction-${Math.random().toString(36).slice(2)}`;
    const MutateElement = CustomElement
      .extend()
      .observe({
        data: { type: 'object', reflect: false, value: [] },
        callback: { type: 'object', reflect: false },
        selected: { type: 'integer', reflect: false },
      })
      .html`
        <span class=selected>{selected}</span>
        <ul><li mdw-for="{item of data}">{item.label}</li></ul>
      `
      .register(tag);

    element = new MutateElement();
    element.data = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
      { id: 3, label: 'C' },
    ];
    document.body.append(element);
    return element;
  }

  it('records deep writes and renders once before returning', () => {
    const target = createElement();
    const renders = countRootRenders(target);
    let textDuringMutation;

    target.mutate((draft) => {
      draft.data[0].label = 'A!';
      draft.data[2].label = 'C!';
      textDuringMutation = target.shadowRoot.querySelector('ul').textContent;
    });

    assert.equal(textDuringMutation, 'ABC', 'DOM is not rendered midway through a mutation');
    assert.equal(target.shadowRoot.querySelector('ul').textContent, 'A!BC!');
    assert.equal(renders.count, 1, 'one root render is dispatched');
    assert.deepEqual(renders.changes, {
      data: {
        0: { label: 'A!' },
        2: { label: 'C!' },
      },
    });
  });

  it('does not render a mutation with no writes', () => {
    const target = createElement();
    const renders = countRootRenders(target);

    target.mutate((draft) => {
      assert.equal(draft.data[0].label, 'A');
    });

    assert.equal(renders.count, 0);
  });

  it('preserves function-valued state without invoking it', () => {
    const target = createElement();
    let invocations = 0;
    const callback = () => { invocations += 1; };

    target.mutate((draft) => {
      draft.callback = callback;
    });

    assert.strictEqual(target.callback, callback);
    assert.equal(invocations, 0);
  });

  it('coalesces native array mutations into one synchronous render', () => {
    const target = createElement();
    const renders = countRootRenders(target);

    target.mutate((draft) => {
      draft.data.splice(1, 1);
      draft.data.push({ id: 4, label: 'D' });
    });

    assert.deepEqual(target.data.map((item) => item.label), ['A', 'C', 'D']);
    assert.equal(target.shadowRoot.querySelector('ul').textContent, 'ACD');
    assert.equal(renders.count, 1);
  });

  it('joins nested mutations into the outer synchronous render', () => {
    const target = createElement();
    const renders = countRootRenders(target);

    target.mutate((draft) => {
      draft.selected = 2;
      target.mutate((nestedDraft) => {
        nestedDraft.data[1].label = 'B!';
      });
    });

    assert.equal(target.shadowRoot.querySelector('.selected').textContent, '2');
    assert.equal(target.shadowRoot.querySelector('ul').textContent, 'AB!C');
    assert.equal(renders.count, 1);
  });

  it('revokes escaped drafts', () => {
    const target = createElement();
    let escapedDraft;

    target.mutate((draft) => {
      escapedDraft = draft;
    });

    assert.throws(() => escapedDraft.data, TypeError);
  });

  it('does not inspect mutator return values', () => {
    const target = createElement();
    let thenReads = 0;
    // eslint-disable-next-line unicorn/no-thenable -- verifies no thenable inspection
    const returned = Object.defineProperty({}, 'then', {
      get() {
        thenReads += 1;
        throw new Error('return value inspected');
      },
    });

    target.mutate((draft) => {
      draft.selected = 4;
      return returned;
    });

    assert.equal(thenReads, 0);
    assert.equal(target.shadowRoot.querySelector('.selected').textContent, '4');
  });

  it('flushes applied writes and restores rendering when a mutator throws', () => {
    const target = createElement();

    assert.throws(() => target.mutate((draft) => {
      draft.data[0].label = 'updated';
      throw new Error('intentional mutation failure');
    }), 'intentional mutation failure');

    assert.equal(target.shadowRoot.querySelector('ul').textContent, 'updatedBC');

    target.selected = 3;
    assert.equal(target.shadowRoot.querySelector('.selected').textContent, '3');
  });
});
