import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';

import Nav from './Nav.js';
import styles from './NavBar.css' assert { type: 'css' };

export default class NavBar extends ScrollListenerMixin(Nav) {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-bar';

  compose() {
    return super.compose().append(
      styles,
      this.updateTransform,
      this.updateTransition,
    );
  }

  /**
   * @param {number} oldValue
   * @param {number} newValue
   */
  onScrollPositionChange(oldValue, newValue) {
    if (!this.hideOnScroll) return;
    const delta = newValue - oldValue;
    const rate = 1;
    const shift = rate * delta;

    const bottom = this.getScrollingElementScrollHeight() - this.getScrollingElementClientHeight();
    const breakpoint = bottom - this.refs.nav.scrollHeight;
    let max = this.refs.nav.scrollHeight;
    if (newValue >= breakpoint) {
      // Scrolling to bottom always shows Nav Bar (ensures content isn't occluded)
      max -= (newValue - breakpoint);
    }
    this._transition = 'none';
    this._translateY = Math.max(0, Math.min(this._translateY + shift, max));
  }

  onScrollerResize() {
    // Chrome Bug: When window resizes bottom sticky needs to be recomputed
    // Force style recalculation
    this.style.setProperty('bottom', 'auto');
    this.clientHeight;
    this.style.removeProperty('bottom');
    this.onScrollPositionChange(this._scrollPosition, this._scrollPosition);
  }

  /** @param {Partial<this>} data */
  updateTransform({ _translateY }) {
    this.refs.nav?.style.setProperty('transform', `translateY(${_translateY}px)`);
  }

  /** @param {Partial<this>} data */
  updateTransition({ _transition }) {
    this.refs.nav?.style.setProperty('transition', _transition);
  }

  onScrollIdle() {
    super.onScrollIdle();
    const max = this.refs.nav.scrollHeight;
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
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hideOnScroll) {
      this.startScrollListener();
    }
  }

  disconnectedCallback() {
    this.clearScrollListener();
    super.disconnectedCallback();
  }
}

NavBar.prototype.hideOnScroll = NavBar.idl('hideOnScroll', 'boolean');
NavBar.prototype._translateY = NavBar.idl('_translateY', { type: 'float', empty: 0 });
NavBar.prototype._transition = NavBar.idl('_transition', { empty: 'none' });
