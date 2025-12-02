/* eslint-disable max-classes-per-file */

import Composition from './Composition.js';
import { css } from './css.js';
import { attrNameFromPropName, attrValueFromDataValue } from './dom.js';
import { applyMergePatch } from './jsonMergePatch.js';
import { defineObservableProperty } from './observe.js';
import { addInlineFunction, html } from './template.js';

/** @typedef {import('./observe.js').ObserverPropertyType} ObserverPropertyType */

/**
 * @template {any} T
 * @typedef {{
 * [P in keyof T]:
 *   T[P] extends (...args:any[]) => infer T2 ? T2
 *     : T[P] extends ObserverPropertyType
 *     ? import('./observe.js').ParsedObserverPropertyType<T[P]>
 *     : T[P] extends {type: ObserverPropertyType}
 *     ? import('./observe.js').ParsedObserverPropertyType<T[P]['type']>
 *     : T[P] extends ObserverOptions<null, infer T2>
 *     ? unknown extends T2 ? string : T2
 *     : never
 * }} ParsedProps
 */

/**
 * @template {ObserverPropertyType} T1
 * @template {any} T2
 * @template {Object} [C=any]
 * @typedef {import('./observe.js').ObserverOptions<T1,T2,C>} ObserverOptions
 */

/**
 * @template {{ prototype: unknown; }} T
 * @typedef {T} ClassOf<T>
 */

/**
 * @template {any} [T=any]
 * @template {any[]} [A=any[]]
 * @typedef {abstract new (...args: A) => T} Class
 */

/**
 * @template {any} T1
 * @template {any} [T2=T1]
 * @callback HTMLTemplater
 * @param {TemplateStringsArray} string
 * @param {...(string|DocumentFragment|Element|((this:T1, data:T2) => any))} substitutions
 * @return {DocumentFragment}
 */

/**
 * @template {any} [T1=any]
 * @template {any} [T2=T1]
 * @typedef {Object} CallbackArguments
 * @prop {Composition<T1>} composition
 * @prop {Record<string, HTMLElement>} refs
 * @prop {HTMLTemplater<T1, Partial<T2>>} html
 * @prop {(fn: (this:T1, data: T2) => any) => string} inline
 * @prop {DocumentFragment} template
 * @prop {T1} element
 */

/**
 * @template {any} T1
 * @template {any} [T2=T1]
 * @typedef {{
 * composed?: (this: T1, options: CallbackArguments<T1, T2>) => any,
 * constructed?: (this: T1, options: CallbackArguments<T1, T2>) => any,
 * connected?: (this: T1, options: CallbackArguments<T1, T2>) => any,
 * disconnected?: (this: T1, options: CallbackArguments<T1, T2>) => any,
 * props?: {
 *   [P in keyof T1] : (
 *   this: T1,
 *   oldValue: T1[P],
 *   newValue: T1[P],
 *   changes:any,
 *   element: T1
 *   ) => any
 * },
 * attrs?: {[K in keyof any]: (
 *   this: T1,
 *   oldValue: string,
 *   newValue: string,
 *   element: T1
 *   ) => unknown
 * },
 * } & {
 * [P in keyof T1 & string as `${P}Changed`]?: (
 *   this: T1,
 *   oldValue: T1[P],
 *   newValue: T1[P],
 *   changes:any,
 *   element: T1
 *   ) => any
 * }} CompositionCallback
 */

/**
 * @template {Object} C
 * @typedef {{
 *  [P in string] :
 *    ObserverPropertyType
 *    | ObserverOptions<ObserverPropertyType, unknown, C>
 *    | ((this:C, data:Partial<C>, fn?: () => any) => any)
 * }} IDLParameter
 */

/**
 * @template T
 * @typedef {(T | Array<[keyof T & string, T[keyof T]]>)} ObjectOrObjectEntries
 */

/**
 * @template {abstract new (...args: any) => unknown} T
 * @param {InstanceType<T>} instance
 */
function superOf(instance) {
  const staticContext = instance.constructor;
  const superOfStatic = Object.getPrototypeOf(staticContext);
  return superOfStatic.prototype;
}

/**
 * Clone attribute
 * @param {string} name
 * @param {string} target
 * @return {(oldValue:string, newValue:string, element: CustomElement) => void}
 */
export function cloneAttributeCallback(name, target) {
  return (oldValue, newValue, element) => {
    if (newValue == null) {
      element.refs[target].removeAttribute(name);
    } else {
      element.refs[target].setAttribute(name, newValue);
    }
  };
}

