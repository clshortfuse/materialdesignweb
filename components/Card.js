import CustomElement from '../core/CustomElement.js';
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

const SUPPORTS_INERT = 'inert' in HTMLElement.prototype;

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .mixin(FormAssociatedMixin) // Tap into FormAssociated for disabledState
  .mixin(StateMixin)
  .mixin(AriaReflectorMixin)
  .extend()
  .setStatic({
    delegatesFocus: true,
  })
  .set({
    _ariaRole: 'figure',
  })
  .observe({
    filled: 'boolean',
    actionable: 'boolean',
    actionLabel: 'string',
    onaction: EVENT_HANDLER_TYPE,
  })
  .define({
    stateTargetElement() { return this.actionable ? this.refs.action : this; },
  })
  .expressions({
    showBlocker: ({ disabledState }) => !SUPPORTS_INERT && disabledState,
  })
  .methods({
    focus() {
      if (this.disabledState) return;
      if (this.actionable) this.refs.action.focus();
    },
  })
  .html/* html */`
    <mdw-button mdw-if={actionable} aria-label={actionLabel} id=action disabled={disabledState}></mdw-button>
    <div mdw-if={showBlocker} id=inert-blocker></div>
    <slot id=slot disabled={disabledState}></slot>
  `
  .css/* css */`
    /* https://m3.material.io/components/cards/specs */

    :host {
      --mdw-shape__size: 12px;

      --mdw-surface__shadow__resting: none;
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__resting);
      /* padding-inline: 12px; */

      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;

      display: block;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }

    #shape:where([elevated],[filled],[color]) {
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

    :host([filled]) {
      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__0);
    }

    :host([filled][actionable]) {
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__1);
    }

    :host([elevated]) {
      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__1);
    }

    :host([elevated][actionable]) {
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__2);
    }

    #shape[disabled] {

      /* Works on images */
      filter: grayscale();

      color: rgb(var(--mdw-color__on-surface));
    }

    :host([disabled]) {
      cursor: not-allowed;

      filter: grayscale();
      opacity: 0.38;
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

    #shape[disabled][elevated] {
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
  .on({
    composed() {
      const { slot, surface, shape, outline } = this.refs;
      surface.append(shape);
      outline.removeAttribute('pressed');
      outline.removeAttribute('focused');

      shape.setAttribute('filled', '{filled}');
      slot.setAttribute('inert', '{disabledState}');
      slot.setAttribute('disabled', '{disabledState}');
      // shape.setAttribute('disabled', '{disabledState}');
      // shape.setAttribute('filled', '{filled}');
    },
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
