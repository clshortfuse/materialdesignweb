/** @typedef {import('./CustomElement').default} CustomElement */

/** @type {WeakMap<HTMLElement, EventListener>} */
const eventHandlerValues = new Map();

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
 * @type {import('./typings.js').ObserverOptions<'function',EventListener, unknown>}
 */
export const EVENT_HANDLER_TYPE = {
  type: 'function',
  reflect: 'read',
  value: null,
  values: eventHandlerValues,
  parser(v) { return v; },
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == null && newValue == null) return;
    // Must continue even if oldValue === newValue;
    if (newValue == null) {
      this[name] = null;
      return;
    }
    // Assign to temp element, allow it to parse and then copy result.
    // Let browser parse instead of using eval()
    // CSP Violations will be thrown by browser on failure and result in `null`
    const button = document.createElement('button');
    button.setAttribute('onclick', newValue);
    const fn = button.onclick;
    button.remove();
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
 * @type {import('./typings.js').ObserverOptions<'object',HTMLElement>}
 */
export const WEAKREF_TYPE = {
  type: 'object',
  reflect: false,
  value: null,
  values: weakRefValues,
  parser(v) { return new WeakRef(v); },
  get() {
    return weakRefValues.get(this)?.deref();
  },
};

/** @type {WeakMap<any, Animation>} */
const elementStylerLastAnimation = new WeakMap();
/** @type {WeakMap<CustomElement, ElementStylerOptions>} */
const elementStylerValues = new WeakMap();
/** @type {WeakSet<any>} */
const elementStylerHasQueue = new WeakSet();

/**
 * @typedef {Object} ElementStylerOptions
 * @prop {string} target Target ID
 * @prop {Keyframe} styles
 * @prop {EffectTiming} [timing]
 */

/** @this {CustomElement} */
function elementStylerRAFCallback() {
  let previousAnimation = elementStylerLastAnimation.get(this);
  const value = elementStylerValues.get(this);
  if (!value) {
    previousAnimation?.cancel();
    return;
  }
  /** @type {HTMLElement} */
  const el = value.target ? this.composition.getElement(this.shadowRoot, value.target) : this;
  const currentAnimation = el.animate(value.styles, {
    ...value.timing,
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
  elementStylerLastAnimation.set(this, currentAnimation);
  elementStylerHasQueue.delete(this);
}

/** @type {import('./typings.js').ObserverOptions<'object',ElementStylerOptions, CustomElement>} */
export const ELEMENT_STYLER_TYPE = {
  type: 'object',
  reflect: false,
  values: elementStylerValues,
  diff: null, // Skip computing entire change
  changedCallback(oldValue, newValue) {
    const hasQueue = elementStylerHasQueue.has(this);
    if (!newValue) {
      if (!hasQueue) return;
      console.warn('debug needed of cancel needed');
      elementStylerHasQueue.delete(this);
      return;
    }

    if (hasQueue) {
      // Already scheduled
      return;
    }

    // Animation styles may trickle in steps, so queue a microtask before doing any work.
    // Using requestAnimationFrame would fire one frame too late for CSS animations already scheduled
    queueMicrotask(elementStylerRAFCallback.bind(this));
    elementStylerHasQueue.add(this);
  },
};
