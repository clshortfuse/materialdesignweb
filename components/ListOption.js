// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

import ListItemBase from './ListItemBase.js';
// https://html.spec.whatwg.org/multipage/form-elements.html#htmloptionelement

const LISTBOX_NAME = 'mdw-listbox';
/** @typedef {HTMLFormElement|null} ListOptionForm */
/** @type {WeakMap<HTMLElement, HTMLElement>} */
const listOptionOwners = new WeakMap();

/** @param {Node} node @return {string} */
function collectOptionText(node) {
  let text = '';
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.nodeValue;
    } else if (child instanceof Element && child.localName !== 'script') {
      text += collectOptionText(child);
    }
  }
  return text.replaceAll(/[\t\n\f\r ]+/g, ' ').trim();
}

/** @param {HTMLElement} option */
function notifyListOptionChanged(option) {
  option.dispatchEvent(new Event('mdw-list-option:changed', {
    bubbles: true,
    composed: true,
  }));
}

/** @param {HTMLElement} option */
function releaseListOptionOwner(option) {
  const owner = listOptionOwners.get(option);
  listOptionOwners.delete(option);
  if (!owner || option.parentElement === owner) return;
  owner.dispatchEvent(new CustomEvent('mdw-list-option:disconnected', {
    detail: option,
  }));
}

/**
 * List options represent selectable choices within a `mdw-listbox` or list.
 * @see https://m3.material.io/components/lists/specs
 */
export default ListItemBase
  .extend()
  .mixin(DelegatesFocusMixin)
  .set({
    /** The inner anchor exposes the option role. */
    _ariaRole: 'none',
    /** Runtime selection no longer follows the default. */
    _selectedDirty: false,
    /** Last synchronously assigned direct-owner index. */
    _index: -1,
    /** Preserve ListItem interaction presentation. */
    isInteractive: true,
  })
  .set(/** @type {{form: ListOptionForm}} */ ({ form: null }))
  .observe({
    /**
     * Explicit label for accessibility. Reflected to attribute `label`.
     * Falls back to `text` when not provided.
     */
    _label: { attr: 'label', reflect: true },
    /** Explicit option text. Reflected to attribute `text`. */
    _text: { attr: 'text', reflect: true },
    /** Initial/default selection state reflected to the `selected` attribute. */
    defaultSelected: { attr: 'selected', reflect: true, type: 'boolean' },
    /** Internal boolean representing the current selected state. */
    _selected: 'boolean',
    /** Explicit option value. Falls back to `text` when absent. */
    _value: { attr: 'value', reflect: true },
  })
  .observe({
    /** Current selection; setting it marks selectedness dirty. */ selected: {
      reflect: false,
      type: 'boolean',
      get({ _selected }) { return _selected; },
      /** @param {boolean} value */
      set(value) {
        this._selectedDirty = true;
        this._selected = value;
      },
    },
    /** Effective disabled state. */ disabledState({ disabled }) { return !!disabled; },
  })
  .define({
    /** Numeric index inside a direct owning Listbox, or -1 when unowned. */
    index() {
      const owner = this.parentElement;
      if (owner?.localName !== LISTBOX_NAME) return -1;
      const indexedOptions = /** @type {Map<HTMLElement, number>|null} */ (
        /** @type {any} */ (owner)._indexedOptions);
      const indexed = indexedOptions?.get(this);
      if (indexed != null) return indexed;
      let index = 0;
      for (const element of owner.children) {
        if (element.localName !== this.localName) continue;
        if (element === this) return index;
        index += 1;
      }
      return -1;
    },
    /** Option text normalized like `HTMLOptionElement.text`. */
    text: {
      get() { return this._text ?? collectOptionText(this); },
      /** @param {string} value */
      set(value) {
        this.textContent = String(value);
        const hadExplicitText = this._text != null;
        this._text = null;
        if (!hadExplicitText) {
          notifyListOptionChanged(this);
        }
      },
    },
    /** Accessible label, falling back to normalized option text. */
    label: {
      get() { return this._label ?? this._text ?? collectOptionText(this); },
      /** @param {string} value */
      set(value) {
        this._label = String(value);
      },
    },
    /** Submitted option value, falling back to explicit or collected text. */
    value: {
      get() { return this._value ?? this._text ?? collectOptionText(this); },
      /** @param {string} value */
      set(value) { this._value = String(value); },
    },
  })
  .methods({
    /** @type {HTMLElement['focus']} */
    focus(...options) { this.refs.anchor.focus(...options); },
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
    // Redirect focus to the inner option surface so options retain their
    // interactive ListItem presentation without becoming form controls.
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
    defaultSelectedChanged(oldValue, newValue) {
      if (!this._selectedDirty) {
        this._selected = newValue;
      }
    },
    selectedChanged(previous, current) {
      this.classList.toggle('mdw-list-option__selected', current);
      notifyListOptionChanged(this);
    },
    _textChanged() {
      if (this._value == null) {
        notifyListOptionChanged(this);
      }
    },
    _valueChanged() {
      notifyListOptionChanged(this);
    },
    disabledStateChanged() {
      notifyListOptionChanged(this);
    },
    connected() {
      const owner = /** @type {(HTMLElement & Record<string, any>)|null} */ (this.parentElement);
      if (owner?.localName === LISTBOX_NAME) {
        listOptionOwners.set(this, owner);
        const index = owner._indexedOptions?.get(this);
        let previousOption = this.previousElementSibling;
        while (previousOption && previousOption.localName !== this.localName) {
          previousOption = previousOption.previousElementSibling;
        }
        if (index == null
          || owner._indexedOptionsArray?.[index - 1] !== (previousOption ?? undefined)) {
          notifyListOptionChanged(this);
        }
      }
    },
    disconnected() {
      releaseListOptionOwner(this);
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
        this.value = value;
      }
      if (defaultSelected !== undefined) {
        this.defaultSelected = defaultSelected;
      }
      if (selected === undefined) {
        this._selected = false;
      } else {
        this._selectedDirty = true;
        this._selected = selected;
      }
    }

    /** @return {ListOptionForm} Associated form of a direct owning Listbox. */
    // @ts-expect-error -- Replace the typed prototype field with a read-only getter.
    get form() {
      const owner = /** @type {HTMLElement & {form?: ListOptionForm}} */ (this.parentElement);
      if (owner?.localName !== LISTBOX_NAME) return null;
      return owner.form ?? null;
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
      }
    }
  })
  .autoRegister('mdw-list-option');
