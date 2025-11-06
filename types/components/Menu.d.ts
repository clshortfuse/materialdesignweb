declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
    hasFiredConnected: boolean;
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
    density: number;
}, any[]> & import("../core/CustomElement.js").Class<{
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
    /** @param {Parameters<InstanceType<ReturnType<PopupMixin>>['showPopup']>} args */
    showModal(source?: HTMLElement | PointerEvent | MouseEvent | Event, focus?: boolean, flow?: string): boolean;
    focus(): void;
    /**
     * @param {HTMLElement} cascader Element that calls for submenu cascade
     */
    cascade(cascader: HTMLElement): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Menu.d.ts.map