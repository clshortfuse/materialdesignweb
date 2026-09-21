import { constructHTMLOptionsCollectionProxy } from '../dom/HTMLOptionsCollectionProxy.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import List from './List.js';
import ListOption from './ListOption.js';

/** @typedef {InstanceType<typeof ListOption>} ListOptionElement */

/**
 * @typedef {HTMLCollectionOf<ListOptionElement> & {
 *   length: number,
 *   selectedIndex: number,
 *   add(element: ListOptionElement, before?: ListOptionElement|number): void,
 *   remove(index: number): void,
 * }} ListOptionsCollection
 */

/** @param {Element} element @return {element is ListOptionElement} */
function isListOption(element) {
  return element.localName === ListOption.elementName;
}

/** @param {Element} element @return {element is ListOptionElement} */
function isSelectedListOption(element) {
  return isListOption(element) && element.selected;
}

/**
 * @param {HTMLElement} listbox
 * @param {EventTarget|null} target
 * @return {target is ListOptionElement}
 */
function isDirectListOption(listbox, target) {
  return target instanceof ListOption && target.parentElement === listbox;
}

/**
 * @param {HTMLElement & Record<string, any>} listbox
 * @param {ListOptionElement[]} selectedOptions
 * @param {number[]} selectedIndexes
 */
function commitListboxState(listbox, selectedOptions, selectedIndexes) {
  listbox._value = selectedOptions[0]?.value ?? '';
  listbox._updateFormValidity(selectedOptions[0]);
  listbox._updateFormAssociatedValue(selectedOptions, selectedIndexes);
}

/** @param {HTMLElement & Record<string, any>} listbox */
function syncListboxState(listbox) {
  /** @type {ListOptionElement[]} */
  const selectedOptions = [];
  /** @type {number[]} */
  const selectedIndexes = [];
  let index = 0;
  for (const option of listbox.options) {
    if (option.selected) {
      selectedOptions.push(option);
      selectedIndexes.push(index);
    }
    index += 1;
  }
  commitListboxState(listbox, selectedOptions, selectedIndexes);
}

/** @param {HTMLElement & Record<string, any>} listbox */
function syncOptionTopology(listbox) {
  listbox._indexedOptionsArray = null;
  const previouslyIndexed = listbox._indexedOptions ?? new Map();
  /** @type {Map<ListOptionElement, number>} */
  const indexedOptions = new Map();
  /** @type {ListOptionElement[]} */
  const indexedOptionsArray = [];
  /** @type {ListOptionElement[]} */
  const selectedOptions = [];
  /** @type {number[]} */
  const selectedIndexes = [];
  /** @type {ListOptionElement|null} */
  let firstEnabledOption = null;
  /** @type {ListOptionElement|null} */
  let retainedOption = null;
  let retainedIndex = -1;
  let retainedPriority = 0;
  let index = 0;
  const previousHandlingSelectedness = listbox._handlingSelectedness;
  listbox._handlingSelectedness = true;
  try {
    for (const option of listbox.options) {
      indexedOptions.set(option, index);
      indexedOptionsArray.push(option);
      option._index = index;
      if (firstEnabledOption == null && !option.disabledState) {
        firstEnabledOption = option;
      }
      if (option.selected) {
        if (listbox.multiple) {
          selectedOptions.push(option);
          selectedIndexes.push(index);
        } else {
          const priority = previouslyIndexed.has(option) ? 1 : 2;
          if (priority >= retainedPriority) {
            if (retainedOption) {
              retainedOption._selected = false;
            }
            retainedOption = option;
            retainedIndex = index;
            retainedPriority = priority;
          } else {
            option._selected = false;
          }
        }
      }
      index += 1;
    }
    if (!listbox.multiple) {
      if (!retainedOption && listbox.size <= 1 && firstEnabledOption) {
        firstEnabledOption._selected = true;
        retainedOption = firstEnabledOption;
        retainedIndex = indexedOptions.get(firstEnabledOption);
      }
      if (retainedOption) {
        selectedOptions.push(retainedOption);
        selectedIndexes.push(retainedIndex);
      }
    }
  } finally {
    listbox._handlingSelectedness = previousHandlingSelectedness;
  }
  for (const option of previouslyIndexed.keys()) {
    if (!indexedOptions.has(option)) {
      option._index = -1;
    }
  }
  listbox._indexedOptions = indexedOptions;
  listbox._indexedOptionsArray = indexedOptionsArray;
  commitListboxState(listbox, selectedOptions, selectedIndexes);
}

