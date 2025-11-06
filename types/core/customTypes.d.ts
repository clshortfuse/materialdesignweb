/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
 * @type {import('./observe.js').ObserverOptions<'function',EventListener, CustomElement>}
 */
export const EVENT_HANDLER_TYPE: import("./observe.js").ObserverOptions<"function", EventListener, CustomElement>;
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