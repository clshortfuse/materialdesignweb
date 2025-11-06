/** @template T */
export default class Composition<T> {
    static EVENT_PREFIX_REGEX: RegExp;
    static shadowRootTag: symbol;
    /**
     * @template T
     * @param  {ConstructorParameters<typeof Composition<T>>} parts
     * @return {Composition<T>}
     */
    static compose<T_1>(...parts: ConstructorParameters<typeof Composition<T_1>>): Composition<T_1>;
    /**
     * @param {(CompositionPart<T>)[]} parts
     */
    constructor(...parts: (CompositionPart<T>)[]);
    _interpolationState: {
        nodeIndex: number;
        searchIndex: number;
        cacheIndex: number;
        commentIndex: number;
        /** @type {this['nodesToBind'][0]} */
        nodeEntry: this["nodesToBind"][0];
    };
    /** @type {{tag:string, textNodes: number[]}[]} */
    nodesToBind: {
        tag: string;
        textNodes: number[];
    }[];
    /** @type {string[]} */
    props: string[];
    /** @type {RenderGraphSearch[]} */
    searches: RenderGraphSearch[];
    /** @type {any[]} */
    initCache: any[];
    /**
     * Index of searches by query (dotted notation for deep props)
     * @type {Map<Function|string, RenderGraphSearch>}
     */
    searchByQuery: Map<Function | string, RenderGraphSearch>;
    /**
     * Index of searches by query (dotted notation for deep props)
     * @type {Map<string, RenderGraphAction[]>}
     */
    actionsByPropsUsed: Map<string, RenderGraphAction[]>;
    /** @type {RenderGraphAction[]} */
    postInitActions: RenderGraphAction[];
    /** @type {Set<string>} */
    tagsWithBindings: Set<string>;
    /**
     * Array of element tags
     * @type {string[]}
     */
    tags: string[];
    /**
     * Data of arrays used in templates
     * Usage of a [mdw-for] will create an ArrayLike expectation based on key
     * Only store metadata, not actual data. Currently only needs length.
     * TBD if more is needed later
     * Referenced by property key (string)
     * @type {CompositionAdapter<T>}
     */
    adapter: CompositionAdapter<T>;
    /**
     * Collection of events to bind.
     * Indexed by ID
     * @type {Map<string|symbol, CompositionEventListener<any>[]>}
     */
    events: Map<string | symbol, CompositionEventListener<any>[]>;
    /**
     * Snapshot of composition at initial state.
     * This fragment can be cloned for first rendering, instead of calling
     * of using `render()` to construct the initial DOM tree.
     * @type {DocumentFragment}
     */
    cloneable: DocumentFragment;
    /** @type {(HTMLStyleElement|CSSStyleSheet)[]} */
    styles: (HTMLStyleElement | CSSStyleSheet)[];
    /** @type {CSSStyleSheet[]} */
    adoptedStyleSheets: CSSStyleSheet[];
    /** @type {DocumentFragment} */
    stylesFragment: DocumentFragment;
    /**
     * List of IDs used by template elements
     * May be needed to be removed when adding to non-DocumentFragment
     * @type {string[]}
     */
    allIds: string[];
    /**
     * Collection of IDs used for referencing elements
     * Not meant for live DOM. Removed before attaching to document
     */
    /** @type {Set<string>} */
    temporaryIds: Set<string>;
    /** Flag set when template and styles have been interpolated */
    interpolated: boolean;
    /**
     * Template used to build interpolation and cloneable
     */
    template: DocumentFragment;
    /**
     * @param {CompositionPart<T>[]} parts
     */
    append(...parts: CompositionPart<T>[]): this;
    /** @param {CompositionEventListener<T>} listener */
    addCompositionEventListener(listener: CompositionEventListener<T>): this;
    /**
     * TODO: Add types and clean up closure leak
     * Updates component nodes based on data.
     * Expects data in JSON Merge Patch format
     * @see https://www.rfc-editor.org/rfc/rfc7386
     * @template {Object} T
     * @param {Partial<T>} changes what specifically
     * @param {T} [data]
     * @param {RenderOptions<T>} [options]
     * @return {RenderDraw<T>} anchor
     */
    render<T_1 extends Object>(changes: Partial<T_1>, data?: T_1, options?: RenderOptions<T_1>): RenderDraw<T_1>;
    /**
     * @param {InterpolateOptions} [options]
     */
    interpolate(options?: InterpolateOptions): void;
    interpolateOptions: InterpolateOptions;
    /**
     * @param {RenderGraphSearch} search
     * @return {RenderGraphSearch}
     */
    addSearch(search: RenderGraphSearch): RenderGraphSearch;
    /**
     * @param {RenderGraphAction} action
     * @return {RenderGraphAction}
     */
    addAction(action: RenderGraphAction): RenderGraphAction;
    [Symbol.iterator](): Generator<DocumentFragment | CSSStyleSheet | HTMLStyleElement, void, unknown>;
    #private;
}
export type CompositionPart<T> = Composition<unknown> | HTMLStyleElement | CSSStyleSheet | DocumentFragment | string;
export type Compositor<T extends unknown> = (...parts: (CompositionPart<T>)[]) => Composition<T>;
export type RenderOptions<T> = {
    /**
     * what
     */
    defaults?: T;
    /**
     * what
     */
    store?: T;
    /**
     * where
     */
    target?: DocumentFragment | HTMLElement | Element;
    /**
     * where
     */
    shadowRoot?: ShadowRoot;
    /**
     * `this` on callbacks/events
     */
    context?: any;
    injections?: any;
};
export type RenderDraw<T> = {
    target: Element | DocumentFragment;
    byProp: (prop: keyof T & string, value: any, data?: Partial<T>) => void;
    state: InitializationState;
} & ((changes: Partial<T>, data: T) => void);
export type HTMLElementEventMapFixed = HTMLElementEventMap & {
    input: InputEvent;
};
export type HTMLElementCancellableEventMap = (Pick<HTMLElementEventMapFixed, "auxclick" | "beforeinput" | "click" | "compositionstart" | "contextmenu" | "drag" | "dragenter" | "dragover" | "dragstart" | "drop" | "invalid" | "keydown" | "keypress" | "keyup" | "mousedown" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "pointerdown" | "pointermove" | "pointerout" | "pointerover" | "pointerup" | "reset" | "selectstart" | "submit" | "touchend" | "touchmove" | "touchstart" | "wheel">);
export type CompositionEventMap = (HTMLElementEventMapFixed & { [P in keyof HTMLElementCancellableEventMap as `~${P}`]: HTMLElementCancellableEventMap[P]; } & Record<string, Event | CustomEvent<any>>);
export type CompositionEventListener<T extends unknown, K extends keyof CompositionEventMap = string> = {
    type?: K;
    tag?: string | symbol;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
    handleEvent?: (this: T, event: (K extends keyof CompositionEventMap ? CompositionEventMap[K] : Event) & {
        currentTarget: HTMLElement;
    }) => any;
    prop?: string;
    deepProp?: string[];
};
export type CompositionEventListenerObject<T> = { [P in keyof CompositionEventMap]?: (keyof T & string) | ((this: T, event: CompositionEventMap[P] & {
    currentTarget: HTMLElement;
}) => any) | CompositionEventListener<T, P>; };
export type NodeBindEntry<T extends unknown> = {
    key?: string;
    index?: number;
    tag: string;
    /**
     * Index of childNode or attrName
     */
    subnode: string | number;
    props: string[];
    deepProps: string[][];
    negate?: boolean;
    doubleNegate?: boolean;
    expression?: Function;
    /**
     * custom render function
     */
    render?: (options: RenderOptions<unknown>, element: Element, changes: any, data: any) => any;
    listeners?: CompositionEventListener<T>[];
    composition?: Composition<any>;
    defaultValue: T;
};
export type RenderState = any[];
export type RenderGraphSearch = {
    invocation: (state: InitializationState, changes: any, data: any) => any;
    cacheIndex: number;
    searchIndex: number;
    query: string | Function | string[];
    negate?: boolean;
    doubleNegate?: boolean;
    expression?: Function;
    prop: string;
    deepProp: string[];
    propsUsed: string[];
    deepPropsUsed: string[][];
    defaultValue: any;
    subSearch?: RenderGraphSearch;
};
export type RenderGraphAction = {
    invocation: (state: InitializationState, value: any, changes: any, data: any) => any;
    commentIndex?: number;
    nodeIndex?: number;
    cacheIndex?: number;
    attrName?: string;
    defaultValue?: any;
    search: RenderGraphSearch;
    injections?: InterpolateOptions["injections"];
};
export type InterpolateOptions = {
    /**
     * Default values to use for interpolation
     */
    defaults?: Record<string, any>;
    /**
     * Context-specific injected properties. (Experimental)
     */
    injections?: {
        iterable: string;
    } & Record<string, any> & {
        index: number;
    };
};
export type InitializationState = {
    lastElement: Element;
    lastChildNode: ChildNode;
    nodes: (Element | Text)[];
    caches: any[];
    comments: Comment[];
    nodeStates: Uint8Array;
    searchStates: Uint8Array;
    refs: HTMLElement[];
    lastChildNodeIndex: number;
    options: RenderOptions<unknown>;
};
import CompositionAdapter from './CompositionAdapter.js';
//# sourceMappingURL=Composition.d.ts.map