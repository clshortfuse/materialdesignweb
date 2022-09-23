import { handleTabKeyPress } from '../aria/modal.js';

import Container from './Container.js';
import CustomElement from './CustomElement.js';
import styles from './Dialog.css' assert { type: 'css' };

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
  static ariaRole = 'none';

  static elementName = 'mdw-dialog';

  static supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

  /** @type {DialogStack[]} */
  static OPEN_DIALOGS = [];

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <dialog id=dialog role=dialog aria-hidden=true aria-labelledby=headline aria-describedby=description>
        <div id=scrim aria-hidden=true></div>
        <form id=form method=dialog role=none>
          <mdw-container id=container>
            <mdw-icon id=icon aria-hidden=true></mdw-icon>
            <mdw-text id=headline role="header"></mdw-text>
            <div id=description></div>
            <slot id=body></slot>
            <div id=actions>
              <mdw-button id=cancel type=submit value="cancel">Cancel</mdw-button>
              <mdw-button id=confirm type=submit value="confirm" autofocus>Confirm</mdw-button>
            </div>
          </mdw-container>
        </form>
      </dialog>
    `,
  ];

  constructor() {
    super();
    this.dialogElement = /** @type {HTMLDialogElement} */ (this.shadowRoot.getElementById('dialog'));
    this.scrimElement = this.shadowRoot.getElementById('scrim');
    this.containerElement = /** @type {Container} */ (this.shadowRoot.getElementById('container'));
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.headlineElement = this.shadowRoot.getElementById('headline');
    this.descriptionElement = this.shadowRoot.getElementById('description');
    this.bodyElement = this.shadowRoot.getElementById('body');
    this.cancelElement = this.shadowRoot.getElementById('cancel');
    this.confirmElement = this.shadowRoot.getElementById('confirm');

    this.bodyElement.addEventListener('slotchange', Dialog.onSlotChanged);
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'icon':
        this.iconElement.textContent = newValue ?? '';
        break;
      case 'headline':
        this.headlineElement.textContent = newValue ?? '';
        break;
      case 'description':
        this.descriptionElement.textContent = newValue ?? '';
        break;
      case 'cancel':
        this.cancelElement.textContent = newValue ?? '';
        break;
      case 'confirm':
        this.confirmElement.textContent = newValue ?? '';
        break;
      case 'default':
        this.confirmElement.toggleAttribute('autofocus', newValue == null || newValue === 'confirm');
        this.cancelElement.toggleAttribute('autofocus', newValue === 'cancel');
        break;
      case 'open':
        // HTMLDialogElement Spec states attribute manipulation does not invoke events
        if (newValue == null) {
          this.dialogElement.setAttribute('aria-hidden', 'true');
        } else {
          this.dialogElement.setAttribute('aria-hidden', 'false');
        }
        break;
      default:
    }
  }

  /**
   * @param {TransitionEvent} event
   * @this {Dialog}
   * @return {void}
   */
  static onTransitionEnd(event) {
    if (event.propertyName !== 'opacity') return;
    if (this.getAttribute('aria-hidden') !== 'true') return;
    this.setAttribute('mdw-ready', '');
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChanged(event) {
    const nodes = this.assignedNodes();
    const hasContent = nodes.some((node) => (node.nodeType === node.ELEMENT_NODE)
      || (node.nodeType === node.TEXT_NODE && node.nodeValue.trim().length));
    this.toggleAttribute('slotted', hasContent);
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
    if (Dialog.supportsHTMLDialogElement && this.dialogElement.open) {
      // Force close native dialog
      this.dialogElement.close(returnValue);
    } else {
      this.dialogElement.returnValue = returnValue;
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
      if (stack.state === window.history.state) {
        window.history.back();
      }
    }
    if (!Dialog.OPEN_DIALOGS.length) {
      window.removeEventListener('popstate', Dialog.onPopState);
    }
    return true;
  }

  /**
   * @param {MouseEvent} event
   * @this {HTMLElement} this
   * @return {void}
   */
  static onScrimClick(event) {
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
  static onContainerKeyDown(event) {
    if (event.key === 'Tab') {
      /** @type {{host:Dialog}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      if (!host.isNativeModal) {
        handleTabKeyPress.call(this, event);
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
   * @param {Event} event
   * @this {HTMLDialogElement}
   * @return {void}
   */
  static onNativeCancelEvent(event) {
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
  static onNativeCloseEvent(event) {
    event.stopPropagation();
    /** @type {{host:Dialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.close(this.returnValue);
  }

  connectedCallback() {
    this.dialogElement.addEventListener('cancel', Dialog.onNativeCancelEvent);
    this.dialogElement.addEventListener('close', Dialog.onNativeCloseEvent, { passive: true });
    this.scrimElement.addEventListener('click', Dialog.onScrimClick, { passive: true });
    this.containerElement.addEventListener('keydown', Dialog.onContainerKeyDown);

    // this.setAttribute('role', 'none');
    if (Dialog.supportsHTMLDialogElement) {
      this.dialogElement.setAttribute('aria-modal', 'true');
      if (!this.dialogElement.hasAttribute('aria-hidden')) {
        this.setAttribute('aria-hidden', 'true');
      }
    }
  }

  disconnectedCallback() {
    this.dialogElement.removeEventListener('cancel', Dialog.onNativeCancelEvent);
    this.dialogElement.removeEventListener('close', Dialog.onNativeCloseEvent);
    this.scrimElement.removeEventListener('click', Dialog.onScrimClick);
    this.containerElement.removeEventListener('keydown', Dialog.onContainerKeyDown);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
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

  get returnValue() {
    return this.dialogElement.returnValue;
  }

  /**
   * @param {Event} [event]
   * @return {boolean} handled
   */
  showModal(event) {
    if (this.open) return false;
    if (Dialog.supportsHTMLDialogElement) {
      this.dialogElement.showModal();
      this.isNativeModal = true;
    }
    return this.show(event);
  }

  /**
   * @param {Event} [event]
   * @return {boolean} handled
   */
  show(event) {
    if (this.open) return false;
    this.open = true;

    if (Dialog.supportsHTMLDialogElement) {
      this.dialogElement.show();
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
      window.history.replaceState({}, document.title);
    }
    previousState = window.history.state;
    window.history.pushState(newState, title);
    window.addEventListener('popstate', Dialog.onPopState);

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
        this.containerElement.focus();
      }
    } catch {
      // Failed to focus
    }
    return true;
  }
}

Dialog.prototype.open = Dialog.idlBoolean('open');
Dialog.prototype.headline = Dialog.idlString('headline');
Dialog.prototype.description = Dialog.idlString('description');
Dialog.prototype.icon = Dialog.idlString('icon');
Dialog.prototype.default = Dialog.idlString('default');
Dialog.prototype.cancel = Dialog.idlString('cancel');
Dialog.prototype.confirm = Dialog.idlString('confirm');
