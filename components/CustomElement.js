/** @typedef {'boolean'|'integer'|'float'|'string'} IDLOptionType */

/**
 * @template {IDLOptionType} T
 * @typedef IDLOptions
 * @prop {T} type
 * @prop {string} [propName]
 * @prop {boolean} [reflect=true]
 * @prop {boolean} [enumerable]
 * @prop {any} [default]
 */

/**
 * @typedef RefOptions
 * @prop {string} id
 */

/**
 * @template {keyof HTMLElementTagNameMap|Function|undefined} T
 * @typedef {T extends undefined ? undefined : T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : T extends Function ? InstanceType<T> : HTMLElement } RefType<T>
 */

/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 * @template {any} T
 * @typedef {Object} BindEntry
 * @prop {string} id
 * @prop {string} node
 * @prop {(data:T) => any} fn
 */

/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 * @template {any} T
 * @typedef {Object} InlineFunctionEntry
 * @prop {(data:T) => any} fn
 * @prop {Set<keyof T & string>} [props]
 */

/**
 * @typedef {Object} EventEntry
 * @prop {string} type
 * @prop {EventListenerOptions} options
 * @prop {EventListener} [listener]
 * @prop {string} [prop]
 */

/**
 * @template T
 * @typedef {Map<keyof T, Set<BindEntry<T>>>} BindMap
 */

/**
 * @template T
 * @typedef {Map<string, InlineFunctionEntry<T>>} InlineFunctionMap
 */

/** @typedef {Map<string, Set<EventEntry>>} EventMap */

