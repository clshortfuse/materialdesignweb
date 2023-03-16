import CustomElement from '../core/CustomElement.js';

import styles from './Layout.css' assert {type:'css'};

export default CustomElement
  .extend()
  .css(styles)
  .html/* html */`
    <slot id=slot-top name=top></slot>
    <slot id=slot></slot>
  `
  .autoRegister('mdw-layout');
