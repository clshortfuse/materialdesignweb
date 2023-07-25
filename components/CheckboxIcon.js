import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .observe({
    selected: 'boolean',
    icon: 'string',
    errored: 'boolean',
    disabled: 'boolean',
  })
  .define({
    /** Alias for Selected (QoL) */
    checked: {
      get() { return this.selected; },
      set(value) { this.selected = value; },
    },
  })
  .css`
    /* https://m3.material.io/components/checkbox/specs */

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
