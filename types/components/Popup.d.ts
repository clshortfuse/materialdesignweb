declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    open: boolean;
    modal: boolean;
    _isNativeModal: boolean;
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
}, any[]> & import("../core/CustomElement.js").Class<{
    _dialog: HTMLDialogElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    updatePopupPosition(anchor?: Element | DOMRect): void;
    onSlotChange({ currentTarget }: Event & {
        currentTarget: HTMLSlotElement;
    }): void;
    showPopup(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
    showModal(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
    show(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
    close(returnValue?: any, returnFocus?: boolean): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaHidden(this: CustomElement & {
        delegatesFocus: boolean;
    } & {
        open: boolean;
        modal: boolean;
        _isNativeModal: boolean;
        scrollable: boolean;
        matchSourceWidth: boolean;
        _currentFlow: string;
        flow: string;
        popupMargin: number;
    } & {
        useHistory: boolean;
        returnValue: string;
        _closing: boolean;
        _useScrim: boolean;
    } & {
        _dialog: HTMLDialogElement;
    } & {
        updatePopupPosition(anchor?: Element | DOMRect): void;
        onSlotChange({ currentTarget }: Event & {
            currentTarget: HTMLSlotElement;
        }): void;
        showPopup(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
        showModal(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
        show(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
        close(returnValue?: any, returnFocus?: boolean): boolean;
    }, { open }: CustomElement & {
        delegatesFocus: boolean;
    } & {
        open: boolean;
        modal: boolean;
        _isNativeModal: boolean;
        scrollable: boolean;
        matchSourceWidth: boolean;
        _currentFlow: string;
        flow: string;
        popupMargin: number;
    } & {
        useHistory: boolean;
        returnValue: string;
        _closing: boolean;
        _useScrim: boolean;
    } & {
        _dialog: HTMLDialogElement;
    } & {
        updatePopupPosition(anchor?: Element | DOMRect): void;
        onSlotChange({ currentTarget }: Event & {
            currentTarget: HTMLSlotElement;
        }): void;
        showPopup(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
        showModal(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
        show(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
        close(returnValue?: any, returnFocus?: boolean): boolean;
    }): "false" | "true";
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
    stateTargetElement: CustomElement & {
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
    };
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
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Popup.d.ts.map