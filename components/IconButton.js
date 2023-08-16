import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';

/* https://m3.material.io/components/icon-buttons/specs */

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
    _isToggle({ type }) {
      return type === 'checkbox';
    },
    autoTooltip: { empty: true },
  })
  .expressions({
    iconVariation({ checked, outlined, _isToggle }) {
      if (!checked && (_isToggle || outlined)) return null;
      return 'filled';
    },
    _computedAriaLabelledby({ ariaLabel }) {
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
  .recompose(({ refs: { icon, control, outline, state, rippleContainer } }) => {
    // Because selected state does not write to light DOM,
    // it must be cloned into shadow root for styling.
    for (const el of [state, icon, rippleContainer]) {
      el.classList.add('colored');
      el.setAttribute('toggle', '{_isToggle}');
      el.setAttribute('selected', '{checked}');
      el.setAttribute('filled', '{filled}');
    }
    icon.removeAttribute('mdw-if');

    control.setAttribute('aria-pressed', '{_ariaPressed}');

    outline.setAttribute('toggle', '{_isToggle}');
    outline.setAttribute('selected', '{checked}');
  })
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-ink: rgb(var(--mdw-color__on-surface-variant));

      align-items: center;
      justify-content: center;

      min-inline-size: 1em;

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

    #slot { display: none; }

    #icon {
      position: absolute;
      z-index: 0;
      inset: 0;

      padding: inherit;

      pointer-events: none;

      background-color: inherit;
      border-radius: inherit;

      font-size: inherit;

      transition-property: background-color, color;
    }

    #state {
      z-index:1;
    }

    #ripple-container {
      z-index:2;
    }

    .colored[toggle] {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    .colored[selected] {
      /* background-color: rgb(var(--mdw-bg)); */
      color: rgb(var(--mdw-ink));
    }

    #icon[filled] {
      background-color: rgb(var(--mdw-bg));
    }

    #icon[filled][toggle] {
      background-color: rgb(var(--mdw-color__surface-container-highest));
    }

    .colored[filled][toggle] {
      color: rgb(var(--mdw-bg));
    }

    #icon[filled="tonal"][toggle] {
      /* Redundant */
      /* background-color: rgb(var(--mdw-color__surface-container-highest)); */
    }

    .colored[filled="tonal"][toggle] {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #icon[filled][selected] {
      background-color: rgb(var(--mdw-bg));
    }

    .colored[filled][selected] {
      color: rgb(var(--mdw-ink));
    }

    #icon[outlined] {
      background-color: transparent;
    }

    .colored[outlined] {
      color: inherit;
    }

    #icon[outlined][toggle] {
      background-color: transparent;
    }

    .colored[outlined][toggle] {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #icon[outlined][selected] {
      background-color: rgb(var(--mdw-bg));
    }

    .colored[outlined][selected] {
      color: rgb(var(--mdw-ink));
    }

    #outline[focused] {
      opacity: 1;

      color: inherit;
    }
    
    #outline[focused][toggle] {
      color: rgb(var(--mdw-color__outline));
    }

    #outline[selected] {
      opacity: 0;
    }

    /** Disabled */
    .colored[disabled] {
      cursor: not-allowed;

      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    #icon[disabled][filled],
    #icon[disabled][outlined][selected] {
      background-color: rgba(var(--mdw-color__on-surface), 0.12);
    }

    .colored[disabled][filled],
    .colored[disabled][outlined][selected] {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

  `
  .autoRegister('mdw-icon-button');
