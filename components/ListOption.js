// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import ListItem from './ListItem.js';

/** @implements {HTMLOptionElement} */
export default class ListOption extends ListItem {
  static { this.autoRegister('mdw-list-option'); }

  static {
    this.on('composed', ({ $ }) => {
      $('#headline-text').append(
        $('#slot'),
      );
      $('#state').setAttribute('state-disabled', 'focus hover');
    });
  }

  /** @type {HTMLFormElement} */
  _form;

  _index = -1;

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

  static {
    this.onPropChanged({
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
    });
  }

  isInteractive() {
    return true;
  }

  get form() {
    return this._form;
  }

  get label() {
    return this._label;
  }

  /** @param {string} v */
  set label(v) {
    this._label = v;
  }

  get value() {
    return this._value || this.text;
  }

  /** @param {string} v */
  set value(v) {
    this._value = v;
  }

  get selected() { return this._selected; }

  /** @param {boolean} v */
  set selected(v) {
    this._selected = v;
  }

  get index() { return this._index; }

  // @ts-ignore @override
  get disabled() {
    return this.getAttribute('aria-disabled') === 'true' || this._disabled;
  }

  /** @param {boolean} v */
  set disabled(v) {
    this._disabled = v;
  }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

ListOption.propList.delete('disabled');
ListOption.prototype._disabled = ListOption.prop('_disabled', { attr: 'disabled', reflect: true, type: 'boolean' });
// [CEReactions] attribute boolean disabled;
ListOption.prototype._form = ListOption.prop('_form');
ListOption.prototype._label = ListOption.prop('_label', { attr: 'label', nullParser: String });
ListOption.prototype.defaultSelected = ListOption.prop('defaultSelected', { attr: 'selected', type: 'boolean' });
ListOption.prototype._selected = ListOption.prop('_selected', 'boolean');
ListOption.prototype._value = ListOption.prop('_value', { attr: 'value', reflect: true });
// [CEReactions] attribute DOMString value;
// ListOption.prototype.text = ListOption.prop('text');
// readonly attribute long index;

// window.ListOption = ListOption;
ListOption.prototype.ariaRole = 'option';

ListOption.prototype.delegatesFocus = false;
