/**
 * Hides sticky element when scrolling down
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function SemiStickyMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scroller: WeakRef<HTMLElement | Window>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScroller: HTMLElement | Window;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerClear(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _semiStickyHeight: number;
    _semiStickyOffsetY: number;
    _semiStickyTranslateY: number;
    _semiStickyDuration: number;
    _semiStickyEasing: string;
    _semiStickyMeasured: boolean;
    stickyAlways: boolean;
    stickyParent: boolean;
    useSticky: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _refreshSemiStickyMetrics(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
}, any[]>;
//# sourceMappingURL=SemiStickyMixin.d.ts.map