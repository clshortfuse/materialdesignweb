/** @typedef {'boolean'|'integer'|'float'|'string'|'map'|'set'|'array'} IDLOptionType */

/**
 * @template {IDLOptionType} T
 * @typedef {(
 *  T extends 'boolean' ? boolean
 *  : T extends 'string' ? string
 *  : T extends 'float'|'integer' ? number
 *  : T extends 'array' ? Array<?>
 *  : T extends 'set' ? Set<?>
 *  : T extends 'map' ? Map<?,?>
 *  : unknown
 * )} ParsedIDLType<T>
 */

/**
 * @template {IDLOptionType} T1
 * @template {any} T2
 * @typedef IDLOptions
 * @prop {T1} [type]
 * @prop {string} [attr]
 * @prop {boolean|'write'|'read'} [reflect=true]
 * @prop {boolean} [enumerable]
 * @prop {boolean} [nullable] Defaults to false if boolean
 * @prop {T2} [empty] Empty value when not nullable
 * @prop {(value: T2) => T2} [onNullish] Function used when null passed
 * @prop {T2} [default] Initial value (empty value if not specified)
 * @prop {boolean} [initialized]
 * @prop {WeakMap<CustomElement, T1>} [values]
 * @prop {WeakMap<CustomElement, string>} [attrValues]
 */

/**
 * @param {IDLOptionType} type
 * @return {any}
 */
function emptyFromType(type) {
  switch (type) {
    case 'boolean':
      return false;
    case 'integer':
    case 'float':
      return 0;
    case 'map':
      return new Map();
    case 'set':
      return new Set();
    case 'array':
      return [];
    default:
    case 'string':
      return '';
  }
}

/**
 * Converts property name to attribute name
 * (Similar to DOMStringMap)
 * @param {string} name
 * @return {string}
 */
function propNameToAttrName(name) {
  const attrNameWords = name.split(/([A-Z])/);
  if (attrNameWords.length === 1) return name;
  return attrNameWords.reduce((prev, curr) => {
    if (prev == null) return curr;
    if (curr.length === 1 && curr.toUpperCase() === curr) {
      return `${prev}-${curr.toLowerCase()}`;
    }
    return prev + curr;
  });
}

/**
 * @template {IDLOptionType} [T1=any]
 * @template {any} [T2=ParsedIDLType<T1>]
 * @param {string} name
 * @param {T1|IDLOptions<T1,T2>} [typeOrOptions='string']
 * @return {IDLOptions<T1,T2>}
 */
export function parseIDLOptions(name, typeOrOptions) {
  const isPrivate = name[0] === '_';

  /** @type {IDLOptions<T1,T2>} */
  const options = {
    ...((typeof typeOrOptions === 'string') ? { type: typeOrOptions } : typeOrOptions),
  };

  const { type, attr, empty, onNullish } = options;

  // If not set:
  //  private & attribute = write-only
  //  attribute = true
  //  else false
  const reflect = options.reflect ?? (isPrivate ? (attr ? 'write' : false) : true);
  const enumerable = options.enumerable ?? !isPrivate;

  /** @type {IDLOptionType} */
  let parsedType = type;
  if (parsedType == null) {
    if (options.default == null) {
      parsedType = 'string';
    } else {
      const parsed = typeof options.default;
      parsedType = (parsed === 'number')
        ? (Number.isInteger(options.default) ? 'integer' : 'float')
        : parsed;
    }
  }

  // if defined ? value
  // else if boolean ? false
  // else if onNullish ? false
  // else if empty == null
  const nullable = options.nullable ?? (
    parsedType === 'boolean'
      ? false
      : (onNullish ? false : empty == null)
  );
  /** @type {any} */
  let parsedEmpty = empty ?? null;
  if (!nullable && parsedEmpty === null) {
    parsedEmpty = emptyFromType(parsedType);
  }

  return {
    reflect,
    enumerable,
    default: options.default ?? parsedEmpty,
    type: parsedType,
    attr: attr ?? (reflect ? propNameToAttrName(name) : null),
    nullable,
    empty: nullable ? null : parsedEmpty,
    onNullish,
    values: new WeakMap(),
    attrValues: new WeakMap(),
  };
}
