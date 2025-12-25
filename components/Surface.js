import CustomElement from '../core/CustomElement.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Surface represents a themed elevated surface used to display content with
 * elevation, shape, and color tokens applied.
 * @see https://m3.material.io/styles/elevation/overview
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .html`<slot id=slot></slot>`
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;

      filter: var(--mdw-elevation__drop-shadow__0);
    
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);

      transition: filter 200ms;
    }

    :host(:where([elevation="1"])) { filter: var(--mdw-elevation__drop-shadow__1); }
    :host(:where([elevation="2"])) { filter: var(--mdw-elevation__drop-shadow__2); }
    :host(:where([elevation="3"])) { filter: var(--mdw-elevation__drop-shadow__3); }
    :host(:where([elevation="4"])) { filter: var(--mdw-elevation__drop-shadow__4); }
    :host(:where([elevation="5"])) { filter: var(--mdw-elevation__drop-shadow__5); }
  `
  .autoRegister('mdw-surface');
