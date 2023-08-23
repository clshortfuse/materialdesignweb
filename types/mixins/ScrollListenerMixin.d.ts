/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ScrollListenerMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @type {WeakRef<EventTarget>} */
    _scroller: WeakRef<EventTarget>;
    /** @type {EventListener} */
    _scrollerScrollListener: EventListener;
    /** @type {EventListener} */
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerOnScrollIdle(): void;
    /** @param {Event} event */
    _scrollListenerOnScrollerScroll(event: Event): void;
    /** @param {Event} event */
    _scrollListenerOnScrollerResize(event: Event): void;
    /**
     * @param {EventTarget} [scroller]
     * @return {boolean}
     */
    startScrollListener(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScroller: HTMLElement | Window;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {EventTarget} [scroller]
     * @return {boolean}
     */
    _scrollListenerClear(scroller?: EventTarget): boolean;
}, any[]>;
//# sourceMappingURL=ScrollListenerMixin.d.ts.map