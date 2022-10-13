/** @typedef {'boolean'|'integer'|'float'|'string'} IDLOptionType */

/**
 * @template {IDLOptionType} T
  @typedef {T extends 'boolean' ? boolean : T extends 'string' ? string : T extends 'float'|'integer' ? number : unknown } ParsedIDLType<T> */

/**
 * @template {IDLOptionType} T1
 * @template {any} T2
 * @typedef IDLOptions
 * @prop {T1} [type]
 * @prop {string} [attr]
 * @prop {boolean} [reflect=true]
 * @prop {boolean} [enumerable]
 * @prop {boolean} [nullable]
 * @prop {T2} [empty] Empty value when not nullable
 * @prop {(value: T2) => T2} [onNullish] Function used when null passed
 * @prop {T2} [default]
 */

/**
 * @typedef RefOptions
 * @prop {string} id
 */

/**
 * @template T
 * @typedef {[T,Attr['nodeValue'],Attr['nodeValue']]} IDLTuple<T>
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
 * @prop {Set<keyof T & string>} props
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
    const attrs = new Set();
    for (const [, { attr }] of this.idlMap.entries()) {
      if (attr) attrs.add(attr);
    }
    return attrs;
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
   * @type {WeakMap<typeof CustomElement, Map<string, IDLOptions<?,?>>>}
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

  static rootTemplate = '';

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
   * Converts property name to attribute name
   * (Similar to DOMStringMap)
   * @param {string} name
   * @return {string}
   */
  static propNameToAttrName(name) {
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
   * @template {IDLOptionType} [T1=any]
   * @template {any} [T2=ParsedIDLType<T1>]
   * @param {string} name
   * @param {IDLOptions<T1,T2>} [options]
   * @return {unknown extends T2 ? string : T2}
   */
  static idl(name, options = {}) {
    const isPrivate = name[0] === '_';

    const { type, attr, empty, onNullish } = options;

    // If not set, private variables never reflect
    const reflect = options.reflect ?? (attr == null ? !isPrivate : true);
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

    const nullable = options.nullable ?? (parsedType !== 'boolean');
    /** @type {any} */
    let parsedEmpty = empty ?? null;
    if (!nullable && parsedEmpty === null) {
      // Auto assign empty value
      switch (parsedType) {
        case 'boolean':
          parsedEmpty = false;
          break;
        case 'integer':
        case 'float':
          parsedEmpty = 0;
          break;
        default:
        case 'string':
          parsedEmpty = '';
          break;
      }
    }

    this.idlMap.set(name, {
      reflect,
      enumerable,
      default: options.default ?? parsedEmpty,
      type: parsedType,
      attr: attr ?? (reflect ? CustomElement.propNameToAttrName(name) : null),
      nullable,
      empty: nullable ? null : parsedEmpty,
      onNullish,
    });
    return null;
  }

  /**
   * @param {string} name
   * @param {IDLOptions<'boolean',boolean>} [options]
   * @return {boolean}
   */
  static idlBoolean(name, options) {
    return this.idl(name, { type: 'boolean', ...options });
  }

  /**
   * @param {string} name
   * @param {IDLOptions<'integer',number>} [options]
   * @return {number}
   */
  static idlInteger(name, options) {
    return this.idl(name, { type: 'integer', ...options });
  }

  /**
   * @param {string} name
   * @param {IDLOptions<'float',number>} [options]
   * @return {number}
   */
  static idlFloat(name, options) {
    return this.idl(name, { type: 'float', ...options });
  }

  /** @type {Map<string,IDLTuple<?>>} */
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
      .map(([key]) => [key, this[key]]);
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
      for (const { id, node, fn, props } of bindings) {
        const ref = this.refs[id] ?? this.shadowRoot.getElementById(id);
        if (!ref) continue;
        if (modifiedNodes.get(ref)?.has(node)) {
          // console.warn('Node already modified. Skipping', id, node);
          continue;
        }
        let value;
        if (fn) {
          if (!fnResults.has(fn)) {
            const args = Object.fromEntries(
              [...props].map((prop) => [prop, prop in data ? data[prop] : this[prop]]),
            );
            value = fn.call(this, args);
            fnResults.set(fn, value);
          } else {
            value = fnResults.get(fn);
          }
        } else {
          value = data[key];
        }
        if (node.startsWith('#text')) {
          const index = node.slice('#text'.length + 1) || 0;
          let nodesFound = 0;
          for (const childNode of ref.childNodes) {
            if (childNode.nodeType !== Node.TEXT_NODE) continue;
            if (index !== nodesFound++) continue;
            childNode.nodeValue = value ?? '';
            break;
          }
          if (index > nodesFound) {
            console.log('node not found, adding?');
            ref.append(value);
          }
        } else if (value === false || value == null) {
          ref.removeAttribute(node);
        } else if (value === true) {
          ref.setAttribute(node, '');
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
    // TODO: Index attribute names?
    for (const [key, options] of map) {
      if (options.attr !== name) continue;
      const tuple = this.#getIdlTuple(key);
      const previousDataValue = tuple[0];
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
      this.idlChangedCallback(key, previousDataValue, tuple[0]);
    }
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   * @return {void}
   */
  idlChangedCallback(name, oldValue, newValue) {
    this.render({ [name]: newValue });
  }

  /**
   * @template {true|false} T
   * @param {T extends true ? Attr : Text } node
   * @param {T} [isAttr]
   * @return {void}
   */
  #interpolateNode(node, isAttr) {
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
    let textNodeIndex;

    if (isAttr === false || (nodeType === Node.TEXT_NODE)) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      element = node.parentElement;
      node.nodeValue = '';
      textNodeIndex = 0;
      let prev = node;
      while ((prev = prev.previousSibling) != null) {
        if (prev.nodeType === Node.TEXT_NODE) {
          textNodeIndex++;
        }
      }
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

    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { refMap } = component;
    if (!refMap.has(id)) {
      component.ref(id, { id });
    }
    let fn;
    /** @type {Set<string>} */
    let props;
    if (parsedValue.startsWith('#')) {
      const { inlineFunctionMap } = component;
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
        const scope = this;
        // TODO: thisProxy & argProxy
        const proxy = new Proxy(scope, {
          get(target, p) {
            poked.add(p);
            // console.log('spying on', target, p);
            const v = Reflect.get(target, p);
            if (v == null) return null;
            if (typeof v === 'function') {
              // console.log('rebinding function', v);
              return v.bind(target, proxy);
            }
            // @ts-ignore Skip cast
            return value;
          },
          has(target, p) {
            poked.add(p);
            return Reflect.has(target, p);
          },
        });
        fn.call(proxy, proxy);
        value.props = poked;
        props = poked;
      }
    } else {
      props = new Set([parsedValue]);
    }
    if (isEvent) {
      const options = {
        once: eventFlags?.includes('1'),
        passive: eventFlags?.includes('~'),
        capture: eventFlags?.includes('!'),
      };

      const type = nodeName.slice(2);
      element.removeAttribute(nodeName);

      const { eventMap } = component;
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

    const { bindMap } = component;

    const parsedNodeName = textNodeIndex ? nodeName + textNodeIndex : nodeName;
    const entry = { id, node: parsedNodeName, fn, props };
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
        content = this.#interpolate(content);
        // console.log(JSON.stringify({ [component.name]: component.bindMap }, (key, value) => {
        //   if (value instanceof Map || value instanceof Set) {
        //     return [...value];
        //   }
        //   return value;
        // }, ''));
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
      // const propName = options.propName ?? CustomElement.attrNameToPropName(key);

      const { enumerable, reflect, empty, nullable, attr, onNullish } = options;

      Object.defineProperty(this, key, {
        enumerable,
        get() {
          return this.#getIdlTuple(key)[0] ?? empty;
        },
        set(value) {
          const tuple = this.#getIdlTuple(key);
          const previousValue = tuple[0];
          const newValue = (!nullable && value == null) ? empty : value;
          if (previousValue == null && newValue == null) return;
          if (previousValue === newValue) return;
          let parsedValue;
          /** @type {?string} */
          let attrValue;
          switch (options.type) {
            case 'boolean':
              parsedValue = !!newValue;
              attrValue = parsedValue ? '' : null;
              break;
            case 'integer':
            case 'float':
              if (newValue == null) {
                if (onNullish) {
                  parsedValue = onNullish(newValue);
                  attrValue = String(parsedValue);
                } else {
                  parsedValue = null;
                  attrValue = null;
                }
              } else {
                if (typeof newValue !== 'number') throw new TypeError('Value must be a number');
                parsedValue = newValue;
                attrValue = String(newValue);
              }
              break;
            // case 'string':
            default:
              if (newValue == null) {
                if (onNullish) {
                  parsedValue = onNullish(newValue);
                  attrValue = parsedValue;
                } else {
                  parsedValue = null;
                  attrValue = null;
                }
              } else {
                parsedValue = String(newValue);
                attrValue = parsedValue;
              }
          }
          const lastAttrValue = tuple[1];

          tuple[0] = parsedValue;
          tuple[1] = attrValue;
          tuple[2] = previousValue;

          // console.log(component.name, 'Property change: idlChangedCallback', { key, previousValue, parsedValue });
          this.idlChangedCallback(key, previousValue, parsedValue);

          if (reflect) {
            if ((lastAttrValue == null && attrValue == null) || (lastAttrValue === attrValue)) {
              // If set to undefined instead of null;
              console.warn('Ignoring unchanged attribute value');
            } else {
              // console.log('Invoking attribute change', { attr, previousValue, parsedValue });
              if (attrValue == null) {
                this.removeAttribute(attr);
              } else {
                this.setAttribute(attr, attrValue);
              }
            }
          } else {
            // this.idlChangedCallback(propName, previousValue, parsedValue);
          }
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

  /**
   * @template {DocumentFragment|Element} [T=DocumentFragment]
   * @param {T} content
   * @return {T}
   */
  #interpolate(content) {
    for (const node of content.childNodes) {
      const { nodeType } = node;
      switch (nodeType) {
        case Node.ELEMENT_NODE:
          break;
        case Node.TEXT_NODE:
          // @ts-ignore Skip cast
          this.#interpolateNode(node, false);
          continue;
        default:
          continue;
      }

      const element = /** @type {Element} */ (node);
      // eslint-disable-next-line unicorn/no-useless-spread
      for (const attribute of [...element.attributes]) {
        this.#interpolateNode(attribute, true);
      }
      this.#interpolate(element);
    }
    return content;
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
          return scope.#weakRefs.get(key)?.deref();
        },
        set(value) {
          if (value) {
            scope.#weakRefs.set(key, new WeakRef(value));
          } else {
            scope.#weakRefs.delete(key);
          }
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
   * @return {IDLTuple<?>}
   */
  #getIdlTuple(key) {
    let value = this.#idlValues.get(key);
    if (!value) {
      value = [null, null, null];
      this.#idlValues.set(key, value);
    }
    return value;
  }
}
