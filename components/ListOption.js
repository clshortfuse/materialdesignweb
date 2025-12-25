// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

import ListItem from './ListItem.js';

// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

/**
 * List options represent selectable choices within a `mdw-listbox` or list.
 * @see https://m3.material.io/components/lists/specs
 */
export default ListItem
  .extend()
  .mixin(DelegatesFocusMixin)
  .setStatic({
    formAssociated: true,
  })
  .set({
    /** ARIA role applied to the option container (anchor receives role 'option'). */
    _ariaRole: 'none',

    /** Index of this option within its list/listbox (managed externally). */
    _index: -1,

    /** Internal flag indicating selection was modified via API rather than default. */
    _selectedDirty: false,

    /** Whether this option behaves as an interactive selectable item. */
    isInteractive: true,
  })
  .observe({
    // ListOption.prototype._form = ListOption.prop('_form');

    /**
     * Explicit label for accessibility. Reflected to attribute `label`.
     * Falls back to `textContent` when not provided.
     */
    _label: { attr: 'label', reflect: true, nullParser: String },

    /**
     * Explicit text content for the option. Reflected to attribute `text`.
     */
    _text: { attr: 'text', reflect: true, nullParser: String },

    /**
     * Initial/default selection state (reflected to `selected` attribute).
     * Use `selected` property to control runtime selection.
     */
    defaultSelected: { attr: 'selected', reflect: true, type: 'boolean' },

    /** Internal boolean representing the current selected state. */
    _selected: 'boolean',

    /**
     * Underlying option value (reflected to `value` attribute). Defaults to
     * the option's text content when not provided.
     */
    _value: { attr: 'value', reflect: true },

    /** Set when form association disables the option. */
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
    /** Numeric index of the option inside the parent listbox. */
    index() { return this._index; },

    /** Associated form owner (if any) for form-associated behavior. */
    form() { return /** @type {HTMLInputElement} */ (this.parentElement)?.form; },

    /**
     * Text content for the option; setting updates the internal `_text` field.
     * If not provided, the getter falls back to element textContent.
     */
    text: {
      // Incomplete
      get() { return this._text ?? this.textContent; },
      /** @param {string} value */
      set(value) {
        this._text = value;
      },
    },

    /**
     * Accessible label for the option. Falls back to `text` or the element
     * content when not explicitly set.
     */
    label: {
      get() { return this._label ?? this._text ?? this.textContent; },
      /** @param {string} value */
      set(value) {
        this._label = value;
      },
    },

    /**
     * Option `value` used when the option is selected in a form. Defaults to
     * the option's text when not explicitly defined.
     */
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
