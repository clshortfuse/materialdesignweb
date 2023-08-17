/* eslint-disable max-classes-per-file */

import Composition from './Composition.js';
import { ICustomElement } from './ICustomElement.js';
import { css } from './css.js';
import { attrNameFromPropName, attrValueFromDataValue } from './dom.js';
import { applyMergePatch } from './jsonMergePatch.js';
import { defineObservableProperty } from './observe.js';
import { addInlineFunction, html } from './template.js';

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
export default class CustomElement extends ICustomElement {
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

  /** @type {Map<string, import('./typings.js').ObserverConfiguration<?,?,?>>} */
  static _props = new Map();

  /** @type {Map<string, import('./typings.js').ObserverConfiguration<?,?,?>>} */
  static _attrs = new Map();

  /** @type {Map<string, Function[]>} */
  static _propChangedCallbacks = new Map();

  /** @type {Map<string, Function[]>} */
  static _attributeChangedCallbacks = new Map();

  /** @type {typeof ICustomElement._onComposeCallbacks} */
  static _onComposeCallbacks = [];

  /** @type {typeof ICustomElement._onConnectedCallbacks} */
  static _onConnectedCallbacks = [];

  /** @type {typeof ICustomElement._onDisconnectedCallbacks} */
  static _onDisconnectedCallbacks = [];

  /** @type {typeof ICustomElement._onConstructedCallbacks} */
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
   * @type {typeof ICustomElement.expressions}
   */
  static expressions = this.set;

  /** @type {typeof ICustomElement.methods} */
  static methods = this.set;

  /** @type {typeof ICustomElement.overrides} */
  static overrides = this.set;

  /** @type {typeof ICustomElement.props} */
  static props = this.observe;

  static idl = this.prop;

  /**
   * @template {typeof CustomElement} T
   * @this T
   * @template {keyof T} K
   * @param {K} collection
   * @param {T[K] extends (infer R)[] ? R : never} callback
   */
  static _addCallback(collection, callback) {
    if (!this.hasOwnProperty(collection)) {
      this[collection] = [
        ...this[collection],
        callback,
      ];
      return;
    }
    this[collection].push(callback);
  }

