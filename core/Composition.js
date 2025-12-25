/* eslint-disable sort-class-members/sort-class-members */

import CompositionAdapter from './CompositionAdapter.js';
import { generateCSSStyleSheets, generateHTMLStyleElements } from './css.js';
import { observeFunction } from './observe.js';
import { createEmptyComment, createEmptyTextNode } from './optimizations.js';
import { generateFragment, inlineFunctions } from './template.js';
import { generateUID } from './uid.js';

/**
 * @template T
 * @typedef {Composition<?>|HTMLStyleElement|CSSStyleSheet|DocumentFragment|string} CompositionPart
 */

/**
 * @template {any} T
 * @callback Compositor
 * @param {...(CompositionPart<T>)} parts source for interpolation (not mutated)
 * @return {Composition<T>}
 */

/**
 * @template T
 * @typedef {Object} RenderOptions
 * @prop {T} [defaults] what
 * @prop {T} [store] what
 * @prop {DocumentFragment|HTMLElement|Element} [target] where
 * @prop {ShadowRoot} [shadowRoot] where
 * @prop {any} [context] `this` on callbacks/events
 * @prop {any} [injections]
 */

/**
 * @template T
 * @typedef {{
 *  target: Element|DocumentFragment,
 *  byProp: (prop: keyof T & string, value:any, data?:Partial<T>) => void,
 *  state: InitializationState,
 * } &  ((changes:Partial<T>, data:T) => void)} RenderDraw
 */

/** @typedef {HTMLElementEventMap & { input: InputEvent; } } HTMLElementEventMapFixed */

/**
 * @typedef {(
 * Pick<HTMLElementEventMapFixed,
 *  'auxclick' |
 *  'beforeinput' |
 *  'click' |
 *  'compositionstart' |
 *  'contextmenu' |
 *  'drag' |
 *  'dragenter' |
 *  'dragover' |
 *  'dragstart' |
 *  'drop' |
 *  'invalid' |
 *  'keydown' |
 *  'keypress' |
 *  'keyup' |
 *  'mousedown' |
 *  'mousemove' |
 *  'mouseout' |
 *  'mouseover' |
 *  'mouseup' |
 *  'pointerdown' |
 *  'pointermove' |
 *  'pointerout' |
 *  'pointerover' |
 *  'pointerup' |
 *  'reset' |
 *  'selectstart' |
 *  'submit' |
 *  'touchend' |
 *  'touchmove' |
 *  'touchstart' |
 *  'wheel'
 *  >
 *  )} HTMLElementCancellableEventMap
 */

/**
 * @typedef {(
 *   HTMLElementEventMapFixed
 *   & {[P in keyof HTMLElementCancellableEventMap as `~${P}`]: HTMLElementCancellableEventMap[P]}
 *   & Record<string, Event|CustomEvent<any>>
 * )} CompositionEventMap
 */

/**
 * @template {any} T
 * @template {keyof CompositionEventMap} [K = keyof CompositionEventMap]
 * @typedef {{
 * type?: K
 * tag?: string|symbol,
 * capture?: boolean;
 * once?: boolean;
 * passive?: boolean;
 * signal?: AbortSignal;
 * handleEvent?: (
 *     this: T,
 *     event: (K extends keyof CompositionEventMap ? CompositionEventMap[K] : Event) & {currentTarget:HTMLElement}
 *   ) => any;
 * prop?: string;
 * deepProp?: string[],
 * }} CompositionEventListener
 */

/**
 * @template T
 * @typedef {{
 * [P in keyof CompositionEventMap]?: (keyof T & string)
 *   | ((this: T, event: CompositionEventMap[P] & {currentTarget:HTMLElement}) => any)
 *   | CompositionEventListener<T, P>
 * }} CompositionEventListenerObject
 */

/**
 * @template {any} T
 * @typedef {Object} NodeBindEntry
 * @prop {string} [key]
 * @prop {number} [index]
 * @prop {string} tag
 * @prop {string|number} subnode Index of childNode or attrName
 * @prop {string[]} props
 * @prop {string[][]} deepProps
 * @prop {boolean} [negate]
 * @prop {boolean} [doubleNegate]
 * @prop {Function} [expression]
 * @prop {(options: RenderOptions<?>, element: Element, changes:any, data:any) => any} [render] custom render function
 * @prop {CompositionEventListener<T>[]} [listeners]
 * @prop {Composition<any>} [composition] // Sub composition templating (eg: array)
 * @prop {T} defaultValue
 */

/** @typedef {any[]} RenderState */

/**
 * @typedef RenderGraphSearch
 *  @prop {(state:InitializationState, changes:any, data:any) => any}  invocation
 *  @prop {number}  cacheIndex
 *  @prop {number}  searchIndex
 *  @prop {string | Function | string[]}  query
 *  @prop {boolean} [negate]
 *  @prop {boolean} [doubleNegate]
 *  @prop {Function}  [expression]
 *  @prop {string}  prop
 *  @prop {string[]}  deepProp
 *  @prop {string[]}  propsUsed
 *  @prop {string[][]}  deepPropsUsed
 *  @prop {any} defaultValue
 *  @prop {RenderGraphSearch}  [subSearch]
 */

