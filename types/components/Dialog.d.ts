declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    open: boolean;
    modal: boolean;
    native: boolean;
    scrollable: boolean;
    matchSourceWidth: boolean;
    _currentFlow: string;
    flow: string;
    popupMargin: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    useHistory: boolean;
    returnValue: string;
    _closing: boolean;
    _useScrim: boolean;
    _source: MouseEvent | PointerEvent | HTMLElement | Event;
    _anchor: MouseEvent | PointerEvent | HTMLElement | Event;
}, any[]> & import("../core/CustomElement.js").Class<{
    _dialog: HTMLDialogElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaHidden: never;
}, any[]> & import("../core/CustomElement.js").Class<{
    updatePopupPosition(anchor?: DOMRectLike | Element): void;
    onSlotChange({ currentTarget }: Event & {
        currentTarget: HTMLSlotElement;
    }): void;
    showPopup(source?: MouseEvent | PointerEvent | HTMLElement | Event, focus?: boolean, flow?: string): boolean;
    showModal(source?: MouseEvent | PointerEvent | HTMLElement | Event, focus?: boolean, flow?: string): boolean;
    show(source?: MouseEvent | PointerEvent | HTMLElement | Event, focus?: boolean, flow?: string): boolean;
    close(returnValue?: any, returnFocus?: boolean): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
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
    returnValue: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    dividers: "" | "inset" | "full";
    headline: string;
    icon: string;
    default: string;
    cancel: string;
    confirm: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _anchor: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    flow: string;
    _useScrim: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {Event & {currentTarget: HTMLSlotElement}} event
     * @return {void}
     */
    onSlotChange({ currentTarget }: Event & {
        currentTarget: HTMLSlotElement;
    }): void;
    focus(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    cancelAutoFocus: () => boolean;
    confirmAutoFocus: () => boolean;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Dialog.d.ts.map