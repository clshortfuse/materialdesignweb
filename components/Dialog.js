import { handleTabKeyPress } from '../aria/modal.js';
import './Container.js';
import CustomElement from '../core/CustomElement.js';

import styles from './Dialog.css' assert { type: 'css' };
import './Icon.js';
import './Text.js';
import './Button.js';
import './DialogActions.js';

/** @typedef {Object<string,any>} DialogStackState */

/**
 * @typedef {Object} DialogStack
 * @prop {Dialog} element
 * @prop {Element} [previousFocus]
 * @prop {DialogStackState} [state]
 * @prop {DialogStackState} [previousState]
 */

/** @implements {HTMLDialogElement} */
export default class Dialog extends CustomElement {
  static { this.autoRegister('mdw-dialog'); }

  compose() {
    const { html } = this;
    return super.compose().append(
      styles,
      html`
        <dialog id=dialog
        ${Dialog.supportsHTMLDialogElement ? 'aria-model=true' : ''}
        role=dialog aria-hidden=${({ open }) => (open ? 'false' : 'true')} 
        aria-labelledby=headline
        oncancel="{onNativeCancelEvent}"
        onclose="{~onNativeCloseEvent}">
          <div id=scrim onclick="{~onScrimClick}" aria-hidden=true></div>
            <mdw-container id=container onkeydown={onContainerKeyDown}>
              <mdw-icon _if={icon} id=icon class=content ink=secondary aria-hidden=true>{icon}</mdw-icon>
              <slot id=headline class=content name=headline onslotchange={onSlotChange} role=header>{headline}</slot>
              <slot id=fixed name=fixed class=content onslotchange={onSlotChange}></slot>
              <mdw-divider id=divider-top size={dividers}></mdw-divider>
              <slot id=slot class="content" onslotchange={onSlotChange}></slot>
              <mdw-divider id=divider-bottom size={dividers}></mdw-divider>
              <slot name=form id=form-slot onslotchange={onFormSlotChange}>
                <form id=form method=dialog role=none onsubmit={onFormSubmit}>
                  <mdw-dialog-actions>
                    <mdw-button id=cancel type=submit value=cancel autofocus=${({ default: d }) => (d === 'cancel')}>{cancel}</mdw-button>
                    <mdw-button id=confirm type=submit value=confirm autofocus=${({ default: d }) => (d === 'confirm')}>{confirm}</mdw-button>
                  </mdw-dialog-actions>
                </form>
              </slot>
            </mdw-container>
        </dialog>
      `,
    );
  }

  static supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

  /** @type {DialogStack[]} */
  static OPEN_DIALOGS = [];

  #dialog = /** @type {HTMLDialogElement} */ (this.refs.dialog);

  #container = this.refs.container;