/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
  /** @type {string} */
  static elementName = null;

  /** @type {(string|URL|CSSStyleSheet)[]} */
  static styles = [];

  static ariaRole = 'none';

  static delegatesFocus = false;

  /** @type {(DocumentFragment|string)[]} */
  static fragments = [];

  /** @type {Iterable<string>} */
  static get observedAttributes() {
    return this.idlMap.keys();
  }

  static interpolatesTemplate = true;

  static supportsAdoptedStyleSheets = 'adoptedStyleSheets' in ShadowRoot.prototype;

  static supportsElementInternals = 'attachInternals' in HTMLElement.prototype;

  static supportsElementInternalsRole = CustomElement.supportsElementInternals
    && 'role' in ElementInternals.prototype;

  /** @type {WeakMap<typeof CustomElement, DocumentFragment>} */
  static #fragmentCache = new WeakMap();

  /** @type {WeakMap<typeof CustomElement, CSSStyleSheet[]>} */
  static #stylesCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, Map<string, IDLOptions<?>>>}
   */
  static idlCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, Map<string, RefOptions>>}
   */
  static refCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, BindMap<Partial<?>>>}
   */
  static bindMapCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, InlineFunctionMap<Partial<?>>>}
   */
  static inlineFunctionMapCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, EventMap>}
   */
  static eventMapCache = new WeakMap();

  static #generatedUIDs = new Set();

  /**
   * @template {true|false} T
   * @param {T extends true ? Attr : Text } node
   * @param {T} [isAttr]
   * @return {void}
   */
  static interpolateNode(node, isAttr) {
    const { nodeName, nodeValue, nodeType } = node;
    if (!nodeValue) return;
    const trimmed = nodeValue.trim();
    if (!trimmed) return;
    if (trimmed[0] !== '{') return;
    const { length } = trimmed;
    if (trimmed[length - 1] !== '}') return;

    let parsedValue = trimmed.slice(1, length - 1);

    /** @type {Element} */
    let element;
    let isEvent;
    let eventFlags;

    if (isAttr === false || (nodeType === Node.TEXT_NODE)) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      element = node.parentElement;
      node.nodeValue = '';
    } else {
      // @ts-ignore Skip cast
      // eslint-disable-next-line unicorn/consistent-destructuring
      element = node.ownerElement;
      element.removeAttribute(nodeName);
      if (nodeName.startsWith('on')) {
        const [, flags, prop] = parsedValue.match(/^([!1~]+)?(.*)$/);
        eventFlags = flags;
        parsedValue = prop;
        isEvent = true;
      }
    }

    let { id } = element;
    if (!id) {
      id = CustomElement.#generateUID();
      element.id = id;
    }
    const { refMap } = this;
    if (!refMap.has(id)) {
      this.ref(id, { id });
    }
    let fn;
    /** @type {Iterable<string>} */
    let props;
    if (parsedValue.startsWith('#')) {
      const { inlineFunctionMap } = this;
      const value = inlineFunctionMap.get(parsedValue);
      if (!value) {
        console.warn(`Invalid interpolation value: ${parsedValue}`);
        return;
      }
      fn = value.fn;
      props = value.props;
      if (!props && !isEvent) {
        // Idempotent expressions allows us to spy on values
        const poked = new Set();
        fn.call(null, new Proxy({}, {
          get(target, p) {
            poked.add(p);
            return null;
          },
          has(target, p) {
            poked.add(p);
            return true;
          },
        }));
        value.props = poked;
        props = poked;
      }
    } else {
      props = [parsedValue];
    }
    if (isEvent) {
      const options = {
        once: eventFlags?.includes('1'),
        passive: eventFlags?.includes('~'),
        capture: eventFlags?.includes('!'),
      };

      const type = nodeName.slice(2);
      element.removeAttribute(nodeName);

      const { eventMap } = this;
      let set = eventMap.get(id);
      if (!set) {
        set = new Set();
        eventMap.set(id, set);
      }
      if (fn) {
        set.add({ type, options, listener: fn });
      } else {
        set.add({ type, options, prop: parsedValue });
      }
      return;
    }

    const { bindMap } = this;

    const entry = { id, node: nodeName, fn };
    for (const prop of props) {
      let set = bindMap.get(prop);
      if (!set) {
        set = new Set();
        bindMap.set(prop, set);
      }
      set.add(entry);
    }

    // console.log(this.name, 'binding', isText ? '#text' : `[${nodeName}]`, 'of', id, 'with', parsedValue);
  }

  /**
   * @template {DocumentFragment|Element} [T=DocumentFragment]
   * @param {T} content
   * @return {T}
   */
  static interpolate(content) {
    for (const node of content.childNodes) {
      const { nodeType } = node;
      switch (nodeType) {
        case Node.ELEMENT_NODE:
          break;
        case Node.TEXT_NODE:
          // @ts-ignore Skip cast
          this.interpolateNode(node, false);
          continue;
        default:
          continue;
      }

      const element = /** @type {Element} */ (node);
      // eslint-disable-next-line unicorn/no-useless-spread
      for (const attribute of [...element.attributes]) {
        this.interpolateNode(attribute, true);
      }
      this.interpolate(element);
    }
    return content;
  }

  /** @return {string} */
  static #generateUID() {
    const id = Math.random().toString(36).slice(2, 10);
    if (this.#generatedUIDs.has(id)) {
      return this.#generateUID();
    }
    this.#generatedUIDs.add(id);
    return id;
  }

  /**
   * Converts attribute name to property name
   * (Similar to DOMStringMap)
   * @param {string} name
   * @return {string}
   */
  static attrNameToPropName(name) {
    const propNameWords = name.split('-');
    if (propNameWords.length === 1) return name;
    return propNameWords.reduce((prev, curr) => {
      if (prev == null) return curr;
      return prev + curr[0].toUpperCase() + curr.slice(1);
    });
  }

  /**
   * @this {typeof CustomElement}
   * @param {string} [elementName]
   */
  static register(elementName) {
    customElements.define(elementName || this.elementName, this);
  }

  static get idlMap() {
    let map = this.idlCache.get(this);
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let parent = this;
      let parentMap;
      while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
        parentMap = this.idlCache.get(parent);
        if (parentMap) break;
      }
      map = new Map(parentMap);
      this.idlCache.set(this, map);
    }
    return map;
  }

  static get refMap() {
    let map = this.refCache.get(this);
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let parent = this;
      let parentMap;
      while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
        parentMap = this.refCache.get(parent);
        if (parentMap) break;
      }
      map = new Map(parentMap);
      this.refCache.set(this, map);
    }
    return map;
  }

  static get bindMap() {
    let map = this.bindMapCache.get(this);
    if (!map) {
      map = new Map();
      if (!this.interpolatesTemplate) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let parent = this;
        let parentMap;
        while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
          parentMap = this.bindMapCache.get(parent);
          if (parentMap) break;
        }
        for (const [key, entries] of parentMap ?? []) {
          const newSet = new Set();
          for (const entry of entries) {
            newSet.add({ ...entry });
          }
          map.set(key, newSet);
        }
      }

      this.bindMapCache.set(this, map);
    }
    return map;
  }

  static get inlineFunctionMap() {
    let map = this.inlineFunctionMapCache.get(this);
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let parent = this;
      let parentMap;
      while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
        parentMap = this.inlineFunctionMapCache.get(parent);
        if (parentMap) break;
      }
      map = new Map(parentMap);

      this.inlineFunctionMapCache.set(this, map);
    }
    return map;
  }

  static get eventMap() {
    let map = this.eventMapCache.get(this);
    if (!map) {
      map = new Map();
      if (!this.interpolatesTemplate) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let parent = this;
        let parentMap;
        while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
          parentMap = this.eventMapCache.get(parent);
          if (parentMap) break;
        }
        for (const [key, entries] of parentMap ?? []) {
          const newSet = new Set();
          for (const entry of entries) {
            newSet.add({ ...entry });
          }
          map.set(key, newSet);
        }
      }

      this.eventMapCache.set(this, map);
    }
    return map;
  }

  /**
   * @param {string} name
   * @param {RefOptions} options
   * @return {HTMLElement}
   */
  static ref(name, options) {
    this.refMap.set(name, options);
    return null;
  }

  /**
   * @template {string} T
   * @param  {...T} names
   * @return {{[P in T]: RefType<P> }}
   */
  static addRefNames(...names) {
    for (const name of names) {
      this.ref(name, { id: name });
    }
    return null;
  }

  /**
   * @template {keyof HTMLElementTagNameMap|Function} T1
   * @template {{id:string,type:T1}} T2
   * @template {Record<string, T1|T2>} T
   * @param {T} options
   * @return {{[P in keyof T]: RefType<T[P] extends T1 ? T[P] : T[P]['type']>}}
   */
  static addRefs(options) {
    for (const [key, value] of Object.entries(options)) {
      const id = typeof value === 'object' ? value?.id : null;
      this.ref(key, { id: id ?? key });
    }
    return null;
  }

  /**
   * @template {IDLOptionType} T
   * @param {string} name
   * @param {IDLOptions<T>} options
   * @return {T extends 'boolean' ? boolean : T extends 'integer'|'float' ? number : T extends 'string' ? string : unknown}
   */
  static idl(name, options) {
    const isPrivate = name[0] === '_';
    this.idlMap.set(name, {
      reflect: options.reflect ?? !isPrivate,
      enumerable: options.enumerable ?? !isPrivate,
      default: options.default ?? null,
      type: options.type ?? 'string',
      propName: options.propName || CustomElement.attrNameToPropName(name),
    });
    return null;
  }

  /**
   * @param {string} name
   * @param {string} [propName]
   * @return {boolean}
   */
  static idlBoolean(name, propName) {
    return this.idl(name, { type: 'boolean', propName });
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {number}
   */
  static idlInteger(attrName, propName) {
    return this.idl(attrName, { type: 'integer', propName });
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {number}
   */
  static idlFloat(attrName, propName) {
    return this.idl(attrName, { type: 'float', propName });
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {string}
   */
  static idlString(attrName, propName) {
    return this.idl(attrName, { type: 'string', propName });
  }

  /** @type {Map<string,[boolean|number|string,string]>} */
  #idlValues = new Map();

  /** @type {Map<string,WeakRef<HTMLElement>>} */
  #weakRefs = new Map();

  /** @type {this['composeHtml']} */
  #html;

  constructor() {
    super();
    this.#attachIDLs();
    this.#attachShadow();
    this.#attachStyles();
    this.#attachContent();
    this.#attachRefs();
    this.#attachEvents();
    this.#attachInternals();
    this.#attachARIA();
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { idlMap } = component;
    const nonReflecting = [...idlMap.entries()]
      .filter(([, options]) => !options.reflect)
      .map(([key,]) => [key, this[key]]);
    if (nonReflecting.length) {
      const dataObject = Object.fromEntries(nonReflecting);
      this.render(dataObject);
    }
  }

  /**
   * Composes template used for construction
   * Not static so `this` can referenced for type-checking
   * @return {DocumentFragment}
   */
  compose() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const fragment = document.createDocumentFragment();
    fragment.append(
      ...component.styles.map((style) => {
        if (typeof style === 'string') {
          const el = document.createElement('style');
          el.textContent = style;
          return el;
        }
        if (style instanceof URL) {
          const el = document.createElement('link');
          el.rel = 'stylesheet';
          el.href = style.href;
          return el;
        }
        if (CustomElement.supportsAdoptedStyleSheets) return null;
        const el = document.createElement('style');
        el.textContent = [...style.cssRules].map((r) => r.cssText).join('\n');
        return el;
      }).filter(Boolean),
      ...component.fragments.map((f) => {
        if (typeof f === 'string') {
          return document.createRange().createContextualFragment(f);
        }
        return fragment;
      }),
    );
    return fragment;
  }

  /**
   * @param {?} data
   * @return {void}
   */
  render(data) {
    if (!data) return;
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { bindMap } = component;

    const fnResults = new WeakMap();
    /** @type {WeakMap<Element, Set<string>>} */
    const modifiedNodes = new WeakMap();
    for (const [key, bindings] of bindMap.entries()) {
      if (!(key in data)) continue;
      for (const { id, node, fn } of bindings) {
        const ref = this.refs[id] ?? this.shadowRoot.getElementById(id);
        if (!ref) continue;
        if (modifiedNodes.get(ref)?.has(node)) {
          console.warn('Node already modified. Skipping', id, node);
          continue;
        }
        let value;
        if (fn) {
          if (!fnResults.has(fn)) {
            value = fn(data);
            fnResults.set(fn, value);
          } else {
            value = fnResults.get(fn);
          }
        } else {
          if (component.name === 'Slider') {
            console.log('hi');
          }
          value = data[key];
        }
        if (node === '#text') {
          ref.textContent = value ?? '';
        } else if (value == null) {
          ref.removeAttribute(node);
        } else {
          ref.setAttribute(node, value);
        }
        let set = modifiedNodes.get(ref);
        if (!set) {
          set = new Set();
          modifiedNodes.set(ref, set);
        }
        set.add(node);
      }
    }
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == null && newValue == null) return;
    const component = /** @type {typeof CustomElement} */ (this.constructor);

    const map = CustomElement.idlCache.get(component);
    if (!map) return;
    const options = map.get(name);
    if (!options) return;
    const tuple = this.#getIdlTuple(name);
    if (tuple[1] === newValue) return;
    tuple[1] = newValue;
    switch (options.type) {
      case 'boolean':
        tuple[0] = newValue != null;
        break;
      case 'string':
        tuple[0] = newValue;
        break;
      case 'integer':
        if (newValue == null) {
          tuple[0] = null;
        } else {
          const numValue = Number.parseInt(newValue, 10);
          tuple[0] = Number.isNaN(numValue) ? null : numValue;
        }
        break;
      case 'float':
        if (newValue == null) {
          tuple[0] = null;
        } else {
          const numValue = Number.parseFloat(newValue);
          tuple[0] = Number.isNaN(numValue) ? null : numValue;
        }
        break;
      default:
    }
    this.render({ [name]: tuple[0] });
  }

  /**
   * Wraps composeHtml with bind to `this` (not natively set with tagged template literals)
   * @this {this}
   * @return {this['composeHtml']}
   */
  get html() {
    if (!this.#html) {
      this.#html = this.composeHtml.bind(this);
    }
    return this.#html;
  }

  /**
   * @template {any} [T=Partial<this>]
   * @param {TemplateStringsArray} strings
   * @param  {...(string|((data:T) => any))} substitutions
   * @return {DocumentFragment}
   */
  composeHtml(strings, ...substitutions) {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { inlineFunctionMap } = component;

    const replacements = substitutions.map((sub) => {
      if (typeof sub === 'string') return sub;

      const internalName = `#${CustomElement.#generateUID()}`;

      inlineFunctionMap.set(internalName, {
        fn: sub,
      });
      return `{${internalName}}`;
    });

    const compiledString = String.raw({ raw: strings }, ...replacements);
    return document.createRange().createContextualFragment(compiledString);
  }

  #attachShadow() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    this.attachShadow({ mode: 'open', delegatesFocus: component.delegatesFocus });
  }

  #attachStyles() {
    if (!CustomElement.supportsAdoptedStyleSheets) return;
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    let array = CustomElement.#stylesCache.get(component);
    if (!array) {
      // @ts-ignore Skip cast
      array = component.styles.filter((style) => style instanceof CSSStyleSheet);
      CustomElement.#stylesCache.set(component, array);
    }
    this.shadowRoot.adoptedStyleSheets = array;
  }

  #attachContent() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    let content = CustomElement.#fragmentCache.get(component);
    if (!content) {
      content = this.compose();
      if (component.interpolatesTemplate) {
        content = component.interpolate(content);
        console.log(JSON.stringify({ [component.name]: component.bindMap }, (key, value) => {
          if (value instanceof Map || value instanceof Set) {
            return [...value];
          }
          return value;
        }, ''));
      }
      CustomElement.#fragmentCache.set(component, content);
    }
    this.shadowRoot.prepend(content.cloneNode(true));
  }

  #attachInternals() {
    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }
  }

  #attachARIA() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    if (component.supportsElementInternalsRole) {
      this.elementInternals.role = component.ariaRole;
    } else {
      if (this.hasAttribute('role')) return;
      this.setAttribute('role', component.ariaRole);
    }
  }

  #attachIDLs() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    for (const [key, options] of component.idlMap) {
      const propName = options.propName ?? CustomElement.attrNameToPropName(key);
      const isPrivate = key[0] === '#' || key[0] === '_';

      const enumerable = options.enumerable ?? !isPrivate;
      const reflect = options.reflect ?? enumerable;

      Object.defineProperty(this, propName, {
        enumerable,
        get() {
          return this.#getIdlTuple(key)[0];
        },
        set(value) {
          const tuple = this.#getIdlTuple(key);
          const previousValue = tuple[0];
          if (previousValue == null && value == null) return;
          if (previousValue === value) return;
          let parsedValue;
          /** @type {?string} */
          let attrValue;
          switch (options.type) {
            case 'boolean':
              parsedValue = !!value;
              attrValue = parsedValue ? '' : null;
              break;
            case 'integer':
            case 'float':
              if (value == null) {
                parsedValue = null;
                attrValue = null;
              } else {
                if (typeof value !== 'number') throw new TypeError('Value must be a number');
                parsedValue = value;
                attrValue = String(value);
              }
              break;
            // case 'string':
            default:
              if (value == null) {
                parsedValue = null;
                attrValue = null;
              } else {
                parsedValue = String(value);
                attrValue = parsedValue;
              }
          }
          tuple[0] = parsedValue;
          tuple[1] = attrValue;
          if (reflect) {
            if (attrValue == null) {
              this.removeAttribute(key);
            } else {
              this.setAttribute(key, attrValue);
            }
          }
          this.render({ [propName]: parsedValue });
        },
      });
      if (options.default != null) {
        const tuple = this.#getIdlTuple(key);
        tuple[0] = options.default;
      } else if (options.type === 'boolean') {
        const tuple = this.#getIdlTuple(key);
        tuple[0] = false;
      }
    }
  }

  #attachRefs() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { refMap } = component;
    /** @type {Record<string,?HTMLElement>} */
    const refObject = {};
    for (const [key, options] of refMap) {
      let element;
      if (options.id) {
        element = this.shadowRoot.getElementById(options.id);
      } else {
        throw new Error(`Invalid ref options: ${JSON.stringify(options)}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const scope = this;
      Object.defineProperty(refObject, key, {
        enumerable: true,
        get() {
          return scope.#getRef(key);
        },
        set(value) {
          scope.#setRef(key, value);
        },
      });
      // @ts-ignore TS doesn't process defineProperty
      refObject[key] = element;
    }
    this.refs = refObject;
  }

  #attachEvents() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { eventMap } = component;
    for (const [id, events] of eventMap) {
      /** @type {HTMLElement} */
      const ref = this.refs[id] ?? this.shadowRoot.getElementById(id);
      if (!ref) {
        console.warn('Could not bind events for #', id);
        continue;
      }
      for (const { type, listener, options, prop } of events) {
        if (listener) {
          ref.addEventListener(type, listener, options);
        } else {
          /** @type {any} */
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          let value = this;
          for (const child of prop.split('.')) {
            if (!child) {
              value = null;
              break;
            }
            value = value[child];
          }
          if (!value || value === this) {
            console.warn('Invalid event listener:', prop);
            continue;
          }
          ref.addEventListener(type, value, options);
        }
      }
    }
  }

  /**
   * @param {string} key
   * @return {HTMLElement}
   */
  #getRef(key) {
    return this.#weakRefs.get(key)?.deref();
  }

  /**
   * @param {string} key
   * @param {?HTMLElement} value
   * @return {void}
   */
  #setRef(key, value) {
    if (value) {
      this.#weakRefs.set(key, new WeakRef(value));
    } else {
      this.#weakRefs.delete(key);
    }
  }

  /**
   * @param {string} key
   * @return {[boolean|number|string,string]}
   */
  #getIdlTuple(key) {
    let value = this.#idlValues.get(key);
    if (!value) {
      value = [null, null];
      this.#idlValues.set(key, value);
    }
    return value;
  }
}