/** @param {HTMLElement & Record<string, any>} listbox @return {boolean} */
function optionTopologyIsCurrent(listbox) {
  const indexedOptions = listbox._indexedOptions;
  if (!indexedOptions) return false;
  let index = 0;
  for (const element of listbox.children) {
    if (!isListOption(element)) continue;
    if (indexedOptions.get(element) !== index++) return false;
  }
  return indexedOptions.size === index;
}

/** @param {HTMLElement & Record<string, any>} listbox */
function beginOptionsMutation(listbox) {
  if (listbox._optionsMutationDepth === 0) {
    listbox._optionsMutationPreviousHandling = listbox._handlingSelectedness;
  }
  listbox._optionsMutationDepth += 1;
  listbox._handlingSelectedness = true;
}

/** @param {HTMLElement & Record<string, any>} listbox */
function endOptionsMutation(listbox) {
  listbox._optionsMutationDepth -= 1;
  if (listbox._optionsMutationDepth !== 0) return;
  listbox._handlingSelectedness = listbox._optionsMutationPreviousHandling;
  syncOptionTopology(listbox);
}

/** @param {HTMLElement & Record<string, any>} listbox */
function restoreDefaultSelection(listbox) {
  const options = [...listbox.options];
  /** @type {ListOptionElement|null} */
  let lastDefaultSelected = null;
  for (const option of options) {
    if (option.defaultSelected) {
      lastDefaultSelected = option;
    }
  }
  const previousHandlingSelectedness = listbox._handlingSelectedness;
  listbox._handlingSelectedness = true;
  try {
    for (const option of options) {
      option._selectedDirty = false;
      option._selected = option.defaultSelected
        && (listbox.multiple || option === lastDefaultSelected);
    }
  } finally {
    listbox._handlingSelectedness = previousHandlingSelectedness;
  }
  syncOptionTopology(listbox);
}

/** @param {HTMLElement & Record<string, any>} listbox */
function releaseIndexedOptions(listbox) {
  for (const option of listbox._indexedOptions?.keys() ?? []) {
    option._index = -1;
  }
  listbox._indexedOptions = null;
  listbox._indexedOptionsArray = null;
}

