/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function AriaReflectorMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _ariaRole: string;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _ariaRole: string;
} & {
    /**
     * Browsers that do no support AriaMixin in ElementInternals need to have
     * their attributes after construction.
     * @type {Map<string, string>}
     */
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _ariaRole: string;
} & {
    /**
     * Browsers that do no support AriaMixin in ElementInternals need to have
     * their attributes after construction.
     * @type {Map<string, string>}
     */
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
} & {
    /**
     * @param {keyof HTMLElement & keyof ElementInternals} name
     */
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
    /**
     * @param {keyof HTMLElement & keyof ElementInternals} name
     * @param {string} value
     */
    updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
});
//# sourceMappingURL=AriaReflectorMixin.d.ts.map