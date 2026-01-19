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

  it('keeps parent, children, and grandchild adapters isolated', async () => {
    const AdapterIsolationTest = CustomElement
      .extend()
      .observe({
        parents: { type: 'array', value: [] },
      })
      .expressions({
        labelGrandchild(_data, injections) {
          const { parent, child, grandchild, index } = injections ?? {};
          if (!parent || !child) return '';
          return `${parent.id}:${child.id}:${grandchild}:${index}`;
        },
      })
      .html`
        <div>
          <div mdw-for="{parent of parents}" class="Parent">
            <div class="ChildA">
              <div mdw-for="{child of parent.a}" class="ChildAItem">
                <div mdw-for="{grandchild of child.items}" class="Grandchild">
                  {labelGrandchild}
                </div>
              </div>
            </div>
            <div class="ChildB">
              <div mdw-for="{child of parent.b}" class="ChildBItem">
                {parent.id}:{child.id}
              </div>
            </div>
          </div>
        </div>
      `
      .register('adapter-isolation-test');

    container.innerHTML = '<adapter-isolation-test></adapter-isolation-test>';
    await customElements.whenDefined('adapter-isolation-test');

    /** @type {InstanceType<AdapterIsolationTest>} */
    const el = container.querySelector('adapter-isolation-test');
    el.parents = [
      {
        id: 'P1',
        a: [
          { id: 'A1', items: ['a', 'b'] },
          { id: 'A2', items: ['c'] },
        ],
        b: [
          { id: 'B1' },
        ],
      },
      {
        id: 'P2',
        a: [
          { id: 'A1', items: ['d'] },
        ],
        b: [
          { id: 'B2' },
          { id: 'B3' },
        ],
      },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const shadow = el.shadowRoot;
    const parents = shadow.querySelectorAll('.Parent');
    const childAItems = shadow.querySelectorAll('.ChildAItem');
    const childBItems = shadow.querySelectorAll('.ChildBItem');
    const grandChildren = shadow.querySelectorAll('.Grandchild');

    assert.equal(parents.length, 2);
    assert.equal(childAItems.length, 3);
    assert.equal(childBItems.length, 3);
    assert.equal(grandChildren.length, 4);

    const grandchildTexts = [...grandChildren].map((node) => node.textContent.trim());
    assert.includeMembers(grandchildTexts, [
      'P1:A1:a:0',
      'P1:A1:b:1',
      'P1:A2:c:0',
      'P2:A1:d:0',
    ]);

    const childBTexts = [...childBItems].map((node) => node.textContent.trim());
    assert.includeMembers(childBTexts, [
      'P1:B1',
      'P2:B2',
      'P2:B3',
    ]);
  });

  it('isolates sibling parent loops with their own children and grandchildren', async () => {
    const SiblingParentTest = CustomElement
      .extend()
      .observe({
        leftParents: { type: 'array', value: [] },
        rightParents: { type: 'array', value: [] },
      })
      .expressions({
        labelLeft(_data, injections) {
          const { parent, child, grandchild } = injections ?? {};
          if (!parent || !child) return '';
          return `L:${parent.id}:${child.id}:${grandchild}`;
        },
        labelRight(_data, injections) {
          const { parent, child, grandchild } = injections ?? {};
          if (!parent || !child) return '';
          return `R:${parent.id}:${child.id}:${grandchild}`;
        },
      })
      .html`
        <div>
          <section class="Left">
            <div mdw-for="{parent of leftParents}" class="LeftParent">
              <div mdw-for="{child of parent.children}" class="LeftChild">
                <div mdw-for="{grandchild of child.items}" class="LeftGrandchild">
                  {labelLeft}
                </div>
              </div>
            </div>
          </section>
          <section class="Right">
            <div mdw-for="{parent of rightParents}" class="RightParent">
              <div mdw-for="{child of parent.children}" class="RightChild">
                <div mdw-for="{grandchild of child.items}" class="RightGrandchild">
                  {labelRight}
                </div>
              </div>
            </div>
          </section>
        </div>
      `
      .register('sibling-parent-test');

    container.innerHTML = '<sibling-parent-test></sibling-parent-test>';
    await customElements.whenDefined('sibling-parent-test');

    /** @type {InstanceType<SiblingParentTest>} */
    const el = container.querySelector('sibling-parent-test');
    el.leftParents = [
      {
        id: 'LP1',
        children: [
          { id: 'LC1', items: ['a', 'b'] },
          { id: 'LC2', items: ['c'] },
        ],
      },
      {
        id: 'LP2',
        children: [
          { id: 'LC3', items: ['d'] },
        ],
      },
    ];
    el.rightParents = [
      {
        id: 'RP1',
        children: [
          { id: 'RC1', items: ['x'] },
          { id: 'RC2', items: ['y', 'z'] },
        ],
      },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const shadow = el.shadowRoot;
    const leftParents = shadow.querySelectorAll('.LeftParent');
    const rightParents = shadow.querySelectorAll('.RightParent');
    const leftGrandchildren = shadow.querySelectorAll('.LeftGrandchild');
    const rightGrandchildren = shadow.querySelectorAll('.RightGrandchild');

    assert.equal(leftParents.length, 2);
    assert.equal(rightParents.length, 1);
    assert.equal(leftGrandchildren.length, 4);
    assert.equal(rightGrandchildren.length, 3);

    const leftTexts = [...leftGrandchildren].map((node) => node.textContent.trim());
    const rightTexts = [...rightGrandchildren].map((node) => node.textContent.trim());

    assert.includeMembers(leftTexts, [
      'L:LP1:LC1:a',
      'L:LP1:LC1:b',
      'L:LP1:LC2:c',
      'L:LP2:LC3:d',
    ]);
    assert.includeMembers(rightTexts, [
      'R:RP1:RC1:x',
      'R:RP1:RC2:y',
      'R:RP1:RC2:z',
    ]);
  });
});
