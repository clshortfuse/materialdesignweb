import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Input from '../../components/Input.js';
import '../../components/Listbox.js';
import '../../components/ListOption.js';
import { SAFARI_VERSION } from '../../core/dom.js';
import { axTree, iterateMeaningfulAXNodes } from '../plugins/axTree.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName, sendKeypress, typeKeys } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @param {number} ms */
function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {ReturnType<typeof axTree>} treePromise
 * @param {string} role
 * @return {Promise<import('playwright').AccessibilitySnapshot | null>}
 */
async function findAxRole(treePromise, role) {
  const tree = await treePromise;
  for (const node of iterateMeaningfulAXNodes(tree)) {
    if (node.role === role) return node;
  }
  return null;
}

/**
 * @param {ReturnType<typeof axTree>} treePromise
 * @param {string} role
 * @param {string} name
 * @return {Promise<import('playwright').AccessibilitySnapshot | null>}
 */
async function findAxRoleByName(treePromise, role, name) {
  const tree = await treePromise;
  for (const node of iterateMeaningfulAXNodes(tree)) {
    if (node.role === role && node.name === name) return node;
  }
  return null;
}

/**
 * @param {string} selector
 * @param {string} label
 * @return {Promise<void>}
 */
async function logAxTree(selector, label) {
  const tree = await axTree({ selector });
  console.log(label, JSON.stringify(tree, null, 2));
}

/**
 * @param {any} context
 * @return {boolean}
 */
function skipWebkitA11y(context) {
  if (Number.isNaN(SAFARI_VERSION)) return false;
  context.skip();
  return true;
}

