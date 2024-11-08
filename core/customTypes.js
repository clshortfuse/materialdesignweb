/** @typedef {import('./CustomElement').default} CustomElement */

import { attrNameFromPropName } from './dom.js';

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
 * @type {import('./observe.js').ObserverOptions<'function',EventListener, unknown>}
 */
export const EVENT_HANDLER_TYPE = {
  type: 'function',
  reflect: 'read',
  value: null,
  parser(v) { return v; },
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == null && newValue == null) return;
    // Must continue even if oldValue === newValue;
    if (newValue == null) {
      this[name] = null;
      return;
    }
    let fn;
    try {
      // Use eval to include scope
      // https://blog.ltgt.net/html-event-handlers/
      const scopedCode = 'with(this.ownerDocument ?? document){'
      + 'with(this.form ?? {}){'
      + `with(this){${newValue}}`
      + '}'
      + '}';
      // eslint-disable-next-line no-new-func
      fn = new Function(`return function ${name}(event){${scopedCode}}`)();
    } catch {
      // Assign to temp element, allow it to parse and then copy result.
      // Let browser parse instead of using eval()
      // CSP Violations will be thrown by browser on failure and result in `null`
      const button = (this.ownerDocument ?? document).createElement('button');
      button.setAttribute('onclick', newValue);
      fn = button.onclick;
    }

    this[name] = fn;
  },
  propChangedCallback(name, oldValue, newValue) {
    const eventName = name.slice(2);
    if (oldValue) {
      this.removeEventListener(eventName, oldValue);
    }
    if (newValue) {
      this.addEventListener(eventName, newValue);
    }
  },
};

const weakRefValues = new WeakMap();

/**
 * @type {import('./observe.js').ObserverOptions<'object',HTMLElement>}
 */
export const WEAKREF_TYPE = {
  type: 'object',
  reflect: false,
  value: null,
  parser(v) { return new WeakRef(v); },
  get() {
    if (weakRefValues.has(this)) {
      return weakRefValues.get(this).deref();
    }
    return undefined;
  },
};

/**
 * @typedef {Object} ElementStylerOptions
 * @prop {string|HTMLElement|null} target tag, element or null (host)
 * @prop {Keyframe} styles
 * @prop {EffectTiming} [timing]
 */

/**
 * @typedef {Object} QueuedPropsMetadata
 * @prop {boolean} initial
 */

/** @type {WeakMap<CustomElement, Map<string, QueuedPropsMetadata>>} */
const queuedPropsByElement = new WeakMap();

/** @type {WeakMap<CustomElement, Map<string, Animation>>} */
const previousAnimationsByElement = new WeakMap();

/**
 * @param {string} name
 * @this {CustomElement}
 */
function elementStylerMicrotaskCallback(name) {
  const previousAnimations = previousAnimationsByElement.get(this);
  /** @type {Animation} */
  let previousAnimation;
  if (previousAnimations?.has(name)) {
    previousAnimation = previousAnimations.get(name);
  }
  const queuedProps = queuedPropsByElement.get(this);
  const { initial } = queuedProps.get(name);
  queuedProps.delete(name);
  const value = this[name];
  if (!value) {
    previousAnimation?.cancel();
    return;
  }
  const { target, styles, timing } = value;
  /** @type {HTMLElement} */
  const el = target
    ? (typeof target === 'string' ? this.refs[target] : target)
    : this;
  const currentAnimation = el.animate(styles, {
    ...timing,
    ...(initial ? { duration: 0 } : null),
    fill: 'forwards',
  });
  currentAnimation.onremove = () => {
    previousAnimation?.effect.updateTiming({
      fill: 'none',
    });
    // Destroy previous manually to avoid leak
    previousAnimation?.finish();
    previousAnimation?.cancel();
    previousAnimation = null;
  };
  if (previousAnimations) {
    previousAnimations.set(name, currentAnimation);
  } else {
    previousAnimationsByElement.set(this, new Map([[name, currentAnimation]]));
  }
}

