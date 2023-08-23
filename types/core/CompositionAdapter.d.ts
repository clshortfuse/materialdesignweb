/**
 * @typedef {Object} DomAdapterCreateOptions
 * @prop {Comment} anchorNode
 * @prop {(...args:any[]) => HTMLElement} [create]
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
export default class CompositionAdapter {
    /** @param {DomAdapterCreateOptions} options */
    constructor(options: DomAdapterCreateOptions);
    anchorNode: Comment;
    /** @type {ItemMetadata[]} */
    metadata: ItemMetadata[];
    /**
     * Ordered-list of metadata keys
     * Chrome and FireFox optimize arrays for indexOf/includes
     * Safari is faster with WeakMap.get(), but can't use Primitive keys
     * TODO: Add Safari path
     * @type {any[]}
     */
    keys: any[];
    /**
     * Chrome needs a hint to know we will need a fast path for array by keys.
     */
    needsArrayKeyFastPath: boolean;
    composition: any;
    renderOptions: any;
    pendingRemoves: any[];
    /** @type {Map<any, ItemMetadata>} */
    metadataCache: Map<any, ItemMetadata>;
    /** @type {Element[]} */
    queuedElements: Element[];
    /** @type {number|null} */
    batchStartIndex: number | null;
    /** @type {number|null} */
    batchEndIndex: number | null;
    render(changes: any, data: any): any;
    startBatch(): void;
    writeBatch(): void;
    stopBatch(): void;
    /** @param {number} index */
    removeByIndex(index: number): void;
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
    renderData(newIndex: number, changes: any, data: any, key: any, change: any, skipOnMatch?: boolean): void;
    needsArrayFastPath: boolean;
    removeEntries(startIndex?: number): void;
    /**
     * @param {number} [index]
     * @param {ItemMetadata} [metadata]
     * @param {any} [key]
     * @return {boolean} changed
     */
    hide(index?: number, metadata?: ItemMetadata, key?: any): boolean;
    /**
     * @param {number} [index]
     * @param {ItemMetadata} [metadata]
     * @param {any} [key]
     * @return {boolean} changed
     */
    show(index?: number, metadata?: ItemMetadata, key?: any): boolean;
}
export type DomAdapterCreateOptions = {
    anchorNode: Comment;
    create?: (...args: any[]) => HTMLElement;
};
export type ItemMetadata = {
    element: Element;
    key: any;
    domNode: Element | Comment;
    render: Function;
    hidden?: boolean;
    comment?: Comment;
};
//# sourceMappingURL=CompositionAdapter.d.ts.map