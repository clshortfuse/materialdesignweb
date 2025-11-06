/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function PopupMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
    /** @type {MouseEvent|PointerEvent|HTMLElement|Event} */
    _source: MouseEvent | PointerEvent | HTMLElement | Event;
    /** @type {MouseEvent|PointerEvent|HTMLElement|Event} */
    _anchor: MouseEvent | PointerEvent | HTMLElement | Event;
}, any[]> & import("../core/CustomElement.js").Class<{
    _dialog: HTMLDialogElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaHidden: never;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {DOMRectLike|Element} [anchor]
     * @return {void}
     */
    updatePopupPosition(anchor?: DOMRectLike | Element): void;
    /**
     * @param {Event & {currentTarget: HTMLSlotElement}} event
     * @return {void}
     */
    onSlotChange({ currentTarget }: Event & {
        currentTarget: HTMLSlotElement;
    }): void;
    /**
     * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
     * @param {boolean} focus
     * @param {string} flow
     * @return {boolean} handled
     */
    showPopup(source?: MouseEvent | PointerEvent | HTMLElement | Event, focus?: boolean, flow?: string): boolean;
    /**
     * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
     * @param {boolean} [focus]
     * @param {string} [flow]
     * @return {boolean} handled
     */
    showModal(source?: MouseEvent | PointerEvent | HTMLElement | Event, focus?: boolean, flow?: string): boolean;
    /**
     * @param {MouseEvent|PointerEvent|HTMLElement|Event} [source]
     * @param {boolean} [focus]
     * @param {string} [flow]
     * @return {boolean} handled
     */
    show(source?: MouseEvent | PointerEvent | HTMLElement | Event, focus?: boolean, flow?: string): boolean;
    /**
     * @param {any} [returnValue]
     * @param {boolean} [returnFocus=true]
     * @return {boolean} handled
     */
    close(returnValue?: any, returnFocus?: boolean): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
}, any[]>;
export type DOMRectLike = import("../utils/popup.js").DOMRectLike;
export type PopupStack = {
    element: InstanceType<ReturnType<typeof PopupMixin>>;
    previousFocus: HTMLElement;
    centered?: boolean;
    state?: Record<string, any>;
    previousState?: Record<string, any>;
    pendingResizeOperation?: any;
    scrollRestoration?: ScrollRestoration;
};
//# sourceMappingURL=PopupMixin.d.ts.map