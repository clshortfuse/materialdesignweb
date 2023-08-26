import './Button.js';
import './Divider.js';
import './Icon.js';
import './DialogActions.js';

import CustomElement from '../core/CustomElement.js';
import { attemptFocus } from '../core/dom.js';
import PopupMixin from '../mixins/PopupMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Returns array of elements that *may* be focusable over tab
 * @param {Node} root
 * @return {Element[]}
 */
function listTabbables(root) {
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const focusables = [];
  /** @type {HTMLElement} */
  let node;
  while ((node = /** @type {Element} */ (treeWalker.nextNode()))) {
    if (node.tagName === 'SLOT') {
      for (const el of (/** @type {HTMLSlotElement} */ (node)).assignedElements()) {
        if (el.tabIndex >= 0 && !el.matches(':disabled')) {
          focusables.push(el);
        }
        focusables.push(...listTabbables(el));
      }
    }
    if (node.tabIndex >= 0 && !node.matches(':disabled')) {
      focusables.push(node);
    }
  }
  return focusables;
}

/**
 * Iterate through root looking for autofocusable, or first focusable element
 * Attempt focus on each and return true if successful
 * @param {Node} root
 * @param {boolean} [autofocus=true]
 * @param {boolean} [forward=true]
 * @return {boolean} focused
 */
