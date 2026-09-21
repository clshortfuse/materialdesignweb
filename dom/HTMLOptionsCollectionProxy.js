/**
 * @param {any} value
 * @return {number}
 */
function toLong(value) {
  // eslint-disable-next-line no-bitwise, no-implicit-coercion, unicorn/prefer-math-trunc
  return +value >> 0;
}

/**
 * @param {any} value
 * @return {number}
 */
function toUnsignedLong(value) {
  // eslint-disable-next-line no-bitwise, no-implicit-coercion
  return +value >>> 0;
}

/**
 * @param {PropertyKey} key
 * @return {number|null}
 */
function getCollectionIndex(key) {
  if (typeof key !== 'string') return null;
  const index = toUnsignedLong(key);
  return index !== 4_294_967_295 && `${index}` === key ? index : null;
}

/**
 * Constructs a stable, live collection view over matching direct children.
 * @template {Element} T
 * @param {Object} options
 * @param {HTMLElement} options.host
 * @param {(element: Element) => boolean} options.accept
 * @param {() => T[]|null} [options.getIndexedElements]
 * @param {boolean} [options.indexedWritable]
 * @param {boolean} [options.namedEnumerable]
 * @param {Set<PropertyKey>} [options.reservedKeys]
 * @return {HTMLCollectionOf<T>}
 */
