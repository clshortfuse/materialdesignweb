import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/MenuItem.js';
import { html, sendKeypress } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-menu-item', () => {
  it('dispatches action for pointer and keyboard command activation', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item>Run command</mdw-menu-item>`;
    await nextTask();
    let activations = 0;
    item.onaction = () => { activations += 1; };

    assert.equal(item.refs.anchor.getAttribute('role'), 'menuitem');
    assert.isFalse(item.refs.anchor.hasAttribute('href'));

    item.click();
    assert.equal(activations, 1);

    item.focus();
    await sendKeypress('Enter');
    assert.equal(activations, 2);

    await sendKeypress(' ');
    assert.equal(activations, 3);
  });

  it('preserves href=# link, action, and hyperlink override behavior', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item href="#">Open target</mdw-menu-item>`;
    await nextTask();
    const anchor = /** @type {HTMLAnchorElement} */ (item.refs.anchor);
    let actions = 0;
    let clicks = 0;
    let hyperlinks = 0;
    let preventNavigation = false;
    let preventedBeforeConsumer = null;
    item.onaction = () => { actions += 1; };
    item.addEventListener('click', (event) => {
      clicks += 1;
      preventedBeforeConsumer = event.defaultPrevented;
      // Keep the test page from performing the observed native navigation.
      event.preventDefault();
    });
    item.addEventListener('mdw:hyperlink', (event) => {
      hyperlinks += 1;
      if (preventNavigation) {
        event.preventDefault();
      }
    });
    const uncanceledClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    const itemRect = item.getBoundingClientRect();

    anchor.dispatchEvent(uncanceledClick);

    assert.equal(item.href, '#');
    assert.equal(anchor.getAttribute('href'), '#');
    assert.equal(anchor.getAttribute('role'), 'menuitem');
    const pointerTarget = item.shadowRoot.elementFromPoint(
      itemRect.x + (itemRect.width / 2),
      itemRect.y + (itemRect.height / 2),
    );
    assert.isTrue(
      pointerTarget === anchor,
      `Link overlay must receive row pointer events, received ${pointerTarget?.localName}#${pointerTarget?.id}`,
    );
    assert.equal(actions, 1);
    assert.equal(clicks, 1);
    assert.equal(hyperlinks, 1);
    assert.isFalse(preventedBeforeConsumer);
    assert.isTrue(uncanceledClick.defaultPrevented);

    preventNavigation = true;
    const canceledClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    anchor.dispatchEvent(canceledClick);

    assert.equal(actions, 2);
    assert.equal(clicks, 2);
    assert.equal(hyperlinks, 2);
    assert.isTrue(preventedBeforeConsumer);
    assert.isTrue(canceledClick.defaultPrevented);

    item.focus();
    await sendKeypress('Enter');
    assert.equal(actions, 3);
    assert.equal(clicks, 3);
    assert.equal(hyperlinks, 3);
  });

  it('does not dispatch action or navigate while disabled or for selection items', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const disabledItem = html`<mdw-menu-item disabled href="#">Unavailable</mdw-menu-item>`;
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const checkboxItem = html`<mdw-menu-item checkbox href="#">Toggle setting</mdw-menu-item>`;
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const radioItem = html`<mdw-menu-item radio href="#">Choose setting</mdw-menu-item>`;
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const cascadeItem = html`<mdw-menu-item cascades="submenu" href="#">Open submenu</mdw-menu-item>`;
    await nextTask();
    let actions = 0;
    let hyperlinks = 0;
    let cascades = 0;
    disabledItem.onaction = () => { actions += 1; };
    checkboxItem.onaction = () => { actions += 1; };
    radioItem.onaction = () => { actions += 1; };
    cascadeItem.onaction = () => { actions += 1; };
    disabledItem.addEventListener('mdw:hyperlink', () => { hyperlinks += 1; });
    cascadeItem.addEventListener('mdw-menu-item:cascade', () => { cascades += 1; });

    disabledItem.refs.anchor.click();
    disabledItem.focus();
    await sendKeypress('Enter');
    await sendKeypress(' ');
    checkboxItem.click();
    radioItem.click();
    cascadeItem.click();

    assert.equal(actions, 0);
    assert.equal(hyperlinks, 0);
    assert.equal(cascades, 1);
    assert.equal(disabledItem.href, '#');
    assert.isFalse(disabledItem.refs.anchor.hasAttribute('href'));
    assert.isFalse(checkboxItem.refs.anchor.hasAttribute('href'));
    assert.isFalse(radioItem.refs.anchor.hasAttribute('href'));
    assert.isFalse(cascadeItem.refs.anchor.hasAttribute('href'));
    assert.isTrue(checkboxItem.selected);
    assert.isTrue(radioItem.selected);
    assert.equal(checkboxItem.refs.anchor.getAttribute('aria-checked'), 'true');
    assert.equal(radioItem.refs.anchor.getAttribute('aria-checked'), 'true');
    assert.isFalse(checkboxItem.refs.anchor.hasAttribute('aria-selected'));

    disabledItem.disabled = false;
    await nextTask();
    assert.equal(disabledItem.refs.anchor.getAttribute('href'), '#');
  });

  it('allows required selection items to select but not clear themselves', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const checkboxItem = html`<mdw-menu-item checkbox required>Required toggle</mdw-menu-item>`;
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const radioItem = html`<mdw-menu-item radio required>Required choice</mdw-menu-item>`;
    await nextTask();

    checkboxItem.click();
    radioItem.click();

    assert.isTrue(checkboxItem.selected);
    assert.isTrue(radioItem.selected);

    checkboxItem.click();
    radioItem.click();

    assert.isTrue(checkboxItem.selected);
    assert.isTrue(radioItem.selected);
  });

  it('groups initially selected same-valued radio items and tracks type changes', async () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-menu-item radio name=choice selected>First</mdw-menu-item>
        <mdw-menu-item radio name=choice selected>Second</mdw-menu-item>
      </form>
    `;
    const [first, second] = /** @type {InstanceType<import('../../components/MenuItem.js').default>[]} */ (
      [...form.querySelectorAll('mdw-menu-item')]
    );
    await nextTask();

    assert.equal(first.type, 'radio');
    assert.equal(first.value, 'on');
    assert.isFalse(first.selected);
    assert.isTrue(second.selected);
    assert.deepEqual(new FormData(form).getAll('choice'), ['on']);

    first.selected = true;

    assert.isTrue(first.selected);
    assert.isFalse(second.selected);

    second.removeAttribute('radio');
    second.selected = true;
    second.setAttribute('radio', '');

    assert.isFalse(first.selected);
    assert.isTrue(second.selected);

    second.value = null;
    assert.equal(second.value, 'null');
    second.removeAttribute('value');
    assert.equal(second.value, 'on');
  });

  it('restores radio and checkbox defaults on form reset', async () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-menu-item checkbox name=bold selected>Bold</mdw-menu-item>
        <mdw-menu-item radio name=spacing value=single selected>Single</mdw-menu-item>
        <mdw-menu-item radio name=spacing value=double>Double</mdw-menu-item>
      </form>
    `;
    const [checkbox, single, double] = /** @type {InstanceType<import('../../components/MenuItem.js').default>[]} */ (
      [...form.querySelectorAll('mdw-menu-item')]
    );
    await nextTask();

    checkbox.click();
    double.click();
    form.reset();
    await nextTask();

    assert.isTrue(checkbox.selected);
    assert.isTrue(single.selected);
    assert.isFalse(double.selected);
    assert.deepEqual(new FormData(form).getAll('bold'), ['on']);
    assert.deepEqual(new FormData(form).getAll('spacing'), ['single']);
  });

  it('cancels pending cascade work when disconnected', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item cascades=submenu>Open submenu</mdw-menu-item>`;
    item.CASCADE_TIMEOUT = 0;
    let cascades = 0;
    item.addEventListener('mdw-menu-item:cascade', () => { cascades += 1; });

    item.dispatchEvent(new MouseEvent('mouseenter'));
    assert.isNotNull(item._cascadeTimeout);

    item.remove();
    await nextTask();

    assert.isNull(item._cascadeTimeout);
    assert.equal(cascades, 0);
  });

  it('opens a delayed hover cascade once', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item cascades=submenu>Open submenu</mdw-menu-item>`;
    item.CASCADE_TIMEOUT = 0;
    let cascades = 0;
    item.addEventListener('mdw-menu-item:cascade', () => { cascades += 1; });

    item.dispatchEvent(new MouseEvent('mouseenter'));
    item.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTask();

    assert.isNull(item._cascadeTimeout);
    assert.equal(cascades, 1);
  });

  it('cancels pending cascade work when its activation state changes', async () => {
    /** @type {InstanceType<import('../../components/MenuItem.js').default>} */
    const item = html`<mdw-menu-item cascades=submenu>Open submenu</mdw-menu-item>`;
    item.CASCADE_TIMEOUT = 0;
    let cascades = 0;
    item.addEventListener('mdw-menu-item:cascade', () => { cascades += 1; });

    item.dispatchEvent(new MouseEvent('mouseenter'));
    item.disabled = true;
    await nextTask();

    assert.isNull(item._cascadeTimeout);
    assert.equal(cascades, 0);

    item.disabled = false;
    item.dispatchEvent(new MouseEvent('mouseenter'));
    item.removeAttribute('cascades');
    await nextTask();

    assert.isNull(item._cascadeTimeout);
    assert.equal(cascades, 0);
  });

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
