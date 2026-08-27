import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-list-grid late upgrade', () => {
  it('discovers current trailing-action targets after acquiring grid ownership', async () => {
    const grid = document.createElement('mdw-list-grid');
    const row = /** @type {HTMLElement & {_ariaRole: string, refs: Record<string, HTMLElement>}} */ (
      document.createElement('mdw-list-row')
    );
    row.setAttribute('actionable', '');
    row.append('First');
    const cell = /** @type {HTMLElement & {_ariaRole: string}} */ (
      document.createElement('mdw-list-cell')
    );
    cell.slot = 'trailing-action';
    const dynamic = document.createElement('span');
    dynamic.textContent = 'Dynamic';
    cell.append(dynamic);
    row.append(cell);
    grid.append(row);
    document.body.append(grid);
    await nextTask();

    assert.isUndefined(row._ariaRole);
    assert.isUndefined(cell._ariaRole);

    const { default: ListGrid } = await import('../../components/ListGrid.js');
    await customElements.whenDefined('mdw-list-grid');
    await nextTask();

    assert.instanceOf(grid, ListGrid);
    assert.equal(row._ariaRole, 'row');
    assert.equal(cell._ariaRole, 'gridcell');
    assert.notInclude([...grid.getKbdNavChildren()], dynamic);

    dynamic.contentEditable = 'true';

    assert.include([...grid.getKbdNavChildren()], dynamic);
  });
});
