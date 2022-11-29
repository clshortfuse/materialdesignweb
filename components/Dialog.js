import { handleTabKeyPress } from '../aria/modal.js';
import './Container.js';
import CustomElement from '../core/CustomElement.js';

import styles from './Dialog.css' assert { type: 'css' };
import './Icon.js';
import './Text.js';
import './Button.js';

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
  static { this.autoRegister(); }

  static elementName = 'mdw-dialog';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    const composition = super.compose(
      styles,
      ...parts,
    );

    const template = composition.template;
    const html = this.html;
    template.append(html`
      <dialog id=dialog
      ${Dialog.supportsHTMLDialogElement ? 'aria-model=true' : ''}
      role=dialog aria-hidden=${({ open }) => (open ? 'false' : 'true')} 
      aria-labelledby=headline aria-describedby=description
      oncancel="{onNativeCancelEvent}"
      onclose="{~onNativeCloseEvent}">
        <div id=scrim onclick="{~onScrimClick}" aria-hidden=true></div>
        <form id=form method=dialog role=none>
          <mdw-container id=container onkeydown="{onContainerKeyDown}">
            <mdw-icon _if={icon} id=icon aria-hidden=true>{icon}</mdw-icon>
            <mdw-text id=headline role="header">{headline}</mdw-text>
            <div id=description>{description}</div>
            <slot id=slot onslotchange="{onSlotChange}"></slot>
            <div id=actions>
              <mdw-button id=cancel type=submit value="cancel" autofocus=${({ default: d }) => (!d || d === 'confirm')}>{cancel}</mdw-button>
              <mdw-button id=confirm type=submit value="confirm" autofocus=${({ default: d }) => (d === 'cancel')}>{confirm}</mdw-button>
            </div>
          </mdw-container>
        </form>
      </dialog>
    `);
    return composition;
  }

  static supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

  /** @type {DialogStack[]} */
  static OPEN_DIALOGS = [];

  #dialog = /** @type {HTMLDialogElement} */ (this.refs.dialog);

  #container = this.refs.container;

  constructor() {
    super();
    if (!this.confirm) {
      this.confirm = 'Confirm';
    }
    if (!this.cancel) {
      this.cancel = 'Cancel';
    }
  }

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
Dialog.prototype.headline = Dialog.idl('headline');
Dialog.prototype.description = Dialog.idl('description');
Dialog.prototype.icon = Dialog.idl('icon');
Dialog.prototype.default = Dialog.idl('default');
Dialog.prototype.cancel = Dialog.idl('cancel');
Dialog.prototype.confirm = Dialog.idl('confirm');
