import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';

import ScrollListenerMixin from './ScrollListenerMixin.js';

/**
 * Hides sticky element when scrolling down
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function SemiStickyMixin(Base) {
  return Base
    .mixin(ScrollListenerMixin)
    .observe({
      _semiStickyHeight: { type: 'float', empty: 0 },
      _semiStickyOffsetY: { type: 'float', empty: 0 },
      _semiStickyWidth: { type: 'float', empty: 0 },
      _semiStickyOffsetX: { type: 'float', empty: 0 },
      _semiStickyTranslateY: { type: 'float', empty: 0 },
      _semiStickyTranslateX: { type: 'float', empty: 0 },
      _semiStickyDuration: { type: 'float', empty: 0 },
      _semiStickyEasing: { empty: 'ease-in' },
      _semiStickyAnchor: {
        /** @type {'top'|'start'|'end'|'bottom'|'left'|'right'} */
        empty: 'top',
      },
      stickyAlways: 'boolean',
    })
    .methods({
      /** @return {HTMLElement} */
      _getSemiStickyElement() { return this; },
      _refreshSemiStickyMetrics() {
        const semiStickyElement = this._getSemiStickyElement();
        this._semiStickyHeight = semiStickyElement.offsetHeight;
        this._semiStickyWidth = semiStickyElement.offsetWidth;
        // No way to measure offset when stickied ?
        semiStickyElement.style.position = 'relative';
        this._semiStickyOffsetY = semiStickyElement.offsetTop;
        this._semiStickyOffsetX = semiStickyElement.offsetLeft;
        semiStickyElement.style.position = 'sticky';
      },
    })
    .observe({
      _semiStickyStyleStyle: {
        ...ELEMENT_STYLER_TYPE,
        get({ _semiStickyTranslateX, _semiStickyTranslateY, _semiStickyDuration, _semiStickyEasing }) {
          return {
            target: this._getSemiStickyElement(),
            styles: {
              transform: `translateX(${_semiStickyTranslateX}px) translateY(${_semiStickyTranslateY}px)`,
            },
            timing: {
              duration: _semiStickyDuration,
              easing: _semiStickyEasing,
            },
          };
        },
      },
    })
    .on({
      _scrollListenerLastResizeChanged() {
        if (this._semiStickyAnchor !== 'bottom') return;
        // Chrome Bug: When window resizes bottom sticky needs to be recomputed
        // Force style recalculation
        const semiStickyElement = this._getSemiStickyElement();
        semiStickyElement.style.setProperty('bottom', 'auto');
        // eslint-disable-next-line no-unused-expressions
        semiStickyElement.clientHeight;
        semiStickyElement.style.removeProperty('bottom');
        this.propChangedCallback('_scrollListenerPositionY', this._scrollListenerPositionY, this._scrollListenerPositionY);
      },
      _scrollListenerPositionYChanged(oldValue, newValue) {
        const delta = newValue - oldValue;
        if (this._semiStickyAnchor === 'top') {
          this._semiStickyDuration = 0;
          this._semiStickyTranslateY = (this.stickyAlways || newValue < this._semiStickyOffsetY)
            ? 0
            : Math.min(0, Math.max(this._semiStickyTranslateY - delta, -this._semiStickyHeight));
        } else if (this._semiStickyAnchor === 'bottom') {
          this._semiStickyDuration = 0;
          const anchor = this._scrollListenerScrollerClientHeight + newValue;
          const distanceFromAnchor = this._semiStickyOffsetY - anchor;
          this._semiStickyTranslateY = this.stickyAlways
            ? 0
            : Math.max(0, Math.min(
              this._semiStickyTranslateY + delta,
              this._semiStickyHeight + Math.min(0, distanceFromAnchor),
            ));
        }
      },
      _scrollListenerLastIdleChanged() {
        if (this.stickyAlways) return;
        this._refreshSemiStickyMetrics();
        if (this._semiStickyAnchor === 'top') {
          const { offsetTop } = this.refs.surface;
          const offset = this._scrollListenerPositionY - offsetTop;
          const delta = offset - this._semiStickyTranslateY;
          const visibility = delta / this._semiStickyHeight;

          if (visibility <= 0) return;
          if (visibility >= 1) return;
          if (visibility <= 0.5 || offsetTop < this._semiStickyHeight) {
            // Reveal all
            this._semiStickyDuration = 250;
            this._semiStickyEasing = 'ease-in';
            this._semiStickyTranslateY = 0;
            // this._semiStickyHeadlineOpacity = 1;
          } else {
            this._semiStickyDuration = 200;
            this._semiStickyEasing = 'ease-out';
            // Don't hide past origin
            this._semiStickyTranslateY = Math.max(
              this._semiStickyOffsetY - this._scrollListenerPositionY,
              -this._semiStickyHeight,
            );
          }
        } else if (this._semiStickyAnchor === 'bottom') {
          const max = this._semiStickyHeight;
          const visibility = (max - this._semiStickyTranslateY) / max;
          if (visibility <= 0) return;
          if (visibility >= 1) return;
          if (visibility >= 0.5) {
            // Reveal all
            this._semiStickyDuration = 250;
            this._semiStickyEasing = 'ease-in';
            this._semiStickyTranslateY = 0;
            // this._semiStickyHeadlineOpacity = 1;
          } else {
            this._semiStickyDuration = 200;
            this._semiStickyEasing = 'ease-out';
            const anchor = this._scrollListenerScrollerClientHeight + this._scrollListenerPositionY;
            const distanceFromAnchor = this._semiStickyOffsetY - anchor;
            // Don't hide past origin
            this._semiStickyTranslateY = this._semiStickyHeight + Math.min(0, distanceFromAnchor);
          }
        }
      },
      connected() {
        const semiStickyElement = this._getSemiStickyElement();
        // Connect scroll when element gets first size
        const resizeObserver = new ResizeObserver(() => {
          this.startScrollListener(semiStickyElement.offsetParent ?? window);
          resizeObserver.disconnect();
          this._refreshSemiStickyMetrics();
        });
        resizeObserver.observe(semiStickyElement);
        this._refreshSemiStickyMetrics();
      },
      disconnected() {
        this._scrollListenerClear();
      },
    });
}
