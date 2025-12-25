import './Icon.js';

import Chip from './Chip.js';

/**
 * Filter chips use tags or descriptive words to filter content.
 * They can be a good alternative to toggle buttons or checkboxes.
 * @see https://m3.material.io/components/chips/specs
 */
export default Chip
  .extend()
  .observe({
    /** Type of the chip; defaults to 'checkbox' for filter behavior. */
    type: { empty: 'checkbox' },
    /** When true, shows a dropdown caret as the trailing icon. */
    dropdown: 'boolean',
    /** Source URL for a trailing image/icon. */
    trailingSrc: 'string',
    /** Name of the trailing icon to show. */
    trailingIcon: 'string',
  })
  .expressions({
    computedTrailingIcon: ({ trailingIcon, dropdown, trailingSrc }) => {
      if (trailingIcon) return trailingIcon;
      if (dropdown) return 'arrow_drop_down';
      if (trailingSrc) return '';
      return null;
    },
    iconVariation({ checked }) {
      return checked ? 'filled' : null;
    },
  })
  .html`
    <mdw-icon mdw-if={!icon} id=check-icon disabled={disabledState} selected={checked} aria-hidden=true icon=check variation=filled></mdw-icon>
    <mdw-icon mdw-if={computedTrailingIcon} id=trailing-icon aria-hidden=true src={trailingSrc} icon={computedTrailingIcon}></mdw-icon>
  `
  .recompose(({ refs: { icon, control, outline, slot, trailingIcon, checkIcon } }) => {
    icon.setAttribute('mdw-if', '{icon}');
    icon.setAttribute('ink', '{iconInk}');

    control.removeAttribute('role');

    outline.removeAttribute('mdw-if');
    outline.removeAttribute('ink');
    outline.removeAttribute('color');
    outline.setAttribute('selected', '{checked}');
    outline.setAttribute('elevated', '{elevated}');
    outline.setAttribute('icon', '');
    outline.setAttribute('trailing-icon', '{computedTrailingIcon}');

    slot.removeAttribute('ink');
    slot.removeAttribute('color');

    slot.before(checkIcon);
    slot.after(trailingIcon);
  })
  .css`
    /* https://m3.material.io/components/chips/specs */

    /* Filter Chips can be elevated */

    :host {
      --mdw-ink: var(--mdw-color__on-secondary-container);
      --mdw-bg: var(--mdw-color__secondary-container);
      gap: 8px;

      padding-inline-start: max(4px, calc(8px + (var(--mdw-density) * 2px)));
      padding-inline-end: max(12px, calc(16px + (var(--mdw-density) * 2px)));

      background-color: transparent;

      color: rgb(var(--mdw-color__on-surface-variant));

    }

    :host(:focus) {
      --mdw-outline__rgb: var(--mdw-color__outline);
    }

    #outline {
      z-index: -1;

      background-color: transparent;
    }

    :host(:where([trailing-icon],[dropdown],[trailing-src])) {
      padding-inline-start: max(4px, calc(8px + (var(--mdw-density) * 2px)));
    }

    #outline[elevated] {
      background-color: rgb(var(--mdw-color__surface-container-low));
      border-color: transparent;
    }

    #outline[selected] {
      background-color: rgb(var(--mdw-bg));
      border-color: transparent;
    }

    :host([selected]) {
      color: rgb(var(--mdw-ink));
    }

    #trailing-icon {
      position: relative;

      font-size: 18px;
    }

    .mdw-chip__checkbox {
      position: absolute;

      max-block-size: 0;
      max-inline-size: 0;

      appearance: none;
      pointer-events: none;
    }

    #check-icon {
      font-size: 0;
    }

    #check-icon[selected] {
      font-size: 18px;
    }

    #check-icon[disabled] {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    :host([disabled]:is([elevated], [filled])) {
      background-color: transparent;
    }

    #outline[disabled]:is([elevated],[selected]) {
      background-color: rgba(var(--mdw-color__on-surface), 0.12);
      /* color: rgba(var(--mdw-color__on-surface), 0.38); */
    }

  `
  .autoRegister('mdw-filter-chip');
