import { attrNameFromPropName } from './dom.js';
import { buildMergePatch, hasMergePatch } from './jsonMergePatch.js';

/** @typedef {import('./typings.js').ObserverPropertyType} ObserverPropertyType */

/** @return {null} */
const DEFAULT_NULL_PARSER = () => null;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean#boolean_coercion
 * @param {any} v
 * @return {boolean}
 */
const DEFAULT_BOOLEAN_PARSER = (v) => !!v;

/**
 * Doesn't support `BigInt` types
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_coercion
 * @param {any} v
 * @return {number}
 */
const DEFAULT_NUMBER_PARSER = (v) => +v;

/**
 * Doesn't support `Symbol` types
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion
 * @param {any} v
 * @return {string}
 */
const DEFAULT_STRING_PARSER = (v) => `${v}`;

/**
 * @template T
 * @param {T} o
 * @return {T}
 */
const DEFAULT_OBJECT_PARSER = (o) => o;

/**
 * @template T
 * @param {T} a
 * @param {T} b
 * @return {boolean} true if equal
 */
export const DEFAULT_OBJECT_COMPARATOR = (a, b) => !hasMergePatch(a, b);

/**
 * @template T
 * @param {T} a
 * @param {T} b
 * @return {boolean} true if equal
 */
export const DEFAULT_OBJECT_DIFF = (a, b) => buildMergePatch(a, b, 'object');

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
    case 'object':
      return null;
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
      return DEFAULT_BOOLEAN_PARSER;
    case 'integer':
      // Calls ToNumber(x)
      return Math.round;
    case 'float':
      return DEFAULT_NUMBER_PARSER;
    case 'map':
      return Map;
    case 'set':
      return Set;
    case 'object':
      return DEFAULT_OBJECT_PARSER;
    case 'array':
      return Array.from;
    default:
    case 'string':
      return DEFAULT_STRING_PARSER;
  }
}

/**
 * @template {string} K
 * @template {ObserverPropertyType} [T1=any]
 * @template {any} [T2=import('./typings.js').ParsedObserverPropertyType<T1>]
 * @param {K} name
 * @param {T1|import('./typings.js').ObserverOptions<T1,T2>} [typeOrOptions='string']
 * @param {any} object
 * @return {import('./typings.js').ObserverConfiguration<T1,T2,K> & import('./typings.js').ObserverOptions<T1,T2>}
 */
export function parseObserverOptions(name, typeOrOptions, object) {
  /** @type {Partial<import('./typings.js').ObserverOptions<T1,T2>>} */
  const options = {
    ...((typeof typeOrOptions === 'string') ? { type: typeOrOptions } : typeOrOptions),
  };

  let { enumerable, attr, reflect } = options;
  const { type, empty, changedCallback } = options;

  /** @type {ObserverPropertyType} */
  let parsedType = type;
  if (parsedType == null) {
    // Use .value or .get() to parse type
    const value = options.value ?? empty ?? options.get?.call(object ?? {}, object ?? {});
    if (value == null) {
      parsedType = 'string';
    } else {
      const parsed = typeof value;
      parsedType = (parsed === 'number')
        ? (Number.isInteger(value) ? 'integer' : 'number')
        : parsed;
    }
  }

  enumerable ??= name[0] !== '_';
  reflect ??= enumerable ? parsedType !== 'object' : (attr ? 'write' : false);
  attr ??= (reflect ? attrNameFromPropName(name) : null);

  // if defined ? value
  // else if boolean ? false
  // else if onNullish ? false
  // else if empty == null
  const parser = options.parser ?? defaultParserFromType(parsedType);
  let nullParser = options.nullParser;
  let parsedEmpty = empty ?? null;
  if (!nullParser) {
    const nullable = options.nullable ?? (
      parsedType === 'boolean'
        ? false
        : (empty == null));
    if (nullable) {
      nullParser = DEFAULT_NULL_PARSER;
    } else {
      parsedEmpty ??= emptyFromType(parsedType);
      nullParser = parsedEmpty === null ? () => emptyFromType(parsedType) : () => parsedEmpty;
    }
  }

  let isFn = options.is;
  if (!isFn) {
    isFn = parsedType === 'object'
      ? DEFAULT_OBJECT_COMPARATOR
      : Object.is;
  }

  const diff = 'diff' in options
    ? options.diff
    : ((parsedType === 'object') ? DEFAULT_OBJECT_DIFF : null);

  return {
    ...options,
    type: parsedType,
    is: isFn,
    diff,
    attr,
    reflect,
    readonly: options.readonly ?? false,
    enumerable,
    value: options.value ?? parsedEmpty,
    parser,
    nullParser,
    key: name,
    changedCallback,
    watchers: options.watchers ?? [],
    values: options.values ?? new WeakMap(),
    computedValues: options.computedValues ?? new WeakMap(),
    attributeChangedCallback: options.attributeChangedCallback,
    needsSelfInvalidation: options.needsSelfInvalidation ?? new WeakSet(),
  };
}

