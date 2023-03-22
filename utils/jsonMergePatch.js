/** @link https://www.rfc-editor.org/rfc/rfc7396 */

/**
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatch(target, patch) {
  if (target === patch) return target;
  if (patch == null || typeof patch !== 'object') return patch;
  if (target != null && typeof target !== 'object') {
    target = {};
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) {
      if (key in target) {
        delete target[key];
      }
    } else {
      target[key] = applyMergePatch(target[key], value);
    }
  }
  return target;
}

/**
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `clone`: Per spec, clones all entries with no inspection.
 *  - `object`: Convert to flattened, array-like objects. Requires
 *    consumer of patch to be aware of the schema beforehand.
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @param {'clone'|'object'} [arrayStrategy='clone']
 * @return {any} Patch
 */
export function buildMergePatch(previous, current, arrayStrategy = 'clone') {
  if (previous === current) return null;
  if (current == null || typeof current !== 'object') return current;
  if (previous == null || typeof previous !== 'object') {
    return structuredClone(current);
  }
  const isArray = Array.isArray(current);
  if (isArray && arrayStrategy === 'clone') {
    return structuredClone(current);
  }

  const patch = {};
  const previousKeys = new Set(Object.keys(previous));
  for (const [key, value] of Object.entries(current)) {
    previousKeys.delete(key);
    if (value == null) {
      console.warn('Nullish value found at', key);
      continue;
    }
    const changes = buildMergePatch(previous[key], value, arrayStrategy);
    if (changes === null) {
      console.log('keeping', key);
    } else {
      patch[key] = changes;
    }
  }
  for (const key of previousKeys) {
    patch[key] = null;
    console.log('removing', key);
  }

  if (isArray && arrayStrategy === 'object' && current.length !== previous.length) {
    patch.length = current.length;
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
      if (key in target) {
        return true;
      }
    } else if (hasMergePatch(target[key], value)) {
      return true;
    }
  }
  return false;
}
