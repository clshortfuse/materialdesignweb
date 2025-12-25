import './TabList.js'; /* TabList must register before TabContent */
import CustomElement from '../core/CustomElement.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';

import TabPanel from './TabPanel.js';

/**
 * Tab content hosts tab panels and manages which panel is visible based on
 * scroll position or selected tab.
 * @see https://m3.material.io/components/tabs/specs
 */
export default CustomElement
  .extend()
  .mixin(ResizeObserverMixin)
  .set({
    /**
     * Internal list of `TabPanel` nodes currently assigned to the slot.
     * @type {InstanceType<TabPanel>[]}
     */
    _panelNodes: [],
    /**
     * Cached metrics for each panel used to determine visibility and
     * which panel is active based on scroll position. Each entry contains
     * `{ left, width, right, center, index }` in pixels.
     * @type {{left:number,width:number,right:number,center:number,index:number}[]|null}
     */
    _panelMetrics: null,
  })
  .observe({
    /**
     * Internal index of the currently selected panel. `-1` when none.
     * This is maintained alongside panel `active` states.
     */
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
    /**
     * Modifiable index of the currently-selected panel. 0-based index.
     * Setting this updates panel `active` states accordingly.
     */
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
    /**
     * Modifiable currently selected panel.
     * Setting this updates panel `active` states accordingly.
     */
    selectedPanel: {
      /** @return {InstanceType<TabPanel>|undefined} */
      get() {
        return this.panels.find((panel) => panel.active);
      },
      /**
       * @param {InstanceType<TabPanel>} value
       * @return {InstanceType<TabPanel>|null}
       */
      set(value) {
        const index = this.panels.indexOf(value);
        if (index === -1) return null;
        this.selectedIndex = index;
        return value;
      },
    },
  })
  .html`<slot id=slot></slot>`
  .methods({
    /** Called when the component observes a resize; clears cached metrics. */
    onResizeObserved() {
      this._panelMetrics = null;
      this.updatePanels();
      // Resize should not change panel visibility (Chrome Bug?)
    },
    /**
     * Recompute which panels are visible based on scroll position and
     * activate the panel whose visible percentage is >= 50%.
     */
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
  .childEvents({
    slot: {
      slotchange(event) {
        const slot = /** @type {HTMLSlotElement} */ (event.currentTarget);
        // @ts-ignore Skip cast
        this._panelNodes = slot.assignedElements()
          .filter((el) => el.tagName === TabPanel.elementName.toUpperCase());
        this._panelMetrics = null;
        this.updatePanels();
      },
    },
  })
  .events({
    scroll: 'updatePanels',
  })
  .css`
    :host {
      display: grid;
      grid-auto-columns: 100%;
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

      will-change: transform; /* Avoid repaint on scroll */
    }
  `
  .autoRegister('mdw-tab-content');
