/**
 * @param {string} name
 * @param {string} path
 * @param {string} [viewBox]
 */
export function addSVGAlias(name: string, path: string, viewBox?: string): void;
/** @type {Map<string, {path:string, viewBox:string}>} */
export const svgAliasMap: Map<string, {
    path: string;
    viewBox: string;
}>;
export const unaliased: Set<any>;
//# sourceMappingURL=svgAlias.d.ts.map