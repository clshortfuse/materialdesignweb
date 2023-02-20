import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import outlineStyles from './Outline.css' assert {type:'css'};
import styles from './RadioIcon.css' assert {type: 'css'};
import shapeStyles from './Shape.css' assert {type:'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .observe({
    selected: 'boolean',
    icon: 'string',
    errored: 'boolean',
    disabled: 'boolean',
    hovered: 'boolean',
    focused: 'boolean',
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
      <div id=outline class=outline selected={selected}>
        <div id="outline-left" class="outline-section outline-left"></div>
        <div id="outline-right" class="outline-section outline-right"></div>
      </div>
      <div id=inner-shape class=shape selected={selected}></div>
    </div>
  `
  .extend()
  .autoRegister('mdw-radio-icon');
