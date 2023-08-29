import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import Box from './Box.js';

/* https://m3.material.io/components/cards/specs */

const SUPPORTS_INERT = 'inert' in HTMLElement.prototype;

export default Box
  .extend()
  .mixin(StateMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .mixin(FormAssociatedMixin) // Tap into FormAssociated for disabledState
  .mixin(AriaReflectorMixin)
  .mixin(DelegatesFocusMixin)
  .mixin(HyperlinkMixin)
  .set({
    _ariaRole: 'figure',
  })
  .observe({
    elevated: 'boolean',
    filled: 'boolean',
    actionable: 'boolean',
    actionLabel: 'string',
    onaction: EVENT_HANDLER_TYPE,
  })
  .define({
    stateTargetElement() { return this.actionable ? this.refs.action : this; },
  })
  .expressions({
    showBlocker: ({ disabledState, disabled }) => disabledState && (!disabled || !SUPPORTS_INERT),
    showButton: ({ actionable, href }) => Boolean(actionable || href),
  })
  .methods({
    focus() {
      if (this.disabledState) return;
      if (this.actionable) this.refs.action.focus();
    },
  })
  .html`
    <mdw-button mdw-if={showButton} aria-label={actionLabel} href={href}
      target={target}
      download={download}
      ping={ping}
      rel={rel}
      hreflang={hreflang}
      referrerpolicy={referrerPolicy} id=action disabled={disabledState}></mdw-button>
    <div mdw-if={showBlocker} id=inert-blocker></div>
  `
  .recompose(({ refs: { anchor, inertBlocker, slot } }) => {
    anchor.remove();
    slot.setAttribute('disabled', '{disabledState}');
    inertBlocker.before(slot);
  })
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__medium);

      /* padding-inline: 12px; */

      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;

      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);

      transition: filter 200ms;
      will-change: filter;
    }

    :host(:where([elevated],[filled],[outlined])) {
      background-color: rgb(var(--mdw-bg));
    }

    :host(:where([elevated])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-ink: var(--mdw-color__on-surface);
      filter: var(--mdw-elevation__drop-shadow__1);
    }

    :host(:where([filled])) {
      --mdw-bg: var(--mdw-color__surface-container-highest);
      --mdw-ink: var(--mdw-color__on-surface-variant);
    }

    :host(:where([filled][actionable])) {
      filter: var(--mdw-elevation__drop-shadow__0);
    }

    :host(:where([elevated][actionable]:hover:not(:active))) {
      filter: var(--mdw-elevation__drop-shadow__2);
    }

    :host(:where([filled][actionable]:hover:not(:active))) {
      filter: var(--mdw-elevation__drop-shadow__1);
    }

    :host([disabled]) {
      cursor: not-allowed;

      filter: grayscale();
      opacity: 0.38;

      color: rgb(var(--mdw-color__on-surface));
    }

    #slot[disabled] {
      color: rgb(var(--mdw-color__on-surface));
    }

    #outline[disabled] {
      color: rgba(var(--mdw-color__on-surface), calc(0.12/0.38));
    }

    /** Firefox and Safari do not support [inert] */

    #inert-blocker {
      position: absolute;
      inset: 0;

      cursor: not-allowed;
      pointer-events: auto;

      z-index: 99;
    }

    :host([disabled][elevated]) {
      background-color: rgba(var(--mdw-color__surface-container-highest));
    }

    :host([disabled][filled]) {
      background-color: rgba(var(--mdw-color__surface));
    }

    #action {
      --mdw-ink: inherit;
      --mdw-shape__size: inherit;

      position: absolute;
      inset: 0;

      padding: 0;

      z-index: 0;

      color: inherit
    }
  `
  .recompose(({ refs: { slot, outline } }) => {
    outline.removeAttribute('pressed');
    outline.removeAttribute('focused');

    slot.setAttribute('inert', '{disabledState}');
    slot.setAttribute('disabled', '{disabledState}');
  })
  .childEvents({
    action: {
      click() {
        if (this.disabledState) return;
        this.dispatchEvent(new Event('action'));
      },
    },
    slot: SUPPORTS_INERT ? {} : {
      focusin() {
        if (this.disabledState) {
          console.warn('Inert not supported. Element should be able to receive focus');
        }
      },
    },
  })
  .autoRegister('mdw-card');
