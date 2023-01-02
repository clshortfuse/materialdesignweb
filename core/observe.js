import { attrNameFromPropName } from './dom.js';

/** @typedef {import('./typings.js').ObserverPropertyType} ObserverPropertyType */

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
 * @template {any} [T2=import('./typings.js').ParsedObserverPropertyType<T1>]
 * @param {K} name
 * @param {T1|import('./typings.js').ObserverOptions<T1,T2>} [typeOrOptions='string']
 * @return {import('./typings.js').ObserverConfiguration<T1,T2,K> & import('./typings.js').ObserverOptions<T1,T2>}
 */
export function parseObserverOptions(name, typeOrOptions) {
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
    if (options.value == null) {
      parsedType = 'string';
    } else {
      const parsed = typeof options.value;
      parsedType = (parsed === 'number')
        ? (Number.isInteger(options.value) ? 'integer' : 'number')
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

  return {
    ...options,
    type: parsedType,
    attr,
    reflect,
    readonly: options.readonly ?? false,
    enumerable,
    value: options.value ?? parsedEmpty,
    parser,
    nullParser,
    key: name,
    changedCallback,
  };
}

/** @type {Partial<import('./typings.js').ObserverConfiguration<?,?,?>>} */
const DEFAULT_OBSERVER_CONFIGURATION = {
  nullParser: DEFAULT_NULL_PARSER,
  is: Object.is,
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
 * @param {any} [arg0]
 * @this {any}
 * @return {{props:Set<string>, defaultValue:any, reusable: boolean}}
 */
export function observeFunction(fn, arg0 = {}) {
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
  const defaultValue = fn.call(thisProxy, argProxy);
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
export const defineObservableProperty = (object, key, options) => {
  /** @type {import('./typings.js').ObserverConfiguration<T1,T2,K,C>} */
  const config = {
    values: new Map(),
    ...DEFAULT_OBSERVER_CONFIGURATION,
    ...parseObserverOptions(key, options),
    changedCallback: options.changedCallback,
  };

  /** @type {Partial<PropertyDescriptor>} */
  const descriptor = {
    enumerable: config.enumerable,
  };

  if (options.readonly) {
    if (options.get) {
      descriptor.get = options.get;
    } else {
      descriptor.value = config.value;
    }
  } else {
    if (options.get) {
      descriptor.get = options.get;
    }
    if (options.set) {
      descriptor.set = options.set;
    }

    if (!options.get && !options.set) {
    /**
     * @this {C}
     * @return {T2}
     */
      descriptor.get = function get() {
        // console.log('get', key, this.tagName);
        return !config.values.has(this) ? config.value : config.values.get(this);
      };

      /**
       * @this {C}
       * @param {T2} value
       * @return {void}
       */
      descriptor.set = function set(value) {
        // console.log('set', key, value);
        const oldValue = !config.values.has(this) ? config.value : config.values.get(this);
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
        config.changedCallback.call(this, oldValue, newValue);
      };
    }
  }

  Object.defineProperty(object, key, descriptor);

  return config;
};
