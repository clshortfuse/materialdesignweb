/* eslint-disable sort-class-members/sort-class-members */
import { generateCSSStyleSheets, generateHTMLStyleElements } from './css.js';
import { identifierFromElement } from './identify.js';
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

/**
 * @template {any} T
 * @typedef {Object} NodeBindEntry
 * @prop {string} id
 * @prop {number} nodeType
 * @prop {string} node
 * @prop {boolean} [negate]
 * @prop {boolean} [doubleNegate]
 * @prop {Function} [fn]
 * @prop {Set<keyof T & string>} props
 * @prop {T} defaultValue
 */

/** Splits: `{template}text{template}` as `['', 'template', 'text', 'template', '']` */
const STRING_INTERPOLATION_REGEX = /{([^}]*)}/g;

/**
 * Returns event listener bound to shadow root host.
 * Use this function to avoid generating extra closures
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
 *
 * @param {Object} object
 * @param {'dot'|'bracket'} [syntax]
 * @param {Object} [target]
 * @param {string} [scope]
 * @return {Object}
 */
function flattenObject(object, syntax = 'dot', target = {}, scope = '') {
  for (const [key, value] of Object.entries(object)) {
    if (!key) continue; // Blank keys are not supported;
    const scopedKey = scope ? `${scope}.${key}` : key;
    target[scopedKey] = value;
    if (value != null && typeof value === 'object') {
      flattenObject(value, syntax, target, scopedKey);
    }
  }
  if (Array.isArray(object)) {
    const scopedKey = scope ? `${scope}.length` : 'length';
    target[scopedKey] = object.length;
  }
  return target;
}

/**
 * @example
 *  entryFromPropName(
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
 * @return {null|[string, any]}
 */
function entryFromPropName(prop, source) {
  let value = source;
  let child;
  for (child of prop.split('.')) {
    if (!child) throw new Error(`Invalid property: ${prop}`);
    if (child in value === false) return null;
    // @ts-ignore Skip cast
    value = value[child];
  }
  if (value === source) return null;
  return [child, value];
}

/**
 * @param {string} prop
 * @param {any} source
 * @return {any}
 */
function valueFromPropName(prop, source) {
  let value = source;
  for (const child of prop.split('.')) {
    if (!child) return null;
    // @ts-ignore Skip cast
    value = value[child];
    if (value == null) return null;
  }
  if (value === source) return null;
  return value;
}

/** @template T */
export default class Composition {
  /**
   * Collection of property bindings.
   * @type {Map<keyof T & string, Set<NodeBindEntry<?>>>}
   */
  bindings = new Map();

  /**
   * Data of arrays used in templates
   * Usage of a [_for] will create an ArrayLike expectation based on key
   * Only store metadata, not actual data. Currently only needs length.
   * TBD if more is needed later
   * Referenced by property key (string)
   * @type {Map<keyof T & string, ArrayMetadata<T>}
   */
  arrayMetadata = new Map();

  /**
   * Collection of events to bind.
   * Indexed by ID
   * @type {Map<string, Set<import('./typings.js').CompositionEventListener<any>>>}
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
   * @type {WeakMap<Element|DocumentFragment, Map<string,HTMLElement>>}
   */
  referenceCache = new WeakMap();

  /**
   * Part of interpolation phase.
   * Maintains a reference list of conditional elements that were removed from
   * `cloneable` due to default state. Used to reconstruct conditional elements
   * with conditional children in default state as well (unlike `interpolation`).
   * @type {Map<string, {element: Element, id: string, parentId: string, commentCache: WeakMap<Element|DocumentFragment,Comment>}>}
   */
  conditionalElementMetadata = new Map();

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
  addCompositionEventListener(listener) {
    const key = listener.id ?? '';
    let set = this.events.get(key);
    if (!set) {
      set = new Set();
      this.events.set(key, set);
    }
    set.add(listener);
    return this;
  }

