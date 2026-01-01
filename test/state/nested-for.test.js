import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

/**
 * Tests for nested mdw-for loops
 */
describe('Nested mdw-for', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should render nested arrays', async () => {
    // Nested mdw-for in same template - like mod.tags within mods iteration
    const CardList = CustomElement
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
      .register('card-list-nested-test');

    container.innerHTML = '<card-list-nested-test></card-list-nested-test>';

    await customElements.whenDefined('card-list-nested-test');

    /** @type {InstanceType<CardList>} */
    const cardList = container.querySelector('card-list-nested-test');

    // Set data with nested arrays - multiple outer items each with their own inner arrays
    cardList.items = [
      { title: 'Item 1', tags: ['A1', 'B1', 'C1'] },
      { title: 'Item 2', tags: ['A2', 'B2', 'C2'] },
      { title: 'Item 3', tags: ['A3', 'B3', 'C3'] },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const cards = cardList.shadowRoot.querySelectorAll('.card');

    assert.equal(cards.length, 3, 'Should have 3 cards');

    // Check first card - should have unique tags A1, B1, C1
    const firstCardTags = cards[0].querySelectorAll('.tag');
    assert.equal(firstCardTags.length, 3, 'First card should have 3 tags');
    assert.equal(firstCardTags[0].textContent, 'A1');
    assert.equal(firstCardTags[1].textContent, 'B1');
    assert.equal(firstCardTags[2].textContent, 'C1');

    // Check second card - should have unique tags A2, B2, C2 (not duplicates of first)
    const secondCardTags = cards[1].querySelectorAll('.tag');
    assert.equal(secondCardTags.length, 3, 'Second card should have 3 tags');
    assert.equal(secondCardTags[0].textContent, 'A2', 'Second card should have A2, not A1');
    assert.equal(secondCardTags[1].textContent, 'B2', 'Second card should have B2, not B1');
    assert.equal(secondCardTags[2].textContent, 'C2', 'Second card should have C2, not C1');

    // Check third card - should have unique tags A3, B3, C3
    const thirdCardTags = cards[2].querySelectorAll('.tag');
    assert.equal(thirdCardTags.length, 3, 'Third card should have 3 tags');
    assert.equal(thirdCardTags[0].textContent, 'A3');
    assert.equal(thirdCardTags[1].textContent, 'B3');
    assert.equal(thirdCardTags[2].textContent, 'C3');

    // Now update just the second item's tags - this should only affect the second card
    cardList.items = [
      { title: 'Item 1', tags: ['A1', 'B1', 'C1'] },
      { title: 'Item 2', tags: ['X', 'Y'] }, // Changed!
      { title: 'Item 3', tags: ['A3', 'B3', 'C3'] },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const updatedCards = cardList.shadowRoot.querySelectorAll('.card');

    // First card should still have A1, B1, C1
    const updatedFirstCardTags = updatedCards[0].querySelectorAll('.tag');
    assert.equal(updatedFirstCardTags.length, 3);
    assert.equal(updatedFirstCardTags[0].textContent, 'A1', 'First card unchanged');

    // Second card should now have X, Y
    const updatedSecondCardTags = updatedCards[1].querySelectorAll('.tag');
    assert.equal(updatedSecondCardTags.length, 2, 'Second card should now have 2 tags');
    assert.equal(updatedSecondCardTags[0].textContent, 'X', 'Second card should have X');
    assert.equal(updatedSecondCardTags[1].textContent, 'Y', 'Second card should have Y');

    // Third card should still have A3, B3, C3
    const updatedThirdCardTags = updatedCards[2].querySelectorAll('.tag');
    assert.equal(updatedThirdCardTags.length, 3);
    assert.equal(updatedThirdCardTags[0].textContent, 'A3', 'Third card unchanged');
  });

  it('does not trim nested tags on length-only patch', async () => {
    const CardList = CustomElement
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
      .register('card-list-length-only-test');

    container.innerHTML = '<card-list-length-only-test></card-list-length-only-test>';

    await customElements.whenDefined('card-list-length-only-test');

    /** @type {InstanceType<CardList>} */
    const cardList = container.querySelector('card-list-length-only-test');

    cardList.items = [
      { title: 'Item 1', tags: ['A1', 'B1', 'C1'] },
      { title: 'Item 2', tags: ['A2', 'B2', 'C2'] },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const cards = cardList.shadowRoot.querySelectorAll('.card');
    const secondCardTags = cards[1].querySelectorAll('.tag');
    assert.equal(secondCardTags.length, 3);

    cardList.render({
      items: {
        1: {
          tags: {
            length: 1,
          },
        },
      },
    });

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const updatedSecondCardTags = cards[1].querySelectorAll('.tag');
    assert.equal(updatedSecondCardTags.length, 3, 'Length-only patch does not trim tags');
  });

  it('should handle multiple separate mdw-for with text nodes between them', async () => {
    // This test exposes the commentIndex vs adapterIndex bug
    // Text interpolation creates comments, causing commentIndex to diverge from adapterIndex
    const MultiList = CustomElement
      .extend()
      .observe({
        title: { type: 'string', value: '' },
        items1: { type: 'array', value: [] },
        items2: { type: 'array', value: [] },
      })
      .html`
        <div>
          <h1>{title}</h1>
          <div class="list1">
            <span mdw-for="{item of items1}" class="item1">{item}</span>
          </div>
          <div class="list2">
            <span mdw-for="{item of items2}" class="item2">{item}</span>
          </div>
        </div>
      `
      .register('multi-list-test');

    container.innerHTML = '<multi-list-test></multi-list-test>';

    await customElements.whenDefined('multi-list-test');

    /** @type {InstanceType<MultiList>} */
    const multiList = container.querySelector('multi-list-test');

    // Set data
    multiList.title = 'Test Title';
    multiList.items1 = ['A', 'B', 'C'];
    multiList.items2 = ['X', 'Y', 'Z'];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    // Check title rendered
    const title = multiList.shadowRoot.querySelector('h1');
    assert.equal(title.textContent, 'Test Title');

    // Check first list
    const items1 = multiList.shadowRoot.querySelectorAll('.item1');
    assert.equal(items1.length, 3, 'Should have 3 items in first list');
    assert.equal(items1[0].textContent, 'A');
    assert.equal(items1[1].textContent, 'B');
    assert.equal(items1[2].textContent, 'C');

    // Check second list - THIS WILL FAIL if commentIndex/adapterIndex are mixed
    const items2 = multiList.shadowRoot.querySelectorAll('.item2');
    assert.equal(items2.length, 3, 'Should have 3 items in second list');
    assert.equal(items2[0].textContent, 'X');
    assert.equal(items2[1].textContent, 'Y');
    assert.equal(items2[2].textContent, 'Z');
  });
});
