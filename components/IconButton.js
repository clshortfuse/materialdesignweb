import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';

export default Button
  .extend()
  .mixin(TooltipTriggerMixin)
  .set({
    _allowedTypes: ['button', 'submit', 'reset', 'checkbox'],
  })
  .observe({
    _ariaPressed: {
      get({ type, checked, indeterminate }) {
        if (type !== 'checkbox') return null;
        return indeterminate ? 'mixed' : (checked ? 'true' : 'false');
      },
    },
  })
  .expressions({
    isToggle({ type }) {
      return type === 'checkbox';
    },
    _computedAriaLabelledBy({ ariaLabel }) {
      return ariaLabel ? null : 'tooltip';
    },
  })
  .childEvents({
    control: {
      keydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const input = /** @type {HTMLInputElement} */ (event.currentTarget);
        if (input.type !== 'checkbox') return;
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (input.disabled) return;

        input.click();
      },
    },
  })
  .recompose(({ refs: { slot, shape, tooltipSlot, icon, control, outline } }) => {
    shape.classList.add('colored');
    icon.classList.add('colored');
    for (const el of [shape, icon]) {
      el.setAttribute('toggle', '{isToggle}');
      el.setAttribute('selected', '{checked}');
    }
    slot.remove();
    icon.removeAttribute('mdw-if');
    tooltipSlot.removeAttribute('name');

    control.setAttribute('aria-pressed', '{_ariaPressed}');

    outline.setAttribute('selected', '{checked}');
  })
  .css`
    /* https://m3.material.io/components/icon-buttons/specs */

    :host {
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-ink: rgb(var(--mdw-color__on-surface-variant));

      align-items: center;
      justify-content: center;

      padding: max(8px, calc(8px + (var(--mdw-density) * 2px)));

      background-color: transparent;

      font-size: 24px;
    }

    :host(:where([type="checkbox"])) {
      --mdw-ink: var(--mdw-color__primary);
    }

    /** Filled | Filled Checked */
    :host(:where([filled])) {
      --mdw-ink: var(--mdw-color__on-primary);
      --mdw-bg: var(--mdw-color__primary);
      --mdw-surface__shadow__resting: none;
      --mdw-surface__shadow__raised: none;
    }

    /** Tonal | Tonal Checked */
    :host(:where([filled="tonal"])) {
      --mdw-ink: var(--mdw-color__on-secondary-container);
      --mdw-bg: var(--mdw-color__secondary-container);
    }

    /** Outlined | Outlined Unchecked */
    :host(:where([outlined])) {
      --mdw-ink: var(--mdw-color__on-surface-variant);
    }

    /** Outlined | Outlined Unchecked */
    :host(:where([outlined][type="checkbox"])) {
      --mdw-bg: var(--mdw-color__inverse-surface);
      --mdw-ink: var(--mdw-color__inverse-on-surface);
    }

    #shape[toggle] {
      background-color: transparent;
    }

    .colored[toggle] {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    .colored[selected] {
      /* background-color: rgb(var(--mdw-bg)); */
      color: rgb(var(--mdw-ink));
    }

    #shape[filled][toggle] {
      background-color: rgb(var(--mdw-color__surface-container-highest));
    }

    .colored[filled][toggle] {
      color: rgb(var(--mdw-bg));
    }

    #shape[filled="tonal"][toggle] {
      /* Redundant */
      /* background-color: rgb(var(--mdw-color__surface-container-highest)); */
    }

    .colored[filled="tonal"][toggle] {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #shape[filled][selected] {
      background-color: rgb(var(--mdw-bg));
    }

    .colored[filled][selected] {
      color: rgb(var(--mdw-ink));
    }

    #shape[outlined] {
      background-color: transparent;
    }

    .colored[outlined] {
      color: inherit;
    }

    #shape[outlined][toggle] {
      background-color: transparent;
    }

    .colored[outlined][toggle] {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #shape[outlined][selected] {
      background-color: rgb(var(--mdw-bg));
    }

    .colored[outlined][selected] {
      color: rgb(var(--mdw-ink));
    }

    #icon {
      font-size: inherit;
      font-variation-settings: 'FILL' 1;
    }

    #icon[toggle] {
      font-variation-settings: 'FILL' 0;
    }

    #icon[selected] {
      font-variation-settings: 'FILL' 1;
    }

    #outline[focused] {
      opacity: 1;

      color: inherit;
    }

    #outline[selected] {
      opacity: 0;
    }

    /** Disabled */
    .colored[disabled] {
      cursor: not-allowed;

      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    #shape[disabled][filled],
    #shape[disabled][outlined][selected] {
      background-color: rgba(var(--mdw-color__on-surface), 0.12);
    }

    .colored[disabled][filled],
    .colored[disabled][outlined][selected] {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

  `
  .autoRegister('mdw-icon-button');
