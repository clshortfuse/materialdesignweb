/* eslint-disable sort-class-members/sort-class-members */

import CompositionAdapter from './CompositionAdapter.js';
import { generateCSSStyleSheets, generateHTMLStyleElements } from './css.js';
import { observeFunction } from './observe.js';
import { createEmptyComment, createEmptyDiv, createEmptyTextNode } from './optimizations.js';
import { generateFragment, inlineFunctions } from './template.js';
import { generateUID } from './uid.js';

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
 * @prop {string} tag
 * @prop {string|number} subnode Index of childNode or attrName
 * @prop {boolean} [negate]
 * @prop {boolean} [doubleNegate]
 * @prop {Function} [fn]
 * @prop {Function} [render] custom render function
 * @prop {string[]} props
 * @prop {string[]} deepProps
 * @prop {Composition<any>} composition // Sub composition templating (eg: array)
 * @prop {T} defaultValue
 */

/**
 * @typedef InterpolateOptions
 * @prop {Object} [defaults] Default values to use for interpolation
 * @prop {Object} [injections] Context-specific injected properties. (Experimental)
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
 * ) == [houseNumber, 35]
 * @param {string} prop
 * @param {any} source
 * @return {null|[string, any]}
 */
function entryFromPropName(prop, source) {
  let value = source;
  let child;
  for (child of prop.split('.')) {
    if (!child) throw new Error(`Invalid property: ${prop}`);
    if (value == null) return null;
    if (child in value === false) return null;
    // @ts-ignore Skip cast
    value = value[child];
  }
  if (value === source) return null;
  return [child, value];
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
 * ) == [houseNumber, 35]
 * @param {string} prop
 * @param {any[]} sources
 * @return {null|[string, any]}
 */
