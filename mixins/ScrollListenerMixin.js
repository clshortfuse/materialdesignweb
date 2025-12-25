const IDLE_TIMEOUT_MS = 500;

/**
 * Tracks scroll/resize positions and exposes scroll-related lifecycle helpers.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ScrollListenerMixin(Base) {
  return Base
    .observe({
      /** Current horizontal scroll position (px) */
      _scrollListenerPositionX: { type: 'float', empty: 0, reflect: false },
      /** Current vertical scroll position (px) */
      _scrollListenerPositionY: { type: 'float', empty: 0, reflect: false },
      /** Timestamp of the last idle period (ms) */
      _scrollListenerLastIdle: { type: 'float', empty: 0 },
      /** Timestamp of the last scroll event (ms) */
      _scrollListenerLastScroll: { type: 'float', empty: 0 },
      /** Timestamp of the last resize event (ms) */
      _scrollListenerLastResize: { type: 'float', empty: 0 },
    })
    .set({
      /** WeakRef to the current scroller (HTMLElement or window) */
      /** @type {WeakRef<HTMLElement|Window>} */
      _scroller: null,
      /** Listener bound to scroller 'scroll' events */
      /** @type {EventListener} */
      _scrollerScrollListener: null,
      /** Listener bound to scroller 'resize' events */
      /** @type {EventListener} */
      _scrollerResizeListener: null,
      /** Internal debounce timer id used for idle detection */
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
        scroller ??= window;
        if (!scroller) return false;

        if (scroller === document.body) {
          // console.log('scroller is body, attaching to window');
          scroller = window;
        }

        // @ts-expect-error Only HTMLElement or Window can scroll
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
        // @ts-ignore Already checked for window
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