/** @type {WeakMap<Element, Function[]>} */
const pendingResizeCallbacks = new WeakMap();
const pendingConnections = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    if (pendingResizeCallbacks.has(target)) {
      const callbacks = pendingResizeCallbacks.get(target);
      pendingResizeCallbacks.delete(target);
      pendingConnections.unobserve(target);
      for (const callback of callbacks) {
        callback();
      }
    }
  }
});

/** @type {import('./observe.js').ObserverOptions<'object',ElementStylerOptions, CustomElement>} */
export const ELEMENT_ANIMATION_TYPE = {
  type: 'object',
  reflect: false,
  diff: null, // Skip computing entire change
  propChangedCallback(name, oldValue, newValue) {
    if (!newValue) {
      const previousAnimations = previousAnimationsByElement.get(this);
      if (!previousAnimations?.has(name)) {
        // Fast abort
        return;
      }
    }
    const queuedProps = queuedPropsByElement.get(this);

    const initial = !this.isConnected;
    if (queuedProps) {
      if (queuedProps.has(name)) return;
      queuedProps.set(name, { initial });
    } else {
      queuedPropsByElement.set(this, new Map([[name, { initial }]]));
    }
    // TODO: Reuse callback instead constructing each tick
    // Animation styles may trickle in steps, so queue a microtask before doing any work.
    // Using requestAnimationFrame would fire one frame too late for CSS animations already scheduled
    const callback = elementStylerMicrotaskCallback.bind(this, name);
    if (this.isConnected) {
      queueMicrotask(callback);
    } else if (pendingResizeCallbacks.has(this)) {
      pendingResizeCallbacks.get(this).push(callback);
    } else {
      pendingResizeCallbacks.set(this, [callback]);
      pendingConnections.observe(this);
    }
  },
};

/**
 * @type {WeakMap<CustomElement, Map<string, HTMLStyleElement|CSSStyleSheet>>}
 */
const styleReferences = new WeakMap();

/** @type {boolean} */
let useAdoptedStyleSheets = null;

/** @type {import('./observe.js').ObserverOptions<'string',string, CustomElement>} */
export const ELEMENT_STYLE_TYPE = {
  type: 'string',
  reflect: false,
  /**
   * @param {string|Record<keyof CSSStyleDeclaration & string, string|number>} value
   * @return {string}
   */
  parser(value) {
    if (!value || typeof value === 'string') {
      return /** @type {string} */ (value);
    }
    return `:host{${
      Object.entries(value).map(([key, rule]) => `${attrNameFromPropName(key)}:${rule}`)
        .join(';')
    }}`;
  },
  propChangedCallback(name, oldValue, newValue) {
    let mapOfStyles;

    /** @type {HTMLStyleElement|CSSStyleSheet} */
    let styles;
    if (styleReferences.has(this)) {
      mapOfStyles = styleReferences.get(this);
      if (mapOfStyles.has(name)) {
        styles = mapOfStyles.get(name);
      }
    } else {
      // Skip build if blank
      if (!newValue) return;
      mapOfStyles = new Map();
      styleReferences.set(this, mapOfStyles);
    }

    useAdoptedStyleSheets ??= 'adoptedStyleSheets' in ShadowRoot.prototype;
    if (!styles) {
      if (useAdoptedStyleSheets) {
        styles = new CSSStyleSheet();
        this.shadowRoot.adoptedStyleSheets = [
          ...this.shadowRoot.adoptedStyleSheets,
          styles,
        ];
      } else {
        const styleElement = this.ownerDocument.createElement('style');
        this.shadowRoot.prepend(styleElement);
        styles = styleElement;
      }
      mapOfStyles.set(name, styles);
    }
    if (newValue) {
      if (useAdoptedStyleSheets) {
        /** @type {CSSStyleSheet} */(styles).replaceSync(newValue);
      } else if (newValue) {
        /** @type {HTMLStyleElement} */(styles).textContent = newValue;
      }
      styles.disabled = false;
    } else {
      styles.disabled = true;
    }
  },
};
