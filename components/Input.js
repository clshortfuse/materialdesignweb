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
    _values: { value: [] },
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
        option.hidden = !option.value.toLowerCase().startsWith(lowerCase);
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
      if (!this._isSelect) {
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
      if (_isSelect || autocompleteInline) {
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
        const newArray = [..._values, _suggestionText];
        this._values = [..._values, _suggestionText];
        const newChip = document.createElement('mdw-chip');
        newChip.label = _suggestionText;
        newChip.value = _suggestionValue;
        newChip.textContent = _suggestionText;
        newChip.icon = this._suggestionOption?.icon;
        this.refs.chips.appendChild(newChip);
        this._value = newArray.join(',');
        _input.value = '';
        this._draftInput = '';
        _listbox.value = '';
        this._listboxValue = '';
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
    populateInputFromListbox() {
      if (!this._isSelect) return;
      if (!this._listbox) return;
      this._listbox.value = this._value;
      const [option] = this._listbox.selectedOptions;
      if (option) {
        this._input.value = option.label;
      }
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
            if (!this._isSelect) return;
            if (this.readOnly) return;
            this.changeSuggestion({ last: true });
            break;
          case 'ArrowDown':
          case 'Down':
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
            if (event.altKey) {
              this.toggleListbox();
              break;
            }
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
          case 'Tab':
            this.closeListbox();
            this.acceptSuggestion(true);
            event.stopPropagation();
            return;
          case 'Enter':
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
        }
        this._listbox = listbox;
        if (listbox) {
          // Bind and store
          listbox.required = true; // Don't allow unclick

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
      if (this._isSelect) {
        this._value = value;
      } else {
      // Apply user value to input and read back result to apply control to parse
        this._input.value = value;
        this._value = this._input.value;
      }
    },
  })
  .on({
    _valueChanged(previous, current) {
      if (this._isSelect) {
        this.populateInputFromListbox();
      } else if (!this.multiple) {
        this._listboxValue = current;
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

    #chips {
      order:-1;

      display: flex;
      align-items: center;
      gap: 8px;

      padding-inline-end: 8px;

      transition: 100ms;
    }

    #chips:empty {
      padding-inline-end: 0px;
    }

    #inline:where([filled],[outlined]) {
      padding-inline: 16px;
    }
  `
  .recompose(({ refs: { inline, chips } }) => {
    inline.prepend(chips);
  })
  .extend((Base) => class Input extends Base {
    /** @type {InstanceType<ReturnType<RippleMixin>>['addRipple']} */
    addRipple(...args) {
      if (!this.active) return null;
      return super.addRipple(...args);
    }
  })
  .autoRegister('mdw-input');
