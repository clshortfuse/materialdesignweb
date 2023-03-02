import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';

import Nav from './Nav.js';
import styles from './NavBar.css' assert { type: 'css' };

export default Nav
  .mixin(ScrollListenerMixin)
  .observe({
    hideOnScroll: 'boolean',
    _translateY: { type: 'float', empty: 0 },
    _transition: { empty: 'none' },
  })
  .expressions({
    computeNavStyle({ _translateY, _transition }) {
      return `
        transform: translateY(${_translateY}px);
        transition: ${_transition};
      `;
    },
  })
  .methods({
    /**
     * @param {number} oldValue
     * @param {number} newValue
     */
    onScrollPositionYChange(oldValue, newValue) {
      if (!this.hideOnScroll) return;
      const delta = newValue - oldValue;
      const rate = 1;
      const shift = rate * delta;

      const bottom = this.getScrollingElementScrollHeight() - this.getScrollingElementClientHeight();
      const breakpoint = bottom - this.refs.shape.scrollHeight;
      let max = this.refs.shape.scrollHeight;
      if (newValue >= breakpoint) {
      // Scrolling to bottom always shows Nav Bar (ensures content isn't occluded)
        max -= (newValue - breakpoint);
      }
      this._transition = 'none';
      this._translateY = Math.max(0, Math.min(this._translateY + shift, max));
    },
    onScrollerResize() {
      // Chrome Bug: When window resizes bottom sticky needs to be recomputed
      // Force style recalculation
      this.style.setProperty('bottom', 'auto');
      // eslint-disable-next-line no-unused-expressions
      this.clientHeight;
      this.style.removeProperty('bottom');
      this.onScrollPositionYChange(this._scrollPositionY, this._scrollPositionY);
    },
    onScrollIdle() {
      const max = this.refs.shape.scrollHeight;
      const visibility = (max - this._translateY) / max;
      if (visibility <= 0) return;
      if (visibility >= 1) return;
      if (visibility >= 0.5) {
      // Reveal all
        this._translateY = 0;
        this._transition = 'transform 250ms ease-in';
      } else {
        this._translateY = max;
        this._transition = 'transform 200ms ease-out';
      }
    },
  })
  .css(styles)
  .on({
    composed() {
      this.refs.shape.setAttribute('style', '{computeNavStyle}');
    },
    connected() {
      if (this.hideOnScroll) {
        this.startScrollListener();
      }
    },
    disconnected() {
      this.clearScrollListener();
    },
  })
  .autoRegister('mdw-nav-bar');
