import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import outlineStyles from './Outline.css' assert {type:'css'};
import styles from './RadioIcon.css' assert {type: 'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
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
  .css(outlineStyles, styles)
  .html/* html */`
    <div id=inner-shape class=shape selected={selected}></div>
  `.on({
    composed() {
      const { outline } = this.refs;
      outline.removeAttribute('_if');
      outline.setAttribute('selected', '{selected}');
    },
  })
  .extend()
  .autoRegister('mdw-radio-icon');
