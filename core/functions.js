/** @type {Document} */
let _inactiveDocument;

/**
 * @param {string} [fromString]
 * @return {DocumentFragment}
 */
export function generateFragment(fromString) {
  _inactiveDocument ??= document.implementation.createHTMLDocument();
  if (fromString == null) {
    return _inactiveDocument.createDocumentFragment();
  }
  return _inactiveDocument.createRange().createContextualFragment(fromString);
}

/**
 * @param {IDLOptionType} type
 * @return {any}
 */
export function emptyFromType(type) {
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
export function propNameToAttrName(name) {
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
 * Converts attribute name to property name
 * (Similar to DOMStringMap)
 * @param {string} name
 * @return {string}
 */
export function attrNameToPropName(name) {
  const propNameWords = name.split('-');
  if (propNameWords.length === 1) return name;
  return propNameWords.reduce((prev, curr) => {
    if (prev == null) return curr;
    return prev + curr[0].toUpperCase() + curr.slice(1);
  });
}

/**
 * @param {string} prop
 * @param {any} source
 * @return {any}
 */
export function valueFromPropName(prop, source) {
  let value = source;
  for (const child of prop.split('.')) {
    if (!child) {
      value = null;
      break;
    }
    // @ts-ignore Skip cast
    value = value[child];
  }
  if (value === source) return null;
  return value;
}