  /**
   * @param {TransitionEvent} event
   * @this {Dialog}
   * @return {void}
   */
  onTransitionEnd(event) {
    if (event.propertyName !== 'opacity') return;
    if (this.getAttribute('aria-hidden') !== 'true') return;
    this.setAttribute('mdw-ready', '');
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  onSlotChange(event) {
    const nodes = this.assignedNodes();
    const hasContent = nodes.some((node) => (node.nodeType === node.ELEMENT_NODE)
      || (node.nodeType === node.TEXT_NODE && node.nodeValue.trim().length));
    this.toggleAttribute('slotted', hasContent);
  }

  /**
   * @param {SubmitEvent} event
   * @this {HTMLFormElement}
   * @return {void}
   */
  onFormSubmit(event) {
    if (this.assignedSlot) {
      // Custom form.
      /** @type {Dialog} */
      const host = this.assignedSlot.getRootNode().host;
      const returnValue = event.submitter?.value;
      host.close(returnValue);
      event.preventDefault();
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  onFormSlotChange(event) {
    const [form] = this.assignedNodes();

    if (form) {
      const host = this.getRootNode().host;
      form.addEventListener('submit', host.onFormSubmit);
      console.log('found form');
    }
  }

  /**
   * @param {MouseEvent} event
   * @this {HTMLElement} this
   * @return {void}
   */
  onScrimClick(event) {
    /** @type {{host:Dialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();

    const cancelEvent = new Event('cancel', { cancelable: true });
    if (!host.dispatchEvent(cancelEvent)) return;
    host.close();
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLElement}
   * @return {void}
   */
  onContainerKeyDown(event) {
    if (event.key === 'Tab') {
      /** @type {{host:Dialog}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      if (!host.isNativeModal) {
        // Move via Light or Shadow DOM, depending on target
        const context = this.contains(event.target) ? this : host;
        handleTabKeyPress.call(context, event);
      }
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      event.stopPropagation();
      /** @type {{host:Dialog}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      const cancelEvent = new Event('cancel', { cancelable: true });
      if (this.dispatchEvent(cancelEvent)) {
        host.close();
      }
    }
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  onPopState(event) {
    if (!event.state) return;

    const lastOpenDialog = Dialog.OPEN_DIALOGS.at(-1);
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
  }

  /**
   * @param {Event} event
   * @this {HTMLDialogElement}
   * @return {void}
   */
  onNativeCancelEvent(event) {
    event.stopPropagation();
    /** @type {{host:Dialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();

    const cancelEvent = new Event('cancel', { cancelable: true });
    if (!host.dispatchEvent(cancelEvent)) {
      event.preventDefault();
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLDialogElement}
   * @return {void}
   */
  onNativeCloseEvent(event) {
    event.stopPropagation();
    /** @type {{host:Dialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.close(this.returnValue);
  }

  /**
   * @param {any} returnValue
   * @return {boolean} handled
   */
  close(returnValue) {
    if (!this.open) return false;
    if (this.isNativeModal) {
      this.isNativeModal = false;
    } else {
      const main = document.querySelector('main');
      if (main) {
        main.removeAttribute('aria-hidden');
      }
    }
    // if (this.dialogElement.getAttribute('aria-hidden') === 'true') return false;
    if (Dialog.supportsHTMLDialogElement && this.#dialog.open) {
      // Force close native dialog
      this.#dialog.close(returnValue);
    } else {
      this.#dialog.returnValue = returnValue;
    }

    // Will invoke observed attribute change: ('aria-hidden', 'true');
    this.open = false;
    this.dispatchEvent(new Event('close'));
    // .mdw-dialog__popup hidden by transitionEnd event
    let stackIndex = -1;
    Dialog.OPEN_DIALOGS.some((stack, index) => {
      if (stack.element === this) {
        stackIndex = index;
        return true;
      }
      return false;
    });
    if (stackIndex !== -1) {
      const stack = Dialog.OPEN_DIALOGS[stackIndex];
      if (stack.previousFocus
        && stack.previousFocus instanceof HTMLElement
        && document.activeElement?.closest(Dialog.elementName) === this) {
        // Only pop focus back when hiding a dialog with focus within itself.
        try {
          stack.previousFocus.focus();
        } catch {
          // Failed to focus
        }
      }
      Dialog.OPEN_DIALOGS.splice(stackIndex, 1);
      if (stack.state && window.history && window.history.state // IE11 returns a cloned state object, not the original
      && stack.state.hash === window.history.state.hash) {
        window.history.back();
      }
    }
    if (!Dialog.OPEN_DIALOGS.length) {
      window.removeEventListener('popstate', this.onPopState);
    }
    return true;
  }

  get returnValue() {
    return this.#dialog.returnValue;
  }

  /**
   * @param {Event} [event]
   * @return {boolean} handled
   */
  showModal(event) {
    if (this.open) return false;
    if (Dialog.supportsHTMLDialogElement) {
      this.#dialog.showModal();
      this.isNativeModal = true;
    }
    return this.show(event);
  }

  /**
   * @param {MouseEvent|PointerEvent|HTMLElement} [source]
   * @return {boolean} handled
   */
  show(source) {
    if (this.open) return false;
    this.open = true;

    if (Dialog.supportsHTMLDialogElement) {
      this.#dialog.show();
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('aria-hidden', 'true');
      }
    }

    const previousFocus = document.activeElement;
    const title = this.headline || this.description;
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
      element: this,
      previousFocus,
      state: newState,
      previousState,
    };
    Dialog.OPEN_DIALOGS.push(dialogStack);
    const focusElement = this.querySelector('[autofocus]')
      ?? this.shadowRoot.querySelector('[autofocus]');
    try {
      if (focusElement && focusElement instanceof HTMLElement) {
        if (focusElement.scrollIntoView) {
          focusElement.scrollIntoView();
        }
        focusElement.focus();
      } else {
        this.#container.focus();
      }
    } catch {
      // Failed to focus
    }
    return true;
  }
}

Dialog.prototype.open = Dialog.idl('open', 'boolean');
/** @type {'full'|''|'inset'} */
Dialog.prototype.dividers = Dialog.idl('dividers', 'string');
Dialog.prototype.headline = Dialog.idl('headline');
Dialog.prototype.icon = Dialog.idl('icon');
Dialog.prototype.default = Dialog.idl('default', { default: 'confirm' });
Dialog.prototype.cancel = Dialog.idl('cancel', { default: 'Cancel' });
Dialog.prototype.confirm = Dialog.idl('confirm', { default: 'Confirm' });
