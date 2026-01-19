import { assert } from '@esm-bundle/chai';
import CustomElement from '../../core/CustomElement.js';

describe('mdw-for with element nodes', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    // Enable mdw-for debug logs for this suite.
    globalThis.__MDW_FOR_DEBUG__ = true;
  });

  afterEach(() => {
    container.remove();
    delete globalThis.__MDW_FOR_DEBUG__;
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

  it('does not crash when parent array size changes', async () => {
    const PageBases = CustomElement.extend()
      .observe({
        dataArray: { type: 'array', value: [] },
        useFilter: { type: 'boolean', value: false },
        filteredData({ dataArray, useFilter }) {
          if (!useFilter) {
            return dataArray;
          }
          return dataArray.filter((item) => !item.siblingProperty);
        },
      })
      .on({
        connected() {
          this.dataArray = [
            {
              siblingProperty: true,
              subArray: [],
            },
            { subArray: [] },
            { subArray: [] },
          ];
        },
      })
      .html`
        <div mdw-for="{item of filteredData}">
          <div mdw-for="{subItem of item.subArray}"></div>
        </div>
      `
      .autoRegister('page-bases-test');

    container.innerHTML = '<page-bases-test></page-bases-test>';

    await customElements.whenDefined('page-bases-test');

    /** @type {InstanceType<PageBases>} */
    const instance = container.querySelector('page-bases-test');

    instance.useFilter = true;


    assert(!instance.error, 'No error occurred during filter toggle');

  });

  it('rebuilds nested mdw-for when filteredData shrinks and expands', async () => {
    const NestedList = CustomElement
      .extend()
      .observe({
        dataArray: { type: 'array', value: [] },
        useFilter: { type: 'boolean', value: false },
        filteredData({ dataArray, useFilter }) {
          if (!useFilter) return dataArray;
          return dataArray.filter((item) => !item.siblingProperty);
        },
      })
      .methods({
        async loadData() {
          this.dataArray = [
            { siblingProperty: true, subArray: [{}] },
            { subArray: [] },
          ];
        },
      })
      .on({
        connected() {
          this.loadData();
        },
      })
      .html`
        <div>
          <div mdw-for="{item of filteredData}" class="item">
            <div mdw-for="{subItem of item.subArray}" class="subitem"></div>
          </div>
        </div>
      `
      .register('nested-list-test');

    container.innerHTML = '<nested-list-test></nested-list-test>';
    await customElements.whenDefined('nested-list-test');

    /** @type {InstanceType<NestedList>} */
    const instance = container.querySelector('nested-list-test');

    await new Promise((resolve) => { setTimeout(resolve, 50); });

    const countSubitems = () => instance.shadowRoot.querySelectorAll('.subitem').length;
    const countItems = () => instance.shadowRoot.querySelectorAll('.item').length;

    assert.equal(countItems(), 2, 'initial item count');
    assert.equal(countSubitems(), 1, 'initial subitem count');

    instance.useFilter = true;
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    assert.equal(countItems(), 1, 'filtered item count');
    assert.equal(countSubitems(), 0, 'filtered subitem count');

    instance.useFilter = false;
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    assert.equal(countItems(), 2, 'restored item count');
    assert.equal(countSubitems(), 1, 'restored subitem count');
  });

  it('does not duplicate nested nodes after clearing and restoring dataArray', async () => {
    const ResetList = CustomElement
      .extend()
      .observe({
        dataArray: { type: 'array', value: [] },
      })
      .methods({
        async loadData() {
          this.dataArray = [
            { subArray: [{}] },
            { subArray: [] },
          ];
        },
      })
      .on({
        connected() {
          this.loadData();
        },
      })
      .html`
        <div>
          <div mdw-for="{item of dataArray}" class="item">
            <div mdw-for="{subItem of item.subArray}" class="subitem"></div>
          </div>
        </div>
      `
      .register('reset-list-test');

    container.innerHTML = '<reset-list-test></reset-list-test>';
    await customElements.whenDefined('reset-list-test');

    /** @type {InstanceType<ResetList>} */
    const instance = container.querySelector('reset-list-test');

    await new Promise((resolve) => { setTimeout(resolve, 50); });
    assert.equal(instance.shadowRoot.querySelectorAll('.subitem').length, 1, 'initial subitem count');

    instance.dataArray = [];
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    assert.equal(instance.shadowRoot.querySelectorAll('.subitem').length, 0, 'cleared subitem count');

    instance.dataArray = [
      { subArray: [{}] },
      { subArray: [] },
    ];
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    assert.equal(instance.shadowRoot.querySelectorAll('.subitem').length, 1, 'restored subitem count');
  });

  it('remains stable under repeated filter toggles with mixed subArray lengths', async () => {
    const FlakyList = CustomElement
      .extend()
      .observe({
        dataArray: { type: 'array', value: [] },
        useFilter: { type: 'boolean', value: false },
        filteredData({ dataArray, useFilter }) {
          if (!useFilter) return dataArray;
          return dataArray.filter((item) => !item.siblingProperty);
        },
      })
      .methods({
        async loadData() {
          this.dataArray = [
            { siblingProperty: true, subArray: [{}] },
            { subArray: [] },
            { subArray: [] },
          ];
        },
      })
      .on({
        connected() {
          this.loadData();
        },
      })
      .html`
        <div>
          <div mdw-for="{item of filteredData}" class="item">
            <div mdw-for="{subItem of item.subArray}" class="subitem"></div>
          </div>
        </div>
      `
      .register('flaky-list-test');

    container.innerHTML = '<flaky-list-test></flaky-list-test>';
    await customElements.whenDefined('flaky-list-test');

    /** @type {InstanceType<FlakyList>} */
    const instance = container.querySelector('flaky-list-test');

    const countSubitems = () => instance.shadowRoot.querySelectorAll('.subitem').length;
    const countItems = () => instance.shadowRoot.querySelectorAll('.item').length;

    await new Promise((resolve) => { setTimeout(resolve, 50); });
    assert.equal(countItems(), 3, 'initial item count');
    assert.equal(countSubitems(), 1, 'initial subitem count');

    for (let i = 0; i < 5; i += 1) {
      instance.useFilter = !instance.useFilter;
      const expectedItems = instance.useFilter ? 2 : 3;
      const expectedSubitems = instance.useFilter ? 0 : 1;
      assert.equal(countItems(), expectedItems, `item count after toggle ${i + 1}`);
      assert.equal(countSubitems(), expectedSubitems, `subitem count after toggle ${i + 1}`);
    }
  });

  it('clears nested adapters when a cached row is reinserted', async () => {
    const CachedRow = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="item">
            <div mdw-for="{subItem of item.subArray}" class="subitem"></div>
          </div>
        </div>
      `
      .register('cached-row-test');

    container.innerHTML = '<cached-row-test></cached-row-test>';
    await customElements.whenDefined('cached-row-test');

    /** @type {InstanceType<CachedRow>} */
    const instance = container.querySelector('cached-row-test');

    const itemA = { id: 'a', subArray: [{}] };
    const itemB = { id: 'b', subArray: [] };
    const itemC = { id: 'c', subArray: [] };
    const itemX = { id: 'x', subArray: [] };

    instance.items = [itemA, itemB, itemC];

    await new Promise((resolve) => { setTimeout(resolve, 50); });
    assert.equal(instance.shadowRoot.querySelectorAll('.subitem').length, 1, 'initial subitem count');

    itemA.subArray = [];
    instance.patch({ items: [itemX, itemB, itemA] });

    await new Promise((resolve) => { setTimeout(resolve, 50); });
    assert.equal(instance.shadowRoot.querySelectorAll('.subitem').length, 0, 'subitems cleared after cached reinsert');
  });

});
