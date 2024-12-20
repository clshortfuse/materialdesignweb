declare const _default: typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
    updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
    block: boolean;
    inline: boolean;
    row: boolean;
    x: string;
    y: string;
    gap: number;
    padding: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    fixed: boolean;
    open: boolean;
    inlineEnd: boolean;
    _lastComputedInlineSize: number;
    _animationDuration: number;
    _animationEasing: string;
    _dragDeltaX: number;
    _dragStartX: number;
    _translateX: string;
    _lastChildScrollTime: number;
    ontoggle: EventListener;
    onclose: EventListener;
    autoOpen: number;
    autoClose: number;
    fixedBreakpoint: number;
    _isSideSheetRtl: boolean;
    color: string;
    fixedColor: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrim: InstanceType<typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
        hidden: boolean;
    }, any[]>>;
}, any[]> & import("../core/CustomElement.js").Class<{
    _styles: string | {
        backgroundColor: string;
    };
    hostStyles: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            marginLeft: string | number;
            marginRight: string | number;
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    checkForScrim(animate?: boolean): void;
    checkDragFinished(): void;
    onWindowResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    align: "center" | "end" | "start";
    autoOpen: number;
    autoClose: number;
    fixedBreakpoint: number;
}, any[]>;
export default _default;
//# sourceMappingURL=NavRail.d.ts.map