import { handleTabKeyPress } from '../../core/aria/modal.js';
import MDWComponent from '../../core/component/MDWComponent.js';
import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWDialog.css' assert { type: 'css' };

/** @typedef {Object<string,any>} DialogStackState */

/**
 * @typedef {Object} DialogStack
 * @prop {MDWDialog} element
 * @prop {Element} [previousFocus]
 * @prop {DialogStackState} [state]
 * @prop {DialogStackState} [previousState]
 */

export default class MDWDialog extends MDWComponent {
  static supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

  static ariaRole = 'none';

  constructor() {
    super();
    /** @type {HTMLDialogElement} */
    this.dialogElement = this.shadowRoot.getElementById('dialog');
    this.scrimElement = this.shadowRoot.getElementById('scrim');
    /** @type {MDWContainer} */
    this.containerElement = this.shadowRoot.getElementById('container');
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.headlineElement = this.shadowRoot.getElementById('headline');
    this.descriptionElement = this.shadowRoot.getElementById('description');
    this.bodyElement = this.shadowRoot.getElementById('body');
    this.cancelElement = this.shadowRoot.getElementById('cancel');
    this.confirmElement = this.shadowRoot.getElementById('confirm');

    this.bodyElement.addEventListener('slotchange', MDWDialog.onSlotChanged);
  }

  /** @type {DialogStack[]} */
  static OPEN_DIALOGS = [];

  static elementName = 'mdw-dialog';

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'title', 'description', 'icon',
    'default', 'cancel', 'confirm',
  ];

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'open',
  ];

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <dialog id=dialog role="dialog" aria-hidden="true" aria-labelledby="headline" aria-describedby="description">
        <div id=scrim aria-hidden="true"></div>
        <form id=form method="dialog" role=none>
          <mdw-container id=container>
            <mdw-icon id=icon aria-hidden="true"></mdw-icon>
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
      case 'title':
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
   * @this {MDWDialog}
   * @return {void}
   */
  static onTransitionEnd(event) {
    console.log('transition end');
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
    if (MDWDialog.supportsHTMLDialogElement && this.dialogElement.open) {
      // Force close native dialog
      this.dialogElement.close(returnValue);
    } else {
      this.dialogElement.returnValue = returnValue;
    }

    // Will invoke observed attribute change: ('aria-hidden', 'true');
    this.open = false;
    dispatchEvent(new Event('close'));
    // .mdw-dialog__popup hidden by transitionEnd event
    let stackIndex = -1;
    MDWDialog.OPEN_DIALOGS.some((stack, index) => {
      if (stack.element === this) {
        stackIndex = index;
        return true;
      }
      return false;
    });
    if (stackIndex !== -1) {
      const stack = MDWDialog.OPEN_DIALOGS[stackIndex];
      if (stack.previousFocus
        && stack.previousFocus instanceof HTMLElement
        && document.activeElement?.closest(MDWDialog.elementName) === this) {
        // Only pop focus back when hiding a dialog with focus within itself.
        try {
          stack.previousFocus.focus();
        } catch {
          // Failed to focus
        }
      }
      MDWDialog.OPEN_DIALOGS.splice(stackIndex, 1);
      if (stack.state === window.history.state) {
        window.history.back();
      }
    }
    if (!MDWDialog.OPEN_DIALOGS.length) {
      window.removeEventListener('popstate', MDWDialog.onPopState);
    }
    return true;
  }

  /**
   * @param {MouseEvent} event
   * @this {HTMLElement} this
   * @return {void}
   */
  static onScrimClick(event) {
    /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
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
      /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      if (!host.isNativeModal) {
        handleTabKeyPress.call(this, event);
      }
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      event.stopPropagation();
      /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
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
    console.log('onNativeCancelEvent');
    event.stopPropagation();
    /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
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
    /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.close(this.returnValue);
  }

  connectedCallback() {
    this.dialogElement.addEventListener('cancel', MDWDialog.onNativeCancelEvent);
    this.dialogElement.addEventListener('close', MDWDialog.onNativeCloseEvent, { passive: true });
    this.scrimElement.addEventListener('click', MDWDialog.onScrimClick, { passive: true });
    this.containerElement.addEventListener('keydown', MDWDialog.onContainerKeyDown);

    // this.setAttribute('role', 'none');
    if (MDWDialog.supportsHTMLDialogElement) {
      this.dialogElement.setAttribute('aria-modal', 'true');
      if (!this.dialogElement.hasAttribute('aria-hidden')) {
        this.setAttribute('aria-hidden', 'true');
      }
    }
  }

  disconnectedCallback() {
    this.dialogElement.removeEventListener('cancel', MDWDialog.onNativeCancelEvent);
    this.dialogElement.removeEventListener('close', MDWDialog.onNativeCloseEvent);
    this.scrimElement.removeEventListener('click', MDWDialog.onScrimClick);
    this.containerElement.removeEventListener('keydown', MDWDialog.onContainerKeyDown);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    console.log('popstate', event);
    if (!event.state) return;
    console.log('popstate');

    const lastOpenDialog = MDWDialog.OPEN_DIALOGS.at(-1);
    if (!lastOpenDialog || !lastOpenDialog.previousState) {
      return;
    }
    if ((lastOpenDialog.previousState === event.state) || Object.entries(event.state)
      .every(([key, value]) => value === lastOpenDialog.previousState[key])) {
      console.log('will close', lastOpenDialog.previousState, event.state, lastOpenDialog.previousState, event.state);
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
    if (MDWDialog.supportsHTMLDialogElement) {
      this.dialogElement.showModal();
      this.isNativeModal = true;
    }
    this.show(event);
  }

  /**
   * @param {Event} [event]
   * @return {boolean} handled
   */
  show(event) {
    if (this.open) return false;
    this.open = true;

    if (MDWDialog.supportsHTMLDialogElement) {
      this.dialogElement.show();
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('aria-hidden', 'true');
      }
    }

    const previousFocus = document.activeElement;
    const title = this.title || this.description;
    const newState = { time: Date.now(), random: Math.random(), title };
    let previousState = null;

    if (!window.history.state) {
      window.history.replaceState({}, document.title);
    }
    previousState = window.history.state;
    window.history.pushState(newState, title);
    window.addEventListener('popstate', MDWDialog.onPopState);

    /** @type {DialogStack} */
    const dialogStack = {
      element: this,
      previousFocus,
      state: newState,
      previousState,
    };
    MDWDialog.OPEN_DIALOGS.push(dialogStack);
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
