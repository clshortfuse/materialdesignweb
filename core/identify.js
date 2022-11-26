/** @typedef {`${string},${string},${string}`} ElementIdentifierKey */

/**
 * @typedef {{
 *  id:string, class?:string, query?:string} |
 *  {id?:string, class:string, query?:string} |
 *  {id?:string, class?:string, query:string
 * }} ElementIdentifier
 */

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
 * @param {ElementIdentifier} identifier
 * @return {ElementIdentifierKey}
 */
export function keyFromIdentifier(identifier) {
  return `${identifier.id ?? ''},${identifier.class ?? ''},${identifier.query ?? ''}`;
}

/**
 * @param {ElementIdentifierKey} key
 * @return {ElementIdentifier}
 */
export function identifierFromKey(key) {
  const [id, _class, ...query] = key.split(',');
  return {
    id,
    class: _class,
    query: query.join(','),
  };
}

/**
 * @param {Element} element
 * @param {boolean} [mutate=false]
 * @return {ElementIdentifier}
 */
export function identifierFromElement(element, mutate) {
  if (element.id) {
    return { id: element.id };
  }
  for (const className of element.classList) {
    if (className.startsWith(PREFIX)) {
      return { class: className };
    }
  }
  if (!mutate) {
    return null;
  }
  const className = PREFIX + generateUID();
  element.classList.add(className);
  return { class: className };
}

/**
 * @param {ElementIdentifier} identifier
 * @param {Element} element
 * @return {boolean}
 */
export function identifierMatchesElement(identifier, element) {
  if (identifier.id) {
    return element.id === identifier.id;
  }
  if (identifier.class) {
    return element.classList.contains(identifier.class);
  }
  return element.matches(identifier.query);
}
