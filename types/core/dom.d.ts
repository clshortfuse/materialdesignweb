/**
 * @param {any} value
 * @return {?string}
 */
export function attrValueFromDataValue(value: any): string | null;
/**
 * Converts property name to attribute name
 * (Similar to DOMStringMap)
 * @param {string} name
 * @return {string}
 */
export function attrNameFromPropName(name: string): string;
/**
 * @param {Element} element
 * @return {boolean}
 */
export function isFocused(element: Element): boolean;
/**
 * @param {HTMLElement|Element} element
 * @param {Parameters<HTMLElement['focus']>} [options]
 * @return {boolean} Focus was successful
 */
export function attemptFocus(element: HTMLElement | Element, options?: FocusOptions): boolean;
/**
 * @param {Element} element
 * @return {boolean}
 */
export function isRtl(element: Element): boolean;
export const CHROME_VERSION: number;
export const FIREFOX_VERSION: number;
export const SAFARI_VERSION: number;
//# sourceMappingURL=dom.d.ts.map