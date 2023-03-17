const IDLE_TIMEOUT_MS = 500;

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ScrollListenerMixin(Base) {
  return Base
    .extend()
    .observe({
      _scrollPositionX: { type: 'float', empty: 0 },
      _scrollPositionY: { type: 'float', empty: 0 },
    })
    .set({
      /** @type {WeakRef<EventTarget>} */
      _scroller: null,
      /** @type {EventListener} */
      _scrollerScrollListener: null,
      /** @type {EventListener} */
      _scrollerResizeListener: null,
      _scrollDebounce: null,
    })
    .methods({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onScrollIdle() {},

      /** @param {Event} event */
      onScrollerScroll(event) {
        this._scrollPositionY = (event.currentTarget === window)
          ? window.scrollY
          : /** @type {HTMLElement} */ (event.currentTarget).scrollTop;

        this._scrollPositionX = (event.currentTarget === window)
          ? window.scrollX
          : /** @type {HTMLElement} */ (event.currentTarget).scrollLeft;

        clearTimeout(this._scrollDebounce);
        this._scrollDebounce = setTimeout(() => this.onScrollIdle(), IDLE_TIMEOUT_MS);
      },

      /**
       * @param {number} oldValue
       * @param {number} newValue
       */
      onScrollPositionXChange(oldValue, newValue) {},

      /**
       * @param {number} oldValue
       * @param {number} newValue
       */
      onScrollPositionYChange(oldValue, newValue) {},

      /** @param {Event} event */
      onScrollerResize(event) {},

      /**
       * @param {EventTarget} [scroller]
       * @return {boolean}
       */
      startScrollListener(scroller) {
        scroller ??= this.offsetParent;
        if (!scroller) return false;

        if (scroller === document.body) {
          // console.log('scroller is body, attaching to window');
          scroller = window;
        }

        this._scroller = new WeakRef(scroller);
        this._scrollerScrollListener = this.onScrollerScroll.bind(this);
        this._scrollerResizeListener = this.onScrollerResize.bind(this);
        scroller.addEventListener('scroll', this._scrollerScrollListener);
        scroller.addEventListener('resize', this._scrollerResizeListener);
        this._scrollPositionX = 0;
        this._scrollPositionY = 0;
        return true;
      },

      getScrollingElementScrollHeight() {
        const element = this.getScroller();
        if (element === window) {
          return document.documentElement.scrollHeight;
        }
        // @ts-expect-error Skip Element cast
        return element.scrollHeight;
      },

      getScrollingElementClientHeight() {
        const element = this.getScroller();
        if (element === window) {
          return window.innerHeight;
        }
        // @ts-expect-error Skip Element cast
        return element.clientHeight;
      },

      getScroller() {
        return this._scroller.deref();
      },

      /**
       * @param {EventTarget} [scroller]
       * @return {boolean}
       */
      clearScrollListener(scroller) {
        scroller ??= this._scroller?.deref();
        if (!scroller) return false;
        if (!this._scrollerScrollListener) return false;
        scroller.removeEventListener('scroll', this._scrollerScrollListener);
        return true;
      },
    })
    .on('_scrollPositionXChanged', (oldValue, newValue, element) => {
      element.onScrollPositionXChange(oldValue, newValue);
    })
    .on('_scrollPositionYChanged', (oldValue, newValue, element) => {
      element.onScrollPositionYChange(oldValue, newValue);
    });
}
