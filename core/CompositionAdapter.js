/** @return {HTMLElement} */
function AnyDomAdapterCreator() {
  return document.createElement('div');
}

/**
 * Fastest way to find element index
 * @param {Element} element
 * @return {number}
 */
function indexOfElement(element) {
  return Array.prototype.indexOf.call(element.parentElement, element);
}

/**
 * Fastest way to find node index
 * @param {ChildNode} node
 * @return {number}
 */
function indexOfNode(node) {
  let index = 0;
  let prev = node;
  while ((prev = prev.previousSibling)) {
    index++;
  }
  return index;
}

/**
 * @typedef {Object} DomAdapterCreateOptions
 * @prop {Comment} anchorNode
 * @prop {(...args:any[]) => HTMLElement} [create]
 */

export default class CompositionAdapter {
  /** @param {DomAdapterCreateOptions} options */
  constructor(options) {
    this.anchorNode = options.anchorNode;
    /** @type {HTMLElement[]} */
    this.elementRefs = [];
    /** @type {(HTMLElement|Comment)[]} */
    this.domRefs = [];
    /** @type {WeakMap<Element, Comment>} */
    this.elementPlaceholders = new WeakMap();
    this.create = options.create || AnyDomAdapterCreator;
  }

  /**
   * @param {number} index
   * @param {boolean} [create]
   * @return {HTMLElement}
   */
  getElementByIndex(index, create) {
    let element = this.elementRefs[index];
    if (!element && create) {
      element = this.insertByIndex(index);
      // TODO: Allow holes?
      this.elementRefs[index] = element;
    }
    return element;
  }

  /** @param {HTMLElement} element */
  removeByElement(element) {
    const refIndex = this.elementRefs.indexOf(element);
    if (refIndex !== -1) {
      this.elementRefs.splice(refIndex, 1);
      element.remove();
    }
    return refIndex;
  }

  /** @param {number} index */
  removeByIndex(index) {
    const element = this.elementRefs[index];
    const domRef = this.domRefs[index];
    this.elementRefs.splice(index, 1);
    this.domRefs.splice(index, 1);
    element.remove();
    if (domRef !== element) {
      domRef.parentNode?.removeChild(domRef);
    }
  }

  /**
   * @param {number} index
   * @param {HTMLElement} element
   * @param {boolean} [checkPosition]
   * @return {HTMLElement}
   */
  insertByIndex(index, element, checkPosition) {
    if (checkPosition) {
      // Element exists, that means an insert is actually a move operation
      const previousIndex = this.removeByElement(element);
      if (previousIndex === -1) {
        if (element.parentElement) {
          console.warn('Element was not part of adapter');
        } else {
          console.debug('Using passed element (pre-rendered?)');
        }
      } else {
        console.warn('Re-inserting element. Removed before insert. Index may be different');
      }
    }

    this.elementRefs[index] = element;
    const previousSibling = this.domRefs[index - 1] ?? this.anchorNode;
    previousSibling.after(element);
    this.domRefs[index] = element;

    return element;
  }

  /**
   * @param {HTMLElement} [element]
   * @return {HTMLElement}
   */
  appendElement(element) {
    return this.insertByIndex(this.domRefs.length, element, false);
  }

  /**
   * @param {HTMLElement} element
   * @return {boolean} changed
   */
  hideByElement(element) {
    const domRefIndex = this.domRefs.indexOf(element);
    if (domRefIndex === -1) {
      // Already hidden?
      return false;
    }
    let commentPlaceholder = this.elementPlaceholders.get(element);
    if (!commentPlaceholder) {
      commentPlaceholder = new Comment('{adapter-item}');
      this.elementPlaceholders.set(element, commentPlaceholder);
    }
    this.domRefs.splice(domRefIndex, 1, commentPlaceholder);
    element.replaceWith(commentPlaceholder);
    return true;
  }

  /**
   * @param {HTMLElement} element
   * @return {boolean} changed
   */
  showByElement(element) {
    const index = this.elementRefs.indexOf(element);
    if (index === -1) {
      // Element is not part of adapter. Adding
      console.warn('Appending element to DOM');
      this.appendElement(element);
      return true;
    }

    const domRef = this.domRefs[index];
    if (domRef === element) {
      // Element already in DOM
      return false;
    }
    domRef.replaceWith(element);
    this.domRefs.splice(index, 1, element);
    return true;
  }
}
