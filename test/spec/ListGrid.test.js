import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import List from '../../components/List.js';
import ListCell from '../../components/ListCell.js';
import ListGrid from '../../components/ListGrid.js';
import ListItem from '../../components/ListItem.js';
import ListRow from '../../components/ListRow.js';
import ListTree from '../../components/ListTree.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * @param {HTMLElement} target
 * @param {string} key
 * @param {KeyboardEventInit} [init]
 * @return {KeyboardEvent}
 */
function dispatchKeydown(target, key, init = {}) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    composed: true,
    key,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

describe('mdw-list-grid', () => {
  it('constructs the grid, row, and cell component types', () => {
    assert.equal(makeFromTagName('mdw-list-grid').localName, 'mdw-list-grid');
    assert.equal(makeFromConstructor(ListGrid).localName, 'mdw-list-grid');
    assert.equal(makeFromString('<mdw-list-grid></mdw-list-grid>').localName, 'mdw-list-grid');
    assert.equal(makeFromTagName('mdw-list-row').localName, 'mdw-list-row');
    assert.equal(makeFromConstructor(ListRow).localName, 'mdw-list-row');
    assert.equal(makeFromString('<mdw-list-row></mdw-list-row>').localName, 'mdw-list-row');
    assert.equal(makeFromTagName('mdw-list-cell').localName, 'mdw-list-cell');
    assert.equal(makeFromConstructor(ListCell).localName, 'mdw-list-cell');
    assert.equal(makeFromString('<mdw-list-cell></mdw-list-cell>').localName, 'mdw-list-cell');
  });

  it('has a fixed grid contract with direct row and gridcell ownership', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid role=listbox aria-label="Song actions">
        <mdw-list-row actionable role=listitem>
          First
          <mdw-list-cell slot=trailing-action role=button><button>Bookmark</button></mdw-list-cell>
        </mdw-list-row>
        <mdw-list-row href=/second>Second</mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const [first, second] = /** @type {InstanceType<ListRow>[]} */ ([...grid.children]);
    const cell = /** @type {InstanceType<ListCell>} */ (first.querySelector('mdw-list-cell'));
    const trailing = /** @type {HTMLButtonElement} */ (first.querySelector('button'));

    assert.equal(grid._listRole, 'grid');
    assert.equal(grid._ariaRole, 'grid');
    assert.equal(grid.readAriaProperty('role'), 'grid');
    assert.notProperty(grid, 'multiAction');
    assert.equal(first.readAriaProperty('role'), 'row');
    assert.equal(second.readAriaProperty('role'), 'row');
    assert.equal(cell.readAriaProperty('role'), 'gridcell');
    assert.notProperty(first, '_setListRole');
    assert.equal(first.refs.primaryCell.getAttribute('role'), 'gridcell');
    assert.isFalse(first.refs.actionsCell.hasAttribute('role'));
    assert.equal(first.refs.expansionCell.getAttribute('role'), 'gridcell');
    assert.deepEqual(first.refs.actions.assignedElements(), [cell]);
    assert.deepEqual([...grid.getKbdNavChildren()], [first.refs.primaryAction, trailing,
      second.refs.anchor]);
    assert.notProperty(grid, '_gridRows');
    assert.notProperty(grid, '_gridOwnedRows');
    assert.notProperty(grid, '_gridRowIndexes');
    assert.notProperty(grid, '_gridTargetPositions');
    assert.notProperty(grid, '_gridTabIndexWrites');
    assert.notProperty(first, '_listItemMutationObserver');
    assert.notProperty(first, '_trailingActions');
    assert.notProperty(first, '_gridActionCells');
    assert.notProperty(first, '_eventTargetsStateTarget');
    assert.notProperty(first, '_getGridFocusTargets');
    assert.notProperty(first, '_getPrimaryActionTarget');
    assert.notProperty(first, '_updateRowDisclosureState');
    assert.notProperty(first, '_isGridRow');
    assert.notProperty(first, '_listGridOwner');
    assert.notProperty(cell, '_listGridOwner');
    assert.notProperty(cell, '_listGridMutationObserver');
    assert.notProperty(cell, 'refreshActionTarget');
  });

  it('keeps expandable row disclosure inside its gridcell control', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row>
          Parent
          <div slot=expansion>Details</div>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const row = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);

    assert.isTrue(row.refs.expansionAction.isConnected);
    assert.isFalse(row.refs.row.hasAttribute('role'));
    assert.isFalse(row.refs.row.hasAttribute('tabindex'));
    assert.isFalse(row.refs.row.hasAttribute('aria-controls'));
    assert.isFalse(row.refs.row.hasAttribute('aria-disabled'));
    assert.equal(row.refs.primaryCell.getAttribute('role'), 'gridcell');
    assert.isFalse(row.refs.primaryCell.hasAttribute('tabindex'));
    assert.isFalse(row.refs.primaryCell.hasAttribute('aria-controls'));
    assert.isFalse(row.refs.primaryCell.hasAttribute('aria-disabled'));
    assert.isFalse(row.refs.primaryCell.hasAttribute('interactive'));
    assert.isFalse(row.refs.primaryInteraction.isConnected);
    assert.isFalse(row.refs.state.isConnected);
    assert.isFalse(row.refs.rippleContainer.isConnected);

    const primaryClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    row.refs.primaryCell.dispatchEvent(primaryClick);

    assert.isFalse(primaryClick.defaultPrevented);
    assert.isFalse(row.expanded);

    row.refs.expansionAction.click();

    assert.isTrue(row.expanded);
  });

  it('bounds focus activation to the current and previous rows', async () => {
    const grid = document.createElement('mdw-list-grid');
    const fragment = document.createDocumentFragment();
    /** @type {InstanceType<ListRow>|null} */
    let lastRow = null;
    for (let index = 0; index < 32; index += 1) {
      const row = /** @type {InstanceType<ListRow>} */ (
        document.createElement('mdw-list-row')
      );
      row.actionable = true;
      row.append(`Row ${index}`);
      const cell = document.createElement('mdw-list-cell');
      cell.slot = 'trailing-action';
      cell.append(document.createElement('button'));
      row.append(cell);
      fragment.append(row);
      lastRow = row;
    }
    grid.append(fragment);
    document.body.append(grid);
    await nextTask();
    const current = /** @type {InstanceType<ListRow>} */ (lastRow).refs.primaryAction;
    const previous = grid._kbdTabStop;
    const reads = { unrelatedOwnership: 0 };
    /** @type {Map<HTMLElement, typeof HTMLElement.prototype.getRootNode>} */
    const instrumented = new Map();
    for (const target of grid.getKbdNavChildren()) {
      if (target === current || target === previous) continue;
      const getRootNode = target.getRootNode;
      target.getRootNode = function getRootNodeCounter(...args) {
        reads.unrelatedOwnership += 1;
        return getRootNode.call(this, ...args);
      };
      instrumented.set(target, getRootNode);
    }
    try {
      current.focus();
    } finally {
      for (const [target, getRootNode] of instrumented) {
        target.getRootNode = getRootNode;
      }
    }

    assert.equal(reads.unrelatedOwnership, 0);
    assert.strictEqual(grid._kbdTabStop, current);
  });

  it('provides two-dimensional, row-edge, and grid-edge navigation', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          First
          <mdw-list-cell slot=trailing-action><button id=one>One</button></mdw-list-cell>
        </mdw-list-row>
        <mdw-list-row actionable>
          Second
          <mdw-list-cell slot=trailing-action><button id=two>Two</button></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const [first, second] = /** @type {InstanceType<ListRow>[]} */ ([...grid.children]);
    const one = /** @type {HTMLButtonElement} */ (grid.querySelector('#one'));
    const two = /** @type {HTMLButtonElement} */ (grid.querySelector('#two'));

    first.refs.primaryAction.focus();
    assert.isTrue(dispatchKeydown(first.refs.primaryAction, 'ArrowRight').defaultPrevented);
    assert.equal(document.activeElement, one);
    dispatchKeydown(one, 'ArrowDown');
    assert.equal(document.activeElement, two);
    dispatchKeydown(two, 'Home');
    assert.equal(second.shadowRoot.activeElement, second.refs.primaryAction);
    dispatchKeydown(second.refs.primaryAction, 'Home', { ctrlKey: true });
    assert.equal(first.shadowRoot.activeElement, first.refs.primaryAction);
    dispatchKeydown(first.refs.primaryAction, 'End', { ctrlKey: true });
    assert.equal(document.activeElement, two);
  });

  it('does not move or consume Home and End at their requested edges', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First</mdw-list-row>
        <mdw-list-row actionable>Last<mdw-list-cell slot=trailing-action><button>End</button></mdw-list-cell></mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const [first, last] = /** @type {InstanceType<ListRow>[]} */ ([...grid.children]);
    const end = /** @type {HTMLButtonElement} */ (last.querySelector('button'));

    first.refs.primaryAction.focus();
    assert.isFalse(dispatchKeydown(first.refs.primaryAction, 'Home').defaultPrevented);
    assert.isFalse(dispatchKeydown(first.refs.primaryAction, 'Home', { ctrlKey: true }).defaultPrevented);
    end.focus();
    assert.isFalse(dispatchKeydown(end, 'End').defaultPrevented);
    assert.isFalse(dispatchKeydown(end, 'End', { ctrlKey: true }).defaultPrevented);
    assert.equal(document.activeElement, end);
  });

  it('continues after rejected focus and consumes only confirmed movement', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          First
          <mdw-list-cell slot=trailing-action><button id=rejected>Rejected</button></mdw-list-cell>
          <mdw-list-cell slot=trailing-action><button id=available>Available</button></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const rejected = /** @type {HTMLButtonElement} */ (grid.querySelector('#rejected'));
    const available = /** @type {HTMLButtonElement} */ (grid.querySelector('#available'));
    rejected.focus = () => {};
    item.refs.primaryAction.focus();

    const moved = dispatchKeydown(item.refs.primaryAction, 'ArrowRight');
    const edge = dispatchKeydown(available, 'ArrowRight');

    assert.equal(document.activeElement, available);
    assert.isTrue(moved.defaultPrevented);
    assert.isFalse(edge.defaultPrevented);
  });

  it('continues after rejected focus while replacing a row tab stop', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable tabindex=0>
          First
          <mdw-list-cell slot=trailing-action><button>Available</button></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const available = /** @type {HTMLButtonElement} */ (grid.querySelector('button'));
    item.refs.primaryAction.focus = () => {};
    item.focus();

    grid._refreshGridTabIndexes();

    assert.equal(document.activeElement, available);
    assert.equal(grid._kbdTabStop, available);
    assert.equal(available.tabIndex, 0);
  });

  it('uses visual horizontal direction in RTL and preserves native widget keys', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid dir=rtl>
        <mdw-list-row actionable>Volume<mdw-list-cell slot=trailing-action><input value=10></mdw-list-cell></mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const input = /** @type {HTMLInputElement} */ (grid.querySelector('input'));

    item.refs.primaryAction.focus();
    assert.isTrue(dispatchKeydown(item.refs.primaryAction, 'ArrowLeft').defaultPrevented);
    assert.equal(document.activeElement, input);
    assert.isFalse(dispatchKeydown(input, 'ArrowRight').defaultPrevented);
  });

  it('discovers dynamic deeply nested trailing controls', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          First
          <mdw-list-cell slot=trailing-action><span id=dynamic>Dynamic</span></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const wrapper = /** @type {InstanceType<ListCell>} */ (grid.querySelector('[slot=trailing-action]'));
    const dynamic = /** @type {HTMLSpanElement} */ (grid.querySelector('#dynamic'));
    assert.notInclude([...grid.getKbdNavChildren()], wrapper);

    dynamic.contentEditable = 'true';
    item.refs.primaryAction.focus();

    assert.notInclude([...grid.getKbdNavChildren()], wrapper);
    assert.include([...grid.getKbdNavChildren()], dynamic);
    assert.equal(dynamic.tabIndex, -1);
    assert.lengthOf(
      [...grid._kbdManagedTabIndexes.keys()]
        .filter((target) => target.getAttribute('tabindex') === '0'),
      1,
    );
  });

  it('releases a nested fallback target when authored tabindex is removed', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          First
          <mdw-list-cell slot=trailing-action><span id=dynamic tabindex=0>Dynamic</span></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const dynamic = /** @type {HTMLSpanElement} */ (grid.querySelector('#dynamic'));
    assert.include([...grid.getKbdNavChildren()], dynamic);

    dynamic.removeAttribute('tabindex');
    item.refs.primaryAction.focus();

    assert.deepEqual([...grid.getKbdNavChildren()], [item.refs.primaryAction]);
    assert.equal(dynamic.getAttribute('tabindex'), null);
    assert.equal(item.refs.primaryAction.tabIndex, 0);
    assert.isFalse(grid._kbdManagedTabIndexes.has(dynamic));
  });

  it('keeps nested widget targets outside the trailing cell boundary', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          Outer
          <mdw-list-cell slot=trailing-action>
            <mdw-list-grid><mdw-list-row actionable>Inner</mdw-list-row></mdw-list-grid>
          </mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const nestedGrid = /** @type {InstanceType<ListGrid>} */ (grid.querySelector('mdw-list-grid'));
    const inner = /** @type {InstanceType<ListRow>} */ (nestedGrid.firstElementChild);

    assert.deepEqual([...grid.getKbdNavChildren()], [
      /** @type {InstanceType<ListRow>} */ (grid.firstElementChild).refs.primaryAction,
    ]);
    assert.notInclude([...grid.getKbdNavChildren()], inner.refs.primaryAction);
  });

  it('excludes directly slotted composite widgets from outer grid ownership', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          Outer
          <mdw-list-cell slot=trailing-action><div role=toolbar><button>Inner command</button></div></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const command = /** @type {HTMLButtonElement} */ (grid.querySelector('button'));

    assert.deepEqual([...grid.getKbdNavChildren()], [item.refs.primaryAction]);
    assert.notInclude([...grid.getKbdNavChildren()], command);
  });

  it('lets actual focus behavior reject hidden trailing targets', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          Visible
          <mdw-list-cell slot=trailing-action><span hidden><button>Hidden</button></span></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const hidden = /** @type {HTMLButtonElement} */ (grid.querySelector('button'));

    assert.deepEqual([...grid.getKbdNavChildren()], [item.refs.primaryAction, hidden]);
    assert.equal(item.refs.primaryAction.tabIndex, 0);
    assert.equal(hidden.getAttribute('tabindex'), '-1');
    item.refs.primaryAction.focus();
    const event = dispatchKeydown(item.refs.primaryAction, 'ArrowRight');
    assert.isFalse(event.defaultPrevented);
    assert.isTrue(item.shadowRoot.activeElement === item.refs.primaryAction);
  });

  it('reads current action availability on each keypress', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable id=first>First<mdw-list-cell slot=trailing-action><button hidden>More</button></mdw-list-cell></mdw-list-row>
        <mdw-list-row actionable id=second>Second</mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const first = /** @type {InstanceType<ListRow>} */ (grid.querySelector('#first'));
    const action = /** @type {HTMLButtonElement} */ (first.querySelector('button'));
    action.hidden = false;
    first.refs.primaryAction.focus();
    dispatchKeydown(first.refs.primaryAction, 'ArrowRight');
    assert.equal(document.activeElement, action);
    assert.notProperty(grid, '_gridRowIndexes');
  });

  it('reconciles current action topology when focus activates', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First<mdw-list-cell slot=trailing-action></mdw-list-cell></mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const row = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const cell = /** @type {InstanceType<ListCell>} */ (row.querySelector('mdw-list-cell'));
    const action = document.createElement('button');
    action.textContent = 'More';
    cell.append(action);

    assert.isFalse(grid._kbdManagedTabIndexes.has(action));
    action.focus();

    assert.equal(action.getAttribute('tabindex'), '0');
    assert.equal(row.refs.primaryAction.getAttribute('tabindex'), '-1');
    assert.isTrue(grid._kbdManagedTabIndexes.has(action));
    assert.notProperty(cell, '_listGridMutationObserver');
    assert.notProperty(cell, 'refreshActionTarget');
  });

  it('restores authored tabindex after action and grid ownership end', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First<mdw-list-cell slot=trailing-action><button tabindex=5>More</button></mdw-list-cell></mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const cell = /** @type {InstanceType<ListCell>} */ (item.querySelector('mdw-list-cell'));
    const action = /** @type {HTMLButtonElement} */ (item.querySelector('button'));
    action.setAttribute('tabindex', '3');
    assert.equal(action.tabIndex, 3);

    cell.slot = '';
    item.refs.primaryAction.focus();
    assert.equal(action.getAttribute('tabindex'), '3');

    grid.remove();
    assert.equal(item.refs.primaryAction.getAttribute('tabindex'), null);
  });

  it('replaces the tab stop on focus after its cell loses ownership', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First<mdw-list-cell slot=trailing-action><button tabindex=5>More</button></mdw-list-cell></mdw-list-row>
        <mdw-list-row actionable>Second</mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const row = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const cell = /** @type {InstanceType<ListCell>} */ (row.querySelector('mdw-list-cell'));
    const action = /** @type {HTMLButtonElement} */ (cell.firstElementChild);
    action.focus();
    assert.equal(action.tabIndex, 0);

    cell.slot = '';
    row.refs.primaryAction.focus();

    assert.equal(action.getAttribute('tabindex'), '5');
    assert.equal(row.refs.primaryAction.tabIndex, 0);
    assert.lengthOf(
      [...grid._kbdManagedTabIndexes.keys()]
        .filter((target) => target.getAttribute('tabindex') === '0'),
      1,
    );
  });

  it('replaces the tab stop on focus after its cell is removed', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First<mdw-list-cell slot=trailing-action><button tabindex=5>More</button></mdw-list-cell></mdw-list-row>
        <mdw-list-row actionable>Second</mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const row = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const cell = /** @type {InstanceType<ListCell>} */ (row.querySelector('mdw-list-cell'));
    const action = /** @type {HTMLButtonElement} */ (cell.firstElementChild);
    action.focus();
    assert.equal(action.tabIndex, 0);

    cell.remove();
    row.refs.primaryAction.focus();

    assert.equal(action.getAttribute('tabindex'), '5');
    assert.equal(row.refs.primaryAction.tabIndex, 0);
    assert.lengthOf(
      [...grid._kbdManagedTabIndexes.keys()]
        .filter((target) => target.getAttribute('tabindex') === '0'),
      1,
    );
  });

  it('does not restore grid ownership after whole-grid cleanup', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First<mdw-list-cell slot=trailing-action><button tabindex=5>More</button></mdw-list-cell></mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const row = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const cell = /** @type {InstanceType<ListCell>} */ (row.querySelector('mdw-list-cell'));
    const action = /** @type {HTMLButtonElement} */ (cell.firstElementChild);
    action.focus();
    assert.equal(action.tabIndex, 0);
    action.setAttribute('tabindex', '3');

    grid.remove();

    assert.equal(action.getAttribute('tabindex'), '3');
    assert.equal(row.refs.primaryAction.getAttribute('tabindex'), null);
    assert.equal(grid._kbdManagedTabIndexes.size, 0);
    assert.equal(grid._kbdTabStop, null);
    assert.notProperty(row, '_listGridOwner');
    assert.notProperty(cell, '_listGridOwner');
    assert.notProperty(cell, '_listGridMutationObserver');
  });

  it('preserves authored tabindex through inherited focus and kbd-nav writes', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          First
          <mdw-list-cell slot=trailing-action><button tabindex=5>More</button></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const action = /** @type {HTMLButtonElement} */ (item.querySelector('button'));

    item.refs.primaryAction.focus();
    dispatchKeydown(item.refs.primaryAction, 'ArrowRight');
    await nextTask();
    item.refs.primaryAction.focus();
    await nextTask();
    grid.kbdNav = 'false';
    await nextTask();

    assert.equal(action.getAttribute('tabindex'), '5');
    assert.equal(item.refs.primaryAction.getAttribute('tabindex'), null);
  });

  it('preserves authored tabindex through inherited programmatic navigation', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>
          First
          <mdw-list-cell slot=trailing-action><button tabindex=5>More</button></mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListRow>} */ (grid.firstElementChild);
    const action = /** @type {HTMLButtonElement} */ (item.querySelector('button'));

    item.refs.primaryAction.focus();
    assert.equal(grid.focusNext(item.refs.primaryAction), action);
    await nextTask();
    assert.equal(grid.focusFirst(), item.refs.primaryAction);
    await nextTask();
    grid.kbdNav = 'false';
    await nextTask();

    assert.equal(action.getAttribute('tabindex'), '5');
    assert.equal(item.refs.primaryAction.getAttribute('tabindex'), null);
  });

  it('does not convert items and rows when their parents change', async () => {
    const list = new List();
    const grid = new ListGrid();
    const tree = new ListTree();
    const item = new ListItem();
    const row = new ListRow();
    item.actionable = true;
    row.actionable = true;
    document.body.append(list, grid, tree);

    grid.append(item);
    await nextTask();
    assert.equal(item._ariaRole, 'listitem');
    assert.equal(item.readAriaProperty('role'), 'listitem');
    assert.deepEqual([...grid.getKbdNavChildren()], []);

    list.append(row);
    await nextTask();
    assert.equal(row._ariaRole, 'row');
    assert.equal(row.readAriaProperty('role'), 'row');

    tree.append(row);
    await nextTask();
    assert.equal(row._ariaRole, 'row');
    assert.equal(row.readAriaProperty('role'), 'row');

    tree.append(item);
    await nextTask();
    assert.equal(item._ariaRole, 'listitem');
    assert.equal(item.readAriaProperty('role'), 'listitem');
    assert.deepEqual([...tree.getKbdNavChildren()], []);
  });

  it('maintains exactly one managed tab stop', async () => {
    /** @type {InstanceType<ListGrid>} */
    const grid = html`
      <mdw-list-grid>
        <mdw-list-row actionable>First<mdw-list-cell slot=trailing-action><button>More</button></mdw-list-cell></mdw-list-row>
        <mdw-list-row actionable>Second</mdw-list-row>
      </mdw-list-grid>
    `;
    await nextTask();

    const tabStops = [...grid._kbdManagedTabIndexes.keys()]
      .filter((target) => target.getAttribute('tabindex') === '0');
    assert.lengthOf(tabStops, 1);
  });
});
