import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
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
  .observe({
    _positioningStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ _translateY, _transition }) {
        return {
          styles: {
            transform: `translateY(${_translateY}px)`,
            transition: _transition,
          },
        };
      },
    },
  })
  .methods({
    onScrollerResize() {
      console.log('onScrollerResize');
      // Chrome Bug: When window resizes bottom sticky needs to be recomputed
      // Force style recalculation
      this.style.setProperty('bottom', 'auto');
      // eslint-disable-next-line no-unused-expressions
      this.clientHeight;
      this.style.removeProperty('bottom');
      this.propChangedCallback('scrollListenerPositionY', this.scrollListenerPositionY, this.scrollListenerPositionY);
    },
    onScrollIdle() {
      const max = this.scrollHeight;
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
    connected() {
      if (this.hideOnScroll) {
        if (this.offsetParent) {
          this.startScrollListener(this.offsetParent ?? window);
        } else {
          const resizeObserver = new ResizeObserver(() => {
            this.startScrollListener(this.offsetParent ?? window);
            resizeObserver.disconnect();
          });
          resizeObserver.observe(this);
        }
      }
    },
    disconnected() {
      this.clearScrollListener();
    },
    scrollListenerPositionYChanged(oldValue, newValue) {
      if (!this.hideOnScroll) return;
      const delta = newValue - oldValue;
      const rate = 1;
      const shift = rate * delta;

      const bottom = this.getScrollingElementScrollHeight() - this.getScrollingElementClientHeight();
      const breakpoint = bottom - this.scrollHeight;
      let max = this.scrollHeight;
      if (newValue >= breakpoint) {
      // Scrolling to bottom always shows Nav Bar (ensures content isn't occluded)
        max -= (newValue - breakpoint);
      }
      this._transition = 'none';
      this._translateY = Math.max(0, Math.min(this._translateY + shift, max));
    },
  })
  .autoRegister('mdw-nav-bar');
