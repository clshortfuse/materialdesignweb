import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('Single mdw-for', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should render a simple array', async () => {
    const SimpleList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <span mdw-for="{item of items}" class="item">{item}</span>
        </div>
      `
      .register('simple-list-test');

    container.innerHTML = '<simple-list-test></simple-list-test>';

    await customElements.whenDefined('simple-list-test');

    /** @type {InstanceType<SimpleList>} */
    const list = container.querySelector('simple-list-test');

    list.items = ['A', 'B', 'C'];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const spans = list.shadowRoot.querySelectorAll('.item');

    assert.equal(spans.length, 3);
    assert.equal(spans[0].textContent, 'A');
    assert.equal(spans[1].textContent, 'B');
    assert.equal(spans[2].textContent, 'C');
  });

  it('should render objects with properties', async () => {
    const ItemList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="item">
            <span class="title">{item.title}</span>
          </div>
        </div>
      `
      .register('item-list-test');

    container.innerHTML = '<item-list-test></item-list-test>';

    await customElements.whenDefined('item-list-test');

    /** @type {InstanceType<ItemList>} */
    const list = container.querySelector('item-list-test');

    list.items = [
      { title: 'First' },
      { title: 'Second' },
      { title: 'Third' },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const divs = list.shadowRoot.querySelectorAll('.item');

    assert.equal(divs.length, 3);
    assert.equal(divs[0].querySelector('.title').textContent, 'First');
    assert.equal(divs[1].querySelector('.title').textContent, 'Second');
    assert.equal(divs[2].querySelector('.title').textContent, 'Third');
  });

  it('should handle objects with array properties (no nested mdw-for)', async () => {
    const CardList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="card">
            <h3>{item.title}</h3>
            <span class="count">{item.tags.length}</span>
          </div>
        </div>
      `
      .register('card-count-test');

    container.innerHTML = '<card-count-test></card-count-test>';

    await customElements.whenDefined('card-count-test');

    /** @type {InstanceType<CardList>} */
    const list = container.querySelector('card-count-test');

    list.items = [
      { title: 'Item 1', tags: ['A', 'B', 'C'] },
      { title: 'Item 2', tags: ['X', 'Y'] },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const cards = list.shadowRoot.querySelectorAll('.card');

    assert.equal(cards.length, 2);
    assert.equal(cards[0].querySelector('h3').textContent, 'Item 1');
    assert.equal(cards[0].querySelector('.count').textContent, '3');
    assert.equal(cards[1].querySelector('h3').textContent, 'Item 2');
    assert.equal(cards[1].querySelector('.count').textContent, '2');
  });

  it('should render nested mdw-for in same template', async () => {
    const NestedList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="card">
            <h3>{item.title}</h3>
            <span mdw-for="{tag of item.tags}" class="tag">{tag}</span>
          </div>
        </div>
      `
      .register('nested-list-test');

    container.innerHTML = '<nested-list-test></nested-list-test>';

    await customElements.whenDefined('nested-list-test');

    /** @type {InstanceType<NestedList>} */
    const list = container.querySelector('nested-list-test');

    list.items = [
      { title: 'Item 1', tags: ['A', 'B'] },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const cards = list.shadowRoot.querySelectorAll('.card');

    if (cards.length > 0) {
      const tags = cards[0].querySelectorAll('.tag');

      assert.equal(cards.length, 1);
      assert.equal(cards[0].querySelector('h3').textContent, 'Item 1');
      assert.equal(tags.length, 2, 'Should have 2 tags');
      assert.equal(tags[0].textContent, 'A');
      assert.equal(tags[1].textContent, 'B');
    } else {
      assert.fail('No cards found');
    }
  });
});
