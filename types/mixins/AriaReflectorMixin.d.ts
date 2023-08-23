/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function AriaReflectorMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * Browsers that do no support AriaMixin in ElementInternals need to have
     * their attributes after construction.
     * @type {Map<string, string>}
     */
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {keyof HTMLElement & keyof ElementInternals} name
     */
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
    /**
     * @param {keyof HTMLElement & keyof ElementInternals} name
     * @param {string} value
     */
    updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
}, any[]>;
//# sourceMappingURL=AriaReflectorMixin.d.ts.map