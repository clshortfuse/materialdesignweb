import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('Nested mdw-for debug - parent clears', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('rebuilds nested loops after parent list cleared and restored', async () => {
    const DebugList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="item">
            <div mdw-for="{sub of item.subs}" class="sub"></div>
          </div>
        </div>
      `
      .register('nested-for-debug-test');

    container.innerHTML = '<nested-for-debug-test></nested-for-debug-test>';
    await customElements.whenDefined('nested-for-debug-test');

    /** @type {InstanceType<DebugList>} */
    const el = container.querySelector('nested-for-debug-test');

    el.items = [{ subs: [{}] }, { subs: [] }];
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(el.shadowRoot.querySelectorAll('.item').length, 2);
    assert.equal(el.shadowRoot.querySelectorAll('.sub').length, 1);

    el.items = [];
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(el.shadowRoot.querySelectorAll('.item').length, 0);
    assert.equal(el.shadowRoot.querySelectorAll('.sub').length, 0);

    el.items = [{ subs: [{}] }, { subs: [] }];
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(el.shadowRoot.querySelectorAll('.item').length, 2);
    assert.equal(el.shadowRoot.querySelectorAll('.sub').length, 1);
  });
});