  /**
   * Updates component nodes based on data.
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {DocumentFragment|ShadowRoot} root where
   * @param {Partial<?>} changes what
   * @param {any} [context] who
   * @param {Partial<?>} [store] If needed, where to grab extra props
   * @return {void}
   */
  render(root, changes, context, store) {
    if (!this.initiallyRendered) this.initialRender(root, changes);

    if (!changes) return;

    const fnResults = new WeakMap();
    /** @type {WeakMap<Element, Set<string>>} */
    const modifiedNodes = new WeakMap();

    // Iterate data instead of bindings.
    // TODO: Avoid double iteration and flatten on-the-fly
    const flattened = flattenObject(changes);

    for (const [key, rawValue] of Object.entries(flattened)) {
      const entries = this.bindings.get(key);
      if (!entries) continue;
      for (const { id, node, nodeType, fn, props, negate, doubleNegate } of entries) {
        /* 1. Find Element */

        // TODO: Avoid unnecessary element creation.
        // If element can be fully reconstructed with internal properties,
        // skip recreation of element unless it actually needs to added to DOM.
        // Requires tracing of all properties used by conditional elements.
        const ref = this.getElement(root, id);
        if (!ref) {
          console.warn('Non existent id', id);
          continue;
        }
        if (!ref) continue;
        if (modifiedNodes.get(ref)?.has(node)) {
          // console.warn('Node already modified. Skipping', id, node);
          continue;
        }

        // if (!ref.parentElement && node !== '_if') {
        //   if (ref.parentNode === root) {
        //     console.debug('Offscreen? root? rendering', ref, node, ref.id, root.host.outerHTML);
        //   } else {
        //     console.debug('Offscreen rendering', ref, node, ref.id, root.host.outerHTML);
        //   }
        // }

        /* 2. Compute value */
        let value;
        if (fn) {
          if (fnResults.has(fn)) {
            value = fnResults.get(fn);
          } else {
            const args = structuredClone(changes);
            for (const prop of props) {
              if (prop in flattened) continue;
              let lastIndexOfDot = prop.lastIndexOf('.');
              if (lastIndexOfDot === -1) {
                // console.debug('injected shallow', prop);
                args[prop] = store[prop];
              } else {
                // Relying on props being sorted...
                console.debug('need deep', prop);
                let entry;
                let propSearchKey = prop;
                let lastPropSearchKey = prop;
                while (!entry) {
                  entry = entryFromPropName(propSearchKey, args);
                  if (entry) {
                    const propName = lastPropSearchKey.slice(propSearchKey.length + 1);
                    entry[1][propName] = valueFromPropName(lastPropSearchKey, store);
                    break;
                  }
                  if (lastIndexOfDot === -1) break;
                  lastPropSearchKey = prop;
                  propSearchKey = prop.slice(0, lastIndexOfDot);
                  lastIndexOfDot = propSearchKey.lastIndexOf(',');
                }
                if (!entry) {
                  console.warn('what do?');
                }
              }
            }
            value = fn.call(context, args);
            fnResults.set(fn, value);
          }
        } else {
          value = rawValue;
        }

        /* 3. Operate on value */
        if (doubleNegate) {
          value = !!value;
        } else if (negate) {
          value = !value;
        }

        /* 4. Find Target Node */
        if (nodeType === Node.TEXT_NODE) {
          const index = (node === '#text')
            ? 0
            : Number.parseInt(node.slice('#text'.length), 10);
          let nodesFound = 0;
          for (const childNode of ref.childNodes) {
            if (childNode.nodeType !== Node.TEXT_NODE) continue;
            if (index !== nodesFound++) continue;
            childNode.nodeValue = value ?? '';
            break;
          }
          if (index > nodesFound) {
            console.warn('Node not found, adding?');
            ref.append(value);
          }
        } else if (node === '_if') {
          const attached = root.contains(ref);
          const orphaned = ref.parentElement == null && ref.parentNode !== root;
          const shouldShow = value !== null && value !== false;
          if (orphaned && ref.parentNode) {
            console.warn('Orphaned with parent node?', id, { attached, orphaned, shouldShow }, ref.parentNode);
          }
          if (attached !== !orphaned) {
            console.warn('Conditional state', id, { attached, orphaned, shouldShow });
            console.warn('Not attached and not orphaned. Should do nothing?', ref, ref.parentElement);
          }
          if (shouldShow) {
            if (orphaned) {
              const metadata = this.conditionalElementMetadata.get(id);
              if (!metadata) {
                console.error(id);
                throw new Error('Could not find conditional element metadata');
              }

              let comment = metadata.commentCache.get(root);
              if (!comment) {
                console.debug('Composition: Comment not cached, building first time');
                const parent = metadata.parentId
                  ? this.getElement(root, metadata.parentId)
                  : root;
                if (!parent) {
                  console.error(id);
                  throw new Error('Could not find reference parent!');
                }

                const commentText = `{#${id}}`;
                for (const child of parent.childNodes) {
                  if (child.nodeType !== Node.COMMENT_NODE) continue;
                  if ((/** @type {Comment} */child).nodeValue === commentText) {
                    comment = child;
                    break;
                  }
                }
                metadata.commentCache.set(this, comment);
              }
              if (comment) {
                console.debug('Composition: Add', id, 'back', ref.outerHTML);
                comment.replaceWith(ref);
              } else {
                console.warn('Could not add', id, 'back to parent');
              }
            }
          } else if (!orphaned) {
            const metadata = this.conditionalElementMetadata.get(id);
            if (!metadata) {
              console.error(id);
              throw new Error(`Could not find conditional element metadata for ${id}`);
            }
            let comment = metadata.commentCache.get(root);
            if (!comment) {
              comment = new Comment(`{#${id}}`);
              metadata.commentCache.set(this, comment);
            }
            console.debug('Composition: Remove', id, ref.outerHTML);
            ref.replaceWith(comment);
          }
        } else if (value === false || value == null) {
          ref.removeAttribute(node);
        } else {
          ref.setAttribute(node, value === true ? '' : value);
        }

        /* 5. Mark Node as modified */
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
   * @param {Attr|Text} node
   * @param {Element} element
   * @param {Object} [defaults]
   * @param {string} [parsedValue]
   * @return {boolean} Remove node
   */
  #interpolateNode(node, element, defaults, parsedValue) {
    const { nodeValue, nodeName, nodeType } = node;

    if (parsedValue == null) {
      if (!nodeValue) return false;
      const trimmed = nodeValue.trim();
      if (!trimmed) return false;
      if (nodeType === Node.ATTRIBUTE_NODE) {
        if (trimmed[0] !== '{') return false;
        const { length } = trimmed;
        if (trimmed[length - 1] !== '}') return false;
        parsedValue = trimmed.slice(1, -1);
      } else {
        // Split text node into segments
        // TODO: Benchmark indexOf pre-check vs regex

        const segments = trimmed.split(STRING_INTERPOLATION_REGEX);
        if (segments.length < 3) return false;
        if (segments.length === 3 && !segments[0] && !segments[2]) {
          parsedValue = segments[1];
        } else {
          segments.forEach((segment, index) => {
            // is even = is template string
            if (index % 2) {
              const newNode = new Text();
              node.before(newNode);
              this.#interpolateNode(newNode, element, defaults, segment);
            } else {
              if (!segment) return; // blank
              node.before(segment);
            }
          });
          // node.remove();
          return true;
        }
      }
    }

    const negate = parsedValue[0] === '!';
    let doubleNegate = false;
    if (negate) {
      parsedValue = parsedValue.slice(1);
      doubleNegate = parsedValue[0] === '!';
      if (doubleNegate) {
        parsedValue = parsedValue.slice(1);
      }
    }

    let isEvent;
    let textNodeIndex;

    if (nodeType === Node.TEXT_NODE) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (element !== node.parentElement) {
        console.warn('mismatch?');
        element = node.parentElement;
      }
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
      if (element !== node.ownerElement) {
        console.warn('mismatch?');
        element = node.ownerElement;
      }
      if (nodeName.startsWith('on')) {
        // Do not interpolate inline event listeners
        if (nodeName[2] !== '-') return false;
        isEvent = true;
      }
    }

    const id = identifierFromElement(element, true);

    if (isEvent) {
      const eventType = nodeName.slice(3);
      const [, flags, type] = eventType.match(/^([*1~]+)?(.*)$/);
      const options = {
        once: flags?.includes('1'),
        passive: flags?.includes('~'),
        capture: flags?.includes('*'),
      };

      element.removeAttribute(nodeName);

      let set = this.events.get(id);
      if (!set) {
        set = new Set();
        this.events.set(id, set);
      }
      if (parsedValue.startsWith('#')) {
        set.add({ type, handleEvent: inlineFunctions.get(parsedValue).fn, ...options });
      } else {
        set.add({ type, prop: parsedValue, ...options });
      }
      return false;
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
        return false;
      }
      if (inlineFunctionOptions.props) {
        console.log('This function has already been called. Reuse props', inlineFunctionOptions, this);
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

    if (doubleNegate) {
      defaultValue = !!defaultValue;
    } else if (negate) {
      defaultValue = !defaultValue;
    }

    if (inlineFunctionOptions) {
      inlineFunctionOptions.defaultValue = defaultValue;
      inlineFunctionOptions.props = props;
    }

    // Bind
    const parsedNodeName = textNodeIndex ? nodeName + textNodeIndex : nodeName;
    const entry = { id, node: parsedNodeName, fn, props, nodeType, defaultValue, negate, doubleNegate };
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
        // If default state is removed, mark for removal
        return true;
      }
    } else if (defaultValue == null || defaultValue === false) {
      element.removeAttribute(nodeName);
    } else {
      element.setAttribute(nodeName, defaultValue === true ? '' : defaultValue);
    }
    return false;
  }

