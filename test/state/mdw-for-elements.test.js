import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('mdw-for with element nodes', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders element nodes inside mdw-for rows', async () => {
    const ElementList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="item">{item}</div>
        </div>
      `
      .register('element-list-test');

    container.innerHTML = '<element-list-test></element-list-test>';

    await customElements.whenDefined('element-list-test');

    /** @type {InstanceType<ElementList>} */
    const list = container.querySelector('element-list-test');

    const first = document.createElement('span');
    first.textContent = 'First';
    const second = document.createElement('span');
    second.textContent = 'Second';

    list.items = [first, second];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const items = list.shadowRoot.querySelectorAll('.item');

    assert.equal(items.length, 2);
    assert.equal(items[0].firstElementChild, first);
    assert.equal(items[1].firstElementChild, second);
  });

  it('renders a current page element from an expression', async () => {
    const PageList = CustomElement
      .extend()
      .observe({
        pages: { type: 'array', value: [] },
        currentIndex: { type: 'integer', value: 0 },
      })
      .expressions({
        currentPage({ pages, currentIndex }) {
          return pages[currentIndex] ?? null;
        },
      })
      .html`
        <div>
          <div id=pages>
            <div mdw-for="{page of pages}" class="page">{page.title}</div>
          </div>
          <div id=current>{currentPage}</div>
        </div>
      `
      .register('page-list-test');

    container.innerHTML = '<page-list-test></page-list-test>';

    await customElements.whenDefined('page-list-test');

    /** @type {InstanceType<PageList>} */
    const list = container.querySelector('page-list-test');

    const pageOne = document.createElement('section');
    pageOne.title = 'One';
    pageOne.textContent = 'Content One';
    const pageTwo = document.createElement('section');
    pageTwo.title = 'Two';
    pageTwo.textContent = 'Content Two';
    const pageThree = document.createElement('section');
    pageThree.title = 'Three';
    pageThree.textContent = 'Content Three';

    list.pages = [pageOne, pageTwo, pageThree];
    list.currentIndex = 1;

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const pageItems = list.shadowRoot.querySelectorAll('.page');
    const current = list.shadowRoot.querySelector('#current');

    assert.equal(pageItems.length, 3);
    assert.equal(pageItems[0].textContent, 'One');
    assert.equal(pageItems[1].textContent, 'Two');
    assert.equal(pageItems[2].textContent, 'Three');
    assert.equal(current.firstElementChild, pageTwo);
    assert.equal(current.firstElementChild.textContent, 'Content Two');

    list.currentIndex = 2;

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    assert.equal(current.firstElementChild, pageThree);
    assert.equal(current.firstElementChild.textContent, 'Content Three');
  });

  it('does not render non-node objects in dynamic nodes', async () => {
    const ObjectNode = CustomElement
      .extend()
      .observe({
        value: { type: 'string', value: '' },
      })
      .expressions({
        currentNode({ value }) {
          return value === 'object' ? { nope: true } : '';
        },
      })
      .html`
        <div>
          <div id=current>{currentNode}</div>
        </div>
      `
      .register('object-node-test');

    container.innerHTML = '<object-node-test></object-node-test>';

    await customElements.whenDefined('object-node-test');

    /** @type {InstanceType<ObjectNode>} */
    const instance = container.querySelector('object-node-test');

    instance.value = 'object';

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const current = instance.shadowRoot.querySelector('#current');

    assert.equal(current.firstElementChild, null);
    assert.equal(current.textContent, '');
  });

  it('does not render DocumentFragment nodes in dynamic nodes', async () => {
    const FragmentNode = CustomElement
      .extend()
      .observe({
        value: { type: 'string', value: '' },
      })
      .expressions({
        currentNode({ value }) {
          if (value !== 'fragment') return '';
          const fragment = document.createDocumentFragment();
          const child = document.createElement('span');
          child.textContent = 'Fragment';
          fragment.appendChild(child);
          return fragment;
        },
      })
      .html`
        <div>
          <div id=current>{currentNode}</div>
        </div>
      `
      .register('fragment-node-test');

    container.innerHTML = '<fragment-node-test></fragment-node-test>';

    await customElements.whenDefined('fragment-node-test');

    /** @type {InstanceType<FragmentNode>} */
    const instance = container.querySelector('fragment-node-test');

    instance.value = 'fragment';

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const current = instance.shadowRoot.querySelector('#current');

    assert.equal(current.firstElementChild, null);
    assert.equal(current.textContent, '');
  });

  it('replaces the dynamic node when a new Node reference is provided', async () => {
    const SwapNode = CustomElement
      .extend()
      .observe({
        node: {
          type: 'object',
          value: null,
          diff(oldValue, newValue) {
            return oldValue === newValue ? null : newValue;
          },
        },
      })
      .html`
        <div>
          <div id=current>{node}</div>
        </div>
      `
      .register('swap-node-test');

    container.innerHTML = '<swap-node-test></swap-node-test>';

    await customElements.whenDefined('swap-node-test');

    /** @type {InstanceType<SwapNode>} */
    const instance = container.querySelector('swap-node-test');

    const first = document.createElement('div');
    first.textContent = 'First';
    const second = document.createElement('div');
    second.textContent = 'Second';

    instance.node = first;

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const current = instance.shadowRoot.querySelector('#current');

    assert.equal(current.firstElementChild, first);

    instance.node = second;

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    assert.equal(current.firstElementChild, second);
    assert.equal(instance.shadowRoot.contains(first), false);
  });

  it('keeps the same dynamic node reference when updated with itself', async () => {
    const StableNode = CustomElement
      .extend()
      .observe({
        node: {
          type: 'object',
          value: null,
          diff(oldValue, newValue) {
            return oldValue === newValue ? null : newValue;
          },
        },
      })
      .html`
        <div>
          <div id=current>{node}</div>
        </div>
      `
      .register('stable-node-test');

    container.innerHTML = '<stable-node-test></stable-node-test>';

    await customElements.whenDefined('stable-node-test');

    /** @type {InstanceType<StableNode>} */
    const instance = container.querySelector('stable-node-test');

    const node = document.createElement('div');
    node.textContent = 'Stable';

    instance.node = node;

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const current = instance.shadowRoot.querySelector('#current');

    assert.equal(current.firstElementChild, node);

    instance.node = node;

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    assert.equal(current.firstElementChild, node);
  });
});
