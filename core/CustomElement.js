/* eslint-disable max-classes-per-file */

import Composition from './Composition.js';
import { ICustomElement } from './ICustomElement.js';
import { attrNameFromPropName, attrValueFromDataValue, findElement } from './dom.js';
import { defineObservableProperty } from './observe.js';
import { addInlineFunction, css, html } from './template.js';

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
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends ICustomElement {
  /** @type {string} */
  static elementName;

  /** @return {Iterable<string>} */
  static get observedAttributes() {
    const s = new Set();
    for (const config of this.propList.values()) {
      if (config.reflect === true || config.reflect === 'read') {
        s.add(config.attr);
      }
    }
    return s;
  }

  /** @type {import('./Composition.js').Compositor<?>} */
  compose() {
    if (this.#composition) {
      console.warn('Already composed. Generating *new* composition...');
    }
    this.#composition = new Composition();
    return this.#composition;
  }

  /** @type {Composition<?>} */
  static _composition = null;

  /** @type {Map<string, import('./typings.js').ObserverConfiguration<?,?,?>>} */
  static _props = new Map();

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

  /** @type {typeof ICustomElement.expressions} */
  static expressions = this.set;

  /** @type {typeof ICustomElement.methods} */
  static methods = this.set;

  /** @type {typeof ICustomElement.overrides} */
  static overrides = this.set;

  /** @type {typeof ICustomElement.props} */
  static props = this.observe;

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
      ];
    }
    this[collection].push(callback);
  }

  /**
   * Append parts to composition
   * @type {typeof ICustomElement.append}
   */
  static append(...parts) {
    this.on('composed', ({ composition }) => {
      // console.log('onComposed:append', ...parts);
      composition.append(...parts);
    });
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Appends styles to composition
   * @type {typeof ICustomElement.css}
   */
  static css(array, ...substitutions) {
    if (Array.isArray(array)) {
      // @ts-expect-error Complex cast
      this.append(css(array, ...substitutions));
    } else {
      // @ts-expect-error Complex cast
      this.append(array, ...substitutions);
    }
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
    if (elementName) {
      this.elementName = elementName;
    }
    queueMicrotask(() => {
      if (this.autoRegistration) {
        this.register();
      }
    });
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Appends DocumentFragment to composition
   * @type {typeof ICustomElement.html}
   */
  static html(strings, ...substitutions) {
    this.on('composed', ({ composition }) => {
      // console.log('onComposed:html', strings);
      composition.append(html(strings, ...substitutions));
    });
    // @ts-expect-error Can't cast T
    return this;
  }

  /**
   * Extends base class into a new class.
   * Use to avoid mutating base class.
   * TODO: Add constructor arguments typing
   * @type {typeof ICustomElement.extend}
   */
  static extend() {
    // @ts-expect-error Can't cast T
    return class ExtendedClass extends this {};
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
      Object.fromEntries(
        Object.entries(source).map(([name, value]) => {
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
      ),
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
  static register(elementName, force = false) {
    if (this.hasOwnProperty('defined') && this.defined && !force) {
      // console.warn(this.elementName, 'already registered.');
      // @ts-expect-error Can't cast T
      return this;
    }

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
   * @template {import('./typings.js').ObserverPropertyType} [T1=null]
   * @template {import('./typings.js').ObserverPropertyType} [T2=null]
   * @template {any} [T3=null]
   * @param {string} name
   * @param {T1|import('./typings.js').ObserverOptions<T2,T3>} [typeOrOptions='string']
   * @return {(
   *    T3 extends null ?
   *        T2 extends null ?
   *          T1 extends null ?
   *            string
   *          : import('./typings.js').ParsedObserverPropertyType<T1>
   *        : import('./typings.js').ParsedObserverPropertyType<T2>
   *    : T3
   * )}
   */
  static prop(name, typeOrOptions) {
    /** @type {import('./typings.js').ObserverOptions<?,?>} */
    const options = {
      ...((typeof typeOrOptions === 'string') ? { type: typeOrOptions } : typeOrOptions),
    };

    const customCallback = options.changedCallback;

    if (customCallback) {
      // Move callback to later in stack for attribute-based changes as well
      // @ts-expect-error Skip cast
      this.onPropChanged({ [name]: customCallback });
    }

    // TODO: Inspect possible closure bloat
    options.changedCallback = function wrappedChangedCallback(oldValue, newValue) {
      this._onObserverPropertyChanged.call(this, name, oldValue, newValue);
    };

    const config = defineObservableProperty(this.prototype, name, options);

    this.propList.set(name, config);
    for (const [prop, callback] of config.watchers) {
      this.on(`${prop}Changed`, callback);
    }

    return config.INIT_SYMBOL;
  }

  /**
   * Define properties on instances via Object.defineProperties().
   * Automatically sets property non-enumerable if name begins with `_`.
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
    const config = this.propList.get(name);
    if (config && config.watchers.length) {
      const propWatchers = this.propChangedCallbacks.get(name);
      if (propWatchers) {
        for (const watcher of config.watchers) {
          const index = propWatchers.indexOf(watcher);
          if (index !== -1) {
            console.warn('Unwatching', name);
            propWatchers.splice(index, 1);
          }
        }
      }
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
      if (typeof typeOrOptions === 'function') {
        this.prop(name, {
          reflect: false,
          get: typeOrOptions,
        });
      } else {
        this.prop(name, typeOrOptions);
      }
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
    this.on('composed', ({ composition }) => {
      for (const [key, listenerOptions] of Object.entries(listeners)) {
        const [, flags, type] = key.match(/^([*1~]+)?(.*)$/);
        composition.addEventListener({
          type,
          once: flags?.includes('1'),
          passive: flags?.includes('~'),
          capture: flags?.includes('*'),
          ...(
            typeof listenerOptions === 'function'
              ? { handleEvent: listenerOptions }
              : (typeof listenerOptions === 'string'
                ? { prop: listenerOptions }
                : listenerOptions)
          ),
          ...(
            options
          )
          ,
        });
      }
    });

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement.childEvents} */
  static childEvents(listenerMap, options) {
    for (const [id, listeners] of Object.entries(listenerMap)) {
      this.events(listeners, {
        id,
        ...options,
      });
    }

    // @ts-expect-error Can't cast T
    return this;
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
    for (const [prop, callback] of Object.entries(options)) {
      let array = this.propChangedCallbacks.get(prop);
      if (!array) {
        array = [];
        this.propChangedCallbacks.set(prop, array);
      }
      array.push(callback);
    }

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {typeof ICustomElement['onAttributeChanged']} */
  static onAttributeChanged(options) {
    for (const [name, callback] of Object.entries(options)) {
      let array = this.attributeChangedCallbacks.get(name);
      if (!array) {
        array = [];
        this.attributeChangedCallbacks.set(name, array);
      }
      array.push(callback);
    }

    // @ts-expect-error Can't cast T
    return this;
  }

  /** @type {Record<string, HTMLElement>}} */
  #refsProxy;

  /** @type {Composition<?>} */
  #composition;

  /** @type {this} */
  #superProxy = null;

  /** @type {Map<string,null|[string,any]>} */
  _propAttributeCache;

  /** @type {import('./ICustomElement.js').CallbackArguments} */
  _callbackArguments = null;

  /** @param {any[]} args */
  constructor(...args) {
    super();

    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }

    if (CustomElement.supportsElementInternalsRole) {
      this.elementInternals.role = this.ariaRole;
    } else if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.ariaRole);
    }

    this.attachShadow({ mode: 'open', delegatesFocus: this.delegatesFocus });

    this.composition.initialRender(this.shadowRoot, this);

    for (const callback of this.static._onConstructedCallbacks) {
      callback.call(this, this.callbackArguments);
    }
  }

  /**
   * Updates nodes based on data
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {?} data
   * @return {void}
   */
  render(data) {
    // console.log('render', data);
    this.composition.render(this.shadowRoot, data, this);
  }

  /** @type {InstanceType<typeof ICustomElement>['propChangedCallback']} */
  propChangedCallback(name, oldValue, newValue) {
    const callbacks = this.static.propChangedCallbacks.get(name);
    if (callbacks) {
      for (const callback of callbacks) {
        callback.call(this, oldValue, newValue, this);
      }
    }

    this.render({ [name]: newValue });
  }

  /**
   * @param {string} name
   * @param {string|null} oldValue
   * @param {string|null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const callbacks = this.static.attributeChangedCallbacks.get(name);
    if (callbacks) {
      for (const callback of callbacks) {
        callback.call(this, oldValue, newValue, this);
      }
    }

    // Array.find
    for (const config of this.static.propList.values()) {
      if (config.attr !== name) continue;

      if (config.reflect !== true && config.reflect !== 'read') return;

      if (config.attributeChangedCallback) {
        config.attributeChangedCallback.call(this, name, oldValue, newValue);
        return;
      }

      const [stringValue] = this.attributeCache.get(name) ?? [null, null];
      if (stringValue === newValue) {
        // Attribute was changed via data change event. Ignore.
        return;
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
      this.attributeCache.set(name, [newValue, parsedValue]);
      // @ts-expect-error any
      this[config.key] = parsedValue;
      return;
    }
  }

  get #template() {
    return this.#composition?.template;
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  _onObserverPropertyChanged(name, oldValue, newValue) {
    const { reflect, attr } = this.static.propList.get(name);
    if (attr && (reflect === true || reflect === 'write')) {
      const [, dataValue] = this.attributeCache.get(attr) ?? [null, null];
      // Don't change attribute if data value is equivalent
      // (eg: Boolean('foo') === true; Number("1.0") === 1)
      if (dataValue !== newValue) {
        const attrValue = attrValueFromDataValue(newValue);
        // Cache attrValue to ignore attributeChangedCallback later
        this.attributeCache.set(attr, [attrValue, newValue]);
        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
      }
    }

    // Invoke change => render
    this.propChangedCallback(name, oldValue, newValue);
  }

  /**
   * Proxy object that returns shadow DOM elements by ID.
   * If called before interpolation (eg: on composed), returns from template
   * @return {Record<string,HTMLElement>}
   */
  get refs() {
    // eslint-disable-next-line no-return-assign
    return (this.#refsProxy ??= new Proxy({}, {
      /**
       * @param {any} target
       * @param {string} id
       * @return {Element}
       */
      get: (target, id) => {
        if (!this.#composition) {
          console.warn(this.static.name, 'Attempted to access references before composing!');
        }
        const composition = this.composition;
        const formattedId = attrNameFromPropName(id);
        if (!composition.interpolated) {
          // console.warn(this.tagName, 'Returning template reference');
          return findElement(composition.template, formattedId);
        }
        return composition.getElement(this.shadowRoot, formattedId);
      },
    }));
  }

  get attributeCache() {
    this._propAttributeCache ??= new Map();
    return this._propAttributeCache;
  }

  get tabIndex() {
    return super.tabIndex;
  }

  set tabIndex(value) {
    if (value === super.tabIndex && value !== -1) {
      // Non -1 value already set
      return;
    }

    if (this.delegatesFocus && document.activeElement === this) {
      if (this.getAttribute('tabindex') === value.toString()) {
        // Skip if possible
        return;
      }

      // Chrome blurs on tabindex changes with delegatesFocus
      // Fixed in Chrome 111
      // Remove this code ~June 2023
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1346606
      /** @type {EventListener} */
      const listener = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (e.type === 'blur') {
          console.warn('Chromium bug 1346606: Tabindex change caused blur. Giving focusing back.', this);
          this.focus();
        } else {
          console.warn('Chromium bug 1346606: Blocking focus event.', this);
        }
      };
      this.addEventListener('blur', listener, { capture: true, once: true });
      this.addEventListener('focus', listener, { capture: true, once: true });
      super.tabIndex = value;
      this.removeEventListener('blur', listener, { capture: true });
      this.removeEventListener('focus', listener, { capture: true });
      return;
    }

    super.tabIndex = value;
  }

  get static() { return /** @type {typeof CustomElement} */ (/** @type {unknown} */ (this.constructor)); }

  get unique() { return false; }

  get callbackArguments() {
    // eslint-disable-next-line no-return-assign
    return this._callbackArguments ??= {
      composition: this.#composition,
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

  /** @return {this} */

  get super() {
    // eslint-disable-next-line no-return-assign
    return (this.#superProxy ??= new Proxy(superOf(this), {
      get: (target, prop) => {
        const value = target[prop];
        if (typeof value === 'function') {
          return value.bind(this);
        }
        return value;
      },
    }));
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

CustomElement.prototype.ariaRole = 'none';
CustomElement.prototype.delegatesFocus = false;
