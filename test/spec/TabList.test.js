import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Tab from '../../components/Tab.js';
import TabList from '../../components/TabList.js';
import { html } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-tab-list', () => {
  it('owns only direct tab children', () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab id=direct>Direct</mdw-tab>
        <div><mdw-tab id=nested>Nested</mdw-tab></div>
      </mdw-tab-list>
    `;
    const direct = /** @type {InstanceType<Tab>} */ (tabList.querySelector('#direct'));
    const nested = /** @type {InstanceType<Tab>} */ (tabList.querySelector('#nested'));

    assert.instanceOf(tabList, TabList);
    assert.instanceOf(direct, Tab);
    assert.deepEqual([...tabList.tabs], [direct]);
    assert.instanceOf(tabList.childTabItems, NodeList);
    assert.deepEqual([...tabList.childTabItems], [direct, nested]);
    assert.isFunction(tabList.childTabItems.forEach);
    assert.isFalse(nested.active);

    tabList.selectedIndex = 0;

    assert.isTrue(direct.active);
    assert.isFalse(nested.active);
  });

  it('exposes tablist semantics and clears invalid selection', () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab>First</mdw-tab>
        <mdw-tab>Second</mdw-tab>
      </mdw-tab-list>
    `;
    const [first, second] = tabList.tabs;

    assert.equal(tabList.readAriaProperty('role'), 'tablist');

    tabList.selectedIndex = 1;
    assert.isFalse(first.active);
    assert.isTrue(second.active);
    assert.equal(tabList._selectedIndex, 1);

    tabList.selectedIndex = 10;
    assert.isFalse(first.active);
    assert.isFalse(second.active);
    assert.equal(tabList.selectedIndex, -1);
    assert.equal(tabList._selectedIndex, -1);
    assert.isFalse(tabList.active);

    tabList.selectedItem = document.createElement('mdw-tab');
    assert.equal(tabList.selectedItem, null);
    assert.equal(tabList._selectedIndex, -1);
  });

  it('reconciles selection when the selected tab is removed', async () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab>First</mdw-tab>
        <mdw-tab>Second</mdw-tab>
      </mdw-tab-list>
    `;
    const [, second] = tabList.tabs;
    tabList.selectedIndex = 1;

    second.remove();
    await nextTask();

    assert.equal(tabList.selectedItem, null);
    assert.equal(tabList.selectedIndex, -1);
    assert.equal(tabList._selectedIndex, -1);
    assert.isFalse(tabList.active);
  });

  it('normalizes duplicate active direct tabs after topology changes', async () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab active>First</mdw-tab>
        <mdw-tab active>Second</mdw-tab>
        <div><mdw-tab active>Nested</mdw-tab></div>
      </mdw-tab-list>
    `;
    const [first, second] = tabList.tabs;
    const nested = /** @type {InstanceType<Tab>} */ (tabList.querySelector('div > mdw-tab'));
    await nextTask();

    assert.isTrue(first.active);
    assert.isFalse(second.active);
    assert.isTrue(nested.active);
    assert.equal(tabList.selectedIndex, 0);

    tabList.append(first);
    await nextTask();

    assert.deepEqual([...tabList.tabs], [second, first]);
    assert.isFalse(second.active);
    assert.isTrue(first.active);
    assert.equal(tabList.selectedIndex, 1);
  });

  it('releases and restores its external scroll listener symmetrically', () => {
    const content = document.createElement('div');
    content.id = 'panels';
    let additions = 0;
    let removals = 0;
    const addEventListener = content.addEventListener;
    const removeEventListener = content.removeEventListener;
    content.addEventListener = function addEventListenerCounter(...args) {
      if (args[0] === 'scroll') {
        additions += 1;
      }
      return addEventListener.apply(this, args);
    };
    content.removeEventListener = function removeEventListenerCounter(...args) {
      if (args[0] === 'scroll') {
        removals += 1;
      }
      return removeEventListener.apply(this, args);
    };
    Object.defineProperties(content, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
      scrollLeft: { configurable: true, writable: true, value: 100 },
    });
    document.body.append(content);

    const tabList = new TabList();
    tabList.tabContentId = 'panels';
    tabList.append(new Tab(), new Tab());
    document.body.append(tabList);

    assert.equal(additions, 1);
    tabList.tabContent = content;
    assert.equal(additions, 1);
    assert.equal(removals, 0);
    content.dispatchEvent(new Event('scroll'));
    assert.equal(tabList.selectedIndex, 1);
    assert.equal(tabList._selectedIndex, 1);

    tabList.remove();
    assert.equal(removals, 1);
    assert.isUndefined(tabList.tabContent);

    document.body.append(tabList);
    assert.equal(additions, 2);

    tabList.tabContentId = '';
    assert.equal(removals, 2);
    assert.isUndefined(tabList.tabContent);
  });

  it('replaces and clears external scroll targets with balanced listeners', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    first.id = 'panels';
    second.id = 'panels';
    const counts = new Map([[first, [0, 0]], [second, [0, 0]]]);
    for (const content of [first, second]) {
      const addEventListener = content.addEventListener;
      const removeEventListener = content.removeEventListener;
      content.addEventListener = function addEventListenerCounter(...args) {
        if (args[0] === 'scroll') {
          counts.get(content)[0] += 1;
        }
        return addEventListener.apply(this, args);
      };
      content.removeEventListener = function removeEventListenerCounter(...args) {
        if (args[0] === 'scroll') {
          counts.get(content)[1] += 1;
        }
        return removeEventListener.apply(this, args);
      };
      Object.defineProperties(content, {
        clientWidth: { configurable: true, value: 100 },
        scrollWidth: { configurable: true, value: 200 },
        scrollLeft: { configurable: true, writable: true, value: 0 },
      });
    }
    document.body.append(first);
    const tabList = html`
      <mdw-tab-list tab-content-id=panels>
        <mdw-tab>First</mdw-tab>
        <mdw-tab>Second</mdw-tab>
      </mdw-tab-list>
    `;

    first.replaceWith(second);
    tabList.searchForTabContent();
    assert.deepEqual(counts.get(first), [1, 1]);
    assert.deepEqual(counts.get(second), [1, 0]);
    assert.equal(tabList.tabContent, second);

    tabList.tabContentId = '';
    assert.deepEqual(counts.get(second), [1, 1]);
    assert.isNull(tabList._tabContentScrollListener);
  });

  for (const [rtl, scrollLeft, expectedIndex] of [
    [false, 0, 0],
    [false, 50, 1],
    [false, 100, 2],
    [true, 0, 0],
    [true, -50, 1],
    [true, -100, 2],
  ]) {
    it(`maps ${rtl ? 'RTL' : 'LTR'} scroll ${scrollLeft} to tab ${expectedIndex}`, () => {
      const content = document.createElement('div');
      Object.defineProperties(content, {
        clientWidth: { configurable: true, value: 100 },
        scrollWidth: { configurable: true, value: 200 },
        scrollLeft: { configurable: true, writable: true, value: scrollLeft },
      });
      /** @type {InstanceType<TabList>} */
      const tabList = html`
        <mdw-tab-list>
          <mdw-tab>First</mdw-tab>
          <mdw-tab>Second</mdw-tab>
          <mdw-tab>Third</mdw-tab>
        </mdw-tab-list>
      `;
      tabList._tabMetrics = [...tabList.tabs].map((tab, index) => ({
        center: 50 + (index * 100),
        index,
        label: { left: 25, width: 50 },
        left: index * 100,
        right: (index + 1) * 100,
        tab,
        width: 100,
      }));
      tabList._isRTL = rtl;
      tabList.tabContent = content;

      assert.equal(tabList.selectedIndex, expectedIndex);
      assert.equal(tabList._selectedIndex, expectedIndex);
    });
  }

  it('invalidates metrics after direct append, reorder, and removal', async () => {
    /** @type {InstanceType<TabList>} */
    const tabList = html`
      <mdw-tab-list>
        <mdw-tab>First</mdw-tab>
        <mdw-tab>Second</mdw-tab>
      </mdw-tab-list>
    `;
    const [first, second] = tabList.tabs;
    const third = new Tab();
    tabList._tabMetrics = [];
    tabList.append(third);
    await nextTask();
    assert.isNull(tabList._tabMetrics);

    tabList._tabMetrics = [];
    tabList.prepend(second);
    await nextTask();
    assert.isNull(tabList._tabMetrics);

    tabList._tabMetrics = [];
    first.remove();
    await nextTask();
    assert.isNull(tabList._tabMetrics);
    assert.deepEqual([...tabList.tabs], [second, third]);
  });
});
