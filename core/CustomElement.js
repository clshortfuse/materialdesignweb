import { generateFragment, generateUID, parseIDLOptions, valueFromPropName } from './functions.js';

/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
  /** @type {string} */
  static elementName = null;

  static ariaRole = 'none';

  static delegatesFocus = false;

  /** @type {Iterable<string>} */
  static get observedAttributes() {
    return [...this.getIdls().values()]
      .filter((options) => options.attr && (options.reflect === true || options.reflect === 'read'))
      .map(({ attr }) => attr);
  }

  /** @type {(string|URL|CSSStyleSheet)[]} */
  static styles = [];

  /** @type {(DocumentFragment|string)[]} */
  static fragments = [];

  /** @type {?DocumentFragment} */
  static get template() {
    if (!this.hasOwnProperty('_template')) {
      this._template = generateFragment();
      this._template.append(
        ...this.styles.map((style) => {
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
        ...this.fragments.map((f) => ((typeof f === 'string') ? generateFragment(f) : f)),
      );
    }

    return this._template;
  }

  /** @type {HTMLTemplater<any,any>} */
  static _html;

  /** @type {DocumentFragment} */
  static _template = null;

  /** @type {DocumentFragment} */
  static _composition = null;

  /** @type {DocumentFragment} */
  static _fullComposition = null;

  /** @type {Map<string, IDLOptions<?,?>>} */
  static _idls = new Map();

  /** @type {BindMap<Partial<?>>} */
  static _bindings = new Map();

  /** @type {InlineFunctionMap<Partial<?>>} */
  static _inlineFunctions = new Map();

  /** @type {EventMap} */
  static _events = new Map();

  /** @type {CSSStyleSheet[]} */
  static _adoptedStyleSheets = [];

  /** @type {Map<string,HTMLElement>} */
  static _removedRefs = new Map();

  static interpolatesTemplate = true;

  static supportsAdoptedStyleSheets = 'adoptedStyleSheets' in ShadowRoot.prototype;

  static supportsElementInternals = 'attachInternals' in HTMLElement.prototype;

  static supportsElementInternalsRole = CustomElement.supportsElementInternals
    && 'role' in ElementInternals.prototype;

  static IDL_INIT = Symbol('IDL_INIT');

  /** @type {boolean} */
  static templatable = null;

  static defined = false;

  static autoRegistration = true;

  /** @type {Map<string, typeof CustomElement>} */
  static registrations = new Map();

  /**
   * @type {HTMLTemplater<unknown, unknown>}
   */
  static _templateHTML(strings, ...substitutions) {
    /** @type {Map<string, Element>} */
    const tempSlots = new Map();
    const replacements = substitutions.map((sub) => {
      switch (typeof sub) {
        case 'string': return sub;
        case 'function': return this.addInlineFunction(sub);
        case 'object': {
          // Assume Element
          const tempId = generateUID();
          tempSlots.set(tempId, sub);
          return `<div id="${tempId}"></div>`;
        }
        default:
          throw new Error(`Unexpected substitution: ${String(sub)}`);
      }
    });
    const compiledString = String.raw({ raw: strings }, ...replacements);
    const fragment = generateFragment(compiledString);
    for (const [id, element] of tempSlots) {
      const slot = fragment.getElementById(id);
      slot.after(element);
      slot.remove();
    }

    return fragment;
  }

  /**
   * @param {(data: Partial<any>) => any} fn
   * @return {string}
   */
  static addInlineFunction(fn) {
    const internalName = `#${generateUID()}`;
    // console.log(this.name, 'using', internalName, 'instead of', sub);
    this.getInlineFunctions().set(internalName, { fn });
    return `{${internalName}}`;
  }

  static autoRegister() {
    queueMicrotask(() => {
      if (this.autoRegistration) {
        this.register();
      }
    });
  }

  /**
   * @param {string} [elementName]
   * @param {boolean} [force=false]
   * @return {string}
   */
  static register(elementName, force = false) {
    const name = elementName || this.elementName;
    if (this.hasOwnProperty('defined') && this.defined && !force) {
      // console.warn(name, 'already registered.');
      return this.elementName;
    }

    if (this.elementName !== name) {
      // console.log('Changing', this.elementName, '=>', name);
      this.elementName = name;
    }
    customElements.define(name, this);
    CustomElement.registrations.set(name, this);
    this.defined = true;
    return this.elementName;
  }

  static getIdls() {
    if (!this.hasOwnProperty('_idls')) {
      this._idls = new Map(this._idls);
    }
    return this._idls;
  }

  static getBindings() {
    if (!this.hasOwnProperty('_bindings')) {
      this._bindings = new Map(
        [...this._bindings].map(([key, entries]) => [
          key,
          new Set([...entries].map((entry) => ({ ...entry }))),
        ]),
      );
    }
    return this._bindings;
  }

  static getInlineFunctions() {
    if (!this.hasOwnProperty('_inlineFunctions')) {
      this._inlineFunctions = new Map(this._inlineFunctions);
    }
    return this._inlineFunctions;
  }

  static getEvents() {
    if (!this.hasOwnProperty('_events')) {
      this._events = new Map(
        [...this._events].map(([key, entries]) => [
          key,
          new Set([...entries].map((entry) => ({ ...entry }))),
        ]),
      );
    }
    return this._events;
  }

  static getAdoptedStyleSheets() {
    if (!this.hasOwnProperty('_adoptedStyleSheets')) {
      this._adoptedStyleSheets = /** @type {CSSStyleSheet[]} */ (this.styles
        .filter((style) => style instanceof CSSStyleSheet));
    }
    return this._adoptedStyleSheets;
  }

  /**
   * @template {IDLOptionType} [T1=any]
   * @template {any} [T2=ParsedIDLType<T1>]
   * @param {string} name
   * @param {T1|IDLOptions<T1,T2>} [typeOrOptions='string']
   * @return {unknown extends T2 ? string : T2}
   */
  static idl(name, typeOrOptions) {
    const options = parseIDLOptions(name, typeOrOptions);

    this.getIdls().set(name, options);

    Object.defineProperty(this.prototype, name, {
      enumerable: options.enumerable,
      /**
       * @this {CustomElement}
       * @return {any}
       */
      get() {
        if (this.#spying) {
          this.#spySets.at(-1).add(name);
        }
        if (!options.values.has(this)) return options.default;
        return options.values.get(this) ?? (options.nullable ? null : options.empty);
      },
      /**
       * @this {CustomElement}
       * @param {any} value
       * @return {void}
       */
      set(value) {
        if (value === CustomElement.IDL_INIT) return;
        // console.log('set:', this.constructor.name, name, value);
        const previousValue = this[name];
        let newValue = value;
        if (!options.nullable && value == null) {
          newValue = options.onNullish ? options.onNullish(value) : options.empty;
        }

        if (previousValue == null && newValue == null) return;
        // Object.is()?
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
              parsedValue = null;
              attrValue = null;
            } else {
              if (typeof newValue !== 'number') {
                throw new TypeError('Value must be a number');
              }
              parsedValue = newValue;
              attrValue = String(newValue);
            }
            break;
          // case 'string':
          default:
            if (newValue == null) {
              parsedValue = null;
              attrValue = null;
            } else {
              parsedValue = String(newValue);
              attrValue = parsedValue;
            }
        }
        if (previousValue === parsedValue) return;
        const lastAttrValue = options.attrValues.get(this);

        options.values.set(this, parsedValue);
        options.attrValues.set(this, attrValue);

        // console.log(this.static.name, 'Property change: idlChangedCallback', { name, previousValue, parsedValue });
        this.idlChangedCallback(name, previousValue, parsedValue);

        if (!options.reflect) return;
        if (lastAttrValue == null && attrValue == null) return;
        if (lastAttrValue === attrValue) return;

        if (attrValue == null) {
          this.removeAttribute(options.attr);
        } else {
          this.setAttribute(options.attr, attrValue);
        }
      },
    });

    return /** @type {any} */ (CustomElement.IDL_INIT);
  }

  /**
   * Wraps composeHtml with bind to `this` (not natively set with tagged template literals)
   * @return {HTMLTemplater<?>}
   */
  static get html() {
    if (!this._html) {
      this._html = this._templateHTML.bind(this);
    }
    return this._html;
  }

  /** @type {Map<string,HTMLElement>} */
  #shadowRefs = new Map();

  /** @type {Set<string>[]} */
  #spySets = [];

  #spying = false;

  /** @type {Record<string, HTMLElement>}} */
  refs = new Proxy({}, {
    /**
     * @param {any} target
     * @param {string} id
     * @return {HTMLElement}
     */
    get: (target, id) => {
      let element = this.#shadowRefs.get(id);
      if (element) return element;
      if (element === null) return null; // Cached null response

      // Undefined

      element = this.shadowRoot.getElementById(id);
      if (element) {
        this.#shadowRefs.set(id, element);
        return element;
      }

      const fullComposition = this.getFullComposition();
      const template = fullComposition.getElementById(id);
      if (!template) {
        // Cache not in full composition
        this.#shadowRefs.set(id, null);
        return null;
      }
      let parent = template;
      let cloneTarget = template;

      // Iterate backwards in template until used reference is found
      while ((parent = parent.parentElement) != null) {
        // Parent already in DOM and referenced
        if (this.#shadowRefs.has(parent.id)) break;

        // Parent already in DOM. Cache reference
        const liveElement = this.shadowRoot.getElementById(parent.id);
        if (liveElement) {
          this.#shadowRefs.set(liveElement.id, liveElement);
          break;
        }

        cloneTarget = parent;
      }

      const clone = cloneTarget.cloneNode(true);
      const iterator = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);

      let node = /** @type {HTMLElement} */ (clone);
      do {
        const nodeId = node.id;
        if (!nodeId) continue;
        if (!element && (nodeId === id)) {
          element = node;
        }
        this.#shadowRefs.set(node.id, node);
      } while ((node = iterator.nextNode()));
      return element;
    },
  });

  constructor() {
    super();
    this.#attachShadow();
    this.#attachStyles();
    this.#attachContent();
    this.#attachEvents();
    this.#attachInternals();
    this.#attachARIA();
  }

  /**
   * Updates component nodes based on data
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {?} data
   * @return {void}
   */
  render(data) {
    if (!data) return;

    const fnResults = new WeakMap();
    /** @type {WeakMap<Element, Set<string>>} */
    const modifiedNodes = new WeakMap();
    for (const [key, bindings] of this.static.getBindings()) {
      if (!(key in data)) continue;
      for (const { id, node, nodeType, fn, props, negate } of bindings) {
        const ref = this.refs[id];
        if (!ref) {
          console.warn('Non existent id', id);
          continue;
        }
        if (modifiedNodes.get(ref)?.has(node)) {
          // console.warn('Node already modified. Skipping', id, node);
          continue;
        }
        if (!ref.isConnected && node !== '_if') {
          // console.log(this.static.name, 'Offscreen rendering', ref, node);
        }
        let value;
        if (fn) {
          if (!fnResults.has(fn)) {
            const args = Object.fromEntries(
              [...props].map((prop) => [prop, prop in data ? data[prop] : valueFromPropName(prop, this)]),
            );
            value = fn.call(this, args);
            fnResults.set(fn, value);
          } else {
            value = fnResults.get(fn);
          }
        } else {
          value = data[key];
        }
        if (negate) {
          value = !value;
        }
        if (nodeType === Node.TEXT_NODE) {
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
        } else if (node === '_if') {
          if (value) {
            if (!ref.isConnected) {
              const fullComposition = this.getFullComposition();
              const parentID = fullComposition.getElementById(id)?.parentElement?.id;
              const parent = (parentID ? this.refs[parentID] : null) ?? this.shadowRoot;

              let commentNode;
              for (const child of parent.childNodes) {
                if (child.nodeType !== Node.COMMENT_NODE) continue;
                if ((/** @type {Comment} */child).nodeValue === id) {
                  commentNode = child;
                  break;
                }
              }
              if (!commentNode) {
                console.warn(this.static.name, 'Could not add', id, 'back to DOM');
              } else {
                commentNode.after(ref);
                // console.log(this.static.name, 'Add', id, 'back to', parentID ?? 'root', ref.outerHTML);
                commentNode.remove();
              }
            }
          } else if (ref.isConnected) {
            // console.log('Removing from DOM', ref);
            const commentPlaceholder = new Comment(id);
            ref.before(commentPlaceholder);
            ref.remove();
          }
        } else if (value === false || value == null) {
          ref.removeAttribute(node);
        } else {
          ref.setAttribute(node, value === true ? '' : value);
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
   * @param {any} oldValue
   * @param {any} newValue
   * @return {void}
   */
  idlChangedCallback(name, oldValue, newValue) {
    this.render({ [name]: newValue });
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // TODO: Index attribute names?
    for (const [key, options] of this.static.getIdls()) {
      if (options.attr !== name) continue;
      const previousDataValue = options.values.get(this);
      if (options.attrValues.get(this) === newValue) return;

      let parsedValue;
      switch (options.type) {
        case 'boolean':
          parsedValue = newValue != null;
          break;
        case 'string':
          parsedValue = newValue;
          break;
        case 'integer':
          if (newValue == null) {
            parsedValue = null;
          } else {
            const numValue = Number.parseInt(newValue, 10);
            parsedValue = Number.isNaN(numValue) ? null : numValue;
          }
          break;
        case 'float':
          if (newValue == null) {
            parsedValue = null;
          } else {
            const numValue = Number.parseFloat(newValue);
            parsedValue = Number.isNaN(numValue) ? null : numValue;
          }
          break;
        default:
      }
      if (!options.nullable && parsedValue == null) {
        parsedValue = options.empty;
      }
      if (parsedValue === previousDataValue) {
        // No internal value change
        return;
      }
      options.values.set(this, parsedValue);
      options.attrValues.set(this, newValue);
      this.idlChangedCallback(key, previousDataValue, parsedValue);
    }
  }

  #startSpy() {
    this.#spying = true;
    this.#spySets.push(new Set());
  }

  #pauseSpy() {
    this.#spying = false;
  }

  #resumeSpy() {
    this.#spying = false;
  }

  #stopSpy() {
    const result = this.#spySets.pop();
    this.#spying = (this.#spySets.length !== 0);
    return result;
  }

  #attachShadow() {
    this.attachShadow({ mode: 'open', delegatesFocus: this.static.delegatesFocus });
  }

  #attachStyles() {
    if (!CustomElement.supportsAdoptedStyleSheets) return;
    this.shadowRoot.adoptedStyleSheets = this.static.getAdoptedStyleSheets();
  }

  #attachContent() {
    this.shadowRoot.prepend(this.getComposition().cloneNode(true));
  }

  #attachInternals() {
    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }
  }

  #attachARIA() {
    if (this.static.supportsElementInternalsRole) {
      this.elementInternals.role = this.static.ariaRole;
    } else if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.static.ariaRole);
    }
  }

  #attachEvents() {
    for (const [id, events] of this.static.getEvents()) {
      /** @type {HTMLElement} */
      const ref = this.refs[id];
      if (!ref) {
        console.warn('Could not bind events for #', id);
        continue;
      }
      for (const { type, listener, options, prop } of events) {
        if (listener) {
          ref.addEventListener(type, listener, options);
          continue;
        }
        /** @type {any} */
        const value = valueFromPropName(prop, this);
        if (value) {
          ref.addEventListener(type, value, options);
          continue;
        }
        // If listener is a Class Field, it will not be available yet
        // Assume it will be and if not, it will throw the error anyway
        ref.addEventListener(type, (e) => valueFromPropName(prop, this)(e), options);
      }
    }
  }

  get static() { return /** @type {typeof CustomElement} */ (/** @type {unknown} */ (this.constructor)); }

  /**
   * @template {true|false} T
   * @param {T extends true ? Attr : Text } node
   * @param {T} [isAttr]
   * @return {void}
   */
  interpolateNode(node, isAttr) {
    const { nodeName, nodeValue, nodeType } = node;
    if (!nodeValue) return;
    const trimmed = nodeValue.trim();
    if (!trimmed) return;
    if (trimmed[0] !== '{') return;
    const { length } = trimmed;
    if (trimmed[length - 1] !== '}') return;

    let parsedValue = trimmed.slice(1, length - 1);
    const negate = parsedValue[0] === '!';
    if (negate) {
      parsedValue = parsedValue.slice(1);
    }

    /** @type {Element} */
    let element;
    let isEvent;
    let eventFlags;
    let textNodeIndex;

    if (isAttr === false || (nodeType === Node.TEXT_NODE)) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      element = node.parentElement;
      textNodeIndex = 0;
      let prev = node;
      while ((prev = prev.previousSibling)) {
        if (prev.nodeType === Node.TEXT_NODE) {
          textNodeIndex++;
        }
      }
    } else {
      // @ts-ignore Skip cast
      // eslint-disable-next-line unicorn/consistent-destructuring
      element = node.ownerElement;
      if (nodeName.startsWith('on')) {
        const [, flags, prop] = parsedValue.match(/^([*1~]+)?(.*)$/);
        eventFlags = flags;
        parsedValue = prop;
        isEvent = true;
      }
    }

    let { id } = element;
    if (!id) {
      id = generateUID();
      element.id = id;
    }

    /** @type {Function} */
    let fn;
    /** @type {Set<string>} */
    let props;

    if (isEvent) {
      const options = {
        once: eventFlags?.includes('1'),
        passive: eventFlags?.includes('~'),
        capture: eventFlags?.includes('*'),
      };

      const type = nodeName.slice(2);
      element.removeAttribute(nodeName);

      const events = this.static.getEvents();
      let set = events.get(id);
      if (!set) {
        set = new Set();
        events.set(id, set);
      }
      if (fn) {
        set.add({ type, options, listener: fn });
      } else {
        set.add({ type, options, prop: parsedValue });
      }
      return;
    }

    /** @type {any} */
    let defaultValue;
    let inlineFunctionOptions;
    // Is Inline Function?
    if (parsedValue.startsWith('#')) {
      inlineFunctionOptions = this.static.getInlineFunctions().get(parsedValue);
      if (!inlineFunctionOptions) {
        console.warn(`Invalid interpolation value: ${parsedValue}`);
        return;
      }
      if (inlineFunctionOptions.props) {
        console.log('This function has already been called. Reuse props');
        props = inlineFunctionOptions.props;
        defaultValue = inlineFunctionOptions.defaultValue ?? null;
      } else {
        defaultValue = inlineFunctionOptions.fn;
      }
    } else {
      defaultValue = valueFromPropName(parsedValue, this);
    }

    if (!props) {
      if (typeof defaultValue === 'function') {
        // Value must be reinterpolated and function spied upon
        fn = defaultValue;
        this.#startSpy();
        const pauseSpy = () => this.#pauseSpy();
        const resumeSpy = () => this.#resumeSpy();
        const argPoked = new Set();
        const argProxy = new Proxy(this, {
          get(target, p) {
            argPoked.add(p);
            pauseSpy();
            const value = Reflect.get(target, p);
            resumeSpy();
            return value;
          },
          has(target, p) {
            argPoked.add(p);
            pauseSpy();
            const value = Reflect.has(target, p);
            resumeSpy();
            return value;
          },
        });
        defaultValue = fn.call(this, argProxy);
        const thisPoked = this.#stopSpy();
        if (thisPoked.size) {
          if (!fn.name) {
            console.warn(this.static.name, 'anonymous function poked this?', [...thisPoked]);
            this.static.templatable = false;
          } else {
            // console.log(this.static.name, fn.name, 'used this:', [...thisPoked]);
          }
        }
        if (argPoked.size) {
          // console.log(this.static.name, fn.name || parsedValue || 'anonymous function', 'used arg:', [...argPoked]);
        }
        const combinedSet = new Set([
          ...argPoked,
          ...thisPoked,
        ]);

        if (!combinedSet.size) {
          console.warn(this.static.name, fn.name || parsedValue || 'anonymous function', ': No variables used. External references?');
        }

        props = combinedSet;
        // console.log(this.static.name, fn.name || parsedValue, combinedSet);
      } else {
        props = new Set([parsedValue]);
      }
    }

    if (typeof defaultValue === 'symbol') {
      console.warn(this.static.name, ': Invalid binding:', parsedValue);
      defaultValue = null;
    }

    if (negate) {
      defaultValue = !defaultValue;
    }

    if (inlineFunctionOptions) {
      inlineFunctionOptions.defaultValue = defaultValue;
      inlineFunctionOptions.props = props;
    }

    // Bind

    const bindings = this.static.getBindings();

    const parsedNodeName = textNodeIndex ? nodeName + textNodeIndex : nodeName;
    const entry = { id, node: parsedNodeName, fn, props, nodeType, defaultValue, negate };
    for (const prop of props) {
      let set = bindings.get(prop);
      if (!set) {
        set = new Set();
        bindings.set(prop, set);
      }
      set.add(entry);
    }

    // Mutate

    if (isAttr === false || (nodeType === Node.TEXT_NODE)) {
      node.nodeValue = defaultValue ?? '';
    } else if (nodeName === '_if') {
      element.removeAttribute(nodeName);
      if (defaultValue == null || defaultValue === false) {
        const commentPlaceholder = new Comment(id);
        element.before(commentPlaceholder);
        this.static._removedRefs.set(id, element);
      }
    } else if (defaultValue == null || defaultValue === false) {
      element.removeAttribute(nodeName);
    } else {
      element.setAttribute(nodeName, defaultValue === true ? '' : defaultValue);
    }

    // console.log(this.name, 'binding', isText ? '#text' : `[${nodeName}]`, 'of', id, 'with', parsedValue);
  }

  /**
   * @param {DocumentFragment} template source for interpolation (not mutated)
   * @return {DocumentFragment} Interpolation of content
   */
  interpolate(template) {
    const interpolation = /** @type {DocumentFragment} */ (template.cloneNode(true));
    if (!this.static.interpolatesTemplate) {
      this.static._fullComposition = /** @type {DocumentFragment} */ (interpolation.cloneNode(true));
      return interpolation;
    }

    // console.log(this.static.name, 'Interpolating', [...template.children].map((child) => child.outerHTML).join('\n'));

    const iterator = document.createTreeWalker(
      interpolation,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    );
    let node;
    while ((node = iterator.nextNode())) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          // eslint-disable-next-line github/array-foreach
          [...(/** @type {Element} */ (node)).attributes]
            // .sort((a, b) => a.name.localeCompare(b.name)) // Get _pragmas first
            .forEach((attr) => this.interpolateNode(attr, true));
          break;
        case Node.TEXT_NODE:
          this.interpolateNode(/** @type {Text} */ (node), false);
          break;
        default:
      }
    }

    const elements = [...this.static._removedRefs.values()].reverse();
    for (const element of elements) {
      let parent = element;
      while ((parent = parent.parentElement)) {
        parent.id ||= generateUID();
      }
    }

    this.static._fullComposition = /** @type {DocumentFragment} */ (interpolation.cloneNode(true));
    for (const element of elements) {
      element.remove();
    }
    return interpolation;
  }

  getFullComposition() {
    if (!this.static.hasOwnProperty('_fullComposition')) {
      this.getComposition();
    }
    return this.static._fullComposition;
  }

  getComposition() {
    if (this.static.hasOwnProperty('_composition')) {
      return this.static._composition;
    }
    this.#startSpy();
    const template = this.static.template;
    const composeProps = this.#stopSpy();
    if (composeProps.size) {
      console.warn('used composeProps', [...composeProps]);
    }
    const composition = this.interpolate(template);
    if (this.static.templatable === false) {
      console.warn(this.static.name, 'Cannot be used as template');
    } else {
      // Store instance template as static template
      // console.log(this.static.name, 'Storing composition', [...composition.children].map((child) => child.outerHTML).join('\n'));
      this.static._composition = composition;
    }
    return composition;
  }

  // eslint-disable-next-line class-methods-use-this
  connectedCallback() {
    // In case author calls super.connectedCallback();
  }

  // eslint-disable-next-line class-methods-use-this
  disconnectedCallback() {
    // In case author calls super.disconnectedCallback();
  }
}
