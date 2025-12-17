declare const _default: typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
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
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNav: string;
    _kbdFocusable: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
    ariaOrientationDefault: "horizontal" | "vertical";
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNavChildren: NodeListOf<HTMLElement>;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaOrientationIsVertical(): boolean;
    focusCurrentOrFirst(): HTMLElement;
    focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
    focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
    focus(options?: FocusOptions): void;
    refreshTabIndexes(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    ariaOrientationDefault: string;
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateTargetElement: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    color: string;
    ink: string;
    typeStyle: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
    outlined: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _raised: boolean;
    _headlineOpacity: number;
    headline: string;
    size: "small" | "medium" | "large";
    color: string;
    raisedColor: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _styles: string;
    _headlineStyle: import("../core/customTypes.js").ElementStylerOptions | {
        target: string;
        styles: {
            opacity: number;
        };
        timing: {
            duration: number;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    _companionIf: never;
}, any[]> & import("../core/CustomElement.js").Class<import("../index.js").CustomElement & {
    delegatesFocus: boolean;
} & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<HTMLElement | Window>;
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
    _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
} & {
    _ariaRole: string;
} & {
    _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
} & {
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
} & {
    kbdNav: string;
    _kbdFocusable: boolean;
} & {
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
    ariaOrientationDefault: "horizontal" | "vertical";
} & {
    kbdNavChildren: NodeListOf<HTMLElement>;
} & {
    _ariaOrientationIsVertical(): boolean;
    focusCurrentOrFirst(): HTMLElement;
    focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
    focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
    focus(options?: FocusOptions): void;
    refreshTabIndexes(): void;
} & {
    ariaOrientationDefault: string;
    _ariaRole: string;
} & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
} & {
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
} & {
    stateTargetElement: HTMLElement;
} & {
    color: string;
    ink: string;
    typeStyle: string;
} & {
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
    outlined: boolean;
} & {
    _raised: boolean;
    _headlineOpacity: number;
    headline: string;
    size: "small" | "medium" | "large";
    color: string;
    raisedColor: string;
} & {
    _styles: string;
    _headlineStyle: import("../core/customTypes.js").ElementStylerOptions | {
        target: string;
        styles: {
            opacity: number;
        };
        timing: {
            duration: number;
        };
    };
} & {
    _companionIf: never;
} & Record<"headline", never>, any[]> & import("../core/CustomElement.js").Class<import("../index.js").CustomElement & {
    delegatesFocus: boolean;
} & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<HTMLElement | Window>;
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
    _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
} & {
    _ariaRole: string;
} & {
    _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
} & {
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
} & {
    kbdNav: string;
    _kbdFocusable: boolean;
} & {
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
    ariaOrientationDefault: "horizontal" | "vertical";
} & {
    kbdNavChildren: NodeListOf<HTMLElement>;
} & {
    _ariaOrientationIsVertical(): boolean;
    focusCurrentOrFirst(): HTMLElement;
    focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
    focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
    focus(options?: FocusOptions): void;
    refreshTabIndexes(): void;
} & {
    ariaOrientationDefault: string;
    _ariaRole: string;
} & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
} & {
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
} & {
    stateTargetElement: HTMLElement;
} & {
    color: string;
    ink: string;
    typeStyle: string;
} & {
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
    outlined: boolean;
} & {
    _raised: boolean;
    _headlineOpacity: number;
    headline: string;
    size: "small" | "medium" | "large";
    color: string;
    raisedColor: string;
} & {
    _styles: string;
    _headlineStyle: import("../core/customTypes.js").ElementStylerOptions | {
        target: string;
        styles: {
            opacity: number;
        };
        timing: {
            duration: number;
        };
    };
} & {
    _companionIf: never;
} & Record<"headline", never> & Record<"size", never>, any[]> & import("../core/CustomElement.js").Class<import("../index.js").CustomElement & {
    delegatesFocus: boolean;
} & {
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
} & {
    _scroller: WeakRef<HTMLElement | Window>;
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
    _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
} & {
    _ariaRole: string;
} & {
    _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
} & {
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
} & {
    kbdNav: string;
    _kbdFocusable: boolean;
} & {
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
    ariaOrientationDefault: "horizontal" | "vertical";
} & {
    kbdNavChildren: NodeListOf<HTMLElement>;
} & {
    _ariaOrientationIsVertical(): boolean;
    focusCurrentOrFirst(): HTMLElement;
    focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
    focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
    focus(options?: FocusOptions): void;
    refreshTabIndexes(): void;
} & {
    ariaOrientationDefault: string;
    _ariaRole: string;
} & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
} & {
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
} & {
    stateTargetElement: HTMLElement;
} & {
    color: string;
    ink: string;
    typeStyle: string;
} & {
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
    outlined: boolean;
} & {
    _raised: boolean;
    _headlineOpacity: number;
    headline: string;
    size: "small" | "medium" | "large";
    color: string;
    raisedColor: string;
} & {
    _styles: string;
    _headlineStyle: import("../core/customTypes.js").ElementStylerOptions | {
        target: string;
        styles: {
            opacity: number;
        };
        timing: {
            duration: number;
        };
    };
} & {
    _companionIf: never;
} & Record<"headline", never> & Record<"size", never> & Record<"_headlineStyle", never>, any[]> & import("../core/CustomElement.js").Class<{
    placeholder: string;
    color: string;
    shapeStyle: string;
    kbdNav: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    input: string;
    value: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @param {{currentTarget:HTMLSlotElement}} event */
    onSlotChange({ currentTarget }: {
        currentTarget: HTMLSlotElement;
    }): void;
}, any[]>;
export default _default;
//# sourceMappingURL=Search.d.ts.map