  /**
   * @param {Object} [defaults]
   */
  interpolate(defaults) {
    // console.log('Template', [...this.template.children].map((child) => child.outerHTML).join('\n'));

    // Copy template before working on it
    // Store into `cloneable` to split later into `interpolation`
    this.cloneable = /** @type {DocumentFragment} */ (this.template.cloneNode(true));

    /**
     * Track elements to be removed before using for cloning
     * @type {Element[]}
     */
    const removalList = [];

    const TREE_WALKER_FILTER = 5; /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT */

    const treeWalker = document.createTreeWalker(this.cloneable, TREE_WALKER_FILTER);
    let node = treeWalker.nextNode();
    while (node) {
      /** @type {Element} */
      let element = null;
      let removeElement = false;
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          element = node;
          if (element instanceof HTMLTemplateElement) {
            node = treeWalker.nextSibling();
            continue;
          }
          if (node instanceof HTMLStyleElement) {
            // Move style elements out of cloneable
            if (node.parentNode === this.cloneable) {
              this.styles.push(node);
              node.remove();
              node = treeWalker.nextSibling();
              continue;
            }
            console.warn('<style> element not moved');
          }
          if (node instanceof HTMLScriptElement) {
            console.warn('<script> element found.');
            node.remove();
            node = treeWalker.nextSibling();
            continue;
          }
          for (const attr of [...element.attributes].reverse()) {
            if (attr.nodeName === '_if') {
              // Ensure elements to be removed has identifiable parent
              const id = identifierFromElement(element, true);
              const parentId = element.parentElement
                ? identifierFromElement(element.parentElement, true)
                : null;
              this.conditionalElementMetadata.set(id, {
                element,
                id,
                parentId,
                commentCache: new WeakMap(),
              });
            }
            removeElement ||= this.#interpolateNode(attr, element, defaults);
          }

          break;
        case Node.TEXT_NODE:
          element = node.parentNode;
          if (this.#interpolateNode(/** @type {Text} */ (node), element, defaults)) {
            const nextNode = treeWalker.nextNode();
            node.remove();
            node = nextNode;
            continue;
          }

          break;
        default:
          throw new Error(`Unexpected node type: ${node.nodeType}`);
      }
      if (removeElement) {
        removalList.push(element);
      }
      node = treeWalker.nextNode();
    }

