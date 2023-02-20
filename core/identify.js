const PREFIX = '_mdw-';

/** @type {Set<string>} */
const generatedUIDs = new Set();

/** @return {string} */
export function generateUID() {
  const id = Math.random().toString(36).slice(2, 10);
  if (generatedUIDs.has(id)) {
    return generateUID();
  }
  generatedUIDs.add(id);
  return id;
}

/**
 * @param {Element} element
 * @param {boolean} [mutate=false]
 * @return {string}
 */
export function identifierFromElement(element, mutate) {
  if (element.id) {
    return element.id;
  }
  if (!mutate) {
    return null;
  }
  const id = PREFIX + generateUID();
  element.id = id;
  return id;
}

/**
 * @param {string} identifier
 * @param {Element} element
 * @return {boolean}
 */
export function identifierMatchesElement(identifier, element) {
  return element.id === identifier;
}
