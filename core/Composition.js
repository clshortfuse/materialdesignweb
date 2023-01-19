/* eslint-disable sort-class-members/sort-class-members */
import { generateCSSStyleSheets, generateHTMLStyleElements } from './css.js';
import { findElement, iterateNodes } from './dom.js';
import { identifierFromElement, identifierFromKey, identifierMatchesElement, keyFromIdentifier } from './identify.js';
import { observeFunction } from './observe.js';
import { generateFragment, inlineFunctions } from './template.js';

/**
 * @template T
 * @typedef {Composition<?>|HTMLStyleElement|CSSStyleSheet|DocumentFragment|((this:T, changes:T) => any)|string} CompositionPart
 */

/**
 * @template {any} T
 * @callback Compositor
 * @param {...(CompositionPart<T>)} parts source for interpolation (not mutated)
 * @return {Composition<T>}
 */

/**
 * @template T
 * @typedef {Object} WatcherBindEntry
 * @prop {Function} fn
 * @prop {Set<keyof T & string>} props
 */

/** @typedef {import('./identify.js').ElementIdentifier} ElementIdentifier */
/** @typedef {import('./identify.js').ElementIdentifierKey} ElementIdentifierKey */

/**
 * @template {any} T
 * @typedef {Object} NodeBindEntry
 * @prop {ElementIdentifier} identifier
 * @prop {number} nodeType
 * @prop {string} node
 * @prop {boolean} [negate]
 * @prop {Function} [fn]
 * @prop {Set<keyof T & string>} props
 * @prop {T} defaultValue
 */

/**
 * @param {string} prop
 * @param {any} source
 * @return {any}
 */
function valueFromPropName(prop, source) {
  let value = source;
  for (const child of prop.split('.')) {
    if (!child) {
      value = null;
      break;
    }
    // @ts-ignore Skip cast
    value = value[child];
  }
  if (value === source) return null;
  return value;
}

/**
 * Returns event listener bound to shadow root host
 * Use this function avoid generating extra closures
 * @this {HTMLElement}
 * @param {Function} fn
 */
function buildShadowRootChildListener(fn) {
  /** @param {Event & {currentTarget:{getRootNode: () => ShadowRoot}}} event */
  return function onShadowRootChildEvent(event) {
    const host = event.currentTarget.getRootNode().host;
    fn.call(host, event);
  };
}

/**
 * @example
 *  propInSource(
 *    'address.home.houseNumber',
 *    {
 *      address: {
 *        home: {
 *          houseNumber:35,
 *        },
 *      }
 *    }
 * ) === {value:35}
 * @param {string} prop
 * @param {any} source
 * @return {null|{value:any}}
 */
function propFromObject(prop, source) {
  let value = source;
  for (const child of prop.split('.')) {
    if (!child) return null; // Invalid
    if (child in value === false) return null;
    // @ts-ignore Skip cast
    value = value[child];
  }
  if (value === source) return null;
  return { value };
}

/** @template T */
export default class Composition {
  /**
   * Collection of property bindings.
   * @type {Map<keyof T & string, Set<NodeBindEntry<?>>>}
   */
  bindings = new Map();

  /**
   * Collection of events to bind.
   * Indexed by ElementIdentifierKey
   * @type {Map<ElementIdentifierKey, Set<import('./typings.js').CompositionEventListener<any>>>}
   */
  events = new Map();

  /**
   * Snapshot of composition at initial state.
   * This fragment can be cloned for first rendering, instead of calling
   * of using `render()` to construct the initial DOM tree.
   * @type {DocumentFragment}
   */
  cloneable;

  /**
   * Result of interpolation of the composition template.
   * Includes all DOM elements, which is used to reference for adding and
   * removing DOM elements during render.
   * @type {DocumentFragment}
   */
  interpolation;

  /** @type {(HTMLStyleElement|CSSStyleSheet)[]} */
  styles = [];

  /** @type {CSSStyleSheet[]} */
  adoptedStyleSheets = [];

  /** @type {DocumentFragment} */
  stylesFragment;

