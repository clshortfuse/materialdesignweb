declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scroller: WeakRef<EventTarget>;
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
    _startSlotted: boolean;
    _bottomSlotted: boolean;
    _bottomFixedSlotted: boolean;
    _endSlotted: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @type {ResizeObserver} */
    _bottomResizeObserver: ResizeObserver;
}, any[]> & import("../core/CustomElement.js").Class<{
    _customStyle(this: CustomElement & {
        delegatesFocus: boolean;
    } & {
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
        _startSlotted: boolean;
        _bottomSlotted: boolean;
        _bottomFixedSlotted: boolean;
        _endSlotted: boolean;
    } & {
        /** @type {ResizeObserver} */
        _bottomResizeObserver: ResizeObserver;
    }, { _startSlotted, _bottomSlotted, _bottomFixedSlotted, _endSlotted }: CustomElement & {
        delegatesFocus: boolean;
    } & {
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
        _startSlotted: boolean;
        _bottomSlotted: boolean;
        _bottomFixedSlotted: boolean;
        _endSlotted: boolean;
    } & {
        /** @type {ResizeObserver} */
        _bottomResizeObserver: ResizeObserver;
    }): ":host{display:grid}" | ":host{display:contents}";
}, any[]> & import("../core/CustomElement.js").Class<{
    _bottomHeight: number;
    _bottomOffsetY: number;
    _bottomDuration: number;
    _bottomEasing: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _sharedBottomStyle: {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    _bottomSlotStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
        target: string;
    };
    _bottomFixedSlotStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
        target: string;
    };
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Root.d.ts.map