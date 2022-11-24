// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import ListItem from './ListItem.js';

/** @implements {HTMLOptionElement} */
export default class ListOption extends ListItem {
  static { this.autoRegister(); }

  static elementName = 'mdw-list-option';

  static ariaRole = 'option';

  static delegatesFocus = false;

  static get template() {
    const template = super.template;
    template.getElementById('headline-text').append(
      template.getElementById('slot'),
    );
    template.getElementById('state').setAttribute('state-disabled', 'focus hover');
    return template;
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

  /** @type {ListItem['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'checkbox':
        if (newValue) {
          this.setAttribute('aria-selected', String(this.hasAttribute('selected')));
        } else {
          this.removeAttribute('aria-selected');
        }
        break;
      case '_selected':
        // /** @type {Checkbox} */ (this.refs.checkbox) = newValue;
        this.setAttribute('aria-selected', String(newValue));
        break;
      default:
    }
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

ListOption.idls.delete('disabled');
ListOption.prototype._disabled = ListOption.idl('_disabled', { attr: 'disabled', reflect: true, type: 'boolean' });
// [CEReactions] attribute boolean disabled;
ListOption.prototype._form = ListOption.idl('_form');
ListOption.prototype._label = ListOption.idl('_label', { attr: 'label', onNullish: String });
ListOption.prototype.defaultSelected = ListOption.idl('defaultSelected', { attr: 'selected', type: 'boolean' });
ListOption.prototype._selected = ListOption.idl('_selected', 'boolean');
ListOption.prototype._value = ListOption.idl('_value', { attr: 'value', reflect: true });
// [CEReactions] attribute DOMString value;
// ListOption.prototype.text = ListOption.idl('text');
// readonly attribute long index;

// window.ListOption = ListOption;