const INIT_SYMBOL = Symbol('PROP_INIT');

/** @type {Partial<import('./typings.js').ObserverConfiguration<?,?,?>>} */
const DEFAULT_OBSERVER_CONFIGURATION = {
  nullParser: DEFAULT_NULL_PARSER,
  is: Object.is,
  INIT_SYMBOL,
};

/**
 * @this {import('./typings.js').ObserverConfiguration<?,?,?>}
 * @param {*} value
 */
export function parsePropertyValue(value) {
  let newValue = value;
  newValue = value == null
    ? this.nullParser.call(this, value)
    : this.parser.call(this, newValue);
}

/**
 * @param {(data: Partial<any>) => any} fn
 * @param {any} arg0
 * @param {...any} args
 * @this {any}
 * @return {{props:string[], deepProps:[string, string[]][], defaultValue:any, reusable: boolean}}
 */
export function observeFunction(fn, arg0, ...args) {
  /** @type {Set<string>} */
  const argPoked = new Set();
  /** @type {Set<string>} */
  const argPokedDeep = new Set();
  /** @type {Set<string>} */
  const thisPoked = new Set();
  /** @type {Set<string>} */
  const thisPokedDeep = new Set();

  /**
   * @template {Object} T
   * @param {T} proxyTarget
   * @param {Set<string>} set
   * @param {Set<string>} deepSet
   * @param {string} [prefix]
   * @return {T}
   */
  function buildProxy(proxyTarget, set, deepSet, prefix) {
    return new Proxy(proxyTarget, {
      get(target, p) {
        const value = Reflect.get(target, p);
        if (typeof p !== 'symbol') {
          const arg = prefix ? `${prefix}.${p}` : p;
          if (prefix) {
            deepSet.add(arg);
          } else {
            set.add(arg);
          }
          if (typeof value === 'object' && value != null) {
            console.debug('tried to arg poke object get', p, value);
            return buildProxy(value, set, deepSet, arg);
          }
        }
        return value;
      },
      has(target, p) {
        const value = Reflect.has(target, p);
        if (typeof p !== 'symbol') {
          const arg = prefix ? `${prefix}.p` : p;
          if (prefix) {
            deepSet.add(arg);
          } else {
            set.add(arg);
          }
        }
        return value;
      },
    });
  }

  const argProxy = buildProxy(arg0, argPoked, argPokedDeep);
  const thisProxy = buildProxy(this ?? arg0, thisPoked, thisPokedDeep);
  const defaultValue = fn.call(thisProxy, argProxy, ...args);
  /* Arrow functions can reused if they don't poke `this` */
  const reusable = fn.name ? true : !thisPoked.size;

  return {
    props: [
      ...argPoked,
      ...thisPoked,
    ],
    deepProps: [
      ...argPokedDeep,
      ...thisPokedDeep,
    ].map((deepPropString) => [deepPropString, deepPropString.split('.')]),
    defaultValue,
    reusable,
  };
}

