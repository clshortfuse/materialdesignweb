/** @typedef {'boolean'|'integer'|'float'|'string'|'map'|'set'|'array'} ObserverPropertyType */

/**
 * @template {ObserverPropertyType} T
 * @typedef {(
 *  T extends 'boolean' ? boolean
 *  : T extends 'string' ? string
 *  : T extends 'float'|'integer' ? number
 *  : T extends 'array' ? Array<?>
 *  : T extends 'set' ? Set<?>
 *  : T extends 'map' ? Map<?,?>
 *  : unknown
 * )} ParsedObserverPropertyType<T>
 */

/**
 * @template T
 * @template {any} [C=any]
 * @callback ValueParser
 * @this C
 * @param {any} value
 * @throws {TypeError}
 * @return {T}
 */

/**
 * @template T
 * @template {any} [C=any]
 * @callback NullParser
 * @this C
 * @param {undefined|null} value
 * @throws {TypeError}
 * @return {T}
 */

/**
 * @template {ObserverPropertyType} T1
 * @template {any} T2
 * @template {string} K
 * @template {any} [C=any]
 * @typedef ObserverOptions
 * @prop {T1} [type]
 * @prop {string} [attr]
 * @prop {boolean|'write'|'read'} [reflect=true]
 * @prop {boolean} [enumerable]
 * @prop {boolean} [nullable] Defaults to false if boolean
 * @prop {T2} [empty] Empty value when not nullable
 * @prop {T2} [default] Initial value (empty value if not specified)
 * @prop {(this:C, name:K,oldValue:T2,newValue:T2)=>any} changedCallback
 * @prop {(this:C, value:null|undefined)=>T2} [nullParser]
 * @prop {(this:C, value:any)=>T2} [parser]
 * @prop {(this:C, a:T2,b:T2)=>boolean} [is] Function used when comparing
 */

/**
 * @template {any} T
 * @template {string} K
 * @template {any} [C=any]
 * @typedef ObserverConfiguration
 * @prop {K} key
 * @prop {boolean} [enumerable]
 * @prop {T} [default] Initial value (empty value if not specified)
 * @prop {WeakMap<any, T>} [values]
 * @prop {(this:C, name:K,oldValue:T,newValue:T)=>any} changedCallback
 * @prop {(this:C, value:any)=>T} nullParser
 * @prop {(this:C, value:any)=>T} parser
 * @prop {(this:C, a:T,b:T)=>boolean} is Function used when comparing
 */

/** @return {null} */
const DEFAULT_NULL_PARSER = () => null;

/**
 * @param {ObserverPropertyType} type
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
 * @param {ObserverPropertyType} type
 * @return {any}
 */
function defaultParserFromType(type) {
  switch (type) {
    case 'boolean':
      return Boolean;
    case 'integer':
      // Calls ToNumber(x)
      return Math.round;
    case 'float':
      return Number;
    case 'map':
      return Map;
    case 'set':
      return Set;
    case 'array':
      return Array.from;
    default:
    case 'string':
      return String;
  }
}

/**
 * @template {string} K
 * @template {ObserverPropertyType} [T1=any]
 * @template {any} [T2=ParsedObserverPropertyType<T1>]
 * @param {K} name
 * @param {T1|ObserverOptions<T1,T2,K>} [typeOrOptions='string']
 * @return {ObserverConfiguration<T1,K> & ObserverOptions<T1,T2,K>}
 */
export function parseObserverOptions(name, typeOrOptions) {
  const isPrivate = name[0] === '_';

  /** @type {Partial<ObserverOptions<T1,T2,K>>} */
  const options = {
    ...((typeof typeOrOptions === 'string') ? { type: typeOrOptions } : typeOrOptions),
  };

  const { type, empty } = options;

  const enumerable = options.enumerable ?? !isPrivate;

  /** @type {ObserverPropertyType} */
  let parsedType = type;
  if (parsedType == null) {
    if (options.default == null) {
      parsedType = 'string';
    } else {
      const parsed = typeof options.default;
      parsedType = (parsed === 'number')
        ? (Number.isInteger(options.default) ? 'integer' : 'number')
        : parsed;
    }
  }

  // if defined ? value
  // else if boolean ? false
  // else if onNullish ? false
  // else if empty == null
  const parser = options.parser ?? defaultParserFromType(parsedType);
  let nullParser = options.nullParser;
  const parsedEmpty = empty ?? null;
  if (!nullParser) {
    const nullable = options.nullable ?? (
      parsedType === 'boolean'
        ? false
        : (empty == null));
    if (nullable) {
      nullParser = DEFAULT_NULL_PARSER;
    } else {
      nullParser = parsedEmpty === null ? () => emptyFromType(parsedType) : () => parsedEmpty;
    }
  }

  return {
    ...options,
    enumerable,
    default: options.default ?? parsedEmpty,
    parser,
    nullParser,
    key: name,
    changedCallback: options.changedCallback,
  };
}

/** @type {Partial<ObserverConfiguration<?,?>>} */
const DEFAULT_OBSERVER_CONFIGURATION = {
  nullParser: DEFAULT_NULL_PARSER,
  is: Object.is,
};

/**
 * @this {ObserverConfiguration<?,?,?>}
 * @param {*} value
 */
export function parsePropertyValue(value) {
  let newValue = value;
  newValue = value == null
    ? this.nullParser.call(this, value)
    : this.parser.call(this, newValue);
}

/**
 * @template {ObserverPropertyType} T1
 * @template T2
 * @template {string} K
 * @template [C=any]
 * @param {C} object
 * @param {K} key
 * @param {ObserverOptions<T1,T2,K,C>} options
 * @return {ObserverConfiguration<T1,K,C>}
 */
export const defineObservableProperty = (object, key, options) => {
  /** @type {ObserverConfiguration<T1,K,C>} */
  const config = {
    values: new Map(),
    ...DEFAULT_OBSERVER_CONFIGURATION,
    ...parseObserverOptions(key, options),
    changedCallback: options.changedCallback,
  };

  Object.defineProperty(object, key, {
    enumerable: config.enumerable,
    /**
     * @this {C}
     * @return {T1}
     */
    get() {
      return !config.values.has(this) ? config.default : config.values.get(this);
    },
    /**
     * @this {C}
     * @param {T1} value
     * @return {void}
     */
    set(value) {
      const oldValue = !config.values.has(this) ? config.default : config.values.get(this);
      if (oldValue === value) return;

      let newValue = value;
      newValue = value == null
        ? config.nullParser.call(this, value)
        : config.parser.call(this, newValue);

      if (oldValue == null) {
        if (newValue == null) return; // Both nullish
      } else if (newValue != null && (oldValue === newValue || config.is.call(this, oldValue, newValue))) {
        // Not null and match
        return;
      }

      config.values.set(this, newValue);
      config.changedCallback.call(this, key, oldValue, newValue);
    },
  });

  return config;
};
