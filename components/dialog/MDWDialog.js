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

/** @implements HTMLDialogElement */
export default class MDWDialog extends MDWComponent {
  static supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

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
  }

  static CANCEL_EVENT = 'mdw:dialog-cancel';

  static CLOSE_EVENT = 'mdw:dialog-close';

  /** @type {DialogStack[]} */
  static OPEN_DIALOGS = [];

  static elementName = 'mdw-dialog';

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'title', 'description', 'icon',
  ];

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'custom-body',
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
            <mdw-container id=headline role="header"></mdw-container>
            <div id=description></div>
            <mdw-container id=body>
              <slot></slot>
            </mdw-container>
            <div id=actions>
              <mdw-button value="cancel">No</mdw-button>
              <mdw-button value="default">Yes</mdw-button>
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
      case 'mdw-description':
        this.descriptionElement.textContent = newValue ?? '';
        break;
      default:
    }
  }

  get open() {
    if (MDWDialog.supportsHTMLDialogElement) {
      return this.dialogElement.open;
    }
    return this.dialogElement.getAttribute('aria-hidden') !== 'true';
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
   * @param {any} returnValue
   * @return {boolean} handled
   */
  close(returnValue) {
    if (this.dialogElement.getAttribute('aria-hidden') === 'true') return false;
    if (MDWDialog.supportsHTMLDialogElement && this.dialogElement.open) {
      console.log('force close native dialog');
      this.dialogElement.close(returnValue);
    } else {
      this.dialogElement.returnValue = returnValue;
    }

    const closeEvent = new Event(MDWDialog.CLOSE_EVENT, { bubbles: true, cancelable: true });
    this.dialogElement.setAttribute('aria-hidden', 'true');
    dispatchEvent(closeEvent);
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
    console.log('onScrimClick');
    if (this instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    const cancelEvent = new Event(MDWDialog.CANCEL_EVENT, { bubbles: true, cancelable: true, composed: true });
    const result = this.dispatchEvent(cancelEvent);
    if (!result) return;
    /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.close();
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLElement}
   * @return {void}
   */
  static onContainerKeyDown(event) {
    if (event.key === 'Tab') {
      if (!MDWDialog.supportsHTMLDialogElement) {
        handleTabKeyPress(event);
      }
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      event.stopPropagation();
      const cancelEvent = new Event(MDWDialog.CANCEL_EVENT, { bubbles: true, cancelable: true, composed: true });
      if (this.dispatchEvent(cancelEvent)) {
        /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
        const { host } = this.getRootNode();
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
    const cancelEvent = new Event(MDWDialog.CANCEL_EVENT, { bubbles: true, cancelable: true, composed: true });
    if (!this.dispatchEvent(cancelEvent)) {
      event.preventDefault();
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLDialogElement}
   * @return {void}
   */
  static onNativeCloseEvent(event) {
    /** @type {{host:MDWDialog}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.close(this.returnValue);
  }

  /** @param {boolean} add */
  configureListeners(add = true) {
    const fn = add ? 'addEventListener' : 'removeEventListener';
    this[fn]('transitionend', MDWDialog.onTransitionEnd);
    this.dialogElement[fn]('cancel', MDWDialog.onNativeCancelEvent);
    this.dialogElement[fn]('close', MDWDialog.onNativeCloseEvent);
    this.scrimElement[fn]('click', MDWDialog.onScrimClick);
    this.containerElement[fn]('keydown', MDWDialog.onContainerKeyDown);
  }

  connectedCallback() {
    this.configureListeners();
    this.setAttribute('role', 'none');
    if (MDWDialog.supportsHTMLDialogElement) {
      this.dialogElement.setAttribute('aria-modal', 'true');
      if (!this.dialogElement.hasAttribute('aria-hidden')) {
        this.setAttribute('aria-hidden', 'true');
      }
    }
  }

  disconnectedCallback() {
    this.configureListeners(false);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    if (!event.state) return;

    const lastOpenDialog = MDWDialog.OPEN_DIALOGS[MDWDialog.OPEN_DIALOGS.length - 1];
    if (!lastOpenDialog || !lastOpenDialog.previousState) {
      return;
    }
    if ((lastOpenDialog.previousState === event.state) || Object.keys(event.state)
      .every((key) => event.state[key] === lastOpenDialog.previousState[key])) {
      const cancelEvent = new Event(MDWDialog.CANCEL_EVENT, { cancelable: true, bubbles: true });
      if (lastOpenDialog.element.dispatchEvent(cancelEvent)) {
        lastOpenDialog.element.close();
      } else {
        // Revert pop state by pushing state again
        const title = this.title || this.description;
        window.history.pushState(lastOpenDialog.state, title);
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
  show(event) {
    if (event && event.type === 'click' && event.currentTarget instanceof HTMLAnchorElement) {
      // Prevent anchor link
      event.preventDefault();
    }

    let changed = false;

    if (this.dialogElement.getAttribute('aria-hidden') !== 'false') {
      this.dialogElement.setAttribute('aria-hidden', 'false');
      changed = true;
    }

    if (!changed) return false;

    if (MDWDialog.supportsHTMLDialogElement && !this.dialogElement.open) {
      this.dialogElement.showModal();
    }

    const previousFocus = document.activeElement;
    const newState = {};
    let previousState = null;

    if (!window.history.state) {
      window.history.replaceState({}, document.title);
    }
    previousState = window.history.state;
    window.history.pushState(newState, this.title || this.description);
    window.addEventListener('popstate', MDWDialog.onPopState);

    /** @type {DialogStack} */
    const dialogStack = {
      element: this,
      previousFocus,
      state: newState,
      previousState,
    };
    MDWDialog.OPEN_DIALOGS.push(dialogStack);
    const focusElement = this.querySelector('[autofocus]');
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

MDWDialog.prototype.showModal = MDWDialog.prototype.show;
