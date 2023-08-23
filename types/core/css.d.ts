/**
 * @param {string} content
 * @param {boolean} [useCache=true]
 * @return {CSSStyleSheet}
 */
export function createCSSStyleSheet(content: string, useCache?: boolean): CSSStyleSheet;
/**
 * @param {string} content
 * @param {boolean} [useCache=true]
 * @return {HTMLStyleElement}
 */
export function createHTMLStyleElement(content: string, useCache?: boolean): HTMLStyleElement;
/**
 * @param {string} content
 * @param {boolean} [useCache=true]
 */
export function createCSS(content: string, useCache?: boolean): CSSStyleSheet | HTMLStyleElement;
/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @param {boolean} [useCache=true]
 * @yields composed CSSStyleSheet
 * @return {Generator<CSSStyleSheet>} composed CSSStyleSheet
 */
export function generateCSSStyleSheets(styles: Iterable<HTMLStyleElement | CSSStyleSheet>, useCache?: boolean): Generator<CSSStyleSheet>;
/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @param {boolean} [useCache=true]
 * @yields composed HTMLStyleElement
 * @return {Generator<HTMLStyleElement>} composed CSSStyleSheet
 */
export function generateHTMLStyleElements(styles: Iterable<HTMLStyleElement | CSSStyleSheet>, useCache?: boolean): Generator<HTMLStyleElement>;
/**
 * @param {TemplateStringsArray|string} array
 * @param  {...any} substitutions
 * @return {HTMLStyleElement|CSSStyleSheet}
 */
export function css(array: TemplateStringsArray | string, ...substitutions: any[]): HTMLStyleElement | CSSStyleSheet;
/**
 * @param {TemplateStringsArray|string|HTMLStyleElement|CSSStyleSheet} styles
 * @param  {...any} substitutions
 * @return {HTMLStyleElement|CSSStyleSheet}
 */
export function addGlobalCss(styles: TemplateStringsArray | string | HTMLStyleElement | CSSStyleSheet, ...substitutions: any[]): HTMLStyleElement | CSSStyleSheet;
//# sourceMappingURL=css.d.ts.map