    // Split into `interpolation` before removing elements
    /** @type {DocumentFragment} */
    this.interpolation = /** @type {DocumentFragment} */ (this.cloneable.cloneNode(true));

    // console.debug('Interpolated', [...this.interpolation.children].map((child) => child.outerHTML).join('\n'));

    // Remove elements from `cloneable` and place comment placeholders
    // Remove in reverse so conditionals within conditionals are properly isolated
    for (const element of [...removalList].reverse()) {
      const { id } = element;
      element.replaceWith(new Comment(`{#${id}}`));
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
   * @param {DocumentFragment|ShadowRoot} root where
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
      // TODO: Support document styles
      // console.warn('Cannot apply styles to singular element');
    }

    root.append(this.cloneable.cloneNode(true));

    // console.log('Initial render', [...root.children].map((child) => child.outerHTML).join('\n'));

    /** @type {EventTarget} */
    const rootEventTarget = root instanceof ShadowRoot ? root.host : root;
    // Bind events in reverse order to support stopImmediatePropagation
    for (const [id, events] of [...this.events].reverse()) {
      // Prepare all event listeners first
      for (const entry of [...events].reverse()) {
        let listener = entry.listener;
        if (!listener) {
          if (root instanceof ShadowRoot) {
            listener = entry.handleEvent ?? valueFromPropName(entry.prop, data);
            if (id) {
              // Wrap to retarget this
              listener = buildShadowRootChildListener(listener);
            }
            // Cache and reuse
            entry.listener = listener;
            // console.log('caching listener', entry);
          } else {
            throw new TypeError('Anonymous event listeners cannot be used in templates');
            // console.warn('creating new listener', entry);
            // listener = entry.handleEvent ?? ((event) => {
            //   valueFromPropName(entry.prop, data)(event);
            // });
          }
        }
        const eventTarget = id ? root.getElementById(id) : rootEventTarget;
        if (!eventTarget) {
          // Element is not available yet. Bind on reference
          console.debug('Composition: Skip bind events for', id);
          continue;
        }
        eventTarget.addEventListener(entry.type, listener, entry);
      }
    }