  /** @type {((this:T, changes:T) => any)[]} */
  watchers = [];

  /**
   * Maintains a reference list of elements used by render target (root).
   * When root is garbage collected, references are released.
   * This includes disconnected elements.
   * @type {WeakMap<Element|DocumentFragment, Map<string,HTMLElement>}
   */
  referenceCache = new WeakMap();

  /** Flag set when template and styles have been interpolated */
  interpolated = false;

  /**
   * @param {(CompositionPart<T>)[]} parts
   */
  constructor(...parts) {
    /**
     * Template used to build interpolation and cloneable
     */
    this.template = generateFragment();
    this.append(...parts);
  }

  * [Symbol.iterator]() {
    for (const part of this.styles) {
      yield part;
    }
    yield this.template;
    for (const part of this.watchers) {
      yield part;
    }
  }

  /**
   * @param {CompositionPart<T>[]} parts
   */
  append(...parts) {
    for (const part of parts) {
      if (typeof part === 'string') {
        this.append(generateFragment(part.trim()));
      } else if (typeof part === 'function') {
        this.watchers.push(part);
      } else if (part instanceof Composition) {
        this.append(...part);
      } else if (part instanceof DocumentFragment) {
        this.template.append(part);
      } else if (part instanceof CSSStyleSheet || part instanceof HTMLStyleElement) {
        this.styles.push(part);
      }
    }
    // Allow chaining
    return this;
  }

  /** @param {import('./typings.js').CompositionEventListener<T>} listener */
  addEventListener(listener) {
    const key = listener.target ? keyFromIdentifier(listener.target) : '';
    let set = this.events.get(key);
    if (!set) {
      set = new Set();
      this.events.set(key, set);
    }
    set.add(listener);
    return this;
  }

