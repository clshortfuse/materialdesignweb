import { attrNameFromPropName } from './dom.js';
import { buildMergePatch, hasMergePatch } from './jsonMergePatch.js';

/** @typedef {import('./typings.js').ObserverPropertyType} ObserverPropertyType */

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
 * @template {Object} T
 * @param {T} proxyTarget
 * @param {Set<string>} set
 * @param {Set<string>} deepSet
 * @param {string} [prefix]
 * @return {T}
 */
function buildProxy(proxyTarget, set, deepSet, prefix) {
  proxyTarget ??= {};
  return new Proxy(proxyTarget, {
    get(target, p) {
      const value = target[p];
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

/**
 * @param {ObserverPropertyType} type
 * @return {any}
 */
function defaultParserFromType(type) {
  switch (type) {
    case 'boolean':
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean#boolean_coercion
       * @param {any} v
       * @return {boolean}
       */
      return (v) => !!v;
    case 'integer':
      // Calls ToNumber(x)
      return Math.round;
    case 'float':
      /**
       * Doesn't support `BigInt` types
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_coercion
       * @param {any} v
       * @return {number}
       */
      return (v) => +v;
    case 'map':
      return Map;
    case 'set':
      return Set;
    case 'object':
    case 'array':
      /**
       * Reflect self
       * @template T
       * @param {T} o
       * @return {T}
       */
      return (o) => o;
    default:
    case 'string':
      /**
       * Doesn't support `Symbol` types
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion
       * @param {any} v
       * @return {string}
       */
      return (v) => `${v}`;
  }
}

/**
 * @param {(data: Partial<any>) => any} fn
 * @param {...any} args
 * @this {any}
 * @return {{
 *  props: {
 *    this: string[],
 *    args: string[][],
 *  },
 *  deepPropStrings: {
 *   this: string[],
 *   args: string[][],
 *  },
 *  deepProps: {
 *   this: string[][],
 *   args: string[][][],
 *  },
 *  defaultValue: any,
 *  reusable: boolean,
 * }}
 */
export function observeFunction(fn, ...args) {
  /** @type {Set<string>} */
  const thisPoked = new Set();
  /** @type {Set<string>} */
  const thisPokedDeep = new Set();

  const argWatchers = args.map((arg) => {
    const poked = new Set();
    const pokedDeep = new Set();
    const proxy = buildProxy(arg, poked, pokedDeep);
    return { poked, pokedDeep, proxy };
  });

  const thisProxy = buildProxy(this ?? {}, thisPoked, thisPokedDeep);
  const defaultValue = fn.apply(thisProxy, argWatchers.map((watcher) => watcher.proxy));
  /* Arrow functions can reused if they don't poke `this` */
  const reusable = fn.name ? true : !thisPoked.size;

  return {
    props: {
      this: [...thisPoked],
      args: argWatchers.map((watcher) => [...watcher.poked]),
    },
    deepPropStrings: {
      this: [...thisPokedDeep],
      args: argWatchers.map((watcher) => [...watcher.pokedDeep]),
    },
    deepProps: {
      this: [...thisPokedDeep].map((deepPropString) => deepPropString.split('.')),
      args: argWatchers.map((watcher) => [...watcher.pokedDeep].map((deepPropString) => deepPropString.split('.'))),
    },
    defaultValue,
    reusable,
  };
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
  const options = (typeof typeOrOptions === 'string')
    ? { type: typeOrOptions }
    : typeOrOptions;

  let {
    watchers, value, readonly,
    empty, type,
    enumerable, reflect, attr,
    nullable, parser, nullParser,
    get,
    is, diff,
    props,
  } = options;

  watchers ??= [];
  readonly ??= false;

  if (empty === undefined) {
    empty = null;
  }

  value ??= empty;

  if (get && !props) {
    // Custom `get` uses computed values.
    // Invalidate computed value when dependent `prop` changes
    const observeResult = observeFunction(get.bind(object), object, () => value);
    value ??= observeResult.defaultValue;
    const uniqueProps = new Set([
      ...observeResult.props.this,
      ...observeResult.props.args[0],
    ]);
    props = uniqueProps;
  }

  /** @type {ObserverPropertyType} */
  if (!type) {
    if (value == null) {
      type = 'string';
    } else {
      const parsed = typeof value;
      type = (parsed === 'number')
        ? (Number.isInteger(value) ? 'integer' : 'number')
        : parsed;
    }
  }

  enumerable ??= name[0] !== '_';
  reflect ??= enumerable ? type !== 'object' : (attr ? 'write' : false);
  attr ??= (reflect ? attrNameFromPropName(name) : null);
  nullable ??= (type === 'boolean') ? false : (empty == null);
  if (!nullable) {
    empty ??= emptyFromType(type);
    value ??= empty;
  }

  // if defined ? value
  // else if boolean ? false
  // else if onNullish ? false
  // else if empty == null
  parser ??= defaultParserFromType(type);
  if (!nullParser) {
    if (nullable) {
      nullParser = () => null;
    } else {
      nullParser = (empty === null)
        ? () => emptyFromType(type)
        : () => empty;
    }
  }

  is ??= (type === 'object')
    ? (a, b) => !hasMergePatch(a, b)
    : ((type === 'array') ? () => false : Object.is);

  if (diff === undefined) {
    diff = ((type === 'object') ? (a, b) => buildMergePatch(a, b, 'reference') : null);
  }

  return {
    ...options,
    type,
    is,
    diff,
    attr,
    reflect,
    readonly,
    enumerable,
    value,
    parser,
    nullParser,
    key: name,
    props,
    watchers,
  };
}

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
 * @param {import('./typings.js').ObserverConfiguration<?,?,?,?>} config
 * @param {any} oldValue
 * @param {any} value
 * @return {boolean} changed
 */
function detectChange(config, oldValue, value) {
  if (config.get) {
    // TODO: Custom getter vs parser
  }

  // Compute real new value after parsing
  const newValue = (value == null)
    ? config.nullParser.call(this, value)
    : config.parser.call(this, value);

  // Default change is the newValue
  let changes = newValue;

  // Null check
  if (oldValue == null) {
    if (newValue == null) {
      // Both nullish
      return false;
    }
  } else if (newValue != null) {
    // Both non-null, compare
    if (config.diff) {
      // Custom change diff
      changes = config.diff.call(this, oldValue, newValue);
      if (changes == null) {
        // No difference
        return false;
      }
    } else if (config.is.call(this, oldValue, newValue)) {
      // Non-equal
      return false;
    }
  }

  // Commit value
  if (config.values) {
    config.values.set(this, newValue);
  } else {
    config.values = new WeakMap([[this, newValue]]);
  }

  // Emit change

  config.propChangedCallback?.call(this, config.key, oldValue, newValue, changes);
  config.changedCallback?.call(this, oldValue, newValue, changes);

  return true;
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
  const config = parseObserverOptions(key, options, object);

  /**
   * @this {C}
   * @return {T2}
   */
  function internalGet() {
    return config.values?.has(this) ? config.values.get(this) : config.value;
  }

  /**
   * @this {C}
   * @param {T2} value
   * @return {void}
   */
  function internalSet(value) {
    const oldValue = this[key];
    // console.log(key, 'internalSet', oldValue, '=>', value);
    detectChange.call(this, config, oldValue, value);
  }

  /** @return {void} */
  function onInvalidate() {
    // Current value is now invalidated. Recompute and check if changed
    // eslint-disable-next-line no-multi-assign

    const oldValue = config.computedValues?.get(this);
    const newValue = this[key];
    // console.debug('observe: onInvalidate called for', key, oldValue, '=>', newValue, this);
    config.needsSelfInvalidation?.delete(this);
    detectChange.call(this, config, oldValue, newValue);
  }

  if (config.props) {
    for (const prop of config.props) {
      config.watchers.push([prop, onInvalidate]);
    }
  }

  /**
   * @this {C}
   * @return {T2}
   */
  function cachedGet() {
    const newValue = config.get.call(this, this, internalGet.bind(this));
    // Store computed value internally. Used by onInvalidate to get previous value
    const computedValues = (config.computedValues ??= new WeakMap());
    computedValues.set(this, newValue);
    return newValue;
  }

  /**
   * @this {C}
   * @param {T2} value
   * @return {void}
   */
  function cachedSet(value) {
    if (config.needsSelfInvalidation) {
      config.needsSelfInvalidation.add(this);
    } else {
      config.needsSelfInvalidation = new WeakSet([this]);
    }
    const oldValue = this[key];
    config.set.call(this, value, internalSet.bind(this));
    const newValue = this[key];
    if (!config.needsSelfInvalidation.has(this)) return;
    config.needsSelfInvalidation.delete(this);
    detectChange.call(this, config, oldValue, newValue);
  }

  /** @type {Partial<PropertyDescriptor>} */
  const descriptor = {
    enumerable: config.enumerable,
    configurable: true,
    get: config.get ? cachedGet : internalGet,
    set: config.set ? cachedSet : internalSet,
  };

  Object.defineProperty(object, key, descriptor);

  return config;
}
