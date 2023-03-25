import Button from './Button.js';

export default Button
  .extend()
  .css`
    /* https://m3.material.io/components/extended-fab/specs */

    :host {
      --mdw-bg: var(--mdw-color__primary-container);
      --mdw-ink: var(--mdw-color__on-primary-container);
      --mdw-shape__size: 16px;
      --mdw-surface__tint: var(--mdw-surface__tint__3);
      --mdw-surface__tint__raised: var(--mdw-surface__tint__4);
      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__3);
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__4);
      min-inline-size: 48px;
      padding: calc(16px + (var(--mdw-density) * 2px));
    }

    #icon {
      font-size: 24px;
    }

    :host([lowered]) {
      --mdw-surface__tint: var(--mdw-surface__tint__1);
      --mdw-surface__tint__raised: var(--mdw-surface__tint__2);
      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__1);
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__2);
    }

  `
  .observe({
    filled: { empty: 'tonal' },
    elevated: { type: 'boolean', empty: true },
  })
  .autoRegister('mdw-extended-fab');
