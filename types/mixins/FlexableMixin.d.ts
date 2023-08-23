/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FlexableMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
});
//# sourceMappingURL=FlexableMixin.d.ts.map