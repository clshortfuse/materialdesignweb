/** @typedef {import('./CustomElement').default} CustomElement */

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
 * @type {import('./typings.js').ObserverOptions<'function',EventListener, unknown>}
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
 * @prop {string} target Target ID
 * @prop {Keyframe} styles
 * @prop {EffectTiming} [timing]
 */

/** @type {WeakMap<CustomElement, Set<string>} */
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
  const value = this[name];
  if (!value) {
    previousAnimation?.cancel();
    return;
  }
  /** @type {HTMLElement} */
  const el = value.target ? this.refs[value.target] : this;
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
  if (previousAnimations) {
    previousAnimations.set(name, currentAnimation);
  } else {
    previousAnimationsByElement.set(this, new Map([[name, currentAnimation]]));
  }
  queuedPropsByElement.get(this).delete(name);
}

/** @type {import('./typings.js').ObserverOptions<'object',ElementStylerOptions, CustomElement>} */
export const ELEMENT_STYLER_TYPE = {
  type: 'object',
  reflect: false,
  diff: null, // Skip computing entire change
  propChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected) return;
    const queuedProps = queuedPropsByElement.get(this);
    let hasQueue = false;
    if (queuedProps?.has(name)) {
      hasQueue = true;
    }
    if (!newValue) {
      if (!hasQueue) return;
      console.warn('debug of cancel needed');
      if (queuedProps) {
        queuedProps.delete(name);
      }
      return;
    }

    if (hasQueue) {
      // Already scheduled
      return;
    }

    if (queuedProps) {
      queuedProps.add(name);
    } else {
      queuedPropsByElement.set(this, new Set([name]));
    }
    // Animation styles may trickle in steps, so queue a microtask before doing any work.
    // Using requestAnimationFrame would fire one frame too late for CSS animations already scheduled
    queueMicrotask(elementStylerMicrotaskCallback.bind(this, name));
  },
};
