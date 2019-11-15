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
 * @prop {function(T2, T1, number):void} [render={function(HTMLElement,T1):void}]
 */

/**
 * @typedef {Object} DomAdapterBounds
 * @prop {number} top
 * @prop {number=} right
 * @prop {number=} bottom
 * @prop {number=} left
 * @prop {number=} height
 * @prop {number=} width
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
    /** @type {WeakMap<any, DomAdapterBounds>} */
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
      /** @type {T2[]} */
      const orphanedElements = [];
      this.dataElementMap.forEach((element, data) => {
        if (this.datasource.indexOf(data) === -1) {
          unlinkedDataItems.push(data);
        }
      });
      for (let i = this.element.children.length - 1; i >= 0; i -= 1) {
        /** @type {T2} */
        const child = (this.element.children.item(i));
        const data = this.elementDataMap.get(child);
        if (data && this.datasource.indexOf(data) === -1) {
          orphanedElements.push(child);
        }
      }
      unlinkedDataItems.forEach((data) => {
        this.removeItem(data);
      });
      orphanedElements.forEach((el) => {
        this.removeElement(el);
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
   * @param {boolean} [idle=true]
   * @return {void}
   */
  drawViewport(idle = true) {
    if (!this.recycle || !this.recycle.scroller) {
      return;
    }
    const itemsToDraw = [];
    let foundVisibleItem = false;
    let expectedTop = null;
    let paddingTopSet = false;
    let lastBottom = 0;
    const additionalPrerenderSize = (window.screen.height - this.recycle.scroller.clientHeight) / 2;
    const viewportTop = this.recycle.scroller.scrollTop;
    const viewportBottom = (this.recycle.scroller.scrollTop + this.recycle.scroller.offsetHeight);
    const preRenderTop = viewportTop - additionalPrerenderSize;
    const preRenderBottom = viewportBottom + additionalPrerenderSize;
    for (let i = 0; i < this.datasource.length; i += 1) {
      const data = this.datasource[i];
      let dataBounds = this.getBounds(data, i);
      let newBounds = false;
      let element = null;
      if (!dataBounds || dataBounds.top == null || dataBounds.bottom == null) {
        if (!this.recycle.block && !paddingTopSet) {
          if (expectedTop != null) {
            this.element.style.setProperty('padding-top', `${expectedTop}px`);
          } else {
            this.element.style.setProperty('padding-top', `${lastBottom}px`);
          }
          paddingTopSet = true;
        }
        element = this.refreshItem(data, {
          create: true,
          render: !this.recycle.deferRender,
          invalidate: false,
        });
        dataBounds = this.storeBoundsCache(data, element);
        newBounds = true;
      }
      lastBottom = dataBounds.bottom;
      const isBottomInPrerender = (dataBounds.bottom >= preRenderTop
        && dataBounds.bottom <= preRenderBottom);
      const isTopInPrerender = (dataBounds.top >= preRenderTop
          && dataBounds.top <= preRenderBottom);
      if (isBottomInPrerender || isTopInPrerender) {
        if (expectedTop == null) {
          expectedTop = dataBounds.top;
        }
        itemsToDraw.push({
          data,
          index: i,
        });
        if (!foundVisibleItem) {
          const isBottomVisible = (dataBounds.bottom >= viewportTop
            && dataBounds.bottom <= viewportBottom);
          const isTopVisible = (dataBounds.top >= viewportTop
            && dataBounds.top <= viewportBottom);
          foundVisibleItem = (isBottomVisible || isTopVisible);
        }
      } else {
        if (!element && !paddingTopSet) {
          element = this.dataElementMap.get(data);
          if (element && element.parentElement) {
            this.removeElement(element);
          }
        }
        if (foundVisibleItem) {
          if (newBounds) {
            this.dataBoundsMap.delete(data);
          }
          break;
        }
      }
    }
    const renderedElements = [];
    let newPaddingTop = 0;
    let lastRenderedBounds;
    for (let i = 0; i < itemsToDraw.length; i += 1) {
      const item = itemsToDraw[i];
      let element = this.dataElementMap.get(item.data);

      if (!element) {
        element = this.refreshItem(item.data, {
          create: true,
          render: (this.recycle.deferRender ? idle : true),
          invalidate: false,
        });
      } else if (this.recycle.deferRender && idle) {
        this.render(element, item.data, item.index);
      }
      const cachedBounds = this.getBounds(item.data);
      if (i === 0 && !this.recycle.block) {
        newPaddingTop = cachedBounds.top;
      }
      if (i === itemsToDraw.length - 1) {
        lastRenderedBounds = cachedBounds;
      }
      renderedElements.push(element);
    }
    for (let i = this.element.children.length - 1; i >= 0; i -= 1) {
      /** @type {T2} */
      const child = (this.element.children.item(i));
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
   * @param {number} [indexHint]
   * @return {DomAdapterBounds}
   */
  getBounds(data, indexHint) {
    const cached = this.dataBoundsMap.get(data);
    if (cached) {
      return cached;
    }
    let index = -1;
    if (indexHint === -1 || indexHint == null) {
      index = this.datasource.indexOf(data);
    } else {
      index = indexHint;
    }
    if (index === -1) {
      return null;
    }
    let top = null;
    if (index === 0) {
      const cache = {
        top: 0,
      };
      this.dataBoundsMap.set(data, cache);
      return cache;
    }
    if (!this.recycle.block) {
      return null;
    }
    let height = null;
    const previousBounds = this.dataBoundsMap.get(this.datasource[index - 1]);
    if (previousBounds && previousBounds.bottom) {
      top = previousBounds.bottom;
    } else if (this.recycle.equalSize) {
      const firstBounds = this.dataBoundsMap.get(this.datasource[0]);
      if (firstBounds && firstBounds.height) {
        top = firstBounds.height * index;
        // eslint-disable-next-line prefer-destructuring
        height = firstBounds.height;
      } else {
        return null;
      }
    } else {
      return null;
    }
    if (height == null) {
      const cache = {
        top,
      };
      this.dataBoundsMap.set(data, cache);
      return cache;
    }
    const cache = {
      top,
      height,
      bottom: top + height,
    };
    this.dataBoundsMap.set(data, cache);
    return cache;
  }

  /**
   * @param {T2} element
   * @return {DomAdapterBounds} bounds
   */
  measureElementBounds(element) {
    if (this.recycle.fastMeasure) {
      return {
        top: element.offsetTop,
        right: element.offsetWidth + element.offsetLeft,
        bottom: element.offsetHeight + element.offsetTop,
        left: element.offsetLeft,
        height: element.clientHeight,
        width: element.clientWidth,
      };
    }
    const offsetParentRect = element.offsetParent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const top = elementRect.top - offsetParentRect.top + element.offsetParent.scrollTop;
    const left = elementRect.left - offsetParentRect.left + element.offsetParent.scrollLeft;
    return {
      top,
      right: elementRect.width + left,
      bottom: elementRect.height + top,
      left,
      height: elementRect.height,
      width: elementRect.width,
    };
  }

  /**
   * @param {T1} data
   * @param {T2} element
   * @return {DomAdapterBounds} bounds
   */
  storeBoundsCache(data, element) {
    if (!this.recycle) {
      return null;
    }
    const cache = this.measureElementBounds(element);
    this.dataBoundsMap.set(data, cache);
    return cache;
  }

  invalidateAll() {
    /** @type {WeakMap<any, DomAdapterBounds>} */
    this.dataBoundsMap = new WeakMap();
  }


  /**
   * @param {T1} data
   * @param {Object} [options]
   * @param {boolean} [options.checkPosition=true]
   * @param {boolean} [options.create] Automatic
   * @param {boolean} [options.render] Automatic based on deferRender
   * @param {boolean} [options.invalidate] Automatic
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
    let invalidate = false;
    if (element && this.recycle && this.recycle.deferRender && options.invalidate === true) {
      // Deferred Render has a forced invalidation
      // Item should be recreated
      this.removeElement(element);
      element = null;
    }
    if (!element) {
      // Element does not exist, assume size changed
      invalidate = true;
      /** @type {T2} */
      element = (this.create(data));
      this.dataElementMap.set(data, element);
      this.elementDataMap.set(element, data);
    }
    if (element && this.recycle && this.recycle.block) {
      const bounds = this.getBounds(data, dataIndex);
      element.style.setProperty('position', 'absolute');
      element.style.setProperty('left', '0');
      element.style.setProperty('right', '0');
      if (bounds) {
        element.style.setProperty('top', `${bounds.top}px`);
      } else {
        this.removeElement(element);
        element = null;
        invalidate = true;
      }
    }
    if (element && options.checkPosition === false) {
      if (!element.parentElement) {
        this.element.appendChild(element);
      }
    } else if (element) {
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
        if (!this.element.children.length) {
          if (element.parentElement) {
            element.parentElement.removeChild(element);
          }
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
              if (element.previousElementSibling !== previousElement) {
                if (element.parentElement) {
                  element.parentElement.removeChild(element);
                }
                previousElement.insertAdjacentElement('afterend', element);
              }
              inserted = true;
            } else {
              siblingIndex -= 1;
            }
          } while (previousDataObject && !inserted);
          if (!inserted) {
            if (element.parentElement) {
              element.parentElement.removeChild(element);
            }
            this.element.insertBefore(element, this.element.firstElementChild);
          }
        }
      }
    }
    if ((options.render === false)
        || (options.render !== true && this.recycle && this.recycle.deferRender)) {
      invalidate = true;
    } else if (element
      && (options.render === true || (!this.recycle || !this.recycle.deferRender))) {
      let prevClientWidth;
      let prevClientHeight;
      if (!invalidate && options.invalidate !== false) {
        // Store width and height for later comparison
        prevClientWidth = element.clientWidth;
        prevClientHeight = element.clientHeight;
      }
      this.render(element, data, dataIndex);
      if (!invalidate && options.invalidate !== false) {
        if (element.clientWidth !== prevClientWidth || element.clientHeight !== prevClientHeight) {
          // Element width or height has changed
          invalidate = true;
        }
      }
    }
    if (options.invalidate === true || (invalidate && options.invalidate !== false)) {
      this.invalidateItem(data, dataIndex);
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
   * @param {number} [indexHint]
   * @return {boolean} change
   */
  invalidateItem(data, indexHint) {
    if (!this.recycle || this.recycle.equalSize) {
      return false;
    }
    // Don't auto-create on non-block layouts
    // Invalidate in case of size change
    const currentBounds = this.dataBoundsMap.get(data);
    if (!currentBounds) {
      return false;
    }
    this.dataBoundsMap.delete(data);
    const dataIndex = (indexHint != null ? indexHint : this.datasource.indexOf(data));
    if (dataIndex === -1) {
      // Item was removed
      return true;
    }
    // Invalidate previous items at same Y position
    for (let j = dataIndex - 1; j >= 0; j -= 1) {
      const previousBounds = this.dataBoundsMap.get(this.datasource[j]);
      if (!previousBounds || previousBounds.top < currentBounds.top) {
        break;
      }
      this.dataBoundsMap.delete(this.datasource[j]);
    }
    // Invalidate next items
    for (let j = dataIndex + 1; j < this.datasource.length; j += 1) {
      if (!this.dataBoundsMap.delete(this.datasource[j])) {
        break;
      }
    }
    return true;
  }


  /**
   * @param {T1} data
   * @param {number} [previousIndex]
   * @return {void}
   */
  removeItem(data, previousIndex) {
    this.invalidateItem(data, previousIndex);
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
