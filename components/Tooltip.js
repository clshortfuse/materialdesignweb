import CustomElement from '../core/CustomElement.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/* https://m3.material.io/components/tooltips/specs */

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .mixin(AriaReflectorMixin)
  .set({
    _ariaRole: 'tooltip',
  })
  .observe({
    open: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        this.updateAriaProperty('ariaHidden', newValue ? 'true' : 'false');
      },
    },
  })
  .html`
    <div id=hover-target></div>
    <slot id=slot></slot>
    `
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__extra-small);
      --mdw-ink: var(--mdw-color__inverse-on-surface);
      --mdw-bg: var(--mdw-color__inverse-surface);
      display: block;

      box-sizing: border-box;

      /* Ensure 24px min-height while keeping display:block */
      padding-block: calc(12px - var(--mdw-typescale__body-small__line-height) / 2);
      padding-inline: 8px;

      pointer-events: none;

      opacity: 0;
      transform: scale(0);
      z-index: 28;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      font: var(--mdw-typescale__body-small__font);
      letter-spacing: var(--mdw-typescale__body-small__letter-spacing);

      transition: transform 200ms, opacity 200ms;
    }

    @supports(width: 1lh) {
      :host {
        padding-block: calc(12px - 0.5lh);
      }
    }

    :host([open]) {
      pointer-events: auto;

      opacity: 1;
      transform: scale(1);
    }

    #hover-target {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;

      box-sizing: content-box;
      block-size: 100%;
      inline-size: 100%;
      padding: 8px;

      transform: translateX(-50%) translateY(-50%);
      z-index: -1;
      
    }
  `
  .autoRegister('mdw-tooltip');
