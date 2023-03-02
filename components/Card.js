import './CardActionArea.js';
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import styles from './Card.css' assert { type: 'css' };
import Surface from './Surface.js';

const SUPPORTS_INERT = 'inert' in HTMLElement.prototype;

export default Surface
  .mixin(FormAssociatedMixin) // Tap into FormAssociated for disabledState
  .mixin(StateMixin)
  .extend()
  .setStatic({
    delegatesFocus: true,
  })
  .set({
    ariaRole: 'figure',
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
  .css(styles)
  .html/* html */`
    <mdw-button _if={actionable} aria-label="{actionLabel}" id=action disabled={disabledState}></mdw-button>
    <div _if={showBlocker} id=inert-blocker></div>
  `
  .on({
    composed({ $ }) {
      $('#shape').setAttribute('disabled', '{disabledState}');
      $('#shape').setAttribute('filled', '{filled}');
      const slot = $('#slot');
      slot.setAttribute('inert', '{disabledState}');
      slot.before($('#action'));
    },
  })
  .childEvents({
    action: {
      click(e) {
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
