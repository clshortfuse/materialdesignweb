/* https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ */

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
  }
  return sharedPopup;
}

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(InputMixin)
  .mixin(TextFieldMixin)
  .mixin(ResizeObserverMixin)
  .extend()
  .observe({
    suggestInline: 'boolean',
    _expanded: 'boolean',
    _listbox: {
      type: 'object',
      /** @type {Listbox} */
      value: null,
    },
    _focusedValue: 'string',
    _focusedIndex: { value: -1 },
    _focusedPosInSet: { value: -1 },
    _listboxSize: { value: -1 },
    _draftInput: { type: 'string', nullable: false },
  })
  .observe({
    _hasListbox({ _listbox }) {
      return _listbox ? 'listbox' : null;
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
      const popup = getSharedPopup();
      popup.updatePopupPosition(this.refs.shape);
    },
    /**
     * @param {Event} event
     */
    onListboxChange(event) {
      const selectedItem = this._listbox.selectedOptions.item(0);
      this.selectOption(selectedItem);
      this.closeListbox();
      // Revert focus back
      this.refs.control.focus();
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

    /**
     * @param {{label:string, value:string}} option
     * @return {void}
     */
    selectOption(option) {
      this.render({
        selectedOption: option,
      });

      const { _draftInput, _value, _input } = this;
      const { label: suggestion, value } = option;

      if (_draftInput && suggestion && suggestion.toLowerCase().startsWith(_draftInput.toLowerCase())) {
        _input.value = _draftInput + suggestion.slice(_draftInput.length);
        _input.setSelectionRange(_value.length, suggestion.length);
      } else {
        _input.value = suggestion;
        _input.setSelectionRange(suggestion.length, suggestion.length);
      }
      this._value = value;
    },
  })
  .on({
    _focusedIndexChanged(previous, current) {
      const _listbox = this._listbox;
      const previousItem = _listbox.item(previous);
      if (previousItem) {
        previousItem.focused = false;
      }
      const currentItem = _listbox.item(current);
      if (currentItem) {
        this._focusedPosInSet = current + 1;
        currentItem.focused = true;
        this.selectOption(currentItem);
      } else {
        this._focusedPosInSet = -1;
      }
    },
  })
  .childEvents({
    control: {
      input(event) {
        if (!this._listbox) return;
        // Intercept event and dispatch a new one.
        // This allow authors to modify listbox (filter) and value (custom pattern)
        event.stopPropagation();
        this.dispatchEvent(new InputEvent('input', {
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
        this._draftInput = event.currentTarget.value;
        this._focusedIndex = -1;
        if (!this._expanded && this._listbox.length) {
          this.showListbox();
        }
      },
      keydown(event) {
        switch (event.key) {
          case 'ArrowUp':
          case 'Up':
            if (!this._expanded) return;
            if (this._focusedIndex <= 0) {
              this._focusedIndex = (this._listbox.length - 1);
            } else {
              this._focusedIndex--;
            }
            break;
          case 'ArrowDown':
          case 'Down':
            if (this._expanded) {
              if (this._focusedIndex >= this._listbox.length - 1) {
                this._focusedIndex = 0;
              } else {
                this._focusedIndex++;
              }
            } else {
              if (!this._listbox) return;
              this.showListbox();
              this._focusedIndex = 0;
            }
            break;
          case 'Escape':
            if (!this._expanded) return;
            this.closeListbox();
            break;
          case 'Tab':
            this.closeListbox();
            event.stopPropagation();
            return; // Don't prevent default
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
        /** @type {Listbox[]} */
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
      return _hasListbox ? `${_expanded}` : null;
    },
    ariaControlsAttrValue({ _hasListbox }) {
      return _hasListbox ? 'aria-listbox' : null;
    },
    ariaAutocompleteAttrValue({ _hasListbox, suggestInline }) {
      return _hasListbox
        ? (suggestInline ? 'both' : 'list')
        : null;
    },
    ariaActiveDescendantAttrValue({ _hasListbox, _expanded, _focusedValue }) {
      return _hasListbox
        // eslint-disable-next-line unicorn/no-nested-ternary
        ? ((_expanded && _focusedValue) ? 'aria-active' : '')
        : null;
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
    <div id=aria-listbox role=listbox>
      <div id=aria-active role=option aria-setsize="{_listbox.length}" aria-posinset={_focusedPosInSet} aria-label={selectedOption.label}></div>
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
