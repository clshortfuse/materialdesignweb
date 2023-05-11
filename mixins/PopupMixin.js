/**
 * @typedef {Object} PopupStack
 * @prop {Element} element
 * @prop {Element} previousFocus
 * @prop {boolean} [centered=false]
 * @prop {Record<string, any>} [state]
 * @prop {Record<string, any>} [previousState]
 * @prop {MouseEvent|PointerEvent|HTMLElement|Element} [originalEvent]
 * @prop {any} [pendingResizeOperation]
 * @prop {window['history']['scrollRestoration']} [scrollRestoration]
 */

import CustomElement from '../core/CustomElement.js';
import { attemptFocus } from '../core/dom.js';
import { canAnchorPopup } from '../utils/popup.js';

CustomElement
  .extend()
  .observe({
    hidden: 'boolean',
  })
  .css/* css */`
    :host {
      position: fixed;
      inset: 0;

      opacity: 0;

      z-index: 23;

      background-color: rgb(var(--mdw-color__scrim));
      
      animation: fade-in 200ms forwards ease-out;
      
      will-change: opacity;
    }

    :host([hidden]) {
      display: block;

      animation-name: fade-out;
      animation-timing-function: ease-in;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 0.38;
      }
    }

    @keyframes fade-out {
      from {
        opacity: 0.38;
      }

      to {
        opacity: 0;
      }
    }
  `
  .events({
    animationend(event) {
      if (this.hidden) this.remove();
    },
  })
  .autoRegister('mdw-scrim');

const supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';
/** @type {PopupStack[]} */
const OPEN_POPUPS = [];

/**
 * @return {void}
 */
function onWindowResize() {
  const lastOpenPopup = OPEN_POPUPS.at(-1);
  if (!lastOpenPopup || !lastOpenPopup.originalEvent) {
    return;
  }
  if (lastOpenPopup.pendingResizeOperation) {
    cancelAnimationFrame(lastOpenPopup.pendingResizeOperation);
  }
  lastOpenPopup.pendingResizeOperation = requestAnimationFrame(() => {
    lastOpenPopup.element.updatePopupPosition(lastOpenPopup.originalEvent);
    lastOpenPopup.pendingResizeOperation = null;
  });
}

/**
 * @param {PopStateEvent} event
 */
function onPopState(event) {
  if (!event.state) return;
  const lastOpenPopup = OPEN_POPUPS.at(-1);
  if (!lastOpenPopup || !lastOpenPopup.previousState) {
    return;
  }
  if ((lastOpenPopup.previousState === event.state) || Object.keys(event.state)
    .every((key) => event.state[key] === lastOpenPopup.previousState[key])) {
    // Close (cancel event) can be prevented. Fire and check if prevented
    const cancelEvent = new Event('cancel', { cancelable: true });
    if (lastOpenPopup.element.dispatchEvent(cancelEvent)) {
      lastOpenPopup.element.close();
    } else {
      // Revert pop state by pushing state again
      window.history.pushState(lastOpenPopup.state, lastOpenPopup.state.title);
    }
  }
}

