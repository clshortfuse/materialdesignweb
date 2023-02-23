import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './CheckboxIcon.css' assert {type: 'css'};
import outlineStyles from './Outline.css' assert {type:'css'};
import shapeStyles from './Shape.css' assert {type:'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .observe({
    selected: 'boolean',
    icon: 'string',
    errored: 'boolean',
    disabled: 'boolean',
  })
  .define({
    /** Alias for Selected (QoL) */
    checked: {
      get() { return this.selected; },
      set(value) { this.selected = value; },
    },
  })
  .css(shapeStyles, outlineStyles, styles)
  .html/* html */`
    <div id=shape class=shape>
      <div id=outline class=outline selected={selected} errored={errored} disabled={disabled}></div>
      <mdw-icon id=icon selected={selected} errored={errored} disabled={disabled}>{icon}</mdw-icon>
    </div>
  `
  .extend()
  .autoRegister('mdw-checkbox-icon');
