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

      /** Reads authored role changes for the attribute-reflection fallback. */
      _ariaRoleAttribute: { attr: 'role', reflect: 'read' },
    })
    .set({
      /** Role attribute captured before any internal fallback reflection. */
      _authoredAriaRole: null,

      /** Prevents internal fallback reflection from being treated as authored. */
      _updatingAriaRole: false,

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
        /** @type {string} */
        let attrName = name;
        if (attrName.startsWith('aria')) {
          attrName = `aria-${attrName.slice(4).toLowerCase()}`;
        }
        return this.getAttribute(attrName)
          ?? this[name]
          ?? this.elementInternals?.[name]
          ?? null;
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
              this._updatingAriaRole = name === 'role';
              try {
                this.removeAttribute(attrName);
              } finally {
                this._updatingAriaRole = false;
              }
            } else {
              this._updatingAriaRole = name === 'role';
              try {
                this.setAttribute(attrName, value);
              } finally {
                this._updatingAriaRole = false;
              }
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
        if (!(this.elementInternals && 'role' in this.elementInternals)
          && this._authoredAriaRole != null) return;
        this.updateAriaProperty('role', newValue);
      },
      _ariaRoleAttributeChanged(oldValue, newValue) {
        if (this._updatingAriaRole) return;
        this._authoredAriaRole = newValue;
        if (newValue == null) {
          this.updateAriaProperty('role', this._ariaRole);
        }
      },
      constructed() {
        this._authoredAriaRole = this.getAttribute('role');
        if ((this.elementInternals && 'role' in this.elementInternals)
          || this._authoredAriaRole == null) {
          this.updateAriaProperty('role', this._ariaRole);
        }
      },
      connected() {
        if (!this._onConnectAriaValues) return;
        for (const [key, value] of this._onConnectAriaValues) {
          if (key === 'role'
            && !(this.elementInternals && 'role' in this.elementInternals)
            && this.getAttribute('role') !== this._authoredAriaRole) continue;
          this.updateAriaProperty(key, value);
        }
        this._onConnectAriaValues = null;
      },
    });
}
