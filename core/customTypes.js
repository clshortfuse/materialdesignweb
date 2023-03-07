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
    // Must continue if oldValue === newValue;
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
/** @type {WeakMap<any, number>} */
const elementStylerRAFHandles = new WeakMap();

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
  elementStylerRAFHandles.delete(this);
}

/** @type {import('./typings.js').ObserverOptions<'object',ElementStylerOptions, CustomElement>} */
export const ELEMENT_STYLER_TYPE = {
  type: 'object',
  reflect: false,
  values: elementStylerValues,
  changedCallback(oldValue, newValue) {
    const currentRAFHandle = elementStylerRAFHandles.get(this);
    if (!newValue) {
      if (!currentRAFHandle) return;
      cancelAnimationFrame(currentRAFHandle);
      elementStylerRAFHandles.delete(this);
      return;
    }

    if (currentRAFHandle) {
      // Already scheduled
      return;
    }

    // Animation styles may trickle in steps, so request an animation frame before doing any work.
    elementStylerRAFHandles.set(
      this,
      requestAnimationFrame(elementStylerRAFCallback.bind(this)),
    );
  },
};
