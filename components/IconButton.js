import { ELEMENT_STYLE_TYPE } from '../core/customTypes.js';
import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';

/* https://m3.material.io/components/icon-buttons/specs */

export default Button
  .extend()
  .mixin(TooltipTriggerMixin)
  .set({
    _allowedTypes: ['button', 'submit', 'reset', 'checkbox', 'file'],
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
  .recompose(({ refs: { icon, control, outline } }) => {
    icon.removeAttribute('mdw-if');

    control.setAttribute('aria-pressed', '{_ariaPressed}');

    outline.setAttribute('toggle', '{_isToggle}');
    outline.setAttribute('selected', '{checked}');
  })
  .observe({
    _styles: {
      ...ELEMENT_STYLE_TYPE,
      get({ checked, disabled, filled, outlined, _isToggle }) {
        if (!_isToggle) return null;
        if (disabled) return null;
        if (outlined) {
          if (checked) {
            return {
              backgroundColor: 'rgb(var(--mdw-bg))',
            };
          }
          return {
            color: 'rgb(var(--mdw-color__on-surface-variant))',
          };
        }
        if (checked) return null; // All else uses checked state
        if (filled == null) return null;
        return {
          backgroundColor: 'rgb(var(--mdw-color__surface-container-highest))',
          color: filled === 'tonal'
            ? 'rgb(var(--mdw-color__on-surface-variant))'
            : 'rgb(var(--mdw-bg))',
        };
      },
    },
  })
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-ink: rgb(var(--mdw-color__on-surface-variant));

      align-items: center;
      justify-content: center;

      min-block-size: 1em;
      min-inline-size: 1em;

      padding: max(8px, calc(8px + (var(--mdw-density) * 2px)));

      font-size: 24px;

      transition-property: background-color, box-shadow;
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
      background-color: transparent;
    }

    /** Outlined | Outlined Unchecked */
    :host(:where([outlined][type="checkbox"])) {
      --mdw-bg: var(--mdw-color__inverse-surface);
      --mdw-ink: var(--mdw-color__inverse-on-surface);
    }

    #slot { display: none; }

    #icon {
      pointer-events: none;

      font-size: inherit;

      /* stylelint-disable-next-line liberty/use-logical-spec */
      transition-property: color, inline-size, width;
    }

    #state {
      z-index:1;
    }

    #ripple-container {
      z-index:2;
    }

    #outline[focused] {
      opacity: 1;

      color: inherit;
    }
    
    #outline[focused][toggle] {
      color: rgb(var(--mdw-color__outline));
    }

    #outline[selected]:not([disabled]) {
      opacity: 0;
    }

  `
  .autoRegister('mdw-icon-button');
