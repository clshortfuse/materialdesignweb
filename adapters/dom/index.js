/** @return {HTMLElement} */
function AnyDomAdapterCreatorFn() {
  return document.createElement('div');
}

/**
 * @param {HTMLElement} element
 * @param {any} data
 * @return {void}
 */
function AnyDomAdapterRendererFn(element, data) {
  let s = '';
  if (data != null) {
    if (data.toString) {
      s = data.toString();
    } else {
      // eslint-disable-next-line no-new-wrappers
      s = new String(data).toString();
    }
  }
  if (element.textContent !== s) {
    // eslint-disable-next-line no-param-reassign
    element.textContent = s;
  }
}

/**
 * @template T1
 * @template {HTMLElement} T2
 */
export default class DomAdapter {
  /**
   * @param {HTMLElement} element
   * @param {Array<T1>} datasource
   * @param {function(T2, T1):void} [renderFn={function(HTMLElement,T1):void}]
   * @param {function():T2} [createFn={function():HTMLElement}]
   */
  constructor(element, datasource, renderFn, createFn) {
    this.element = element;
    this.datasource = datasource;
    /** @type {Map<T1, T2>} */
    this.map = new Map();
    /** @type {WeakMap<T2, T1>} */
    this.elementMap = new Map();
    this.render = renderFn || AnyDomAdapterRendererFn;
    this.create = createFn || AnyDomAdapterCreatorFn;
  }

  /** @return {void} */
  refresh() {
    /** @type {T1[]} */
    const unlinkedDataItems = [];
    this.map.forEach((element, data) => {
      if (this.datasource.indexOf(data) === -1) {
        unlinkedDataItems.push(data);
      }
    });
    unlinkedDataItems.forEach((data) => {
      this.removeItem(data);
    });
    this.datasource.forEach((data) => {
      this.refreshItem(data);
    });
  }

  /** @return {void} */
  clear() {
    this.map.clear();
    this.elementMap = new WeakMap();
    while (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild);
    }
  }

  /**
   * @param {T1} data
   * @param {boolean} [checkPosition=true]
   * @return {void}
   */
  refreshItem(data, checkPosition = true) {
    const index = this.datasource.indexOf(data);
    if (index === -1) {
      this.removeItem(data);
      return;
    }
    let elementIndex = -1;
    let element = this.map.get(data);
    if (!element) {
      // @ts-ignore
      element = this.create();
      this.map.set(data, element);
      this.elementMap.set(element, data);
    } else if (checkPosition) {
      elementIndex = index;
    } else {
      let sibling = this.element.firstChild;
      let siblingIndex = -1;
      while (sibling) {
        siblingIndex += 1;
        if (sibling === element) {
          elementIndex = siblingIndex;
          break;
        }
        sibling = sibling.nextSibling;
      }
    }
    this.render(element, data);
    if (elementIndex === index) {
      return;
    }
    if (elementIndex !== -1 && element.parentElement) {
      element.parentElement.removeChild(element);
      this.elementMap.delete(element);
    }
    let idx = index;
    let nextDataObject = this.datasource[idx + 1];
    while (nextDataObject) {
      const nextElement = this.map.get(nextDataObject);
      if (nextElement) {
        this.element.insertBefore(element, nextElement);
        return;
      }
      idx += 1;
      nextDataObject = this.datasource[idx + 1];
    }
    this.element.appendChild(element);
  }

  /**
   * @param {T1} data
   * @return {void}
   */
  removeItem(data) {
    const element = this.map.get(data);
    if (!element) {
      return;
    }
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
    this.map.delete(data);
    this.elementMap.delete(element);
  }

  detach() {
    this.element = null;
    this.datasource = null;
  }
}
