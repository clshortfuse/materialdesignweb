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
 * @prop {T} [store] what
 * @prop {DocumentFragment|ShadowRoot|HTMLElement|Element} [target] where
 * @prop {any} [context] `this` on callbacks/events
 * @prop {any} [injections]
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
 * @prop {import('./typings.js').CompositionEventListener<T>[]} [listeners]
 * @prop {Composition<any>} [composition] // Sub composition templating (eg: array)
 * @prop {T} defaultValue
 */

/** @typedef {any[]} RenderState */

/**
 * @typedef RenderGraphSearch
 *  @prop {(state:InitializationState, changes:any, data:any) => any}  invocation
 *  @prop {number}  cacheIndex
 *  @prop {number}  ranFlagIndex
 *  @prop {number}  dirtyIndex
 *  @prop {string | Function | string[]}  query
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
 */

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDOMAttribute(state, value) {
  const { nodeIndex, attrName } = this;
  /** @type {Element} */
  const element = state.nodes[nodeIndex];
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
function writeDOMText(state, value) {
  // @ts-ignore Skip cast
  state.nodes[this.nodeIndex].data = value;
}

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDOMElementAttachedState(state, value) {
  const { commentIndex, nodeIndex } = this;
  let comment = state.comments[commentIndex];
  if (!comment) {
    comment = createEmptyComment();
    state.comments[commentIndex] = comment;
  }
  const element = state.nodes[nodeIndex];
  const show = value != null && value !== false;
  if (show) {
    comment.replaceWith(element);
  } else {
    element.replaceWith(comment);
  }
  return show;
}

/**
 * @type {RenderGraphAction['invocation']}
 * @this {RenderGraphAction}
 */
function writeDOMHideElementOnInit(state) {
  const { commentIndex, nodeIndex } = this;

  const comment = createEmptyComment();
  state.comments[commentIndex] = comment;

  state.nodes[nodeIndex].replaceWith(comment);
}

/**
 * @param {RenderGraphSearch} search
 * @param {Parameters<RenderGraphSearch['invocation']>} args
 */
function executeSearch(search, ...args) {
  const [state] = args;
  const cachedValue = state.caches[search.cacheIndex];
  if (state.ranFlags[search.ranFlagIndex]) {
    // Return last result
    return {
      value: cachedValue,
      dirty: state.dirtyFlags[search.dirtyIndex],
    };
  }
  state.ranFlags[search.ranFlagIndex] = true;
  let result;
  if (search.subSearch) {
    const subResult = executeSearch(search.subSearch, ...args);
    // Use last cached value (if any)
    if (!subResult.dirty && cachedValue !== undefined) {
      state.dirtyFlags[search.dirtyIndex] = false;
      return { value: cachedValue, dirty: false };
    }
    // Pass from subquery
    result = search.invocation(subResult.value);
  } else {
    result = search.invocation(...args);
  }
  if ((result === undefined) || (cachedValue === result)) {
    // Returnf rom cache
    return { value: result, dirty: false };
  }

  // Overwrite cache and flag as dirty
  state.caches[search.cacheIndex] = result;
  state.dirtyFlags[search.dirtyIndex] = true;
  return { value: result, dirty: true };
}

/**
 * @type {RenderGraphSearch['invocation']}
 * @this {RenderGraphSearch}
 */
function searchWithExpression(state, changes, data) {
  return this.expression.call(
    state.options.context,
    state.options.store ?? data,
    state.options.injections,
  );
}

/**
 * @type {RenderGraphSearch['invocation']}
 * @this {RenderGraphSearch}
 */
function searchWithProp(state, changes, data) {
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
 * @prop {Object} [defaults] Default values to use for interpolation
 * @prop {{iterable:string} & Record<string,any>} [injections] Context-specific injected properties. (Experimental)
 */

/**
 * @typedef InitializationState
 * @prop {Element} lastElement
 * @prop {boolean} isShadowRoot
 * @prop {ChildNode} lastChildNode
 * @prop {(Element|Text)[]} nodes
 * @prop {any[]} caches
 * @prop {Comment[]} comments
 * @prop {boolean[]} ranFlags
 * @prop {boolean[]} dirtyFlags
 * @prop {Element[]} refs
 * @prop {number} lastChildNodeIndex
 * @prop {DocumentFragment} instanceFragment
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

/** @template T */
export default class Composition {
  #interpolationState = {
    nodeIndex: -1,
    ranFlagIndex: 0,
    cacheIndex: 0,
    dirtyIndex: 0,
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
  searchByQuery = new Map();

  /**
   * Index of searches by query (dotted notation for deep props)
   * @type {Map<string, RenderGraphAction[]>}
   */
  actionsByPropsUsed = new Map();

  /** @type {RenderGraphAction[]} */
  actions = [];

  /** @type {RenderGraphAction[]} */
  postInitActions = [];

  /** @type {Set<string>} */
  tagsWithBindings = new Set();

  /**
   * Array of element tags
   * @type {string[]}
   */
  tags = [];

  /**
   * Array of property bindings sorted by tag/subnode
   * @type {Set<string>}
   */
  watchedProps = new Set();

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
   * @type {Map<string|symbol, import('./typings.js').CompositionEventListener<any>[]>}
   */
  events = new Map();

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
  temporaryIds = new Set();

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

  /** @param {import('./typings.js').CompositionEventListener<T>} listener */
  addCompositionEventListener(listener) {
    const key = listener.tag ?? '';
    if (this.events.has(key)) {
      this.events.get(key).push(listener);
    } else {
      this.events.set(key, [listener]);
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
    if (!this.events.has(tag)) return;
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
   * @return {Function & {target:Element}} anchor
   */
  render(changes, data, options = {}) {
    // console.log('render', changes, options);
    if (!this.interpolated) {
      this.interpolate({ defaults: data ?? changes, injections: options?.injections });
    }

    const instanceFragment = /** @type {DocumentFragment} */ (this.cloneable.cloneNode(true));

    const target = options.target ?? instanceFragment.firstElementChild;

    const isShadowRoot = target instanceof ShadowRoot;

    /** @type {InitializationState} */
    const initState = {
      instanceFragment,
      lastChildNode: null,
      lastChildNodeIndex: 0,
      lastElement: null,
      isShadowRoot,
      ranFlags: [],
      comments: [],
      nodes: [],
      caches: this.initCache.slice(),
      dirtyFlags: [],
      refs: [],
      options,
    };

    const nodes = initState.nodes;
    for (const { tag, textNodes } of this.nodesToBind) {
      const element = instanceFragment.getElementById(tag);
      initState.refs.push(element);
      nodes.push(element);
      this.#bindCompositionEventListeners(tag, element, options.context);

      if (!textNodes.length) continue;

      let textNode = element.firstChild;
      let currentIndex = 0;
      for (const index of textNodes) {
        while (index !== currentIndex) {
          textNode = textNode.nextSibling;
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

    const draw = (changes, data) => {
      let ranSearch = false;
      for (const prop of this.props) {
        if (!this.actionsByPropsUsed.has(prop)) continue;
        if (!(prop in changes)) continue;
        const actions = this.actionsByPropsUsed.get(prop);
        for (const action of actions) {
          ranSearch = true;
          const result = executeSearch(action.search, initState, changes, data);
          if (result.dirty) {
            // console.log('dirty, updating from batch', initState.nodes[action.nodeIndex], 'with', result.value);
            action.invocation(initState, result.value, changes, data);
          }
        }
      }
      if (!ranSearch) return;
      initState.ranFlags.fill(false);
      initState.dirtyFlags.fill(false);
    };

    if (isShadowRoot) {
      options.context ??= target.host;
      if ('adoptedStyleSheets' in target) {
        if (this.adoptedStyleSheets.length) {
          target.adoptedStyleSheets = [
            ...target.adoptedStyleSheets,
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

    if (isShadowRoot) {
      target.append(instanceFragment);
      customElements.upgrade(target);
    }

    draw.target = target;
    draw.byProp = (prop, value, data) => {
      if (!this.actionsByPropsUsed.has(prop)) return;
      let ranSearch = false;

      // Update search
      if (this.searchByQuery.has(prop)) {
        ranSearch = true;
        const search = this.searchByQuery.get(prop);
        const cachedValue = initState.caches[search.cacheIndex];
        if (cachedValue === value) {
          return;
        }
        initState.ranFlags[search.ranFlagIndex] = true;
        initState.caches[search.cacheIndex] = value;
        initState.dirtyFlags[search.dirtyIndex] = true;
      }

      let changes;
      const actions = this.actionsByPropsUsed.get(prop);
      for (const action of actions) {
        if (action.search.query === prop) {
          action.invocation(initState, value);
        } else {
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
      initState.ranFlags.fill(false);
      initState.dirtyFlags.fill(false);
    };
    draw.state = initState;
    return draw;
  }

  /**
   * @param {Attr|Text} node
   * @param {Element} element
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
      if (attr) {
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

    if (this.searchByQuery.has(query)) {
      search = this.searchByQuery.get(query);
    } else {
      // Has subquery?
      const subquery = parsedValue;
      const isSubquery = subquery !== query;
      /** @type {RenderGraphSearch} */
      let subSearch;
      if (isSubquery && this.searchByQuery.has(subquery)) {
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
            console.log('default value from injection', parsedValue, { defaultValue });
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
          cacheIndex: this.#interpolationState.cacheIndex++,
          dirtyIndex: this.#interpolationState.dirtyIndex++,
          ranFlagIndex: this.#interpolationState.ranFlagIndex++,
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
          cacheIndex: this.#interpolationState.cacheIndex++,
          dirtyIndex: this.#interpolationState.dirtyIndex++,
          ranFlagIndex: this.#interpolationState.ranFlagIndex++,
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
      text.data = defaultValue;
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
    let nodeEntry = this.#interpolationState.nodeEntry;
    if (!nodeEntry || nodeEntry.tag !== tag) {
      nodeEntry = {
        tag,
        textNodes: [],
      };
      this.#interpolationState.nodeEntry = nodeEntry;
      this.nodesToBind.push(nodeEntry);
      this.#interpolationState.nodeIndex++;
    }

    /** @type {RenderGraphAction} */
    let action;

    // Node Action
    if (text) {
      nodeEntry.textNodes.push(textNodeIndex);

      this.#interpolationState.nodeIndex++;
      action = {
        nodeIndex: this.#interpolationState.nodeIndex,
        invocation: writeDOMText,
        defaultValue,
        search,
      };
    } else if (subnode) {
      action = {
        nodeIndex: this.#interpolationState.nodeIndex,
        attrName: subnode,
        defaultValue,
        invocation: writeDOMAttribute,
        search,
      };
    } else {
      action = {
        nodeIndex: this.#interpolationState.nodeIndex,
        commentIndex: this.#interpolationState.commentIndex++,
        defaultValue,
        invocation: writeDOMElementAttachedState,
        search,
      };
      if (!defaultValue) {
        this.postInitActions.push({
          ...action,
          invocation: writeDOMHideElementOnInit,
        });
      }
    }

    this.addAction(action);
    this.tagsWithBindings.add(tag);
  }

  /**
   * @param {Element} element
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

    const elementAnchor = document.createElement('template');
    element.replaceWith(elementAnchor);
    const tag = this.#tagElement(elementAnchor);
    // console.log('tagging placeholder element with', elementAnchor, tag);

    let nodeEntry = this.#interpolationState.nodeEntry;
    if (!nodeEntry || nodeEntry.tag !== tag) {
      nodeEntry = {
        tag,
        textNodes: [],
      };
      this.#interpolationState.nodeEntry = nodeEntry;
      this.nodesToBind.push(nodeEntry);
      this.#interpolationState.nodeIndex++;
      console.log('adding node entry', tag, this.#interpolationState.nodeIndex);
    }

    const newComposition = new Composition();
    newComposition.template.append(element);
    // Move uninterpolated element to new composition template.
    const injections = {
      ...options.injections,
      [valueName]: null,
      index: null,
    };

    const propsUsed = [iterableName];
    /** @type {RenderGraphSearch} */
    const search = {
      cacheIndex: this.#interpolationState.cacheIndex++,
      dirtyIndex: this.#interpolationState.dirtyIndex++,
      ranFlagIndex: this.#interpolationState.ranFlagIndex++,
      propsUsed,
      deepPropsUsed: [[iterableName]],
      defaultValue: {},
      invocation(state, changes, data) {
        // Return unique to always specify dirty
        return {};
      },
    };

    /** @type {RenderGraphAction} */
    const action = {
      defaultValue: null,
      nodeIndex: this.#interpolationState.nodeIndex,
      search,
      commentIndex: this.#interpolationState.commentIndex++,
      injections,
      invocation(state, value, changes, data) {
        if (!newComposition.adapter) {
          // console.log({ state.options });
          const instanceAnchorElement = state.nodes[this.nodeIndex];
          const anchorNode = createEmptyComment();
          // Avoid leak
          state.nodes[this.commentIndex] = anchorNode;
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
        if (!needTargetAll && !Array.isArray(changeList)) {
          const iterator = Array.isArray(changeList) ? changeList.entries() : Object.entries(changeList);
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
    this.tagsWithBindings.add(tag);
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
            this.#interpolateIterable(element, options);
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

    this.props = [...this.actionsByPropsUsed.keys()];

    for (const id of this.allIds) {
      if (!this.tagsWithBindings.has(id)) {
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
      this.searchByQuery.set(search.query, search);
      this.initCache[search.cacheIndex] = search.defaultValue;
    }
    return search;
  }

  /**
   * @param {RenderGraphAction} action
   * @return {RenderGraphAction}
   */
  addAction(action) {
    this.actions.push(action);
    for (const prop of action.search.propsUsed) {
      if (this.actionsByPropsUsed.has(prop)) {
        this.actionsByPropsUsed.get(prop).push(action);
      } else {
        this.actionsByPropsUsed.set(prop, [action]);
      }
    }
    return action;
  }
}
