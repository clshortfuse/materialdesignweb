import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Badges show notifications, counts, or status information on
 * navigation items and icons.
 * @see https://m3.material.io/components/badges/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(DensityMixin)
  .mixin(ShapeMixin)
  .html`<slot id=slot></slot>`
  .css`
    :host {
      --mdw-shape__size: 8px;
      --mdw-ink: var(--mdw-color__on-error);
      --mdw-bg: var(--mdw-color__error);
      --mdw-type__font: var(--mdw-typescale__label-small__font);
      --mdw-type__letter-spacing: var(--mdw-typescale__label-small__letter-spacing);
      position: relative;
    
      display: inline-block;
      vertical-align: middle;
    
      box-sizing: border-box;
      min-block-size: var(--mdw-typescale__label-small__line-height);
      min-inline-size: var(--mdw-typescale__label-small__line-height);

      /* Ensure 16px min-height while keeping display:block */
      padding-block: calc(8px - var(--mdw-typescale__body-small__line-height) / 2);
      padding-inline: max(4px, calc(4px + (var(--mdw-density) * 2px)));
    
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
      text-align: center;
    }
    
    @supports (width: 1lh) {
      :host {
        min-block-size: 1lh; /* Clamps to 1:1 */
        min-inline-size: 1lh; /* Clamps to 1:1 */
        padding-inline: max(0.25lh, calc(0.25lh + (var(--mdw-density) * 2px)));
      }
    }
    
    :host(:empty) {
      min-block-size: 6px;
      min-inline-size: 6px;
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin: 5px;
      padding: 0
    }
    
  `
  .autoRegister('mdw-badge');
