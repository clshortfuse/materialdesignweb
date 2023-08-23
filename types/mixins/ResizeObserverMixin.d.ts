/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ResizeObserverMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _resizeObserverEnabled: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    _resizeObserverEnabled: boolean;
} & {
    /** @param {ResizeObserverEntry} entry */
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
});
//# sourceMappingURL=ResizeObserverMixin.d.ts.map