function entryFromPropNameSources(prop, ...sources) {
  for (const source of sources) {
    const entry = entryFromPropName(prop, source);
    if (entry) return entry;
  }
  return null;
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
   * Collection of property bindings.
   * @type {string[]}
   */
  boundProps = [];

  /**
   * Data of arrays used in templates
   * Usage of a [mdw-for] will create an ArrayLike expectation based on key
   * Only store metadata, not actual data. Currently only needs length.
   * TBD if more is needed later
   * Referenced by property key (string)
   * @type {CompositionAdapter}
   */
  adapter;

  /**
   * Collection of events to bind.
   * Indexed by ID
   * @type {Map<string, import('./typings.js').CompositionEventListener<any>[]>}
   */
  events = new Map();

  /**
   * Registered how element should be found in tree
   * @type {Map<string, 'id'|'attr'>}
   */
  elementTagTypes = new Map();

  /**
   * Snapshot of composition at initial state.
   * This fragment can be cloned for first rendering, instead of calling
   * of using `render()` to construct the initial DOM tree.
   * @type {DocumentFragment}
   */
  cloneable;

  /**
   * LightDOM safe cloneable
   * Snapshot of composition at initial state.
   * This fragment can be cloned for first rendering, instead of calling
   * of using `render()` to construct the initial DOM tree.
   * @type {DocumentFragment}
   */
  cloneableUnscoped;

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
   * Expressions results are treated as observables
   * @type {WeakMap<Element|DocumentFragment, WeakMap<Function,any>>}
   */
  expressionCache = new WeakMap();

  /**
   * Maintains a reference list of elements used by render target (root).
   * When root is garbage collected, references are released.
   * This includes disconnected elements.
   * @type {WeakMap<Element|DocumentFragment, Map<string,HTMLElement>>}
   */
  referenceCache = new WeakMap();

  /**
   * List of IDs used by template elements
   * May be needed to be removed when adding to non-DocumentFragment
   * @type {string[]}
   */
  allIds = [];

  /**
   * Collection of IDs used for referencing elements
   * Not meant for live DOM. Removed before attaching to document
   */
  temporaryIds = new Set();

  /**
   * IDs of elements not present by default
   */
  removeIDs = new Set();

  /**
   * @type {Map<string, (number|string)[]>}
   */
  subnodesByTag = new Map();

  /**
   * @type {WeakMap<Element, Map<number, Node>>}
   */
  textNodeCache = new WeakMap();

  /** @param {Element} element */
  hideElement(element) {
    if (this.removedElements.has(element)) return;
    let comment = this.commentPlaceholders.get(element);
    if (!comment) {
      comment = createEmptyComment();
      this.commentPlaceholders.set(element, comment);
    }
    element.replaceWith(comment);
    this.removedElements.add(element);
  }

  /** @param {Element} element */
  showElement(element) {
    if (!this.removedElements.has(element)) return;
    // Skip check
    const comment = this.commentPlaceholders.get(element);
    comment.replaceWith(element);
    this.removedElements.delete(element);
  }

  /**
   * If force is not given, "toggles" element,
   * removing it if it is present and adding it if it is not present.
   * If force is true, adds qualifiedName.
   * If force is false, removes qualifiedName.
   *
   * Returns true if qualifiedName is now present, and false otherwise.
   * @param {Element} element
   * @param {boolean} [force]
   * @return {boolean}
   */
  toggleElement(element, force) {
    if (force || (force == null && this.removedElements.has(element))) {
      this.showElement(element);
      return true;
    }
    this.hideElement(element);
    return false;
  }

  /**
   *
   */
  referenceTree = new WeakMap();

  /**
   * Flag set when root is initially rendered
   * @type {WeakSet<Element|DocumentFragment>}
   */
  initiallyRendered = new WeakSet();

  /** @type {WeakMap<Element, Comment>} */
  commentPlaceholders = new WeakMap();

  /** @type {WeakMap<HTMLElement, Node>} */
  elementNodeCache = new WeakMap();

  /** @type {WeakSet<Element>} */
  removedElements = new WeakSet();

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
    const key = listener.tag ?? '';
    const set = this.events.get(key);
    if (set) {
      set.push(listener);
    } else {
      this.events.set(key, [listener]);
    }
    return this;
  }

  /**
   * Updates component nodes based on data.
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {Partial<?>} changes what
   * @param {DocumentFragment|ShadowRoot|HTMLElement} [target] where
   * @param {Object} [options]
   * @param {any} [options.context]
   * @param {any[]} [options.stores]
   * @return {Element} anchor
   */
  render(changes, target, { context, stores } = {}) {
    if (!this.interpolated) this.interpolate({ defaults: changes });

    /**
     * Node used for retrieving reference cache (view holder)
     * If target is ShadowRoot, target
     * If target is HTMLElement, target
     * If target is DocumentFragment or no target, firstElementChild of template
     * @type {Element}
     */
    let anchor;
    let references;
    const needsInitialRender = !target || !this.initiallyRendered.has(target);
    if (needsInitialRender) {
      const targetIsShadowRoot = target instanceof ShadowRoot;
      const targetIsDocumentFragment = target instanceof DocumentFragment;
      if (target) {
        // Handle styles first
        if ('adoptedStyleSheets' in target) {
          target.adoptedStyleSheets = [
            ...target.adoptedStyleSheets,
            ...this.adoptedStyleSheets,
          ];
        } else if (target instanceof ShadowRoot) {
          target.append(document.importNode(this.stylesFragment, true));
        }
      }

      // Create a clone of the cloneable template as a DocumentFragment
      const instanceFragment = /** @type {DocumentFragment} */ document.importNode(this.cloneable, true);
      // Select anchor
      anchor = (!target || (targetIsDocumentFragment && !targetIsShadowRoot))
        ? instanceFragment.firstElementChild
        : target;

      references = new Map();
      this.referenceCache.set(anchor, references);

      context ??= targetIsShadowRoot ? target.host : anchor;

      // Bind all elements by IDs
      /** @type {Element[]} */
      const elementsToHide = [];
      for (const id of this.allIds) {
        // Find element by id (should be faster than walking)
        const element = instanceFragment.getElementById(id);
        references.set(id, element);

        if (this.removeIDs.has(id)) {
          elementsToHide.push(element);
        }

        if (!targetIsShadowRoot || this.temporaryIds.has(id)) {
          console.debug('blanking id for non-shadow dom / tempId', id);
          // element.removeAttribute('id');
          element.id = '';
        }

        const subNodes = this.subnodesByTag.get(id);
        if (subNodes) {
          /** @type {Map<number, Text>}} */
          let textNodeMap;
          for (const subnode of this.subnodesByTag.get(id)) {
            if (typeof subnode === 'string') continue;
            const textNode = /** @type {Text} */ (element.childNodes.item(subnode));
            if (textNodeMap) {
              textNodeMap.set(subnode, textNode);
            } else {
              textNodeMap = new Map([[subnode, textNode]]);
              this.textNodeCache.set(element, textNodeMap);
            }
          }
        }
        const childEvents = this.events.get(id);
        if (childEvents) {
          for (const event of childEvents) {
            element.addEventListener(
              event.type,
              (event.handleEvent ?? entryFromPropNameSources(event.prop, changes, context, ...stores)[1]).bind(context),
              event,
            );
          }
        }
      }
      const rootEvents = this.events.get('');
      if (rootEvents) {
        for (const event of rootEvents) {
          context.addEventListener(
            event.type,
            (event.handleEvent ?? entryFromPropNameSources(event.prop, changes, context, ...stores)[1]),
            event,
          );
        }
      }
      for (const element of elementsToHide) {
        this.hideElement(element);
      }

      // Appending will call constructor() on Web Components
      // Leave last
      if (targetIsDocumentFragment) {
        target.append(instanceFragment);
      } else {
      // target.remove();
      }

      this.initiallyRendered.add(anchor);
    }

    const fnResults = new WeakMap();
    /** @type {WeakMap<Element, Set<string|number>>} */
    const modifiedNodes = new WeakMap();
    const args = {};
    const argKeys = new Set();

    anchor ??= target;
    references = this.referenceCache.get(target);
    context ??= target instanceof ShadowRoot ? target.host : anchor;

    for (const key of this.boundProps) {
      if (key in changes === false) continue;
      // console.log('using key', key);
      for (const { tag, subnode, fn, props, deepProps, negate, doubleNegate, render } of this.bindings.get(key)) {
        if (render) {
          if (fnResults.has(render)) continue;
          console.log('invoking custom render', key);
          const result = render.call(this, anchor, changes, context, ...stores);
          fnResults.set(render, result);
          continue;
        }

        /* 1. Find Element */

        // TODO: Avoid unnecessary element creation.
        // If element can be fully reconstructed with internal properties,
        // skip recreation of element unless it actually needs to added to DOM.
        // Requires tracing of all properties used by conditional elements.
        references ??= this.referenceCache.get(anchor);
        const ref = references.get(tag);
        if (!ref) {
          // console.warn('Composition: Non existent tag', tag);
          continue;
        }
        if (modifiedNodes.get(ref)?.has(subnode)) {
          // console.warn('Node already modified. Skipping', tag, node);
          continue;
        }

        // if (!ref.parentElement && node !== 'mdw-if') {
        //   if (ref.parentNode === root) {
        //     console.debug('Offscreen? root? rendering', ref, node, ref.tag, root.host.outerHTML);
        //   } else {
        //     console.debug('Offscreen rendering', ref, node, ref.tag, root.host.outerHTML);
        //   }
        // }

        /* 2. Compute value */
        let value;
        if (fn) {
          if (fnResults.has(fn)) {
            value = fnResults.get(fn);
          } else {
            for (const prop of props) {
              if (argKeys.has(prop)) continue;
              if (prop in changes) {
                args[prop] = changes[prop];
                argKeys.add(prop);
                continue;
              }
              for (const store of stores) {
                console.log('prop', prop, 'not in changes');
                if (prop in store) {
                  args[prop] = store[prop];
                  argKeys.add(prop);
                  break;
                }
              }
            }
            if (deepProps?.length) {
              console.warn('need deep prop', deepProps);
            }
            // for (const deepProp of deepProps) { // TODO: fix deep props }
            value = fn.call(context, args);
            fnResults.set(fn, value);
          }
        } else if (deepProps.length) {
          const changeEntry = entryFromPropName(deepProps[0], changes);
          if (!changeEntry) continue;
          value = changeEntry[1];
        } else {
          value = changes[key];
        }

        /* 3. Operate on value */
        if (doubleNegate) {
          value = !!value;
        } else if (negate) {
          value = !value;
        }

        if (subnode === 'mdw-if') {
          // Node is element itself
          this.toggleElement(ref, value !== null && value !== false);
        } else if (typeof subnode === 'string') {
          if (value === false || value == null) {
            ref.removeAttribute(subnode);
          } else {
            ref.setAttribute(subnode, value === true ? '' : value);
          }
        } else {
          const textNode = this.textNodeCache.get(ref).get(subnode);
          textNode.nodeValue = value ?? '';
        }

        /* 5. Mark Node as modified */
        const set = modifiedNodes.get(ref);
        if (set) {
          set.add(subnode);
        } else {
          modifiedNodes.set(ref, new Set([subnode]));
        }
      }
    }
    return anchor;
  }

  /**
   * @param {Attr|Text} node
   * @param {Element} element
   * @param {InterpolateOptions} [options]
   * @param {string} [parsedValue]
   * @return {boolean} Remove node
   */
  #interpolateNode(node, element, options, parsedValue) {
    const { nodeValue, nodeName, nodeType } = node;

    /** @type {Attr} */
    let attr;
    /** @type {Text} */
    let text;
    if (nodeType === Node.ATTRIBUTE_NODE) {
      attr = /** @type {Attr} */ (node);
    } else {
      text = /** @type {Text} */ (node);
    }

    // 1. Get template strings(s) in node if not passed
    if (parsedValue == null) {
      if (!nodeValue) return false;
      const trimmed = nodeValue.trim();
      if (!trimmed) return false;
      if (attr) {
        if (trimmed[0] !== '{') return false;
        const { length } = trimmed;
        if (trimmed[length - 1] !== '}') return false;
        parsedValue = trimmed.slice(1, -1);
        // TODO: Support segmented attribute values
      } else {
        // Split text node into segments
        // TODO: Benchmark indexOf pre-check vs regex

        const segments = trimmed.split(STRING_INTERPOLATION_REGEX);
        if (segments.length < 3) return false;
        if (segments.length === 3 && !segments[0] && !segments[2]) {
          parsedValue = segments[1];
        } else {
          for (const [index, segment] of segments.entries()) {
            // is even = is template string
            if (index % 2) {
              const newNode = createEmptyTextNode();
              text.before(newNode);
              this.#interpolateNode(newNode, element, options, segment);
            } else if (segment) {
              text.before(segment);
            }
          }
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

    if (text) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (element !== text.parentElement) {
        console.warn('mismatch?');
        element = text.parentElement;
      }
      textNodeIndex = 0;
      /** @type {ChildNode} */
      let prev = text;
      while ((prev = prev.previousSibling)) {
        textNodeIndex++;
      }
    } else {
      // @ts-ignore Skip cast
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (element !== attr.ownerElement) {
        console.warn('mismatch?');
        element = attr.ownerElement;
      }
      if (nodeName.startsWith('on')) {
        // Do not interpolate inline event listeners
        if (nodeName[2] !== '-') return false;
        isEvent = true;
      }
    }

    if (isEvent) {
      element.removeAttribute(nodeName);
      const tag = this.#tagElement(element);
      const eventType = nodeName.slice(3);
      const [, flags, type] = eventType.match(/^([*1~]+)?(.*)$/);

      this.addCompositionEventListener({
        tag,
        type,
        handleEvent: parsedValue.startsWith('#') ? inlineFunctions.get(parsedValue).fn : null,
        prop: parsedValue.startsWith('#') ? null : parsedValue,
        once: flags?.includes('1'),
        passive: flags?.includes('~'),
        capture: flags?.includes('*'),
      });

      return false;
    }

    /** @type {Function} */
    let fn;
    /** @type {string[]} */
    let props;
    /** @type {string[]} */
    let deepProps;

    /** @type {any} */
    let defaultValue = null;
    let inlineFunctionOptions;
    // Is Inline Function?
    if (parsedValue.startsWith('#')) {
      // TODO: Inline expressions are not observable
      inlineFunctionOptions = inlineFunctions.get(parsedValue);
      if (!inlineFunctionOptions) {
        console.warn(`Invalid interpolation value: ${parsedValue}`);
        return false;
      }
      if (inlineFunctionOptions.props) {
        console.log('This function has already been called. Reuse props', inlineFunctionOptions, this);
        props = inlineFunctionOptions.props;
        deepProps = inlineFunctionOptions.deepProps;
        defaultValue = inlineFunctionOptions.defaultValue ?? null;
      } else {
        defaultValue = inlineFunctionOptions.fn;
      }
    } else {
      defaultValue = null;
      if (options?.defaults) {
        defaultValue = valueFromPropName(parsedValue, options.defaults);
      }
      if (defaultValue == null && options?.injections) {
        defaultValue = valueFromPropName(parsedValue, options.injections);
        console.log('default value from injection', parsedValue, { defaultValue });
      }
    }

    if (!props) {
      if (typeof defaultValue === 'function') {
        // Value must be reinterpolated and function observed
        const observeResult = observeFunction.call(this, defaultValue, options?.defaults);
        let injectionResult;
        if (options?.injections) {
          injectionResult = observeFunction.call(this, defaultValue, options?.injections);
          console.log('injection results', injectionResult);
        }
        fn = defaultValue;
        defaultValue = observeResult.defaultValue;
        props = observeResult.props;
        deepProps = observeResult.deepProps;
        // console.log(this.static.name, fn.name || parsedValue, combinedSet);
      } else {
        const indexOfDot = parsedValue.indexOf('.');
        if (indexOfDot === -1) {
          props = [parsedValue];
          deepProps = [];
        } else {
          props = [parsedValue.slice(0, indexOfDot)];
          deepProps = [parsedValue];
          console.log('found deep props', parsedValue, props, deepProps);
        }
      }
    }

    if (typeof defaultValue === 'symbol') {
      console.warn('Invalid binding:', parsedValue);
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
      inlineFunctionOptions.deepProps = deepProps;
    }

    // Mutate

    let tag;
    let remove = false;
    if (text) {
      node.nodeValue = defaultValue ?? '';
    } else if (nodeName === 'mdw-if') {
      tag = this.#tagElement(element);
      element.removeAttribute(nodeName);
      if (defaultValue == null || defaultValue === false) {
        // If default state is removed, mark for removal
        remove = true;
        this.removeIDs.add(tag);
      }
    } else if (defaultValue == null || defaultValue === false) {
      element.removeAttribute(nodeName);
    } else {
      element.setAttribute(nodeName, defaultValue === true ? '' : defaultValue);
    }

    tag ??= this.#tagElement(element);
    // Bind
    const subnode = textNodeIndex ?? nodeName;
    const entry = { tag, subnode, fn, props, deepProps, nodeType, defaultValue, negate, doubleNegate };
    const subnodeArray = this.subnodesByTag.get(tag);
    if (subnodeArray) {
      subnodeArray.push(subnode);
    } else {
      this.subnodesByTag.set(tag, [subnode]);
    }
    for (const prop of props) {
      this.addBinding(prop, entry);
    }

    return remove;
  }

  /**
   * @param {HTMLElement} element
   * @return {string}
   */
  #tagElement(element) {
    let id = element.id;
    if (id) {
      if (!this.allIds.includes(id)) {
        this.allIds.push(id);
      }
    } else {
      id = generateUID();
      this.temporaryIds.add(id);
      this.allIds.push(id);
      element.id = id;
    }
    return id;
  }

  /**
   * TODO: Subtemplating lacks optimization, though functional.
   *   - Would benefit from custom type handler for arrays
   * to avoid multi-iteration change-detection.
   *   - Could benefit from debounced/throttled render
   * @param {Element} element
   * @param {InterpolateOptions} options
   * @return {?Composition<?>}
   */
  interpolateIterable(element, options) {
    // TODO: Microbenchmark element.attributes
    const forAttr = element.getAttribute('mdw-for');
    const trimmed = forAttr?.trim();
    if (!trimmed) {
      console.warn('Malformed mdw-for found at', element);
      return null;
    }

    if (trimmed[0] !== '{') {
      console.warn('Malformed mdw-for found at', element);
      return null;
    }
    const { length } = trimmed;
    if (trimmed[length - 1] !== '}') {
      console.warn('Malformed mdw-for found at', element);
      return null;
    }
    const parsedValue = trimmed.slice(1, -1);
    const [valueName, iterable] = parsedValue.split(/\s+of\s+/);
    element.removeAttribute('mdw-for');
    // Create a new composition targetting element as root

    const elementAnchor = createEmptyDiv();
    element.replaceWith(elementAnchor);
    const tag = this.#tagElement(elementAnchor);
    this.removeIDs.add(tag);

    const newComposition = new Composition();
    newComposition.template.append(element);
    // Move uninterpolated element to new composition template.
    const injections = {
      ...options.injections,
      [valueName]: null,
    };

    /** @type {NodeBindEntry<?>} */
    const entry = {
      tag,
      composition: newComposition,
      /**
       * Updates component nodes based on data.
       * Expects data in JSON Merge Patch format
       * @see https://www.rfc-editor.org/rfc/rfc7386
       * @param {DocumentFragment|ShadowRoot} root where
       * @param {Partial<?>} changes what
       * @param {any} [context] who
       * @param {Partial<?>[]} [stores] If needed, where to grab extra props
       * @return {void}
       */
      render: (root, changes, context, ...stores) => {
        console.debug('composition adapter render', root, changes);
        if (!newComposition.adapter) {
          const instanceAnchorElement = this.referenceCache.get(root).get(tag);
          const commentAnchor = this.commentPlaceholders.get(instanceAnchorElement);

          newComposition.adapter = new CompositionAdapter({
            anchorNode: commentAnchor,
          });
        }

        const { adapter, bindings } = newComposition;
        const arraySource = changes[iterable];
        const modifiedElements = new Set();
        let hasOtherProperties = false;
        for (const [key] of bindings) {
          if (key === iterable) continue;
          if (key in changes) {
            hasOtherProperties = true;
            break;
          }
        }
        if (arraySource) {
          const innerChanges = { ...changes };
          let length = null;
          if (Array.isArray(arraySource)) {
            console.warn('Full render of array', arraySource);
            length = arraySource.length;
            for (let i = adapter.domRefs.length - 1; i >= length; i--) {
              adapter.removeByIndex(i);
            }
            for (const [index, item] of arraySource.entries()) {
              if (index >= length) {
                console.log('short-circuiting at', index);
                break;
              }
              let adapterElement = adapter.elementRefs[index];
              innerChanges[valueName] = item;
              const renderedElement = newComposition.render(
                innerChanges,
                adapterElement,
                { context, stores },
              );
              if (!adapterElement) {
                adapterElement = renderedElement;
                adapter.insertByIndex(index, adapterElement);
              }

              modifiedElements.add(adapterElement);
            }
          } else {
            /** @type {number[]} */
            const removals = [];
            if ('length' in arraySource) {
              console.log('length has changed');
              length = arraySource.length;
              for (let i = adapter.domRefs.length - 1; i >= length; i--) {
                console.log('fast removing', i);
                adapter.removeByIndex(i);
              }
            }

            for (const [key, item] of Object.entries(arraySource)) {
              if (key !== 'length') {
                const index = Number.parseInt(key, 10);
                if (length != null && index >= length) {
                  console.log('short-circuiting at', index);
                  break;
                }
                if (Number.isNaN(index)) {
                  console.warn('NOT A NUMBER?', changes);
                } else if (item == null) {
                  console.warn('null value in object at', index);
                  removals.push(index);
                } else {
                  let adapterElement = adapter.elementRefs[index];
                  innerChanges[valueName] = item;
                  const renderedElement = newComposition.render(
                    innerChanges,
                    adapterElement,
                    { context, stores },
                  );
                  if (!adapterElement) {
                    adapterElement = renderedElement;
                    adapter.insertByIndex(index, adapterElement);
                  }
                  modifiedElements.add(adapterElement);
                }
              }
            }
            for (const index of removals.reverse()) {
              adapter.removeByIndex(index);
            }
          }
        }
        if (hasOtherProperties) {
          // Iterate through ALL adapter items to invoke this partial change
          const arrayInStoreEntry = entryFromPropNameSources(iterable, ...stores);
          const storedArray = arrayInStoreEntry ? arrayInStoreEntry[1] : [];
          for (const [index, subElement] of adapter.elementRefs.entries()) {
            if (modifiedElements.has(subElement)) continue;
            // Item is not part of change, is part of store
            newComposition.render(
              changes,
              subElement,
              {
                context,
                stores: stores.concat({
                  item: storedArray[index],
                }),
              },
            );

            modifiedElements.add(subElement);
          }
        }
      },
    };
    newComposition.interpolate({
      defaults: options.defaults,
      injections,
    });
    for (const subProp of newComposition.bindings.keys()) {
      if (subProp !== iterable) {
        console.log('subtemplate rendering will require prop:', subProp);
        // Add binding to parent property
        this.addBinding(subProp, entry);
      }
    }
    console.log('adding', iterable, 'bind to', this);
    this.addBinding(iterable, entry);
    return newComposition;
  }

  /**
   * @param {InterpolateOptions} [options]
   */
  interpolate(options) {
    // console.log('Template', [...this.template.children].map((child) => child.outerHTML).join('\n'));

    // Copy template before working on it
    // Store into `cloneable` to split later into `interpolation`
    this.cloneable = /** @type {DocumentFragment} */ (this.template.cloneNode(true));

    const TREE_WALKER_FILTER = 5; /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT */

    const treeWalker = document.createTreeWalker(this.cloneable, TREE_WALKER_FILTER);
    /** Note: `node` and treeWalker.currentNode may deviate */
    let node = treeWalker.nextNode();
    while (node) {
      /** @type {Element} */
      let element = null;
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

          if (element.hasAttribute('mdw-for')) {
            node = treeWalker.nextSibling();
            this.interpolateIterable(element, options);
          } else {
            const idAttr = element.attributes.id;
            if (idAttr) {
              this.#interpolateNode(idAttr, element, options);
              this.#tagElement(element);
            }
            for (const attr of [...element.attributes].reverse()) {
              if (attr.nodeName === 'id') continue; // Already handled
              this.#interpolateNode(attr, element, options);
            }
          }

          break;
        case Node.TEXT_NODE:
          element = node.parentNode;
          if (this.#interpolateNode(/** @type {Text} */ (node), element, options)) {
            const nextNode = treeWalker.nextNode();
            node.remove();
            node = nextNode;
            continue;
          }

          break;
        default:
          throw new Error(`Unexpected node type: ${node.nodeType}`);
      }
      node = treeWalker.nextNode();
    }

    // Split into `interpolation` before removing elements
    /** @type {DocumentFragment} */
    this.interpolation = /** @type {DocumentFragment} */ (this.cloneable.cloneNode(true));

    // console.debug('Interpolated', [...this.interpolation.children].map((child) => child.outerHTML).join('\n'));

    // Remove elements from `cloneable` and place comment placeholders
    // Remove in reverse so conditionals within conditionals are properly isolated

    for (const watcher of this.watchers) {
      this.bindWatcher(watcher, options?.defaults);
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
   * @param {*} fn
   * @param {any} defaults
   * @return {boolean} reusable
   */
  bindWatcher(fn, defaults) {
    const { props, defaultValue, reusable } = observeFunction(fn, defaults);
    const entry = { fn, props, defaultValue };
    for (const prop of props) {
      this.addBinding(prop, entry);
    }
    return reusable;
  }

  /**
   * @param {string} prop
   * @param {NodeBindEntry<?>} entry
   * @return {Set<NodeBindEntry<?>>} Mutable set of bindings for prop
   */
  addBinding(prop, entry) {
    if (!this.boundProps.includes(prop)) {
      this.boundProps.push(prop);
    }
    let set = this.bindings.get(prop);
    if (set) {
      set.add(entry);
    } else {
      set = new Set([entry]);
      this.bindings.set(prop, set);
    }
    return set;
  }
}
