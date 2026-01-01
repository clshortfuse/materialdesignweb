import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import CompositionAdapter from '../../core/CompositionAdapter.js';

describe('swaprows benchmark semantics', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('updates rows in place when swapping via partial render patch', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-test');

    container.innerHTML = '<swap-rows-test></swap-rows-test>';
    await customElements.whenDefined('swap-rows-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const before = [...el.shadowRoot.querySelectorAll('.row')];
    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(before.length, 4);
    assert.equal(beforeButtons[1].textContent, 'row-1');
    assert.equal(beforeButtons[3].textContent, 'row-3');

    // Mimic benchmark swaprows: swap array entries and render a partial patch.
    const tmp = el.data[1];
    el.data[1] = el.data[3];
    el.data[3] = tmp;
    el.render({
      data: {
        1: el.data[1],
        3: el.data[3],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const after = [...el.shadowRoot.querySelectorAll('.row')];
    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[1].textContent, 'row-3');
    assert.equal(afterButtons[3].textContent, 'row-1');
    assert.equal(after.length, 4);
  });

  it('keeps focus when an unrelated row updates', async function testFocusRetention() {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-focus-test');

    container.innerHTML = '<swap-rows-focus-test></swap-rows-focus-test>';
    await customElements.whenDefined('swap-rows-focus-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-focus-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);

    el.render({
      data: {
        3: { id: 'row-3b' },
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[3].textContent, 'row-3b');
    assert.equal(afterButtons[1], beforeButtons[1]);
    assert.equal(beforeButtons[1].matches(':focus'), true);
  });

  it('reorders rows with render entries are not the same as the key', async function testReorderRender() {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-reorder-test');

    container.innerHTML = '<swap-rows-reorder-test></swap-rows-reorder-test>';
    await customElements.whenDefined('swap-rows-reorder-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-reorder-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);

    const tmp = el.data[1];
    el.data[1] = el.data[3];
    el.data[3] = tmp;
    el.render({
      data: {
        1: { id: 'row-3' },
        3: { id: 'row-1' },
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[1].matches(':focus'), true);
    assert.equal(afterButtons[1].textContent, 'row-3');
    assert.equal(afterButtons[3].textContent, 'row-1');
  });

  it('reorders rows when full reassign are not the same as the key', async function testReorderReassign() {
    const SwapRowAssigns = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-reassign-test');

    container.innerHTML = '<swap-rows-reassign-test></swap-rows-reassign-test>';
    await customElements.whenDefined('swap-rows-reassign-test');

    /** @type {InstanceType<SwapRowAssigns>} */
    const el = container.querySelector('swap-rows-reassign-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);

    const tmp = el.data[1];
    el.data[1] = el.data[3];
    el.data[3] = tmp;
    el.data = el.data; // Trigger full re-render.
    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[1].matches(':focus'), true);
    assert.equal(afterButtons[1].textContent, 'row-3');
    assert.equal(afterButtons[3].textContent, 'row-1');
  });

  it('removes trailing rows when the array shrinks', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-trim-test');

    container.innerHTML = '<swap-rows-trim-test></swap-rows-trim-test>';
    await customElements.whenDefined('swap-rows-trim-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-trim-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    el.data = el.data.slice(0, 2);

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 2);
    assert.equal(afterButtons[0].textContent, 'row-0');
    assert.equal(afterButtons[1].textContent, 'row-1');
  });

  it('clears rows when the array becomes empty', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-empty-test');

    container.innerHTML = '<swap-rows-empty-test></swap-rows-empty-test>';
    await customElements.whenDefined('swap-rows-empty-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-empty-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    el.data = [];

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 0);
  });

  it('appends rows without reordering existing elements', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" type="button" class="row-btn">{row.id}</button>
        </div>
      `
      .register('swap-rows-append-test');

    container.innerHTML = '<swap-rows-append-test></swap-rows-append-test>';
    await customElements.whenDefined('swap-rows-append-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-append-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons.length, 2);
    beforeButtons[0].focus();
    assert.equal(beforeButtons[0].matches(':focus'), true);

    el.data = [...el.data, { id: 'row-2' }];

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 3);
    assert.equal(afterButtons[0], beforeButtons[0]);
    assert.equal(afterButtons[1], beforeButtons[1]);
    assert.equal(afterButtons[2].textContent, 'row-2');
    assert.equal(beforeButtons[0].matches(':focus'), true);
  });

  it('updates only specified index on partial object patch', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-partial-object-test');

    container.innerHTML = '<swap-rows-partial-object-test></swap-rows-partial-object-test>';
    await customElements.whenDefined('swap-rows-partial-object-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-partial-object-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons.length, 3);

    el.data[1] = { id: 'row-1b' };
    el.render({
      data: {
        1: el.data[1],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[1].textContent, 'row-1b');
    assert.equal(afterButtons[0], beforeButtons[0]);
    assert.equal(afterButtons[2], beforeButtons[2]);
  });

  it('keeps focus when mdw-if toggles on another row', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.id}</button>
            <span class="flag" mdw-if={row.show}>flag</span>
          </div>
        </div>
      `
      .register('swap-rows-if-sibling-test');

    container.innerHTML = '<swap-rows-if-sibling-test></swap-rows-if-sibling-test>';
    await customElements.whenDefined('swap-rows-if-sibling-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-if-sibling-test');

    el.data = [
      { id: 'row-0', show: true },
      { id: 'row-1', show: true },
      { id: 'row-2', show: true },
      { id: 'row-3', show: true },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);

    el.data[3].show = false;
    el.render({
      data: {
        3: el.data[3],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[1], beforeButtons[1]);
    assert.equal(afterButtons[1].matches(':focus'), true);
  });

  it('loses focus when mdw-if removes the focused child', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button mdw-if={row.show} type="button" class="row-btn">{row.id}</button>
          </div>
        </div>
      `
      .register('swap-rows-if-child-test');

    container.innerHTML = '<swap-rows-if-child-test></swap-rows-if-child-test>';
    await customElements.whenDefined('swap-rows-if-child-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-if-child-test');

    el.data = [
      { id: 'row-0', show: true },
      { id: 'row-1', show: true },
      { id: 'row-2', show: true },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);

    el.data[1].show = false;
    el.render({
      data: {
        1: el.data[1],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const focusedAfterRemove = el.shadowRoot.querySelector(':focus');
    assert.equal(focusedAfterRemove, null);

    el.data[1].show = true;
    el.render({
      data: {
        1: el.data[1],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 3);
    assert.equal(afterButtons[1].matches(':focus'), false);
  });

  it('keeps focus when mdw-for repeats the button element', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" type="button" class="row-btn" id={row.id}>
            {row.label}
          </button>
        </div>
      `
      .register('swap-rows-direct-button-test');

    container.innerHTML = '<swap-rows-direct-button-test></swap-rows-direct-button-test>';
    await customElements.whenDefined('swap-rows-direct-button-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-direct-button-test');

    el.data = [
      { id: 'row-0', label: 'row-0' },
      { id: 'row-1', label: 'row-1' },
      { id: 'row-2', label: 'row-2' },
      { id: 'row-3', label: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);
    assert.equal(beforeButtons[1].id, 'row-1');

    const tmp = el.data[1];
    el.data[1] = el.data[3];
    el.data[3] = tmp;
    el.render({
      data: {
        1: el.data[1],
        3: el.data[3],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[1].textContent.trim(), 'row-3');
    assert.equal(afterButtons[3].textContent.trim(), 'row-1');
    assert.equal(afterButtons[1].id, 'row-3');
    assert.equal(afterButtons[3].id, 'row-1');
    assert.equal(beforeButtons[1].matches(':focus'), true);
  });

  it('toggles mdw-if on the same repeated button element', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" mdw-if={row.show} type="button" class="row-btn">
            {row.id}
          </button>
        </div>
      `
      .register('swap-rows-direct-button-if-test');

    container.innerHTML = '<swap-rows-direct-button-if-test></swap-rows-direct-button-if-test>';
    await customElements.whenDefined('swap-rows-direct-button-if-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-direct-button-if-test');

    el.data = [
      { id: 'row-0', show: true },
      { id: 'row-1', show: true },
      { id: 'row-2', show: true },
    ];

    await new Promise((r) => setTimeout(r, 50));

    let buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons.length, 3);

    buttons[1].focus();
    assert.equal(buttons[1].matches(':focus'), true);

    el.data[1].show = false;
    el.render({
      data: {
        1: el.data[1],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons.length, 2);
    assert.equal(el.shadowRoot.querySelector(':focus'), null);

    el.data[1].show = true;
    el.render({
      data: {
        1: el.data[1],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons.length, 3);
    assert.equal(buttons[1].matches(':focus'), false);
  });

});
