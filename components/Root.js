/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';

export default CustomElement
  .extend()
  .mixin(ScrollListenerMixin)
  .mixin(DelegatesFocusMixin)
  .set({
    /** @type {ResizeObserver} */
    _bottomResizeObserver: null,
  })
  .html`
    <slot id=start name=start></slot>
    <div id=bottom>
      <slot id=bottom-slot name=bottom></slot>
    </div>
    <div id=bottom-fixed>
      <slot id=bottom-fixed-slot name=bottom-fixed></slot>
    </div>
    <slot id=slot></slot>
    <slot id=end name=end></slot>
  `
  .observe({
    _bottomHeight: { type: 'float', empty: 0 },
    _bottomOffsetY: { type: 'float', empty: 0 },
    _bottomDuration: { type: 'float', empty: 0 },
    _bottomEasing: { empty: 'ease-in' },
  })
  .observe({
    _sharedBottomStyle({ _bottomOffsetY, _bottomDuration, _bottomEasing, _bottomHeight }) {
      if (!_bottomHeight) return null;
      return {
        styles: {
          transform: `translateY(${_bottomOffsetY}px)`,
        },
        timing: {
          duration: _bottomDuration,
          easing: _bottomEasing,
        },
      };
    },
  })
  .observe({
    _bottomSlotStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ _sharedBottomStyle }) {
        if (!_sharedBottomStyle) return null;
        return {
          target: 'bottom-slot',
          ..._sharedBottomStyle,
        };
      },
    },
    _bottomFixedSlotStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ _sharedBottomStyle }) {
        if (!_sharedBottomStyle) return null;
        return {
          target: 'bottom-fixed-slot',
          ..._sharedBottomStyle,
        };
      },
    },
  })
  .on({
    _scrollListenerPositionYChanged(oldValue, newValue) {
      const delta = newValue - oldValue;

      this._bottomDuration = 0;
      // 0 if disabled or has scrolled upto element
      // Valid range : 0 > x > (100% - required)
      const bottomStartsAt = (document.documentElement.scrollHeight - window.innerHeight - 1);
      const distanceFromBottom = bottomStartsAt - newValue;
      const scrollVisible = this._bottomHeight - distanceFromBottom;
      let mustIncludeSpace = 0;
      if (scrollVisible > 0) {
        mustIncludeSpace = scrollVisible;
      }

      this._bottomOffsetY = (newValue === 0 || distanceFromBottom < 0)
        ? 0
        : Math.max(0, Math.min(
          this._bottomOffsetY + delta,
          this._bottomHeight - mustIncludeSpace,
        ));
    },
    _scrollListenerLastIdleChanged() {
      const { _bottomHeight, _bottomOffsetY } = this;
      const visibility = (_bottomHeight - _bottomOffsetY) / _bottomHeight;
      if (visibility <= 0) return;
      if (visibility >= 1) return;
      if (visibility < 0.5) {
        const bottomStartsAt = (document.documentElement.scrollHeight - window.innerHeight - 1);
        const { _scrollListenerPositionY } = this;
        const distanceFromBottom = bottomStartsAt - _scrollListenerPositionY;
        const scrollVisible = _bottomHeight - distanceFromBottom;

        if (_scrollListenerPositionY !== 0 && distanceFromBottom >= 0 && scrollVisible <= 0) {
          this._bottomDuration = 200;
          this._bottomEasing = 'ease-out';
          this._bottomOffsetY = _bottomHeight;
          return;
        }
      }

      // Reveal all
      this._bottomDuration = 250;
      this._bottomEasing = 'ease-in';
      this._bottomOffsetY = 0;
    },
    connected() {
      // eslint-disable-next-line no-multi-assign
      const observer = (this._bottomResizeObserver ??= new ResizeObserver((entries) => {
        for (const { borderBoxSize } of entries) {
          this._bottomHeight = borderBoxSize[0].blockSize;
        }
      }));
      observer.observe(this.refs.bottom);
      this.startScrollListener(window);
    },
    disconnected() {
      this._scrollListenerClear();
      this._bottomResizeObserver.unobserve(this.refs.bottom);
    },
  })
  .css`
    :host {
      position: relative;

      display: grid;
      grid-template:
        "start top     end" auto
        "start content end" minmax(auto, 1fr)
        "start bottom  end" auto
        / minmax(0px, auto) minmax(0px, 100%) minmax(0px, auto);

      min-block-size: 100vh;
      min-block-size: 100dvh;

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    #start {
      display: flex;
      grid-area: start;
    }

    #slot {
      display: block;
      grid-area: content;
      overflow-x: clip;

    }

    #end {
      display: none;

      grid-area: end;

      block-size: 0;
    }

    #bottom {
      position: sticky;
      inset-block-end: 0;

      display: block;
      grid-area: bottom;
      overflow-y: hidden;

      pointer-events: none;

      z-index: 1;
    }

    #bottom-slot {
      position: sticky;
      inset-block-end: 0;

      display: flex;
      /* Tab order flows from bottom-up */
      flex-direction: column-reverse;
    }

    #bottom-fixed {
      position: sticky;
      inset-block-end: 0;

      display: block;
      grid-area: bottom; /* Takes but does not dictate size of bottom area */

      pointer-events: none;

      z-index: 2;
    }

    #bottom-fixed-slot {
      position: absolute;
      inset-block-end: 100%;

      display: block;
    }
  `
  .autoRegister('mdw-root');
