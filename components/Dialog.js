import './Button.js';
import './Surface.js';
import './Divider.js';
import './Icon.js';
import './DialogActions.js';

import { handleTabKeyPress } from '../aria/modal.js';
import CustomElement from '../core/CustomElement.js';

import styles from './Dialog.css' assert { type: 'css' };

/** @typedef {Object<string,any>} DialogStackState */

/** @typedef {InstanceType<import('./Dialog.js').default>} Dialog */

/**
 * @typedef {Object} DialogStack
 * @prop {Dialog} element
 * @prop {Element} [previousFocus]
 * @prop {DialogStackState} [state]
 * @prop {DialogStackState} [previousState]
 */

/** @type {DialogStack[]} */
const OPEN_DIALOGS = [];

const supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

export default CustomElement
  .extend()
  .define({
    _dialog() {
      return /** @type {HTMLDialogElement} */ (this.refs.dialog);
    },
    returnValue() {
      return /** @type {HTMLDialogElement} */ (this.refs.dialog).returnValue;
    },
  })
  .observe({
    open: 'boolean',
    dividers: {
      /** @type {'full'|''|'inset'} */
      value: null,
    },
    headline: 'string',
    icon: 'string',
    default: { value: 'confirm' },
    cancel: { value: 'Cancel' },
    confirm: { value: 'Confirm' },
    _isNativeModal: 'boolean',
  })
  .methods({
    /**
     * @param {TransitionEvent} event
     * @return {void}
     */
    onTransitionEnd(event) {
      if (event.propertyName !== 'opacity') return;
      if (this.getAttribute('aria-hidden') !== 'true') return;
      this.setAttribute('mdw-ready', '');
    },

    /**
     * @param {Event & {currentTarget: HTMLSlotElement}} event
     * @return {void}
     */
    onSlotChange({ currentTarget }) {
      const nodes = currentTarget.assignedNodes();
      const hasContent = nodes.some((node) => (node.nodeType === node.ELEMENT_NODE)
      || (node.nodeType === node.TEXT_NODE && node.nodeValue.trim().length));
      currentTarget.toggleAttribute('slotted', hasContent);
    },

    /**
     * @param {SubmitEvent & {currentTarget: HTMLFormElement}} event
     * @return {void}
     */
    onFormSubmit(event) {
      if (event.currentTarget.assignedSlot) {
        // Custom form.
        // @ts-ignore Skip cast
        const returnValue = event.submitter?.value;
        this.close(returnValue);
        event.preventDefault();
      }
    },

    /**
     * @param {Event & {currentTarget: HTMLFormElement}} event
     * @return {void}
     */
    onFormSlotChange({ currentTarget }) {
      /** @type {HTMLFormElement} */
      const [form] = currentTarget.assignedNodes();
      form?.addEventListener('submit', (e) => this.onFormSubmit(e));
    },

    /**
     * @param {PopStateEvent} event
     * @return {void}
     */
    onPopState(event) {
      if (!event.state) return;

      const lastOpenDialog = OPEN_DIALOGS.at(-1);
      if (!lastOpenDialog || !lastOpenDialog.previousState) {
        return;
      }
      if ((lastOpenDialog.previousState === event.state) || Object.entries(event.state)
        .every(([key, value]) => value === lastOpenDialog.previousState[key])) {
        const cancelEvent = new Event('cancel', { cancelable: true });
        if (lastOpenDialog.element.dispatchEvent(cancelEvent)) {
          lastOpenDialog.element.close();
        } else {
        // Revert pop state by pushing state again
          window.history.pushState(lastOpenDialog.state, lastOpenDialog.state.title);
        }
      }
    },

    /**
     * @param {any} returnValue
     * @return {boolean} handled
     */
    close(returnValue) {
      if (!this.open) return false;
      if (this._isNativeModal) {
        this._isNativeModal = false;
      } else {
        const main = document.querySelector('main');
        if (main) {
          main.removeAttribute('aria-hidden');
        }
      }
      // if (this.dialogElement.getAttribute('aria-hidden') === 'true') return false;
      if (supportsHTMLDialogElement && this._dialog.open) {
      // Force close native dialog
        this._dialog.close(returnValue);
      } else {
        this._dialog.returnValue = returnValue;
      }

      // Will invoke observed attribute change: ('aria-hidden', 'true');
      this.open = false;
      this.dispatchEvent(new Event('close'));
      // .mdw-dialog__popup hidden by transitionEnd event
      let stackIndex = -1;
      OPEN_DIALOGS.some((stack, index) => {
        // @ts-ignore Skip unknown
        if (stack.element === this) {
          stackIndex = index;
          return true;
        }
        return false;
      });
      if (stackIndex !== -1) {
        const stack = OPEN_DIALOGS[stackIndex];
        if (stack.previousFocus
        && stack.previousFocus instanceof HTMLElement
        && document.activeElement?.closest(this.constructor.elementName) === this) {
        // Only pop focus back when hiding a dialog with focus within itself.
          try {
            stack.previousFocus.focus();
          } catch {
          // Failed to focus
          }
        }
        OPEN_DIALOGS.splice(stackIndex, 1);
        if (stack.state && window.history && window.history.state // IE11 returns a cloned state object, not the original
      && stack.state.hash === window.history.state.hash) {
          window.history.back();
        }
      }
      if (!OPEN_DIALOGS.length) {
        window.removeEventListener('popstate', this.onPopState);
      }
      return true;
    },

    /**
     * @param {Event} [event]
     * @return {boolean} handled
     */
    showModal(event) {
      if (this.open) return false;
      if (supportsHTMLDialogElement) {
        this._dialog.showModal();
        this._isNativeModal = true;
      }
      return this.show(event);
    },

    /**
     * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
     * @return {boolean} handled
     */
    show(source) {
      if (this.open) return false;
      this.open = true;

      if (supportsHTMLDialogElement) {
        this._dialog.show();
        const main = document.querySelector('main');
        if (main) {
          main.setAttribute('aria-hidden', 'true');
        }
      }

      const previousFocus = document.activeElement;
      const title = this.headline || this.textContent;
      const newState = { time: Date.now(), random: Math.random(), title };
      let previousState = null;

      if (!window.history.state) {
        window.history.replaceState({
          hash: Math.random().toString(36).slice(2, 18),
        }, document.title);
      }
      previousState = window.history.state;
      window.history.pushState(newState, title);
      window.addEventListener('popstate', this.onPopState);

      /** @type {DialogStack} */
      const dialogStack = {
        // @ts-ignore Recursive cast
        element: this,
        previousFocus,
        state: newState,
        previousState,
      };
      OPEN_DIALOGS.push(dialogStack);
      const focusElement = this.querySelector('[autofocus]')
      ?? this.shadowRoot.querySelector('[autofocus]');
      try {
        if (focusElement && focusElement instanceof HTMLElement) {
          if (focusElement.scrollIntoView) {
            focusElement.scrollIntoView();
          }
          focusElement.focus();
        } else {
          this.refs.surface.focus();
        }
      } catch {
      // Failed to focus
      }
      return true;
    },
  })
  .css(styles)
  .expressions({
    cancelAutoFocus({ default: d }) { return d === 'cancel'; },
    confirmAutoFocus({ default: d }) { return d === 'confirm'; },
  })
  .html/* html */`
    <dialog id=dialog
    ${supportsHTMLDialogElement ? 'aria-model=true' : ''}
    role=dialog aria-hidden=${({ open }) => (open ? 'false' : 'true')} 
    aria-labelledby=headline aria-describedby=slot>
      <div _if={open} id=scrim aria-hidden=true></div>
      <mdw-surface id=surface open={open} icon={icon} elevated>
        <mdw-icon _if={icon} id=icon class=content ink=secondary aria-hidden=true>{icon}</mdw-icon>
        <slot id=headline name=headline on-slotchange={onSlotChange} role=header>{headline}</slot>
        <slot id=fixed name=fixed class=content on-slotchange={onSlotChange}></slot>
        <mdw-divider id=divider-top size={dividers}></mdw-divider>
        <slot id=slot class=content on-slotchange={onSlotChange}></slot>
        <mdw-divider id=divider-bottom size={dividers}></mdw-divider>
        <slot name=form id=form-slot on-slotchange={onFormSlotChange}>
          <form id=form method=dialog role=none on-submit={onFormSubmit}>
            <mdw-dialog-actions>
              <mdw-button id=cancel type=submit value=cancel
                autofocus={cancelAutoFocus}>{cancel}</mdw-button>
              <mdw-button id=confirm type=submit value=confirm
                autofocus={confirmAutoFocus}>{confirm}</mdw-button>
            </mdw-dialog-actions>
          </form>
        </slot>
      </mdw-surface>
    </dialog>
  `
  .childEvents({
    dialog: {
      cancel(event) {
        event.stopPropagation();
        const cancelEvent = new Event('cancel', { cancelable: true });
        if (!this.dispatchEvent(cancelEvent)) {
          event.preventDefault();
        }
      },
      close(event) {
        event.stopPropagation();
        this.close(this.returnValue);
      },
    },
    scrim: {
      '~click'() {
        const cancelEvent = new Event('cancel', { cancelable: true });
        if (!this.dispatchEvent(cancelEvent)) return;
        this.close();
      },
    },
    surface: {
      keydown(event) {
        if (event.key === 'Tab') {
          const surface = /** @type {HTMLElement} */ (event.currentTarget);
          if (!this._isNativeModal) {
          // Move via Light or Shadow DOM, depending on target
            const context = surface.contains(event.target) ? surface : this;
            handleTabKeyPress.call(context, event);
          }
          return;
        }
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          event.stopPropagation();
          const cancelEvent = new Event('cancel', { cancelable: true });
          if (this.dispatchEvent(cancelEvent)) {
            this.close();
          }
        }
      },
    },
  })
  .autoRegister('mdw-dialog');
