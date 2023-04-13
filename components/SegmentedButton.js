import './Icon.js';

import Button from './Button.js';

export default Button
  .extend()
  .observe({
    type: { empty: 'radio' },
    innerSegmentedButton: 'boolean',
  })
  .set({
    focusableOnDisabled: true,
  })
  .on({
    composed({ html, inline }) {
      const { shape, icon, outline, control, slot, state } = this.refs;

      slot.before(html`
        <div id=icons>
          ${icon}
          <mdw-icon selected={checked} id=check-icon aria-hidden=true>check</mdw-icon>
        </div>
      `);
      shape.setAttribute('selected', '{checked}');

      icon.removeAttribute('mdw-if');
      icon.setAttribute('has-icon', '{hasIcon}');
      icon.setAttribute('selected', '{checked}');
      outline.setAttribute('inner-segmented-button', '{innerSegmentedButton}');
      outline.setAttribute('shape-start', '{shapeStart}');
      outline.setAttribute('shape-end', '{shapeEnd}');
      control.setAttribute('role', 'option');
      control.setAttribute('aria-checked', inline(
        ({ type, checked }) => (type === 'checkbox' ? `${(!!checked)}` : null),
      ));
      control.setAttribute('aria-selected', inline(
        ({ type, checked }) => (type === 'checkbox' ? null : `${!!checked}`),
      ));

      state.setAttribute('state-disabled', 'focus');
    },
    constructed() {
      this.outlined = true;
    },
  })
  .css`
    /* https://m3.material.io/components/segmented-buttons/specs */

    :host {
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-ink: var(--mdw-color__on-surface);
      gap: 8px;

      min-inline-size: 24px;
      padding-inline-start: max(12px, calc(16px + (var(--mdw-density) * 2px)));
      padding-inline-end: max(20px, calc(24px + (var(--mdw-density) * 2px)));

      color: rgb(var(--mdw-ink));
    }

    :host([inner-segmented-button]) {
      --mdw-shape__size: 0px;
    }

    #outline {
      inset-inline-end: -1px;
    }

    #outline[shape-end] {
      inset-inline-end: 0;
    }

    #shape[selected] {
      background-color: rgb(var(--mdw-bg));
    }

    #icons {
      position: relative;

      display: inline-flex;
    }

    #icon {
      box-sizing: border-box;
      inline-size: 0;

      opacity: 1;
    }

    #icon[has-icon] {
      inline-size: 18px;

      opacity: 1;
    }

    #icon[selected] {
      inline-size: 18px;

      opacity: 0;
    }

    #check-icon {
      position: absolute;
      inset: 0;

      display: block;

      overflow: visible;

      margin: 0;

      opacity: 0;

      font-size: 18px;
      font-variation-settings: 'FILL' 1;
    }

    #check-icon[selected] {
      opacity: 1;

      font-size: 18px;
    }

    #icon[disabled] {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    #shape[disabled][selected] {
      background-color: rgba(var(--mdw-color__on-surface), 0.12);
    }
  `
  .autoRegister('mdw-segmented-button');
