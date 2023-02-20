import './CardActionArea.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import styles from './Card.css' assert { type: 'css' };
import Surface from './Surface.js';

export default Surface
  .mixin(FormAssociatedMixin)
  .mixin(StateMixin)
  .extend()
  .set({
    ariaRole: 'figure',
  })
  .observe({
    filled: 'boolean',
    actionable: 'boolean',
  })
  .css(styles)
  .html/* html */`
    <slot id=primary-action name=primary-action></slot>
  `
  .autoRegister('mdw-card');
