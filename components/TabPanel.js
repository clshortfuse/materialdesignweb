import CustomElement from '../core/CustomElement.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
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
      will-change: visibility, transform;

      visibility: hidden;
    }
    :host(:is([active],[peeking])) {
      visibility: visible
    }
  `
  .html/* html */`<slot id=slot></slot>`
  .autoRegister('mdw-tab-panel');
