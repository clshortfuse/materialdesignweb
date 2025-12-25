import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * CheckboxIcon is a visual helper for checkboxes, rendering the box and checkmark.
 * @see https://m3.material.io/components/checkbox/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .observe({
    /** Whether the icon is selected (checked). */
    selected: 'boolean',
    /** Icon name to render inside the checkbox icon. */
    icon: 'string',
    /** Whether the associated control is in an error state. */
    errored: 'boolean',
    /** Whether the associated control is disabled. */
    disabled: 'boolean',
  })
  .define({
    /** Alias for `selected` (quality-of-life property). */
    checked: {
      get() { return this.selected; },
      set(value) { this.selected = value; },
    },
  })
  .css`
    :host {
      --mdw-ink: var(--mdw-color__on-primary);
      --mdw-bg: var(--mdw-color__primary);
      --mdw-shape__size: 2px;
      --disabled-opacity: 0.38;
      position: relative;

      display: inline-block;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;
      block-size: 18px;
      inline-size: 18px;

      font-size: 18px;
      line-height: 18px;
    }

    #icon {
      position: absolute;
      inset: 0;

      opacity: 0;

      background-color: rgb(var(--mdw-bg));
      border-radius: inherit;
      color: rgb(var(--mdw-ink));

      transition-duration: 200ms;
      transition-property: opacity, background-color, color;
      will-change: opacity;
    }

    #outline {
      border-width: 2px;

      color: rgb(var(--mdw-color__on-surface));

      transition-duration: 200ms;
      transition-property: opacity, background-color, color;
      will-change: opacity;
    }

    /* Selected */

    #icon[selected] {
      opacity: 1;
    }

    #outline[selected] {
      opacity: 0;
    }

    /* Errored */

    #icon[errored] {
      background-color: rgb(var(--mdw-color__error));
      color: rgb(var(--mdw-color__on-error));
    }

    #outline[errored] {
      color: rgb(var(--mdw-color__error));
    }

    /* Disabled */

    #icon[disabled] {
      background-color: rgba(var(--mdw-color__on-surface), var(--disabled-opacity));
      color: rgb(var(--mdw-color__surface), var(--disabled-opacity));
    }

    #outline[disabled] {
      color: rgb(var(--mdw-color__on-surface), var(--disabled-opacity));
    }
  `
  .html`
    <mdw-icon id=icon selected={selected} errored={errored} disabled={disabled} icon={icon}></mdw-icon>
  `
  .recompose(({ refs: { outline } }) => {
    outline.removeAttribute('mdw-if');
    outline.setAttribute('selected', '{selected}');
    outline.setAttribute('errored', '{errored}');
    outline.setAttribute('disabled', '{disabled}');
  })
  .autoRegister('mdw-checkbox-icon');
