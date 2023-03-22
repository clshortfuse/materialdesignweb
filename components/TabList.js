// https://w3c.github.io/aria/#tablist

import CustomElement from '../core/CustomElement.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import RTLObserverMixin from '../mixins/RTLObserverMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import Tab from './Tab.js';
import styles from './TabList.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(KeyboardNavMixin)
  .mixin(ResizeObserverMixin)
  .mixin(RTLObserverMixin)
  .mixin(ShapeMixin)
  .extend()
  .set({
    /** @type {WeakRef<HTMLElement>} */
    _tabContentRef: null,
    _tabContentScrollListener: null,
    /** @type {HTMLCollectionOf<InstanceType<Tab>>} */
    _tabCollection: null,
    /**
     * @type {{
     *  left:number,
     *  width:number,
     *  right:number,
     *  center: number,
     *  label: {left:number, width:number},
     *  index: number,
     * }[]}
     */
    _tabMetrics: null,
    _isRTL: null,
  })
  .define({
    tabContent: {
      get() {
        return this._tabContentRef?.deref();
      },
      /** @param {HTMLElement} value  */
      set(value) {
        const oldValue = this._tabContentRef?.deref();
        if (oldValue) {
          oldValue.removeEventListener('scroll', this._tabContentScrollListener);
        }
        if (value) {
          this._tabContentRef = new WeakRef(value);
          this._tabContentScrollListener = this.observeTabContent.bind(this);
          value.addEventListener('scroll', this._tabContentScrollListener);
          this.observeTabContent();
        } else {
          this._tabContentRef = null;
        }
      },
    },
  })
  .observe({
    tabContentId: {
      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      changedCallback(oldValue, newValue) {
        // @ts-ignore Skip cast
        this.tabContent = newValue ? document.getElementById(newValue) : null;
      },
    },
    active: 'boolean',
    secondary: 'boolean',
    _indicatorStyle: { value: 'opacity: 0' },
    color: { empty: 'surface-primary' },
  })
  .define({
    tabs() {
      // eslint-disable-next-line no-return-assign
      return this._tabCollection ??= /** @type {HTMLCollectionOf<InstanceType<Tab>>} */ (
        this.getElementsByTagName(Tab.elementName)
      );
    },
  })
  .observe({
    /** Internal observed property */
    _selectedIndex: {
      type: 'integer',
      empty: -1,
      /**
       * @param {number} oldValue
       * @param {number} newValue
       */
      changedCallback(oldValue, newValue) {
        this.active = newValue !== -1;
      },
    },
  })
  .define({
    kbdNavQuery() {
      return Tab.elementName;
    },
    ariaOrientationDefault() {
      return /** @type {'horizontal'|'vertical'} */ ('horizontal');
    },
    /** @return {NodeListOf<InstanceType<Tab>>} */
    childTabItems() {
      return (this.querySelectorAll(Tab.elementName));
    },
    tabMetrics() {
      // eslint-disable-next-line no-return-assign
      return this._tabMetrics ??= [...this.tabs].map((tab, index) => ({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        right: tab.offsetLeft + tab.offsetWidth,
        center: tab.offsetLeft + (tab.offsetWidth / 2),
        label: tab.labelMetrics,
        index,
      }));
    },
    selectedIndex: {
      get() {
        let index = 0;
        for (const tab of this.tabs) {
          if (tab.active) return index;
          index++;
        }
        return -1;
      },
      set(value) {
        let index = 0;
        for (const el of this.tabs) {
          if (index === value) {
            el.active = true;
            this._selectedIndex = index;
          } else {
            el.active = false;
          }
          index++;
        }
      },
    },
  })
  .define({
    selectedItem: {
      /**
       * @return {InstanceType<Tab>}
       */
      get() {
        for (const tab of this.tabs) {
          if (tab.active) return tab;
        }
        return null;
      },
      /**
       * @param {InstanceType<Tab>} value
       * @return {InstanceType<Tab>}
       */
      set(value) {
        let index = 0;
        for (const tab of this.tabs) {
          if (tab === value) {
            this.selectedIndex = index;
            return value;
          }
          index++;
        }
        return null;
      },
    },
  })
  .methods({
    clearCache() {
      this._tabMetrics = null;
    },
    /** @param {InstanceType<Tab>} [tab] */
    updateIndicatorByTab(tab) {
      tab ??= this.selectedItem ?? this.tabs.item(0);

      const width = this.secondary ? tab.clientWidth : tab.labelMetrics.width;
      const position = this.secondary ? tab.offsetLeft : tab.offsetLeft + tab.labelMetrics.left;
      this._indicatorStyle = `--width: ${width}; --offset: ${position}px`;
    },
    updateIndicator(animate = false) {
      this.updateIndicatorByTab();
      if (!animate) {
        this.refs.indicator.style.setProperty('--transition-ratio', '0');
      }
    },
    /** @param {number} percentage */
    updateIndicatorByPosition(percentage) {
      const metrics = this.tabMetrics;

      // Tab panels are equal-width whereas tablist may be variable

      const clamped = Math.min(Math.max(percentage, 0), 1);
      const decimalIndex = (metrics.length - 1) * clamped;
      const leftIndex = Math.floor(decimalIndex);
      const rightIndex = Math.ceil(decimalIndex);

      const leftMetrics = metrics[leftIndex];
      if (!leftMetrics) return;

      const rightMetrics = metrics[rightIndex];

      let width;
      let activeTab;
      /** Center-based position */
      let center;
      if (leftMetrics === rightMetrics) {
        width = this.secondary ? leftMetrics.width : leftMetrics.label.width;
        activeTab = this.tabs.item(leftIndex);
        center = leftMetrics.center;
      } else {
        const leftRatio = 1 - (decimalIndex - leftIndex);
        const rightRatio = 1 - leftRatio;
        const leftWidth = leftRatio * (this.secondary ? leftMetrics.width : leftMetrics.label.width);
        const rightWidth = rightRatio * (this.secondary ? rightMetrics.width : rightMetrics.label.width);
        const activeIndex = leftRatio > rightRatio ? leftIndex : rightIndex;
        const distance = rightMetrics.center - leftMetrics.center;
        width = leftWidth + rightWidth;
        activeTab = this.tabs.item(activeIndex);
        center = leftMetrics.center + (distance * rightRatio);
      }

      if (!activeTab.active) {
        for (const tab of this.tabs) {
          tab.active = tab === activeTab;
        }
        this.active = true;
      }

      this._indicatorStyle = `--width: ${width}; --offset: ${center - (width / 2)}px`;
      this.refs.indicator.style.setProperty('--transition-ratio', '0');
    },
    /** @param {number} index */
    updateIndicatorByIndex(index) {
      this.updateIndicatorByTab(this.tabs.item(index ?? this._selectedIndex));
    },
    observeTabContent() {
      const tabContent = this.tabContent;
      if (!tabContent) return;
      let start = tabContent.scrollLeft;
      if (this.pageIsRTL) {
        start *= -1;
      }
      const width = tabContent.clientWidth;
      const max = tabContent.scrollWidth - width;
      const percentage = max === 0 ? 0 : start / max;
      this.updateIndicatorByPosition(percentage);
    },
    onResizeObserved() {
      this.clearCache();
      this.updateIndicator();
    },
  })

  .set({
    ariaRole: 'tablist',
  })
  .css(styles)
  .html/* html */`
    <slot id=slot ink={ink} type-style={typeStyle}></slot>
    <div id=indicator aria-hidden=true style={_indicatorStyle} active={active} secondary={secondary}>
      <div id=indicator-start class=indicator-piece></div>
      <div id=indicator-center class=indicator-piece></div>
      <div id=indicator-end class=indicator-piece></div>
    </div>
  `
  .on({
    composed() {
      const { shape, indicator } = this.refs;
      shape.append(indicator);
    },
    pageIsRTLChanged() {
      this.clearCache();
      this.updateIndicator();
    },
    activeChanged(oldValue, newValue) {
      if (newValue) {
        // Update indicator position without transition
        this.updateIndicator();
      }
    },
    secondaryChanged() {
      this.updateIndicator();
    },
    _selectedIndexChanged(oldValue, newValue) {
      this.updateIndicatorByIndex(newValue);
    },
  })
  .events({
    '~click'({ target }) {
      // Abort if not child
      if (target === this) return;
      if (target instanceof Tab) {
        // TODO: Override colors from scroll events
      }
    },
  })
  .childEvents({
    slot: {
      slotchange() {
        this.clearCache();
        this.updateIndicator();
      },
    },
  })
  .autoRegister('mdw-tab-list');
