declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
    updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    density: number;
}, any[]> & import("../core/CustomElement.js").Class<{
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
}, any[]> & import("../core/CustomElement.js").Class<{
    flow: string;
    _useScrim: boolean;
    /** @type {WeakRef<HTMLElement>} */
    _cascader: WeakRef<HTMLElement>;
    /** @type {WeakRef<HTMLElement>} */
    _submenu: WeakRef<HTMLElement>;
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNavChildren: Element[];
    _dialog: HTMLDialogElement;
    cascader: HTMLElement;
    submenu: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    showModal(...args: any[]): boolean;
    focus(): void;
    /**
     * @param {HTMLElement} cascader Element that calls for submenu cascade
     */
    cascade(cascader: HTMLElement): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Menu.d.ts.map