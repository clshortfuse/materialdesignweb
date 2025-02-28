/* https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ */
/* https://learn.microsoft.com/en-us/dotnet/api/system.windows.controls.combobox.iseditable?view=windowsdesktop-7.0#remarks */

import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import Popup from './Popup.js';

/** @typedef {import('./Listbox.js').default} Listbox */

/** @type {InstanceType<import('./Popup.js').default>} */
let sharedPopup;

/** @return {InstanceType<import('./Popup.js').default>} */
function getSharedPopup() {
  if (!sharedPopup) {
    sharedPopup = new Popup();
    sharedPopup.scrollable = true;
    sharedPopup.shapeStyle = 'extra-small';
    sharedPopup.color = 'surface';
    sharedPopup.matchSourceWidth = true;
    sharedPopup.flow = 'corner';
    sharedPopup.elevation = 2;
  }
  return sharedPopup;
}

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(InputMixin)
  .mixin(TextFieldMixin)
  .mixin(ResizeObserverMixin)
  .observe({
    autocompleteInline: 'boolean',
    autocompleteList: 'string',
    autosuggestInline: 'boolean',
    /** If true, when listbox is open, arrow navigation will automatically select options. */
    autoSelect: 'boolean',
    _expanded: 'boolean',
    /** If true, when listbox is open, <ESC> accepts current suggestion, same as <Enter>. */
    acceptOnEscape: 'boolean',
    _listbox: {
      type: 'object',
      /** @type {InstanceType<Listbox>} */
      value: null,
    },
    _focusedValue: 'string',
    _focusedPosInSet: { value: -1 },
    _listboxSize: { value: -1 },
    _draftInput: { type: 'string', nullable: false },
    _hasSuggestion: 'boolean',
    _listboxValue: 'string',
    _lastComputedListboxValue: { type: 'string', nullable: false },
    _values: {
      type: 'array',
      /** @type {string[]} */
      value: [],
    },
    _chipSelected: 'boolean',
  })
  .observe({
    _hasListbox({ _listbox }) {
      return !!_listbox;
    },
    _isSelect({ type }) {
      return type.toLowerCase() === 'select-one' || type.toLocaleLowerCase() === 'select-multiple';
    },
  })
  .define({
    listbox() {
      return this._listbox;
    },
  })
  .set({
    /** @type {EventListener} */
    _onListboxChangeListener: null,
    /** @type {EventListener} */
    _onListboxClickListener: null,
    /** @type {EventListener} */
    _onPopupFocusoutListener: null,
    _suggestionText: '',
    _suggestionValue: '',
    /** @type {HTMLOptionElement} */
    _suggestionOption: null,
  })
  .define({
    stateTargetElement() { return this.refs.control; },
  })
  .methods({
    onResizeObserved() {
      if (!this._expanded) return;
      getSharedPopup().updatePopupPosition(this.refs.shape);
    },
    /**
     * Listbox should close if clicking own selection
     * @param {Event} event
     */
    onListboxClick(event) {
      this.closeListbox();
      // Revert focus back
      this.refs.control.focus();
    },
    /**
     * @param {Event} event
     */
    onListboxChange(event) {
      if (this.multiple) {
        const values = [...this._listbox.selectedOptions].map((option) => option.value);
        this._values = values;
        if (this._input.value) {
          this.closeListbox();
        }
        return;
      }
      const option = this._listbox.selectedOptions.item(0);
      this.render({
        selectedOption: option,
      });

      const { label: suggestionText, value: suggestionValue } = option;
      this._suggestionText = suggestionText;
      this._suggestionValue = suggestionValue;
      this._suggestionOption = option;
      this._hasSuggestion = true;
      this.acceptSuggestion(true);
      this.closeListbox();
      this.refs.control.focus();
    },
    /** @param {FocusEvent} Event */
    onPopupFocusout({ relatedTarget }) {
      if (!this._expanded) return;
      // Ignore if focus lost to pop-up (likely pointerdown).
      if (relatedTarget) {
        if (this === relatedTarget) return;
        if (this.contains(/** @type {any} */ (relatedTarget))) return;
        if (getSharedPopup().contains(/** @type {any} */ (relatedTarget))) return;
      }
      this.closeListbox();
    },
    applyAutocompleteList() {
      const { _listbox, _draftInput } = this;
      if (!_listbox) return;

      const lowerCase = _draftInput.toLowerCase();
      for (const option of _listbox) {
        option.hidden = !option.label.toLowerCase().startsWith(lowerCase);
      }
    },
    showListbox() {
      // Move contents of list slot into top-layer
      // Should only have one element

      const _listbox = this._listbox;
      if (!_listbox) return;
      this._expanded = true;
      const { ariaListbox, shape } = this.refs;
      ariaListbox.setAttribute('aria-hidden', 'false');
      const popup = getSharedPopup();
      if ('popover' in popup) {
        this.insertAdjacentElement('afterend', popup);
        popup.popover = 'manual';
        popup.showPopover();
      } else {
        document.body.append(popup);
      }
      popup.replaceChildren(_listbox);
      popup.showPopup(shape, false);
      popup.addEventListener('focusout', this._onPopupFocusoutListener);
      if (!this._isSelect && !this.multiple) {
        _listbox.value = this._listboxValue;
      }
      const [option] = _listbox.selectedOptions;
      if (option) {
        option.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
        });
      }
    },

    closeListbox() {
      this._expanded = false;
      const { _listbox } = this;
      if (!_listbox) return;
      const popup = getSharedPopup();
      this.refs.ariaListbox.setAttribute('aria-hidden', 'true');
      this.replaceChildren(_listbox);
      popup.close(undefined, false);
      // TODO: Animate
      popup.remove();
    },
    toggleListbox() {
      if (this._expanded) {
        this.closeListbox();
      } else {
        this.showListbox();
      }
    },
    /**
     * @param {{label:string, value:string}} option
     * @return {void}
     */
    suggestOption(option) {
      this.render({
        selectedOption: option,
      });

      const {
        _draftInput: currentInput,
        _input: inputElement,
        _isSelect,
        autocompleteInline,
        _expanded,
        autoSelect,
      } = this;
      const { label: suggestionText, value: suggestionValue } = option;

      this._suggestionText = suggestionText;
      this._suggestionValue = suggestionValue;
      this._suggestionOption = option;
      this._hasSuggestion = true;
      if (autoSelect) {
        this.acceptSuggestion(true);
        return;
      }

      // Autocomplete Inline
      if ((_isSelect && !this.multiple) || autocompleteInline) {
        let valueText = suggestionText;
        let selectionStart = 0;
        if (_expanded) {
          if (!_isSelect && suggestionText.toLowerCase().startsWith(currentInput.toLowerCase())) {
            valueText = currentInput + suggestionText.slice(currentInput.length);
            selectionStart = currentInput.length;
          } else {
            selectionStart = suggestionText.length;
          }
        } else {
          selectionStart = 0;
        }
        inputElement.value = valueText; // Displayed value
        if (autocompleteInline) {
          inputElement.setSelectionRange(selectionStart, suggestionText.length);
        }
        if (!_expanded) {
          this.acceptSuggestion(true);
        }
      }
    },
    acceptSuggestion(emitChange = false) {
      if (!this._hasSuggestion) return;
      if (this.readOnly) return;
      const { _suggestionText, _suggestionValue, _input, multiple, _listbox, _values } = this;
      if (multiple) {
        const newArray = [..._values.filter(Boolean), _suggestionValue ?? _suggestionText];
        this._values = [...new Set(newArray)];
      } else {
        this.value = _suggestionValue;
        _input.value = _suggestionText;
        this._draftInput = _suggestionText;
        _listbox.value = _suggestionValue;
      }
      if (emitChange) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    /**
     * @param {Object} options
     * @param {boolean} [options.first] first option
     * @param {boolean} [options.last] first option
     * @param {boolean} [options.next] next fosuable option
     * @param {boolean} [options.previous] previous focusable option
     * @param {string} [options.startsWith] option label starsWith
     * @param {string} [options.value] matches option value
     * @param {string} [options.label] matches option label
     */
    changeSuggestion({ first, last, next, previous, startsWith, value, label }) {
      const _listbox = this._listbox;
      let suggestion;
      let suggestionIndex;
      let current;
      let currentIndex;
      let backup;
      let backupIndex = -1;
      let optionIndex = -1;
      for (const option of _listbox.options) {
        optionIndex++;
        if (!current && option.focused) {
          current = option;
          currentIndex = optionIndex;
          if (suggestion && (!next && !last)) {
            break;
          }
        }
        if (option.hidden) continue;
        if (last) {
          suggestion = option;
          suggestionIndex = optionIndex;
          continue;
        }
        if (first) {
          if (!suggestion) {
            suggestion = option;
            suggestionIndex = optionIndex;
          }
          continue;
        }
        if (startsWith != null) {
          if (!suggestion && option.label.toLowerCase().startsWith(startsWith)) {
            suggestion = option;
            suggestionIndex = optionIndex;
          }
          continue;
        }
        if (value != null) {
          if (!suggestion && option.value === value) {
            suggestion = option;
            suggestionIndex = optionIndex;
          }
          continue;
        }
        if (label != null) {
          if (!suggestion && option.label === label) {
            suggestion = option;
            suggestionIndex = optionIndex;
          }
          continue;
        }
        if (currentIndex === optionIndex) continue;
        if (previous) {
          suggestion = option;
          suggestionIndex = optionIndex;
        } else if (next) {
          if (current) {
            suggestion = option;
            suggestionIndex = optionIndex;
            break;
          } else if (!backup) {
            backup = option;
            backupIndex = optionIndex;
          }
        }
      }
      if (current && current !== suggestion) {
        current.focused = false;
      }
      if (!suggestion) {
        suggestionIndex = backupIndex;
        suggestion = backup;
        this._input.value = this._draftInput;
      }
      if (suggestionIndex === -1) {
        this._focusedPosInSet = -1;
        this._hasSuggestion = false;
        return;
      }
      this._focusedPosInSet = suggestionIndex + 1;
      suggestion.focused = true;
      suggestion.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
      this.suggestOption(suggestion);
    },
    resetSuggestion() {
      if (this._isSelect) {
        this.changeSuggestion({ label: this._draftInput });
      } else {
        this.changeSuggestion({ value: this._listboxValue });
      }
    },
    refreshMultiple() {
      const { _values, multiple } = this;
      if (!multiple) {
        this.refs.chips.replaceChildren();
        return;
      }
      /** @type {InstanceType<import('./InputChip.js').default>} */
      let element = this.refs.chips.firstElementChild;

      for (let i = 0; i < _values.length; i++) {
        const currentValue = _values[i];
        let foundOption;
        if (this.listbox) {
          for (const option of this.listbox.options) {
            if (option.value === currentValue) {
              foundOption = option;
              break;
            }
          }
        }

        element ??= this.refs.chips.appendChild(document.createElement('mdw-input-chip'));
        element.closeButton = true;
        element.textContent = foundOption?.label || currentValue;
        element.textContent = foundOption?.label || currentValue;
        element.disabled = this.disabled;
        element.readOnly = this.readOnly;
        // eslint-disable-next-line unicorn/prefer-add-event-listener
        element.onclose ??= this.onChipClose.bind(this);
        element = element.nextElementSibling;
      }
      while (element) {
        const prev = element;
        element = element.nextElementSibling;
        prev.remove();
      }
      this._chipSelected = false;
      this._input.value = '';
      this._draftInput = '';
      this._listboxValue = '';
      if (this.listbox) {
        for (const option of this.listbox.options) {
          option.selected = _values.includes(option.value);
        }
      }
    },
    populateInputFromListbox() {
      if (this.multiple) {
        this.refreshMultiple();
        return;
      }
      if (!this._isSelect) return;
      if (!this._listbox) return;

      this._listbox.value = this._value;
      const [option] = this._listbox.selectedOptions;
      if (option) {
        this._input.value = option.label;
        this._draftInput = option.label;
      }
    },
    onChipClose({ currentTarget }) {
      let prev = currentTarget;
      let elementIndex = 0;
      while ((prev = prev.previousSibling)) {
        elementIndex++;
      }
      currentTarget.remove();
      this._values.splice(elementIndex, 1);
      this._values = [...this._values];
    },
  })
  .childEvents({
    control: {
      click() {
        if (!this._isSelect) return;
        if (this.readOnly) return;
        this.toggleListbox();
      },
      input(event) {
        if (!this._hasListbox) return;
        // Intercept event and dispatch a new one.
        // This allow authors to modify listbox (filter) and value (custom pattern)
        event.stopPropagation();
        const performDefault = this.dispatchEvent(new InputEvent('input', {
          composed: true,
          data: event.data,
          bubbles: true,
          dataTransfer: event.dataTransfer,
          detail: event.detail,
          inputType: event.inputType,
          view: event.view,
          targetRanges: event.getTargetRanges(),
          isComposing: event.isComposing,
        }));
        if (!performDefault) {
          event.preventDefault();
          return;
        }
        const value = /** @type {HTMLInputElement} */ (event.currentTarget).value;
        this._draftInput = value;
        if (this.autocompleteList != null && this.autocompleteList !== 'custom') {
          this.applyAutocompleteList();
        }
        this.resetSuggestion();
        if (value && !this._expanded && this._listbox.length) {
          this.showListbox();
        }
        // Only inline suggest if appending characters
        if (event.data != null && this.autosuggestInline) {
          this.changeSuggestion({ startsWith: this._draftInput.toLocaleLowerCase() });
        }
      },
      keydown(event) {
        if (!this._listbox) return;
        // Calls to return will not prevent default.
        switch (event.key) {
          case 'Home':
            if (!this._isSelect) return;
            if (this.readOnly) return;
            this.changeSuggestion({ first: true });
            break;
          case 'End':
            this._chipSelected = false;
            if (!this._isSelect) return;
            if (this.readOnly) return;
            this.changeSuggestion({ last: true });
            break;
          case 'ArrowDown':
          case 'Down':
            if (this.disabled) return;
            if (this.readOnly) return;
            this._chipSelected = false;
            if (this.readOnly) return;
            if (event.altKey) {
              this.toggleListbox();
              break;
            }
            if (!this._expanded && !this.autocompleteInline && !this._isSelect) return;
            this.changeSuggestion({ next: true });
            break;
          case 'ArrowUp':
          case 'Up':
            if (this.disabled) return;
            if (this.readOnly) return;
            if (event.altKey) {
              this.toggleListbox();
              break;
            }
            this._chipSelected = false;
            if (!this._expanded && !this.autocompleteInline && !this._isSelect) return;
            this.changeSuggestion({ previous: true });
            break;
          case 'Escape':
            if (!this._expanded) return;
            event.stopImmediatePropagation();
            event.preventDefault();
            if (this.acceptOnEscape) {
              this.acceptSuggestion(true);
            } else {
              this.resetSuggestion();
            }
            this.closeListbox();
            break;
          case 'Space':
            if (this.disabled) return;
            if (this.readOnly) return;
            if (!this._isSelect) return;
            if (!this._listbox) return;
            if (this._expanded) {
              if (this.multiple && this._suggestionOption) {
                this._suggestionOption.selected = !this._suggestionOption.selected;
                this.closeListbox();
              }
            } else {
              this.showListbox();
            }
            break;
          case 'Backspace':
            if (this.disabled) return;
            if (this.readOnly) return;
            if (!this.multiple) return;
            if (this._isSelect) return;
            if (!this._input.value) {
              if (this._chipSelected) {
                this._values.pop();
                this._values = [...this._values];
              } else if (this._values.length) {
                this._chipSelected = true;
              }
            }
            return;
          case 'Tab':
            if (!this._expanded && this.multiple) return;
            this.closeListbox();
            this.acceptSuggestion(true);
            event.stopPropagation();
            return;
          case 'Enter':
            this._chipSelected = false;
            if (!this._expanded) return;
            event.stopImmediatePropagation();
            event.preventDefault();
            this.acceptSuggestion(true);
            this.closeListbox();
            break;
          case ' ':
            return;
          default:
            if (this._isSelect && event.key.length === 1) {
              this.changeSuggestion({ startsWith: event.key.toLocaleLowerCase() });
              break;
            }
            return;
        }
        event.stopPropagation(); // Avoid kbd within kbd (sub menus)
        event.preventDefault();
      },
    },
    slot: {
      /**
       * @param {{currentTarget: HTMLSlotElement}} event
       * @type {any}
       */
      slotchange({ currentTarget }) {
        if (this._expanded) return;
        /** @type {InstanceType<Listbox>[]} */
        const [listbox] = currentTarget.assignedElements();
        const _listbox = this._listbox;
        if (_listbox === listbox) {
          // Internal already matches
          return;
        }
        if (_listbox) {
          // Unbind and release
          _listbox.removeEventListener('change', this._onListboxChangeListener);
          _listbox.removeEventListener('click', this._onListboxClickListener);
          _listbox._handleFormReset = true;
        }
        this._listbox = listbox;
        if (listbox) {
          // Bind and store
          if (!this.multiple) {
            listbox.required = true; // Don't allow unclick
          }

          _listbox._handleFormReset = false;
          listbox.addEventListener('change', this._onListboxChangeListener);
          listbox.addEventListener('click', this._onListboxChangeListener);
          this.populateInputFromListbox();
        }
      },
    },
    trailingIcon: {
      '~click'() {
        if (!this._listbox) return;
        this.toggleListbox();
        this.refs.control.focus();
      },
    },
  })
  .events({
    blur({ relatedTarget }) {
      this._chipSelected = false;
      if (!this._expanded) return;
      // Ignore if focus lost to pop-up (likely pointerdown).
      const popup = getSharedPopup();
      if (popup === relatedTarget) return;
      if (relatedTarget && popup.contains(/** @type {Node} */ (relatedTarget))) return;
      if (popup.matches(':focus-within,:focus')) return;
      this.closeListbox();
    },
  })
  .expressions({
    showTrailingIcon({ trailingIcon, _listbox, _expanded, readOnly }) {
      if (trailingIcon != null) {
        return trailingIcon;
      }
      if (_listbox && !readOnly) {
        return _expanded ? 'arrow_drop_up' : 'arrow_drop_down';
      }
      return null;
    },
    computedTrailingIcon({ trailingIcon, _listbox, _expanded }) {
      if (trailingIcon != null) {
        return trailingIcon;
      }
      if (_listbox) {
        return _expanded ? 'arrow_drop_up' : 'arrow_drop_down';
      }
      return null;
    },
    controlTypeAttrValue({ _isSelect, type }) {
      if (_isSelect) return 'text';
      return type;
    },
    controlReadonlyAttrValue({ _isSelect, type, readOnly }) {
      if (_isSelect) return true;
      return readOnly;
    },
    controlIsSelect({ _isSelect, type }) {
      return _isSelect;
    },
    ariaExpandedAttrValue({ _hasListbox, _expanded }) {
      if (!_hasListbox) return null;
      return `${_expanded}`;
    },
    ariaControlsAttrValue({ _hasListbox }) {
      if (!_hasListbox) return null;
      return 'aria-listbox';
    },
    ariaAutocompleteAttrValue({ _hasListbox, autocompleteList, _isSelect }) {
      if (!_hasListbox) return null;
      if (_isSelect) return null;
      if (autocompleteList != null) {
        return 'both';
      }
      return 'inline';
    },
    ariaActiveDescendantAttrValue({ _hasListbox, _expanded, _focusedValue }) {
      if (!_hasListbox) return null;
      if (_expanded && _focusedValue) return 'aria-active';
      return '';
    },
    controlRoleAttrValue({ _hasListbox }) {
      if (_hasListbox) return 'combobox';
      return null;
    },
    populatedState({ value, _badInput, _draftInput, type }) {
      return !!value || _badInput || !!_draftInput || type === 'datetime-local';
    },
  })
  .recompose(({ refs: { control, trailingIcon, shape, labelText } }) => {
    // Can't cross DOM boundaries
    control.setAttribute('aria-activedescendant', '{ariaActiveDescendantAttrValue}');
    control.setAttribute('aria-autocomplete', '{ariaAutocompleteAttrValue}');
    control.setAttribute('aria-controls', '{ariaControlsAttrValue}');
    control.setAttribute('aria-expanded', '{ariaExpandedAttrValue}');
    control.setAttribute('type', '{controlTypeAttrValue}');
    control.setAttribute('role', '{controlRoleAttrValue}');
    control.setAttribute('readonly', '{controlReadonlyAttrValue}');
    control.setAttribute('autocomplete', 'off');
    control.setAttribute('is-select', '{controlIsSelect}');
    trailingIcon.setAttribute('mdw-if', '{showTrailingIcon}');
    trailingIcon.setAttribute('icon', '{computedTrailingIcon}');
    shape.setAttribute('trailing-icon', '{computedTrailingIcon}');
    labelText.setAttribute('trailing-icon', '{computedTrailingIcon}');
  })
  .overrides({
    _onSetValue(value) {
      if (this.multiple) {
        this._values = value.split(',').filter(Boolean);
      } else if (this._isSelect) {
        this._value = value;
      } else {
      // Apply user value to input and read back result to apply control to parse
        this._input.value = value;
        this._value = this._input.value;
      }
    },
    _onControlValue(value) {
      // Only accept values from accepted suggestions
      if (this.multiple) {
        if (value) {
          this._chipSelected = false;
        }
        return;
      }
      this._value = value;
    },
  })
  .on({
    _valueChanged(previous, current) {
      if (this.multiple) return; // Handled by _values
      if (this._isSelect) {
        this.populateInputFromListbox();
      } else {
        this._listboxValue = current;
      }
    },
    _valuesChanged(previous, current) {
      if (this.multiple && current) {
        this._value = current.join(',');
        this.refreshMultiple();
      }
    },
    _chipSelectedChanged(previous, current) {
      if (!this.multiple) return;
      const element = this.refs.chips.lastElementChild;
      if (element) {
        element.selected = current;
      }
    },
    _listboxValueChanged(previous, current) {
      if (!this._hasListbox) return;
      this._listbox.value = current;
      this._draftInput = current;
      this.changeSuggestion({ value: current });
    },
    _expandedChanged(previous, current) {
      this._useFormImplicitSubmission = !current;
    },
    constructed() {
      this._onListboxChangeListener = this.onListboxChange.bind(this);
      this._onListboxClickListener = this.onListboxClick.bind(this);
      this._onPopupFocusoutListener = this.onPopupFocusout.bind(this);
      document.addEventListener('DOMContentLoaded', () => this.populateInputFromListbox(), { once: true });
    },
    multipleChanged(previous, current) {
      if (this.listbox) {
        this.listbox.multiple = current;
      }
      if (current) {
        this._onSetValue(this._input.value);
      }
    },
    disabledStateChanged() {
      this.refreshMultiple();
      this._chipSelected = false;
      this.closeListbox();
    },
    readOnlyChanged() {
      this.refreshMultiple();
      this._chipSelected = false;
      this.closeListbox();
    },
  })
  .html`
    <div id=chips mdw-if={multiple}></div>
    <slot id=slot></slot>
    <div id=aria-listbox role=listbox mdw-if={_hasListbox}>
      <div id=aria-active role=option aria-hidden=false aria-label={selectedOption.label}
        aria-setsize="{_listbox.length}" aria-posinset={_focusedPosInSet}></div>
    </div>
  `
  .css`
    #slot {
      display: none;
    }

    #aria-listbox {
      display: none;
    }

    #trailing-icon {
      align-self: center;
    }

    #control:where([type="button"], [is-select]) {
      cursor: pointer;
    }

    #inline[multiple] {
      gap: 8px;
    }

    mdw-input-chip {
      align-self: baseline;

    }

    #control[multiple] {
      align-self: baseline;
    }

    #chips {
      display: contents;
    }

    #inline {
      flex-wrap: wrap;
    }

    #inline:where([filled],[outlined]) {
      padding-inline: 16px;
    }

    #control {
      flex: 1 1 8ch;
    }

    #control[is-select][multiple] {
      flex: 1 1 0px;
    }
  `
  .recompose(({ refs: { inline, chips } }) => {
    inline.prepend(chips);
    inline.setAttribute('multiple', '{multiple}');
  })
  .extend((Base) => class Input extends Base {
    /** @type {InstanceType<ReturnType<RippleMixin>>['addRipple']} */
    addRipple(...args) {
      if (!this.active) return null;
      return super.addRipple(...args);
    }
  })
  .autoRegister('mdw-input');
