// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

import ListItem from './ListItem.js';

// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

export default ListItem
  .extend()
  .mixin(DelegatesFocusMixin)
  .setStatic({
    formAssociated: true,
  })
  .set({
    _ariaRole: 'none',
    _index: -1,
    _selectedDirty: false,
    isInteractive: true,
  })
  .observe({
    // ListOption.prototype._form = ListOption.prop('_form');
    _label: { attr: 'label', reflect: true, nullParser: String },
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
    form() { return /** @type {HTMLInputElement} */ (this.parentElement)?.form; },
    label: {
      get() { return this._label ?? this.textContent; },
      /** @param {string} value */
      set(value) {
        this._label = value;
      },
    },
    value: {
      get() { return this._value ?? this.textContent; },
      /** @param {string} value */
      set(value) { this._value = value; },
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
  .expressions({
    anchorAriaLabelledBy({ _label }) {
      return _label ? null : 'content';
    },
    anchorAriaDescribedBy({ _label }) {
      return _label ? 'content' : null;
    },
    computedIconVariation({ iconVariation, selected }) {
      if (iconVariation != null) return iconVariation;
      return selected ? 'filled' : null;
    },
  })
  .recompose(({ inline, refs: { checkbox, radio, anchor, state, content } }) => {
    // Form Associated elements cannot receive focus unless using delegatesFocus
    // Workaround by redirecting focus to an inner element
    // Reuse HTMLAnchorElement with no HREF
    // Issues: Siblings (images) are not contained within tree

    anchor.setAttribute('disabled', '{disabledState}');
    anchor.setAttribute('role', 'option');
    anchor.setAttribute('aria-disabled', inline(({ disabledState }) => `${disabledState}`));
    anchor.setAttribute('tabindex', '0');
    anchor.setAttribute('aria-selected', inline(({ selected }) => `${selected}`));
    anchor.setAttribute('selected', '{selected}');
    anchor.setAttribute('aria-labelledby', '{anchorAriaLabelledBy}');
    anchor.setAttribute('aria-describedby', '{anchorAriaDescribedBy}');
    anchor.setAttribute('aria-label', '{_label}');
    anchor.removeAttribute('href');
    anchor.removeAttribute('mdw-if');

    // eslint-disable-next-line no-shadow
    checkbox.setAttribute('mdw-if', inline(({ checkbox, icon }) => !icon && checkbox));

    // eslint-disable-next-line no-shadow
    radio.setAttribute('mdw-if', inline(({ radio, icon }) => !icon && radio));

    content.setAttribute('aria-hidden', 'true');
    content.setAttribute('selected', '{selected}');

    state.setAttribute('state-disabled', 'focus');
  })
  .on({
    selectedChanged(previous, current) {
      // Used by HTMLCollection
      this.classList.toggle('mdw-list-option__selected', current);
      this.dispatchEvent(new Event('mdw-list-option:changed', { bubbles: true, composed: true }));
    },
  })
  .css`
    :host {
      --mdw-bg: var(--mdw-color__secondary-container);
      --mdw-ink: var(--mdw-color__on-secondary-container);
      cursor: pointer;
    
      z-index: 0;
    }

    :host([hidden]) {
      display: none;
    }

    :host([href]) {
      cursor: pointer;
    }
    
    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
    }
    
    #content {
      -webkit-user-select: none;
      user-select: none;
      pointer-events: none;
    }
    
    #content[selected] {
      color: rgb(var(--mdw-ink));
    }
    
    #anchor {
      z-index: -1;
    }
    
    #anchor[selected] {
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }
  `
  .extend((BaseClass) => class extends BaseClass {
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

    connectedCallback() {
      super.connectedCallback();
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
      }
    }
  })
  .autoRegister('mdw-list-option');
