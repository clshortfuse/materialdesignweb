/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function AriaReflectorMixin(Base) {
  return Base
    .observe({
      _ariaRole: 'string',
    }).methods({
      /**
       * @param {keyof HTMLElement & keyof ElementInternals} name
       */
      readAriaProperty(name) {
        if (this.elementInternals && name in this.elementInternals) {
          return this.elementInternals[name];
        } if (name in this) {
          return this[name];
        }
        // console.warn('Unknown ARIA property', name, this);
        /** @type {string} */
        let attrName = name;
        if (attrName.startsWith('aria')) {
          attrName = `aria-${attrName.slice(4).toLowerCase()}`;
        }
        return this.getAttribute(name);
      },
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
          // console.warn('Unknown ARIA property', name, this);
          /** @type {string} */
          let attrName = name;
          if (attrName.startsWith('aria')) {
            attrName = `aria-${attrName.slice(4).toLowerCase()}`;
          }
          const fn = () => {
            if (value == null) {
              this.removeAttribute(name);
            } else {
              this.setAttribute(attrName, value);
            }
          };
          if (this.isConnected) {
            fn();
          } else {
            // Elements should not add attributes during construction
            setTimeout(fn);
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
