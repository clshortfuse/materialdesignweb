/** @link https://www.rfc-editor.org/rfc/rfc7396 */

/**
 * @template T1
 * @template T2
 * @param {T1} target
 * @param {T2} patch
 * @return {T1|T2|(T1 & T2)}
 */
export function mergePatch(target, patch) {
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
      target[key] = mergePatch(target[key], value);
    }
  }
  return target;
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
