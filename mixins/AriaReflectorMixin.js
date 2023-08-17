/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function AriaReflectorMixin(Base) {
  return Base
    .observe({
      _ariaRole: 'string',
    })
    .set({
      /**
       * Browsers that do no support AriaMixin in ElementInternals need to have
       * their attributes after construction.
       * @type {Map<string, string>}
       */
      onConnectAriaValues: null,
      hasFiredConnected: false,
    })
    .methods({
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
        } else if (this.isConnected) {
          if (name in this) {
            this[name] = value;
          } else {
            // console.warn('Unknown ARIA property', name, this);
            /** @type {string} */
            let attrName = name;
            if (attrName.startsWith('aria')) {
              attrName = `aria-${attrName.slice(4).toLowerCase()}`;
            }
            if (value == null) {
              this.removeAttribute(name);
            } else {
              this.setAttribute(attrName, value);
            }
          }
        } else {
          this.onConnectAriaValues ??= new Map();
          this.onConnectAriaValues.set(name, value);
          // Elements should not add attributes during construction
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
      connected() {
        if (!this.onConnectAriaValues) return;
        for (const [key, value] of this.onConnectAriaValues) {
          this.updateAriaProperty(key, value);
        }
        this.onConnectAriaValues = null;
      },
    });
}
