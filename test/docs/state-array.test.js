import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('docs/core/state-array.md', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  const createListElement = async (tag) => {
    const List = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <button type="button" class="row-btn">{row.title}</button>
          </div>
        </div>
      `
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);

    /** @type {InstanceType<List>} */
    return container.querySelector(tag);
  };

  it('2.0 Assignment: triggers render', async () => {
    const el = await createListElement('array-docs-assign');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons.length, 2);
    assert.equal(buttons[0].textContent, 'row-0');
    assert.equal(buttons[1].textContent, 'row-1');
  });

  it('2.0 Assignment: in-place mutation does not render until render()', async () => {
    const el = await createListElement('array-docs-inplace');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[1].textContent, 'row-1');

    el.data[1].title = 'row-1b';
    const unchangedButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(unchangedButtons[1].textContent, 'row-1');

    el.render({
      data: {
        1: el.data[1],
      },
    });

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[1].textContent, 'row-1b');
  });

  it('4.0 Render: does not mutate state', async () => {
    const el = await createListElement('array-docs-render');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    const beforeData = el.data;
    el.render({
      data: {
        1: { title: 'row-1c' },
      },
    });

    assert.equal(el.data, beforeData);
    assert.equal(el.data[1].title, 'row-1');
  });

  it('3.0 Patch: updates state and renders', async () => {
    const el = await createListElement('array-docs-patch');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    el.patch({
      data: {
        0: { title: 'row-0b' },
        length: 1,
      },
    });

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(el.data.length, 1);
    assert.equal(buttons.length, 1);
    assert.equal(buttons[0].textContent, 'row-0b');
  });

  it('3.0 Patch: length truncates without explicit nulls', async () => {
    const el = await createListElement('array-docs-patch-length');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    el.patch({
      data: {
        length: 1,
      },
    });

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(el.data.length, 1);
    assert.equal(buttons.length, 1);
    assert.equal(buttons[0].textContent, 'row-0');
  });

  it('3.0 Patch: null clears data but does not remove the rendered row', async () => {
    const el = await createListElement('array-docs-patch-null');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    el.patch({
      data: {
        1: null,
      },
    });

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(el.data.length, 3);
    assert.equal(buttons.length, 3);
    assert.equal(el.data[1], undefined);
    assert.equal(buttons[1].textContent, 'row-1');
  });

  it('4.0 Render: partial index does not change array length', async () => {
    const el = await createListElement('array-docs-render-partial');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    el.render({
      data: {
        1: { title: 'row-1c' },
      },
    });

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(el.data.length, 3);
    assert.equal(buttons.length, 3);
    assert.equal(buttons[1].textContent, 'row-1c');
  });

  it('3.0 Patch: length updates array length and DOM', async () => {
    const el = await createListElement('array-docs-patch-length-render');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    el.patch({
      data: {
        length: 0,
      },
    });

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(el.data.length, 0);
    assert.equal(buttons.length, 0);
  });

  it('2.0 Assignment: same reference does not re-render', async () => {
    const el = await createListElement('array-docs-assign-same-ref');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[0].textContent, 'row-0');

    el.data = el.data;

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[0], beforeButtons[0]);
    assert.equal(afterButtons[1], beforeButtons[1]);
  });

  it('2.0 Assignment: reorders DOM when array order changes', async () => {
    const el = await createListElement('array-docs-assign-reorder');

    const row0 = { title: 'row-0' };
    const row1 = { title: 'row-1' };
    const row2 = { title: 'row-2' };
    el.data = [row0, row1, row2];

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[0].textContent, 'row-0');
    assert.equal(beforeButtons[2].textContent, 'row-2');

    el.data = [row2, row1, row0];

    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[0].textContent, 'row-2');
    assert.equal(afterButtons[2].textContent, 'row-0');
  });

  it('2.0 Assignment: reorder with same object references moves DOM nodes', async () => {
    const el = await createListElement('array-docs-assign-reorder-refs');

    const row0 = { title: 'row-0' };
    const row1 = { title: 'row-1' };
    const row2 = { title: 'row-2' };
    el.data = [row0, row1, row2];

    const beforeRows = [...el.shadowRoot.querySelectorAll('.row')];
    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[0].textContent, 'row-0');
    assert.equal(beforeButtons[2].textContent, 'row-2');

    el.data = [row2, row1, row0];

    const afterRows = [...el.shadowRoot.querySelectorAll('.row')];
    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[0].textContent, 'row-2');
    assert.equal(afterButtons[2].textContent, 'row-0');
    assert.equal(afterRows[0], beforeRows[2]);
    assert.equal(afterRows[2], beforeRows[0]);
  });

  it('2.0 Assignment: reorder with new objects moves DOM nodes', async () => {
    const el = await createListElement('array-docs-assign-reorder-new');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    const beforeRows = [...el.shadowRoot.querySelectorAll('.row')];

    el.data = [
      { title: 'row-2' },
      { title: 'row-1' },
      { title: 'row-0' },
    ];

    const afterRows = [...el.shadowRoot.querySelectorAll('.row')];
    const afterButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(afterButtons[0].textContent, 'row-2');
    assert.equal(afterButtons[2].textContent, 'row-0');
    assert.notEqual(afterRows[0], beforeRows[0]);
    assert.notEqual(afterRows[2], beforeRows[2]);
  });

  it('2.0 Assignment: deep changes require render() or replacement', async () => {
    const el = await createListElement('array-docs-deep-change');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
    ];

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(beforeButtons[1].textContent, 'row-1');

    el.data[1].title = 'row-1b';

    const unchangedButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(unchangedButtons[1].textContent, 'row-1');

    el.render({
      data: {
        1: el.data[1],
      },
    });

    const renderedButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(renderedButtons[1].textContent, 'row-1b');

    el.data[1] = { title: 'row-1c' };
    el.data = el.data;

    const replacedButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(replacedButtons[1].textContent, 'row-1c');
  });

  it('5.3.a Insert in the middle (keeps existing rows)', async () => {
    const el = await createListElement('array-docs-insert-middle');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    const next = el.data.slice();
    next.splice(1, 0, { title: 'row-new' });
    el.data = next;

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons.length, 4);
    assert.equal(buttons[0].textContent, 'row-0');
    assert.equal(buttons[1].textContent, 'row-new');
    assert.equal(buttons[2].textContent, 'row-1');
    assert.equal(buttons[3].textContent, 'row-2');
  });

  it('5.3.b Remove from the middle', async () => {
    const el = await createListElement('array-docs-remove-middle');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    const next = el.data.slice();
    next.splice(1, 1);
    el.data = next;

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons.length, 2);
    assert.equal(buttons[0].textContent, 'row-0');
    assert.equal(buttons[1].textContent, 'row-2');
  });

  it('5.3.c Reorder without changing items', async () => {
    const el = await createListElement('array-docs-reorder-refs');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    el.data = [el.data[2], el.data[1], el.data[0]];

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons[0].textContent, 'row-2');
    assert.equal(buttons[1].textContent, 'row-1');
    assert.equal(buttons[2].textContent, 'row-0');
  });

  it('5.3.d Partial render for a single row', async () => {
    const el = await createListElement('array-docs-partial-render');

    el.data = [
      { title: 'row-0' },
      { title: 'row-1' },
      { title: 'row-2' },
    ];

    el.data[2].title = 'row-2b';
    el.render({ data: { 2: el.data[2] } });

    const buttons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    assert.equal(buttons[0].textContent, 'row-0');
    assert.equal(buttons[1].textContent, 'row-1');
    assert.equal(buttons[2].textContent, 'row-2b');
  });
});
