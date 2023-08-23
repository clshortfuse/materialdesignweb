/** @template T */
export default class Composition<T> {
    static EVENT_PREFIX_REGEX: RegExp;
    static shadowRootTag: symbol;
    /**
     * @template T
     * @param  {ConstructorParameters<typeof Composition<T>>} parts
     * @return {Composition<T>}
     */
    static compose<T_2>(...parts: CompositionPart<T_3>[]): Composition<T_2>;
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
        nodeEntry: this['nodesToBind'][0];
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
     * @type {CompositionAdapter}
     */
    adapter: CompositionAdapter;
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
     * @return {Function & {target:Element}} anchor
     */
    render<T_1 extends Object>(changes: Partial<T_1>, data?: T_1, options?: RenderOptions<T_1>): Function & {
        target: Element;
    };
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
    [Symbol.iterator](): Generator<CSSStyleSheet | DocumentFragment | HTMLStyleElement, void, unknown>;
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
export type HTMLElementEventMapFixed = HTMLElementEventMap & {
    input: InputEvent;
};
export type HTMLElementCancellableEventMap = (Pick<HTMLElementEventMapFixed, 'auxclick' | 'beforeinput' | 'click' | 'compositionstart' | 'contextmenu' | 'drag' | 'dragenter' | 'dragover' | 'dragstart' | 'drop' | 'invalid' | 'keydown' | 'keypress' | 'keyup' | 'mousedown' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup' | 'pointerdown' | 'pointermove' | 'pointerout' | 'pointerover' | 'pointerup' | 'reset' | 'selectstart' | 'submit' | 'touchend' | 'touchmove' | 'touchstart' | 'wheel'>);
export type CompositionEventMap = HTMLElementEventMap & {
    input: InputEvent;
} & {
    "~auxclick": MouseEvent;
    "~beforeinput": InputEvent;
    "~click": MouseEvent;
    "~compositionstart": CompositionEvent;
    "~contextmenu": MouseEvent;
    "~drag": DragEvent;
    "~dragenter": DragEvent;
    "~dragover": DragEvent;
    "~dragstart": DragEvent;
    "~drop": DragEvent;
    "~invalid": Event;
    "~keydown": KeyboardEvent;
    "~keypress": KeyboardEvent;
    "~keyup": KeyboardEvent;
    "~mousedown": MouseEvent;
    "~mousemove": MouseEvent;
    "~mouseout": MouseEvent;
    "~mouseover": MouseEvent;
    "~mouseup": MouseEvent;
    "~pointerdown": PointerEvent;
    "~pointermove": PointerEvent;
    "~pointerout": PointerEvent;
    "~pointerover": PointerEvent;
    "~pointerup": PointerEvent;
    "~reset": Event;
    "~selectstart": Event;
    "~submit": SubmitEvent;
    "~touchend": TouchEvent;
    "~touchmove": TouchEvent;
    "~touchstart": TouchEvent;
    "~wheel": WheelEvent;
} & Record<string, Event | CustomEvent<any>>;
export type CompositionEventListener<T extends unknown, K extends string = string> = {
    type?: K;
    tag?: string;
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
export type CompositionEventListenerObject<T> = {
    [x: string]: (keyof T & string) | CompositionEventListener<T, string> | ((this: T, event: (Event | CustomEvent<any>) & {
        currentTarget: HTMLElement;
    }) => any);
    fullscreenchange?: (keyof T & string) | CompositionEventListener<T, "fullscreenchange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    fullscreenerror?: (keyof T & string) | CompositionEventListener<T, "fullscreenerror"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    abort?: (keyof T & string) | CompositionEventListener<T, "abort"> | ((this: T, event: UIEvent & {
        currentTarget: HTMLElement;
    }) => any);
    animationcancel?: (keyof T & string) | CompositionEventListener<T, "animationcancel"> | ((this: T, event: AnimationEvent & {
        currentTarget: HTMLElement;
    }) => any);
    animationend?: (keyof T & string) | CompositionEventListener<T, "animationend"> | ((this: T, event: AnimationEvent & {
        currentTarget: HTMLElement;
    }) => any);
    animationiteration?: (keyof T & string) | CompositionEventListener<T, "animationiteration"> | ((this: T, event: AnimationEvent & {
        currentTarget: HTMLElement;
    }) => any);
    animationstart?: (keyof T & string) | CompositionEventListener<T, "animationstart"> | ((this: T, event: AnimationEvent & {
        currentTarget: HTMLElement;
    }) => any);
    auxclick?: (keyof T & string) | CompositionEventListener<T, "auxclick"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    beforeinput?: (keyof T & string) | CompositionEventListener<T, "beforeinput"> | ((this: T, event: InputEvent & {
        currentTarget: HTMLElement;
    }) => any);
    blur?: (keyof T & string) | CompositionEventListener<T, "blur"> | ((this: T, event: FocusEvent & {
        currentTarget: HTMLElement;
    }) => any);
    cancel?: (keyof T & string) | CompositionEventListener<T, "cancel"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    canplay?: (keyof T & string) | CompositionEventListener<T, "canplay"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    canplaythrough?: (keyof T & string) | CompositionEventListener<T, "canplaythrough"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    change?: (keyof T & string) | CompositionEventListener<T, "change"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    click?: (keyof T & string) | CompositionEventListener<T, "click"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    close?: (keyof T & string) | CompositionEventListener<T, "close"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    compositionend?: (keyof T & string) | CompositionEventListener<T, "compositionend"> | ((this: T, event: CompositionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    compositionstart?: (keyof T & string) | CompositionEventListener<T, "compositionstart"> | ((this: T, event: CompositionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    compositionupdate?: (keyof T & string) | CompositionEventListener<T, "compositionupdate"> | ((this: T, event: CompositionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    contextmenu?: (keyof T & string) | CompositionEventListener<T, "contextmenu"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    copy?: (keyof T & string) | CompositionEventListener<T, "copy"> | ((this: T, event: ClipboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    cuechange?: (keyof T & string) | CompositionEventListener<T, "cuechange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    cut?: (keyof T & string) | CompositionEventListener<T, "cut"> | ((this: T, event: ClipboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    dblclick?: (keyof T & string) | CompositionEventListener<T, "dblclick"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    drag?: (keyof T & string) | CompositionEventListener<T, "drag"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    dragend?: (keyof T & string) | CompositionEventListener<T, "dragend"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    dragenter?: (keyof T & string) | CompositionEventListener<T, "dragenter"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    dragleave?: (keyof T & string) | CompositionEventListener<T, "dragleave"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    dragover?: (keyof T & string) | CompositionEventListener<T, "dragover"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    dragstart?: (keyof T & string) | CompositionEventListener<T, "dragstart"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    drop?: (keyof T & string) | CompositionEventListener<T, "drop"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    durationchange?: (keyof T & string) | CompositionEventListener<T, "durationchange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    emptied?: (keyof T & string) | CompositionEventListener<T, "emptied"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    ended?: (keyof T & string) | CompositionEventListener<T, "ended"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    error?: (keyof T & string) | CompositionEventListener<T, "error"> | ((this: T, event: ErrorEvent & {
        currentTarget: HTMLElement;
    }) => any);
    focus?: (keyof T & string) | CompositionEventListener<T, "focus"> | ((this: T, event: FocusEvent & {
        currentTarget: HTMLElement;
    }) => any);
    focusin?: (keyof T & string) | CompositionEventListener<T, "focusin"> | ((this: T, event: FocusEvent & {
        currentTarget: HTMLElement;
    }) => any);
    focusout?: (keyof T & string) | CompositionEventListener<T, "focusout"> | ((this: T, event: FocusEvent & {
        currentTarget: HTMLElement;
    }) => any);
    formdata?: (keyof T & string) | CompositionEventListener<T, "formdata"> | ((this: T, event: FormDataEvent & {
        currentTarget: HTMLElement;
    }) => any);
    gotpointercapture?: (keyof T & string) | CompositionEventListener<T, "gotpointercapture"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    input?: (keyof T & string) | CompositionEventListener<T, "input"> | ((this: T, event: Event & InputEvent & {
        currentTarget: HTMLElement;
    }) => any);
    invalid?: (keyof T & string) | CompositionEventListener<T, "invalid"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    keydown?: (keyof T & string) | CompositionEventListener<T, "keydown"> | ((this: T, event: KeyboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    keypress?: (keyof T & string) | CompositionEventListener<T, "keypress"> | ((this: T, event: KeyboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    keyup?: (keyof T & string) | CompositionEventListener<T, "keyup"> | ((this: T, event: KeyboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    load?: (keyof T & string) | CompositionEventListener<T, "load"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    loadeddata?: (keyof T & string) | CompositionEventListener<T, "loadeddata"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    loadedmetadata?: (keyof T & string) | CompositionEventListener<T, "loadedmetadata"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    loadstart?: (keyof T & string) | CompositionEventListener<T, "loadstart"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    lostpointercapture?: (keyof T & string) | CompositionEventListener<T, "lostpointercapture"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mousedown?: (keyof T & string) | CompositionEventListener<T, "mousedown"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mouseenter?: (keyof T & string) | CompositionEventListener<T, "mouseenter"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mouseleave?: (keyof T & string) | CompositionEventListener<T, "mouseleave"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mousemove?: (keyof T & string) | CompositionEventListener<T, "mousemove"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mouseout?: (keyof T & string) | CompositionEventListener<T, "mouseout"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mouseover?: (keyof T & string) | CompositionEventListener<T, "mouseover"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    mouseup?: (keyof T & string) | CompositionEventListener<T, "mouseup"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    paste?: (keyof T & string) | CompositionEventListener<T, "paste"> | ((this: T, event: ClipboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pause?: (keyof T & string) | CompositionEventListener<T, "pause"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    play?: (keyof T & string) | CompositionEventListener<T, "play"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    playing?: (keyof T & string) | CompositionEventListener<T, "playing"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    pointercancel?: (keyof T & string) | CompositionEventListener<T, "pointercancel"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointerdown?: (keyof T & string) | CompositionEventListener<T, "pointerdown"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointerenter?: (keyof T & string) | CompositionEventListener<T, "pointerenter"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointerleave?: (keyof T & string) | CompositionEventListener<T, "pointerleave"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointermove?: (keyof T & string) | CompositionEventListener<T, "pointermove"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointerout?: (keyof T & string) | CompositionEventListener<T, "pointerout"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointerover?: (keyof T & string) | CompositionEventListener<T, "pointerover"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    pointerup?: (keyof T & string) | CompositionEventListener<T, "pointerup"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    progress?: (keyof T & string) | CompositionEventListener<T, "progress"> | ((this: T, event: ProgressEvent<EventTarget> & {
        currentTarget: HTMLElement;
    }) => any);
    ratechange?: (keyof T & string) | CompositionEventListener<T, "ratechange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    reset?: (keyof T & string) | CompositionEventListener<T, "reset"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    resize?: (keyof T & string) | CompositionEventListener<T, "resize"> | ((this: T, event: UIEvent & {
        currentTarget: HTMLElement;
    }) => any);
    scroll?: (keyof T & string) | CompositionEventListener<T, "scroll"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    securitypolicyviolation?: (keyof T & string) | CompositionEventListener<T, "securitypolicyviolation"> | ((this: T, event: SecurityPolicyViolationEvent & {
        currentTarget: HTMLElement;
    }) => any);
    seeked?: (keyof T & string) | CompositionEventListener<T, "seeked"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    seeking?: (keyof T & string) | CompositionEventListener<T, "seeking"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    select?: (keyof T & string) | CompositionEventListener<T, "select"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    selectionchange?: (keyof T & string) | CompositionEventListener<T, "selectionchange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    selectstart?: (keyof T & string) | CompositionEventListener<T, "selectstart"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    slotchange?: (keyof T & string) | CompositionEventListener<T, "slotchange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    stalled?: (keyof T & string) | CompositionEventListener<T, "stalled"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    submit?: (keyof T & string) | CompositionEventListener<T, "submit"> | ((this: T, event: SubmitEvent & {
        currentTarget: HTMLElement;
    }) => any);
    suspend?: (keyof T & string) | CompositionEventListener<T, "suspend"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    timeupdate?: (keyof T & string) | CompositionEventListener<T, "timeupdate"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    toggle?: (keyof T & string) | CompositionEventListener<T, "toggle"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    touchcancel?: (keyof T & string) | CompositionEventListener<T, "touchcancel"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    touchend?: (keyof T & string) | CompositionEventListener<T, "touchend"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    touchmove?: (keyof T & string) | CompositionEventListener<T, "touchmove"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    touchstart?: (keyof T & string) | CompositionEventListener<T, "touchstart"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    transitioncancel?: (keyof T & string) | CompositionEventListener<T, "transitioncancel"> | ((this: T, event: TransitionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    transitionend?: (keyof T & string) | CompositionEventListener<T, "transitionend"> | ((this: T, event: TransitionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    transitionrun?: (keyof T & string) | CompositionEventListener<T, "transitionrun"> | ((this: T, event: TransitionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    transitionstart?: (keyof T & string) | CompositionEventListener<T, "transitionstart"> | ((this: T, event: TransitionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    volumechange?: (keyof T & string) | CompositionEventListener<T, "volumechange"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    waiting?: (keyof T & string) | CompositionEventListener<T, "waiting"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    webkitanimationend?: (keyof T & string) | CompositionEventListener<T, "webkitanimationend"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    webkitanimationiteration?: (keyof T & string) | CompositionEventListener<T, "webkitanimationiteration"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    webkitanimationstart?: (keyof T & string) | CompositionEventListener<T, "webkitanimationstart"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    webkittransitionend?: (keyof T & string) | CompositionEventListener<T, "webkittransitionend"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    wheel?: (keyof T & string) | CompositionEventListener<T, "wheel"> | ((this: T, event: WheelEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~auxclick"?: (keyof T & string) | CompositionEventListener<T, "~auxclick"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~beforeinput"?: (keyof T & string) | CompositionEventListener<T, "~beforeinput"> | ((this: T, event: InputEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~click"?: (keyof T & string) | CompositionEventListener<T, "~click"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~compositionstart"?: (keyof T & string) | CompositionEventListener<T, "~compositionstart"> | ((this: T, event: CompositionEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~contextmenu"?: (keyof T & string) | CompositionEventListener<T, "~contextmenu"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~drag"?: (keyof T & string) | CompositionEventListener<T, "~drag"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~dragenter"?: (keyof T & string) | CompositionEventListener<T, "~dragenter"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~dragover"?: (keyof T & string) | CompositionEventListener<T, "~dragover"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~dragstart"?: (keyof T & string) | CompositionEventListener<T, "~dragstart"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~drop"?: (keyof T & string) | CompositionEventListener<T, "~drop"> | ((this: T, event: DragEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~invalid"?: (keyof T & string) | CompositionEventListener<T, "~invalid"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    "~keydown"?: (keyof T & string) | CompositionEventListener<T, "~keydown"> | ((this: T, event: KeyboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~keypress"?: (keyof T & string) | CompositionEventListener<T, "~keypress"> | ((this: T, event: KeyboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~keyup"?: (keyof T & string) | CompositionEventListener<T, "~keyup"> | ((this: T, event: KeyboardEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~mousedown"?: (keyof T & string) | CompositionEventListener<T, "~mousedown"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~mousemove"?: (keyof T & string) | CompositionEventListener<T, "~mousemove"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~mouseout"?: (keyof T & string) | CompositionEventListener<T, "~mouseout"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~mouseover"?: (keyof T & string) | CompositionEventListener<T, "~mouseover"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~mouseup"?: (keyof T & string) | CompositionEventListener<T, "~mouseup"> | ((this: T, event: MouseEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~pointerdown"?: (keyof T & string) | CompositionEventListener<T, "~pointerdown"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~pointermove"?: (keyof T & string) | CompositionEventListener<T, "~pointermove"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~pointerout"?: (keyof T & string) | CompositionEventListener<T, "~pointerout"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~pointerover"?: (keyof T & string) | CompositionEventListener<T, "~pointerover"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~pointerup"?: (keyof T & string) | CompositionEventListener<T, "~pointerup"> | ((this: T, event: PointerEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~reset"?: (keyof T & string) | CompositionEventListener<T, "~reset"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    "~selectstart"?: (keyof T & string) | CompositionEventListener<T, "~selectstart"> | ((this: T, event: Event & {
        currentTarget: HTMLElement;
    }) => any);
    "~submit"?: (keyof T & string) | CompositionEventListener<T, "~submit"> | ((this: T, event: SubmitEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~touchend"?: (keyof T & string) | CompositionEventListener<T, "~touchend"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~touchmove"?: (keyof T & string) | CompositionEventListener<T, "~touchmove"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~touchstart"?: (keyof T & string) | CompositionEventListener<T, "~touchstart"> | ((this: T, event: TouchEvent & {
        currentTarget: HTMLElement;
    }) => any);
    "~wheel"?: (keyof T & string) | CompositionEventListener<T, "~wheel"> | ((this: T, event: WheelEvent & {
        currentTarget: HTMLElement;
    }) => any);
};
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
    } & Record<string, any>;
};
export type InitializationState = {
    lastElement: Element;
    lastChildNode: ChildNode;
    nodes: (Element | Text)[];
    caches: any[];
    comments: Comment[];
    nodeStates: Uint8Array;
    searchStates: Uint8Array;
    refs: Element[];
    lastChildNodeIndex: number;
    options: RenderOptions<unknown>;
};
import CompositionAdapter from './CompositionAdapter.js';
//# sourceMappingURL=Composition.d.ts.map