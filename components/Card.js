import CustomElement from '../core/CustomElement.js';
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/* https://m3.material.io/components/cards/specs */

const SUPPORTS_INERT = 'inert' in HTMLElement.prototype;

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
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
  .observe({
    _elevation({ elevation, elevated, filled, actionable }) {
      if (elevation != null) return elevation;
      if (elevated) return 1;
      if (filled && actionable) return 0;
      return null;
    },
    _elevationRaised({ elevationRaised, elevated, filled, actionable }) {
      if (!actionable) return null;
      if (elevationRaised != null) return elevationRaised;
      if (elevated) return 2;
      if (filled) return 1;
      return null;
    },
    _secondaryFilter({ disabledState }) {
      return disabledState ? 'grayScale()' : null;
    },
  })
  .define({
    stateTargetElement() { return this.actionable ? this.refs.action : this; },
  })
  .expressions({
    showBlocker: ({ disabledState }) => !SUPPORTS_INERT && disabledState,
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
    <slot id=slot disabled={disabledState}></slot>
  `
  .recompose(({ refs: { anchor } }) => { anchor.remove(); })
  .css`


    :host {
      --mdw-shape__size: 12px;

      /* padding-inline: 12px; */

      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;

      display: block;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }

    :host(:where([elevated],[filled],[color])) {
      background-color: rgb(var(--mdw-bg));
    }

    :host(:where([filled])) {
      --mdw-bg: var(--mdw-color__surface-container-highest);
      --mdw-ink: var(--mdw-color__on-surface-variant);
    }

    :host(:where([elevated])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-ink: var(--mdw-color__on-surface);
    }

    :host([disabled]) {
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
