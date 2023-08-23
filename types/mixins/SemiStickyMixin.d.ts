/**
 * Hides sticky element when scrolling down
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function SemiStickyMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
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
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
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
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
} & {
    _scrollListenerClear(scroller?: EventTarget): boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
} & {
    _scrollListenerClear(scroller?: EventTarget): boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
} & {
    _scrollListenerClear(scroller?: EventTarget): boolean;
} & {
    _semiStickyHeight: number;
    _semiStickyOffsetY: number;
    _semiStickyTranslateY: number;
    _semiStickyDuration: number;
    _semiStickyEasing: string;
    _semiStickyMeasured: boolean;
    stickyAlways: boolean;
    stickyParent: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
} & {
    _scrollListenerClear(scroller?: EventTarget): boolean;
} & {
    _semiStickyHeight: number;
    _semiStickyOffsetY: number;
    _semiStickyTranslateY: number;
    _semiStickyDuration: number;
    _semiStickyEasing: string;
    _semiStickyMeasured: boolean;
    stickyAlways: boolean;
    stickyParent: boolean;
} & {
    _refreshSemiStickyMetrics(): void;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
} & {
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
} & {
    _scrollListenerScroller: HTMLElement | Window;
} & {
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
} & {
    _scrollListenerClear(scroller?: EventTarget): boolean;
} & {
    _semiStickyHeight: number;
    _semiStickyOffsetY: number;
    _semiStickyTranslateY: number;
    _semiStickyDuration: number;
    _semiStickyEasing: string;
    _semiStickyMeasured: boolean;
    stickyAlways: boolean;
    stickyParent: boolean;
} & {
    _refreshSemiStickyMetrics(): void;
} & {
    _semiStickyStyleStyle: any;
});
//# sourceMappingURL=SemiStickyMixin.d.ts.map