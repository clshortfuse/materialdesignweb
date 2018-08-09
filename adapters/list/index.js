/**
 * @interface
 * @template T
 */
class IListAdapterRenderer {
  /** @param {T} data */
  constructor(data) {
    this.data = data;
    this.createElement();
    this.render();
  }

  /**
   * @abstract
   * @return {void}
   */
  createElement() {
    this.element = document.createElement('li');
    this.element.classList.add('mdw-list__item');
  }

  /**
   * @abstract
   * @return {void}
   */
  // eslint-disable-next-line class-methods-use-this
  render() {
    throw new Error('Not implemented.');
  }
}

/** @extends {IListAdapterRenderer<Object>} */
class AnyListAdapterRenderer extends IListAdapterRenderer {
  createElement() {
    super.createElement();
    const markup = `
      <div class="mdw-list__text/">
    `.trim();
    this.element.innerHTML = markup;
    this.primaryText = this.element.getElementsByClassName('mdw-list__text')[0];
  }

  render() {
    let s = '';
    if (this.data != null) {
      if (this.data.toString) {
        s = this.data.toString();
      } else {
        s = new String(this.data).toString(); // eslint-disable-line no-new-wrappers
      }
    }
    if (this.primaryText.textContent !== s) {
      this.primaryText.textContent = s;
    }
  }
}

/**
 * @typedef ListAdapterOptions<T>
 * @prop {HTMLElement} list
 * @prop {Array<T>} datasource
 * @prop {typeof IListAdapterRenderer} renderer
 * @template T
 */


/**
 * @interface
 * @template T
 */
class ListAdapter {
  /** @param {ListAdapterOptions<T>} options */
  constructor(options) {
    this.element = options.list;
    this.datasource = options.datasource;
    /** @type {Map<T, IListAdapterRenderer<T>>} */
    this.map = new Map();
    this.renderer = options.renderer || AnyListAdapterRenderer;
  }

  refresh() {
    const unlinkedDataItems = [];
    this.map.forEach((element, data) => {
      if (this.datasource.indexOf(data) === -1) {
        unlinkedDataItems.push(data);
      }
    });
    unlinkedDataItems.forEach(data => () => {
      this.removeItem(data);
    });
    this.datasource.forEach((data) => {
      this.refreshItem(data);
    });
  }

  refreshItem(data, checkPosition = true) {
    const index = this.datasource.indexOf(data);
    if (index === -1) {
      this.removeItem(data);
      return;
    }
    let elementIndex = -1;
    let item = this.map.get(data);
    if (!item) {
      item = new this.renderer(data); // eslint-disable-line new-cap
      this.map.set(data, item);
    } else if (checkPosition) {
      elementIndex = index;
    } else {
      let sibling = this.element.firstElementChild;
      let siblingIndex = -1;
      while (sibling) {
        siblingIndex += 1;
        if (sibling === item.element) {
          elementIndex = siblingIndex;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
    }
    item.render();
    if (elementIndex === index) {
      return;
    }
    let idx = index;
    let nextDataObject = this.datasource[idx + 1];
    while (nextDataObject) {
      const nextElementMap = this.map.get(nextDataObject);
      if (nextElementMap) {
        this.element.insertBefore(item.element, nextElementMap.element);
        return;
      }
      idx += 1;
      nextDataObject = this.datasource[idx + 1];
    }
    this.element.appendChild(item.element);
  }

  removeItem(data) {
    const item = this.map.get(data);
    if (!item) {
      return;
    }
    if (item.element.parentElement) {
      item.element.parentElement.removeChild(item.element);
    }
    this.map.delete(data);
  }

  detach() {
    this.element.removeAttribute('mdw-adapter');
    this.element = null;
    this.datasource = null;
  }
}

export {
  ListAdapter,
  IListAdapterRenderer,
  AnyListAdapterRenderer,
};
