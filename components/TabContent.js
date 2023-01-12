import './TabList.js'; /* TabList must register before TabContent */
import CustomElement from '../core/CustomElement.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';

import TabPanel from './TabPanel.js';

export default CustomElement
  .mixin(ResizeObserverMixin)
  .extend()
  .css/* css */`
    :host {
      display: grid;
      grid-auto-columns: 100%;
      grid-auto-columns: 100%;
      grid-auto-flow: column;
      grid-auto-flow: column;
      grid-template-columns: 100%;
      overflow-x: auto;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      flex-grow: 1;
      -webkit-scroll-snap-type-x: mandatory;
      scroll-snap-type-x: mandatory;
      -webkit-scroll-snap-points-x: repeat(100%);
      scroll-snap-points-x: repeat(100%);
      overscroll-behavior-x: none;
    }
  `
  .set({
    /** @type {InstanceType<TabPanel>[]} */
    _panelNodes: [],
    /**
     * @type {{
     *  left:number,
     *  width:number,
     *  right:number,
     *  center: number,
     *  index: number,
     * }[]}
     */
    _panelMetrics: null,
  })
  .observe({
    /** Internal observed property */
    _selectedIndex: {
      type: 'integer',
      empty: -1,
    },
  })
  .define({
    panels() {
      return this._panelNodes;
    },
    panelMetrics() {
      // eslint-disable-next-line no-return-assign
      return this._panelMetrics ??= [...this._panelNodes].map((panel, index) => ({
        left: panel.offsetLeft,
        width: panel.offsetWidth,
        right: panel.offsetLeft + panel.offsetWidth,
        center: panel.offsetLeft + (panel.offsetWidth / 2),
        index,
      }));
    },
  })
  .define({
    selectedIndex: {
      get() {
        let index = 0;
        for (const panel of this.panels) {
          if (panel.active) return index;
          index++;
        }
        return -1;
      },
      set(value) {
        let index = 0;
        for (const el of this.panels) {
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
    selectedPanel: {
    /**
     * @return {InstanceType<TabPanel>}
     */
      get() {
        return this.panels.find((panel) => panel.active);
      },
      /**
       * @param {InstanceType<TabPanel>} value
       * @return {InstanceType<TabPanel>}
       */
      set(value) {
        const index = this.panels.indexOf(value);
        if (index === -1) return null;
        this.selectedIndex = index;
        return value;
      },
    },
  })
  .html/* css */`<slot id=slot />`
  .methods({
    onResizeObserved() {
      this._panelMetrics = null;
      // Resize should not change panel visibility
    },
    updatePanels() {
      const start = this.scrollLeft;
      const width = this.clientWidth;
      const end = start + width;
      for (const metric of this.panelMetrics) {
        const visibleWidth = (start > metric.right) || (end < metric.left) // Offscreen ?
          ? 0
          : (
            (start >= metric.left) // Scroll at or over panel left point?
              ? metric.right - start // Measure from panel right
              : end - metric.left // Measure from panel left
          );
        const percentage = visibleWidth / width;
        const panel = this.panels[metric.index];
        panel.active = percentage >= 0.5;
        // TODO: Investigate possible subpixel imprecision
        panel.peeking = percentage > 0 && percentage < 0.5;
      }
    },
  })
  .events('#slot', {
    slotchange(event) {
      const slot = /** @type {HTMLSlotElement} */ (event.currentTarget);
      // @ts-ignore Skip cast
      this._panelNodes = slot.assignedElements()
        .filter((el) => el.tagName === TabPanel.elementName.toUpperCase());
      this.updatePanels();
    },
  })
  .events({
    scroll: 'updatePanels',
  })
  .autoRegister('mdw-tab-content');
