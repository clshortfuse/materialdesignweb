import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Menu from '../../components/Menu.js';
import MenuItem from '../../components/MenuItem.js';
import { html, sendKeypress } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-menu', () => {
  it('exposes menu semantics and synchronized submenu relationships', () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=parent>
          <mdw-menu-item cascades=submenu>More choices</mdw-menu-item>
        </mdw-menu>
        <mdw-menu id=submenu>
          <mdw-menu-item>Nested choice</mdw-menu-item>
        </mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const parent = /** @type {InstanceType<Menu>} */ (container.querySelector('#parent'));
    const submenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#submenu'));
    const cascader = /** @type {InstanceType<MenuItem>} */ (parent.firstElementChild);
    const anchor = cascader.refs.anchor;

    assert.equal(parent.refs.dialog.getAttribute('role'), 'menu');
    assert.isFalse(parent.refs.dialog.hasAttribute('aria-modal'));
    assert.equal(anchor.getAttribute('aria-haspopup'), 'menu');
    assert.equal(anchor.getAttribute('aria-controls'), 'submenu');
    assert.equal(anchor.getAttribute('aria-expanded'), 'false');

    assert.isTrue(parent.showPopup(trigger, false));
    cascader.click();

    assert.isTrue(submenu.open);
    assert.equal(anchor.getAttribute('aria-expanded'), 'true');

    submenu.close(false);
    parent.close(false);

    assert.equal(anchor.getAttribute('aria-expanded'), 'false');
  });

  it('refreshes direct owned keyboard items when its slot topology changes', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item id=first>First</mdw-menu-item>
        <mdw-menu-item id=second>Second</mdw-menu-item>
      </mdw-menu>
    `;
    await nextTask();
    const first = /** @type {HTMLElement} */ (menu.querySelector('#first'));
    const second = /** @type {HTMLElement} */ (menu.querySelector('#second'));
    const third = document.createElement('mdw-menu-item');
    third.textContent = 'Third';

    assert.instanceOf(menu, Menu);
    assert.instanceOf(first, MenuItem);
    assert.instanceOf(second, MenuItem);
    assert.deepEqual([...menu.kbdNavChildren], [first, second]);

    menu.append(third);
    await nextTask();

    assert.deepEqual([...menu.kbdNavChildren], [first, second, third]);
    assert.equal(third.tabIndex, -1);

    second.remove();
    await nextTask();

    assert.deepEqual([...menu.kbdNavChildren], [first, third]);
    assert.isFalse(second.hasAttribute('tabindex'));
  });

  it('does not take ownership of nested submenu items', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item id=first>First</mdw-menu-item>
        <mdw-menu>
          <mdw-menu-item id=nested>Nested</mdw-menu-item>
        </mdw-menu>
      </mdw-menu>
    `;
    await nextTask();
    const first = /** @type {HTMLElement} */ (menu.querySelector('#first'));
    const nested = /** @type {HTMLElement} */ (menu.querySelector('#nested'));
    const submenu = /** @type {InstanceType<Menu>} */ (nested.parentElement);

    assert.deepEqual([...menu.kbdNavChildren], [first]);
    assert.deepEqual([...submenu.kbdNavChildren], [nested]);
    assert.equal(nested.tabIndex, 0);
  });

  it('closes after ordinary command activation but keeps selection menus open', () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=commands>
          <mdw-menu-item id=command>Run command</mdw-menu-item>
        </mdw-menu>
        <mdw-menu id=choices>
          <mdw-menu-item id=choice checkbox>Keep open</mdw-menu-item>
        </mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const commands = /** @type {InstanceType<Menu>} */ (container.querySelector('#commands'));
    const command = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#command'));
    const choices = /** @type {InstanceType<Menu>} */ (container.querySelector('#choices'));
    const choice = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#choice'));
    let activations = 0;
    command.onaction = () => { activations += 1; };

    assert.isTrue(commands.showPopup(trigger, false));
    command.click();

    assert.equal(activations, 1);
    assert.isFalse(commands.open);

    assert.isTrue(choices.showPopup(trigger, false));
    choice.click();

    assert.isTrue(choice.selected);
    assert.isTrue(choices.open);
    choices.close();
  });

  it('ignores cascade requests whose target menu does not exist', () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item cascades=missing>Missing submenu</mdw-menu-item>
      </mdw-menu>
    `;
    const item = /** @type {InstanceType<MenuItem>} */ (menu.firstElementChild);

    assert.doesNotThrow(() => item.click());
    assert.isUndefined(menu.submenu);
  });

  for (const [direction, openKey, closeKey] of [
    ['ltr', 'ArrowRight', 'ArrowLeft'],
    ['rtl', 'ArrowLeft', 'ArrowRight'],
  ]) {
    it(`opens and closes a ${direction.toUpperCase()} submenu with arrow keys`, async () => {
      const container = html`
        <div dir=${direction}>
          <button id=trigger>Open</button>
          <mdw-menu id=parent>
            <mdw-menu-item cascades=submenu>More choices</mdw-menu-item>
          </mdw-menu>
          <mdw-menu id=submenu>
            <mdw-menu-item>Nested choice</mdw-menu-item>
          </mdw-menu>
        </div>
      `;
      const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
      const parent = /** @type {InstanceType<Menu>} */ (container.querySelector('#parent'));
      const submenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#submenu'));
      const cascader = /** @type {InstanceType<MenuItem>} */ (parent.firstElementChild);
      const nested = /** @type {InstanceType<MenuItem>} */ (submenu.firstElementChild);

      parent.showPopup(trigger, true);
      cascader.focus();
      await sendKeypress(openKey);

      assert.isTrue(submenu.open);
      assert.equal(document.activeElement, nested);
      assert.equal(cascader.refs.anchor.getAttribute('aria-expanded'), 'true');

      await sendKeypress(closeKey);

      assert.isFalse(submenu.open);
      assert.isTrue(parent.open);
      assert.equal(document.activeElement, cascader);
      assert.equal(cascader.refs.anchor.getAttribute('aria-expanded'), 'false');
      parent.close(false);
    });
  }

  it('Escape closes only the current submenu and restores its cascader', async () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=parent>
          <mdw-menu-item cascades=submenu>More choices</mdw-menu-item>
        </mdw-menu>
        <mdw-menu id=submenu>
          <mdw-menu-item>Nested choice</mdw-menu-item>
        </mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const parent = /** @type {InstanceType<Menu>} */ (container.querySelector('#parent'));
    const submenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#submenu'));
    const cascader = /** @type {InstanceType<MenuItem>} */ (parent.firstElementChild);

    parent.showPopup(trigger, true);
    cascader.click();
    await sendKeypress('Escape');

    assert.isFalse(submenu.open);
    assert.isTrue(parent.open);
    assert.equal(document.activeElement, cascader);
    parent.close(false);
  });

  it('closes a depth-three command chain once per menu and restores root focus once', () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=first><mdw-menu-item cascades=second>Second</mdw-menu-item></mdw-menu>
        <mdw-menu id=second><mdw-menu-item cascades=third>Third</mdw-menu-item></mdw-menu>
        <mdw-menu id=third><mdw-menu-item id=command>Run command</mdw-menu-item></mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const menus = /** @type {InstanceType<Menu>[]} */ ([...container.querySelectorAll('mdw-menu')]);
    const command = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#command'));
    const closeCounts = [];
    for (const menu of menus) {
      const close = menu.close;
      let calls = 0;
      menu.close = function closeCounter(...args) {
        calls += 1;
        return close.apply(this, args);
      };
      closeCounts.push(() => calls);
    }

    menus[0].showPopup(trigger, true);
    /** @type {InstanceType<MenuItem>} */ (menus[0].firstElementChild).click();
    /** @type {InstanceType<MenuItem>} */ (menus[1].firstElementChild).click();
    command.click();

    assert.deepEqual(closeCounts.map((read) => read()), [1, 1, 1]);
    assert.deepEqual(menus.map((menu) => menu.open), [false, false, false]);
    assert.equal(document.activeElement, trigger);
  });

  it('replaces an open cascader and synchronizes both expansion states', () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=parent>
          <mdw-menu-item id=first cascades=first-submenu>First</mdw-menu-item>
          <mdw-menu-item id=second cascades=second-submenu>Second</mdw-menu-item>
        </mdw-menu>
        <mdw-menu id=first-submenu><mdw-menu-item>First nested</mdw-menu-item></mdw-menu>
        <mdw-menu id=second-submenu><mdw-menu-item>Second nested</mdw-menu-item></mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const parent = /** @type {InstanceType<Menu>} */ (container.querySelector('#parent'));
    const first = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#first'));
    const second = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#second'));
    const firstSubmenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#first-submenu'));
    const secondSubmenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#second-submenu'));

    parent.showPopup(trigger, false);
    first.click();
    second.click();

    assert.isFalse(firstSubmenu.open);
    assert.isTrue(secondSubmenu.open);
    assert.equal(first.refs.anchor.getAttribute('aria-expanded'), 'false');
    assert.equal(second.refs.anchor.getAttribute('aria-expanded'), 'true');
    secondSubmenu.close(false);
    parent.close(false);
  });

  it('resolves a replaced submenu target and rejects nested cascade decoys', () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=parent>
          <div><mdw-menu-item id=decoy cascades=submenu>Nested decoy</mdw-menu-item></div>
          <mdw-menu-item id=cascader cascades=submenu>More choices</mdw-menu-item>
        </mdw-menu>
        <mdw-menu id=submenu><mdw-menu-item>Old target</mdw-menu-item></mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const parent = /** @type {InstanceType<Menu>} */ (container.querySelector('#parent'));
    const oldSubmenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#submenu'));
    const cascader = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#cascader'));
    const decoy = /** @type {InstanceType<MenuItem>} */ (container.querySelector('#decoy'));
    const replacement = document.createElement('mdw-menu');
    replacement.id = 'submenu';
    replacement.append(document.createElement('mdw-menu-item'));
    oldSubmenu.replaceWith(replacement);

    parent.showPopup(trigger, false);
    decoy.click();
    assert.isFalse(replacement.open);

    cascader.click();
    assert.isTrue(replacement.open);
    replacement.close(false);
    parent.close(false);
  });

  it('closes submenu state after cascader removal or submenu disconnect', async () => {
    const container = html`
      <div>
        <button id=trigger>Open</button>
        <mdw-menu id=parent><mdw-menu-item cascades=submenu>More</mdw-menu-item></mdw-menu>
        <mdw-menu id=submenu><mdw-menu-item>Nested</mdw-menu-item></mdw-menu>
      </div>
    `;
    const trigger = /** @type {HTMLButtonElement} */ (container.querySelector('#trigger'));
    const parent = /** @type {InstanceType<Menu>} */ (container.querySelector('#parent'));
    const submenu = /** @type {InstanceType<Menu>} */ (container.querySelector('#submenu'));
    const cascader = /** @type {InstanceType<MenuItem>} */ (parent.firstElementChild);

    parent.showPopup(trigger, false);
    cascader.click();
    cascader.remove();
    await nextTask();

    assert.isFalse(submenu.open);
    assert.equal(cascader.refs.anchor.getAttribute('aria-expanded'), 'false');

    parent.append(cascader);
    cascader.click();
    submenu.remove();

    assert.isFalse(submenu.open);
    assert.equal(cascader.refs.anchor.getAttribute('aria-expanded'), 'false');
    parent.close(false);
  });
});
