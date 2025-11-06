/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function KeyboardNavMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<import("./AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("./AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
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
    /**
     * Focuses next element participating in roving tab index list
     * @param {HTMLElement} [current]
     * @param {boolean} [loop=true]
     * @param {boolean} [reverse]
     * @return {HTMLElement} focusedElement
     */
    focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
    /**
     * Alias for focusNext(list, current, true).
     * Selects previous element
     * @param {HTMLElement} [current]
     * @param {boolean} [loop=true]
     * @return {HTMLElement}
     */
    focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
    focus(options?: FocusOptions): void;
    /**
     * Refreshes roving tab index attributes based on kbdNavChildren
     */
    refreshTabIndexes(): void;
}, any[]>;
//# sourceMappingURL=KeyboardNavMixin.d.ts.map