/** @param {BeforeUnloadEvent} event */
function onBeforeUnload(event) {
  if (!OPEN_POPUPS.length) return;
  console.warn('Popup was open during page unload (refresh?).');
}

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function PopupMixin(Base) {
  return Base
    .extend()
    .observe({
      open: 'boolean',
      modal: 'boolean',
      _isNativeModal: 'boolean',
      scrollable: 'boolean',
      matchSourceWidth: 'boolean',
    })
    .set({
      returnValue: '',
      delegatesFocus: true,
      _closing: false,
      _useScrim: false,
    })
    .define({
      _dialog() {
        return /** @type {HTMLDialogElement} */ (this.refs.dialog);
      },
    })
    .methods({
      /**
       * @param {DOMRect|Element} [anchor]
       * @return {void}
       */
      updatePopupPosition(anchor) {
        this.style.setProperty('max-height', 'none');
        this.style.setProperty('top', '0');
        this.style.setProperty('left', '0');
        this.style.setProperty('--mdw-popup__x-offset', '0');
        this.style.setProperty('--mdw-popup__y-offset', '0');

        let size;
        if (anchor && this.matchSourceWidth) {
          size = anchor.clientWidth;
        } else {
          const layoutElement = this._isNativeModal ? this._dialog : this;
          layoutElement.style.setProperty('width', 'auto');
          size = 56 * Math.ceil(layoutElement.clientWidth / 56);
          layoutElement.style.removeProperty('width');
        }

        this.style.setProperty('width', `${size}px`);

        const initialRect = this.getBoundingClientRect();
        /** @type {import('../utils/popup.js').CanAnchorPopUpOptions} */
        const anchorOptions = {
          anchor: anchor ?? this.getBoundingClientRect(),
          width: this.clientWidth,
          height: this.clientHeight,
        // margin,
        };

        const isPageRTL = (getComputedStyle(this).direction === 'rtl');
        const xStart = isPageRTL ? 'right' : 'left';
        const xEnd = isPageRTL ? 'left' : 'right';

        /* Automatic Positioning
       *
       * Positions:
       *   3      7      4
       *     ┌─────────┐
       *     │         │
       *   5 │    9    │ 6
       *     │         │
       *     └─────────┘
       *   1      8      2
       *
       * 1: Bottom Left
       * 2: Bottom Right
       * 3: Top Left
       * 4: Top Right
       * 5: VCenter Left
       * 6: VCenter Right
       * 7: HCenter Top
       * 8: HCenter Bottom
       * 9: VCenter HCenter
       *
       * Directions:
       * a - Down LTR
       * b - Down RTL
       * c - Up LTR
       * d - Up RTL
       * e - LTR
       * f - RTL
       * g - Down
       * h - Up
       * i - Center
       *
       *
       * 16 total combos
       * 1a 1b 1c 1d  └↘ └↙ └↗ └↖
       * 2a 2b 2c 2d  ┘↘ ┘↙ ┘↗ ┘↖
       * 3a 3b 3c 3d  ┌↘ ┌↙ ┌↗ ┌↖
       * 4a 4b 4c 4d  ┐↘ ┐↙ ┐↗ ┐↖
       *
       * Avoid using opposite angle
       *
       * 1a XX 1c 1d  └↘ ██ └↗ └↖
       * XX 2b 2c 2d  ██ ┘↙ ┘↗ ┘↖
       * 1a 3b 3c XX  ┌↘ ┌↙ ┌↗ ██
       * 4a 4b XX 4d  ┐↘ ┐↙ ██ ┐↖
       *
       *
       * Preference Order:
       * - Flow from corner           1a 2b 3c 4d    └↘ ┘↙ ┌↗ ┐↖
       * - Open adjacent to target    4a 3b 2c 1d    ┐↘ ┌↙ ┘↗ └↖
       * - Overlay target             3a 4b 1c 2d    ┌↘ ┐↙ └↗ ┘↖
       * - Open from horizontal side  5e 6f          │→ │←
       * - Open from center           9i             █·
       */

        /** @type {import('../utils/popup.js').CanAnchorPopUpOptions[]} */
        const preferences = [
          (!this.submenu && (this.flow ?? 'corner') === 'corner') ? [
            { clientY: 'bottom', clientX: xStart },
            { clientY: 'bottom', clientX: xEnd },
            { clientY: 'top', clientX: xStart },
            { clientY: 'top', clientX: xEnd },
          ] : [],
          (this.submenu || (this.flow ?? 'adjacent') === 'adjacent') ? [
            { clientY: 'top', clientX: xEnd, directionX: xEnd, directionY: 'down' },
            { clientY: 'top', clientX: xStart, directionX: xStart, directionY: 'down' },
            { clientY: 'bottom', clientX: xEnd, directionX: xEnd, directionY: 'up' },
            { clientY: 'bottom', clientX: xStart, directionX: xStart, directionY: 'up' },
          ] : [],
          (!this.submenu && (this.flow ?? 'overlay') === 'overlay') ? [
            { clientY: 'top', clientX: xStart, directionX: xEnd, directionY: 'down' },
            { clientY: 'top', clientX: xEnd, directionX: xStart, directionY: 'down' },
            { clientY: 'bottom', clientX: xStart, directionX: xEnd, directionY: 'up' },
            { clientY: 'bottom', clientX: xEnd, directionX: xStart, directionY: 'up' },
          ] : [],
          (!this.submenu && (this.flow ?? 'vcenter') === 'vcenter') ? [
            { clientY: 'center', clientX: xEnd, directionX: xEnd, directionY: 'center' },
            { clientY: 'center', clientX: xStart, directionX: xStart, directionY: 'center' },
          ] : [],
          (!this.submenu && (this.flow ?? 'hcenter') === 'hcenter') ? [
            { clientY: 'bottom', clientX: 'center', directionX: 'center', directionY: 'down' },
            { clientY: 'top', clientX: 'center', directionX: 'center', directionY: 'up' },
          ] : [],
          (!this.submenu && (this.flow ?? 'center') === 'center') ? [
            { clientY: 'center', clientX: 'center', directionX: 'center', directionY: 'center' },
          ] : [],
        ].flat();

        let anchorResult;
        for (const preference of preferences) {
          anchorResult = canAnchorPopup({
            ...anchorOptions,
            ...preference,
          });
          if (anchorResult) break;
        }

        if (!anchorResult) {
          anchorResult = canAnchorPopup({
            ...anchorOptions,
            ...preferences[0],
            force: true,
          });
        }

        this.style.setProperty('top', `${anchorResult.pageY - initialRect.y}px`);
        this.style.setProperty('left', `${anchorResult.pageX - initialRect.x}px`);
        this.style.setProperty('margin', '0');
        this.style.setProperty('transform-origin', `${anchorResult.transformOriginY} ${anchorResult.transformOriginX}`);
        this.scrollIntoView();
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
       * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
       * @param focus
       * @return {boolean} handled
       */
      showPopup(source, focus = true) {
        if (this.open) return false;
        this.open = true;

        // SCRIM
        if (this._useScrim) {
          document.body.append(this.refs.scrim);
          this.refs.scrim.hidden = false;
        } else {
          this.refs.scrim.remove();
        }

        const previousFocus = source instanceof HTMLElement ? source : document.activeElement;

        if (supportsHTMLDialogElement && focus) {
          // Calling show will force focus which is not intended for non-modals
          this._dialog.show();
        }

        // Short first, then move
        // Native modals can fail update bounds on Chrome
        this.updatePopupPosition(source);

        const newState = { hash: Math.random().toString(36).slice(2, 18) };
        let previousState = null;

        if (!window.history.state) {
          // Create new previous state
          window.history.replaceState({
            hash: Math.random().toString(36).slice(2, 18),
          }, document.title);
        }
        previousState = window.history.state;

        const scrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
        window.history.pushState(newState, document.title);
        console.debug('Popup pushed page');
        window.addEventListener('popstate', onPopState);
        window.addEventListener('beforeunload', onBeforeUnload);

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('scroll', onWindowResize);

        OPEN_POPUPS.push({
          element: this,
          previousFocus,
          state: newState,
          previousState,
          originalEvent: source,
          scrollRestoration,
        });

        // Overrideable
        if (focus) {
          console.log('focusing!');
          this.focus();
        }

        return true;
      },
      /**
       * @param {MouseEvent|PointerEvent|HTMLElement|Element} source
       * @return {boolean} handled
       */
      showModal(source) {
        if (this.open) return false;
        this.modal = true;
        if (supportsHTMLDialogElement) {
          this._dialog.showModal();
          this._isNativeModal = true;
        }
        return this.showPopup(source);
      },
      /**
       * @param {MouseEvent|PointerEvent|HTMLElement|Element} source
       * @return {boolean} handled
       */
      show(source) {
        // Auto-select type based on default platform convention
      // Mac OS X / iPad does not expect clickthrough
        if (navigator.userAgent.includes('Mac OS X')) {
          return this.showModal(source);
        }
        return this.showPopup(source);
      },
      /**
       * @param {any} [returnValue]
       * @param {boolean} [returnFocus=true]
       * @return {boolean} handled
       */
      close(returnValue = undefined, returnFocus = true) {
        if (!this.open) return false;
        if (this._closing) return false;
        this._closing = true;
        this.modal = false;

        // SCRIM
        this.refs.scrim.hidden = true;

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
          const previousFocus = document.activeElement;
          // Closing a native dialog will return focus automatically.
          this._dialog.close();
          if (!attemptFocus(previousFocus, { preventScroll: true })) {
            document.activeElement?.blur?.();
          }
        } else {
          this._dialog.returnValue = returnValue;
        }

        // Will invoke observed attribute change: ('aria-hidden', 'true');
        this.open = false;

        this.dispatchEvent(new Event('close'));

        const len = OPEN_POPUPS.length;
        for (let i = len - 1; i >= 0; i--) {
          const entry = OPEN_POPUPS[i];
          if (entry.element === this) {
            if (entry.state && window.history
              && window.history.state && entry.state.hash === window.history.state.hash) {
              window.removeEventListener('popstate', onPopState);
              window.history.back();
              // Back does not set state immediately
              // Needed to track submenu
              // TODO: use window.history.go(indexDelta) instead for Safari (not Webkit) submenu support
              window.history.replaceState(entry.previousState, document.title);
              window.history.scrollRestoration = entry.scrollRestoration || 'auto';
              window.addEventListener('popstate', onPopState);
            } else {
              console.warn('Menu state mismatch?', entry, window.history.state);
            }
            if (returnFocus) {
              console.log('not returning focus');
              entry.previousFocus?.focus?.({ preventScroll: true });
            }
            OPEN_POPUPS.splice(i, 1);
            break;
          } else if (this.contains(entry.element)) {
            console.debug('Closing submenu first');
            entry.element.close(false);
            console.debug('Sub menu closed. Continuing...');
          }
        }
        if (!OPEN_POPUPS.length) {
          window.removeEventListener('popstate', onPopState);
          window.removeEventListener('beforeunload', onBeforeUnload);
          window.removeEventListener('resize', onWindowResize);
          console.debug('All menus closed');
        }
        this._closing = false;
        return true;
      },
    })
    .expressions({
      _ariaHidden({ open }) { return (open ? 'false' : 'true'); },
    })
    .html/* html */`
      <mdw-scrim id=scrim tabindex=-1 aria-hidden=true></mdw-scrim>
      <dialog id=dialog aria-modal=true role=dialog
      aria-hidden={_ariaHidden}>
        <slot id=slot scrollable={scrollable} on-slotchange={onSlotChange}></slot>
      </dialog>
    `
    .css/* css */`
    /* https://m3.material.io/components/dialogs/specs */

    :host {
      --mdw-popup__expand-duration: var(--mdw-motion-expand-duration, 250ms);
      --mdw-popup__simple-duration: var(--mdw-motion-simple-duration, 100ms);
      --mdw-popup__standard-easing: var(--mdw-motion-standard-easing, cubic-bezier(0.4, 0.0, 0.2, 1));
      --mdw-popup__deceleration-easing: var(--mdw-motion-deceleration-easing, cubic-bezier(0.0, 0.0, 0.2, 1));
      --mdw-popup__fade-in-duration: var(--mdw-motion-fade-in-duration, 150ms);
      --mdw-popup__x-offset: -50%;
      --mdw-popup__y-offset: -50%;

      --mdw-shape__size: 28px;

      --mdw-surface__tint: var(--mdw-surface__tint__3);
      --mdw-surface__tint__raised: var(--mdw-surface__tint);

      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__3);
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__resting);
      /* padding-inline: 12px; */

      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);

      position: fixed;

      /* stylelint-disable-next-line liberty/use-logical-spec */
      top: 50%;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 50%;
      align-self: center;
      justify-self: center;

      display: block;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: none;
      overscroll-behavior: contain;

      box-sizing: border-box;
      block-size: auto;
      min-block-size: none;
      max-block-size: none;
      inline-size: auto;
      min-inline-size: none;
      max-inline-size: none;
  
      
      pointer-events: none;

      opacity: 0;

      transform: translateX(var(--mdw-popup__x-offset)) translateY(var(--mdw-popup__y-offset)) scale(0) ;
      /* visiblity:hidden still registers events, hide from pointer with scale(0) */
      transform-origin: top center;
      visibility: hidden;
      z-index: 24;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);

      transition-delay: 0s, 200ms, 200ms;
      transition-duration: 200ms, 0s, 0s;
      transition-property: opacity, transform, visibility;
      transition-timing-function: ease-out;

      will-change: display, transform;
      will-change: opacity;

    }

    :host([open]) {
      pointer-events: auto;

      opacity: 1;

      transform: translateX(var(--mdw-popup__x-offset)) translateY(var(--mdw-popup__y-offset)) scale(1);
      visibility: visible;

      transition-delay: 0s;
      transition-duration: 0s;
      transition-timing-function: ease-in;
    }

    #dialog {
      position: static;
      inset-block-start: 0;
      inset-inline-start: 0;

      display: contents;
      align-items: inherit;
      flex-direction: inherit;
      gap: inherit;
      justify-content: inherit;
      justify-items: inherit;
      overflow: visible;
      place-items: inherit;

      box-sizing: border-box;

      block-size: inherit;
      
      
      flex: inherit;
      margin:0;
      border: none;
      padding: inherit;
      padding: 0;

      pointer-events: auto;

      opacity: 1;

      transform:inherit;
      visibility: inherit;
      /* visiblity:hidden still registers events, hide from pointer with scale(0) */
      z-index: 24;

      background-color: transparent;

      color:inherit;

    }

    #dialog::backdrop {
      /** Use scrim instead */
      background-color: transparent;
    }

    #dialog:modal {
      position: inherit;
      inset: inherit;

      display: contents;
      display: inherit;
      align-items: inherit;
      flex-direction: inherit;
      gap: inherit;
      justify-content: inherit;
      justify-items: inherit;
      place-items: inherit;

      block-size: inherit;
      min-block-size: inherit;
      max-block-size: inherit;

      inline-size:inherit;
      min-inline-size: inherit;
      max-inline-size: inherit;
      flex: inherit;
      padding: inherit;

      pointer-events: auto;

      transform: inherit;
      visibility: inherit;
      
    }

    #slot[scrollable]::slotted(*) {
      overflow-y:auto;
    }
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
      scrim: {
        '~click'() {
          const cancelEvent = new Event('cancel', { cancelable: true });
          if (!this.dispatchEvent(cancelEvent)) return;
          this.close();
        },
      },
    });
}
