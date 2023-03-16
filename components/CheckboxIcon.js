import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './CheckboxIcon.css' assert {type: 'css'};
import outlineStyles from './Outline.css' assert {type:'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
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
  .css(outlineStyles, styles)
  .on({
    composed({ html, template }) {
      const { outline, shape } = this.refs;
      outline.removeAttribute('_if');
      outline.setAttribute('selected', '{selected}');
      outline.setAttribute('errored', '{errored}');
      outline.setAttribute('disabled', '{disabled}');
      // outlineLeft.remove();
      // outlineRight.remove();
      shape.append(html`
        <mdw-icon id=icon selected={selected} errored={errored} disabled={disabled}>{icon}</mdw-icon>
      `);
    },
  })
  .extend()
  .autoRegister('mdw-checkbox-icon');
