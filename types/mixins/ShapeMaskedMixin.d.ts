/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function ShapeMaskedMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
});
//# sourceMappingURL=ShapeMaskedMixin.d.ts.map