/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
  /** @type {string} */
  static elementName;

  /** @return {Iterable<string>} */
  static get observedAttributes() {
    return this.attrList.keys();
  }

  /** @type {import('./Composition.js').Compositor<?>} */
  compose() {
    // eslint-disable-next-line no-return-assign
    return (this.#composition ??= new Composition());
  }

  /** @type {Composition<?>} */
  static _composition = null;

  /** @type {Map<string, import('./observe.js').ObserverConfiguration<?,?,?>>} */
  static _props = new Map();

  /** @type {Map<string, import('./observe.js').ObserverConfiguration<?,?,?>>} */
  static _attrs = new Map();

  /** @type {Map<string, Array<(this: any, ...args: any[]) => any>>} */
  static _propChangedCallbacks = new Map();

  /** @type {Map<string, Array<(this: any, ...args: any[]) => any>>} */
  static _attributeChangedCallbacks = new Map();

  /** @type {Array<(callback: CallbackArguments) => any>} */
  static _onComposeCallbacks = [];

  /** @type {Array<(callback: CallbackArguments) => any>} */
  static _onConnectedCallbacks = [];

  /** @type {Array<(callback: CallbackArguments) => any>} */
  static _onDisconnectedCallbacks = [];

  /** @type {Array<(callback: CallbackArguments) => any>} */
  static _onConstructedCallbacks = [];

  static interpolatesTemplate = true;

  static supportsElementInternals = 'attachInternals' in HTMLElement.prototype;

  static supportsElementInternalsRole = CustomElement.supportsElementInternals
    && 'role' in ElementInternals.prototype;

  /** @type {boolean} */
  static templatable = null;

  static defined = false;

  static autoRegistration = true;

  /** @type {Map<string, typeof CustomElement>} */
  static registrations = new Map();

  /**
   * Expressions are idempotent functions that are selectively called whenever
   * a render is requested.
   * Expressions are constructed exactly as methods though differ in expected
   * arguments. The first argument should be destructured to ensure each used
   * property is accessed at least once in order to inspect used properties.
   *
   * The Composition API will inspect this function with a proxy for `this` to
   * catalog what observables are used by the expression. This allows the
   * Composition API to build a cache as well as selective invoke the expression
   * only when needed.
   *
   * When used with in element templates, the element itself will be passed as
   * its first argument.
   * ````js
   *    Button
   *      .prop('filled', 'boolean')
   *      .prop('outlined', 'boolean')
   *      .expresssions({
   *        _isFilledOrOutlined({filled, outlined}) {
   *          return (filled || outlined)
   *        },
   *      })
   *      .html`<div custom={_isFilledOrOutlined}></div>`;
   * ````
   *
   * When used with external data source, that data source
   * will be passed to the expression with all properties being `null` at first
   * inspection.
   * ````js
   *    const externalData = {first: 'John', last: 'Doe'};
   *    ContactCard
   *      .expresssions({
   *        _fullName({first, last}) {
   *          return [first, last].filter(Boolean).join(' ');
   *        },
   *      })
   *   myButton.render(externalData);
   * ````
   *
   * Expressions may be support argumentless calls by using default
   * parameters with `this`.
   * ````js
   *    Button
   *      .expresssions({
   *        isFilledOrOutlined({filled, outlined} = this) {
   *          return (filled || outlined)
   *        },
   *      });
   *    myButton.isFilledorOutlined();
   * ````
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  PROPS extends {
   *    [K in keyof any]: K extends `_${any}` ? ((data: INSTANCE, state?: Record<string, any>) => string|boolean|null)
   *      : ((data?: INSTANCE, state?: Record<string, any>) => string|boolean|null)
   *  } & ThisType<INSTANCE>
   *  >(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>):
   *  CLASS & Class<{
   *    [K in keyof PROPS]: K extends `_${any}` ? never : () =>  ReturnType<PROPS[K]> }
   *    ,ARGS>
   * }}
   */
  static expressions = /** @type {any} */ (this.set);

  static methods = this.set;

  /**
   * @type {{
   * <
   * CLASS extends typeof CustomElement,
   * ARGS extends ConstructorParameters<CLASS>,
   * INSTANCE extends InstanceType<CLASS>,
   * PROPS extends Partial<INSTANCE>>
   * (this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>)
   * : CLASS & Class<PROPS,ARGS>
   * }}
   */
  static overrides = /** @type {any} */ (this.set);

  /**
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  KEY extends string,
   *  OPTIONS extends ObserverPropertyType
   *    | ObserverOptions<ObserverPropertyType, unknown, INSTANCE>
   *    | ((this:INSTANCE, data:Partial<INSTANCE>, fn?: () => any) => any),
   *  VALUE extends Record<KEY, OPTIONS extends (...args2:any[]) => infer R ? R
   *      : OPTIONS extends ObserverPropertyType ? import('./observe.js').ParsedObserverPropertyType<OPTIONS>
   *      : OPTIONS extends {type: 'object'} & ObserverOptions<any, infer R> ? (unknown extends R ? object : R)
   *      : OPTIONS extends {type: ObserverPropertyType} ? import('./observe.js').ParsedObserverPropertyType<OPTIONS['type']>
   *      : OPTIONS extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R)
   *      : never
   *      >
   *  > (this: CLASS, name: KEY, options: OPTIONS)
   *    : CLASS & Class<VALUE,ARGS>;
   * }}
   */
  static props = /** @type {any} */ (this.observe);

  static idl = this.prop;

  /**
   * @this T
   * @template {typeof CustomElement} T
   * @template {keyof T} K
   * @param {K} collection
   * @param {Function} callback
   */
  static _addCallback(collection, callback) {
    if (!this.hasOwnProperty(collection)) {
      // @ts-expect-error not typed
      this[collection] = [...this[collection], callback];
      return;
    }
    // @ts-expect-error any
    this[collection].push(callback);
  }

  /**
   * Append parts to composition
   * @type {{
   * <
   *  T extends typeof CustomElement,
   *  >
   *  (this: T, ...parts: ConstructorParameters<typeof Composition<InstanceType<T>>>): T;
   * }}
   */
  static append(...parts) {
    this._onComposeCallbacks.push(({ composition }) => {
      composition.append(...parts);
    });

    this._addCallback('_onComposeCallbacks', /** @type {(opts: CallbackArguments) => unknown} */ ((opts) => {
      const { composition } = opts;
      composition.append(...parts);
    }));
    return this;
  }

  /**
   * After composition, invokes callback.
   * May be called multiple times.
   * @type {{
   * <
   *  T1 extends (typeof CustomElement),
   *  T2 extends InstanceType<T1>,
   *  T3 extends CompositionCallback<T2, T2>['composed'],
   *  >
   *  (this: T1, callback: T3): T1
   * }}
   */
  static recompose(callback) {
    this._addCallback('_onComposeCallbacks', callback);
    return this;
  }

  /**
   * Appends styles to composition
   * @type {{
   * <
   *   T1 extends (typeof CustomElement),
   *   T2 extends TemplateStringsArray|HTMLStyleElement|CSSStyleSheet|string>(
   *   this: T1,
   *   array: T2,
   *   ...rest: T2 extends string ? any : T2 extends TemplateStringsArray ? any[] : (HTMLStyleElement|CSSStyleSheet)[]
   * ): T1
   * }}
   */
  static css(array, ...substitutions) {
    this._addCallback('_onComposeCallbacks', /** @type {(opts: CallbackArguments) => unknown} */ ((opts) => {
      const { composition } = opts;
      if (typeof array === 'string' || Array.isArray(array)) {
        // @ts-expect-error Complex cast
        composition.append(css(array, ...substitutions));
      } else {
        // @ts-expect-error Complex cast
        composition.append(array, ...substitutions);
      }
    }));

    return this;
  }

  /**
   * Registers class asynchronously at end of current event loop cycle
   * via `queueMicrotask`. If class is registered before then,
   * does nothing.
   * @type {{
   * <T extends typeof CustomElement>(this: T, elementName: string): T;
   * }}
   */
  static autoRegister(elementName) {
    if (this.hasOwnProperty('defined') && this.defined) {
      console.warn(this.elementName, 'already registered.');
      return this;
    }
    this.register(elementName);
    return this;
  }

  /**
   * Appends DocumentFragment to composition
   * @type {{
   * <T extends typeof CustomElement>(
   *  this: T,
   *  string: TemplateStringsArray,
   *  ...substitutions: (string|Element|((this:InstanceType<T>, data:InstanceType<T>, injections?:any) => any))[]
   *  ): T
   * }}
   */
  static html(strings, ...substitutions) {
    this._addCallback('_onComposeCallbacks', /** @type {(opts: CallbackArguments) => unknown} */ ((opts) => {
      const { composition } = opts;
      // console.log('onComposed:html', strings);
      composition.append(html(strings, ...substitutions));
    }));
    return this;
  }

  /**
   * Extends base class into a new class.
   * Use to avoid mutating base class.
   * @type {{
   * <T1 extends typeof CustomElement, T2 extends T1, T3 extends (Base:T1) => T2>
   * (this: T1,customExtender?: T3|null): T3 extends null ? T1 : T2;
   * }}
   */
  static extend(customExtender) {
    // @ts-expect-error Can't cast T
    return customExtender ? customExtender(this) : class extends this {};
  }

  /**
   * Assigns static values to class
   * @type {{
   * <
   *  T1 extends typeof CustomElement,
   *  T2 extends {
   *    [K in keyof any]: (
   *      ((this:T1, ...args:any[]) => any)
   *      |string|number|boolean|any[]|object)}
   *  >
   *  (this: T1, source: T2 & ThisType<T1 & T2>):T1 & T2;
   * }}
   */
  static setStatic(source) {
    Object.assign(this, source);
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Assigns values directly to all instances (via prototype)
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  PROPS extends object>
   *  (this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>)
   *  : CLASS & Class<PROPS,ARGS>
   * }}
   */
  static readonly(source, options) {
    return this.set(source, { ...options, writable: false });
  }

  /**
   * Assigns values directly to all instances (via prototype)
   * @type {{
   * <
   * CLASS extends typeof CustomElement,
   * ARGS extends ConstructorParameters<CLASS>,
   * INSTANCE extends InstanceType<CLASS>,
   * PROPS extends object>
   * (this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>)
   * : CLASS & Class<PROPS,ARGS>
   * }}
   */
  static set(source, options) {
    Object.defineProperties(
      this.prototype,
      Object.fromEntries([
        ...Object.entries(source).map(([name, value]) => {
          // Tap into .map() to avoid double iteration
          // Property may be redefined observable
          this.undefine(name);
          return [
            name,
            {
              enumerable: name[0] !== '_',
              configurable: true,
              value,
              writable: true,
              ...options,
            },
          ];
        }),
        ...Object.getOwnPropertySymbols(source).map((symbol) => [
          symbol,
          {
            enumerable: false,
            configurable: true,
            // @ts-expect-error Can't index by symbol
            value: source[symbol],
            writable: true,
            ...options,
          },
        ]),
      ]),
    );
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Returns result of calling mixin with current class
   * @type {{
   * <
   *  BASE extends typeof CustomElement,
   *  FN extends (...args:any[]) => any,
   *  RETURN extends ReturnType<FN>,
   *  SUBCLASS extends ClassOf<RETURN>,
   *  >(this: BASE, mixin: FN): SUBCLASS & BASE
   * }}
   */
  static mixin(mixin) {
    return mixin(this);
  }

  /**
   * Registers class with window.customElements synchronously
   * @type {{
   * <T extends typeof CustomElement>(this: T, elementName?: string, force?: boolean): T;
   * }}
   */
  static register(elementName) {
    if (elementName) {
      this.elementName = elementName;
    }

    customElements.define(this.elementName, this);
    CustomElement.registrations.set(this.elementName, this);
    this.defined = true;
    return this;
  }

  static get propList() {
    if (!this.hasOwnProperty('_props')) {
      this._props = new Map(this._props);
    }
    return this._props;
  }

  static get attrList() {
    if (!this.hasOwnProperty('_attrs')) {
      this._attrs = new Map(this._attrs);
    }
    return this._attrs;
  }

  static get propChangedCallbacks() {
    if (!this.hasOwnProperty('_propChangedCallbacks')) {
      // structuredClone()
      this._propChangedCallbacks = new Map(
        [
          ...this._propChangedCallbacks,
        ].map(([name, array]) => [name, array.slice()]),
      );
    }
    return this._propChangedCallbacks;
  }

  static get attributeChangedCallbacks() {
    if (!this.hasOwnProperty('_attributeChangedCallbacks')) {
      this._attributeChangedCallbacks = new Map(
        [
          ...this._attributeChangedCallbacks,
        ].map(([name, array]) => [name, array.slice()]),
      );
    }
    return this._attributeChangedCallbacks;
  }

  /**
   * Creates observable property on instances (via prototype)
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  KEY extends string,
   *  OPTIONS extends ObserverPropertyType
   *    | ObserverOptions<ObserverPropertyType, unknown, INSTANCE>
   *    | ((this:INSTANCE, data:Partial<INSTANCE>, fn?: () => any) => any),
   *  VALUE extends Record<KEY, OPTIONS extends (...args2:any[]) => infer R ? R
   *      : OPTIONS extends ObserverPropertyType ? import('./observe').ParsedObserverPropertyType<OPTIONS>
   *      : OPTIONS extends {type: 'object'} & ObserverOptions<any, infer R> ? (unknown extends R ? object : R)
   *      : OPTIONS extends {type: ObserverPropertyType} ? import('./observe').ParsedObserverPropertyType<OPTIONS['type']>
   *      : OPTIONS extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R)
   *      : never
   *      >
   *  > (this: CLASS, name: KEY, options: OPTIONS)
   *    : CLASS & Class<VALUE,ARGS>
   * }}
   */
  static prop(name, typeOrOptions) {
    // TODO: Cache and save configuration for reuse (mixins)
    const config = defineObservableProperty(
      /** @type {any} */ (this.prototype),
      name,
      /** @type {any} */ (typeOrOptions),
    );

    const { changedCallback, attr, reflect, watchers } = config;
    if (changedCallback) {
      watchers.push([name, changedCallback]);
    }
    // TODO: Inspect possible closure bloat
    config.changedCallback = function wrappedChangedCallback(oldValue, newValue, changes) {
      this._onObserverPropertyChanged.call(this, name, oldValue, newValue, changes);
    };

    this.propList.set(name, config);

    if (attr
        && (reflect === true || reflect === 'read')
        && (config.enumerable || !this.attrList.has(attr) || !this.attrList.get(attr).enumerable)) {
      this.attrList.set(attr, config);
    }

    this.onPropChanged(watchers);

    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Define properties on instances via Object.defineProperties().
   * Automatically sets property non-enumerable if name begins with `_`.
   * Functions will be remapped as getters
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  PROPS extends {
   *      [P in keyof any] :
   *        {
   *          enumerable?: boolean;
   *          configurable?: boolean;
   *          writable?: boolean;
   *          value?: any;
   *          get?: ((this: INSTANCE) => any);
   *          set?: (this: INSTANCE, value: any) => void;
   *        } | ((this: INSTANCE, ...args:any[]) => any)
   *    },
   *  VALUE extends {
   *    [KEY in keyof PROPS]: PROPS[KEY] extends (...args2:any[]) => infer R ? R
   *      : PROPS[KEY] extends TypedPropertyDescriptor<infer R> ? R : never
   *  }>
   *  (this: CLASS, props: PROPS & ThisType<PROPS & INSTANCE>): CLASS
   *    & Class<VALUE,ARGS>
   * }}
   */
  static define(props) {
    Object.defineProperties(
      this.prototype,
      Object.fromEntries(
        Object.entries(props).map(([name, options]) => {
          // Tap into .map() to avoid double iteration
          // Property may be redefined observable
          this.undefine(name);
          return [
            name,
            {
              enumerable: name[0] !== '_',
              configurable: true,
              ...(
                typeof options === 'function'
                  ? { get: options }
                  : options
              ),
            },
          ];
        }),
      ),
    );

    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Assigns values directly to all instances (via prototype)
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  PROP extends string,
   *  PROPS extends INSTANCE & Record<PROP, never>
   *  >(this: CLASS, name: PROP):
   *  CLASS & Class<PROPS,ARGS>
   * }}
   */
  static undefine(name) {
    Reflect.deleteProperty(this.prototype, name);
    if (this.propList.has(name)) {
      const { watchers, attr, reflect } = this.propList.get(name);
      if (watchers.length && this.propChangedCallbacks.has(name)) {
        const propWatchers = this.propChangedCallbacks.get(name);
        for (const [prop, watcher] of watchers) {
          const index = propWatchers.indexOf(watcher);
          if (index !== -1) {
            console.warn('Unwatching', name);
            propWatchers.splice(index, 1);
          }
        }
      }
      if (attr && (reflect === true || reflect === 'read')) {
        this.attrList.delete(attr);
      }
      this.propList.delete(name);
    }

    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Creates observable properties on instances
   * @type {{
   * <
   *  CLASS extends typeof CustomElement,
   *  ARGS extends ConstructorParameters<CLASS>,
   *  INSTANCE extends InstanceType<CLASS>,
   *  PROPS extends IDLParameter<INSTANCE & VALUE>,
   *  VALUE extends {
   *    [KEY in keyof PROPS]:
   *    PROPS[KEY] extends (...args2:any[]) => infer R ? R
   *        : PROPS[KEY] extends ObserverPropertyType ? import('./observe').ParsedObserverPropertyType<PROPS[KEY]>
   *        : PROPS[KEY] extends {type: 'object'} & ObserverOptions<any, infer R> ? (unknown extends R ? object : R)
   *        : PROPS[KEY] extends {type: ObserverPropertyType} ? import('./observe').ParsedObserverPropertyType<PROPS[KEY]['type']>
   *        : PROPS[KEY] extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R)
   *        : never
   *  },
   *  > (this: CLASS, props: PROPS)
   *    : CLASS & Class<VALUE,ARGS>
   * }}
   */
  static observe(props) {
    for (const [name, typeOrOptions] of Object.entries(props ?? {})) {
      /** @type {any} */
      const options = (typeof typeOrOptions === 'function')
        ? { reflect: false, get: typeOrOptions }
        : typeOrOptions;

      this.prop(name, options);
    }
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * @type {{
   * <
   *  T1 extends typeof CustomElement,
   *  T2 extends IDLParameter<T1>>
   *  (this: T1, props: T2):T1 & ParsedProps<T2>
   * }}
   */
  static defineStatic(props) {
    for (const [name, typeOrOptions] of Object.entries(props ?? {})) {
      const options = (typeof typeOrOptions === 'function')
        ? { get: typeOrOptions }
        : (typeof typeOrOptions === 'string'
          ? { type: typeOrOptions }
          : typeOrOptions);
      // @ts-expect-error Adding property to this
      defineObservableProperty(this, name, {
        reflect: false,
        ...options,
      });
    }
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * @type {{
   * <T extends typeof CustomElement>
   *  (
   *    this: T,
   *    listeners?: import('./Composition').CompositionEventListenerObject<InstanceType<T>>,
   *    options?: Partial<import('./Composition').CompositionEventListener<InstanceType<T>>>,
   *  ): T;
   * }}
   */
  static events(listeners, options) {
    this.on({
      composed({ composition }) {
        for (const [key, listenerOptions] of Object.entries(listeners)) {
          const [, flags, type] = key.match(/^([*1~]+)?(.*)$/);
          // TODO: Make abstract
          let prop;
          /** @type {string[]} */
          let deepProp = [];
          if (typeof listenerOptions === 'string') {
            const parsedProps = listenerOptions.split('.');
            if (parsedProps.length === 1) {
              prop = listenerOptions;
              deepProp = [];
            } else {
              prop = parsedProps[0];
              deepProp = parsedProps;
            }
          }
          composition.addCompositionEventListener({
            type,
            once: flags?.includes('1'),
            passive: flags?.includes('~'),
            capture: flags?.includes('*'),
            ...(
              typeof listenerOptions === 'function'
                ? { handleEvent: listenerOptions }
                : (typeof listenerOptions === 'string'
                  ? { prop, deepProp }
                  : listenerOptions)
            ),
            ...(
              options
            )
            ,
          });
        }
      },
    });

    return this;
  }

  /**
   * @type {{
   * <T extends typeof CustomElement>
   *  (
   *    this: T,
   *    listenerMap: {
   *      [P in keyof any]: import('./Composition').CompositionEventListenerObject<InstanceType<T>>
   *    },
   *    options?: Partial<import('./Composition').CompositionEventListener<InstanceType<T>>>,
   *  ): T;
   * }}
   */
  static childEvents(listenerMap, options) {
    for (const [tag, listeners] of Object.entries(listenerMap)) {
      this.events(listeners, {
        tag: attrNameFromPropName(tag),
        ...options,
      });
    }

    return this;
  }

  /** @type {typeof CustomElement['events']} */
  static rootEvents(listeners, options) {
    return this.events(listeners, {
      tag: Composition.shadowRootTag,
      ...options,
    });
  }

  /**
   * @type {{
   * <
   *  T1 extends typeof CustomElement,
   *  T2 extends InstanceType<T1>,
   *  T3 extends CompositionCallback<T2, T2>,
   *  T4 extends keyof T3,
   *  >
   *  (this: T1, name: T3|T4, callbacks?: T3[T4] & ThisType<T2>): T1
   * }}
   */
  static on(nameOrCallbacks, callback) {
    const callbacks = typeof nameOrCallbacks === 'string'
      ? { [nameOrCallbacks]: callback }
      : nameOrCallbacks;
    for (const [name, fn] of Object.entries(callbacks)) {
      /** @type {keyof (typeof CustomElement)} */
      let arrayPropName;
      switch (name) {
        case 'composed': arrayPropName = '_onComposeCallbacks'; break;
        case 'constructed': arrayPropName = '_onConstructedCallbacks'; break;
        case 'connected': arrayPropName = '_onConnectedCallbacks'; break;
        case 'disconnected': arrayPropName = '_onDisconnectedCallbacks'; break;
        case 'props':
          this.onPropChanged(fn);
          continue;
        case 'attrs':
          this.onAttributeChanged(fn);
          continue;
        default:
          if (name.endsWith('Changed')) {
            const prop = name.slice(0, name.length - 'Changed'.length);
            // @ts-expect-error Computed key
            this.onPropChanged({ [prop]: fn });
            continue;
          }
          throw new Error('Invalid callback name');
      }
      this._addCallback(arrayPropName, fn);
    }

    return this;
  }

  /**
   * @type {{
   * <
   *  T1 extends typeof CustomElement,
   *  T2 extends InstanceType<T1>
   *  >
   *  (
   *    this: T1,
   *    options: ObjectOrObjectEntries<{
   *      [P in keyof T2]? : (
   *      this: T2,
   *      oldValue: T2[P],
   *      newValue: T2[P],
   *      changes:any,
   *      element: T2
   *      ) => void
   *    }>,
   *  ): T1;
   * }}
   */
  static onPropChanged(options) {
    const entries = Array.isArray(options) ? options : Object.entries(options);
    const { propChangedCallbacks } = this;
    for (const [prop, callback] of entries) {
      if (propChangedCallbacks.has(prop)) {
        propChangedCallbacks.get(prop).push(callback);
      } else {
        propChangedCallbacks.set(prop, [callback]);
      }
    }

    return this;
  }

  /**
   * @type {{
   * <
   *  T1 extends typeof CustomElement,
   *  T2 extends InstanceType<T1>
   *  >
   *  (
   *    this: T1,
   *    options: {
   *      [x:string]: (
   *      this: T2,
   *      oldValue: string,
   *      newValue: string,
   *      element: T2
   *      ) => void
   *    },
   *  ): T1;
   * }}
   */
  static onAttributeChanged(options) {
    const entries = Array.isArray(options) ? options : Object.entries(options);
    const { attributeChangedCallbacks } = this;
    for (const [name, callback] of entries) {
      if (attributeChangedCallbacks.has(name)) {
        attributeChangedCallbacks.get(name).push(callback);
      } else {
        attributeChangedCallbacks.set(name, [callback]);
      }
    }

    return this;
  }

  /** @type {Record<string, HTMLElement>}} */
  #refsProxy;

  /** @type {Map<string, WeakRef<HTMLElement>>}} */
  #refsCache = new Map();

  /** @type {Map<string, WeakRef<HTMLElement>>}} */
  #refsCompositionCache = new Map();

  /** @type {Composition<?>} */
  #composition;

  /** @type {Map<string,{stringValue:string, parsedValue:any}>} */
  _propAttributeCache;

  /** @type {CallbackArguments} */
  _callbackArguments = null;

  /** @param {any[]} args */
  constructor(...args) {
    super();

    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }

    this.attachShadow({ mode: 'open', delegatesFocus: this.delegatesFocus });

    /**
     * Updates nodes based on data
     * Expects data in JSON Merge Patch format
     * @see https://www.rfc-editor.org/rfc/rfc7386
     * @param {Partial<?>} changes
     * @param {any} data
     * @return {void}
     */
    this.render = this.composition.render(
      this.constructor.prototype,
      this,
      {
        defaults: this.constructor.prototype,
        store: this,
        shadowRoot: this.shadowRoot,
        context: this,
      },
    );

    for (const callback of this.static._onConstructedCallbacks) {
      callback.call(this, this.callbackArguments);
    }
  }

  /**
   * @type {{
   * <
   *   T extends CustomElement,
   *   K extends string = string,
   * >(this:T,
   *     name: K,
   *     oldValue: K extends keyof T ? T[K] : unknown,
   *     newValue: K extends keyof T ? T[K] : unknown,
   *     changes?: K extends keyof T ? T[K] extends object ? Partial<T[K]> : T[K] : unknown): void;
   * }}
   */
  propChangedCallback(name, oldValue, newValue, changes = newValue) {
    if (!this.patching) {
      this.render.byProp(name, changes, this);
      // this.render({ [name]: changes });
    }

    const { _propChangedCallbacks } = this.static;
    if (_propChangedCallbacks.has(name)) {
      for (const callback of _propChangedCallbacks.get(name)) {
        callback.call(this, oldValue, newValue, changes, this);
      }
    }
  }

  /**
   * @param {string} name
   * @param {string|null} oldValue
   * @param {string|null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const { attributeChangedCallbacks } = this.static;
    if (attributeChangedCallbacks.has(name)) {
      for (const callback of attributeChangedCallbacks.get(name)) {
        callback.call(this, oldValue, newValue, this);
      }
    }

    // Array.find
    const { attrList } = this.static;
    if (!attrList.has(name)) return;

    const config = attrList.get(name);

    if (config.attributeChangedCallback) {
      config.attributeChangedCallback.call(this, name, oldValue, newValue);
      return;
    }

    let cacheEntry;
    if (this.attributeCache.has(name)) {
      cacheEntry = this.attributeCache.get(name);
      if (cacheEntry.stringValue === newValue) return;
    }

    // @ts-expect-error any
    const previousDataValue = this[config.key];
    const parsedValue = newValue === null
      ? config.nullParser(/** @type {null} */ (newValue))
    // Avoid Boolean('') === false
      : (config.type === 'boolean' ? true : config.parser(newValue));

    if (parsedValue === previousDataValue) {
      // No internal value change
      return;
    }
    // "Remember" that this attrValue equates to this data value
    // Avoids rewriting attribute later on data change event
    if (cacheEntry) {
      cacheEntry.stringValue = newValue;
      cacheEntry.parsedValue = parsedValue;
    } else {
      this.attributeCache.set(name, {
        stringValue: newValue, parsedValue,
      });
    }
    // @ts-expect-error any
    this[config.key] = parsedValue;
  }

  get #template() {
    return this.#composition?.template;
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   * @param {any} changes
   */
  _onObserverPropertyChanged(name, oldValue, newValue, changes) {
    const { propList } = this.static;
    if (propList.has(name)) {
      const { reflect, attr } = propList.get(name);
      if (attr && (reflect === true || reflect === 'write')) {
        /** @type {{stringValue:string, parsedValue:any}} */
        let cacheEntry;
        let needsWrite = false;
        const { attributeCache } = this;
        if (attributeCache.has(attr)) {
          cacheEntry = attributeCache.get(attr);
          needsWrite = (cacheEntry.parsedValue !== newValue);
        } else {
        // @ts-ignore skip cast
          cacheEntry = {};
          attributeCache.set(attr, cacheEntry);
          needsWrite = true;
        }
        if (needsWrite) {
          const stringValue = attrValueFromDataValue(newValue);
          cacheEntry.parsedValue = newValue;
          cacheEntry.stringValue = stringValue;
          // Cache attrValue to ignore attributeChangedCallback later
          if (stringValue == null) {
            this.removeAttribute(attr);
          } else {
            this.setAttribute(attr, stringValue);
          }
        }
      }
    }

    // Invoke change => render
    this.propChangedCallback(name, oldValue, newValue, changes);
  }

  /** @param {any} patch */
  patch(patch) {
    this.patching = true;
    applyMergePatch(this, patch);
    this.render(patch);
    this.patching = false;
  }

  /**
   * Proxy object that returns shadow DOM elements by tag.
   * If called before interpolation (eg: on composed), returns from template
   * @return {Record<string,HTMLElement>}
   */
  get refs() {
    // eslint-disable-next-line no-return-assign
    return (this.#refsProxy ??= new Proxy({}, {
      /**
       * @param {any} target
       * @param {string} tag
       * @return {Element}
       */
      get: (target, tag) => {
        if (!this.#composition) {
          console.warn(this.static.name, 'Attempted to access references before composing!');
        }
        const composition = this.composition;
        let element;
        if (!composition.interpolated) {
          if (this.#refsCompositionCache.has(tag)) {
            element = this.#refsCompositionCache.get(tag).deref();
            if (element) return element;
          }
          const formattedTag = attrNameFromPropName(tag);
          // console.warn(this.tagName, 'Returning template reference');
          element = composition.template.getElementById(formattedTag);
          if (!element) return null;
          this.#refsCompositionCache.set(tag, new WeakRef(element));
          return element;
        }
        if (this.#refsCache.has(tag)) {
          element = this.#refsCache.get(tag).deref();
          if (element) {
            return element;
          }
        }

        const formattedTag = attrNameFromPropName(tag);
        const tagIndex = this.composition.tags.indexOf(formattedTag);
        element = this.render.state.refs[tagIndex];

        if (!element) return null;
        this.#refsCache.set(tag, new WeakRef(element));
        return element;
      },
    }));
  }

  get attributeCache() {
    // eslint-disable-next-line no-return-assign
    return (this._propAttributeCache ??= new Map());
  }

  get static() { return /** @type {typeof CustomElement} */ (/** @type {unknown} */ (this.constructor)); }

  get unique() { return false; }

  /**
   * @template {CustomElement} T
   * @this {T}
   */
  get callbackArguments() {
    // eslint-disable-next-line no-return-assign
    return this._callbackArguments ??= {
      composition: this.#composition,
      refs: this.refs,
      html: html.bind(this),
      inline: addInlineFunction,
      template: this.#template,
      element: this,
    };
  }

  /** @return {Composition<?>} */
  get composition() {
    if (this.#composition) return this.#composition;

    if (!this.unique && this.static.hasOwnProperty('_composition')) {
      this.#composition = this.static._composition;
      return this.static._composition;
    }

    // TODO: Use Composition to track uniqueness
    // console.log('composing', this.static.elementName);
    this.compose();
    for (const callback of this.static._onComposeCallbacks) {
      // console.log(this.static.elementName, 'composition callback');
      callback.call(this, this.callbackArguments);
    }

    if (!this.unique) {
      // Cache compilation into static property
      this.static._composition = this.#composition;
    }

    return this.#composition;
  }

  connectedCallback() {
    for (const callbacks of this.static._onConnectedCallbacks) {
      callbacks.call(this, this.callbackArguments);
    }
  }

  disconnectedCallback() {
    for (const callbacks of this.static._onDisconnectedCallbacks) {
      callbacks.call(this, this.callbackArguments);
    }
  }
}

CustomElement.prototype.delegatesFocus = false;
