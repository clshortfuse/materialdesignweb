const IDLE_TIMEOUT_MS = 500;

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ScrollListenerMixin(Base) {
  return Base
    .observe({
      _scrollListenerPositionX: { type: 'float', empty: 0, reflect: false },
      _scrollListenerPositionY: { type: 'float', empty: 0, reflect: false },
      _scrollListenerLastIdle: { type: 'float', empty: 0 },
      _scrollListenerLastScroll: { type: 'float', empty: 0 },
      _scrollListenerLastResize: { type: 'float', empty: 0 },
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
      _scrollListenerOnScrollIdle() {
        this._scrollListenerLastIdle = performance.now();
      },

      /** @param {Event} event */
      _scrollListenerOnScrollerScroll(event) {
        this._scrollListenerPositionY = (event.currentTarget === window)
          ? window.scrollY
          : /** @type {HTMLElement} */ (event.currentTarget).scrollTop;

        this._scrollListenerPositionX = (event.currentTarget === window)
          ? window.scrollX
          : /** @type {HTMLElement} */ (event.currentTarget).scrollLeft;

        this._scrollListenerLastScroll = performance.now();
        clearTimeout(this._scrollDebounce);
        this._scrollDebounce = setTimeout(() => this._scrollListenerOnScrollIdle(), IDLE_TIMEOUT_MS);
      },

      /** @param {Event} event */
      _scrollListenerOnScrollerResize(event) {
        this._scrollListenerLastResize = performance.now();
      },

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
        this._scrollerScrollListener = this._scrollListenerOnScrollerScroll.bind(this);
        this._scrollerResizeListener = this._scrollListenerOnScrollerResize.bind(this);
        scroller.addEventListener('scroll', this._scrollerScrollListener, { passive: true });
        scroller.addEventListener('resize', this._scrollerResizeListener, { passive: true });
        this._scrollListenerPositionX = 0;
        this._scrollListenerPositionY = 0;
        return true;
      },
    })
    .define({
      /** @return {Window|HTMLElement} */
      _scrollListenerScroller() {
        return this._scroller.deref();
      },
    })
    .define({

      _scrollListenerScrollerScrollHeight() {
        const scroller = this._scrollListenerScroller;
        if (scroller === window) {
          return document.documentElement.scrollHeight;
        }
        return scroller.scrollHeight;
      },
      _scrollListenerScrollerClientHeight() {
        const scroller = this._scrollListenerScroller;
        if (scroller === window) {
          return window.innerHeight;
        }
        // @ts-expect-error Skip Element cast
        return scroller.clientHeight;
      },
    })
    .methods({
      /**
       * @param {EventTarget} [scroller]
       * @return {boolean}
       */
      _scrollListenerClear(scroller) {
        scroller ??= this._scroller?.deref();
        if (!scroller) return false;
        if (!this._scrollerScrollListener) return false;
        scroller.removeEventListener('scroll', this._scrollerScrollListener);
        return true;
      },
    });
}
