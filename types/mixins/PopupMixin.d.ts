/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function PopupMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    delegatesFocus: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    delegatesFocus: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /**
     * @param {DOMRect|Element} [anchor]
     * @return {void}
     */
    updatePopupPosition(anchor?: DOMRect | Element): void;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /**
     * @param {DOMRect|Element} [anchor]
     * @return {void}
     */
    updatePopupPosition(anchor?: DOMRect | Element): void;
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
} & {
    _ariaHidden(this: import("../core/CustomElement.js").default & {
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
        /**
         * @param {DOMRect|Element} [anchor]
         * @return {void}
         */
        updatePopupPosition(anchor?: DOMRect | Element): void;
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
    }, { open }: import("../core/CustomElement.js").default & {
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
        /**
         * @param {DOMRect|Element} [anchor]
         * @return {void}
         */
        updatePopupPosition(anchor?: DOMRect | Element): void;
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
    } & T2): "false" | "true";
});
export type PopupStack = {
    element: Element;
    previousFocus: Element;
    centered?: boolean;
    state?: Record<string, any>;
    previousState?: Record<string, any>;
    originalEvent?: MouseEvent | PointerEvent | HTMLElement | Element;
    pendingResizeOperation?: any;
    scrollRestoration?: (Window & typeof globalThis)['history']['scrollRestoration'];
};
//# sourceMappingURL=PopupMixin.d.ts.map