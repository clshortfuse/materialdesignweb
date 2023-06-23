/** @type {Map<string, {path:string, viewBox:string}>} */
export const svgAliasMap = new Map();
export const unaliased = new Set();

/**
 * @param {string} name
 * @param {string} path
 * @param {string} [viewBox]
 */
export function addSVGAlias(name, path, viewBox = '0 0 24 24') {
  name = name.toLowerCase();
  if (path) {
    svgAliasMap.set(name, { path, viewBox });
  } else {
    svgAliasMap.delete(name);
  }
}
