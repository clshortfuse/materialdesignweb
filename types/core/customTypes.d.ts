/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
 * @type {import('./observe.js').ObserverOptions<'function',EventListener, CustomElement>}
 */
export const EVENT_HANDLER_TYPE: import("./observe.js").ObserverOptions<"function", EventListener, CustomElement>;
export type STORE_PROXY_TYPE<T_1 extends unknown> = import("./observe.js").ObserverOptions<"object", T_1, CustomElement>;
/**
 * Proxy store binding. Expects a proxy with a `.subscribe(fn)` method that
 * returns an unsubscribe function.
 * @template {unknown} T
 * @type {import('./observe.js').ObserverOptions<'object', T, CustomElement>}
 */
export const STORE_PROXY_TYPE: import("./observe.js").ObserverOptions<"object", T, CustomElement>;
/** @type {import('./observe.js').ObserverOptions<'object',ElementStylerOptions, CustomElement>} */
export const ELEMENT_ANIMATION_TYPE: import("./observe.js").ObserverOptions<"object", ElementStylerOptions, CustomElement>;
/** @type {import('./observe.js').ObserverOptions<'string',string, CustomElement>} */
export const ELEMENT_STYLE_TYPE: import("./observe.js").ObserverOptions<"string", string, CustomElement>;
export type CustomElement = import("./CustomElement").default;
export type ElementStylerOptions = {
    /**
     * tag, element or null (host)
     */
    target: string | HTMLElement | null;
    styles: Keyframe;
    timing?: EffectTiming;
};
export type QueuedPropsMetadata = {
    initial: boolean;
};
//# sourceMappingURL=customTypes.d.ts.map