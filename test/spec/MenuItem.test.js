import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/MenuItem.js';
import { html } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-menu-item', () => {
  it('keeps inherited row spacing and selection content together', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item checkbox=leading>Bold</mdw-menu-item>`;
    await nextTask();
    const row = /** @type {HTMLElement} */ (item.refs.row);
    const selection = /** @type {HTMLElement} */ (item.refs.selection);
    const rowStyle = getComputedStyle(row);
    const hostStyle = getComputedStyle(item);

    assert.equal(selection.parentElement, row);
    assert.equal(rowStyle.gap, '12px');
    assert.equal(rowStyle.paddingInlineStart, '12px');
    assert.equal(rowStyle.paddingInlineEnd, '12px');
    assert.equal(hostStyle.paddingInlineStart, '0px');
    assert.equal(hostStyle.paddingInlineEnd, '0px');
  });

  it('does not inherit expansion behavior through ListOption', () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item>Item</mdw-menu-item>`;

    assert.notOk(item.refs.expansion);
    assert.isFalse('expanded' in item);
    assert.isFalse('_expandable' in item);
    assert.isFalse('toggleExpanded' in item);
  });
});
