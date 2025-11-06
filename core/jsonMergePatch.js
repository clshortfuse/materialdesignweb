/** @link https://www.rfc-editor.org/rfc/rfc7396 */

/**
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatch(target, patch) {
  // @ts-ignore Runtime check
  if (target === patch) return target;
  if (target == null || patch == null || typeof patch !== 'object') return patch;
  if (typeof target !== 'object') {
    // @ts-ignore Forced cast to object
    target = {};
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) {
      // @ts-ignore Runtime check
      if (key in target) {
        // @ts-ignore T1 is always object
        delete target[key];
      }
    } else {
      // @ts-ignore T1 is forced object
      target[key] = applyMergePatch(target[key], value);
    }
  }
  return target;
}

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
export function buildMergePatch(previous, current, arrayStrategy = 'reference') {
  if (previous === current) return null;
  if (current == null || typeof current !== 'object') return current;
  if (previous == null || typeof previous !== 'object') {
    return structuredClone(current);
  }

  const patch = {};
  if (Array.isArray(current)) {
    if (arrayStrategy === 'reference') {
      return current;
    }
    // Assume previous is array
    if (arrayStrategy === 'clone') {
      return structuredClone(current);
    }
    for (const [index, value] of current.entries()) {
      if (value === null) {
        // @ts-ignore patch is ArrayLike
        patch[index] = null;
        continue;
      }
      if (value == null) {
        continue; // Skip undefined
      }
      // @ts-ignore previous is ArrayLike
      const changes = buildMergePatch(previous[index], value, arrayStrategy);
      if (changes !== null) {
        // @ts-ignore patch is ArrayLike
        patch[index] = changes;
      }
    }
    // for (let i = current.length; i < previous.length; i++) {
    //   patch[i] = null;
    // }
    // @ts-ignore previous is ArrayLike
    if (current.length !== previous.length) {
      patch.length = current.length;
    }
    return patch;
  }

  const previousKeys = new Set(Object.keys(previous));
  for (const [key, value] of Object.entries(current)) {
    previousKeys.delete(key);
    if (value === null) {
      // @ts-ignore patch is Object
      patch[key] = null;
      continue;
    }
    if (value == null) {
      continue; // Skip undefined
    }
    // @ts-ignore previous is Object
    const changes = buildMergePatch(previous[key], value, arrayStrategy);
    if (changes !== null) {
      // @ts-ignore patch is Object
      patch[key] = changes;
    }
  }
  for (const key of previousKeys) {
    // @ts-ignore patch is Object
    patch[key] = null;
  }

  return patch;
}

/**
 * Short-circuited JSON Merge Patch evaluation
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @return {boolean}
 */
export function hasMergePatch(target, patch) {
  if (target === patch) return false;
  if (patch == null || typeof patch !== 'object') return true;
  if (target != null && typeof target !== 'object') {
    return true;
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) {
      // @ts-ignore Runtime check
      if (key in target) {
        return true;
      }
    // @ts-ignore T is object
    } else if (hasMergePatch(target[key], value)) {
      return true;
    }
  }
  return false;
}
