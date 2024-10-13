/**
 * @param {string} [fromString]
 * @return {DocumentFragment}
 */
export function generateFragment(fromString?: string): DocumentFragment;
/**
 * @template T
 * @typedef {Object} RenderOptions
 * @prop {Object} context
 * @prop {ParentNode} root
 * @prop {Object<string, HTMLElement>} refs
 */
/**
 * @param {(data: Partial<any>) => any} fn
 * @return {string}
 */
export function addInlineFunction(fn: (data: Partial<any>) => any): string;
/**
 * @template T1
 * @template T2
 * @param {TemplateStringsArray} strings
 * @param  {...(string|DocumentFragment|Element|((this:T1, data:T2) => any))} substitutions
 * @return {DocumentFragment}
 */
export function html<T1, T2>(strings: TemplateStringsArray, ...substitutions: (string | DocumentFragment | Element | ((this: T1, data: T2) => any))[]): DocumentFragment;
/** @type {Map<string, InlineFunctionEntry<?>>} */
export const inlineFunctions: Map<string, InlineFunctionEntry<unknown>>;
export type RenderOptions<T> = {
    context: Object;
    root: ParentNode;
    refs: {
        [x: string]: HTMLElement;
    };
};
/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 */
export type InlineFunctionEntry<T extends unknown> = {
    fn: (data: T) => any;
    props?: string[];
    deepProps?: string[][];
    injectionProps?: string[];
    injectionDeepProps?: string[][];
    defaultValue?: T;
};
//# sourceMappingURL=template.d.ts.map