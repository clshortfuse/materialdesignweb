/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ThemableMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    color: string;
    ink: string;
    typeStyle: string;
});
//# sourceMappingURL=ThemableMixin.d.ts.map