import Button from './Button.js';

export default Button
  .extend()
  .css/* css */`
    /* https://m3.material.io/components/extended-fab/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      --mdw-ink: var(--mdw-color__primary);
      --mdw-shape__size: 16px;
      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__3);
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__4);
      min-inline-size: 48px;
      padding: calc(16px + (var(--mdw-density) * 2px));
    }

    #icon {
      font-size: 24px;
    }

    :host(:where([lowered])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__1);
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__2);
    }
  `
  .observe({
    filled: { empty: 'tonal' },
    elevated: { type: 'boolean', empty: true },
  })
  .autoRegister('mdw-extended-fab');
