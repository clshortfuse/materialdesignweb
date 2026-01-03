/** @see https://www.rfc-editor.org/rfc/rfc7396 */
/**
 * Default behavior: arrays are treated like objects (index/length merge).
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatchObject<T1, T2>(target: T1, patch: T2): T1 | T2 | (T1 & T2);
/**
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @param {'clone'|'object'|'reference'} [arrayStrategy='reference']
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatch<T1, T2>(target: T1, patch: T2, arrayStrategy?: "clone" | "object" | "reference"): T1 | T2 | (T1 & T2);
/**
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `reference`: Returns array as-is (replacement).
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @return {any} Patch
 */
export function buildMergePatchReference(previous: object | number | string | boolean, current: object | number | string | boolean): any;
/**
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `clone`: Clones all entries with no inspection.
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @return {any} Patch
 */
export function buildMergePatchClone(previous: object | number | string | boolean, current: object | number | string | boolean): any;
/**
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `object`: Convert to flattened, array-like objects. Requires
 *    consumer of patch to be aware of the schema beforehand.
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @return {any} Patch
 */
export function buildMergePatchObject(previous: object | number | string | boolean, current: object | number | string | boolean): any;
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
 * Default behavior: arrays are treated like objects (index/length merge).
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @return {boolean}
 */
export function hasMergePatchReference<T>(target: T, patch: Partial<T>): boolean;
/**
 * Object-merge semantics for arrays (alias of reference strategy).
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @return {boolean}
 */
export function hasMergePatchObject<T>(target: T, patch: Partial<T>): boolean;
/**
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @param {'clone'|'object'|'reference'} [arrayStrategy='reference']
 * @return {boolean}
 */
export function hasMergePatch<T>(target: T, patch: Partial<T>, arrayStrategy?: "clone" | "object" | "reference"): boolean;
//# sourceMappingURL=jsonMergePatch.d.ts.map