/** @see https://www.rfc-editor.org/rfc/rfc7396 */

/**
 * Default behavior: arrays are treated like objects (index/length merge).
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatchObject(target, patch) {
  // @ts-ignore Runtime check
  if (target === patch) return target;
  if (Array.isArray(patch)) return patch;
  if (target == null || patch == null || typeof patch !== 'object') return patch;
  if (typeof target !== 'object') {
    // @ts-ignore Forced cast to object
    target = {};
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) {
      // @ts-ignore Runtime check
      if (key in target) {
        // @ts-ignore target is object
        delete target[key];
      }
    } else {
      // @ts-ignore target is object
      target[key] = applyMergePatchObject(target[key], value);
    }
  }
  return target;
}

/**
 * RFC 7396 semantics: only JSON objects are merged. Arrays are replaced.
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
function applyMergePatchReference(target, patch) {
  // @ts-ignore Runtime check
  if (target === patch) return target;
  const patchIsObject = patch != null && typeof patch === 'object' && !Array.isArray(patch);
  const targetIsObject = target != null && typeof target === 'object' && !Array.isArray(target);
  if (!patchIsObject || !targetIsObject) return patch;
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) {
      // @ts-ignore Runtime check
      if (key in target) {
        // @ts-ignore target is object
        delete target[key];
      }
    } else {
      // @ts-ignore target is object
      target[key] = applyMergePatchReference(target[key], value);
    }
  }
  return target;
}

/**
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @param {'clone'|'object'|'reference'} [arrayStrategy='reference']
 * @return {T1|T2|(T1 & T2)}
 */
export function applyMergePatch(target, patch, arrayStrategy = 'reference') {
  switch (arrayStrategy) {
    case 'clone':
    case 'object':
      return applyMergePatchObject(target, patch);
    default:
      return applyMergePatchReference(target, patch);
  }
}

/**
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `reference`: Returns array as-is (replacement).
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @return {any} Patch
 */
export function buildMergePatchReference(previous, current) {
  if (previous === current) return null;
  if (current == null || typeof current !== 'object') return current;
  if (previous == null || typeof previous !== 'object') {
    return structuredClone(current);
  }

  const patch = {};
  if (Array.isArray(current)) {
    return current;
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
    const changes = buildMergePatchReference(previous[key], value);
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
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `clone`: Clones all entries with no inspection.
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @return {any} Patch
 */
export function buildMergePatchClone(previous, current) {
  if (previous === current) return null;
  if (current == null || typeof current !== 'object') return current;
  if (previous == null || typeof previous !== 'object') {
    return structuredClone(current);
  }

  const patch = {};
  if (Array.isArray(current)) {
    return structuredClone(current);
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
    const changes = buildMergePatchClone(previous[key], value);
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
 * Creates a JSON Merge patch based
 * Allows different strategies for arrays
 *  - `object`: Convert to flattened, array-like objects. Requires
 *    consumer of patch to be aware of the schema beforehand.
 * @param {object|number|string|boolean} previous
 * @param {object|number|string|boolean} current
 * @return {any} Patch
 */
export function buildMergePatchObject(previous, current) {
  if (previous === current) return null;
  if (current == null || typeof current !== 'object') return current;
  if (previous == null || typeof previous !== 'object') {
    return structuredClone(current);
  }

  const patch = {};
  if (Array.isArray(current)) {
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
      const changes = buildMergePatchObject(previous[index], value);
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
    const changes = buildMergePatchObject(previous[key], value);
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
  switch (arrayStrategy) {
    case 'clone':
      return buildMergePatchClone(previous, current);
    case 'object':
      return buildMergePatchObject(previous, current);
    default:
      return buildMergePatchReference(previous, current);
  }
}

/**
 * Default behavior: arrays are treated like objects (index/length merge).
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @return {boolean}
 */
export function hasMergePatchReference(target, patch) {
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
    } else if (hasMergePatchReference(target[key], value)) {
      return true;
    }
  }
  return false;
}

/**
 * Object-merge semantics for arrays (alias of reference strategy).
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @return {boolean}
 */
export function hasMergePatchObject(target, patch) {
  if (Array.isArray(patch)) return target !== patch;
  return hasMergePatchReference(target, patch);
}

/**
 * @template T
 * @param {T} target
 * @param {Partial<T>} patch
 * @param {'clone'|'object'|'reference'} [arrayStrategy='reference']
 * @return {boolean}
 */
export function hasMergePatch(target, patch, arrayStrategy = 'reference') {
  switch (arrayStrategy) {
    case 'clone':
    case 'object':
      return hasMergePatchObject(target, patch);
    default:
      return hasMergePatchReference(target, patch);
  }
}
