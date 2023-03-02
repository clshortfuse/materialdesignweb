import { hasMergePatch } from '../utils/jsonMergePatch.js';

import { attrNameFromPropName } from './dom.js';

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
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_coercion
 * @param {any} v
 * @return {number}
 */
const DEFAULT_NUMBER_PARSER = (v) => +v;

/**
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

  enumerable ??= name[0] !== '_';
  reflect ??= enumerable ? true : (attr ? 'write' : false);
  attr ??= (reflect ? attrNameFromPropName(name) : null);

  /** @type {ObserverPropertyType} */
  let parsedType = type;
  if (parsedType == null) {
    // Use .value or .get() to parse type
    const value = options.value ?? options.get?.call(object ?? {}, object ?? {});
    if (value == null) {
      parsedType = 'string';
    } else {
      const parsed = typeof value;
      parsedType = (parsed === 'number')
        ? (Number.isInteger(value) ? 'integer' : 'number')
        : parsed;
    }
  }

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

  return {
    ...options,
    type: parsedType,
    is: isFn,
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
    validValues: options.validValues ?? new WeakMap(),
    attributeChangedCallback: options.attributeChangedCallback,
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
 * @param {any} args[]
 * @param {...any} args
 * @this {any}
 * @return {{props:Set<string>, defaultValue:any, reusable: boolean}}
 */
export function observeFunction(fn, arg0, ...args) {
  const argPoked = new Set();
  const thisPoked = new Set();
  // TODO: Use abstract
  const argProxy = new Proxy(arg0, {
    get(target, p) {
      argPoked.add(p);
      const value = Reflect.get(target, p);
      return value;
    },
    has(target, p) {
      argPoked.add(p);
      const value = Reflect.has(target, p);
      return value;
    },
  });
  const thisProxy = new Proxy(this ?? arg0, {
    get(target, p) {
      thisPoked.add(p);
      const value = Reflect.get(target, p);
      return value;
    },
    has(target, p) {
      thisPoked.add(p);
      const value = Reflect.has(target, p);
      return value;
    },
  });
  const defaultValue = fn.call(thisProxy, argProxy, ...args);
  /* Arrow functions can reused if they don't poke `this` */
  const reusable = fn.name ? true : !thisPoked.size;

  const props = new Set([
    ...argPoked,
    ...thisPoked,
  ]);

  return {
    props,
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
   * @param {boolean} [commit=false]
   * @return {boolean} changed
   */
  function detectChange(oldValue, value, commit) {
    if (oldValue === value) return false;
    if (config.get) {
      // TODO: Custom getter vs parser
    }
    let newValue = value;
    newValue = (value == null)
      ? config.nullParser.call(this, value)
      : config.parser.call(this, newValue);

    if (oldValue == null) {
      if (newValue == null) return false; // Both nullish
    } else if (newValue != null && (oldValue === newValue || config.is.call(this, oldValue, newValue))) {
      // Not null and match
      return false;
    }

    // Before changing, store old values of properties that will invalidate;

    // Do no set if transient (getter)

    config.values.set(this, newValue);
    // console.log(key, 'value.set', newValue);
    config.propChangedCallback?.call(this, key, oldValue, newValue);
    config.changedCallback?.call(this, oldValue, newValue);
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
    detectChange.call(this, oldValue, value, true);
  }

  /**
   *
   */
  function onInvalidate() {
    // console.log(key, 'onInvalidate', '???');
    const oldValue = config.validValues.get(this);
    const newValue = this[key];
    // console.log(key, 'onInvalidate', oldValue, '=>', newValue);
    detectChange.call(this, oldValue, newValue);
  }

  if (config.get) {
    const { props } = observeFunction(config.get.bind(object), object, internalGet.bind(object));
    // Set of watchers needed
    // console.log(key, 'invalidates with', props);
    config.watchers.push(
      ...[...props].map((prop) => [prop, onInvalidate]),
    );
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
        // Store value internally. Used by onInvalidate to get previous value
        config.validValues.set(this, newValue);
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
        const oldValue = this[key];
        config.set.call(this, value, internalSet.bind(this));
        const newValue = this[key];
        // Invalidate self
        detectChange.call(this, oldValue, newValue);
      } else {
        internalSet.call(this, value);
      }
    },
  };

  Object.defineProperty(object, key, descriptor);

  return config;
}
