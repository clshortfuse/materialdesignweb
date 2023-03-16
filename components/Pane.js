import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Pane.css' assert {type:'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .observe({
    columns: 'integer',
    flexible: 'boolean',
    fixed: 'boolean',
    split: 'boolean',
    navDrawer: 'boolean',
    navRail: 'boolean',
  })
  .css(styles)
  .html/* html */`
    <slot id=slot></slot>
  `
  .autoRegister('mdw-pane');
