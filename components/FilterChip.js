import './Icon.js';

import Chip from './Chip.js';

export default Chip
  .extend()
  .observe({
    type: { empty: 'checkbox' },
    dropdown: 'boolean',
    trailingSrc: 'string',
    trailingIcon: 'string',
  })
  .expressions({
    computedTrailingIcon: ({ trailingIcon, dropdown, trailingSrc }) => {
      if (trailingIcon) return trailingIcon;
      if (dropdown) return 'arrow_drop_down';
      if (trailingSrc) return '';
      return null;
    },
  })
  .html`
    <mdw-icon mdw-if={!icon} id=check-icon disabled={disabledState} selected={checked} aria-hidden=true>check</mdw-icon>
    <mdw-icon mdw-if={computedTrailingIcon} id=trailing-icon aria-hidden=true src={trailingSrc}>{computedTrailingIcon}</mdw-icon>
  `
  .on({
    composed() {
      const { shape, icon, control, outline, slot, trailingIcon, checkIcon } = this.refs;

      shape.setAttribute('selected', '{checked}');
      shape.setAttribute('icon', '');
      shape.setAttribute('trailing-icon', '{computedTrailingIcon}');
      icon.setAttribute('mdw-if', '{icon}');
      icon.setAttribute('ink', '{iconInk}');

      control.removeAttribute('role');

      outline.removeAttribute('ink');
      outline.removeAttribute('color');
      outline.setAttribute('selected', '{checked}');

      slot.removeAttribute('ink');
      slot.removeAttribute('color');

      slot.before(checkIcon);
      slot.after(trailingIcon);
    },
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

      color: rgb(var(--mdw-color__on-surface-variant));

    }

    :host(:focus) {
      --mdw-outline__rgb: var(--mdw-color__outline);
    }

    #icon[selected] {
      font-variation-settings: 'FILL' 1;
    }

    #shape {
      background-color: transparent;
    }

    :host(:where([trailing-icon],[dropdown],[trailing-src])) {
      padding-inline-start: max(4px, calc(8px + (var(--mdw-density) * 2px)));
    }

    #shape[elevated] {
      background-color: rgb(var(--mdw-color__surface));
    }

    #shape[selected] {
      background-color: rgb(var(--mdw-bg));
    }

    :host([selected]) {
      color: rgb(var(--mdw-ink));
    }

    #outline[selected] {
      opacity: 0;
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

    #shape[disabled]:is([elevated],[selected]) {
      background-color: rgba(var(--mdw-color__on-surface), 0.12);
      /* color: rgba(var(--mdw-color__on-surface), 0.38); */
    }

  `
  .autoRegister('mdw-filter-chip');
