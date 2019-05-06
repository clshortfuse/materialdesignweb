/** @return {HTMLElement} */
function AnyDomAdapterCreator() {
  return document.createElement('div');
}

/**
 * @param {HTMLElement} element
 * @param {any} data
 * @return {void}
 */
function AnyDomAdapterRenderer(element, data) {
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
 * @typedef {Object} DomAdapterRecycleOptions
 * @prop {HTMLElement} scroller Scrolling container element
 * @prop {boolean} [equalSize=false] All elements are equally sized
 * @prop {boolean} [block=false] All elements are block-like
 * @prop {boolean} [fastMeasure=false] Use integer precision for layout
 * @prop {boolean} [deferRender=false] Render on scroll idle
 */

/**
 * @template T1
 * @template {HTMLElement} T2
 * @typedef {Object} DomAdapterCreateOptions
 * @prop {HTMLElement} element
 * @prop {Array<T1>} datasource
 * @prop {DomAdapterRecycleOptions} [recycle]
 * @prop {function(T1):T2} [create={function(T1):HTMLElement}]
 * @prop {function(T2, T1):void} [render={function(HTMLElement,T1):void}]
 */

/**
 * @typedef {Object} DomAdapterBoundsCache
 * @prop {number} top
 * @prop {number} right
 * @prop {number} bottom
 * @prop {number} left
 * @prop {number} height
 * @prop {number} width
 */

/**
 * @template T1
 * @template {HTMLElement} T2
 */
export default class DomAdapter {
  /** @param {DomAdapterCreateOptions<T1, T2>} options */
  constructor(options) {
    this.element = options.element;
    this.datasource = options.datasource;
    /** @type {Map<T1, T2>} */
    this.dataElementMap = new Map();
    /** @type {WeakMap<T2, T1>} */
    this.elementDataMap = new WeakMap();
    /** @type {WeakMap<any, DomAdapterBoundsCache>} */
    this.dataBoundsMap = new WeakMap();
    this.create = options.create || AnyDomAdapterCreator;
    this.render = options.render || AnyDomAdapterRenderer;
    this.onScrollerScrollListener = () => this.onScrollerScroll();
    this.setupRecycleOptions(options.recycle);
  }

  /**
   * @param {DomAdapterRecycleOptions} recycleOptions
   * @return {void}
   */
  setupRecycleOptions(recycleOptions) {
    this.recycle = recycleOptions;
    if (!this.recycle) {
      return;
    }
    this.recycle.scroller.addEventListener('scroll', this.onScrollerScrollListener);
    const scrollerStyle = window.getComputedStyle(this.recycle.scroller);
    if (scrollerStyle.position === 'static') {
      this.recycle.scroller.style.setProperty('position', 'relative');
    }
  }

  onScrollerScroll() {
    this.drawViewport(false);
    if (this.deferRenderDebounce) {
      clearTimeout(this.deferRenderDebounce);
      this.deferRenderDebounce = null;
    }
    if (this.recycle && this.recycle.deferRender) {
      this.deferRenderDebounce = setTimeout(() => {
        this.drawViewport(true);
      }, 50);
    }
  }

  /**
   * @param {boolean} [checkForRemovedItems=true]
   * @return {void}
   */
  refresh(checkForRemovedItems = true) {
    if (checkForRemovedItems) {
      /** @type {T1[]} */
      const unlinkedDataItems = [];
      this.dataElementMap.forEach((element, data) => {
        if (this.datasource.indexOf(data) === -1) {
          unlinkedDataItems.push(data);
        }
      });
      unlinkedDataItems.forEach((data) => {
        this.removeItem(data);
      });
    }
    if (this.recycle) {
      this.element.style.removeProperty('box-sizing');
      this.element.style.removeProperty('padding-top');
      this.element.style.removeProperty('padding-bottom');
      this.element.style.removeProperty('height');
      this.clear();
      this.drawViewport(true);
    } else {
      this.datasource.forEach((data) => {
        this.refreshItem(data);
      });
    }
  }

  /** @return {void} */
  clear() {
    this.maxBottomBounds = 0;
    this.dataElementMap.clear();
    this.dataBoundsMap = new WeakMap();
    this.elementDataMap = new WeakMap();
    while (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild);
    }
  }


  /**
   * @param {boolean} [idle=false]
   * @return {void}
   */
  drawViewport(idle = false) {
    if (!this.recycle || !this.recycle.scroller) {
      return;
    }
    const itemsToDraw = [];
    let foundVisibleItem = false;
    const additionalPrerenderSize = (window.screen.height - this.recycle.scroller.clientHeight) / 2;
    const viewportTop = this.recycle.scroller.scrollTop;
    const viewportBottom = (this.recycle.scroller.scrollTop + this.recycle.scroller.offsetHeight);
    const preRenderTop = viewportTop - additionalPrerenderSize;
    const preRenderBottom = viewportBottom + additionalPrerenderSize;
    for (let i = 0; i < this.datasource.length; i += 1) {
      const item = this.datasource[i];
      let cachedBounds = this.dataBoundsMap.get(item);
      let newBounds = false;
      if (!cachedBounds) {
        const el = this.refreshItem(item, {
          render: !this.recycle.deferRender,
        });
        cachedBounds = this.storeBoundsCache(item, el);
        newBounds = true;
      }
      if ((cachedBounds.top >= viewportTop && cachedBounds.top <= viewportBottom)
          || (cachedBounds.bottom >= viewportTop && cachedBounds.bottom <= viewportBottom)) {
        itemsToDraw.push(item);
        foundVisibleItem = true;
      } else if ((cachedBounds.top >= preRenderTop && cachedBounds.top <= preRenderBottom)
              || (cachedBounds.bottom >= preRenderTop && cachedBounds.bottom <= preRenderBottom)) {
        itemsToDraw.push(item);
      } else if (foundVisibleItem) {
        if (newBounds) {
          this.dataBoundsMap.delete(item);
        }
        break;
      }
    }
    const renderedElements = [];
    let newPaddingTop = 0;
    let lastRenderedBounds;
    for (let i = 0; i < itemsToDraw.length; i += 1) {
      const item = itemsToDraw[i];
      let element = this.dataElementMap.get(item);

      if (!element) {
        element = this.refreshItem(item, {
          render: (this.recycle.deferRender ? idle : true),
        });
      } else if (this.recycle.deferRender && idle) {
        this.render(element, item);
      }
      const cachedBounds = this.dataBoundsMap.get(item);
      if (i === 0) {
        newPaddingTop = cachedBounds.top;
      }
      if (i === itemsToDraw.length - 1) {
        lastRenderedBounds = cachedBounds;
      }
      renderedElements.push(element);
    }
    for (let i = this.element.children.length - 1; i >= 0; i -= 1) {
      const child = this.element.children.item(i);
      if (renderedElements.indexOf(child) === -1) {
        this.removeElement(child);
      }
    }
    this.element.style.setProperty('padding-top', `${newPaddingTop}px`);
    const lastItem = this.datasource[this.datasource.length - 1];
    const lastItemBounds = this.dataBoundsMap.get(lastItem);

    if (lastItemBounds) {
      this.element.style.setProperty('box-sizing', 'border-box');
      this.element.style.setProperty('height', `${lastItemBounds.bottom}px`);
      this.element.style.removeProperty('padding-bottom');
    } else if (this.recycle.equalSize) {
      this.element.style.setProperty('box-sizing', 'border-box');
      this.element.style.setProperty('height', `${lastRenderedBounds.height * this.datasource.length}px`);
      this.element.style.removeProperty('padding-bottom');
    } else {
      if (!this.maxBottomBounds || lastRenderedBounds.bottom > this.maxBottomBounds) {
        this.maxBottomBounds = lastRenderedBounds.bottom;
      }
      const height = this.maxBottomBounds - newPaddingTop;
      this.element.style.setProperty('box-sizing', 'content-box');
      this.element.style.setProperty('height', `${height}px`);
      this.element.style.setProperty('padding-bottom', `${64}px`);
    }
  }

  /**
   * @param {T1} data
   * @param {T2} element
   * @return {DomAdapterBoundsCache} bounds
   */
  storeBoundsCache(data, element) {
    if (!this.recycle) {
      return null;
    }

    if (this.recycle.fastMeasure) {
      const cache = {
        top: element.offsetTop,
        right: element.offsetWidth + element.offsetLeft,
        bottom: element.offsetHeight + element.offsetTop,
        left: element.offsetLeft,
        height: element.clientHeight,
        width: element.clientWidth,
      };
      this.dataBoundsMap.set(data, cache);
      return cache;
    }

    const offsetParentRect = element.offsetParent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const top = elementRect.top - offsetParentRect.top + element.offsetParent.scrollTop;
    const left = elementRect.left - offsetParentRect.left + element.offsetParent.scrollLeft;
    const subpixelCache = {
      top,
      right: elementRect.width + left,
      bottom: elementRect.height + top,
      left,
      height: elementRect.height,
      width: elementRect.width,
    };
    this.dataBoundsMap.set(data, subpixelCache);
    return subpixelCache;
  }

  /**
   * @param {T1} data
   * @param {Object} [options]
   * @param {boolean} [options.checkPosition=true]
   * @param {boolean} [options.create=true]
   * @param {boolean} [options.render=true]
   * @return {T2} element
   */
  refreshItem(data, options = {}) {
    const dataIndex = this.datasource.indexOf(data);
    if (dataIndex === -1) {
      // Item has been removed
      this.removeItem(data);
      return null;
    }
    let elementIndex = -1;
    let element = this.dataElementMap.get(data);
    if (!element) {
      if (options.create === false) {
        this.dataBoundsMap.delete(data);
        return null;
      }
      /** @type {T2} */
      element = (this.create(data));
      element.setAttribute('aria-posinset', dataIndex.toString(10));
      this.dataElementMap.set(data, element);
      this.elementDataMap.set(element, data);
    }
    if (this.recycle && this.recycle.block) {
      const bounds = this.dataBoundsMap.get(data);
      element.style.setProperty('position', 'absolute');
      element.style.setProperty('left', '0');
      element.style.setProperty('right', '0');
      if (bounds) {
        element.style.setProperty('top', `${bounds.top}px`);
      } else if (dataIndex === 0) {
        element.style.setProperty('top', '0');
      } else if (this.recycle.equalSize) {
        element.style.setProperty('top', `${this.element.firstElementChild.clientHeight * dataIndex}px`);
      } else {
        const previousBounds = this.dataBoundsMap.get(this.datasource[dataIndex - 1]);
        if (!previousBounds) {
          throw new Error('No bounds!');
        }
        element.style.setProperty('top', `${previousBounds.bottom}px`);
      }
      if (!element.parentElement) {
        this.element.appendChild(element);
      }
    } else if (options.checkPosition === false) {
      if (!element.parentElement) {
        this.element.appendChild(element);
      }
    } else {
      if (element.parentElement === this.element) {
        // Element is in DOM
        let sibling = this.element.firstElementChild;
        let siblingIndex = -1;
        while (sibling) {
          siblingIndex += 1;
          if (sibling === element) {
            elementIndex = siblingIndex;
            break;
          }
          sibling = sibling.nextElementSibling;
        }
      }
      if (elementIndex !== dataIndex) {
        if (elementIndex !== -1) {
          // Element exists in wrong position and needs to be removed
          this.removeElement(element);
        }
        if (!this.element.children.length) {
          this.element.appendChild(element);
        } else {
          // Iterate through datasource to previous sibling element
          let siblingIndex = dataIndex - 1;
          let inserted = false;
          let previousDataObject;
          do {
            previousDataObject = this.datasource[siblingIndex];
            const previousElement = this.dataElementMap.get(previousDataObject);
            if (previousElement) {
              previousElement.insertAdjacentElement('afterend', element);
              inserted = true;
            } else {
              siblingIndex -= 1;
            }
          } while (previousDataObject && !inserted);
          if (!inserted) {
            this.element.insertBefore(element, this.element.firstElementChild);
          }
        }
      }
    }
    if (options.render === false) {
      if (this.recycle && !this.recycle.deferRender) {
        this.dataBoundsMap.delete(data);
      }
    } else {
      this.render(element, data);
    }
    return element;
  }

  /**
   * @param {T2} element
   * @return {void}
   */
  removeElement(element) {
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
    const data = this.elementDataMap.get(element);
    if (data) {
      this.dataElementMap.delete(data);
    }
    this.elementDataMap.delete(element);
  }

  /**
   * @param {T1} data
   * @return {void}
   */
  removeItem(data) {
    this.dataElementMap.delete(data);
    const element = this.dataElementMap.get(data);
    if (element) {
      this.removeElement(element);
    }
  }

  detach() {
    this.element = null;
    this.datasource = null;
  }
}
