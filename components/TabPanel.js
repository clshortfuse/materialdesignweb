import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

import Box from './Box.js';

export default Box
  .mixin(AriaReflectorMixin)
  .extend()
  .set({
    _ariaRole: 'tabpanel',
  })
  .observe({
    active: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        this.updateAriaProperty('ariaHidden', newValue ? 'false' : 'true');
      },
    },
    peeking: 'boolean',
  })
  .css/* css */`
    :host {
      scroll-snap-align: center;
      min-inline-size: 100%;
      max-inline-size: 100%;
      min-block-size: 100%;
      max-block-size: 100%;
      overflow-y: auto;
      will-change: visibility;

      visibility: hidden; 
    }
    :host(:is([active],[peeking])) {
      /* Safari bug: Visiblity not changing without !important or layout reflow */
      visibility: visible !important;;
    }
  `
  .autoRegister('mdw-tab-panel');
