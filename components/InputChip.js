import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';

import Box from './Box.js';
import './Button.js';
import './Icon.js';
import './IconButton.js';

export default Box
  .extend()
  .mixin(ShapeMixin)
  .mixin(DelegatesFocusMixin)
  .mixin(HyperlinkMixin)
  .observe({
    avatar: 'boolean',
    closeButton: 'boolean',
    closeIcon: { empty: 'close' },
    closeInk: { empty: 'inherit' },
    readOnly: { attr: 'readonly', type: 'boolean' },
    disabled: 'boolean',
    icon: 'string',
    iconInk: 'string',
    src: 'string',
    svg: 'string',
    viewBox: 'string',
    svgPath: 'string',
    onclose: EVENT_HANDLER_TYPE,
    selected: 'boolean',
  })
  .set({
    outlined: true,
  })
  .expressions({
    hasIcon({ icon, svg, src, svgPath } = this) {
      return icon ?? svg ?? src ?? svgPath;
    },
    showCloseIcon({ disabled, readOnly, closeButton }) {
      return closeButton && !disabled && !readOnly;
    },
  })
  .html`
    <mdw-button
      role=none
      tabindex=-1
      href={href}
      target={target}
      download={download}
      ping={ping}
      rel={rel}
      hreflang={hreflang}
      referrerpolicy={referrerPolicy} id=action disabled={disabled}></mdw-button>
    <mdw-icon mdw-if={hasIcon} id=icon ink={iconInk} disabled={disabled}
      outlined={outlined} variation={iconVariation} aria-hidden=true svg={svg} src={src}
      svg-path={svgPath} view-box={viewBox} icon={icon} avatar={avatar}></mdw-icon>
    <mdw-icon-button role=none disabled={disabled} tabindex=-1 mdw-if={showCloseIcon} id=close class=button icon={closeIcon} ink={closeInk}>Close</mdw-icon-button>
  `
  .css`
    /* https://m3.material.io/components/chips/specs */

    :host {
      --mdw-shape__size: 8px;
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;

      display: inline-flex;
      align-items: center;
      flex-direction: row;
      gap: 8px;

      padding-block: calc(4px + (var(--mdw-density) * 2px));
      padding-inline: calc(12px + (var(--mdw-density) * 2px));

      color: rgb(var(--mdw-ink));
    }

    :host(:where([icon])) {
      padding-inline-start: calc(8px + (var(--mdw-density) * 2px));
    }

    :host(:where([avatar])) {
      padding-inline-start: calc(4px + (var(--mdw-density) * 2px));
    }

    :host(:where([close-button]:not([disabled]):not([readonly]))) {
      padding-inline-end: calc(8px + 18px + 8px + (var(--mdw-density) * 2px));
    }

    #action {
      --mdw-shape__size: inherit;
      position: absolute;
      inset: 0;

      padding: 0;
    }

    #close {
      position: absolute;
      inset-inline-end: calc(8px - 3px);
      
      padding: 3px; /* Pad to 24px */

      font-size: 18px;
    }

    #icon {
      font-size: 18px;
    }

    #icon[avatar] {
      font-size: 24px;
    }

    #close::part(control) {
      min-inline-size: calc(18px + (2 * 8px)); /* Reach up to edge of chip */
    }

    #outline {
      --mdw-ink: rgb(var(--mdw-color__on-surface-variant));
    }

    #outline:is([ink],[color],[disabled]) {
      /* stylelint-disable-next-line rule-selector-property-disallowed-list */
      --mdw-ink: inherit;
    }

    :host([disabled]) {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

  `
  .childEvents({
    action: {
      click() {
        this.dispatchEvent(new Event('action'));
      },
    },
    close: {
      click() {
        this.dispatchEvent(new Event('close'));
      },
    },
  })
  .on({
    selectedChanged(previous, current) {
      const action = /** @type {InstanceType<typeof import('./Button.js').default>} */ (this.refs.action);
      action._focused = current;
    },
  })
  .recompose(({ refs: { anchor, slot, icon, outline } }) => {
    icon.after(slot);
    anchor.remove();
    slot.setAttribute('disabled', '{disabled}');
    slot.removeAttribute('ink');
    slot.removeAttribute('color');
    outline.removeAttribute('mdw-if');
    outline.setAttribute('ink', '{ink}');
    outline.setAttribute('color', '{color}');
    outline.setAttribute('disabled', '{disabled}');
  })
  .autoRegister('mdw-input-chip');
