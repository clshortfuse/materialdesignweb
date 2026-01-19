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

  it('renders only swapped rows during partial patch', async () => {
    const renderCounts = new Map();
    const renderCell = (_data, injections) => {
      const row = injections?.row;
      if (!row) return '';
      renderCounts.set(row.id, (renderCounts.get(row.id) ?? 0) + 1);
      return row.id;
    };

    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="row-cell">${renderCell}</span>
          </div>
        </div>
      `
      .register('swap-rows-render-count-test');

    container.innerHTML = '<swap-rows-render-count-test></swap-rows-render-count-test>';
    await customElements.whenDefined('swap-rows-render-count-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-render-count-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];

    await new Promise((r) => setTimeout(r, 50));

    const before = new Map(renderCounts);

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

    const delta = (id) => (renderCounts.get(id) ?? 0) - (before.get(id) ?? 0);
    assert.equal(delta('row-0'), 0, 'row-0 should not re-render');
    assert.equal(delta('row-2'), 0, 'row-2 should not re-render');
    assert.equal(delta('row-1'), 1, 'row-1 should re-render once');
    assert.equal(delta('row-3'), 1, 'row-3 should re-render once');
    const totalDelta = [...renderCounts.keys()]
      .reduce((sum, id) => sum + delta(id), 0);
    assert.equal(totalDelta, 2, 'only the swapped rows should render');
  });

  it('renders only swapped rows with a large dataset', async () => {
    const renderCounts = new Map();
    const renderCell = (_data, injections) => {
      const row = injections?.row;
      if (!row) return '';
      renderCounts.set(row.id, (renderCounts.get(row.id) ?? 0) + 1);
      return row.id;
    };

    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="row-cell">${renderCell}</span>
          </div>
        </div>
      `
      .register('swap-rows-render-count-large-test');

    container.innerHTML = '<swap-rows-render-count-large-test></swap-rows-render-count-large-test>';
    await customElements.whenDefined('swap-rows-render-count-large-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-render-count-large-test');

    el.data = Array.from({ length: 1000 }, (_, index) => ({ id: `row-${index}` }));

    await new Promise((r) => setTimeout(r, 50));

    const before = new Map(renderCounts);

    const tmp = el.data[123];
    el.data[123] = el.data[987];
    el.data[987] = tmp;
    el.render({
      data: {
        123: el.data[123],
        987: el.data[987],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const delta = (id) => (renderCounts.get(id) ?? 0) - (before.get(id) ?? 0);
    const totalDelta = [...renderCounts.keys()]
      .reduce((sum, id) => sum + delta(id), 0);
    assert.equal(delta('row-123'), 1, 'row-123 should re-render once');
    assert.equal(delta('row-987'), 1, 'row-987 should re-render once');
    assert.equal(totalDelta, 2, 'only the swapped rows should render');
  });

  it('re-renders when reassigning same keys (full array replace)', async () => {
    const renderCounts = new Map();
    const renderCell = (_data, injections) => {
      const row = injections?.row;
      if (!row) return '';
      renderCounts.set(row.id, (renderCounts.get(row.id) ?? 0) + 1);
      return row.id;
    };

    const ReassignSameKeys = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="row-cell">${renderCell}</span>
          </div>
        </div>
      `
      .register('reassign-same-keys-test');

    container.innerHTML = '<reassign-same-keys-test></reassign-same-keys-test>';
    await customElements.whenDefined('reassign-same-keys-test');

    /** @type {InstanceType<ReassignSameKeys>} */
    const el = container.querySelector('reassign-same-keys-test');

    el.data = Array.from({ length: 200 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const before = new Map(renderCounts);
    el.data = el.data.map((row) => ({ ...row }));
    await new Promise((r) => setTimeout(r, 50));

    const delta = (id) => (renderCounts.get(id) ?? 0) - (before.get(id) ?? 0);
    const totalDelta = [...renderCounts.keys()]
      .reduce((sum, id) => sum + delta(id), 0);
    assert.equal(totalDelta, 200, 'full array replace should re-render all rows');
  });

  it('limits re-renders when filtering large lists', async () => {
    const renderCounts = new Map();
    const renderCell = (_data, injections) => {
      const row = injections?.row;
      if (!row) return '';
      renderCounts.set(row.id, (renderCounts.get(row.id) ?? 0) + 1);
      return row.id;
    };

    const FilterLarge = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
        useFilter: { type: 'boolean', value: false },
        filtered({ data, useFilter }) {
          return useFilter ? data.filter((row) => row.keep) : data;
        },
      })
      .html`
        <div>
          <div mdw-for="{row of filtered}" class="row">
            <span class="row-cell">${renderCell}</span>
          </div>
        </div>
      `
      .register('filter-large-test');

    container.innerHTML = '<filter-large-test></filter-large-test>';
    await customElements.whenDefined('filter-large-test');

    /** @type {InstanceType<FilterLarge>} */
    const el = container.querySelector('filter-large-test');

    el.data = Array.from({ length: 200 }, (_, index) => ({
      id: `row-${index}`,
      keep: (index % 2) === 0,
    }));
    await new Promise((r) => setTimeout(r, 50));

    const before = new Map(renderCounts);
    el.useFilter = true;
    await new Promise((r) => setTimeout(r, 50));

    const totalDelta = [...renderCounts.keys()]
      .reduce((sum, id) => sum + ((renderCounts.get(id) ?? 0) - (before.get(id) ?? 0)), 0);
    assert.isAtMost(totalDelta, 100, 'only filtered-out rows should be removed');
  });

  it('limits DOM writes on head insert with full reassignment', async () => {
    const renderCounts = new Map();
    const renderCell = (_data, injections) => {
      const row = injections?.row;
      if (!row) return '';
      renderCounts.set(row.id, (renderCounts.get(row.id) ?? 0) + 1);
      return row.id;
    };

    const HeadInsertRemove = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="row-cell">${renderCell}</span>
          </div>
        </div>
      `
      .register('head-insert-remove-test');

    container.innerHTML = '<head-insert-remove-test></head-insert-remove-test>';
    await customElements.whenDefined('head-insert-remove-test');

    /** @type {InstanceType<HeadInsertRemove>} */
    const el = container.querySelector('head-insert-remove-test');

    el.data = Array.from({ length: 200 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const mutationCounts = { added: 0, removed: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
      }
    });
    observer.observe(el.shadowRoot, { childList: true, subtree: true });
    const head = { id: 'row-head' };
    el.data.unshift(head);
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, beforeNodes.length + 1);
    for (let i = 0; i < beforeNodes.length; i += 1) {
      assert.equal(afterNodes[i + 1], beforeNodes[i], 'existing rows should be preserved');
    }
    assert.isAtMost(mutationCounts.removed, 2, 'head insert should avoid removing existing rows');
    assert.isAtMost(mutationCounts.added, 2, 'head insert should add minimal nodes');
  });

  it('limits re-renders on partial index update in large list', async () => {
    const renderCounts = new Map();
    const renderCell = (_data, injections) => {
      const row = injections?.row;
      if (!row) return '';
      renderCounts.set(row.id, (renderCounts.get(row.id) ?? 0) + 1);
      return row.id;
    };

    const PartialUpdateLarge = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="row-cell">${renderCell}</span>
          </div>
        </div>
      `
      .register('partial-update-large-test');

    container.innerHTML = '<partial-update-large-test></partial-update-large-test>';
    await customElements.whenDefined('partial-update-large-test');

    /** @type {InstanceType<PartialUpdateLarge>} */
    const el = container.querySelector('partial-update-large-test');

    el.data = Array.from({ length: 200 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const before = new Map(renderCounts);
    el.data[150] = { id: 'row-150b' };
    el.render({ data: { 150: el.data[150] } });
    await new Promise((r) => setTimeout(r, 50));

    const delta = (id) => (renderCounts.get(id) ?? 0) - (before.get(id) ?? 0);
    const totalDelta = [...renderCounts.keys()]
      .reduce((sum, id) => sum + delta(id), 0);
    assert.equal(delta('row-150b'), 1);
    assert.equal(totalDelta, 1, 'only the updated row should render');
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

  it('inserts a new head row via patch without nested mdw-for', async () => {
    const PatchInsertHead = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" type="button" class="row-btn">{row.id}</button>
        </div>
      `
      .register('patch-insert-head-test');

    container.innerHTML = '<patch-insert-head-test></patch-insert-head-test>';
    await customElements.whenDefined('patch-insert-head-test');

    /** @type {InstanceType<PatchInsertHead>} */
    const el = container.querySelector('patch-insert-head-test');

    const row0 = { id: 'row-0' };
    const row1 = { id: 'row-1' };
    const row2 = { id: 'row-2' };

    el.data = [row0, row1];

    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons.length, 2);

    el.patch({ data: [row2, row0, row1] });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 3);
    assert.equal(afterButtons[0].textContent, 'row-2');
    assert.equal(afterButtons[1].textContent, 'row-0');
    assert.equal(afterButtons[2].textContent, 'row-1');
  });

  it('keeps DOM order when patch inserts in middle and appends', async () => {
    const MixedInsertAppend = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" type="button" class="row-btn">{row.id}</button>
        </div>
      `
      .register('mixed-insert-append-test');

    container.innerHTML = '<mixed-insert-append-test></mixed-insert-append-test>';
    await customElements.whenDefined('mixed-insert-append-test');

    /** @type {InstanceType<MixedInsertAppend>} */
    const el = container.querySelector('mixed-insert-append-test');

    const rowA = { id: 'row-a' };
    const rowB = { id: 'row-b' };
    const rowC = { id: 'row-c' };
    const rowX = { id: 'row-x' };
    const rowD = { id: 'row-d' };

    el.data = [rowA, rowB, rowC];

    await new Promise((r) => setTimeout(r, 50));

    el.patch({ data: [rowA, rowX, rowB, rowC, rowD] });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 5);
    assert.equal(afterButtons[0].textContent, 'row-a');
    assert.equal(afterButtons[1].textContent, 'row-x');
    assert.equal(afterButtons[2].textContent, 'row-b');
    assert.equal(afterButtons[3].textContent, 'row-c');
    assert.equal(afterButtons[4].textContent, 'row-d');
  });

  it('keeps DOM order when append is queued before a mid insert', async () => {
    const MixedOrder = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" type="button" class="row-btn">{row.id}</button>
        </div>
      `
      .register('mixed-order-test');

    container.innerHTML = '<mixed-order-test></mixed-order-test>';
    await customElements.whenDefined('mixed-order-test');

    /** @type {InstanceType<MixedOrder>} */
    const el = container.querySelector('mixed-order-test');

    const rowA = { id: 'row-a' };
    const rowB = { id: 'row-b' };
    const rowC = { id: 'row-c' };
    const rowD = { id: 'row-d' };
    const rowX = { id: 'row-x' };

    el.data = [rowA, rowB, rowC];

    await new Promise((r) => setTimeout(r, 50));

    // Append first, then insert in the middle within the same patch.
    el.patch({ data: [rowA, rowB, rowC, rowD, rowX] });

    await new Promise((r) => setTimeout(r, 50));

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons.length, 5);
    assert.equal(afterButtons[0].textContent, 'row-a');
    assert.equal(afterButtons[1].textContent, 'row-b');
    assert.equal(afterButtons[2].textContent, 'row-c');
    assert.equal(afterButtons[3].textContent, 'row-d');
    assert.equal(afterButtons[4].textContent, 'row-x');
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

  it('updates when array reference changes without explicit changeList', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('swap-rows-ref-change-test');

    container.innerHTML = '<swap-rows-ref-change-test></swap-rows-ref-change-test>';
    await customElements.whenDefined('swap-rows-ref-change-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-ref-change-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const before = [...el.shadowRoot.querySelectorAll('.row')].map((node) => node.textContent);
    assert.deepEqual(before, ['row-0', 'row-1']);

    // Replace with a new array reference of same length but reordered.
    el.data = [
      { id: 'row-1' },
      { id: 'row-0' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const after = [...el.shadowRoot.querySelectorAll('.row')].map((node) => node.textContent);
    assert.deepEqual(after, ['row-1', 'row-0']);
  });

  it('updates when reassigning array with same item refs after item mutations', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.label}</div>
        </div>
      `
      .register('swap-rows-same-ref-test');

    container.innerHTML = '<swap-rows-same-ref-test></swap-rows-same-ref-test>';
    await customElements.whenDefined('swap-rows-same-ref-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-same-ref-test');

    const rowA = { id: 'row-0', label: 'A' };
    const rowB = { id: 'row-1', label: 'B' };
    el.data = [rowA, rowB];

    await new Promise((r) => setTimeout(r, 50));
    let rows = [...el.shadowRoot.querySelectorAll('.row')].map((node) => node.textContent);
    assert.deepEqual(rows, ['A', 'B']);

    rowA.label = 'A+';
    rowB.label = 'B+';
    el.data = [...el.data]; // New array reference, same item refs.

    await new Promise((r) => setTimeout(r, 50));
    rows = [...el.shadowRoot.querySelectorAll('.row')].map((node) => node.textContent);
    assert.deepEqual(rows, ['A+', 'B+']);
  });

  it('rebuilds when changeList length mismatches iterable length', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('swap-rows-change-list-length-test');

    container.innerHTML = '<swap-rows-change-list-length-test></swap-rows-change-list-length-test>';
    await customElements.whenDefined('swap-rows-change-list-length-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('swap-rows-change-list-length-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    // Swap data reference but provide a partial changeList with mismatched length.
    el.data = [
      { id: 'row-1' },
      { id: 'row-0' },
    ];
    const fakeChangeList = [];
    fakeChangeList.length = 1;
    fakeChangeList[0] = el.data[0];
    el.render({ data: fakeChangeList });
    await new Promise((r) => setTimeout(r, 50));

    const rows = [...el.shadowRoot.querySelectorAll('.row')].map((node) => node.textContent);
    assert.deepEqual(rows, ['row-1', 'row-0']);
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
