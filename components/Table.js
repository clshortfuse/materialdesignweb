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

/** -implements {HTMLTableElement} */
CustomElement
  .extend()
  .define({
    caption: {
      get() {
        return getByTagName(this, 'mdw-caption');
      },
      set(value) {
        return setByTagName(this, 'mdw-caption', value, "Failed to set the 'caption' property on 'MDWTableElement': Failed to convert value to 'MDWCaptionElement'.");
      },
    },
    tHead: {
      get() {
        return getByTagName(this, 'mdw-thread');
      },
      set(value) {
        return setByTagName(this, 'mdw-thead', value, "Failed to set the 'tHead' property on 'MDWTableElement': Failed to convert value to 'MDWTHeadElement'.");
      },
    },
    tFoot: {
      get() {
        return getByTagName(this, 'mdw-tfoot');
      },
      set(value) {
        return setByTagName(this, 'mdw-tfoot', value, "Failed to set the 'tFoot' property on 'MDWTableElement': Failed to convert value to 'MDWTFootElement'.");
      },
    },
    tBodies() {
      return this.getElementsByTagName('mdw-tbody');
    },
    rows() {
      return this.getElementsByTagName('mdw-tr');
    },
  })
  .methods({
    createCaption() { return createByTagName(this, 'mdw-caption'); },
    deleteCaption() { return deleteByTagName(this, 'mdw-caption'); },
    createTHead() { return createByTagName(this, 'mdw-thead'); },
    deleteTHead() { return deleteByTagName(this, 'mdw-thead'); },
    createTFoot() { return createByTagName(this, 'mdw-tfoot'); },
    deleteTFoot() { return deleteByTagName(this, 'mdw-tfoot'); },
    createTBody() { return this.insertBefore(this.tFoot, document.createElement('mdw-tbody')); },
  })
  .html`<slot id=slot></slot>`
  .css`
    :host{
      display:table;
    }
  `
  .autoRegister('mdw-table');
