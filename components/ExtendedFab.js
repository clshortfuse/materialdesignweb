import Button from './Button.js';

export default Button
  .extend()
  .observe({
    lowered: 'boolean',
  })
  .css`
    /* https://m3.material.io/components/extended-fab/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      --mdw-ink: var(--mdw-color__primary);
      --mdw-shape__size: 16px;
      min-inline-size: 48px;
      padding: calc(16px + (var(--mdw-density) * 2px));

      box-shadow: var(--mdw-elevation__box-shadow__3);
    }

    #icon {
      font-size: 24px;
    }

    :host(:where([lowered])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      box-shadow: var(--mdw-elevation__box-shadow__1);
    }

    :host(:where(:hover:not(:active))) {
      box-shadow: var(--mdw-elevation__box-shadow__4);
    }

    :host(:where([lowered]:hover:not(:active))) {
      box-shadow: var(--mdw-elevation__box-shadow__2);
    }
  `
  .observe({
    filled: { empty: 'tonal' },
    elevated: { type: 'boolean', empty: true },
  })
  .autoRegister('mdw-extended-fab');