    this.initiallyRendered = true;
  }

  /**
   * @param {string} id
   * @param {Element} element
   */
  attachEventListeners(id, element) {
    const events = this.events.get(id);
    if (events) {
      console.debug('attaching events for', id);
    } else {
      // console.log('no events for', id);
      return;
    }
    for (const entry of [...this.events.get(id)].reverse()) {
      const { listener } = entry;
      if (!listener) {
        throw new Error('Template must be interpolated before attaching events');
      }
      element.addEventListener(entry.type, listener, entry);
    }
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
   * @param {ShadowRoot|DocumentFragment} root
   * @param {string} id
   * @return {Element}
   */
  getElement(root, id) {
    const references = this.getReferences(root);
    let element = references.get(id);
    if (element) {
      // console.log('Returning from cache', id);
      return element;
    }
    if (element === null) return null; // Cached null response

    // Undefined

    // console.log('Search in DOM', id);
    element = root.getElementById(id);

    if (element) {
      // console.log('Found in DOM', id);
      references.set(id, element);
      return element;
    }

    // Element not in DOM means child of conditional element
    /** @type {Element} */
    let anchorElement;

    // Check if element is conditional
    let cloneTarget = this.conditionalElementMetadata.get(id)?.element;

    if (!cloneTarget) {
      // Check if element even exists in interpolation
      // Check interpolation (full-tree) first
      const interpolatedElement = this.interpolation.getElementById(id);
      if (!interpolatedElement) {
        console.warn('Not in full-tree', id);
        // Cache not in full composition
        references.set(id, null);
        return null;
      }
      // Iterate backgrounds until closest conditional element
      // const anchorElementId = this.template.getElementById(id).closest('[_if]').id;
      // anchorElement = this.references.get(anchorElementId)  this.interpolation.getElementById(anchorElementId).cloneNode(true);
      let parentElement = interpolatedElement;
      while ((parentElement = parentElement.parentElement) != null) {
        const parentId = parentElement.id;
        if (!parentId) {
          console.warn('Parent does not have ID!');
          cloneTarget = parentElement;
          continue;
        }

        // Parent already referenced
        const referencedParent = references.get(parentId);
        if (referencedParent) {
          // Element may have been removed without ever tree-walking
          console.debug('Parent already referenced', parentId, '>', id);
          anchorElement = referencedParent;
          break;
        }

        const liveElement = root.getElementById(parentId);
        if (liveElement) {
          console.warn('Parent in DOM and not referenced', parentId, '>', id);
          // Parent already in DOM. Cache reference
          references.set(parentId, liveElement);
          anchorElement = referencedParent;
          break;
        }

        const conditionalParent = this.conditionalElementMetadata.get(parentId)?.element;
        if (conditionalParent) {
          console.debug('Found parent conditional element', parentId, '>', id);
          cloneTarget = conditionalParent;
          break;
        }

        cloneTarget = parentElement;
      }
    }

    anchorElement ??= /** @type {Element} */ (cloneTarget.cloneNode(true));

    // Iterate downwards and cache all references
    let node = anchorElement;
    const iterator = document.createTreeWalker(anchorElement, NodeFilter.SHOW_ELEMENT);
    do {
      const nodeIdentifier = node.id;
      if (!element && nodeIdentifier === id) {
        element = node;
      }

      if (nodeIdentifier) {
        // console.debug('Caching element', nodeIdentifier);
        references.set(nodeIdentifier, node);
        if (cloneTarget) {
          // Attach events regardless of DOM state.
          // EventTargets should still fire even if not part of live document
          this.attachEventListeners(id, element);
        }
      } else {
        console.warn('Could not cache node', node);
      }
    } while ((node = iterator.nextNode()));
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
