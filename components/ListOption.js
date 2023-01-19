// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import ListItem from './ListItem.js';

// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

/** @implements {HTMLOptionElement} */
export default class ListOption extends ListItem
  .extend()
  .set({
    delegatesFocus: false,
    _index: -1,
  })
  .set({
    _dirty: false,
  })
  .observe({
    // ListOption.prototype._form = ListOption.prop('_form');
    _label: { attr: 'label', nullParser: String },
    defaultSelected: { attr: 'selected', type: 'boolean' },
    _selected: 'boolean',
    _value: { attr: 'value', reflect: true },
  })
  .observe({
    selected: {
      reflect: false,
      type: 'boolean',
      get({ _dirty, defaultSelected, _selected }) {
        if (!_dirty) return defaultSelected;
        return _selected;
      },
      /** @param {boolean} value */
      set(value) {
        this._dirty = true;
        this._selected = value;
      },
    },
  })
  .define({
    isInteractive() { return true; },
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
  .on({
    composed({ $, inline }) {
      $('#headline-text').append(
        $('#slot'),
      );
      const anchor = $('#anchor');
      anchor.setAttribute('role', 'option');
      anchor.setAttribute('aria-disabled', inline(({ disabled }) => (disabled ? 'true' : 'false')));
      $('#state').setAttribute('state-disabled', 'focus hover');
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
  }
}
