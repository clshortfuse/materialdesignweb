import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE, EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import { isRtl } from '../core/dom.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import Scrim from './Scrim.js';

const SUPPORTS_SCROLLEND = 'onscrollend' in window;

/**
 * Side sheets may be static.
 * Side sheets may be modal while retaining their own position.
 * Side sheets can have different modal and static max-sizes.
 * Side sheets can be themed with background color and ink.
 * Side sheets can be shaped.
 * Side sheets do not have states
 * Side sheets can have roles
 * Side sheets delegate focus
 * Static side sheets push in and out content.
 * Modal side sheets slide in and out over content.
 * Modal side sheets anchor position does not need to match static position.
 * Modal side sheets must become "dialog-like", blocking access to all other elements on the screen.
 * Modal side sheets can display elevation
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .mixin(AriaReflectorMixin)
  .mixin(DelegatesFocusMixin)
  .mixin(ResizeObserverMixin)
  .observe({
    modal: 'boolean',
    open: 'boolean',
    inlineEnd: 'boolean',
    _lastComputedInlineSize: {
      type: 'float',
      nullable: false,
    },
    _animationDuration: {
      type: 'integer',
      value: 0,
    },
    _animationEasing: {
      value: 'ease-out',
    },
    _dragDeltaX: 'float',
    _dragStartX: 'float',
    _translateX: { value: '-100%' },
    _lastChildScrollTime: 'float',
    onopen: EVENT_HANDLER_TYPE,
    onclose: EVENT_HANDLER_TYPE,
    autoOpen: {
      type: 'float',
      empty: -1,
    },
    autoClose: {
      type: 'float',
      empty: -1,
    },
    modalBreakpoint: {
      type: 'float',
      empty: 0,
    },
    _isSideSheetRtl: 'boolean',
  })
  .set({
    _hasCheckedResize: false,
    /** @type {InstanceType<Scrim>} */
    _scrim: null,
  })
  .observe({
    hostStyles: {
      ...ELEMENT_STYLER_TYPE,
      get({
        open, modal, _isSideSheetRtl, _lastComputedInlineSize, _translateX,
        _animationDuration, _animationEasing,
      }) {
        const computedMargin = (open || modal) ? 0 : `${-1 * _lastComputedInlineSize}px`;
        return {
          styles: {
            marginLeft: _isSideSheetRtl ? 0 : computedMargin,
            marginRight: _isSideSheetRtl ? computedMargin : 0,
            transform: modal ? `translateX(${_translateX})` : 'none',
          },
          timing: {
            duration: _animationDuration,
            easing: _animationEasing,
          },
        };
      },
    },
  })
  .html`
    <slot id=slot></slot>
  `

  .methods({
    checkForScrim(animate = false) {
      let { open, modal, _scrim } = this;
      if (open && modal) {
        if (!_scrim) {
          _scrim = new Scrim();
          _scrim.addEventListener('click', () => {
            this.open = false;
            if (!this.dispatchEvent(new Event('close', { cancelable: true }))) {
              // Revert if cancelled
              this.open = true;
            }
          });
          this._scrim = _scrim;
        }
        this.before(_scrim);
        _scrim.hidden = false;
      } else if (_scrim) {
        if (!animate) {
          _scrim.remove();
        }
        _scrim.hidden = true;
      }
    },
    checkDragFinished() {
      const { open, _dragDeltaX, _lastComputedInlineSize, modal, _isSideSheetRtl } = this;
      if (!open || !modal || _dragDeltaX == null) return;
      const visibility = (_dragDeltaX + _lastComputedInlineSize) / _lastComputedInlineSize;
      if (visibility < 0.5) {
        // Should close
        this._animationDuration = 200 * visibility;
        this._animationEasing = 'ease-out';
        this._translateX = _isSideSheetRtl ? '-100%' : '100%';
        this.open = false;
        this.dispatchEvent(new Event('close', { cancelable: false }));
      } else {
        // Should snap back to fully open
        this._animationDuration = 250 * (0.5 * visibility);
        this._translateX = '0';
        this._animationEasing = 'ease-in';
      }
      this._dragDeltaY = null;
      this._dragStartY = null;
    },
    onResize() {
      const { autoOpen, modalBreakpoint, autoClose, offsetParent } = this;
      const containerWidth = offsetParent?.clientWidth ?? window.innerWidth;
      const modal = (containerWidth < modalBreakpoint);
      this.open = !modal
        && autoOpen >= 0
        && (containerWidth >= autoOpen && (autoClose === -1 || containerWidth < autoClose));
      this.modal = modal;
      this._hasCheckedResize = true;
    },
  })
  .overrides({
    onResizeObserved(entry) {
      this._lastComputedInlineSize = entry.borderBoxSize[0]?.inlineSize;
      if (!this._hasCheckedResize) {
        this.onResize();
      }
    },
  })
  .events({
    '~touchstart'(event) {
      if (!event.touches.length) return;
      const { open, modal, _isSideSheetRtl } = this;
      if (!open || !modal) return;
      let [{ clientX, pageX }] = event.touches;
      clientX ??= pageX - window.scrollX; // Safari
      this._dragStartX = _isSideSheetRtl
        ? window.innerWidth - clientX
        : clientX;
      this._dragDeltaX = 0;
    },
    '~touchmove'({ touches }) {
      if (!touches.length) return;
      const { open, modal, _lastChildScrollTime, _dragStartX, _isSideSheetRtl } = this;
      if (!open || !modal || _dragStartX == null) return;
      if (_lastChildScrollTime && performance.now() - _lastChildScrollTime <= (SUPPORTS_SCROLLEND ? 5000 : 500)) {
        // Assume still scrolling
        return;
      }
      let [{ clientX, pageX }] = touches;
      clientX ??= pageX - window.scrollX; // Safari

      const delta = _isSideSheetRtl
        ? Math.min((window.innerWidth - clientX) - _dragStartX, 0)
        : Math.min((clientX - _dragStartX), 0);

      this._animationDuration = 0;
      this._dragDeltaX = delta;
      this._translateX = `${_isSideSheetRtl ? (-1 * delta) : delta}px`;
    },
    touchcancel: 'checkDragFinished',
    '~touchend': 'checkDragFinished',
    /** Scroll events do no bubble but can be captured, passively */
    '*~scroll'() {
      if (!this.modal) return;
      this.checkDragFinished();
      this._lastChildScrollTime = performance.now();
      // Wiping touch state
      this._dragStartX = null;
      this._dragDeltaX = null;
    },
    '*scrollend'() {
      if (!this.modal) return;
      this._lastChildScrollTime = null;
    },
  })
  .on({
    openChanged(previous, open) {
      // No longer using initial animation timing of 0
      this._animationDuration = open ? 250 : 200;
      this._translateX = open ? '0' : (this.inlineEnd ? '100%' : '-100%');
      this._animationEasing = open ? 'ease-in' : 'ease-out';
      this.checkForScrim(true);
    },
    modalChanged() {
      this._animationDuration = 0;
      this.checkForScrim(false);
    },
    constructed() {
      window.addEventListener('resize', this.onResize.bind(this));
    },
    disconnected() {
      this._hasCheckedResize = false;
    },
    inlineEndChanged(previous, inlineEnd) {
      this._isSideSheetRtl = isRtl(this) ? !inlineEnd : inlineEnd;
      this._translateX = this.open ? '0' : (this.inlineEnd ? '100%' : '-100%');
    },
  })
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);
      position: sticky;
      inset-block: 0;

      display: inline-block;
      overflow-y:auto;

      overscroll-behavior: none;
      overscroll-behavior: contain;

      box-sizing: border-box;
      block-size: 100vh;
      block-size: 100dvh;
      min-block-size: 100vh;
      min-block-size: 100dvh;
      max-block-size: 100%;

      visibility: hidden;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      transition: visibility 200ms;
      
      will-change: transform, margin-inline-start, margin-inline-end, visibility;
    }

    :host(:where([open])) {
      visibility: visible;

      transition: visibility 0s;
    }

    :host(:where([modal])) {
      position: fixed;
      inset-inline: 0 auto;

      max-inline-size: calc(100vw - 56px);

      transform: translateX(-100%);

      z-index: 24;
    }

    :host(:where([inline-end][modal])) {
      inset-inline: auto 0;

      transform: translateX(100%);
    }
  `
  .autoRegister('mdw-side-sheet');