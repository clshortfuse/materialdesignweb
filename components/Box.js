import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Containers are stateless elements that may have a color and ink.
 * They should have simple geometry for rendering and layout.
 */
export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .extend()
  .observe({
    inline: 'boolean',
    block: {
      type: 'boolean',
      empty: true,
    },
  })
  .css`
    :host {
      display: block;
    }
    
    :host([inline]) {
      display: inline-block;
    }
    
    :host([flex]:where([inline])) {
      display: inline-flex;
    }
    
    :host([color]) {
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }
    
    :host([ink]) {
      color: rgb(var(--mdw-ink));
    }
    
    :host([type-style]) {
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }
    
    #slot {
      /* Passthrough from parent */
      block-size: inherit;
      inline-size: inherit;
    }
  `
  .html/* html */`<slot id=slot type-style={typeStyle}></slot>`
  .autoRegister('mdw-box');