describe('mdw-input', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-input');
    assert.equal(element.tagName.toLowerCase(), 'mdw-input');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Input);
    assert.equal(element.tagName.toLowerCase(), 'mdw-input');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-input></mdw-input>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-input');
  });

  it('opens listbox with Alt+ArrowDown', async () => {
    /** @type {HTMLInputElement} */
    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();
    const popup = document.querySelector('mdw-popup');
    assert.exists(popup);
    assert.exists(popup.querySelector('mdw-listbox'));
    assert.isNull(element.querySelector('mdw-listbox'));
  });

  it('selects listbox option via keyboard', async () => {
    /** @type {HTMLInputElement} */
    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();

    await sendKeypress('ArrowDown');
    await sendKeypress('ArrowDown');
    await sendKeypress('Enter');
    await wait();

    assert.isNull(document.querySelector('mdw-popup'));
    assert.exists(element.querySelector('mdw-listbox'));
    assert.equal(element.value, 'AK');
  });

  it('selects first navigated option with Enter', async () => {
    /** @type {HTMLInputElement} */
    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();

    await sendKeypress('ArrowDown');
    await sendKeypress('Enter');
    await wait();
    assert.equal(element.value, 'AL');
  });

  it('closes listbox on Escape without changing value', async () => {
    /** @type {HTMLInputElement} */

    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();

    await sendKeypress('ArrowDown');
    await sendKeypress('ArrowDown');
    await sendKeypress('Enter');
    await wait();

    assert.equal(element.value, 'AK');

    await sendKeypress('Alt+ArrowDown');
    await wait();
    await sendKeypress('ArrowUp');
    await sendKeypress('Escape');
    await wait();

    assert.isNull(document.querySelector('mdw-popup'));
    assert.exists(element.querySelector('mdw-listbox'));
    assert.equal(element.value, 'AK');
  });

  it('filters listbox options with autocompleteList', async () => {
    const element = html`
      <mdw-input outlined label="State" autocomplete-list="list">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await typeKeys('a');
    await wait();

    const listbox = /** @type {HTMLElement} */ (document.querySelector('mdw-listbox'));
    const [al, ak, ca] = /** @type {HTMLElement[]} */ ([...listbox.querySelectorAll('mdw-list-option')]);
    assert.isFalse(al.hidden);
    assert.isFalse(ak.hidden);
    assert.isTrue(ca.hidden);
  });

  it('a11y: reports expanded combobox when listbox opens', async function () {
    if (skipWebkitA11y(this)) return;

    /** @type {HTMLInputElement} */
    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();
    const combobox = await findAxRole(axTree({ selector: element.tagName }), 'combobox');
    assert.exists(combobox);
    assert.equal(combobox.expanded, true);
  });

  it('a11y: sets combobox ARIA attributes when listbox is present', async function () {
    if (skipWebkitA11y(this)) return;

    const element = html`
      <mdw-input outlined label="State" autocomplete-list="list">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    const closedTree = await axTree({ selector: element.tagName });
    const closedCombobox = [...iterateMeaningfulAXNodes(closedTree)]
      .find((node) => node.role === 'combobox');
    assert.exists(closedCombobox);
    assert.notEqual(closedCombobox.expanded, true);

    await sendKeypress('Alt+ArrowDown');
    await wait();

    const openTree = await axTree({ selector: element.tagName });
    const openCombobox = [...iterateMeaningfulAXNodes(openTree)]
      .find((node) => node.role === 'combobox');
    const axListbox = [...iterateMeaningfulAXNodes(openTree)]
      .find((node) => node.role === 'listbox');
    assert.exists(openCombobox);
    assert.equal(openCombobox.expanded, true);
    assert.exists(axListbox);
  });

  it('a11y: exposes listbox options in the a11y tree', async function () {
    if (skipWebkitA11y(this)) return;

    /** @type {HTMLInputElement} */
    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();

    await sendKeypress('ArrowDown');
    await wait();

    await logAxTree(element.tagName, 'ax:mdw-input:listbox-open');
    const tree = await axTree({ selector: element.tagName });
    const axListboxes = [...iterateMeaningfulAXNodes(tree)]
      .filter((node) => node.role === 'listbox');
    assert.equal(axListboxes.length, 1);
    const [axListbox] = axListboxes;
    const options = (axListbox.children ?? [])
      .filter((node) => node.role === 'option')
      .map((node) => node.name);

    assert.equal(options.length, 1);
    assert.isNotEmpty(options[0]);
  });

  it('a11y: reports aria-setsize/aria-posinset for the virtual listbox option', async function () {
    if (skipWebkitA11y(this)) return;

    // Playwright accessibility snapshots do not surface setSize/posInSet reliably across engines.
    // Assert when present; otherwise log and keep the rest of the test coverage.
    const element = html`
      <mdw-input outlined label="State">
        <mdw-listbox>
          <mdw-list-option value="AL">Alabama</mdw-list-option>
          <mdw-list-option value="AK">Alaska</mdw-list-option>
          <mdw-list-option value="CA">California</mdw-list-option>
        </mdw-listbox>
      </mdw-input>
    `;
    await wait();
    element.focus();
    await sendKeypress('Alt+ArrowDown');
    await wait();

    await sendKeypress('ArrowDown');
    await sendKeypress('ArrowDown');
    await wait();

    await logAxTree(element.tagName, 'ax:mdw-input:listbox-navigate');
    const tree = await axTree({ selector: element.tagName });
    const axListboxes = [...iterateMeaningfulAXNodes(tree)]
      .filter((node) => node.role === 'listbox');
    assert.equal(axListboxes.length, 1);
    const [axListbox] = axListboxes;
    const [axOption] = (axListbox.children ?? [])
      .filter((node) => node.role === 'option');
    assert.exists(axOption);
    assert.equal(axOption.name, 'Alaska');
    if (!('setSize' in axOption) || !('posInSet' in axOption)) {
      console.log('ax:virtual-option-setsize-posinset-missing', axOption);
      // Skip: axTree snapshot for this engine does not expose setSize/posInSet.
      this.skip();
    } else {
      assert.equal(axOption.setSize, 3);
      assert.equal(axOption.posInSet, 2);
    }
  });
});
