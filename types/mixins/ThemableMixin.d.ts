/**
 * Adds theming attributes (`color`, `ink`, `typeStyle`) that map to CSS tokens.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ThemableMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    color: string;
    ink: string;
    typeStyle: string;
}, any[]>;
//# sourceMappingURL=ThemableMixin.d.ts.map