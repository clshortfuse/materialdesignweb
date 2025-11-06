import { createEmptyComment } from './optimizations.js';

/**
 * @template T
 * @typedef {import('./Composition.js').default<T>} Composition
 */

/**
 * @template T
 * @typedef {import('./Composition.js').RenderOptions<T>} RenderOptions
 */

/**
 * @template T
 * @typedef {Object} DomAdapterCreateOptions
 * @prop {Comment} anchorNode
 * @prop {(...args:any[]) => HTMLElement} [create]
 * @prop {Composition<T>} composition
 * @prop {RenderOptions<T>} renderOptions
 */

/**
 * @typedef {Object} ItemMetadata
 * @prop {Element} element
 * @prop {any} key
 * @prop {Element|Comment} domNode
 * @prop {Function} render
 * @prop {boolean} [hidden]
 * @prop {Comment} [comment]
 */

/** @template T */
export default class CompositionAdapter {
  /** @param {DomAdapterCreateOptions<T>} options */
  constructor(options) {
    this.anchorNode = options.anchorNode;

    /** @type {ItemMetadata[]} */
    this.metadata = [];
    /**
     * Ordered-list of metadata keys
     * Chrome and FireFox optimize arrays for indexOf/includes
     * Safari is faster with WeakMap.get(), but can't use Primitive keys
     * TODO: Add Safari path
     * @type {any[]}
     */
    this.keys = [];

    /**
     * Chrome needs a hint to know we will need a fast path for array by keys.
     */
    this.needsArrayKeyFastPath = false;

    /** @type {Composition<T>} */
    this.composition = options.composition;
    /** @type {RenderOptions<T>} */
    this.renderOptions = options.renderOptions;

    /** @type {Map<any, ItemMetadata>} */
    this.metadataCache = null;

    /** @type {Element[]} */
    this.queuedElements = [];
    // this.batching = false;
    /** @type {number|null} */
    this.batchStartIndex = null;
    /** @type {number|null} */
    this.batchEndIndex = null;
  }

  /**
   * @param {Partial<T>} changes
   * @param {T} data
   * @return {import('./Composition.js').RenderDraw<T>}
   */
  render(changes, data) {
    return this.composition.render(changes, data, this.renderOptions);
  }

  startBatch() {
    this.needsArrayKeyFastPath = true;
    // this.batching = true;
  }

  writeBatch() {
    if (!this.queuedElements.length) return;
    /** @type {Comment|Element|Document} */
    const previousSibling = this.metadata[this.batchStartIndex - 1]?.domNode ?? this.anchorNode;
    previousSibling.after(...this.queuedElements);
    this.queuedElements.length = 0;
  }

  stopBatch() {
    this.writeBatch();

    this.needsArrayKeyFastPath = false;
    this.batchStartIndex = null;
    this.batchEndIndex = null;
    if (this.metadataCache) {
      for (const { domNode } of this.metadataCache.values()) {
        domNode.remove();
      }
      this.metadataCache.clear();
    }
  }

  /** @param {number} index */
  removeByIndex(index) {
    const [metadata] = this.metadata.splice(index, 1);
    const { domNode, key } = metadata;
    this.keys.splice(index, 1);
    domNode.remove();

    // Don't release in case we may need it later
    if (this.metadataCache) {
      this.metadataCache.set(key, metadata);
    } else {
      this.metadataCache = new Map([[key, metadata]]);
    }
  }

