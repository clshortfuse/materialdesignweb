import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('mdw-for iteration index isolation', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('keeps nested mdw-for anchors isolated from sibling loops', async () => {
    const IterationIndexTest = CustomElement
      .extend()
      .observe({
        outer: { type: 'array', value: [] },
      })
      .expressions({
        formatA({ outer }, { o, a, index }) {
          if (!outer || !o) return '';
          return `${o.name}:${a}:${index}`;
        },
      })
      .html`
        <div>
          <div mdw-for="{o of outer}" class="Outer">
            <div class="A">
              <div mdw-for="{a of o.aItems}" class="AItem">{a}</div>
              <div mdw-for="{a of o.aItems}" class="AItemExpr">
                {formatA}
              </div>
            </div>
            <div class="B">
              <div mdw-for="{b of o.bItems}" class="BItem">{o.name}:{b}</div>
            </div>
          </div>
        </div>
      `
      .register('iteration-index-test');

    container.innerHTML = '<iteration-index-test></iteration-index-test>';
    await customElements.whenDefined('iteration-index-test');

    /** @type {InstanceType<IterationIndexTest>} */
    const el = container.querySelector('iteration-index-test');
    el.outer = [
      { name: 'O1', aItems: ['A1', 'A2'], bItems: ['B1'] },
      { name: 'O2', aItems: ['A1', 'A2'], bItems: ['B2'] },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const shadow = el.shadowRoot;
    const outerNodes = shadow.querySelectorAll('.Outer');
    const aItemExprs = shadow.querySelectorAll('.AItemExpr');
    const bItems = shadow.querySelectorAll('.BItem');

    assert.equal(outerNodes.length, 2);
    assert.equal(aItemExprs.length, 4);
    assert.equal(bItems.length, 2);
    assert.equal(aItemExprs[0].textContent, 'O1:A1:0');
    assert.equal(aItemExprs[3].textContent, 'O2:A2:1');
    assert.equal(bItems[0].textContent, 'O1:B1');
    assert.equal(bItems[1].textContent, 'O2:B2');
  });
});
