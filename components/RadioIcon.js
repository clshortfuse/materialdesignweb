import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .extend()
  .observe({
    selected: 'boolean',
    icon: 'string',
    errored: 'boolean',
    disabled: 'boolean',
    hovered: 'boolean',
    focused: 'boolean',
  })
  .define({
    /** Alias for Selected (QoL) */
    checked: {
      get() { return this.selected; },
      set(value) { this.selected = value; },
    },
  })
  .html/* html */`
    <div id=inner-shape class=shape selected={selected}></div>
  `.on({
    composed() {
      const { outline } = this.refs;
      outline.removeAttribute('mdw-if');
      outline.setAttribute('selected', '{selected}');
    },
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
      filter:
        drop-shadow(1px 0px 0px var(--color))
        drop-shadow(0px 1px 0px var(--color))
        drop-shadow(-1px 0px 0px var(--color))
        drop-shadow(0px -1px 0px var(--color))
        ;

      color: var(--color);

      will-change: filter, color;
    }

    #inner-shape {
      position: absolute;
      inset: 0;

      transform: scale(0);

      background-color: var(--color);

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
