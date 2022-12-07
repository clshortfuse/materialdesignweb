/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#htmloptionscollection
 * @template {HTMLOptionElement} T1
 * @template {HTMLOptGroupElement} T2
 * @param {Object} options
 * @param {HTMLElement} options.host
 * @param {HTMLCollectionOf<T1>} options.collection
 * @param {typeof T1} options.OptionConstructor
 * @param {typeof T2} options.GroupConstructor
 * @return {HTMLCollectionOf<T1> & HTMLOptionsCollection}
 */
export function constructHTMLOptionsCollectionProxy({ host, collection, OptionConstructor, GroupConstructor }) {
  /**
   * @param {T1} element
   * @param {HTMLElement|number} [before]
   * @return {void}
   */
  // eslint-disable-next-line func-style
  const add = function add(element, before) {
    let beforeElement;
    let index = -1;
    if (typeof before === 'number') {
      if (before >= 0 && before < collection.length - 1) {
        index = before;
      }
    } else if (before instanceof HTMLElement) {
      beforeElement = before;
    }
    if (index !== -1) {
      beforeElement = collection.item(index);
    }
    if (beforeElement) {
      beforeElement.before(element);
    } else {
      host.append(element);
    }
  };
  /**
   * @param {number} index
   * @return {void}
   */
  // eslint-disable-next-line func-style
  const remove = function remove(index) {
    collection.item(index)?.remove();
  };

  Object.defineProperty(collection, 'selectedIndex', {
    get() {
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].selected) {
          return i;
        }
      }
      return -1;
    },
    set(value) {
      for (let i = 0; i < collection.length; i++) {
        collection[i].selected = (i === value);
      }
    },
  });
  const newCollection = new Proxy(collection, {
    get(target, p, receiver) {
      switch (p) {
        case 'add':
          return add;
        case 'remove':
          return remove;
        default:
          return target[p];
      }
    },
    set(target, p, newValue, receiver) {
      let index = Number.NaN;
      switch (typeof p) {
        case 'string':
          index = Number.parseInt(p, 10);
          break;
        case 'number':
          index = p;
          break;
        default:
        case 'symbol':
          return Reflect.set(target, p, newValue, receiver);
      }
      if (Number.isNaN(index)) {
        return Reflect.set(target, p, newValue, receiver);
      }
      const currentSize = collection.length;
      while (index > collection.length) {
        add(new OptionConstructor());
      }
      if (index === currentSize) {
        if (newValue != null) {
          add(newValue);
        }
      } else if (index >= 0) {
        remove(index);
        if (newValue !== null) {
          add(newValue, index);
        }
      }
    },
  });
  return newCollection;
}