  /**
   * Updates component nodes based on data
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {Element|DocumentFragment} root where
   * @param {Partial<?>} data what
   * @param {any} [context] who
   * @return {void}
   */
  render(root, data, context) {
    if (!this.initiallyRendered) this.initialRender(root, data);

    if (!data) return;

    const fnResults = new WeakMap();
    /** @type {WeakMap<Element, Set<string>>} */
    const modifiedNodes = new WeakMap();
    // TODO: Used indexed seek vs scan
    for (const [key, entries] of this.bindings) {
      const propSearch = propFromObject(key, data);
      if (!propSearch) continue;
      for (const { identifier, node, nodeType, fn, props, negate } of entries) {
        let value;
        let ref;
        let identifierKey;
        if (identifier) {
          ref = this.getElement(root, identifier);
          if (!ref) {
            ref = this.getElement(root, identifier);
            console.warn('Non existent id', identifier);
            continue;
          }
        }
        if (fn) {
          if (fnResults.has(fn)) {
            value = fnResults.get(fn);
          } else {
            const args = Object.fromEntries(
              [...props].map((prop) => [prop, prop in data ? data[prop] : valueFromPropName(prop, context)]),
            );
            value = fn.call(context, args);
            fnResults.set(fn, value);
          }
        } else {
          value = propSearch.value;
        }
        if (!ref) continue;
        if (modifiedNodes.get(ref)?.has(node)) {
        // console.warn('Node already modified. Skipping', id, node);
          continue;
        }

        // TODO: Benchmark against with isConnected
        // if (!root.contains(ref) && node !== '_if') {
        //  console.log('Offscreen rendering', ref, node);
        // }

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
          const attached = root.contains(ref);
          if (value !== null && value !== false) {
            if (!attached) {
              const sourceElement = findElement(this.interpolation, identifier);
              if (!sourceElement) {
                console.error(identifier);
                throw new Error('could not find in source');
              }
              // Find DOM representation of parent;
              const sourceParentNode = sourceElement.parentNode;
              const parent = sourceParentNode instanceof Element
                ? this.getElement(root, identifierFromElement(sourceParentNode))
                : root;
              if (!parent) {
                console.error(identifier);
                throw new Error('could not parent at all!');
              }

              let commentNode;
              identifierKey ??= keyFromIdentifier(identifier);
              for (const child of parent.childNodes) {
                if (child.nodeType !== Node.COMMENT_NODE) continue;
                if ((/** @type {Comment} */child).nodeValue === identifierKey) {
                  commentNode = child;
                  break;
                }
              }
              if (commentNode) {
                commentNode.after(ref);
                // console.log('Add', identifier, 'back', ref.outerHTML);
                commentNode.remove();
              } else {
                console.warn('Could not add', identifier, 'back to DOM');
              }
              const events = this.events.get(identifierKey);
              if (events) {
                for (const entry of events) {
                  let eventListener;
                  if (entry.handleEvent) {
                    eventListener = entry.handleEvent;
                  } else if (entry.prop?.startsWith('#')) {
                    // console.log('binding to inline function');
                    eventListener = inlineFunctions.get(entry.prop).fn;
                  } else {
                    eventListener = valueFromPropName(entry.prop, data);
                  }
                  if (eventListener) {
                    // console.log('Bind event to added element', identifier, ref, eventListener, ref.isConnected);
                    ref.addEventListener(entry.type, eventListener, entry);
                  } else {
                    console.warn('Could not bind event', identifier, entry.prop);
                  }
                }
              }
            }
          } else if (attached) {
            // console.log('Remove', identifier, ref.outerHTML);
            const commentPlaceholder = new Comment(keyFromIdentifier(identifier));
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
   * @param {Object} [defaults]
   */
  interpolate(defaults) {
    // console.log('Template', [...template.children].map((child) => child.outerHTML).join('\n'));
    this.cloneable = /** @type {DocumentFragment} */ (this.template.cloneNode(true));

    /** @type {Map<string,Element>} */
    const removalList = new Map();

    for (const node of iterateNodes(this.cloneable, { element: true, attribute: true, text: true })) {
      const { nodeName, nodeValue, nodeType } = node;

      if (nodeType === Node.ELEMENT_NODE) {
        // Processing of Element
        if (node instanceof HTMLTemplateElement) {
          console.warn('Not supported');
          continue;
        }
        if (node instanceof HTMLStyleElement) {
          this.styles.push(node);
          node.remove();
        }
        if (node instanceof HTMLScriptElement) {
          console.warn('Not supported');
          continue;
        }
      }

      if (!nodeValue) continue;
      const trimmed = nodeValue.trim();
      if (!trimmed) continue;
      if (trimmed[0] !== '{') continue;
      const { length } = trimmed;
      if (trimmed[length - 1] !== '}') continue;

      let parsedValue = trimmed.slice(1, length - 1);
      const negate = parsedValue[0] === '!';
      if (negate) {
        parsedValue = parsedValue.slice(1);
      }

      /** @type {Element} */
      let element;
      let isEvent;
      let textNodeIndex;

      if (nodeType === Node.TEXT_NODE) {
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
          // Do not interpolate inline event listeners
          if (nodeName[2] !== '-') continue;
          isEvent = true;
        }
      }

      const identifier = identifierFromElement(element, true);
      const identifierKey = keyFromIdentifier(identifier);

      if (isEvent) {
        const eventType = nodeName.slice(3);
        const [, flags, type] = eventType.match(/^([*1~]+)?(.*)$/);
        const options = {
          once: flags?.includes('1'),
          passive: flags?.includes('~'),
          capture: flags?.includes('*'),
        };

        element.removeAttribute(nodeName);

        let set = this.events.get(identifierKey);
        if (!set) {
          set = new Set();
          this.events.set(identifierKey, set);
        }
        if (parsedValue.startsWith('#')) {
          set.add({ type, handleEvent: inlineFunctions.get(parsedValue).fn, ...options });
        } else {
          set.add({ type, prop: parsedValue, ...options });
        }
        continue;
      }

      /** @type {Function} */
      let fn;
      /** @type {Set<string>} */
      let props;

      /** @type {any} */
      let defaultValue;
      let inlineFunctionOptions;
      // Is Inline Function?
      if (parsedValue.startsWith('#')) {
        inlineFunctionOptions = inlineFunctions.get(parsedValue);
        if (!inlineFunctionOptions) {
          console.warn(`Invalid interpolation value: ${parsedValue}`);
          continue;
        }
        if (inlineFunctionOptions.props) {
          console.log('This function has already been called. Reuse props');
          props = inlineFunctionOptions.props;
          defaultValue = inlineFunctionOptions.defaultValue ?? null;
        } else {
          defaultValue = inlineFunctionOptions.fn;
        }
      } else {
        defaultValue = valueFromPropName(parsedValue, defaults);
      }

      if (!props) {
        if (typeof defaultValue === 'function') {
          // Value must be reinterpolated and function observed
          const observeResult = observeFunction.call(this, defaultValue, defaults);
          fn = defaultValue;
          defaultValue = observeResult.defaultValue;
          props = observeResult.props;
          // console.log(this.static.name, fn.name || parsedValue, combinedSet);
        } else {
          props = new Set([parsedValue]);
        }
      }

      if (typeof defaultValue === 'symbol') {
        console.warn(': Invalid binding:', parsedValue);
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
      const parsedNodeName = textNodeIndex ? nodeName + textNodeIndex : nodeName;
      const entry = { identifier, node: parsedNodeName, fn, props, nodeType, defaultValue, negate };
      for (const prop of props) {
        let set = this.bindings.get(prop);
        if (!set) {
          set = new Set();
          this.bindings.set(prop, set);
        }
        set.add(entry);
      }

      // Mutate

      if (nodeType === Node.TEXT_NODE) {
        node.nodeValue = defaultValue ?? '';
      } else if (nodeName === '_if') {
        element.removeAttribute(nodeName);
        if (defaultValue == null || defaultValue === false) {
          removalList.set(identifierKey, element);
        }
      } else if (defaultValue == null || defaultValue === false) {
        element.removeAttribute(nodeName);
      } else {
        element.setAttribute(nodeName, defaultValue === true ? '' : defaultValue);
      }
    }

    const elements = [...removalList.values()].reverse();
    for (const element of elements) {
      let parent = element;
      while ((parent = parent.parentElement)) {
        identifierFromElement(parent, true);
      }
    }

    /** @type {DocumentFragment} */
    this.interpolation = /** @type {DocumentFragment} */ (this.cloneable.cloneNode(true));

    // console.log('Interpolated', [...this.interpolation.children].map((child) => child.outerHTML).join('\n'));

    for (const [key, element] of removalList) {
      const commentPlaceholder = new Comment(key);
      element.before(commentPlaceholder);
      element.remove();
    }

    for (const watcher of this.watchers) {
      this.bindWatcher(watcher, defaults);
    }

    if ('adoptedStyleSheets' in document) {
      this.adoptedStyleSheets = [
        ...generateCSSStyleSheets(this.styles),
      ];
    } else {
      this.stylesFragment = generateFragment();
      this.stylesFragment.append(
        ...generateHTMLStyleElements(this.styles),
      );
    }

    this.interpolated = true;

    // console.log('Cloneable', [...this.cloneable.children].map((child) => child.outerHTML).join('\n'));
  }

  /**
   * Updates component nodes based on data
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {Element|DocumentFragment|ShadowRoot} root where
   * @param {Partial<?>} data what
   * @return {void}
   */
  initialRender(root, data) {
    if (!this.interpolated) this.interpolate(data);

    if ('adoptedStyleSheets' in root) {
      root.adoptedStyleSheets = [
        ...root.adoptedStyleSheets,
        ...this.adoptedStyleSheets,
      ];
    } else if (root instanceof ShadowRoot) {
      root.append(this.stylesFragment.cloneNode(true));
    } else {
      // console.warn('Cannot apply styles to singular element');
    }

    root.append(this.cloneable.cloneNode(true));

    // console.log('Initial render', [...root.children].map((child) => child.outerHTML).join('\n'));

    const rootElement = root instanceof ShadowRoot ? root.host : root;
    // Bind events in reverse order to support stopImmediatePropagation
    for (const [identifier, events] of [...this.events].reverse()) {
      const element = identifier
        ? this.getElement(root, identifier) // Bind events even if not in DOM to avoid tree-walk later
        : rootElement;
      if (!element) {
        console.warn('Skip bind events for', identifier);
        continue;
      }
      for (const entry of [...events].reverse()) {
        let listener = entry.listener;
        if (!listener) {
          if (root instanceof ShadowRoot) {
            listener = entry.handleEvent ?? valueFromPropName(entry.prop, data);
            if (element !== rootElement) {
              // Wrap to retarget this
              listener = buildShadowRootChildListener(listener);
            }
            // Cache and reuse
            entry.listener = listener;
            // console.log('caching listener', entry);
          } else {
            console.warn('creating new listener', entry);
            listener = entry.handleEvent ?? ((event) => {
              valueFromPropName(entry.prop, data)(event);
            });
          }
        }
        element.addEventListener(entry.type, listener, entry);
      }
    }

    this.initiallyRendered = true;
  }

  /**
   * @param {Element|DocumentFragment} root
   * @return {Map<string,Element>}
   */
  getReferences(root) {
    let references = this.referenceCache.get(root);
    if (!references) {
      references = new Map();
      this.referenceCache.set(root, references);
    }
    return references;
  }

  /**
   * @param {Element|DocumentFragment} root
   * @param {ElementIdentifier|ElementIdentifierKey} identifierOrKey
   * @return {Element}
   */
  getElement(root, identifierOrKey) {
    const references = this.getReferences(root);
    /** @type {ElementIdentifierKey} */
    let key;
    /** @type {ElementIdentifier} */
    let identifier;
    if (typeof identifierOrKey === 'object') {
      identifier = identifierOrKey;
      key = keyFromIdentifier(identifier);
    } else {
      key = identifierOrKey;
      identifier = identifierFromKey(key);
    }
    let element = references.get(key);
    if (element) return element;
    if (element === null) return null; // Cached null response

    // Undefined

    element = findElement(root, identifier);

    if (element) {
      references.set(key, element);
      return element;
    }

    const sourceElement = findElement(this.interpolation, identifier);
    if (!sourceElement) {
      // Cache not in full composition
      references.set(key, null);
      return null;
    }
    let parent = sourceElement;
    let cloneTarget = sourceElement;

    // Iterate backwards in template until used reference is found
    while ((parent = parent.parentElement) != null) {
      // Parent already in DOM and referenced
      const parentIdentifier = identifierFromElement(parent);
      const parentIdentifierKey = keyFromIdentifier(parentIdentifier);
      if (references.has(parentIdentifierKey)) break;

      // Parent already in DOM. Cache reference
      const liveElement = findElement(root, parentIdentifier);
      if (liveElement) {
        const liveIdentifier = identifierFromElement(liveElement);
        if (liveIdentifier) {
          references.set(keyFromIdentifier(liveIdentifier), liveElement);
        } else {
          console.warn('Could not cache live node', liveElement);
        }
        break;
      }

      cloneTarget = parent;
    }

    const clone = /** @type {Element} */ (cloneTarget.cloneNode(true));
    for (const node of iterateNodes(clone, { element: true, self: true })) {
      if (!element && (identifierMatchesElement(identifier, node))) {
        element = node;
      }
      const nodeIdentifier = identifierFromElement(node);
      if (nodeIdentifier) {
        // console.log('Caching element', nodeIdentifier);
        references.set(keyFromIdentifier(nodeIdentifier), node);
      } else {
        console.warn('Could not cache node', node);
      }
    }
    return element;
  }

  /**
   * @param {*} fn
   * @param {any} defaults
   * @return {boolean} reusable
   */
  bindWatcher(fn, defaults) {
    const { props, defaultValue, reusable } = observeFunction(fn, defaults);
    const entry = { fn, props, defaultValue };
    for (const prop of props) {
      let set = this.bindings.get(prop);
      if (!set) {
        set = new Set();
        this.bindings.set(prop, set);
      }
      set.add(entry);
    }
    return reusable;
  }
}