function focusOnTree(root, autofocus, forward = true) {
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const focusables = [];
  /** @type {Element} */
  let node;
  while ((node = /** @type {Element} */ (treeWalker.nextNode()))) {
    if (autofocus && node.hasAttribute('autofocus')) {
      if (attemptFocus(node)) return true;
      continue;
    }
    if (node.tagName === 'SLOT') {
      for (const el of (/** @type {HTMLSlotElement} */ (node)).assignedElements({ flatten: true })) {
        if (autofocus && el.hasAttribute('autofocus')) {
          if (attemptFocus(el)) return true;
          continue;
        }
        if (el.tabIndex >= 0) {
          // Can focus, add to later in case we find an autofocusable
          if (autofocus || !forward) {
            focusables.push(node);
          } else if (attemptFocus(node)) return true;
        }
        if (focusOnTree(el, autofocus, forward)) return true;
      }
      // Step through
    }
    if (node.tabIndex >= 0) {
      if (autofocus || !forward) {
        focusables.push(node);
      } else if (attemptFocus(node)) return true;
    }
  }
  for (const el of forward ? focusables : focusables.reverse()) {
    if (attemptFocus(el)) return true;
  }
  return false;
}

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .mixin(PopupMixin)
  .define({
    returnValue() {
      return /** @type {HTMLDialogElement} */ (this.refs.dialog).returnValue;
    },
  })
  .observe({
    dividers: {
      /** @type {'full'|''|'inset'} */
      value: null,
    },
    headline: 'string',
    icon: 'string',
    default: { value: 'confirm' },
    cancel: { value: 'Cancel' },
    confirm: { value: 'Confirm' },
  })
  .define({
    /** Dialogs are not anchored to source */
    _anchor: {
      get() { return null; },
      set() { /* noop */ },
    },
  })
  .set({
    flow: 'center',
    _useScrim: true,
  })
  .methods({
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
    focus() {
      focusOnTree(this.shadowRoot, true, true);
    },
  })
  .expressions({
    cancelAutoFocus({ default: d }) { return d === 'cancel'; },
    confirmAutoFocus({ default: d }) { return d === 'confirm'; },
  })
  .html`
    <div id=prepend>
      <mdw-icon mdw-if={icon} id=icon class=content ink=secondary aria-hidden=true icon={icon}></mdw-icon>
      <slot id=headline name=headline on-slotchange={onSlotChange} role=header>{headline}</slot>
      <slot id=fixed name=fixed class=content on-slotchange={onSlotChange}></slot>
      <mdw-divider id=divider-top size={dividers}></mdw-divider>
    </div>
    <div id=append>
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
    </div>
  `
  .recompose(({ refs: { prepend, append, dialog, slot } }) => {
    dialog.setAttribute('aria-labelledby', 'headline');
    dialog.setAttribute('aria-describedby', 'slot');
    slot.classList.add('content');

    dialog.prepend(...prepend.childNodes);
    dialog.append(...append.childNodes);
    prepend.remove();
    append.remove();
  })
  .css`
    /* https://m3.material.io/components/dialogs/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      --mdw-ink: var(--mdw-color__on-surface);
      position: fixed;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;
      overflow: visible;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: none;
      overscroll-behavior: contain;

      max-block-size: calc(100% - 40px);
      inline-size: max-content;
      min-inline-size: 280px;
      max-inline-size: min(560px, calc(100% - 40px));
      padding-block-start: 8px;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

    }

    #dialog:modal {
      overflow: visible;
    }

    :host([icon]) {
      align-items: center;
    }

    #icon {
      padding-block-start: 16px;

      font-size: 24px;
    }

    #headline {
      display: block;

      padding-block-start: 16px;
      padding-inline: 24px;

      font: var(--mdw-typescale__headline-small__font);
      letter-spacing: var(--mdw-typescale__headline-small__letter-spacing);
    }

    #headline:not([slotted]):empty {
      display: none;
    }

    #body {
      padding-block: 16px;
    }

    .content {
      padding-inline: 24px;
    }

    #divider-top {
      padding-block-start: 16px;
    }

    mdw-divider:not([size]) {
      color: transparent;
    }

    mdw-divider[size="inset"] {
      padding-inline: 24px;
    }

    #fixed {
      display:block;

      padding-block-start: 16px;

      color: rgb(var(--mdw-color__on-surface-variant));

      font: var(--mdw-typescale__body-medium__font);
      letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);
    }

    #fixed:not([slotted]) {
      display: none;
    }

    #slot {
      display:block;

      overflow-y: auto;

      color: rgb(var(--mdw-color__on-surface-variant));

      font: var(--mdw-typescale__body-medium__font);
      letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);
    }

    #scroller {
      display: block;
      overflow-y: auto;
    }

    #form {
      display: contents;
    }

    #form-slot::slotted(form) {
      display: contents;
    }
  `
  .events({
    keydown(event) {
      if (event.key === 'Tab') {
        if (!this._isNativeModal) {
          // Tab trap
          event.preventDefault();
          const tabbables = listTabbables(this.shadowRoot);
          if (event.shiftKey) {
            tabbables.reverse();
          }
          let focusNext = false;
          let focused = false;
          // Find and mark next
          for (const el of tabbables) {
            if (focusNext) {
              if (attemptFocus(el)) {
                focused = true;
                break;
              }
            } else {
              focusNext = el.matches(':focus');
            }
          }
          // Loop
          if (!focused) {
            for (const el of tabbables) {
              if (attemptFocus(el)) {
                return;
              }
            }
          }
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
    focusout(event) {
      if (!this.open) return;
      if (this._closing) return;
      if (this.modal) return;
      if (event.relatedTarget === this.refs.scrim) return;

      // Wait until end of event loop cycle to see if focus really is lost
      queueMicrotask(() => {
        if (this.matches(':focus-within')) return;
        const activeElement = document.activeElement;
        if (activeElement && this.contains(activeElement)) {
          return;
        }
        // Focus has left dialog (programmatic?)
        // Invoke cancel without returning focus
        this.close(undefined, false);
      });
    },
  })
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
      '~click'(event) {
        // Track if click on backdrop
        if (event.target !== event.currentTarget) return;
        if (!this._isNativeModal) return;
        if (event.offsetX >= 0 && event.offsetX < event.currentTarget.offsetWidth
        && event.offsetY >= 0 && event.offsetY < event.currentTarget.offsetHeight) return;
        const cancelEvent = new Event('cancel', { cancelable: true });
        if (!this.dispatchEvent(cancelEvent)) return;
        this.close();
      },
    },
  })
  .autoRegister('mdw-dialog');
