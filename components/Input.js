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
    _expanded: 'boolean',
    _listbox: {
      type: 'object',
      /** @type {InstanceType<Listbox>} */
      value: null,
    },
    _focusedValue: 'string',
    _focusedPosInSet: { value: -1 },
    _listboxSize: { value: -1 },
    _draftInput: { type: 'string', nullable: false },
    _suggestedText: { type: 'string', nullable: false },
    _suggestedValue: { type: 'string', nullable: false },
    _hasSuggestion: 'boolean',
  })
  .observe({
    _hasListbox({ _listbox }) {
      return !!_listbox;
    },
  })
  .define({
    listbox() {
      return this._listbox;
    },
  })
  .set({
    _onListboxChangeListener: null,
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
     * @param {Event} event
     */
    onListboxChange(event) {
      const selectedItem = this._listbox.selectedOptions.item(0);
      this.selectOption(selectedItem, true);
      this.closeListbox();
      // Revert focus back
      this.refs.control.focus();
    },
    applyAutocompleteList() {
      const { _listbox, _draftInput } = this;
      if (!_listbox) return;

      const lowerCase = _draftInput.toLowerCase();
      console.log({ lowerCase });
      for (const option of _listbox) {
        option.hidden = !option.value.toLowerCase().startsWith(lowerCase);
      }
    },
    showListbox() {
      // Move contents of list slot into top-layer
      // Should only have one element

      const { _listbox, refs } = this;
      if (!_listbox) return;
      this._expanded = true;
      const { control, ariaListbox, shape } = refs;
      control.setAttribute('role', 'combobox');
      ariaListbox.setAttribute('aria-hidden', 'false');
      const popup = getSharedPopup();
      document.body.append(popup);
      popup.replaceChildren(_listbox);
      _listbox.selectedIndex = -1;
      popup.showPopup(shape, false);
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
    selectOption(option) {
      this.render({
        selectedOption: option,
      });

      const { label: suggestionText, value: suggestionValue } = option;
      this._suggestedText = suggestionText;
      this._suggestedValue = suggestionValue;
      this._hasSuggestion = true;
      this.acceptSuggestion();
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
        autocompleteInline,
      } = this;
      const { label: suggestionText, value: suggestionValue } = option;

      this._suggestedText = suggestionText;
      this._suggestedValue = suggestionValue;
      this._hasSuggestion = true;

      if (autocompleteInline) {
        let valueText = suggestionText;
        let selectionStart = suggestionText.length;
        if (suggestionText.toLowerCase().startsWith(currentInput.toLowerCase())) {
          valueText = currentInput + suggestionText.slice(currentInput.length);
          selectionStart = currentInput.length;
        }
        inputElement.value = valueText;
        inputElement.setSelectionRange(selectionStart, suggestionText.length);

        return;
      }
      // inputElement.value = currentInput;
      // inputElement.setSelectionRange(currentInput.length, currentInput.length);
      console.warn('No visual change on suggestion');
    },
    acceptSuggestion() {
      if (!this._hasSuggestion) return;
      const { _suggestedText, _suggestedValue, _input } = this;
      this.value = _suggestedValue;
      _input.value = _suggestedText;
      _input.setSelectionRange(_suggestedText.length, _suggestedText.length);
    },
    suggestNextItem() {
      const _listbox = this._listbox;
      let next;
      let current;
      let first;
      let firstIndex = -1;
      let index = -1;
      for (const option of _listbox.options) {
        index++;
        if (!first && !option.hidden) {
          first = option;
          firstIndex = index;
        }
        if (current) {
          if (!option.hidden) {
            next = option;
            break;
          }
        } else if (option.focused) {
          current = option;
          option.focused = false;
        }
      }
      if (!next) {
        index = firstIndex;
        next = first;
      }
      if (index === -1) {
        this._focusedPosInSet = -1;
        this._hasSuggestion = false;
        return;
      }
      this._focusedPosInSet = index + 1;
      next.focused = true;
      next.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
      this.suggestOption(next);
    },
    // Traverse options to find element that may be suggested inline
    suggestInline() {
      const _listbox = this._listbox;
      let suggestion;
      let index = -1;
      const lowerCase = this._draftInput.toLowerCase();
      for (const option of _listbox.options) {
        index++;
        if (!suggestion && !option.hidden) {
          if (option.label.toLowerCase().startsWith(lowerCase)) {
            console.log('suggesting', option, lowerCase);
            suggestion = option;
          }
          if (option.focused) break;
          continue;
        }
        if (option.focused) {
          option.focused = false;
        }
      }
      if (!suggestion) {
        this._focusedPosInSet = -1;
        this._hasSuggestion = false;
        return;
      }
      this._focusedPosInSet = index + 1;
      suggestion.focused = true;
      suggestion.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
      this.suggestOption(suggestion);
    },
    resetSuggestion() {
      const _listbox = this._listbox;
      for (const option of _listbox.options) {
        option.focused = false;
      }
      this._focusedPosInSet = -1;
      this._hasSuggestion = false;
      this._input.value = this._draftInput;
    },
    suggestPreviousItem() {
      const _listbox = this._listbox;
      let previous;
      let current;
      let last;
      let lastIndex = -1;
      let index = -1;
      for (const option of _listbox.options) {
        index++;
        if (current) {
          // Looking for last
          if (!option.hidden) {
            last = option;
            lastIndex = index;
          }
          // Looking for current
        } else if (option.focused) {
          current = option;
          option.focused = false;
          if (previous) {
            index--;
            break;
          }
          // Tagging as previous
        } else if (!option.hidden) {
          previous = option;
        }
      }
      if (!previous) {
        index = lastIndex;
        previous = last;
      }
      if (index === -1) {
        this._focusedPosInSet = -1;
        this._hasSuggestion = false;
        return;
      }
      this._focusedPosInSet = index + 1;
      previous.focused = true;
      previous.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
      this.suggestOption(previous);
    },
  })
  .childEvents({
    control: {
      input(event) {
        if (!this._listbox) return;
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
        const value = event.currentTarget.value;
        this._draftInput = value;
        if (this.autocompleteList != null) {
          if (this.autocompleteList !== 'custom') {
            this.applyAutocompleteList();
          }
          if (this._expanded) {
            // May have resized
            getSharedPopup().updatePopupPosition(this.refs.shape);
          }
        }
        this.resetSuggestion();
        if (value && !this._expanded && this._listbox.length) {
          this.showListbox();
        }
        // Only inline suggest if appending characters
        if (event.data != null && this.autosuggestInline) {
          this.suggestInline();
        }
      },
      keydown(event) {
        if (!this._listbox) return;
        // Calls to return will not prevent default.
        switch (event.key) {
          case 'ArrowDown':
          case 'Down':
            if (event.altKey) {
              this.toggleListbox();
              break;
            }
            if (!this._expanded && !this.autocompleteInline) return;
            this.suggestNextItem();
            break;
          case 'ArrowUp':
          case 'Up':
            if (event.altKey) {
              this.toggleListbox();
              break;
            }
            if (!this._expanded && !this.autocompleteInline) return;
            this.suggestPreviousItem();
            break;
          case 'Escape':
            if (!this._expanded) return;
            this.resetSuggestion();
            this.closeListbox();
            break;
          case 'Tab':
            this.closeListbox();
            this.acceptSuggestion();
            event.stopPropagation();
            return;
          case 'Enter':
            if (!this._expanded) return;
            this.acceptSuggestion();
            this.closeListbox();
            break;
          default:
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
        const { _listbox } = this;
        if (_listbox === listbox) {
          // Internal already matches
          return;
        }
        if (_listbox) {
          // Unbind and release
          _listbox.removeEventListener('change', this._onListboxChangeListener);
          this._onListboxChangeListener = null;
        }
        if (listbox) {
          // Bind and store
          this._onListboxChangeListener = this.onListboxChange.bind(this);
          listbox.addEventListener('change', this._onListboxChangeListener);
        }
        this._listbox = listbox;
      },
    },
  })
  .events({
    blur({ relatedTarget }) {
      if (!this._expanded) return;
      // Ignore if focus lost to pop-up (likely pointerdown).
      if (relatedTarget && getSharedPopup().contains(relatedTarget)) return;
      this.closeListbox();
    },
  })
  .expressions({
    ariaExpandedAttrValue({ _hasListbox, _expanded }) {
      if (!_hasListbox) return null;
      return `${_expanded}`;
    },
    ariaControlsAttrValue({ _hasListbox }) {
      if (!_hasListbox) return null;
      return 'aria-listbox';
    },
    ariaAutocompleteAttrValue({ _hasListbox, autocompleteList, autocompleteInline }) {
      if (!_hasListbox) return null;
      if (autocompleteList != null) {
        if (autocompleteInline) return 'both';
        return 'list';
      }
      if (autocompleteInline) return 'inline';
      return null;
    },
    ariaActiveDescendantAttrValue({ _hasListbox, _expanded, _focusedValue }) {
      if (!_hasListbox) return null;
      if (_expanded && _focusedValue) return 'aria-active';
      return '';
    },
  })
  .on({
    composed() {
      const { control } = this.refs;
      // Can't cross DOM boundaries
      control.setAttribute('aria-activedescendant', '{ariaActiveDescendantAttrValue}');
      control.setAttribute('aria-autocomplete', '{ariaAutocompleteAttrValue}');
      control.setAttribute('aria-controls', '{ariaControlsAttrValue}');
      control.setAttribute('aria-expanded', '{ariaExpandedAttrValue}');
    },
  })
  .html`
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
  `
  .autoRegister('mdw-input');
