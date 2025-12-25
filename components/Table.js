import CustomElement from '../core/CustomElement.js';

// https://html.spec.whatwg.org/multipage/tables.html#htmltableelement

/**
 * @param {Element} parent
 * @param {string} tagName
 * @return {Element?}
 */
function getByTagName(parent, tagName) {
  for (const element of parent.children) {
    if (element.tagName === tagName) {
      return element;
    }
  }
  return null;
}

/**
 * @param {Element} parent
 * @param {string} tagName
 * @param {Element|null} value
 * @param {string} errorMessage
 * @return {Element?}
 */
function setByTagName(parent, tagName, value, errorMessage) {
  const current = getByTagName(parent, tagName);
  if (!value) {
    current?.remove();
    return undefined;
  }
  if (value === current) return value;
  if (value instanceof HTMLElement && value.tagName === tagName) {
    if (current) {
      current.replaceWith(value);
    } else {
      this.prepend(value);
    }
    return value;
  }
  throw new TypeError(errorMessage);
}

/**
 * @param {Element} parent
 * @param {string} tagName
 * @return {Element?}
 */
function createByTagName(parent, tagName) {
  let element = this.getByTagName(parent, tagName);
  if (element) return element;
  element = document.createElement(tagName);
  this.prepend(element);
  return element;
}

/**
 * @param {Element} parent
 * @param {string} tagName
 * @return {void}
 */
function deleteByTagName(parent, tagName) {
  this.setByTagName(parent, tagName, null);
}

/**
 * Table provides an HTML-like table API using mdw elements for rows and sections.
 * Implements the {@link https://html.spec.whatwg.org/multipage/tables.html#htmltableelement | HTMLTableElement} API
 * using `mdw-` prefixed sections and rows.
 */
export default CustomElement
  .extend()
  .define({
    /**
     * The table caption element (`mdw-caption`) or `null` when not present.
     * Mirrors `HTMLTableElement.caption` semantics.
     */
    caption: {
      get() {
        return getByTagName(this, 'mdw-caption');
      },
      set(value) {
        return setByTagName(this, 'mdw-caption', value, "Failed to set the 'caption' property on 'MDWTableElement': Failed to convert value to 'MDWCaptionElement'.");
      },
    },
    /**
     * The table header section (`mdw-thead`) element or `null` when not present.
     * Mirrors `HTMLTableElement.tHead` semantics.
     */
    tHead: {
      get() {
        return getByTagName(this, 'mdw-thead');
      },
      set(value) {
        return setByTagName(this, 'mdw-thead', value, "Failed to set the 'tHead' property on 'MDWTableElement': Failed to convert value to 'MDWTHeadElement'.");
      },
    },
    /**
     * The table footer section (`mdw-tfoot`) element or `null` when not present.
     */
    tFoot: {
      get() {
        return getByTagName(this, 'mdw-tfoot');
      },
      set(value) {
        return setByTagName(this, 'mdw-tfoot', value, "Failed to set the 'tFoot' property on 'MDWTableElement': Failed to convert value to 'MDWTFootElement'.");
      },
    },
    /**
     * Live `HTMLCollection` of `mdw-tbody` elements contained by the table.
     * Mirrors `HTMLTableElement.tBodies`.
     * @return {HTMLCollectionOf<Element>}
     */
    tBodies() {
      return this.getElementsByTagName('mdw-tbody');
    },
    /**
     * Live `HTMLCollection` of row elements (`mdw-tr`) in the table.
     * Mirrors `HTMLTableElement.rows`.
     * @return {HTMLCollectionOf<Element>}
     */
    rows() {
      return this.getElementsByTagName('mdw-tr');
    },
  })
  .methods({
    /** Create and return a `mdw-caption` element, appending when necessary. */
    createCaption() { return createByTagName(this, 'mdw-caption'); },
    /** Remove the table's caption element when present. */
    deleteCaption() { return deleteByTagName(this, 'mdw-caption'); },
    /** Create and return a `mdw-thead` element for the table. */
    createTHead() { return createByTagName(this, 'mdw-thead'); },
    /** Remove the table's `mdw-thead` element when present. */
    deleteTHead() { return deleteByTagName(this, 'mdw-thead'); },
    /** Create and return a `mdw-tfoot` element for the table. */
    createTFoot() { return createByTagName(this, 'mdw-tfoot'); },
    /** Remove the table's `mdw-tfoot` element when present. */
    deleteTFoot() { return deleteByTagName(this, 'mdw-tfoot'); },
    /** Insert and return a new `mdw-tbody` element before the tFoot (if any). */
    createTBody() { return this.insertBefore(this.tFoot, document.createElement('mdw-tbody')); },
  })
  .html`<slot id=slot></slot>`
  .css`
    :host{
      display:table;
    }
  `
  .autoRegister('mdw-table');
