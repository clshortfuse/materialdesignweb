/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ScrollListenerMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    /** @type {WeakRef<EventTarget>} */
    _scroller: WeakRef<EventTarget>;
    /** @type {EventListener} */
    _scrollerScrollListener: EventListener;
    /** @type {EventListener} */
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    /** @type {WeakRef<EventTarget>} */
    _scroller: WeakRef<EventTarget>;
    /** @type {EventListener} */
    _scrollerScrollListener: EventListener;
    /** @type {EventListener} */
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    /** @type {WeakRef<EventTarget>} */
    _scroller: WeakRef<EventTarget>;
    /** @type {EventListener} */
    _scrollerScrollListener: EventListener;
    /** @type {EventListener} */
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
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
} & {
    _scrollListenerScroller: HTMLElement | Window;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    /** @type {WeakRef<EventTarget>} */
    _scroller: WeakRef<EventTarget>;
    /** @type {EventListener} */
    _scrollerScrollListener: EventListener;
    /** @type {EventListener} */
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
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
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    /** @type {WeakRef<EventTarget>} */
    _scroller: WeakRef<EventTarget>;
    /** @type {EventListener} */
    _scrollerScrollListener: EventListener;
    /** @type {EventListener} */
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
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
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
} & {
    /**
     * @param {EventTarget} [scroller]
     * @return {boolean}
     */
    _scrollListenerClear(scroller?: EventTarget): boolean;
});
//# sourceMappingURL=ScrollListenerMixin.d.ts.map