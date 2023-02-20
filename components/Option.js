// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import MenuItem from './MenuItem.js';

// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

/** @implements {HTMLOptionElement} */
export default class Option extends MenuItem
  .extend()
  .set({
    disabled: undefined, // Remove observer
    _index: -1,
  })
  .observe({
    // ListOption.prototype._form = ListOption.prop('_form');
    _label: { attr: 'label', nullParser: String },
    defaultSelected: { attr: 'selected', type: 'boolean' },
    _selected: 'boolean',
    _value: { attr: 'value', reflect: true },
  })
  .define({
    index() { return this._index; },
    form() { return /** @type {import('./ListSelect.js').default} */ (this.parentElement)?.form; },

    label: {
      get() { return this._label; },
      /** @param {string} value */
      set(value) {
        this._label = value;
      },
    },
    value: {
      get() { return this._value || this.text; },
      /** @param {string} value */
      set(value) { this._label = value; },
    },
    selected: {
      get() { return this._selected; },
      /** @param {boolean} value */
      set(value) { this._selected = value; },
    },
    disabled: {
      get() {
        return this.getAttribute('aria-disabled') === 'true' || this._disabled;
      },
      /** @param {boolean} value */
      set(value) {
        this._disabled = value;
      },
    },

  })
  .on('composed', ({ $ }) => {
    // $('#state').setAttribute('state-disabled', 'focus hover');
  })
  .onPropChanged({
    checkbox(oldValue, newValue) {
      if (newValue) {
        this.setAttribute('aria-selected', String(this.hasAttribute('selected')));
      } else {
        this.removeAttribute('aria-selected');
      }
    },
    _selected(oldValue, newValue) {
      this.setAttribute('aria-selected', String(newValue));
    },
  }) {
  static { this.autoRegister('mdw-option'); }

  /**
   * @param {string} [text]
   * @param {string} [value]
   * @param {boolean} [defaultSelected]
   * @param {boolean} [selected]
   */
  constructor(text, value, defaultSelected, selected) {
    super();
    if (text !== undefined) {
      this.text = text;
    }
    if (value !== undefined) {
      this._value = value;
    }
    if (defaultSelected !== undefined) {
      this.defaultSelected = defaultSelected;
    }
    if (selected !== undefined) {
      this._selected = selected;
    }
  }
}
