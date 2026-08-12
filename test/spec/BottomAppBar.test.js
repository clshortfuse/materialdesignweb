import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import BottomAppBar from '../../components/BottomAppBar.js';
import IconButton from '../../components/IconButton.js';
import { axTree, iterateMeaningfulAXNodes } from '../plugins/axTree.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-bottom-app-bar', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-bottom-app-bar');
    assert.equal(element.tagName.toLowerCase(), 'mdw-bottom-app-bar');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(BottomAppBar);
    assert.equal(element.tagName.toLowerCase(), 'mdw-bottom-app-bar');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-bottom-app-bar></mdw-bottom-app-bar>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-bottom-app-bar');
  });

  it('reconciles direct target readiness from its owned slot', async () => {
    /** @type {InstanceType<BottomAppBar>} */
    const element = html`
      <mdw-bottom-app-bar>
        <mdw-icon-button>First</mdw-icon-button>
        <mdw-icon-button>Second</mdw-icon-button>
        <mdw-icon-button>Third</mdw-icon-button>
      </mdw-bottom-app-bar>
    `;
    await nextTask();
    const buttons = /** @type {InstanceType<IconButton>[]} */ ([...element.children]);

    assert.instanceOf(buttons[0], IconButton);
    assert.deepEqual(buttons.map((button) => button.tabIndex), [0, -1, -1]);
  });

  it('uses live direct keyboard targets and ignores nested descendants', async () => {
    /** @type {InstanceType<BottomAppBar>} */
    const element = html`
      <mdw-bottom-app-bar>
        <mdw-icon-button id=first>First</mdw-icon-button>
      </mdw-bottom-app-bar>
    `;
    await nextTask();
    const first = /** @type {InstanceType<IconButton>} */ (element.querySelector('#first'));
    const second = /** @type {InstanceType<IconButton>} */ (
      makeFromString('<mdw-icon-button>Second</mdw-icon-button>', false)
    );
    const wrapper = /** @type {HTMLDivElement} */ (
      makeFromString('<div><mdw-icon-button>Nested</mdw-icon-button></div>', false)
    );
    const nested = /** @type {InstanceType<IconButton>} */ (wrapper.firstElementChild);
    document.body.append(wrapper);
    await nextTask();
    wrapper.remove();
    const nestedTabIndex = nested.getAttribute('tabindex');
    const getKbdNavChildren = element.getKbdNavChildren;
    let customOrderReads = 0;
    let slotChanges = 0;
    element.getKbdNavChildren = function getKbdNavChildrenCounter() {
      customOrderReads += 1;
      return getKbdNavChildren.call(this);
    };
    element.refs.slot.addEventListener('slotchange', () => { slotChanges += 1; });

    first.focus();
    element.append(second, wrapper);
    element.focusNext(first);

    assert.equal(document.activeElement, second);
    assert.equal(customOrderReads, 0);
    assert.equal(nested.getAttribute('tabindex'), nestedTabIndex);

    await nextTask();

    assert.equal(slotChanges, 1);
    assert.equal(customOrderReads, 0);
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, 0);
    assert.equal(nested.getAttribute('tabindex'), nestedTabIndex);

    customOrderReads = 0;
    element.focusPrevious(second);

    assert.equal(customOrderReads, 0);
    assert.equal(document.activeElement, first);
    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
    assert.equal(nested.getAttribute('tabindex'), nestedTabIndex);
    assert.isFalse(element._kbdManagedTabIndexes.has(nested));
  });

  it('delivers detached slotchange without re-managing toolbar targets', async () => {
    /** @type {InstanceType<BottomAppBar>} */
    const element = html`
      <mdw-bottom-app-bar>
        <button tabindex=3>First</button>
      </mdw-bottom-app-bar>
    `;
    await nextTask();
    const first = /** @type {HTMLButtonElement} */ (element.firstElementChild);
    const second = document.createElement('button');

    element.remove();
    await nextTask();
    element.append(second);
    await nextTask();

    assert.equal(first.getAttribute('tabindex'), '3');
    assert.isFalse(second.hasAttribute('tabindex'));
    assert.equal(element._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(element._kbdTabStop);
  });

  describe('aria', () => {
    it('restores its internal role after an authored role is removed', () => {
      /** @type {InstanceType<BottomAppBar>} */
      const element = html`<mdw-bottom-app-bar role=region></mdw-bottom-app-bar>`;

      assert.equal(element.readAriaProperty('role'), 'region');

      element.removeAttribute('role');

      assert.equal(element.readAriaProperty('role'), 'toolbar');
    });

    it('returns toolbar role', async () => {
      const element = html`<mdw-bottom-app-bar>foo</mdw-bottom-app-bar>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'toolbar');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-bottom-app-bar aria-label=foo></mdw-bottom-app-bar>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });
  });
});
