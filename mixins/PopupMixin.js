import { attemptFocus, isRtl } from '../core/dom.js';
import { canAnchorPopup } from '../utils/popup.js';

import DelegatesFocusMixin from './DelegatesFocusMixin.js';
import '../components/Scrim.js';
import ResizeObserverMixin from './ResizeObserverMixin.js';

const supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

/**
 * @typedef {Object} PopupStack
 * @prop {Element} element
 * @prop {Element} previousFocus
 * @prop {boolean} [centered=false]
 * @prop {Record<string, any>} [state]
 * @prop {Record<string, any>} [previousState]
 * @prop {any} [pendingResizeOperation]
 * @prop {window['history']['scrollRestoration']} [scrollRestoration]
 */

/** @type {PopupStack[]} */
const OPEN_POPUPS = [];

/**
 * @return {void}
 */
function onWindowResize() {
  // Fire in popup order
  for (const { element } of OPEN_POPUPS) {
    if (element._pendingResizeOperation) {
      cancelAnimationFrame(element._pendingResizeOperation);
      element._pendingResizeOperation = null;
    }
    element.schedulePopupPosition();
  }
}

/**
 * Prevent focus being given to elements via mouse nav back
 * @param {MouseEvent} event
 */
function onNavMouseDown(event) {
  if (event.button === 3) {
    event.preventDefault();
  }
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
    .mixin(DelegatesFocusMixin)
    .mixin(ResizeObserverMixin)
    .observe({
      open: 'boolean',
      modal: 'boolean',
      native: 'boolean',
      scrollable: 'boolean',
      matchSourceWidth: 'boolean',
      _currentFlow: 'string',
      flow: {
        type: 'string',
        /** @type {'corner'|'adjacent'|'overflow'|'vcenter'|'hcenter'|'center'} */
        value: null,
      },
      popupMargin: 'float',
    })
    .set({
      useHistory: true,
      returnValue: '',
      _closing: false,
      _useScrim: false,
      _isUpdatingPosition: false,
      _pendingResizeOperation: null,
    })
    .define({
      _dialog() {
        return /** @type {HTMLDialogElement} */ (this.refs.dialog);
      },
    })
    .methods({
      schedulePopupPosition() {
        if (this._pendingResizeOperation) return;
        this._pendingResizeOperation = requestAnimationFrame(() => {
          this.updatePopupPosition();
          this._pendingResizeOperation = null;
        });
      },
      /**
       * @param {DOMRect|Element} [anchor]
       * @return {void}
       */
      updatePopupPosition(anchor = this._anchor) {
        this._isUpdatingPosition = true;
        const flow = this._currentFlow ?? this.flow;
        Object.assign(this.style, {
          top: '0',
          left: '0',
          right: 'auto',
          bottom: 'auto',
        });

        const layoutElement = this.native ? this._dialog : this;
        Object.assign(layoutElement.style, { width: 'auto', height: 'auto' });

        const width = (anchor && this.matchSourceWidth)
          ? anchor.clientWidth
          : 56 * Math.ceil(layoutElement.clientWidth / 56);

        layoutElement.style.setProperty('width', `${width}px`);

        const height = layoutElement.clientHeight;
        Object.assign(layoutElement.style, { width: null, height: null });

        /** @type {import('../utils/popup.js').CanAnchorPopUpOptions} */
        const anchorOptions = {
          anchor: anchor == null
            ? {
              left: 0,
              width: window.innerWidth,
              right: window.innerWidth,
              top: 0,
              bottom: window.innerHeight,
              height: window.innerHeight,
            }
            : (anchor instanceof Element ? anchor.getBoundingClientRect() : anchor),
          width,
          height,
          margin: this.popupMargin ?? (window.innerWidth < 648 ? 16 : 24),
        };

        const isPageRTL = isRtl(this);
        const xStart = isPageRTL ? 'right' : 'left';
        const xEnd = isPageRTL ? 'left' : 'right';

        /* Automatic Positioning
         *
         * Positions:
         *
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
          ((flow ?? 'corner') === 'corner') ? [
            { clientY: 'bottom', clientX: xStart },
            { clientY: 'bottom', clientX: xEnd },
            { clientY: 'top', clientX: xStart },
            { clientY: 'top', clientX: xEnd },
          ] : [],
          ((flow ?? 'adjacent') === 'adjacent') ? [
            { clientY: 'top', clientX: xEnd, directionX: xEnd, directionY: 'down' },
            { clientY: 'top', clientX: xStart, directionX: xStart, directionY: 'down' },
            { clientY: 'bottom', clientX: xEnd, directionX: xEnd, directionY: 'up' },
            { clientY: 'bottom', clientX: xStart, directionX: xStart, directionY: 'up' },
          ] : [],
          ((flow ?? 'overlay') === 'overlay') ? [
            { clientY: 'top', clientX: xStart, directionX: xEnd, directionY: 'down' },
            { clientY: 'top', clientX: xEnd, directionX: xStart, directionY: 'down' },
            { clientY: 'bottom', clientX: xStart, directionX: xEnd, directionY: 'up' },
            { clientY: 'bottom', clientX: xEnd, directionX: xStart, directionY: 'up' },
          ] : [],
          ((flow ?? 'vcenter') === 'vcenter') ? [
            { clientY: 'center', clientX: xEnd, directionX: xEnd, directionY: 'center' },
            { clientY: 'center', clientX: xStart, directionX: xStart, directionY: 'center' },
          ] : [],
          ((flow ?? 'hcenter') === 'hcenter') ? [
            { clientY: 'bottom', clientX: 'center', directionX: 'center', directionY: 'down' },
            { clientY: 'top', clientX: 'center', directionX: 'center', directionY: 'up' },
          ] : [],
          ((flow ?? 'center') === 'center') ? [
            { clientY: 'center', clientX: 'center', directionX: 'center', directionY: 'center' },
          ] : [],
        ].flat();

        let anchorResult;
        for (const preference of preferences) {
          const result = canAnchorPopup({
            ...anchorOptions,
            ...preference,
          });
          if (!anchorResult || anchorResult.visibility < result.visibility) {
            anchorResult = result;
          }
          if (result.visibility === 1) break;
        }

        Object.assign(this.style, anchorResult.styles);
        // this.scrollIntoView();
        this._isUpdatingPosition = false;
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
       * @param {boolean} focus
       * @param {string} flow
       * @return {boolean} handled
       */
      showPopup(source, focus = true, flow = null) {
        if (this.open) return false;
        this.open = true;
        this._source = source;
        this._anchor = source;

        const { scrim } = this.refs;
        if (this._useScrim) {
          if (this.native) {
            document.body.append(scrim);
          } else {
            this.before(scrim);
          }
          scrim.hidden = false;
        } else {
          scrim.remove();
        }

        const previousFocus = source instanceof HTMLElement ? source : document.activeElement;

        if (supportsHTMLDialogElement && focus // Calling show will force focus which is not intended for non-modals
          && !this._dialog.open) {
          this._dialog.show();
        }

        this._currentFlow = flow;

        // Short first, then move
        // Native modals can fail update bounds on Chrome
        this.updatePopupPosition(source);

        let newState;
        let scrollRestoration;
        let previousState;
        if (this.useHistory) {
          newState = { hash: Math.random().toString(36).slice(2, 18) };

          if (!window.history.state) {
            // Create new previous state
            window.history.replaceState({
              hash: Math.random().toString(36).slice(2, 18),
            }, document.title);
          }
          previousState = window.history.state;

          scrollRestoration = window.history.scrollRestoration;

          window.history.scrollRestoration = 'manual';
          window.history.pushState(newState, document.title);
          window.addEventListener('popstate', onPopState);
          window.addEventListener('beforeunload', onBeforeUnload);
        }

        window.addEventListener('mousedown', onNavMouseDown, { capture: true });

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('scroll', onWindowResize);
        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', onWindowResize);
          window.visualViewport.addEventListener('scroll', onWindowResize);
        }

        OPEN_POPUPS.push({
          element: this,
          previousFocus,
          state: newState,
          previousState,
          scrollRestoration,
        });

        // Overrideable
        if (focus) {
          this.focus();
        }

        return true;
      },
      /**
       * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
       * @param {boolean} [focus]
       * @param {string} [flow]
       * @return {boolean} handled
       */
      showModal(source, focus, flow) {
        if (this.open) return false;
        this.modal = true;
        if (supportsHTMLDialogElement) {
          this._dialog.showModal();
          this.native = true;
        }
        return this.showPopup(source, focus, flow);
      },
      /**
       * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
       * @param {boolean} [focus]
       * @param {string} [flow]
       * @return {boolean} handled
       */
      show(source, focus, flow) {
        // Auto-select type based on default platform convention
        // Mac OS X / iPad does not expect clickthrough
        if (navigator.userAgent.includes('Mac OS X')) {
          return this.showModal(source, focus, flow);
        }
        return this.showPopup(source, focus, flow);
      },
      /**
       * @param {any} [returnValue]
       * @param {boolean} [returnFocus=true]
       * @return {boolean} handled
       */
      close(returnValue = undefined, returnFocus = true) {
        if (!this.open) return false;
        if (this._closing) return false;
        this._source = null;
        this._closing = true;
        this.modal = false;

        // SCRIM
        this.refs.scrim.hidden = true;

        if (this.native) {
          this.native = false;
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
        this._currentFlow = null;

        this.dispatchEvent(new Event('close'));

        const len = OPEN_POPUPS.length;
        for (let i = len - 1; i >= 0; i--) {
          const entry = OPEN_POPUPS[i];
          if (entry.element === this) {
            if (this.useHistory) {
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
            }
            if (returnFocus) {
              // console.log('not returning focus');
              entry.previousFocus?.focus?.({ preventScroll: true });
            }
            OPEN_POPUPS.splice(i, 1);
            break;
          } else if (this.contains(entry.element)) {
            // console.debug('Closing submenu first');
            entry.element.close(false);
            // console.debug('Sub menu closed. Continuing...');
          }
        }
        if (!OPEN_POPUPS.length) {
          window.removeEventListener('popstate', onPopState);
          window.removeEventListener('beforeunload', onBeforeUnload);
          window.removeEventListener('resize', onWindowResize);
          window.removeEventListener('mousedown', onNavMouseDown, { capture: true });
          // console.debug('All menus closed');
        }
        this._closing = false;
        return true;
      },
    })

    .overrides({
      onResizeObserved(entry) {
        if (!this.open || this._closing) return;
        if (this._isUpdatingPosition) {
          return;
        }
        this.updatePopupPosition();
      },
    })
    .expressions({
      _ariaHidden({ open }) { return (open ? 'false' : 'true'); },
    })
    .html`
      <mdw-scrim id=scrim tabindex=-1 aria-hidden=true></mdw-scrim>
      <dialog id=dialog aria-modal=true role=dialog
      aria-hidden={_ariaHidden} scrollable={scrollable}>
        <slot id=slot on-slotchange={onSlotChange}></slot>
      </dialog>
    `
    .css`
    /* https://m3.material.io/components/dialogs/specs */

    :host {
      --mdw-popup__expand-duration: var(--mdw-motion-expand-duration, 250ms);
      --mdw-popup__simple-duration: var(--mdw-motion-simple-duration, 100ms);
      --mdw-popup__standard-easing: var(--mdw-motion-standard-easing, cubic-bezier(0.4, 0.0, 0.2, 1));
      --mdw-popup__deceleration-easing: var(--mdw-motion-deceleration-easing, cubic-bezier(0.0, 0.0, 0.2, 1));
      --mdw-popup__fade-in-duration: var(--mdw-motion-fade-in-duration, 150ms);

      --mdw-shape__size: 28px;

      /* padding-inline: 12px; */

      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);

      position: fixed;

      inset-block-start: 0;
      inset-inline-start: 0;
      align-self: center;
      justify-self: center;

      display: block;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: none;
      overscroll-behavior: contain;

      box-sizing: border-box;
      block-size: auto;
      min-block-size: none;
      max-block-size: 100vh;
      inline-size: auto;
      min-inline-size: none;
      max-inline-size: 100vw;

      outline: none; /* Older Chromium Builds */
  
      
      pointer-events: none;

      opacity: 0;

      visibility: hidden;
      z-index: 24;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);

      transition-delay: 0s, 200ms;
      transition-duration: 200ms, 0s;
      transition-property: opacity, visibility;
      transition-timing-function: ease-out;

      will-change: opacity;

    }

    :host([open]) {
      pointer-events: auto;

      opacity: 1;

      transform: scale(1);
      visibility: inherit;

      transition-delay: 0s;
      transition-timing-function: ease-in;
    }

    :host([native][open]) {
      opacity: 0;
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
      place-items: inherit;

      box-sizing: border-box;
      block-size: inherit;
      flex: inherit;
      margin:0;
      border: none;
      padding: inherit;
      padding: 0;

      pointer-events: auto;

      filter: inherit;

      opacity: 1;

      transform:inherit;
      visibility: inherit;
      /* visiblity:hidden still registers events, hide from pointer with scale(0) */
      z-index: 24;

      background-color: transparent;

      color:inherit;
      
    }

    :host([color]) {
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }

    :host(:is([color="none"],[color="transparent"])) {
      background-color: transparent;
      color: inherit;
    }

    :host([scrollable]) {
      overflow-y:auto;
    }

    #dialog::backdrop {
      /** Use scrim instead */
      background-color: transparent;
    }

    #dialog:modal {
      position: inherit;
      inset: inherit;

      display: inherit;
      align-items: inherit;
      flex-direction: inherit;
      gap: inherit;
      justify-content: inherit;
      justify-items: inherit;
      place-items: inherit;

      block-size: auto;
      min-block-size: inherit;
      max-block-size: inherit;

      inline-size:auto;
      min-inline-size: inherit;
      max-inline-size: inherit;
      flex: inherit;
      padding: inherit;

      pointer-events: auto;

      filter: inherit;
      transform: inherit;
      visibility: inherit;

      background-color: inherit;
      border-radius: inherit;
    }

    #dialog[scrollable][open] {
      display: inherit;
      align-items: inherit;
      flex-direction: inherit;
      gap: inherit;
      justify-content: inherit;
      justify-items: inherit;
      
      place-items: inherit;

      block-size: 100%;
      max-block-size: none;
      inline-size: 100%;
      max-inline-size: none;

      flex: 1;
    }

    

    #dialog[scrollable][open]:modal {
      overflow:auto;

      block-size:100%;
      min-block-size: none;
      max-block-size: inherit;
      inline-size:100%;
      min-inline-size: none;
      max-inline-size: inherit;
      flex: inherit;
      padding: inherit;
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
          if (!this.native) return;
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