/**
 * @typedef RenderGraphAction
 * @prop {(state:InitializationState, value:any, changes: any, data:any) => any} invocation
 * @prop {number} [commentIndex]
 * @prop {number} [nodeIndex]
 * @prop {number} [cacheIndex]
 * @prop {string} [attrName]
 * @prop {any} [defaultValue]
 * @prop {RenderGraphSearch} search
 * @prop {InterpolateOptions['injections']} [injections]
 */

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDOMAttribute({ nodes }, value) {
  const { nodeIndex, attrName } = this;
  const element = /** @type {Element} */ (nodes[nodeIndex]);
  switch (value) {
    case undefined:
    case null:
    case false:
      element.removeAttribute(attrName);
      return false;
    case true:
      element.setAttribute(attrName, '');
      return '';
    default:
      element.setAttribute(attrName, value);
      return value;
  }
}

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDynamicNode({ nodeStates, comments, nodes }, value) {
  const { commentIndex, nodeIndex } = this;
  const nodeState = nodeStates[nodeIndex];
  // eslint-disable-next-line no-bitwise
  const hidden = nodeState & 0b0001;
  const show = value != null && value !== false;
  if (!show) {
    // Should be hidden
    if (hidden) return;
    // Replace whatever node is there with the comment
    let comment = comments[commentIndex];
    if (!comment) {
      comment = createEmptyComment();
      comments[commentIndex] = comment;
    }
    nodes[nodeIndex].replaceWith(comment);
    // eslint-disable-next-line no-bitwise
    nodeStates[nodeIndex] |= 0b0001;
    return;
  }
  // Must be shown
  // Update node first (offscreen rendering)
  const node = nodes[nodeIndex];
  // eslint-disable-next-line no-bitwise
  const isDynamicNode = nodeState & 0b0010;

  if (typeof value === 'object') {
    // Not string data, need to replace
    console.warn('Dynamic nodes not supported yet');
  } else if (isDynamicNode) {
    const textNode = new Text(value);
    node.replaceWith(textNode);
    nodes[nodeIndex] = textNode;
    // eslint-disable-next-line no-bitwise
    nodeStates[nodeIndex] &= ~0b0010;
  } else {
    /** @type {Text} */ (node).data = value;
  }

  // Updated, now set hidden state

  if (hidden) {
    const comment = comments[commentIndex];
    comment.replaceWith(node);
    // eslint-disable-next-line no-bitwise
    nodeStates[nodeIndex] &= ~0b0001;
  }
  // Done
}

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDOMElementAttachedState({ nodeStates, nodes, comments }, value) {
  const { commentIndex, nodeIndex } = this;
  // eslint-disable-next-line no-bitwise
  const hidden = nodeStates[nodeIndex] & 1;
  const show = value != null && value !== false;
  if (show === !hidden) return;

  const element = nodes[nodeIndex];
  let comment = comments[commentIndex];
  if (!comment) {
    comment = createEmptyComment();
    comments[commentIndex] = comment;
  }
  if (show) {
    comment.replaceWith(element);
    // eslint-disable-next-line no-bitwise
    nodeStates[nodeIndex] &= ~0b0001;
  } else {
    element.replaceWith(comment);
    // eslint-disable-next-line no-bitwise
    nodeStates[nodeIndex] |= 0b0001;
  }
}

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDOMHideNodeOnInit({ comments, nodeStates, nodes }) {
  const { commentIndex, nodeIndex } = this;

  const comment = createEmptyComment();
  comments[commentIndex] = comment;
  // eslint-disable-next-line no-bitwise
  nodeStates[nodeIndex] |= 1;

  nodes[nodeIndex].replaceWith(comment);
}

/**
 * @param {RenderGraphSearch} search
 * @param {Parameters<RenderGraphSearch['invocation']>} args
 */
function executeSearch(search, ...args) {
  const [{ caches, searchStates }] = args;
  const { cacheIndex, searchIndex, subSearch, invocation } = search;
  const cachedValue = caches[cacheIndex];
  const searchState = searchStates[searchIndex];

  // Ran   = 0b0001
  // Dirty = 0b0010
  // eslint-disable-next-line no-bitwise
  if (searchState & 0b0001) {
    // Return last result
    return {
      value: cachedValue,
      // eslint-disable-next-line no-bitwise
      dirty: ((searchState & 0b0010) === 0b0010),
    };
  }

  // eslint-disable-next-line no-bitwise
  searchStates[searchIndex] |= 0b0001;
  let result;
  if (invocation) {
    if (subSearch) {
      const subResult = executeSearch(subSearch, ...args);
      // Use last cached value (if any)
      if (!subResult.dirty && cachedValue !== undefined) {
        // eslint-disable-next-line no-bitwise
        searchStates[searchIndex] &= ~0b0010;
        return { value: cachedValue, dirty: false };
      }
      // Pass from subquery
      result = search.invocation(subResult.value);
    } else {
      result = search.invocation(...args);
    }
    if ((result === undefined) || (cachedValue === result)) {
      // Return from cache
      return { value: result, dirty: false };
    }
  }

  // Overwrite cache and flag as dirty
  caches[cacheIndex] = result;
  // eslint-disable-next-line no-bitwise
  searchStates[searchIndex] |= 0b0010;
  return { value: result, dirty: true };
}

