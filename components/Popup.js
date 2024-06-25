import CustomElement from '../core/CustomElement.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import PopupMixin from '../mixins/PopupMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .mixin(PopupMixin)
  .observe({
    elevation: 'integer',
  })
  .css`
    :host {
      filter: var(--mdw-elevation__drop-shadow__0);

      transition: filter 200ms;
    }

    :host(:where([elevation="1"])) { filter: var(--mdw-elevation__drop-shadow__1); }
    :host(:where([elevation="2"])) { filter: var(--mdw-elevation__drop-shadow__2); }
    :host(:where([elevation="3"])) { filter: var(--mdw-elevation__drop-shadow__3); }
    :host(:where([elevation="4"])) { filter: var(--mdw-elevation__drop-shadow__4); }
    :host(:where([elevation="5"])) { filter: var(--mdw-elevation__drop-shadow__5); }
  `
  .autoRegister('mdw-popup');