  /**
   * Worst case scenario
   * @param {number} newIndex expectedIndex
   * @param {*} changes
   * @param {*} data
   * @param {*} key
   * @param {*} change
   * @param {boolean} [skipOnMatch]
   * JSON Merge has no way to express sort change and data change. Best
   * performance is done via invoking render on sort change and another on
   * inner change. Can't skip if mixing change types.
   */
  renderData(newIndex, changes, data, key, change, skipOnMatch) {
    if (newIndex < this.metadata.length) {
      const metadataAtIndex = this.metadata[newIndex];

      // There is an element in this slot

      // Compare if different
      const currentKey = metadataAtIndex.key;
      const sameKey = (currentKey === key);
      const isPartial = (change !== key);

      if (sameKey) {
        // Both reference the same key (correct spot)
        if (isPartial) {
          metadataAtIndex.render(changes, data);
        } else if (skipOnMatch) {
          // Skip overwrite. Presume no change
          // console.warn('same key, no reason to repaint', newIndex);
        } else {
          // console.warn('no skip on match', newIndex);
          metadataAtIndex.render(changes, data);
        }
        return;
      }

      // eslint-disable-next-line no-multi-assign
      const metadataCache = (this.metadataCache ??= new Map());

      // If not same key. Scan key list.
      // Can avoid checking before current index. Will always be after current
      let failedFastPath = false;
      if (this.needsArrayKeyFastPath) {
        // Invoking includes will ensure Chrome generates an internal hash map
        failedFastPath = !this.keys.includes(key);
        this.needsArrayFastPath = false;
      }
      const oldIndex = failedFastPath ? -1 : this.keys.indexOf(key, newIndex + 1);
      if (oldIndex === -1) {
        // New key
        // console.log('new key?', 'should be at', newIndex);
        // Was key removed in this batch?
        if (metadataCache.has(key)) {
          // console.log('inserting removed element', 'at', newIndex);
          // (Optimistic insert)
          // Key was removed and should be here instead
          // If should have been replace, will correct next step
          const previousMetadata = metadataCache.get(key);
          this.metadata.splice(newIndex, 0, previousMetadata);
          this.keys.splice(newIndex, 0, key);

          const previousSibling = this.metadata[newIndex - 1]?.domNode ?? this.anchorNode;
          previousSibling.after(previousMetadata.domNode);
          metadataCache.delete(key);
          return;
        }

        // (Optimistic replace)
        // Brand new key. Cache whatever is in current and replace
        // If should have been insert, will correct itself next step.
        // Allows multiple inserts to batch instead of one-by-one

        // console.log('completely new key', 'removing old. will replace', newIndex);
        metadataCache.set(currentKey, metadataAtIndex);

        // Continue to PUT below
      } else {
        // Key is in the wrong spot (guaranteed to be oldIndex > newIndex)
        // console.warn('Found key for', newIndex, '@', oldIndex);
        // console.warn('swapping', newIndex, '<=>', oldIndex);
        if ((newIndex - oldIndex) === -1) {
          // (Optimistic removal)
          // If element should be one step sooner, remove instead to shift up.
          // If should have been swap, will correct itself next step.
          // console.warn('Removing', newIndex, 'instead');
          this.removeByIndex(newIndex);
          return;
        }
        // Swap with other element
        // Arrays should be iterated sequentially.
        // Array can never swap before current index

        // Store what's later in the tree to move here

        const correctMetadata = this.metadata[oldIndex];

        // Move back <=
        this.metadata[newIndex] = correctMetadata;
        this.metadata.splice(oldIndex, 1);

        const { domNode: domNodeToRemove } = metadataAtIndex;
        domNodeToRemove.replaceWith(correctMetadata.domNode);

        if (!skipOnMatch) {
          console.warn('no skip on match on swap', newIndex);
          correctMetadata.render(changes, data);
        }

        // Remove posterior

        this.keys[newIndex] = key;
        this.keys.splice(oldIndex, 1);

        domNodeToRemove.remove();

        // Don't release in case we may need it later
        // console.debug('Caching key', key);
        metadataCache.set(currentKey, metadataAtIndex);

        return;
      }
    }

    const render = this.render(changes, data);
    const element = /** @type {Element} */ (render.target);

    this.metadata[newIndex] = {
      render,
      element,
      key,
      domNode: element,
    };
    this.keys[newIndex] = key;

    if (this.batchEndIndex === null || this.batchEndIndex !== (newIndex - 1)) {
      this.writeBatch();
      // Start new batch
      this.batchStartIndex = newIndex;
    }
    this.batchEndIndex = newIndex;
    this.queuedElements.push(element);
  }

  removeEntries(startIndex = 0) {
    const { length } = this.metadata;
    for (let index = length - 1; index >= startIndex; index--) {
      this.metadata[index].domNode.remove();
    }
    this.metadata.length = startIndex;
    this.keys.length = startIndex;
  }

  /**
   * @param {number} [index]
   * @param {ItemMetadata} [metadata]
   * @param {any} [key]
   * @return {boolean} changed
   */
  hide(index, metadata, key) {
    if (!metadata) {
      if (index == null) {
        index = this.keys.indexOf(key);
      }
      metadata = this.metadata[index];
      if (!metadata) {
        return false;
      }
    }

    if (metadata.hidden) return false;

    let { comment, element } = metadata;
    if (!comment) {
      comment = createEmptyComment();
      metadata.comment = comment;
    }

    element.replaceWith(comment);
    metadata.domNode = comment;
    metadata.hidden = true;
    return true;
  }

  /**
   * @param {number} [index]
   * @param {ItemMetadata} [metadata]
   * @param {any} [key]
   * @return {boolean} changed
   */
  show(index, metadata, key) {
    if (!metadata) {
      if (index == null) {
        index = this.keys.indexOf(key);
      }
      metadata = this.metadata[index];
      if (!metadata) {
        return false;
      }
    }

    if (!metadata.hidden) return false;

    const { comment, element } = metadata;

    comment.replaceWith(element);
    metadata.domNode = element;
    metadata.hidden = false;
    return true;
  }
}
