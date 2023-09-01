import { ELEMENT_ANIMATION_TYPE } from '../core/customTypes.js';

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
      _semiStickyTranslateY: { type: 'float', empty: 0 },
      _semiStickyDuration: { type: 'float', empty: 0 },
      _semiStickyEasing: { empty: 'ease-in' },
      _semiStickyMeasured: 'boolean',
      stickyAlways: 'boolean',
      /** Stick to offsetParent instead of window */
      stickyParent: 'boolean',
    })
    .methods({
      _refreshSemiStickyMetrics() {
        const styles = window.getComputedStyle(this);
        this._semiStickyHeight = this.offsetHeight
          + Number.parseFloat(styles.marginTop) + Number.parseFloat(styles.marginBottom);
        this._semiStickyOffsetY = Number.parseFloat(styles.marginTop);
        this._semiStickyMeasured = true;
      },
    })
    .observe({
      _semiStickyStyleStyle: {
        ...ELEMENT_ANIMATION_TYPE,
        get({
          _semiStickyMeasured, _semiStickyTranslateY, _semiStickyDuration, _semiStickyEasing,
        }) {
          if (!_semiStickyMeasured) return null;
          return {
            styles: {
              transform: `translateY(${_semiStickyTranslateY}px)`,
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
      _scrollListenerPositionYChanged(oldValue, newValue) {
        const delta = newValue - oldValue;
        if (!this._semiStickyMeasured) {
          this._refreshSemiStickyMetrics();
        }
        this._semiStickyDuration = 0;
        // 0 if disabled or if has not scroll passed height
        // Valid range = -100% < x < 0
        this._semiStickyTranslateY = (this.stickyAlways || newValue < this._semiStickyOffsetY)
          ? 0
          : Math.min(Math.max(-this._semiStickyHeight, this._semiStickyTranslateY - delta), 0);
      },
      _scrollListenerLastIdleChanged() {
        if (this.stickyAlways) return;
        this._refreshSemiStickyMetrics();
        const offsetTop = this.offsetTop;
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
      },
      connected() {
        this.startScrollListener(this.stickyParent ? this.offsetParent : window);
      },
      disconnected() {
        this._scrollListenerClear();
      },
    });
}
