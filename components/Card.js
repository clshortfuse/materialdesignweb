import CustomElement from '../core/CustomElement.js';
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';

import styles from './Card.css' assert { type: 'css' };

const SUPPORTS_INERT = 'inert' in HTMLElement.prototype;

export default CustomElement
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
    <mdw-button _if={actionable} aria-label={actionLabel} id=action disabled={disabledState}></mdw-button>
    <div _if={showBlocker} id=inert-blocker></div>
    <slot id=slot disabled={disabledState}></slot>
  `
  .css(styles)
  .on({
    composed() {
      const { slot, surface, surfaceTint, shape, outline } = this.refs;
      shape.append(surfaceTint);
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
