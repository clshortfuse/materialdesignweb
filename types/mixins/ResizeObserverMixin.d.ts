/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ResizeObserverMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @param {ResizeObserverEntry} entry */
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}, any[]>;
//# sourceMappingURL=ResizeObserverMixin.d.ts.map