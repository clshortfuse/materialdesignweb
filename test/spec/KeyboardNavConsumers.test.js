import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import List from '../../components/List.js';
import ListItem from '../../components/ListItem.js';
import ListOption from '../../components/ListOption.js';
import ListTree from '../../components/ListTree.js';
import Listbox from '../../components/Listbox.js';
import Menu from '../../components/Menu.js';
import MenuItem from '../../components/MenuItem.js';
import SegmentedButton from '../../components/SegmentedButton.js';
import SegmentedButtonGroup from '../../components/SegmentedButtonGroup.js';
import Tab from '../../components/Tab.js';
import TabList from '../../components/TabList.js';
import TopAppBar from '../../components/TopAppBar.js';
import { html, makeFromString } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** @param {HTMLElement} target @param {string} key @return {KeyboardEvent} */
function dispatchKeydown(target, key) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    composed: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
}

describe('keyboard navigation lifecycle consumers', () => {
  it('exposes List direct targets without constructing an array', async () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-option tabindex=0 value=first>First</mdw-list-option>
        <mdw-list-option tabindex=0 value=second>Second</mdw-list-option>
      </mdw-list>
    `;
    await nextTask();
    const [first, second] = /** @type {InstanceType<ListOption>[]} */ ([...list.children]);

    assert.instanceOf(list, List);
    assert.instanceOf(first, ListOption);
    const order = list.getKbdNavChildren();
    assert.isFalse(Array.isArray(order));
    assert.deepEqual([...order], [first, second]);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
  });

  it('reconciles List targets inserted after connection', async () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-option value=first>First</mdw-list-option>
      </mdw-list>
    `;
    await nextTask();
    const first = /** @type {InstanceType<ListOption>} */ (list.firstElementChild);
    const second = /** @type {InstanceType<ListOption>} */ (
      makeFromString('<mdw-list-option tabindex=3 value=second>Second</mdw-list-option>', false)
    );

    list.append(second);
    await nextTask();

    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
    assert.isTrue(list._kbdManagedTabIndexes.has(second));

    second.remove();
    await nextTask();

    assert.equal(second.getAttribute('tabindex'), '3');
    assert.isFalse(list._kbdManagedTabIndexes.has(second));
  });

  it('reconciles nested tree topology from the owning ListTree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item id=parent expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item id=first tabindex=3>First</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.querySelector('#parent'));
    const group = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('mdw-list-tree')
    );
    const first = /** @type {InstanceType<ListItem>} */ (list.querySelector('#first'));

    assert.instanceOf(list, ListTree);
    assert.instanceOf(parent, ListItem);
    const second = /** @type {InstanceType<ListItem>} */ (
      makeFromString('<mdw-list-item tabindex=4>Second</mdw-list-item>', false)
    );
    group.append(second);
    await nextTask();

    assert.equal(second.tabIndex, -1);
    assert.isTrue(list._kbdManagedTabIndexes.has(second));

    first.remove();
    await nextTask();

    assert.equal(first.tabIndex, 3);
    assert.isFalse(list._kbdManagedTabIndexes.has(first));

    let orderReads = 0;
    const getKbdNavChildren = list.getKbdNavChildren;
    list.getKbdNavChildren = function getKbdNavChildrenCounter() {
      orderReads += 1;
      return getKbdNavChildren.call(this);
    };
    second.focus();
    const event = dispatchKeydown(second, 'ArrowLeft');

    assert.isTrue(event.defaultPrevented);
    assert.equal(document.activeElement, parent);
    assert.equal(orderReads, 0);
  });

  it('stops nested ListTree readiness forwarding at an independent tree owner', async () => {
    /** @type {InstanceType<ListTree>} */
    const outer = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Outer item
          <mdw-list-tree id=independent>
            <mdw-list-item expanded>
              Independent parent
              <mdw-list-tree id=group slot=expansion>
                <mdw-list-item id=first>First</mdw-list-item>
              </mdw-list-tree>
            </mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const independent = /** @type {InstanceType<ListTree>} */ (
      outer.querySelector('#independent')
    );
    const group = /** @type {InstanceType<ListTree>} */ (outer.querySelector('#group'));
    const independentParent = /** @type {InstanceType<ListItem>} */ (
      independent.firstElementChild
    );
    const first = /** @type {InstanceType<ListItem>} */ (group.firstElementChild);
    const second = /** @type {InstanceType<ListItem>} */ (
      makeFromString('<mdw-list-item>Second</mdw-list-item>', false)
    );
    const refreshTabIndexes = outer.refreshTabIndexes;
    let outerRefreshes = 0;
    outer.refreshTabIndexes = function refreshTabIndexesCounter() {
      outerRefreshes += 1;
      return refreshTabIndexes.call(this);
    };

    group.append(second);
    await nextTask();

    const order = [...independent.getKbdNavChildren()];
    assert.equal(outerRefreshes, 0);
    assert.equal(order.length, 3);
    assert.strictEqual(order[0], independentParent);
    assert.strictEqual(order[1], first);
    assert.strictEqual(order[2], second);
    assert.isTrue(independent._kbdManagedTabIndexes.has(second));
  });

  it('does not forward direct readiness from an independent nested tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const outer = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Outer item
          <mdw-list-tree id=independent>
            <mdw-list-item>Independent item</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const independent = /** @type {InstanceType<ListTree>} */ (
      outer.querySelector('#independent')
    );
    const added = /** @type {InstanceType<ListItem>} */ (
      makeFromString('<mdw-list-item>Added</mdw-list-item>', false)
    );
    const refreshTabIndexes = outer.refreshTabIndexes;
    let outerRefreshes = 0;
    outer.refreshTabIndexes = function refreshTabIndexesCounter() {
      outerRefreshes += 1;
      return refreshTabIndexes.call(this);
    };

    independent.append(added);
    await nextTask();

    assert.equal(outerRefreshes, 0);
    assert.isTrue(independent._kbdManagedTabIndexes.has(added));
  });

  it('delivers detached slotchange without re-managing List targets', async () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-option tabindex=3 value=first>First</mdw-list-option>
      </mdw-list>
    `;
    await nextTask();
    const first = /** @type {InstanceType<ListOption>} */ (list.firstElementChild);
    const second = /** @type {InstanceType<ListOption>} */ (
      makeFromString('<mdw-list-option value=second>Second</mdw-list-option>', false)
    );
    const secondTabIndex = second.getAttribute('tabindex');

    list.remove();
    await nextTask();
    list.append(second);
    await nextTask();

    assert.equal(first.getAttribute('tabindex'), '3');
    assert.equal(second.getAttribute('tabindex'), secondTabIndex);
    assert.equal(list._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(list._kbdTabStop);
  });

  it('lets Menu reconcile direct target readiness from its owned slot', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item>First</mdw-menu-item>
        <mdw-menu-item>Second</mdw-menu-item>
        <mdw-menu-item>Third</mdw-menu-item>
      </mdw-menu>
    `;
    await nextTask();
    const items = [...menu.children];

    assert.instanceOf(menu, Menu);
    assert.instanceOf(items[0], MenuItem);
    assert.deepEqual(items.map((item) => item.tabIndex), [0, -1, -1]);
  });

  it('enters Menu at its first direct item', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item>First</mdw-menu-item>
        <mdw-menu-item>Second</mdw-menu-item>
      </mdw-menu>
    `;
    await nextTask();
    const [first, second] = /** @type {InstanceType<MenuItem>[]} */ ([...menu.children]);
    const trigger = document.createElement('button');
    document.body.append(trigger);
    menu.useHistory = false;
    menu.showPopup(trigger, false);

    second.focus();
    menu.close(false);
    await nextTask();
    menu.showPopup(trigger, true);

    assert.isTrue(document.activeElement === first);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
  });

  it('delivers detached slotchange without re-managing Menu targets', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item tabindex=3>Authored</mdw-menu-item>
      </mdw-menu>
    `;
    await nextTask();
    const authored = /** @type {InstanceType<MenuItem>} */ (menu.firstElementChild);
    const added = /** @type {InstanceType<MenuItem>} */ (
      makeFromString('<mdw-menu-item>Added</mdw-menu-item>', false)
    );

    menu.remove();
    await nextTask();
    let slotChanges = 0;
    let connectedAtDelivery = true;
    menu.refs.slot.addEventListener('slotchange', () => {
      slotChanges += 1;
      connectedAtDelivery = menu.isConnected;
    }, { once: true });

    menu.append(added);
    await nextTask();

    assert.equal(slotChanges, 1);
    assert.isFalse(connectedAtDelivery);
    assert.equal(authored.getAttribute('tabindex'), '3');
    assert.equal(menu._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(menu._kbdTabStop);
  });

  it('delivers detached slotchange without re-managing TopAppBar targets', async () => {
    /** @type {InstanceType<TopAppBar>} */
    const appBar = html`
      <mdw-top-app-bar>
        <button slot=leading tabindex=3>Authored</button>
      </mdw-top-app-bar>
    `;
    await nextTask();
    const authored = /** @type {HTMLButtonElement} */ (appBar.firstElementChild);
    const added = document.createElement('button');
    added.slot = 'leading';

    assert.instanceOf(appBar, TopAppBar);
    assert.equal(authored.tabIndex, 0);

    appBar.remove();
    await nextTask();
    let slotChanges = 0;
    let connectedAtDelivery = true;
    appBar.refs.leading.addEventListener('slotchange', () => {
      slotChanges += 1;
      connectedAtDelivery = appBar.isConnected;
    }, { once: true });

    appBar.append(added);
    await nextTask();

    assert.equal(slotChanges, 1);
    assert.isFalse(connectedAtDelivery);
    assert.equal(authored.getAttribute('tabindex'), '3');
    assert.isFalse(added.hasAttribute('tabindex'));
    assert.equal(appBar._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(appBar._kbdTabStop);
  });

  it('reconciles TopAppBar targets inserted into the companion slot', async () => {
    /** @type {InstanceType<TopAppBar>} */
    const appBar = html`<mdw-top-app-bar size=medium></mdw-top-app-bar>`;
    await nextTask();
    const companion = document.createElement('button');
    companion.slot = 'companion';
    companion.tabIndex = 3;

    appBar.append(companion);
    await nextTask();

    assert.equal(companion.tabIndex, 0);
    assert.isTrue(appBar._kbdManagedTabIndexes.has(companion));
    assert.strictEqual(appBar._kbdTabStop, companion);
  });

  it('restores and re-manages Menu items across conditional slotting', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item id=first>First</mdw-menu-item>
        <mdw-menu-item id=conditional tabindex=3>Conditional</mdw-menu-item>
      </mdw-menu>
    `;
    await nextTask();
    const first = /** @type {InstanceType<MenuItem>} */ (menu.querySelector('#first'));
    const conditional = /** @type {InstanceType<MenuItem>} */ (
      menu.querySelector('#conditional')
    );

    assert.deepEqual([first.tabIndex, conditional.tabIndex], [0, -1]);
    assert.isTrue(menu._kbdManagedTabIndexes.has(conditional));

    conditional.remove();
    await nextTask();

    assert.equal(conditional.getAttribute('tabindex'), '3');
    assert.isFalse(menu._kbdManagedTabIndexes.has(conditional));

    menu.append(conditional);
    await nextTask();

    assert.deepEqual([...menu.kbdNavChildren], [first, conditional]);
    assert.deepEqual([first.tabIndex, conditional.tabIndex], [0, -1]);
    assert.isTrue(menu._kbdManagedTabIndexes.has(conditional));
  });

  it('keeps nested Menu items owned by their direct submenu', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item id=direct>Direct</mdw-menu-item>
        <mdw-menu id=submenu>
          <mdw-menu-item id=nested>Nested</mdw-menu-item>
        </mdw-menu>
      </mdw-menu>
    `;
    await nextTask();
    const direct = /** @type {InstanceType<MenuItem>} */ (menu.querySelector('#direct'));
    const submenu = /** @type {InstanceType<Menu>} */ (menu.querySelector('#submenu'));
    const nested = /** @type {InstanceType<MenuItem>} */ (menu.querySelector('#nested'));

    assert.deepEqual([...menu.kbdNavChildren], [direct]);
    assert.deepEqual([...submenu.kbdNavChildren], [nested]);
    assert.equal(direct.tabIndex, 0);
    assert.equal(nested.tabIndex, 0);
  });

  it('ignores wrapped Menu items outside direct ownership', async () => {
    /** @type {InstanceType<Menu>} */
    const menu = html`
      <mdw-menu>
        <mdw-menu-item id=first>First</mdw-menu-item>
        <div role=group>
          <mdw-menu-item id=wrapped tabindex=3>Wrapped</mdw-menu-item>
        </div>
        <mdw-menu-item id=second>Second</mdw-menu-item>
      </mdw-menu>
    `;
    await nextTask();
    const first = /** @type {InstanceType<MenuItem>} */ (menu.querySelector('#first'));
    const wrapped = /** @type {InstanceType<MenuItem>} */ (menu.querySelector('#wrapped'));
    const second = /** @type {InstanceType<MenuItem>} */ (menu.querySelector('#second'));

    assert.deepEqual([...menu.kbdNavChildren], [first, second]);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
    assert.equal(wrapped.getAttribute('tabindex'), '3');
    assert.isFalse(menu._kbdManagedTabIndexes.has(wrapped));
  });

  it('focuses disabled segmented buttons that retain focus behavior', async () => {
    /** @type {InstanceType<SegmentedButtonGroup>} */
    const group = html`
      <mdw-segmented-button-group>
        <mdw-segmented-button id=first>First</mdw-segmented-button>
        <mdw-segmented-button id=disabled disabled>Disabled</mdw-segmented-button>
        <mdw-segmented-button>Third</mdw-segmented-button>
      </mdw-segmented-button-group>
    `;
    await nextTask();
    const first = /** @type {InstanceType<SegmentedButton>} */ (group.querySelector('#first'));
    const disabled = /** @type {InstanceType<SegmentedButton>} */ (
      group.querySelector('#disabled')
    );

    assert.instanceOf(group, SegmentedButtonGroup);
    assert.instanceOf(first, SegmentedButton);
    first.focus();
    const event = dispatchKeydown(first, 'ArrowRight');

    assert.isTrue(event.defaultPrevented);
    assert.equal(document.activeElement, disabled);
    assert.isTrue(disabled.refs.control.matches(':focus'));
    assert.equal(disabled.tabIndex, 0);
    assert.equal(first.tabIndex, -1);
  });

  it('delivers detached slotchange without re-managing segmented buttons', async () => {
    /** @type {InstanceType<SegmentedButtonGroup>} */
    const group = html`
      <mdw-segmented-button-group>
        <mdw-segmented-button tabindex=3>First</mdw-segmented-button>
      </mdw-segmented-button-group>
    `;
    await nextTask();
    const first = /** @type {InstanceType<SegmentedButton>} */ (group.firstElementChild);
    const second = /** @type {InstanceType<SegmentedButton>} */ (
      makeFromString('<mdw-segmented-button>Second</mdw-segmented-button>', false)
    );
    const secondTabIndex = second.getAttribute('tabindex');

    group.remove();
    await nextTask();
    group.append(second);
    await nextTask();

    assert.equal(first.getAttribute('tabindex'), '3');
    assert.equal(second.getAttribute('tabindex'), secondTabIndex);
    assert.equal(group._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(group._kbdTabStop);
  });

  it('uses a focusable disabled listbox option as the initial tab stop', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox size=2>
        <mdw-list-option id=disabled disabled value=unavailable>Unavailable</mdw-list-option>
        <mdw-list-option id=available value=available>Available</mdw-list-option>
      </mdw-listbox>
    `;
    await nextTask();
    const disabled = /** @type {InstanceType<ListOption>} */ (listbox.querySelector('#disabled'));
    const available = /** @type {InstanceType<ListOption>} */ (
      listbox.querySelector('#available')
    );

    assert.instanceOf(listbox, Listbox);
    assert.equal(disabled.tabIndex, 0);
    assert.equal(available.tabIndex, -1);

    listbox.focus();

    assert.equal(document.activeElement, disabled);
    assert.isTrue(disabled.refs.anchor.matches(':focus'));
    assert.isFalse(disabled.selected);
    assert.equal(listbox.selectedIndex, -1);
  });

  it('focuses disabled listbox options without selecting them', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox size=3>
        <mdw-list-option id=first value=alpha>Alpha</mdw-list-option>
        <mdw-list-option id=disabled disabled value=beta>Beta</mdw-list-option>
        <mdw-list-option value=gamma>Gamma</mdw-list-option>
      </mdw-listbox>
    `;
    await nextTask();
    const first = /** @type {InstanceType<ListOption>} */ (listbox.querySelector('#first'));
    const disabled = /** @type {InstanceType<ListOption>} */ (listbox.querySelector('#disabled'));

    first.focus();
    const event = dispatchKeydown(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.equal(document.activeElement, disabled);
    assert.isTrue(disabled.refs.anchor.matches(':focus'));
    assert.equal(disabled.tabIndex, 0);
    assert.isFalse(disabled.selected);
    assert.equal(listbox.selectedIndex, -1);
  });

  it('ignores wrapped Listbox options outside direct ownership', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option id=first value=alpha>Alpha</mdw-list-option>
        <div role=group>
          <mdw-list-option id=wrapped tabindex=3 value=wrapped>Wrapped</mdw-list-option>
        </div>
        <mdw-list-option id=second value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    await nextTask();
    const first = /** @type {InstanceType<ListOption>} */ (listbox.querySelector('#first'));
    const wrapped = /** @type {InstanceType<ListOption>} */ (
      listbox.querySelector('#wrapped')
    );
    const second = /** @type {InstanceType<ListOption>} */ (listbox.querySelector('#second'));

    assert.deepEqual([...listbox.kbdNavChildren], [first, second]);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
    assert.equal(wrapped.getAttribute('tabindex'), '3');
    assert.isFalse(listbox._kbdManagedTabIndexes.has(wrapped));

    first.focus();
    const event = dispatchKeydown(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(document.activeElement, second);
  });

  it('reconciles Listbox direct topology once per slot change', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option>First</mdw-list-option>
      </mdw-listbox>
    `;
    await nextTask();
    const refreshTabIndexes = listbox.refreshTabIndexes;
    let refreshes = 0;
    listbox.refreshTabIndexes = function refreshTabIndexesCounter() {
      refreshes += 1;
      return refreshTabIndexes.call(this);
    };

    listbox.append(new ListOption());
    await nextTask();

    assert.equal(refreshes, 1);
  });

  it('preserves Listbox option reconciliation across detached slotchange', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option id=first tabindex=3 value=first>First</mdw-list-option>
      </mdw-listbox>
    `;
    await nextTask();
    const first = /** @type {InstanceType<ListOption>} */ (listbox.querySelector('#first'));
    const second = /** @type {InstanceType<ListOption>} */ (
      makeFromString('<mdw-list-option value=second>Second</mdw-list-option>', false)
    );
    const secondTabIndex = second.getAttribute('tabindex');

    listbox.remove();
    listbox.append(second);
    await nextTask();

    assert.equal(first.getAttribute('tabindex'), '3');
    assert.equal(second.getAttribute('tabindex'), secondTabIndex);
    assert.equal(listbox._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(listbox._kbdTabStop);

    document.body.append(listbox);

    assert.equal(first._index, 0);
    assert.equal(second._index, 1);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
  });

  it('retains TabList slot reconciliation without shared timing', async () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab>First</mdw-tab>
        <mdw-tab>Second</mdw-tab>
        <mdw-tab>Third</mdw-tab>
      </mdw-tab-list>
    `;
    await nextTask();
    const tabs = [...tabList.children];

    assert.instanceOf(tabList, TabList);
    assert.instanceOf(tabs[0], Tab);
    assert.deepEqual(tabs.map((tab) => tab.tabIndex), [0, -1, -1]);
  });

  it('preserves TabList cache reconciliation across detached slotchange', async () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab id=first tabindex=3>First</mdw-tab>
      </mdw-tab-list>
    `;
    await nextTask();
    const first = /** @type {InstanceType<Tab>} */ (tabList.querySelector('#first'));
    assert.equal(tabList.tabMetrics.length, 1);
    const second = /** @type {InstanceType<Tab>} */ (
      makeFromString('<mdw-tab>Second</mdw-tab>', false)
    );
    const secondTabIndex = second.getAttribute('tabindex');

    tabList.remove();
    tabList.append(second);
    await nextTask();

    assert.equal(first.getAttribute('tabindex'), '3');
    assert.equal(second.getAttribute('tabindex'), secondTabIndex);
    assert.equal(tabList._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(tabList._kbdTabStop);

    document.body.append(tabList);

    assert.equal(tabList.tabMetrics.length, 2);
    assert.strictEqual(tabList.tabMetrics[0].tab, first);
    assert.strictEqual(tabList.tabMetrics[1].tab, second);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
  });

  it('ignores wrapped tabs outside direct TabList ownership', async () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab id=first>First</mdw-tab>
        <div>
          <mdw-tab id=wrapped tabindex=3>Wrapped</mdw-tab>
        </div>
        <mdw-tab id=second>Second</mdw-tab>
      </mdw-tab-list>
    `;
    await nextTask();
    const first = /** @type {InstanceType<Tab>} */ (tabList.querySelector('#first'));
    const wrapped = /** @type {InstanceType<Tab>} */ (tabList.querySelector('#wrapped'));
    const second = /** @type {InstanceType<Tab>} */ (tabList.querySelector('#second'));

    assert.deepEqual([...tabList.kbdNavChildren], [first, second]);
    assert.deepEqual([first.tabIndex, second.tabIndex], [0, -1]);
    assert.equal(wrapped.getAttribute('tabindex'), '3');
    assert.isFalse(tabList._kbdManagedTabIndexes.has(wrapped));
  });
});
