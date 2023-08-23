/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function RTLObserverMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    pageIsRTL: boolean;
});
//# sourceMappingURL=RTLObserverMixin.d.ts.map