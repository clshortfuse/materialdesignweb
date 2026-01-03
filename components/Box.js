import CustomElement from '../core/CustomElement.js';
import FlexboxMixin from '../mixins/FlexboxMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Boxes are stateless elements that may have a color and ink.
 * They should have simple geometry for rendering and layout.
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexboxMixin)
  .html`<slot id=slot></slot>`
  .css`
    :host(:where([color])) {
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }

    :host(:is([color="none"],[color="transparent"])) {
      background-color: transparent;
      color: inherit;
    }
    
    :host([ink]) {
      color: rgb(var(--mdw-ink));
    }
    
    :host([type-style]) {
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }

    #slot::slotted([flex-0]) {
      flex: 0;
    }

    #slot::slotted([flex-1]) {
      flex: 1;
    }

    #slot::slotted([flex-none]) {
      flex: none;
    }
  `
  .autoRegister('mdw-box');