/**
 * @template {ObserverPropertyType} T1
 * @template {any} T2
 * @template {string} K
 * @template [C=any]
 * @param {C} object
 * @param {K} key
 * @param {import('./typings.js').ObserverOptions<T1, T2, C>} options
 * @return {import('./typings.js').ObserverConfiguration<T1,T2,K,C>}
 */
export function defineObservableProperty(object, key, options) {
  /** @type {import('./typings.js').ObserverConfiguration<T1,T2,K,C>} */
  const config = {
    ...DEFAULT_OBSERVER_CONFIGURATION,
    ...parseObserverOptions(key, options, object),
    changedCallback: options.changedCallback,
  };

  /**
   * @param {T2} oldValue
   * @param {T2} value
   * @return {boolean} changed
   */
  function detectChange(oldValue, value) {
    if (oldValue === value) return false;
    if (config.get) {
      // TODO: Custom getter vs parser
    }
    let newValue = value;
    newValue = (value == null)
      ? config.nullParser.call(this, value)
      : config.parser.call(this, newValue);

    let changes = newValue;
    if (oldValue == null) {
      if (newValue == null) return false; // Both nullish
    } else if (newValue != null) {
      if (oldValue === newValue) return false;
      if (config.diff) {
        changes = config.diff.call(this, oldValue, newValue);
        if (changes == null) return false;
      } else if (config.is.call(this, oldValue, newValue)) return false;
    }

    config.values.set(this, newValue);
    // console.log(key, 'value.set', newValue);
    config.propChangedCallback?.call(this, key, oldValue, newValue, changes);
    config.changedCallback?.call(this, oldValue, newValue, changes);
    return true;
  }
  /**
   * @this {C}
   * @return {T2}
   */
  function internalGet() {
    return config.values.has(this) ? config.values.get(this) : config.value;
  }

  /**
   * @this {C}
   * @param {T2} value
   * @return {void}
   */
  function internalSet(value) {
    const oldValue = this[key];
    // console.log(key, 'internalSet', oldValue, '=>', value);
    detectChange.call(this, oldValue, value);
  }

  /** @return {void} */
  function onInvalidate() {
    // Current value is now invalidated. Recompute and check if changed
    const oldValue = config.computedValues.get(this);
    const newValue = this[key];
    // console.debug('observe: onInvalidate called for', key, oldValue, '=>', newValue, this);
    config.needsSelfInvalidation.delete(this);
    detectChange.call(this, oldValue, newValue);
  }

  if (config.get) {
    // Custom `get` uses computed values.
    // Invalidate computed value when dependent `prop` changes
    const { props } = observeFunction(config.get.bind(object), object, internalGet.bind(object));
    config.watchers.push(
      ...[...props].map((prop) => [prop, onInvalidate]),
    );
    // TODO: May be able to cache value if props are present
  }
  /** @type {Partial<PropertyDescriptor>} */
  const descriptor = {
    enumerable: config.enumerable,
    /**
     * @this {C}
     * @return {T2}
     */
    get() {
      if (config.get) {
        const newValue = config.get.call(this, this, internalGet.bind(this));
        // Store computed value internally. Used by onInvalidate to get previous value
        config.computedValues.set(this, newValue);
        return newValue;
      }
      return internalGet.call(this);
    },
    /**
     * @this {C}
     * @param {T2} value
     * @return {void}
     */
    set(value) {
      if (value === INIT_SYMBOL) {
        // console.log(key, 'returning due to INIT');
        return;
      }
      if (config.set) {
        config.needsSelfInvalidation.add(this);
        const oldValue = this[key];
        config.set.call(this, value, internalSet.bind(this));
        const newValue = this[key];
        if (!config.needsSelfInvalidation.has(this)) return;
        config.needsSelfInvalidation.delete(this);
        detectChange.call(this, oldValue, newValue);
      } else {
        internalSet.call(this, value);
      }
    },
  };

  Object.defineProperty(object, key, descriptor);

  return config;
}
