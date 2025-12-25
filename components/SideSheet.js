import CustomElement from '../core/CustomElement.js';
import { ELEMENT_ANIMATION_TYPE, ELEMENT_STYLE_TYPE, EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import { isRtl } from '../core/dom.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
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
/**
 * Side sheets present content in a surface that slides in from an edge; they
 * support modal and static modes and can be themed and shaped.
 * @see https://m3.material.io/components/side-sheets/overview
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .mixin(AriaReflectorMixin)
  .mixin(DelegatesFocusMixin)
  .mixin(ResizeObserverMixin)
  .observe({
    /** When true the side sheet is fixed (non-modal/static), occupying layout space. */
    fixed: 'boolean',
    /** Whether the sheet is currently open (visible). */
    open: 'boolean',
    /** When true, position the sheet at the inline end edge. */
    inlineEnd: 'boolean',
    /** Last measured inline size (px) used for layout/translate calculations. */
    _lastComputedInlineSize: {
      type: 'float',
      nullable: false,
    },
    /** Animation duration (ms) for sheet open/close transitions. */
    _animationDuration: {
      type: 'integer',
      value: 0,
    },
    /** Animation easing keyword used for sheet transitions. */
    _animationEasing: {
      value: 'ease-out',
    },
    /** Current drag delta X (px) while user is swiping the sheet. */
    _dragDeltaX: 'float',
    /** Starting X coordinate (px) for a drag gesture. */
    _dragStartX: 'float',
    /** CSS translateX value used to animate the sheet position. */
    _translateX: { value: '-100%' },
    /** Timestamp of the last child scroll event (used to avoid gesture conflicts). */
    _lastChildScrollTime: 'float',
    /** Event handler invoked when the sheet toggles. */
    ontoggle: EVENT_HANDLER_TYPE,
    /** Event handler invoked when the sheet closes. */
    onclose: EVENT_HANDLER_TYPE,
    /** Optional auto-open minimum viewport inline-size (px); -1 disables. */
    autoOpen: {
      type: 'float',
      empty: -1,
    },
    /** Optional auto-close maximum viewport inline-size (px); -1 disables. */
    autoClose: {
      type: 'float',
      empty: -1,
    },
    /** Inline-size breakpoint (px) at which the sheet becomes `fixed`. */
    fixedBreakpoint: {
      type: 'float',
      empty: 0,
    },
    /** Internal flag computed from directionality and `inlineEnd`. */
    _isSideSheetRtl: 'boolean',
    /** The theme color token used for the sheet background. */
    color: 'string',
    /** Optional fixed-mode color token applied when sheet is fixed. */
    fixedColor: 'string',
  })
  .set({
    /** @type {InstanceType<Scrim>} */
    _scrim: null,
  })
  .observe({
    /** Computed host style when `fixed` and `fixedColor` are set. */
    _styles: {
      ...ELEMENT_STYLE_TYPE,
      get({ fixed, fixedColor }) {
        if (fixed && fixedColor) {
          return { backgroundColor: `rgb(var(--mdw-color__${fixedColor}))` };
        }
      },
    },
    /** Computed animation/style object applied to the host for open/close. */
    hostStyles: {
      ...ELEMENT_ANIMATION_TYPE,
      get({
        open, fixed, _isSideSheetRtl, _lastComputedInlineSize, _translateX,
        _animationDuration, _animationEasing,
      }) {
        const computedMargin = (open || !fixed) ? 0 : `${-1 * _lastComputedInlineSize}px`;
        return {
          styles: {
            marginLeft: _isSideSheetRtl ? 0 : computedMargin,
            marginRight: _isSideSheetRtl ? computedMargin : 0,
            transform: fixed ? 'none' : `translateX(${_translateX})`,
          },
          timing: {
            duration: _animationDuration,
            easing: _animationEasing,
          },
        };
      },
    },
  })
  .html`<slot id=slot></slot>`
  .methods({
    /**
     * Ensure a scrim is present when the sheet is modal (open && !fixed).
     * When `animate` is true, keep the scrim around to run its fade-out.
     */
    checkForScrim(animate = false) {
      let { open, fixed, _scrim } = this;
      if (open && !fixed) {
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
    /** Evaluate drag state and decide whether to close or snap open. */
    checkDragFinished() {
      const { open, _dragDeltaX, _lastComputedInlineSize, fixed, _isSideSheetRtl } = this;
      if (!open || fixed || _dragDeltaX == null) return;
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
    },
    /** Recompute `fixed`/`open` state based on the window width and breakpoints. */
    onWindowResize() {
      const { autoOpen, fixedBreakpoint, autoClose } = this;
      const containerWidth = window.innerWidth;
      const fixed = (containerWidth >= fixedBreakpoint);
      this.open = fixed
        && autoOpen >= 0
        && (containerWidth >= autoOpen && (autoClose === -1 || containerWidth < autoClose));
      this.fixed = fixed;
    },
  })
  .overrides({
    onResizeObserved(entry) {
      this._lastComputedInlineSize = entry.borderBoxSize[0]?.inlineSize;
    },
  })
  .events({
    '~touchstart'(event) {
      if (!event.touches.length) return;
      const { open, fixed, _isSideSheetRtl } = this;
      if (!open || fixed) return;
      let [{ clientX, pageX }] = event.touches;
      clientX ??= pageX - window.scrollX; // Safari
      this._dragStartX = _isSideSheetRtl
        ? window.innerWidth - clientX
        : clientX;
      this._dragDeltaX = 0;
    },
    '~touchmove'({ touches }) {
      if (!touches.length) return;
      const { open, fixed, _lastChildScrollTime, _dragStartX, _isSideSheetRtl } = this;
      if (!open || fixed || _dragStartX == null) return;
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
      if (this.fixed) return;
      this.checkDragFinished();
      this._lastChildScrollTime = performance.now();
      // Wiping touch state
      this._dragStartX = null;
      this._dragDeltaX = null;
    },
    '*scrollend'() {
      if (this.fixed) return;
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
      this.dispatchEvent(new Event('toggle'));
    },
    fixedChanged() {
      this._animationDuration = 0;
      this.checkForScrim(false);
    },
    constructed() {
      window.addEventListener('resize', this.onWindowResize.bind(this));
    },
    connected() {
      this.onWindowResize();
    },
    inlineEndChanged(previous, inlineEnd) {
      this._isSideSheetRtl = isRtl(this) ? !inlineEnd : inlineEnd;
      this._translateX = this.open ? '0' : (this.inlineEnd ? '100%' : '-100%');
    },
  })
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-ink: var(--mdw-color__on-surface-variant);

      position: fixed;

      inset-block: 0;
      inset-inline: 0 auto;

      display: inline-flex;

      overflow-y:auto;

      overscroll-behavior: none;
      overscroll-behavior: contain;

      box-sizing: border-box;
      block-size: 100vh;
      block-size: 100dvh;
      min-block-size: 100vh;
      min-block-size: 100dvh;
      max-block-size: 100%;

      max-inline-size: calc(100vw - 56px);
      grid-column: 1;

      transform: translateX(-100%);

      visibility: hidden;

      z-index: 24;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      transition: visibility 200ms;
      will-change: transform, margin-inline-start, margin-inline-end, visibility;
    }

    :host(:where([open])) {
      visibility: inherit;

      transition-delay: 0s;
    }

    :host(:where[inline-end]) {
      inset-inline: auto 0;

      transform: translateX(100%);
    }

    :host(:where([fixed])) {
      position: sticky;
      inset-inline: auto;

      max-inline-size: none;

      transform: none;
      z-index: auto;
    }

    :host(:where([inline-end][fixed])) {
      grid-column: 3;
    }
  `
  .autoRegister('mdw-side-sheet');
