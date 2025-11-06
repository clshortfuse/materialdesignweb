/** eslint-env browser */
export const FRAGMENT_TAG: "$FRAGMENT";
/**
 * @param {string} tagName
 * @param {{ children?: DocumentFragment|string } & Record<string, any>} attrs
 * @return {HTMLElement|DocumentFragment}
 */
export function jsx(tagName: string, attrs?: {
    children?: DocumentFragment | string;
} & Record<string, any>): HTMLElement | DocumentFragment;
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