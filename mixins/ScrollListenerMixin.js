import CustomElement from '../core/CustomElement.js';

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function ScrollListenerMixin(Base) {
  class ScrollListener extends Base {
    static IDLE_TIMEOUT_MS = 500;

    /** @type {WeakRef<HTMLElement|Window>} */
    #scroller;

    /** @type {EventListener} */
    #scrollerScrollListener;

    #scrollerResizeListener;

    /** @type {CustomElement['idlChangedCallback']} */
    idlChangedCallback(name, oldValue, newValue) {
      super.idlChangedCallback(name, oldValue, newValue);
      switch (name) {
        case '_scrollPosition':
          this.onScrollPositionChange(oldValue, newValue);
          break;
        default:
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onScrollIdle() {}

    /** @param {Event} event */
    onScrollerScroll(event) {
      this._scrollPosition = (event.currentTarget === window)
        ? window.scrollY
        : /** @type {HTMLElement} */ (event.currentTarget).scrollTop;

      clearTimeout(this.scrollDebounce);
      this.scrollDebounce = setTimeout(() => this.onScrollIdle(), this.constructor.IDLE_TIMEOUT_MS);
    }

    /**
     * @param {number} oldValue
     * @param {number} newValue
     */
    onScrollPositionChange(oldValue, newValue) {}

    /** @param {Event} event */
    onScrollerResize(event) {}

    /**
     * @param {Element|Window} [scroller]
     * @return {boolean}
     */
    startScrollListener(scroller) {
      if (!scroller) {
        // eslint-disable-next-line no-param-reassign
        scroller = this.offsetParent;

        if (scroller === document.body) {
          console.log('scroller is body, attaching to window');
          scroller = window;
        }
        if (!scroller) return false;
      }
      this.#scroller = new WeakRef(scroller);
      this.#scrollerScrollListener = this.onScrollerScroll.bind(this);
      this.#scrollerResizeListener = this.onScrollerResize.bind(this);
      scroller.addEventListener('scroll', this.#scrollerScrollListener);
      scroller.addEventListener('resize', this.#scrollerResizeListener);
      this._scrollPosition = 0;
      return true;
    }

    getScrollingElementScrollHeight() {
      const element = this.getScroller();
      if (element === window) {
        return document.documentElement.scrollHeight;
      }
      return element.scrollHeight;
    }

    getScrollingElementClientHeight() {
      const element = this.getScroller();
      if (element === window) {
        return window.innerHeight;
      }
      return element.clientHeight;
    }

    getScroller() {
      return this.#scroller.deref();
    }

    /**
     * @param {Element|Window} scroller
     * @return {boolean}
     */
    clearScrollListener(scroller = this.#scroller?.deref()) {
      if (!scroller) return false;
      if (!this.#scrollerScrollListener) return false;
      scroller.removeEventListener('scroll', this.#scrollerScrollListener);
      return true;
    }
  }
  ScrollListener.prototype._scrollPosition = ScrollListener.idl('_scrollPosition', { type: 'float', empty: 0 });
  return ScrollListener;
}
