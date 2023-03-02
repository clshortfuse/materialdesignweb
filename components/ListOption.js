// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import ListItem from './ListItem.js';

// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

/** @implements {HTMLOptionElement} */
export default class ListOption extends ListItem
  .extend()
  .setStatic({
    formAssociated: true,
  })
  .set({
    delegatesFocus: true,
    _index: -1,
    _selectedDirty: false,
    isInteractive: true,
  })
  .observe({
    // ListOption.prototype._form = ListOption.prop('_form');
    _label: { attr: 'label', nullParser: String },
    defaultSelected: { attr: 'selected', reflect: true, type: 'boolean' },
    _selected: 'boolean',
    _value: { attr: 'value', reflect: true },
    _formDisabled: 'boolean',
  })
  .observe({
    selected: {
      reflect: false,
      type: 'boolean',
      get({ _selectedDirty, defaultSelected, _selected }) {
        if (!_selectedDirty) return defaultSelected;
        return _selected;
      },
      /** @param {boolean} value */
      set(value) {
        this._selectedDirty = true;
        this._selected = value;
      },
    },
    disabledState({ _formDisabled, disabled }) {
      if (_formDisabled) return true;
      return !!disabled;
    },
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
  })
  .methods({
    /** @param {boolean} formDisabled  */
    formDisabledCallback(formDisabled) {
      this._formDisabled = formDisabled;
    },
    /** @type {HTMLElement['focus']} */
    focus(...options) {
      this.refs.anchor.focus(...options);
    },
  })
  .on({
    composed({ inline }) {
      const { headlineText, slot, anchor, state } = this.refs;
      headlineText.append(slot);
      anchor.setAttribute('role', 'option');
      anchor.setAttribute('aria-disabled', inline(({ disabledState }) => (disabledState ? 'true' : 'false')));
      anchor.setAttribute('tabindex', '0');
      state.setAttribute('state-disabled', 'focus');
    },
  }) {
  static { this.autoRegister('mdw-list-option'); }

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
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }
}
