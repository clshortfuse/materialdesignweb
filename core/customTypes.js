/** @type {Map<HTMLElement, EventListener>} */
const eventHandlerValues = new Map();

/**
 * @type {import("./typings.js").ObserverOptions<'function',EventListener>}
 */
export const EVENT_HANDLER_TYPE = {
  type: 'function',
  reflect: 'read',
  value: null,
  values: eventHandlerValues,
  parser(v) { return v; },
  /**
   * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
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
  /**
   * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes
   * @param {string} name
   * @param {EventListener} oldValue
   * @param {EventListener} newValue
   */
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
