declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
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
    shapeTop: boolean;
    modal: boolean;
    open: boolean;
    expanded: boolean;
    _lastComputedBlockSize: number;
    _lastOffsetTop: number;
    _animationDuration: number;
    _animationEasing: string;
    _translateY: string;
    _lastChildScrollTime: number;
    _ariaValueNow: number;
    dragHandle: boolean;
    onopen: EventListener;
    onclose: EventListener;
}, any[]> & import("../core/CustomElement.js").Class<{
    _hasCheckedResize: boolean;
    /** @type {InstanceType<Scrim>} */
    _scrim: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
        hidden: boolean;
    }, any[]>>;
    _dragTimestamp: number;
    /** @type {number} */
    _dragDeltaY: number;
    /** @type {number} */
    _dragStartY: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    hostStyles: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            marginBottom: string | number;
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
    /** @param {PointerEvent} event */
    onDragHandleActive(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onDragHandleInactive(event: PointerEvent): void;
    /** @param {PointerEvent|TouchEvent} event */
    onPointerOrTouchMove(event: PointerEvent | TouchEvent): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=BottomSheet.d.ts.map