function constructDirectChildrenCollectionProxy({
  host,
  accept,
  getIndexedElements,
  indexedWritable = false,
  namedEnumerable = false,
  reservedKeys = new Set(['length', 'item', 'namedItem', Symbol.iterator]),
}) {
  const children = host.children;
  const facade = Object.create(Object.getPrototypeOf(children));
  /** @type {Map<PropertyKey, PropertyDescriptor>|null} */
  let enumerationDescriptors = null;
  let enumerationToken = 0;

  /** @param {number} index @return {T|null} */
  function item(index) {
    if (arguments.length === 0) throw new TypeError('1 argument required');
    const convertedIndex = toUnsignedLong(index);
    const indexedElements = getIndexedElements?.();
    if (indexedElements) return indexedElements[convertedIndex] ?? null;
    let acceptedIndex = 0;
    for (const element of children) {
      if (!accept(element)) continue;
      if (acceptedIndex === convertedIndex) return /** @type {T} */ (element);
      acceptedIndex += 1;
    }
    return null;
  }

  /** @param {string} name @return {T|null} */
  function namedItem(name) {
    if (arguments.length === 0) throw new TypeError('1 argument required');
    const convertedName = `${name}`;
    if (!convertedName) return null;
    const indexedElements = getIndexedElements?.();
    const elements = indexedElements ?? children;
    for (const element of elements) {
      if (!indexedElements && !accept(element)) continue;
      if (element.id === convertedName || element.getAttribute('name') === convertedName) {
        return /** @type {T} */ (element);
      }
    }
    return null;
  }

  /**
   * @return {Generator<T>}
   * @yields {T}
   */
  function* values() {
    const indexedElements = getIndexedElements?.();
    if (indexedElements) {
      yield* indexedElements;
      return;
    }
    for (const element of children) {
      if (accept(element)) {
        yield /** @type {T} */ (element);
      }
    }
  }

  return /** @type {HTMLCollectionOf<T>} */ (new Proxy(facade, {
    defineProperty(target, key, descriptor) {
      const index = getCollectionIndex(key);
      if (index != null
        || reservedKeys.has(key)
        || (typeof key === 'string' && namedItem(key))) return false;
      return Reflect.defineProperty(target, key, descriptor);
    },
    deleteProperty(target, key) {
      const index = getCollectionIndex(key);
      if (index != null && item(index)) return false;
      if (reservedKeys.has(key)
        || (typeof key === 'string' && namedItem(key))) return false;
      return Reflect.deleteProperty(target, key);
    },
    get(target, key) {
      if (key === 'length') {
        const indexedElements = getIndexedElements?.();
        if (indexedElements) return indexedElements.length;
        let length = 0;
        for (const element of children) {
          if (accept(element)) {
            length += 1;
          }
        }
        return length;
      }
      if (key === 'item') return item;
      if (key === 'namedItem') return namedItem;
      if (key === Symbol.iterator) return values;

      const index = getCollectionIndex(key);
      if (index != null) return item(index) ?? undefined;
      if (reservedKeys.has(key) || Reflect.has(target, key)) return Reflect.get(target, key);
      return typeof key === 'string' ? namedItem(key) ?? undefined : undefined;
    },
    getOwnPropertyDescriptor(target, key) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
      if (descriptor) return descriptor;
      const enumeratedDescriptor = enumerationDescriptors?.get(key);
      if (enumeratedDescriptor) return enumeratedDescriptor;

      const index = getCollectionIndex(key);
      if (index != null) {
        const value = item(index);
        return value == null ? undefined : {
          value,
          writable: indexedWritable,
          enumerable: true,
          configurable: true,
        };
      }
      if (typeof key !== 'string'
        || reservedKeys.has(key)
        || Reflect.has(target, key)) return undefined;
      const value = namedItem(key);
      return value == null ? undefined : {
        value,
        writable: false,
        enumerable: namedEnumerable,
        configurable: true,
      };
    },
    has(target, key) {
      if (reservedKeys.has(key)) return true;
      const index = getCollectionIndex(key);
      if (index != null) return item(index) != null;
      if (Reflect.has(target, key)) return true;
      return typeof key === 'string' && namedItem(key) != null;
    },
    ownKeys(target) {
      /** @type {T[]} */
      const acceptedElements = [];
      for (const element of children) {
        if (accept(element)) {
          acceptedElements.push(/** @type {T} */ (element));
        }
      }

      const targetKeys = Reflect.ownKeys(target);
      const seenKeys = new Set(targetKeys);
      const indexKeys = [];
      const nameKeys = [];
      const descriptors = new Map();
      for (let index = 0; index < acceptedElements.length; index += 1) {
        const key = `${index}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        indexKeys.push(key);
        descriptors.set(key, {
          value: acceptedElements[index],
          writable: indexedWritable,
          enumerable: true,
          configurable: true,
        });
      }
      for (const element of acceptedElements) {
        for (const name of [element.id, element.getAttribute('name')]) {
          if (!name || seenKeys.has(name)) continue;
          seenKeys.add(name);
          nameKeys.push(name);
          if (!reservedKeys.has(name) && !Reflect.has(target, name)) {
            descriptors.set(name, {
              value: element,
              writable: false,
              enumerable: namedEnumerable,
              configurable: true,
            });
          }
        }
      }
      enumerationDescriptors = descriptors;
      const token = ++enumerationToken;
      queueMicrotask(() => {
        if (enumerationToken === token) {
          enumerationDescriptors = null;
        }
      });
      return [...indexKeys, ...targetKeys, ...nameKeys];
    },
    preventExtensions() {
      return false;
    },
    set(target, key, value) {
      const index = getCollectionIndex(key);
      if (index != null
        || reservedKeys.has(key)
        || (typeof key === 'string' && namedItem(key))) return false;
      return Reflect.set(target, key, value);
    },
  }));
}

/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#htmloptionscollection
 * @template {HTMLElement & { selected: boolean }} T1
 * @param {Object} options
 * @param {HTMLElement} options.host
 * @param {HTMLCollectionOf<T1>} [options.collection]
 * @param {(element: Element) => boolean} [options.accept]
 * @param {() => T1[]|null} [options.getIndexedElements]
 * @param {(element: Element) => boolean} [options.acceptSelected]
 * @param {(collection: HTMLCollectionOf<T1>) => void} [options.receiveSelectedOptions]
 * @param {new (...args: any[]) => T1} options.OptionConstructor
 * @param {() => void} [options.beforeMutation]
 * @param {() => void} [options.afterMutation]
 * @return {HTMLCollectionOf<T1> & {
 *   length: number,
 *   selectedIndex: number,
 *   add(element: T1, before?: T1|number): void,
 *   remove(index: number): void,
 * }}
 */
export function constructHTMLOptionsCollectionProxy({
  host,
  collection,
  accept,
  getIndexedElements,
  acceptSelected,
  receiveSelectedOptions,
  OptionConstructor,
  beforeMutation,
  afterMutation,
}) {
  if (!collection) {
    if (!accept) throw new TypeError('An option predicate is required');
    collection = constructDirectChildrenCollectionProxy({
      host,
      accept,
      getIndexedElements,
      indexedWritable: true,
      namedEnumerable: true,
      reservedKeys: new Set([
        'length',
        'item',
        'namedItem',
        'add',
        'remove',
        'selectedIndex',
        Symbol.iterator,
      ]),
    });
  }
  if (receiveSelectedOptions) {
    if (!acceptSelected) throw new TypeError('A selected-option predicate is required');
    receiveSelectedOptions(constructDirectChildrenCollectionProxy({
      host,
      accept: acceptSelected,
    }));
  }
  if (typeof HTMLOptionsCollection !== 'undefined') {
    Object.setPrototypeOf(collection, HTMLOptionsCollection.prototype);
  }

  /** @param {any} element */
  function assertOption(element) {
    if (!(element instanceof OptionConstructor) || (accept && !accept(element))) {
      throw new TypeError('HTMLOptionsCollection only accepts list option elements');
    }
  }

  /**
   * @param {T1} element
   * @param {T1|number} [before]
   * @return {void}
   */
  function insertOption(element, before) {
    assertOption(element);
    /** @type {T1|null} */
    let beforeElement = null;
    if (before instanceof OptionConstructor) {
      if (before.parentElement !== host) {
        throw new DOMException('The reference element is not a direct child', 'NotFoundError');
      }
      beforeElement = before;
    } else if (before instanceof HTMLElement) {
      throw new TypeError('The reference element must be a list option');
    } else if (before != null) {
      beforeElement = collection.item(toLong(before));
    }
    if (beforeElement) {
      beforeElement.before(element);
    } else {
      host.append(element);
    }
  }

  /** @param {() => void} mutation */
  function mutate(mutation) {
    beforeMutation?.();
    try {
      mutation();
    } finally {
      afterMutation?.();
    }
  }

  /**
   * @param {T1} element
   * @param {T1|number} [before]
   * @return {void}
   */
  // eslint-disable-next-line func-style
  const add = function add(element, before) {
    if (arguments.length === 0) throw new TypeError('1 argument required');
    assertOption(element);
    if (before instanceof HTMLElement) {
      if (!(before instanceof OptionConstructor)) {
        throw new TypeError('The reference element must be a list option');
      }
      if (before.parentElement !== host) {
        throw new DOMException('The reference element is not a direct child', 'NotFoundError');
      }
    }
    mutate(() => insertOption(element, before));
  };

  /**
   * @param {number} index
   * @return {void}
   */
  // eslint-disable-next-line func-style
  const remove = function remove(index) {
    if (arguments.length === 0) throw new TypeError('1 argument required');
    const option = collection.item(toLong(index));
    if (!option) return;
    mutate(() => option.remove());
  };

  /** @return {number} */
  function getSelectedIndex() {
    let index = 0;
    for (const option of collection) {
      if (option.selected) return index;
      index += 1;
    }
    return -1;
  }

  /** @param {number} newLength */
  function setLength(newLength) {
    const currentLength = collection.length;
    if (newLength < currentLength) {
      const options = [...collection];
      for (let index = options.length - 1; index >= newLength; index -= 1) {
        options[index].remove();
      }
      return;
    }
    for (let index = currentLength; index < newLength; index += 1) {
      insertOption(new OptionConstructor());
    }
  }

  return /** @type {any} */ (new Proxy(collection, {
    get(target, key) {
      switch (key) {
        case 'add': return add;
        case 'remove': return remove;
        case 'selectedIndex': return getSelectedIndex();
        default: return Reflect.get(target, key);
      }
    },
    has(target, key) {
      return key === 'add'
        || key === 'remove'
        || key === 'selectedIndex'
        || Reflect.has(target, key);
    },
    set(target, key, newValue) {
      if (key === 'selectedIndex') {
        /** @type {HTMLElement & { selectedIndex: any }} */ (host).selectedIndex = newValue;
        return true;
      }
      if (key === 'length') {
        const newLength = toUnsignedLong(newValue);
        const currentLength = collection.length;
        if (newLength === currentLength
          || (newLength > currentLength && newLength > 100_000)) return true;
        mutate(() => setLength(newLength));
        return true;
      }
      if (key === 'add' || key === 'remove') return false;

      const index = getCollectionIndex(key);
      if (index == null) return Reflect.set(target, key, newValue);
      const current = collection.item(index);
      if (newValue == null) {
        if (!current) return true;
        mutate(() => current.remove());
        return true;
      }
      assertOption(newValue);
      if (current === newValue) return true;
      let currentSize = collection.length;
      if (index >= 100_000 && index >= currentSize) return true;
      mutate(() => {
        while (index > currentSize) {
          insertOption(new OptionConstructor());
          currentSize += 1;
        }
        if (current) {
          current.replaceWith(newValue);
        } else {
          insertOption(newValue);
        }
      });
      return true;
    },
  }));
}