/**
 * @type {RenderGraphSearch['invocation']}
 * @this {RenderGraphSearch}
 */
function searchWithExpression({ options: { context, store, injections } }, changes, data) {
  return this.expression.call(
    context,
    store ?? data,
    injections,
  );
}

/**
 * @type {RenderGraphSearch['invocation']}
 * @this {RenderGraphSearch}
 */
function searchWithProp(state, changes) {
  return changes[this.prop];
}

/**
 * @type {RenderGraphSearch['invocation']}
 * @this {RenderGraphSearch}
 */
function searchWithDeepProp(state, changes, data) {
  let scope = changes;
  for (const prop of this.deepProp) {
    if (scope === null) return null;
    if (prop in scope === false) return undefined;
    scope = scope[prop];
  }
  return scope;
}

/**
 * @typedef InterpolateOptions
 * @prop {Record<string,any>} [defaults] Default values to use for interpolation
 * @prop {{iterable:string} & Record<string,any> & {index:number}} [injections] Context-specific injected properties. (Experimental)
 */

/**
 * @typedef InitializationState
 * @prop {Element} lastElement
 * @prop {ChildNode} lastChildNode
 * @prop {(Element|Text)[]} nodes
 * @prop {any[]} caches
 * @prop {Comment[]} comments
 * @prop {Uint8Array} nodeStates
 * @prop {Uint8Array} searchStates
 * @prop {HTMLElement[]} refs
 * @prop {number} lastChildNodeIndex
 * @prop {RenderOptions<?>} options
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
 *  propFromObject('foo', {foo:'bar'}) == ['foo', 'bar'];
 * @param {string} prop
 * @param {any} source
 * @return {any}
 */
function propFromObject(prop, source) {
  if (source) {
    return source[prop];
  }
  return undefined;
}

/**
 * @example
 *  deepPropFromObject(
 *    ['address', 'home, 'houseNumber'],
 *    {
 *      address: {
 *        home: {
 *          houseNumber:35,
 *        },
 *      }
 *    }
 * ) == [houseNumber, 35]
 * @param {string[]} nameArray
 * @param {any} source
 * @return {any}
 */
