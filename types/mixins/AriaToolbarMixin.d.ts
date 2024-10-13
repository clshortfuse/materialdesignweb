/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaToolbarMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
    updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
    ariaOrientationDefault: string;
    _ariaRole: string;
}, any[]>;
//# sourceMappingURL=AriaToolbarMixin.d.ts.map