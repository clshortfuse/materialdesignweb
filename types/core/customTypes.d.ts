/** @typedef {import('./CustomElement').default} CustomElement */
/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
 * @type {import('./observe.js').ObserverOptions<'function',EventListener, unknown>}
 */
export const EVENT_HANDLER_TYPE: import('./observe.js').ObserverOptions<'function', EventListener, unknown>;
/**
 * @type {import('./observe.js').ObserverOptions<'object',HTMLElement>}
 */
export const WEAKREF_TYPE: import('./observe.js').ObserverOptions<'object', HTMLElement>;
/** @type {import('./observe.js').ObserverOptions<'object',ElementStylerOptions, CustomElement>} */
export const ELEMENT_STYLER_TYPE: import('./observe.js').ObserverOptions<'object', ElementStylerOptions, CustomElement>;
export type CustomElement = import('./CustomElement').default;
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