  /**
   * Append parts to composition
   * @type {typeof ICustomElement.append}
   */
  static append(...parts) {
    this._addCallback('_onComposeCallbacks', ({ composition }) => {
      composition.append(...parts);
    });
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * After composition, invokes callback.
   * May be called multiple times.
   * @type {typeof ICustomElement.recompose}
   */
  static recompose(callback) {
    this._addCallback('_onComposeCallbacks', callback);
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Appends styles to composition
   * @type {typeof ICustomElement.css}
   */
  static css(array, ...substitutions) {
    this._addCallback('_onComposeCallbacks', ({ composition }) => {
      if (typeof array === 'string' || Array.isArray(array)) {
        // @ts-expect-error Complex cast
        composition.append(css(array, ...substitutions));
      } else {
        // @ts-expect-error Complex cast
        composition.append(array, ...substitutions);
      }
    });

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement['setSchema']} */
  static setSchema(schema) {
    this.schema = schema;
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Registers class asynchronously at end of current event loop cycle
   * via `queueMicrotask`. If class is registered before then,
   * does nothing.
   * @type {typeof ICustomElement['autoRegister']}
   */
  static autoRegister(elementName) {
    if (this.hasOwnProperty('defined') && this.defined) {
      console.warn(this.elementName, 'already registered.');
      // @ts-expect-error Can't cast T
      return this;
    }
    this.register(elementName);
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Appends DocumentFragment to composition
   * @type {typeof ICustomElement.html}
   */
  static html(strings, ...substitutions) {
    this._addCallback('_onComposeCallbacks', ({ composition }) => {
      // console.log('onComposed:html', strings);
      composition.append(html(strings, ...substitutions));
    });
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Extends base class into a new class.
   * Use to avoid mutating base class.
   * @type {typeof ICustomElement.extend}
   */
  static extend(customExtender) {
    // @ts-expect-error Can't cast T
    return customExtender ? customExtender(this) : class extends this {};
  }

  /**
   * Assigns static values to class
   * @type {typeof ICustomElement.setStatic}
   */
  static setStatic(source) {
    Object.assign(this, source);
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Assigns values directly to all instances (via prototype)
   * @type {typeof ICustomElement.set}
   */
  static readonly(source, options) {
    // @ts-expect-error Can't cast T
    return this.set(source, { ...options, writable: false });
  }

  /**
   * Assigns values directly to all instances (via prototype)
   * @type {typeof ICustomElement.set}
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
   * @type {typeof ICustomElement.mixin}
   */
  static mixin(mixin) {
    return mixin(this);
  }

  /**
   * Registers class with window.customElements synchronously
   * @type {typeof ICustomElement['register']}
   */
  static register(elementName) {
    if (elementName) {
      this.elementName = elementName;
    }

    customElements.define(this.elementName, this);
    CustomElement.registrations.set(this.elementName, this);
    this.defined = true;
    // @ts-expect-error Can't cast T
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
   * @type {typeof ICustomElement.prop}
   */
  static prop(name, typeOrOptions) {
    // TODO: Cache and save configuration for reuse (mixins)
    const config = defineObservableProperty(this.prototype, name, typeOrOptions);

    const { changedCallback, attr, reflect, watchers } = config;
    if (changedCallback) {
      watchers.push([name, changedCallback]);
    }
    // TODO: Inspect possible closure bloat
    config.changedCallback = function wrappedChangedCallback(oldValue, newValue, changes) {
      this._onObserverPropertyChanged.call(this, name, oldValue, newValue, changes);
    };

    this.propList.set(name, config);

    if (attr && (reflect === true || reflect === 'read')) {
      this.attrList.set(attr, config);
    }

    this.onPropChanged(watchers);

    return this;
  }

  /**
   * Define properties on instances via Object.defineProperties().
   * Automatically sets property non-enumerable if name begins with `_`.
   * Functions will be remapped as getters
   * @type {typeof ICustomElement.define}
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

  static undefine(name) {
    Reflect.deleteProperty(this.prototype, name);
    if (!this.propList.has(name)) return this;
    const { watchers, attr, reflect } = this.propList.get(name);
    if (watchers.length && this.propChangedCallbacks.has(name)) {
      const propWatchers = this.propChangedCallbacks.get(name);
      for (const watcher of watchers) {
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

    return this;
  }

  /**
   * Creates observable properties on instances
   * @type {typeof ICustomElement.observe}
   */
  static observe(props) {
    for (const [name, typeOrOptions] of Object.entries(props ?? {})) {
      const options = (typeof typeOrOptions === 'function')
        ? { reflect: false, get: typeOrOptions }
        : typeOrOptions;

      this.prop(name, options);
    }
    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement.defineStatic} */
  static defineStatic(props) {
    for (const [name, typeOrOptions] of Object.entries(props ?? {})) {
      const options = (typeof typeOrOptions === 'function')
        ? { get: typeOrOptions }
        : (typeof typeOrOptions === 'string'
          ? { type: typeOrOptions }
          : typeOrOptions);
      defineObservableProperty(this, name, {
        reflect: false,
        ...options,
      });
    }
    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement.events} */
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

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement.childEvents} */
  static childEvents(listenerMap, options) {
    for (const [tag, listeners] of Object.entries(listenerMap)) {
      // @ts-expect-error Can't cast T
      this.events(listeners, {
        tag: attrNameFromPropName(tag),
        ...options,
      });
    }

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement.events} */
  static rootEvents(listeners, options) {
    // @ts-expect-error Can't cast T
    return this.events(listeners, {
      tag: Composition.shadowRootTag,
      ...options,
    });
  }

  /** @type {typeof ICustomElement['on']} */
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
            this.onPropChanged({ [prop]: fn });
            continue;
          }
          throw new Error('Invalid callback name');
      }
      this._addCallback(arrayPropName, fn);
    }

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement['onPropChanged']} */
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

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement['onAttributeChanged']} */
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

    // @ts-expect-error Can't cast T
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

  /** @type {import('./ICustomElement.js').CallbackArguments} */
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
        target: this.shadowRoot,
        context: this,
      },
    );

    for (const callback of this.static._onConstructedCallbacks) {
      callback.call(this, this.callbackArguments);
    }
  }

  /** @type {InstanceType<typeof ICustomElement>['propChangedCallback']} */
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
