import Button from './Button.js';

export default Button
  .extend()
  .observe({
    lowered: 'boolean',
  })
  .observe({
    _elevation({ elevation, lowered }) {
      return elevation ?? lowered ? 1 : 3;
    },
    _elevationRaised({ elevationRaised, lowered }) {
      return elevationRaised ?? lowered ? 2 : 4;
    },
  })
  .css`
    /* https://m3.material.io/components/extended-fab/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      --mdw-ink: var(--mdw-color__primary);
      --mdw-shape__size: 16px;
      min-inline-size: 48px;
      padding: calc(16px + (var(--mdw-density) * 2px));
    }

    #icon {
      font-size: 24px;
    }

    :host(:where([lowered])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
    }
  `
  .observe({
    filled: { empty: 'tonal' },
    elevated: { type: 'boolean', empty: true },
  })
  .autoRegister('mdw-extended-fab');
