import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('Nested mdw-for deep/multi test', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders multiple nested mdw-for without collisions', async () => {
    const DeepList = CustomElement
      .extend()
      .observe({
        listA: { type: 'array', value: [] },
        listB: { type: 'array', value: [] },
        listC: { type: 'array', value: [] },
        listD: { type: 'array', value: [] },
        listE: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{a of listA}" class="A">
            <div class="a-title">{a.name}</div>
            <div mdw-for="{a1 of a.items}" class="A1">{a1}</div>
          </div>

          <div mdw-for="{b of listB}" class="B">
            <div class="b-title">{b.name}</div>
            <div mdw-for="{b1 of b.items}" class="B1">
              <div class="b1-title">{b1.name}</div>
              <div mdw-for="{b1a of b1.children}" class="B1A">{b1a}</div>
            </div>
          </div>

          <div mdw-for="{c of listC}" class="C">
            <div class="c-title">{c.name}</div>
            <div mdw-for="{c1 of c.items}" class="C1">{c1}</div>
          </div>

          <div mdw-for="{d of listD}" class="D">{d}</div>

          <div mdw-for="{e of listE}" class="E">
            <div class="e-title">{e.name}</div>
            <div mdw-for="{e1 of e.items}" class="E1">
              <div class="e1-title">{e1.name}</div>
              <div mdw-for="{e1a of e1.children}" class="E1A">{e1a}</div>
            </div>
          </div>
        </div>
      `
      .register('deep-list-test');

    container.innerHTML = '<deep-list-test></deep-list-test>';

    await customElements.whenDefined('deep-list-test');

    /** @type {InstanceType<DeepList>} */
    const el = container.querySelector('deep-list-test');

    el.listA = [{ name: 'A', items: ['A1'] }];
    el.listB = [{ name: 'B', items: [{ name: 'B1', children: ['B1a'] }] }];
    el.listC = [{ name: 'C', items: ['C1'] }];
    el.listD = ['D'];
    el.listE = [{ name: 'E', items: [{ name: 'E1', children: ['E1a', 'E1b'] }] }];

    // allow microtask rendering
    await new Promise((r) => setTimeout(r, 50));

    const shadow = el.shadowRoot;

    // A
    const aElems = shadow.querySelectorAll('.A');
    assert.equal(aElems.length, 1);
    assert.equal(aElems[0].querySelector('.a-title').textContent, 'A');
    assert.equal(aElems[0].querySelectorAll('.A1').length, 1);
    assert.equal(aElems[0].querySelector('.A1').textContent, 'A1');

    // B
    const bElems = shadow.querySelectorAll('.B');
    assert.equal(bElems.length, 1);
    assert.equal(bElems[0].querySelector('.b-title').textContent, 'B');
    const b1Elems = bElems[0].querySelectorAll('.B1');
    assert.equal(b1Elems.length, 1);
    assert.equal(b1Elems[0].querySelector('.b1-title').textContent, 'B1');
    assert.equal(b1Elems[0].querySelectorAll('.B1A').length, 1);
    assert.equal(b1Elems[0].querySelector('.B1A').textContent, 'B1a');

    // C
    const cElems = shadow.querySelectorAll('.C');
    assert.equal(cElems.length, 1);
    assert.equal(cElems[0].querySelector('.c-title').textContent, 'C');
    assert.equal(cElems[0].querySelectorAll('.C1').length, 1);
    assert.equal(cElems[0].querySelector('.C1').textContent, 'C1');

    // D
    const dElems = shadow.querySelectorAll('.D');
    assert.equal(dElems.length, 1);
    assert.equal(dElems[0].textContent.trim(), 'D');

    // E
    const eElems = shadow.querySelectorAll('.E');
    assert.equal(eElems.length, 1);
    assert.equal(eElems[0].querySelector('.e-title').textContent, 'E');
    const e1Elems = eElems[0].querySelectorAll('.E1');
    assert.equal(e1Elems.length, 1);
    assert.equal(e1Elems[0].querySelector('.e1-title').textContent, 'E1');
    const e1aElems = e1Elems[0].querySelectorAll('.E1A');
    assert.equal(e1aElems.length, 2);
    assert.equal(e1aElems[0].textContent, 'E1a');
    assert.equal(e1aElems[1].textContent, 'E1b');

    // Ensure no cross-contamination: B1a is only under B, E1a/B1a not duplicated elsewhere
    assert.equal(shadow.querySelectorAll('.B1A').length, 1);
    assert.equal(shadow.querySelectorAll('.E1A').length, 2);

    // Now perform a mutation: update E1 children (full-array replace)
    // Apply JSON Merge Patch style change to update second child of E1
    el.patch({ listE: { 0: { items: { 0: { children: { 1: 'E1b-updated' } } } } } });

    // allow microtask rendering
    await new Promise((r) => setTimeout(r, 50));

    // Verify E updated (second child updated)
    const e1aAfter = shadow.querySelectorAll('.E1A');
    assert.equal(e1aAfter.length, 2);
    assert.equal(e1aAfter[1].textContent, 'E1b-updated');
  });
});
