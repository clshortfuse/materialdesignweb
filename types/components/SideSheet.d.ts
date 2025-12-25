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
    _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
    /** @type {InstanceType<Scrim>} */
    _scrim: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
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
    /**
     * Ensure a scrim is present when the sheet is modal (open && !fixed).
     * When `animate` is true, keep the scrim around to run its fade-out.
     */
    checkForScrim(animate?: boolean): void;
    /** Evaluate drag state and decide whether to close or snap open. */
    checkDragFinished(): void;
    /** Recompute `fixed`/`open` state based on the window width and breakpoints. */
    onWindowResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=SideSheet.d.ts.map