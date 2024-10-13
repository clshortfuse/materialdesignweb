/** @link https://www.rfc-editor.org/rfc/rfc7396 */
/**
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatch<T1, T2>(target: T1, patch: T2): T1 | T2 | (T1 & T2);
/**
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `reference`: Per spec, returns array as is
 *  - `clone`: Clones all entries with no inspection.
 *  - `object`: Convert to flattened, array-like objects. Requires
 *    consumer of patch to be aware of the schema beforehand.
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @param {'clone'|'object'|'reference'} [arrayStrategy='reference']
 * @return {any} Patch
 */
export function buildMergePatch(previous: object | number | string | boolean, current: object | number | string | boolean, arrayStrategy?: "clone" | "object" | "reference"): any;
/**
 * Short-circuited JSON Merge Patch evaluation
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @return {boolean}
 */
export function hasMergePatch<T>(target: T, patch: Partial<T>): boolean;
//# sourceMappingURL=jsonMergePatch.d.ts.map