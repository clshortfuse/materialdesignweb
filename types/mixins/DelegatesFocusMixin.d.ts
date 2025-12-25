/**
 * Enables focus delegation to an internal focus target and manages tabindex behavior.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
/**
 * Adds delegated focus behavior to the element's internals for keyboard navigation.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function DelegatesFocusMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    /** When true, the element delegates focus to an internal focus target. */
    delegatesFocus: boolean;
}, any[]>;
//# sourceMappingURL=DelegatesFocusMixin.d.ts.map