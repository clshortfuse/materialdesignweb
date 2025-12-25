import './Shape.js';

import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Visual helper for radio buttons, rendering the outer and inner rings.
 * @see https://m3.material.io/components/radio-button/overview
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .observe({
    /** Whether the radio icon is selected (checked). */
    selected: 'boolean',
    /** Optional icon name to render inside the control (not normally used). */
    icon: 'string',
    /** When true the control is shown in an error state. */
    errored: 'boolean',
    /** When true the control is disabled. */
    disabled: 'boolean',
    /** Hover state used for styling. */
    hovered: 'boolean',
    /** Focus state used for styling. */
    focused: 'boolean',
  })
  .define({
    /**
     * Alias for `selected` to match common form terminology (`checked`).
     * Reading/writing `checked` proxies to the `selected` state.
     */
    checked: {
      get() { return this.selected; },
      set(value) { this.selected = value; },
    },
  })
  .html`
    <mdw-shape id=inner-shape selected={selected}></div>
  `
  .recompose(({ refs: { outline } }) => {
    outline.removeAttribute('mdw-if');
    outline.setAttribute('selected', '{selected}');
  })
  .css`
    /* https://m3.material.io/components/radio-button/specs */

    :host {
      --disabled-opacity: 0.38;
      --mdw-ink: rgb(var(--mdw-color__primary));
      /* Use CSS Variables to force filter to reapply (Chrome Bug) */
      --color: rgb(var(--mdw-color__on-surface-variant));
      --mdw-shape__size: var(--mdw-shape__full);
      position: relative;

      display: inline-block;

      block-size: 20px;
      inline-size: 20px;

      background-color: transparent;

      transition: opacity 200ms;
    }

    #outline {
      border-width: 2px;

      color: var(--color);

      will-change: color;
    }

    #inner-shape {
      position: absolute;
      inset: 0;

      transform: scale(0);

      background-color: var(--color);
      border-radius: inherit;

      transition: transform 200ms, background-color 100ms;
    }

    :host([hovered]) {
      --color: rgb(var(--mdw-color__on-surface));
    }

    :host([focused]) {
      --color: rgb(var(--mdw-color__on-surface));
    }

    :host([selected]) {
      --color: rgb(var(--mdw-ink));
    }

    :host([errored]) {
      --color: rgb(var(--mdw-color__error));
    }

    :host([disabled]) {
      --color: rgba(var(--mdw-color__on-surface));
      opacity: var(--disabled-opacity);
    }

    #inner-shape[selected] {
      transform: scale(0.5);
    }

  `
  .autoRegister('mdw-radio-icon');