function deepPropFromObject(nameArray, source) {
  if (!source) return undefined;
  let scope = source;
  let prop;
  for (prop of nameArray) {
    if (typeof scope === 'object') {
      if (scope === null) return null;
      if (!(prop in scope)) return undefined;
      scope = scope[prop];
    } else {
      return scope[prop];
    }
  }
  return scope;
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

const compositionCache = new Map();

/** @template T */
export default class Composition {
  static EVENT_PREFIX_REGEX = /^([*1~]+)?(.*)$/;

  _interpolationState = {
    nodeIndex: -1,
    searchIndex: 0,
    cacheIndex: 0,
    commentIndex: 0,
    /** @type {this['nodesToBind'][0]} */
    nodeEntry: null,
  };

  // eslint-disable-next-line symbol-description
  static shadowRootTag = Symbol();

  /** @type {{tag:string, textNodes: number[]}[]} */
  nodesToBind = [];

  /** @type {string[]} */
  props = [];

  /** @type {RenderGraphSearch[]} */
  searches = [];

  /** @type {any[]} */
  initCache = [];

  /**
   * Index of searches by query (dotted notation for deep props)
   * @type {Map<Function|string, RenderGraphSearch>}
   */
  searchByQuery;

  /**
   * Index of searches by query (dotted notation for deep props)
   * @type {Map<string, RenderGraphAction[]>}
   */
  actionsByPropsUsed;

  /** @type {RenderGraphAction[]} */
  postInitActions = [];

  /** @type {Set<string>} */
  tagsWithBindings;

  /**
   * Array of element tags
   * @type {string[]}
   */
  tags = [];

  /**
   * Data of arrays used in templates
   * Usage of a [mdw-for] will create an ArrayLike expectation based on key
   * Only store metadata, not actual data. Currently only needs length.
   * TBD if more is needed later
   * Referenced by property key (string)
   * @type {CompositionAdapter<T>}
   */
  adapter;

  /**
   * Collection of events to bind.
   * Indexed by ID
   * @type {Map<string|symbol, CompositionEventListener<any>[]>}
   */
  events;

  /**
   * Snapshot of composition at initial state.
   * This fragment can be cloned for first rendering, instead of calling
   * of using `render()` to construct the initial DOM tree.
   * @type {DocumentFragment}
   */
  cloneable;

  /** @type {(HTMLStyleElement|CSSStyleSheet)[]} */
  styles = [];

  /** @type {CSSStyleSheet[]} */
  adoptedStyleSheets = [];

  /** @type {DocumentFragment} */
  stylesFragment;

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
  /** @type {Set<string>} */
  temporaryIds;

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
  }

  /**
   * @template T
   * @param  {ConstructorParameters<typeof Composition<T>>} parts
   * @return {Composition<T>}
   */
  static compose(...parts) {
    for (const [cache, comp] of compositionCache) {
      if (cache.length !== parts.length) continue;
      if (parts.every((part, index) => part === cache[index])) {
        return comp;
      }
    }

    const composition = new Composition(...parts);
    compositionCache.set(parts, composition);
    return composition;
  }

  /**
   * @param {CompositionPart<T>[]} parts
   */
  append(...parts) {
    for (const part of parts) {
      if (typeof part === 'string') {
        this.append(generateFragment(part.trim()));
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

  /** @param {CompositionEventListener<T>} listener */
  addCompositionEventListener(listener) {
    const key = listener.tag ?? '';
    // eslint-disable-next-line no-multi-assign
    const events = (this.events ??= new Map());
    if (events.has(key)) {
      events.get(key).push(listener);
    } else {
      events.set(key, [listener]);
    }
    return this;
  }

  /**
   * @param {string|symbol} tag
   * @param {EventTarget} target
   * @param {any} [context]
   * @return {void}
   */
  #bindCompositionEventListeners(tag, target, context) {
    if (!this.events?.has(tag)) return;
    for (const event of this.events.get(tag)) {
      let listener;
      if (event.handleEvent) {
        listener = event.handleEvent;
      } else if (event.deepProp.length) {
        listener = deepPropFromObject(event.deepProp, this.interpolateOptions.defaults);
      } else {
        listener = propFromObject(event.prop, this.interpolateOptions.defaults);
      }
      target.addEventListener(event.type, context ? listener.bind(context) : listener, event);
    }
  }

  /**
   * TODO: Add types and clean up closure leak
   * Updates component nodes based on data.
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @template {Object} T
   * @param {Partial<T>} changes what specifically
   * @param {T} [data]
   * @param {RenderOptions<T>} [options]
   * @return {RenderDraw<T>} anchor
   */
  render(changes, data, options = {}) {
    if (!this.interpolated) {
      this.interpolate({
        defaults: data ?? changes,
        ...options,
      });
    }

    const instanceFragment = /** @type {DocumentFragment} */ (this.cloneable.cloneNode(true));

    const shadowRoot = options.shadowRoot;
    const target = shadowRoot ?? options.target ?? instanceFragment.firstElementChild;

    /** @type {InitializationState} */
    const initState = {
      lastChildNode: null,
      lastChildNodeIndex: 0,
      lastElement: null,
      nodeStates: new Uint8Array(this._interpolationState.nodeIndex + 1),
      searchStates: new Uint8Array(this._interpolationState.searchIndex),
      comments: [],
      nodes: [],
      caches: this.initCache.slice(),
      refs: [],
      options,
    };

    const { nodes, refs, searchStates, caches } = initState;
    for (const { tag, textNodes } of this.nodesToBind) {
      /** @type {Text} */
      let textNode;
      if (tag === '') {
        if (!textNodes.length) {
          console.warn('why was root tagged?');
          continue;
        }
        console.warn('found empty tag??');
        refs.push(null);
        nodes.push(null);
        textNode = /** @type {Text} */ (instanceFragment.firstChild);
      } else {
        const element = instanceFragment.getElementById(tag);
        refs.push(element);
        nodes.push(element);
        this.#bindCompositionEventListeners(tag, element, options.context);
        if (!textNodes.length) continue;
        textNode = /** @type {Text} */ (element.firstChild);
      }

      let currentIndex = 0;
      for (const index of textNodes) {
        while (index !== currentIndex) {
          textNode = /** @type {Text} */ (textNode.nextSibling);
          currentIndex++;
        }
        nodes.push(textNode);
      }
    }
    this.#bindCompositionEventListeners('', options.context);
    this.#bindCompositionEventListeners(Composition.shadowRootTag, options.context.shadowRoot, options.context);

    for (const action of this.postInitActions) {
      action.invocation(initState);
    }

    /**
     * @param {Partial<T>} changes
     * @param {T} data
     */
    const draw = (changes, data) => {
      let ranSearch = false;
      for (const prop of this.props) {
        if (!this.actionsByPropsUsed?.has(prop)) continue;
        if (!(prop in changes)) continue;
        const actions = this.actionsByPropsUsed.get(prop);
        for (const action of actions) {
          ranSearch = true;
          const { dirty, value } = executeSearch(action.search, initState, changes, data);
          if (dirty) {
            // console.log('dirty, updating from batch', initState.nodes[action.nodeIndex], 'with', value);
            action.invocation(initState, value, changes, data);
          }
        }
      }
      if (!ranSearch) return;
      searchStates.fill(0);
    };

    if (shadowRoot) {
      options.context ??= shadowRoot.host;
      if ('adoptedStyleSheets' in shadowRoot) {
        if (this.adoptedStyleSheets.length) {
          shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            ...this.adoptedStyleSheets,
          ];
        }
      } else if (this.stylesFragment.hasChildNodes()) {
        instanceFragment.prepend(this.stylesFragment.cloneNode(true));
      }
    } else {
      options.context ??= target;
    }

    if (changes !== this.interpolateOptions.defaults) {
      // Not default, overwrite nodes
      draw(changes, data);
    }

    if (shadowRoot) {
      shadowRoot.append(instanceFragment);
      customElements.upgrade(shadowRoot);
    }

    draw.target = target;

    /**
     * @param {keyof T & string} prop
     * @param {any} value
     * @param {Partial<T>} [data]
     */
    draw.byProp = (prop, value, data) => {
      if (!this.actionsByPropsUsed?.has(prop)) return;
      let ranSearch = false;

      // Update search
      if (this.searchByQuery?.has(prop)) {
        ranSearch = true;
        const search = this.searchByQuery.get(prop);
        const cachedValue = caches[search.cacheIndex];
        if (cachedValue === value) {
          return;
        }
        caches[search.cacheIndex] = value;
        searchStates[search.searchIndex] = 0b0011;
      }

      /** @type {Partial<T>} */
      let changes;
      const actions = this.actionsByPropsUsed.get(prop);
      for (const action of actions) {
        if (action.search.query === prop) {
          action.invocation(initState, value);
        } else {
          // @ts-expect-error Skip cast
          changes ??= { [prop]: value };
          data ??= changes;
          ranSearch = true;
          const result = executeSearch(action.search, initState, changes, data);
          if (result.dirty) {
            // console.debug('dirty, updating by prop', prop, initState.nodes[action.nodeIndex], 'with', result.value);
            action.invocation(initState, result.value, changes, data);
          }
        }
      }

      if (!ranSearch) return;
      searchStates.fill(0);
    };
    draw.state = initState;
    return draw;
  }

  /**
   * @param {Attr|Text} node
   * @param {Element|null} [element]
   * @param {InterpolateOptions} [options]
   * @param {string} [parsedValue]
   * @return {true|undefined} remove node
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

    // Get template strings(s) in node if not passed
    if (parsedValue == null) {
      if (!nodeValue) return;
      const trimmed = nodeValue.trim();
      if (!trimmed) return;
      if (attr || element?.tagName === 'STYLE') {
        if (trimmed[0] !== '{') return;
        const { length } = trimmed;
        if (trimmed[length - 1] !== '}') return;
        parsedValue = trimmed.slice(1, -1);
        // TODO: Support segmented attribute values
      } else {
        // Split text node into segments
        // TODO: Benchmark indexOf pre-check vs regex

        const segments = trimmed.split(STRING_INTERPOLATION_REGEX);
        if (segments.length < 3) return;
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
          // eslint-disable-next-line consistent-return
          return true;
        }
      }
    }

    // Check mutations

    const query = parsedValue;
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
        const hyphenIndex = nodeName.indexOf('-');
        if (hyphenIndex === -1) return;
        isEvent = hyphenIndex === 2;
      }
    }

    if (isEvent) {
      element.removeAttribute(nodeName);
      const tag = this.#tagElement(element);
      const eventType = nodeName.slice(3);
      const [, flags, type] = eventType.match(/^([*1~]+)?(.*)$/);

      let handleEvent;
      /** @type {string} */
      let prop;
      /** @type {string[]} */
      let deepProp = [];
      if (parsedValue.startsWith('#')) {
        handleEvent = inlineFunctions.get(parsedValue).fn;
      } else {
        const parsedProps = parsedValue.split('.');
        if (parsedProps.length === 1) {
          prop = parsedValue;
          deepProp = [];
        } else {
          prop = parsedProps[0];
          deepProp = parsedProps;
        }
      }

      this.addCompositionEventListener({
        tag,
        type,
        handleEvent,
        prop,
        deepProp,
        once: flags?.includes('1'),
        passive: flags?.includes('~'),
        capture: flags?.includes('*'),
      });

      return;
    }

    /** @type {RenderGraphSearch} */
    let search;

    if (this.searchByQuery?.has(query)) {
      search = this.searchByQuery.get(query);
    } else {
      // Has subquery?
      const subquery = parsedValue;
      const isSubquery = subquery !== query;
      /** @type {RenderGraphSearch} */
      let subSearch;
      if (isSubquery && this.searchByQuery?.has(subquery)) {
        subSearch = this.searchByQuery.get(subquery);
      } else {
        // Construct subsearch, even is not subquery.
        /** @type {Function} */
        let expression;
        /** @type {string[]} */
        let propsUsed;
        /** @type {string[][]} */
        let deepPropsUsed;
        let defaultValue;
        let prop;
        let deepProp;
        let invocation;

        let inlineFunctionOptions;
        // Is Inline Function?
        if (parsedValue.startsWith('#')) {
          inlineFunctionOptions = inlineFunctions.get(parsedValue);
          if (!inlineFunctionOptions) {
            console.warn(`Invalid interpolation value: ${parsedValue}`);
            return;
          }
          expression = inlineFunctionOptions.fn;
          invocation = searchWithExpression;
          if (inlineFunctionOptions.props) {
          // console.log('This function has already been called. Reuse props', inlineFunctionOptions, this);
            propsUsed = inlineFunctionOptions.props;
            deepPropsUsed = inlineFunctionOptions.deepProps;
            defaultValue = inlineFunctionOptions.defaultValue ?? null;
          } else {
            defaultValue = inlineFunctionOptions.fn;
          }
        } else {
          defaultValue = null;
          if (options?.defaults) {
            defaultValue = deepPropFromObject(parsedValue.split('.'), options.defaults) ?? null;
          }
          if (defaultValue == null && options?.injections) {
            defaultValue = valueFromPropName(parsedValue, options.injections);
            // console.log('default value from injection', parsedValue, { defaultValue });
          }
        }

        if (!propsUsed) {
          if (typeof defaultValue === 'function') {
          // Value must be reinterpolated and function observed
            const observeResult = observeFunction.call(this, defaultValue, options?.defaults, options?.injections);
            const uniqueProps = new Set([
              ...observeResult.props.this,
              ...observeResult.props.args[0],
              ...observeResult.props.args[1],
            ]);
            const uniqueDeepProps = new Set([
              ...observeResult.deepPropStrings.this,
              ...observeResult.deepPropStrings.args[0],
            ]);
            expression = defaultValue;
            defaultValue = observeResult.defaultValue;
            propsUsed = [...uniqueProps];
            deepPropsUsed = [...uniqueDeepProps].map((deepPropString) => deepPropString.split('.'));
            invocation = searchWithExpression;
          // console.log(this.static.name, fn.name || parsedValue, combinedSet);
          } else {
          // property binding
            const parsedProps = parsedValue.split('.');
            if (parsedProps.length === 1) {
              prop = parsedValue;
              propsUsed = [prop];
              invocation = searchWithProp;
            } else {
              propsUsed = [parsedProps[0]];
              deepProp = parsedProps;
              deepPropsUsed = [parsedProps];
              invocation = searchWithDeepProp;
            }

            // TODO: Rewrite property as deep with array index?
          }
        }

        if (inlineFunctionOptions) {
          inlineFunctionOptions.defaultValue = defaultValue;
          inlineFunctionOptions.props = propsUsed;
          inlineFunctionOptions.deepProps = deepPropsUsed;
        }
        subSearch = {
          cacheIndex: this._interpolationState.cacheIndex++,
          searchIndex: this._interpolationState.searchIndex++,
          query: subquery,
          defaultValue,
          subSearch: null,
          prop,
          propsUsed,
          deepProp,
          deepPropsUsed,
          invocation,
          expression,
        };
        this.addSearch(subSearch);
      }
      if (isSubquery) {
        search = {
          cacheIndex: this._interpolationState.cacheIndex++,
          searchIndex: this._interpolationState.searchIndex++,
          query,
          subSearch,
          negate,
          doubleNegate,
          prop: subSearch.prop,
          deepProp: subSearch.deepProp,
          propsUsed: subSearch.propsUsed,
          deepPropsUsed: subSearch.deepPropsUsed,
          defaultValue: doubleNegate ? !!subSearch.defaultValue
            : (negate ? !subSearch.defaultValue : subSearch.defaultValue),
          invocation(value) {
            if (this.doubleNegate) return !!value;
            if (this.negate) return !value;
            console.warn('Unknown query mutation', this.query);
            return value;
          },
        };
        this.addSearch(search);
      } else {
        // Store as search instead
        search = subSearch;
      }
    }

    // Tag
    let tag;
    let subnode = null;
    let defaultValue = search.defaultValue;
    if (text) {
      subnode = textNodeIndex;
    } else if (nodeName === 'mdw-if') {
      tag = this.#tagElement(element);
      element.removeAttribute(nodeName);
      defaultValue = defaultValue != null && defaultValue !== false;
    } else {
      subnode = nodeName;
      if (nodeName === 'id' || defaultValue == null || defaultValue === false) {
        element.removeAttribute(nodeName);
      } else {
        element.setAttribute(nodeName, defaultValue === true ? '' : defaultValue);
      }
    }

    tag ??= this.#tagElement(element);

    // Node entry
    let nodeEntry = this._interpolationState.nodeEntry;
    if (!nodeEntry || nodeEntry.tag !== tag) {
      nodeEntry = {
        tag,
        textNodes: [],
      };
      this._interpolationState.nodeEntry = nodeEntry;
      this.nodesToBind.push(nodeEntry);
      this._interpolationState.nodeIndex++;
    }

    /** @type {RenderGraphAction} */
    let action;

    // Node Action
    if (text) {
      nodeEntry.textNodes.push(textNodeIndex);

      this._interpolationState.nodeIndex++;
      action = {
        nodeIndex: this._interpolationState.nodeIndex,
        commentIndex: this._interpolationState.commentIndex++,
        invocation: writeDynamicNode,
        defaultValue,
        search,
      };
      switch (typeof defaultValue) {
        case 'string':
          text.data = defaultValue;
          break;
        case 'number':
          // Manually coerce to string (0 will be empty otherwise)
          text.data = `${defaultValue}`;
          break;
        default:
          text.data = '';
          break;
      }
    } else if (subnode) {
      action = {
        nodeIndex: this._interpolationState.nodeIndex,
        attrName: /** @type {string} */ (subnode),
        defaultValue,
        invocation: writeDOMAttribute,
        search,
      };
    } else {
      action = {
        nodeIndex: this._interpolationState.nodeIndex,
        commentIndex: this._interpolationState.commentIndex++,
        defaultValue,
        invocation: writeDOMElementAttachedState,
        search,
      };
      if (!defaultValue) {
        this.postInitActions.push({
          ...action,
          invocation: writeDOMHideNodeOnInit,
        });
      }
    }

    this.addAction(action);
    // eslint-disable-next-line no-multi-assign
    const tagsWithBindings = (this.tagsWithBindings ??= new Set());
    tagsWithBindings.add(tag);
  }

  /**
   * @param {Element} element
   * @return {string}
   */
  #tagElement(element) {
    if (!element) return '';
    let id = element.id;
    if (id) {
      if (!this.allIds.includes(id)) {
        this.allIds.push(id);
      }
    } else {
      id = generateUID();
      // eslint-disable-next-line no-multi-assign
      const temporaryIds = (this.temporaryIds ??= new Set());
      temporaryIds.add(id);
      this.allIds.push(id);
      element.id = id;
    }
    return id;
  }

  /**
   * TODO: Subtemplating lacks optimization, though functional.
   * - Would benefit from custom type handler for arrays
   * to avoid multi-iteration change-detection.
   * - Could benefit from debounced/throttled render
   * - Consider remap of {item.prop} as {array[index].prop}
   * @param {Element} element
   * @param {InterpolateOptions} options
   * @return {?Composition<?>}
   */
  #interpolateIterable(element, options) {
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
    const [valueName, iterableName] = parsedValue.split(/\s+of\s+/);
    element.removeAttribute('mdw-for');
    // Create a new composition targetting element as root

    const elementAnchor = element.ownerDocument.createElement('template');
    element.replaceWith(elementAnchor);
    const tag = this.#tagElement(elementAnchor);
    // console.log('tagging placeholder element with', elementAnchor, tag);

    let nodeEntry = this._interpolationState.nodeEntry;
    if (!nodeEntry || nodeEntry.tag !== tag) {
      nodeEntry = {
        tag,
        textNodes: [],
      };
      this._interpolationState.nodeEntry = nodeEntry;
      this.nodesToBind.push(nodeEntry);
      this._interpolationState.nodeIndex++;
    }

    const newComposition = new Composition();
    newComposition.template.append(element);
    // Move uninterpolated element to new composition template.
    /** @type {InterpolateOptions['injections']} */
    const injections = {
      ...options.injections,
      [valueName]: null,
      index: null,
    };

    const propsUsed = [iterableName];
    /** @type {RenderGraphSearch} */
    const search = {
      cacheIndex: this._interpolationState.cacheIndex++,
      searchIndex: this._interpolationState.searchIndex++,
      query: null,
      prop: null,
      deepProp: null,
      propsUsed,
      deepPropsUsed: [[iterableName]],
      defaultValue: {},
      invocation: null,
    };

    /** @type {RenderGraphAction} */
    const action = {
      defaultValue: null,
      nodeIndex: this._interpolationState.nodeIndex,
      search,
      commentIndex: this._interpolationState.commentIndex++,
      injections,
      invocation(state, value, changes, data) {
        if (!newComposition.adapter) {
          // console.log({ state.options });
          const instanceAnchorElement = state.nodes[this.nodeIndex];
          const anchorNode = createEmptyComment();
          // Avoid leak
          state.comments[this.commentIndex] = anchorNode;
          instanceAnchorElement.replaceWith(anchorNode);
          newComposition.adapter = new CompositionAdapter({
            anchorNode,
            composition: newComposition,
            renderOptions: {
              target: null,
              context: state.options.context,
              store: state.options.store,
              injections: this.injections,
            },
          });
        }
        const { adapter } = newComposition;
        const iterable = (data ?? state.options.store)[iterableName];
        // Remove oversized
        if (!iterable || iterable.length === 0) {
          adapter.removeEntries();
          return;
        }
        const changeList = changes[iterableName];
        const innerChanges = { ...changes };
        const needTargetAll = newComposition.props.some((prop) => prop !== iterableName && prop in changes);

        adapter.startBatch();
        let isArray;
        if (!needTargetAll && !(isArray = Array.isArray(changeList))) {
          const iterator = isArray ? changeList.entries() : Object.entries(changeList);
          // console.log('changeList render', iterator);
          for (const [key, change] of iterator) {
            if (key === 'length') continue;
            if (change === null) {
              // console.warn('null?', 'remove?', key);
              continue;
            }
            const index = (+key);
            const resource = iterable[index];
            innerChanges[valueName] = change;
            this.injections[valueName] = resource;
            this.injections.index = index;

            adapter.renderData(index, innerChanges, data, resource, change);
          }
        } else {
          if (!changeList) {
            delete innerChanges[valueName];
          }
          // console.log('full array render', iterable);
          for (const [index, resource] of iterable.entries()) {
            let change;
            if (changeList) {
              // console.warn('full array render has changeList?', changeList);
              if (!needTargetAll && !(index in changeList)) {
                console.warn('huh?');
                continue;
              }
              change = changeList[index];
              if (change === null) {
                // console.warn('remove?');
                continue;
              }
              innerChanges[valueName] = change;
            }
            this.injections[valueName] = resource;
            this.injections.index = index;

            adapter.renderData(index, innerChanges, data, resource, change);
            // adapter.renderIndex(index, innerChanges, data, resource);
          }
        }
        adapter.stopBatch();

        adapter.removeEntries(iterable.length);
      },

    };

    newComposition.interpolate({
      defaults: options.defaults,
      injections,
    });

    propsUsed.push(...newComposition.props);
    this.addSearch(search);
    this.addAction(action);
    // eslint-disable-next-line no-multi-assign
    const tagsWithBindings = (this.tagsWithBindings ??= new Set());
    tagsWithBindings.add(tag);
    // console.log('adding', iterable, 'bind to', this);
    // this.addBinding(iterable, entry);
    return newComposition;
  }

  /**
   * @param {InterpolateOptions} [options]
   */
  interpolate(options) {
    this.interpolateOptions = options;
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
          element = /** @type {Element} */ (node);
          if (element.tagName === 'TEMPLATE') {
            while (element.contains(node = treeWalker.nextNode()));
            continue;
          }

          if (element.tagName === 'SCRIPT') {
            console.warn('<script> element found.');
            while (element.contains(node = treeWalker.nextNode()));
            continue;
          }

          if (element.hasAttribute('mdw-for')) {
            while (element.contains(node = treeWalker.nextNode()));
            this.#interpolateIterable(element, options);
            continue;
          } else {
            // @ts-expect-error Bad typings
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
          element = node.parentElement;
          if (this.#interpolateNode(/** @type {Text} */ (node), element, options)) {
            const nextNode = treeWalker.nextNode();
            /** @type {Text} */ (node).remove();
            node = nextNode;
            continue;
          }
          break;
        default:
          throw new Error(`Unexpected node type: ${node.nodeType}`);
      }
      node = treeWalker.nextNode();
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

    this.props = this.actionsByPropsUsed
      ? [...this.actionsByPropsUsed.keys()]
      : [];

    for (const id of this.allIds) {
      if (!this.tagsWithBindings?.has(id)) {
        this.nodesToBind.push({
          tag: id,
          textNodes: [],
        });
      }
    }

    this.tags = this.nodesToBind.map((n) => n.tag);
    this.interpolated = true;

    // console.log('Cloneable', [...this.cloneable.children].map((child) => child.outerHTML).join('\n'));
  }

  /**
   * @param {RenderGraphSearch} search
   * @return {RenderGraphSearch}
   */
  addSearch(search) {
    this.searches.push(search);
    if (search.query) {
      // eslint-disable-next-line no-multi-assign
      const searchByQuery = (this.searchByQuery ??= new Map());
      searchByQuery.set(search.query, search);
      this.initCache[search.cacheIndex] = search.defaultValue;
    }
    return search;
  }

  /**
   * @param {RenderGraphAction} action
   * @return {RenderGraphAction}
   */
  addAction(action) {
    // eslint-disable-next-line no-multi-assign
    const actionsByPropsUsed = (this.actionsByPropsUsed ??= new Map());
    for (const prop of action.search.propsUsed) {
      if (actionsByPropsUsed.has(prop)) {
        actionsByPropsUsed.get(prop).push(action);
      } else {
        actionsByPropsUsed.set(prop, [action]);
      }
    }
    return action;
  }
}
