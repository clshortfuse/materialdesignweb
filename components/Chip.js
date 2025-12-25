import Button from './Button.js';

/**
 * Chips help people enter information, make selections, filter content, or trigger actions.
 * @see https://m3.material.io/components/chips/specs
 */
export default Button
  .extend()
  .observe({
    /** When true, renders the chip as a suggestion variant. */
    suggestion: 'boolean',
  })
  .expressions({
    iconVariation({ elevated }) {
      return elevated ? 'filled' : null;
    },
  })
  .css`
    :host {
      --mdw-shape__size: 8px;
      --mdw-ink: var(--mdw-color__on-surface);
      padding-block: calc(4px + (var(--mdw-density) * 2px));
      padding-inline: calc(16px + (var(--mdw-density) * 2px));

      color: rgb(var(--mdw-ink));
    }

    :host(:where([suggestion])) {
      --mdw-ink: var(--mdw-color__on-surface-variant);
    }

    :host(:where([icon])) {
      gap: 8px;

      padding-inline: calc(8px + (var(--mdw-density) * 2px)) calc(16px + (var(--mdw-density) * 2px));

    }

    #outline {
      --mdw-ink: rgb(var(--mdw-color__on-surface-variant));
    }

    #outline:is([ink],[color]) {
      /* stylelint-disable-next-line rule-selector-property-disallowed-list */
      --mdw-ink: inherit;
    }

    #slot[disabled],
    #icon[disabled] {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

  `
  .recompose(({ inline, refs: { slot, outline, icon } }) => {
    slot.setAttribute('disabled', '{disabledState}');
    slot.removeAttribute('ink');
    slot.removeAttribute('color');
    outline.setAttribute('mdw-if', '{!elevated}');
    outline.setAttribute('ink', '{ink}');
    outline.setAttribute('color', '{color}');
    icon.setAttribute('ink', inline(({ ink, iconInk }) => iconInk ?? ink ?? 'primary'));
  })
  .autoRegister('mdw-chip');