/** @this {HTMLElement & Record<string, any>} @param {Event} event */
function handleListboxClick(event) {
  const target = event.target;
  if (!isDirectListOption(this, target)) return;
  event.stopImmediatePropagation();
  if (this.disabledState || target.disabledState) return;

  let changed = false;
  const previousHandlingSelectedness = this._handlingSelectedness;
  this._handlingSelectedness = true;
  try {
    if (target.selected) {
      if (this.multiple || !this.required) {
        target.selected = false;
        changed = true;
      }
    } else {
      if (!this.multiple) {
        for (const option of this.options) {
          if (option.selected) {
            option.selected = false;
          }
        }
      }
      target.selected = true;
      changed = true;
    }
  } finally {
    this._handlingSelectedness = previousHandlingSelectedness;
  }
  if (!changed) return;
  syncListboxState(this);
  this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  this.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Listbox: a selectable list of options, used for autocompletes and selects.
 * implements {HTMLSelectElement}
 * @see https://m3.material.io/components/lists/specs
 */
export default List
  .extend()
  .mixin(StateMixin)
  .mixin(FormAssociatedMixin)
  .mixin(DelegatesFocusMixin)
  .set({
    _ariaRole: 'listbox',
    _listRole: 'listbox',
    /** Stable live options collection. @type {ListOptionsCollection|null} */
    _optionsCollection: null,
    /** Stable live selected-options collection. @type {HTMLCollectionOf<ListOptionElement>|null} */
    _selectedOptionsCollection: null,
    /** Last direct-option index assignment. @type {Map<ListOptionElement, number>|null} */
    _indexedOptions: null,
    /** Ordered fast path for indexed reads. @type {ListOptionElement[]|null} */
    _indexedOptionsArray: null,
    _handlingSelectedness: false,
    _optionsMutationDepth: 0,
    _optionsMutationPreviousHandling: false,
    _handleFormReset: true,
  })
  .observe({
    /** When true, multiple options may be selected. */
    multiple: 'boolean',
    /** Visible row count; 0 means automatic sizing. */
    size: { type: 'integer', empty: 0 },
  })
  .define({
    /** @return {ListOptionsCollection} */
    options() {
      if (!this._optionsCollection) {
        /** @type {HTMLCollectionOf<ListOptionElement>|null} */
        let selectedOptions = null;
        this._optionsCollection = constructHTMLOptionsCollectionProxy({
          host: this,
          accept: isListOption,
          getIndexedElements: () => this._indexedOptionsArray,
          acceptSelected: isSelectedListOption,
          receiveSelectedOptions(collection) { selectedOptions = collection; },
          OptionConstructor: ListOption,
          beforeMutation: () => beginOptionsMutation(this),
          afterMutation: () => endOptionsMutation(this),
        });
        this._selectedOptionsCollection = selectedOptions;
      }
      return this._optionsCollection;
    },
  })
  .define({
    /** @return {HTMLCollectionOf<ListOptionElement>} */
    selectedOptions() {
      void this.options;
      return this._selectedOptionsCollection;
    },
    /** Native-compatible control type. */ type() { return this.multiple ? 'select-multiple' : 'select-one'; },
    /** Matching direct children owned by keyboard navigation. */ kbdNavQuery() { return ListOption.elementName; },
  })
  .overrides({
    /** @param {ListOptionElement} [selectedOption] */
    _updateFormValidity(selectedOption = this.selectedOptions[0]) {
      const placeholderSelected = !this.multiple
        && this.size <= 1
        && selectedOption === this.options[0]
        && selectedOption?.value === '';
      const valueMissing = this.required
        && (selectedOption == null || placeholderSelected);
      const customMessage = this._customValidityMessage;
      const message = customMessage || (valueMissing ? 'Please select an option.' : '');
      /** @type {ValidityStateFlags} */
      const validity = { valueMissing, customError: !!customMessage };
      this.elementInternals.setValidity(validity, message);
      this._invalid = !!message;
      this._validationMessage = message;
    },
    /**
     * @param {ListOptionElement[]} [selectedOptions]
     * @param {number[]} [selectedIndexes]
     */
    _updateFormAssociatedValue(selectedOptions, selectedIndexes) {
      if (!selectedOptions || !selectedIndexes) {
        // `_value` is derived above; ignore the inherited value observer's
        // no-argument callback to avoid a reentrant collection scan.
        return;
      }
      const state = `,${selectedIndexes}`;
      if (this.multiple) {
        const formData = new FormData();
        if (this.name) {
          for (const option of selectedOptions) {
            if (!option.disabledState) {
              formData.append(this.name, option.value);
            }
          }
        }
        this.elementInternals.setFormValue(formData, state);
        return;
      }
      const [selectedOption] = selectedOptions;
      this.elementInternals.setFormValue(
        selectedOption?.disabledState ? null : selectedOption?.value ?? null,
        state,
      );
    },
    /**
     * @param {string|FormData} state
     * @param {'autocomplete'|'restore'} mode
     */
    formStateRestoreCallback(state, mode) {
      void mode;
      if (typeof state === 'string') {
        if (state[0] !== ',') {
          this.value = state;
          return;
        }
        const selectedIndexes = new Set(state.split(','));
        const previousHandlingSelectedness = this._handlingSelectedness;
        this._handlingSelectedness = true;
        let index = 0;
        try {
          for (const option of this.options) {
            option._selectedDirty = true;
            option._selected = selectedIndexes.has(`${index++}`);
          }
        } finally {
          this._handlingSelectedness = previousHandlingSelectedness;
        }
        syncListboxState(this);
        return;
      }
      if (this.multiple && state instanceof FormData) {
        /** @type {Map<string, number>} */
        const restoredValues = new Map();
        for (const value of state.getAll(this.name)) {
          if (typeof value !== 'string') continue;
          restoredValues.set(value, (restoredValues.get(value) ?? 0) + 1);
        }
        const previousHandlingSelectedness = this._handlingSelectedness;
        this._handlingSelectedness = true;
        try {
          for (const option of this.options) {
            const remaining = restoredValues.get(option.value) ?? 0;
            option._selectedDirty = true;
            option._selected = remaining > 0;
            if (remaining > 0) {
              restoredValues.set(option.value, remaining - 1);
            }
          }
        } finally {
          this._handlingSelectedness = previousHandlingSelectedness;
        }
        syncListboxState(this);
      }
    },
  })
  .define({
    length: {
      get() { return this.options.length; },
      /** @param {number} value */
      set(value) { this.options.length = value; },
    },
    selectedIndex: {
      /** @return {number} */
      get() { return this.options.selectedIndex; },
      /** @param {number} value */
      set(value) {
        const itemToSelect = this.options.item(value);
        const previousHandlingSelectedness = this._handlingSelectedness;
        this._handlingSelectedness = true;
        try {
          for (const option of this.options) {
            option._selectedDirty = true;
            option._selected = option === itemToSelect;
          }
        } finally {
          this._handlingSelectedness = previousHandlingSelectedness;
        }
        syncListboxState(this);
      },
    },
    value: {
      get() { return this.selectedOptions[0]?.value ?? ''; },
      /** @param {string} value */
      set(value) {
        const stringValue = `${value}`;
        let found = false;
        const previousHandlingSelectedness = this._handlingSelectedness;
        this._handlingSelectedness = true;
        try {
          for (const option of this.options) {
            /** @type {boolean} */
            const shouldSelect = !found && option.value === stringValue;
            option._selectedDirty = true;
            option._selected = shouldSelect;
            found ||= shouldSelect;
          }
        } finally {
          this._handlingSelectedness = previousHandlingSelectedness;
        }
        syncListboxState(this);
      },
    },
    add() { return this.options.add; },
  })
  .methods({
    * [Symbol.iterator]() {
      yield* this.options;
    },
    focus() {
      if (!this.disabledState) {
        this.focusCurrentOrFirst();
      }
    },
    /** @param {number} index @return {ListOptionElement|null} */
    item(index) { return this.options.item(index); },
    /** @param {string} name @return {ListOptionElement|null} */
    namedItem(name) { return this.options.namedItem(name); },
  })
  .css`
    :host(:is(:disabled, [internals-disabled])) {
      cursor: not-allowed;
      pointer-events: none;
    }
  `
  .events({
    'mdw-list-option:changed'(event) {
      const target = event.target;
      if (!isDirectListOption(this, target)) return;
      event.stopPropagation();
      if (this._handlingSelectedness) return;
      if (!optionTopologyIsCurrent(this)) {
        syncOptionTopology(this);
        return;
      }

      if (!this.multiple && target.selected) {
        const previousHandlingSelectedness = this._handlingSelectedness;
        this._handlingSelectedness = true;
        try {
          for (const option of this.options) {
            if (option !== target && option.selected) {
              option._selected = false;
            }
          }
        } finally {
          this._handlingSelectedness = previousHandlingSelectedness;
        }
      }
      syncListboxState(this);
    },
    'mdw-list-option:disconnected'(event) {
      if (event.target !== this || this._handlingSelectedness) return;
      syncOptionTopology(this);
    },
    focus() {
      if (!this.disabledState) {
        this.focusCurrentOrFirst();
      }
    },
    '*keydown'(event) {
      const { key } = /** @type {KeyboardEvent} */ (/** @type {unknown} */ (event));
      if (key === 'ArrowUp' || key === 'Up'
        || key === 'ArrowDown' || key === 'Down'
        || key === 'ArrowLeft' || key === 'Left'
        || key === 'ArrowRight' || key === 'Right'
        || key === 'Home' || key === 'End') {
        this.refreshTabIndexes();
      }
    },
    keydown(event) {
      if (event.key !== 'Spacebar' && event.key !== ' ') return;
      if (!isDirectListOption(this, event.target)) return;
      event.stopPropagation();
      event.preventDefault();
      handleListboxClick.call(this, event);
    },
    click: handleListboxClick,
  })
  .childEvents({
    slot: {
      slotchange() {
        if (!this.isConnected || optionTopologyIsCurrent(this)) return;
        syncOptionTopology(this);
      },
    },
  })
  .on({
    disabledStateChanged(oldValue, newValue) { this.tabIndex = newValue ? -1 : 0; },
    multipleChanged(oldValue, newValue) {
      this.updateAriaProperty('ariaMultiSelectable', newValue ? 'true' : 'false');
      if (!newValue) {
        let retainedSelected = false;
        const previousHandlingSelectedness = this._handlingSelectedness;
        this._handlingSelectedness = true;
        try {
          for (const option of this.options) {
            if (!option.selected) continue;
            if (retainedSelected) {
              option._selected = false;
            } else {
              retainedSelected = true;
            }
          }
        } finally {
          this._handlingSelectedness = previousHandlingSelectedness;
        }
      }
      syncOptionTopology(this);
    },
    nameChanged() { syncListboxState(this); },
    requiredChanged() { this._updateFormValidity(); },
    sizeChanged() { syncOptionTopology(this); },
    _formResetChanged(oldValue, newValue) {
      if (newValue && this._handleFormReset) {
        restoreDefaultSelection(this);
      }
    },
    connected() {
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
      }
      syncOptionTopology(this);
    },
    disconnected() { releaseIndexedOptions(this); },
  })
  .autoRegister('mdw-listbox');
