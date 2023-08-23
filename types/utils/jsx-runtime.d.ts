/** eslint-env browser */
export const Fragment: "$FRAGMENT";
/**
 * @param {string} tagName
 * @param {{ children?: DocumentFragment|string }} attrs
 * @return {HTMLElement|DocumentFragment}
 */
export function jsx(tagName: string, attrs?: {
    children?: DocumentFragment | string;
}): HTMLElement | DocumentFragment;
/**
 * @param {string} tagName
 * @param {Record<string, any> & { children: HTMLElement[], style:string|CSSStyleDeclaration }} attrs
 * @return {HTMLElement|DocumentFragment}
 */
export function jsxs(tagName: string, attrs: Record<string, any> & {
    children: HTMLElement[];
    style: string | CSSStyleDeclaration;
}): HTMLElement | DocumentFragment;
//# sourceMappingURL=jsx-runtime.d.ts.map