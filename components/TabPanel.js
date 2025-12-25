import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

import Box from './Box.js';

/**
 * TabPanel represents the content area for a single tab and updates ARIA
 * when activated.
 * @see https://m3.material.io/components/tabs/specs
 */
export default Box
  .extend()
  .mixin(AriaReflectorMixin)
  .set({
    /** ARIA role applied by the AriaReflectorMixin (defaults to `tabpanel`). */
    _ariaRole: 'tabpanel',
  })
  .observe({
    /** Whether this panel is active/visible; updates ARIA `aria-hidden`. */
    active: {
      type: 'boolean',
      /** Update `aria-hidden` when `active` changes. */
      changedCallback(oldValue, newValue) {
        this.updateAriaProperty('ariaHidden', newValue ? 'false' : 'true');
      },
    },
    /** True when the panel is partially visible (peeking). */
    peeking: 'boolean',
  })
  .css`
    :host {
      overflow-y: auto;
      scroll-snap-align: center;

      min-block-size: 100%;
      max-block-size: 100%;
      min-inline-size: 100%;
      max-inline-size: 100%;

      visibility: hidden;

      will-change: visibility; 
    }

    :host(:is([active],[peeking])) {
      /* Safari bug: Visiblity not changing without !important or layout reflow */
      visibility: inherit !important;
    }
  `
  .autoRegister('mdw-tab-panel');
