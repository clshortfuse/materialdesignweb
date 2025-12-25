/**
 * @template K
 * @typedef {K extends keyof ARIAMixin ? ARIAMixin[K] extends string ? K : never : never} StringKeyOfARIAMixin
 */

/**
 * Reflects ARIA-like properties to attributes/ElementInternals and vice versa.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaReflectorMixin(Base) {
  return Base
    .observe({
      /** Role string mirrored to ARIA `role` property/attribute. */
      _ariaRole: 'string',
    })
    .set({
      /**
       * Browsers that do not support ARIAMixin in ElementInternals need to have
       * their attributes set after construction.
       * @type {Map<StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[StringKeyOfARIAMixin<keyof ARIAMixin>]>}
       */
      _onConnectAriaValues: null,
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
       * @template {StringKeyOfARIAMixin<keyof ARIAMixin>} K
       * @param {K} name
       * @param {ARIAMixin[K]} value
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
          this._onConnectAriaValues ??= new Map();
          this._onConnectAriaValues.set(name, value);
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
        if (!this._onConnectAriaValues) return;
        for (const [key, value] of this._onConnectAriaValues) {
          this.updateAriaProperty(key, value);
        }
        this._onConnectAriaValues = null;
      },
    });
}
