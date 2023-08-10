import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import { CHROME_VERSION } from '../core/dom.js';

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
      _semiStickyMeasured: 'boolean',
      _semiStickyAnchor: {
        /** @type {'top'|'start'|'end'|'bottom'|'left'|'right'} */
        empty: 'top',
      },
      stickyAlways: 'boolean',
      /** Stick to offsetParent instead of window */
      stickyParent: 'boolean',
    })
    .methods({
      _refreshSemiStickyMetrics() {
        let styles = window.getComputedStyle(this);
        this._semiStickyHeight = this.offsetHeight
          + Number.parseFloat(styles.marginTop) + Number.parseFloat(styles.marginBottom);
        this._semiStickyWidth = this.offsetWidth
          + Number.parseFloat(styles.marginLeft) + Number.parseFloat(styles.marginRight);
        // No way to measure offset when stickied ?
        this.style.position = 'relative';
        styles = window.getComputedStyle(this);
        this._semiStickyOffsetY = this.offsetTop - Number.parseFloat(styles.marginTop);
        this._semiStickyOffsetX = this.offsetLeft - Number.parseFloat(styles.marginLeft);
        this.style.position = 'sticky';
        this._semiStickyMeasured = true;
      },
    })
    .observe({
      _semiStickyStyleStyle: {
        ...ELEMENT_STYLER_TYPE,
        get({
          _semiStickyMeasured,
          _semiStickyTranslateX, _semiStickyTranslateY, _semiStickyDuration, _semiStickyEasing,
        }) {
          if (!_semiStickyMeasured) return null;
          return {
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
        if (this._semiStickyAnchor !== 'bottom' && !CHROME_VERSION) return;
        // Chrome Bug: When window resizes bottom sticky needs to be recomputed
        // Force style recalculation
        this.style.setProperty('bottom', 'auto');
        // eslint-disable-next-line no-unused-expressions
        this.clientHeight;
        this.style.removeProperty('bottom');
        this.propChangedCallback('_scrollListenerPositionY', this._scrollListenerPositionY, this._scrollListenerPositionY);
      },
      _scrollListenerPositionYChanged(oldValue, newValue) {
        const delta = newValue - oldValue;
        if (!this._semiStickyMeasured) {
          this._refreshSemiStickyMetrics();
        }
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
        this.startScrollListener(this.stickyParent ? this.offsetParent : window);
      },
      disconnected() {
        this._scrollListenerClear();
      },
    });
}
