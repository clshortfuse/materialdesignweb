import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE, EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import Scrim from './Scrim.js';

const SUPPORTS_SCROLLEND = 'onscrollend' in window;

/* Weak Collection of Events that cane from drag handle */
const dragHandleEvent = new WeakSet();

CustomElement
  .extend()
  .mixin(StateMixin)
  .set({
    stateLayer: true,
  })
  .html`
    <div id=container>
      <div id=icon aria-hidden=true></div>
    </div>
  `
  .recompose(({ refs: { container, state } }) => {
    container.prepend(state);
  })
  .css`
      :host {
        --mdw-state__hovered-opacity: 0;
        --mdw-state__pressed-opacity: 0;
        position: absolute;
        inset-block-start: 0;
        inset-inline: 0;
        align-self: stretch;

        display: block;
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: grab;

        outline:none;
        pointer-events: auto;
        user-select: none;

        color: rgb(var(--mdw-color__on-surface-variant));
      }

      :host(:active) {
        cursor: grabbing !important;
      }

      #container {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        min-block-size: 48px;
        min-inline-size: 48px;
      }

      #state {
        border-radius: 50%;
      }

      #state[pointed] {
        --mdw-state__focused-opacity: 0;
      }
      

      #icon {
        block-size: 4px;
        inline-size: 32px;

        background-color: currentColor;
        border-radius: 8px;
      }
    `
  .autoRegister('mdw-bottom-sheet-handle');

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
    shapeTop: {
      type: 'boolean',
      empty: 'true',
    },
    modal: 'boolean',
    open: 'boolean',
    _lastComputedBlockSize: {
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
    _dragDeltaY: 'float',
    _dragStartY: 'float',
    _translateY: { value: '100%' },
    _lastChildScrollTime: 'float',
    _ariaValueNow: {
      type: 'integer',
    },
    dragHandle: 'boolean',
    onopen: EVENT_HANDLER_TYPE,
    onclose: EVENT_HANDLER_TYPE,
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
        open, modal, _lastComputedBlockSize, _translateY,
        _animationDuration, _animationEasing,
      }) {
        const computedMargin = (open || modal) ? 0 : `${-1 * _lastComputedBlockSize}px`;
        return {
          styles: {
            marginBottom: computedMargin,
            transform: modal ? `translateY(${_translateY})` : 'none',
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
    <mdw-bottom-sheet-handle id=drag-handle mdw-if={dragHandle} tabindex=0
      role=separator aria-valuemin=-100 aria-valuemax=0 aria-valuenow={_ariaValueNow}></mdw-bottom-sheet-handle>
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
      const { open, _dragDeltaY, _lastComputedBlockSize, modal } = this;
      if (!open || !modal || _dragDeltaY == null) return;
      const visibility = (_lastComputedBlockSize - _dragDeltaY) / _lastComputedBlockSize;
      if (visibility < 0.5) {
        // Should close
        this._animationDuration = 200 * visibility;
        this._animationEasing = 'ease-out';
        this._translateY = '100%';
        this.open = false;
        this.dispatchEvent(new Event('close', { cancelable: false }));
      } else {
        // Should snap back to fully open
        this._animationDuration = 250 * (0.5 * visibility);
        this._translateY = '0';
        this._animationEasing = 'ease-in';
      }
      this._dragDeltaY = null;
      this._dragStartY = null;
    },
    /** @param {PointerEvent} event */
    onDragHandleActive(event) {
      if (!event.isTrusted) return;
      if (!event.isPrimary) return;
      if (event.pointerType === 'touch') return;
      if (event.buttons !== 1) return;
      dragHandleEvent.add(event);
    },
    /** @param {PointerEvent} event */
    onDragHandleInactive(event) {
      if (!event.isTrusted) return;
      if (!event.isPrimary) return;
      if (event.pointerType === 'touch') return;
      if (event.type !== 'pointerup' && event.buttons !== 1) return;
      this.checkDragFinished();
    },
    /** @param {PointerEvent|TouchEvent} event */
    onPointerOrTouchMove(event) {
      /** @type {{clientY:number,pageY:number}} */
      let source;
      if (event.type === 'pointermove') {
        source = /** @type {PointerEvent} */ (event);
        // if (!dragHandleEvent.has(event)) return;
      } else {
        const { touches } = /** @type {TouchEvent} */ (event);
        if (!touches.length) return;
        source = touches[0];
      }
      const { open, _lastChildScrollTime, _dragStartY } = this;
      if (!open || _dragStartY == null) return;
      if (_lastChildScrollTime && performance.now() - _lastChildScrollTime <= (SUPPORTS_SCROLLEND ? 5000 : 500)) {
        // Assume still scrolling
        return;
      }
      let { clientY, pageY } = source;
      clientY ??= pageY - window.scrollY; // Safari
      const delta = Math.max((clientY - _dragStartY), 0);
      this._animationDuration = 0;
      this._dragDeltaY = delta;
      this._translateY = `${delta}px`;
    },
  })
  .overrides({
    onResizeObserved(entry) {
      this._lastComputedBlockSize = entry.borderBoxSize[0]?.blockSize;
    },
  })
  .events({
    '~pointerdown'(event) {
      if (event.pointerType !== 'touch') {
        if (event.buttons !== 1) return;
        // Pointer down isn't from drag-handle. Ignore
        if (!dragHandleEvent.has(event)) return;
      }
      if (!this.open) return;
      let { clientY, pageY } = event;
      clientY ??= pageY - window.scrollY; // Safari
      this._dragStartY = clientY;
      this._dragDeltaY = 0;
    },
    '~pointermove': 'onPointerOrTouchMove',
    '~pointerup'(event) {
      if (event.pointerType === 'touch') return;
      this.checkDragFinished();
    },
    'pointerleave'(event) {
      if (event.pointerType === 'touch') return;
      this.checkDragFinished();
    },
    '~touchmove': 'onPointerOrTouchMove',
    touchcancel: 'checkDragFinished',
    '~touchend': 'checkDragFinished',
    /** Scroll events do no bubble but can be captured, passively */
    '*~scroll'() {
      if (!this.modal) return;
      this.checkDragFinished();
      this._lastChildScrollTime = performance.now();
      // Wiping touch state
      this._dragStartY = null;
      this._dragDeltaY = null;
    },
    '*scrollend'() {
      if (!this.modal) return;
      this._lastChildScrollTime = null;
    },
  })
  .childEvents({
    dragHandle: {
      '~pointerdown': 'onDragHandleActive',
      '~pointermove': 'onDragHandleActive',
    },
  })
  .on({
    openChanged(previous, open) {
      // No longer using initial animation timing of 0
      this._animationDuration = open ? 250 : 200;
      this._translateY = open ? '0' : '100%';
      this._animationEasing = open ? 'ease-in' : 'ease-out';
      this.checkForScrim(true);
      if (open) this.focus();
    },
    modalChanged() {
      this._animationDuration = 0;
      this.checkForScrim(false);
    },
  })
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-ink: var(--mdw-color__on-surface);
      --mdw-shape__size: var(--mdw-shape__extra-large);
      --mdw-shape__size__bottom-start-size: 0px;
      --mdw-shape__size__bottom-end-size: 0px;
      position: sticky;
      inset-block-end: 0;
      inset-inline: 0;

      display: inline-block;
      overflow-y: clip;

      overscroll-behavior: none;
      overscroll-behavior: contain;

      box-sizing: border-box;
      max-block-size: calc(100% - 72px);
      max-inline-size: 640px;
      margin-block-start: auto;
      margin-block-start: 72px;
      margin-inline: auto;
      padding-block-start: 16px;

      pointer-events: none;

      transform: translateY(100%);

      visibility: hidden;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      transition: visibility 200ms;
      
      will-change: transform, margin-block-end, visibility;
    }

    :host(:where([open])) {
      pointer-events: auto;

      visibility: visible;

      transition: visibility 0s;
    }

    :host(:where([modal])) {
      position: fixed;

      z-index: 24;
    }

    :host(:where([drag-handle])) {
      padding-block-start: 48px;
    }
  `
  .autoRegister('mdw-bottom-sheet');
