import { attrNameFromPropName } from '../core/dom.js';

/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function AriaReflectorMixin(Base) {
  return Base
    .extend()
    .observe({
      _ariaRole: 'string',
    }).methods({
      /**
       * @param {keyof HTMLElement & keyof ElementInternals} name
       * @param {string} value
       */
      updateAriaProperty(name, value) {
        if (this.elementInternals && name in this.elementInternals) {
          this.elementInternals[name] = value;
        } else if (name in this) {
          this[name] = value;
        } else {
          console.warn('Unknown ARIA property', name);
          const attrName = attrNameFromPropName(name);
          if (value == null) {
            this.removeAttribute(name);
          } else {
            this.setAttribute(attrName, value);
          }
        }
      },
    })
    .on({
      _ariaRoleChanged(oldValue, newValue) {
        this.updateAriaProperty('role', newValue);
      },
      constructed() {
        this.updateAriaProperty('role', this._ariaRole);
      },
    });
}