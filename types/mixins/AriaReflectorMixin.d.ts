/**
 * @template K
 * @typedef {K extends keyof ARIAMixin ? ARIAMixin[K] extends string ? K : never : never} StringKeyOfARIAMixin
 */
/**
 * Reflects ARIA-like properties to attributes/ElementInternals and vice versa.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaReflectorMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * Browsers that do not support ARIAMixin in ElementInternals need to have
     * their attributes set after construction.
     * @type {Map<StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[StringKeyOfARIAMixin<keyof ARIAMixin>]>}
     */
    _onConnectAriaValues: Map<StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[StringKeyOfARIAMixin<keyof ARIAMixin>]>;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {keyof HTMLElement & keyof ElementInternals} name
     */
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    /**
     * @template {StringKeyOfARIAMixin<keyof ARIAMixin>} K
     * @param {K} name
     * @param {ARIAMixin[K]} value
     */
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
}, any[]>;
export type StringKeyOfARIAMixin<K> = K extends keyof ARIAMixin ? ARIAMixin[K] extends string ? K : never : never;
//# sourceMappingURL=AriaReflectorMixin.d.ts.map