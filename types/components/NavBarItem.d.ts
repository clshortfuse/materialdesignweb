declare const _default: {
    new (...args: any[]): {
        addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
            hadRippleHeld: boolean;
            hadRippleReleased: boolean;
            rippleStarted: boolean;
        } & {
            rippleState: string;
            keepAlive: boolean;
            _positionX: number;
            _positionY: number;
            _radius: number;
            holdRipple: boolean;
        } & {
            _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                styles: {
                    minHeight: string;
                    minWidth: string;
                    boxShadow: string;
                    top: string;
                    left: string;
                };
            };
        } & {
            updatePosition(x?: number, y?: number, size?: number): void;
            handleRippleComplete(): void;
        };
        compose(parts: import("../core/Composition.js").CompositionPart<T>[]): import("../core/Composition.js").default<any>;
        "__#4@#refsProxy": Record<string, HTMLElement>;
        "__#4@#refsCache": Map<string, WeakRef<HTMLElement>>;
        "__#4@#refsCompositionCache": Map<string, WeakRef<HTMLElement>>;
        "__#4@#composition": import("../core/Composition.js").default<any>;
        _propAttributeCache: Map<string, {
            stringValue: string;
            parsedValue: any;
        }>;
        _callbackArguments: import("../core/CustomElement.js").CallbackArguments<any, any>;
        elementInternals: ElementInternals;
        render: Function & {
            target: Element;
        };
        propChangedCallback<T_1 extends import("../core/CustomElement.js").default, K extends string = string>(this: T_1, name: K, oldValue: K extends keyof T_1 ? T_1[K] : unknown, newValue: K extends keyof T_1 ? T_1[K] : unknown, changes?: K extends keyof T_1 ? T_1[K] extends object ? Partial<T_1[K]> : T_1[K] : unknown): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        readonly "__#4@#template": DocumentFragment;
        _onObserverPropertyChanged(name: string, oldValue: any, newValue: any, changes: any): void;
        patch(patch: any): void;
        patching: boolean;
        readonly refs: Record<string, HTMLElement>;
        readonly attributeCache: Map<any, any>;
        readonly static: typeof import("../core/CustomElement.js").default;
        readonly unique: boolean;
        readonly callbackArguments: import("../core/CustomElement.js").CallbackArguments<any, any> | {
            composition: import("../core/Composition.js").default<any>;
            refs: Record<string, HTMLElement>;
            html: any;
            inline: typeof import("../core/template.js").addInlineFunction;
            template: DocumentFragment;
            element: any;
        };
        readonly composition: import("../core/Composition.js").default<any>;
        connectedCallback(): void;
        disconnectedCallback(): void;
        delegatesFocus: boolean;
        accessKey: string;
        readonly accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        inert: boolean;
        innerText: string;
        lang: string;
        readonly offsetHeight: number;
        readonly offsetLeft: number;
        readonly offsetParent: Element;
        readonly offsetTop: number;
        readonly offsetWidth: number;
        outerText: string;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        attachInternals(): ElementInternals;
        click(): void;
        addEventListener<K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K_2 extends keyof HTMLElementEventMap>(type: K_2, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_2]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        readonly attributes: NamedNodeMap;
        readonly classList: DOMTokenList;
        className: string;
        readonly clientHeight: number;
        readonly clientLeft: number;
        readonly clientTop: number;
        readonly clientWidth: number;
        id: string;
        readonly localName: string;
        readonly namespaceURI: string;
        onfullscreenchange: (this: Element, ev: Event) => any;
        onfullscreenerror: (this: Element, ev: Event) => any;
        outerHTML: string;
        readonly ownerDocument: Document;
        readonly part: DOMTokenList;
        readonly prefix: string;
        readonly scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        readonly scrollWidth: number;
        readonly shadowRoot: ShadowRoot;
        slot: string;
        readonly tagName: string;
        attachShadow(init: ShadowRootInit): ShadowRoot;
        checkVisibility(options?: CheckVisibilityOptions): boolean;
        closest<K_3 extends keyof HTMLElementTagNameMap>(selector: K_3): HTMLElementTagNameMap[K_3];
        closest<K_4 extends keyof SVGElementTagNameMap>(selector: K_4): SVGElementTagNameMap[K_4];
        closest<K_5 extends keyof MathMLElementTagNameMap>(selector: K_5): MathMLElementTagNameMap[K_5];
        closest<E extends Element = Element>(selectors: string): E;
        computedStyleMap(): StylePropertyMapReadOnly;
        getAttribute(qualifiedName: string): string;
        getAttributeNS(namespace: string, localName: string): string;
        getAttributeNames(): string[];
        getAttributeNode(qualifiedName: string): Attr;
        getAttributeNodeNS(namespace: string, localName: string): Attr;
        getBoundingClientRect(): DOMRect;
        getClientRects(): DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
        getElementsByTagName<K_6 extends keyof HTMLElementTagNameMap>(qualifiedName: K_6): HTMLCollectionOf<HTMLElementTagNameMap[K_6]>;
        getElementsByTagName<K_7 extends keyof SVGElementTagNameMap>(qualifiedName: K_7): HTMLCollectionOf<SVGElementTagNameMap[K_7]>;
        getElementsByTagName<K_8 extends keyof MathMLElementTagNameMap>(qualifiedName: K_8): HTMLCollectionOf<MathMLElementTagNameMap[K_8]>;
        getElementsByTagName<K_9 extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K_9): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K_9]>;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>;
        getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element>;
        hasAttribute(qualifiedName: string): boolean;
        hasAttributeNS(namespace: string, localName: string): boolean;
        hasAttributes(): boolean;
        hasPointerCapture(pointerId: number): boolean;
        insertAdjacentElement(where: InsertPosition, element: Element): Element;
        insertAdjacentHTML(position: InsertPosition, text: string): void;
        insertAdjacentText(where: InsertPosition, data: string): void;
        matches(selectors: string): boolean;
        releasePointerCapture(pointerId: number): void;
        removeAttribute(qualifiedName: string): void;
        removeAttributeNS(namespace: string, localName: string): void;
        removeAttributeNode(attr: Attr): Attr;
        requestFullscreen(options?: FullscreenOptions): Promise<void>;
        requestPointerLock(): void;
        scroll(options?: ScrollToOptions): void;
        scroll(x: number, y: number): void;
        scrollBy(options?: ScrollToOptions): void;
        scrollBy(x: number, y: number): void;
        scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
        scrollTo(options?: ScrollToOptions): void;
        scrollTo(x: number, y: number): void;
        setAttribute(qualifiedName: string, value: string): void;
        setAttributeNS(namespace: string, qualifiedName: string, value: string): void;
        setAttributeNode(attr: Attr): Attr;
        setAttributeNodeNS(attr: Attr): Attr;
        setPointerCapture(pointerId: number): void;
        toggleAttribute(qualifiedName: string, force?: boolean): boolean;
        webkitMatchesSelector(selectors: string): boolean;
        readonly baseURI: string;
        readonly childNodes: NodeListOf<ChildNode>;
        readonly firstChild: ChildNode;
        readonly isConnected: boolean;
        readonly lastChild: ChildNode;
        readonly nextSibling: ChildNode;
        readonly nodeName: string;
        readonly nodeType: number;
        nodeValue: string;
        readonly parentElement: HTMLElement;
        readonly parentNode: ParentNode;
        readonly previousSibling: ChildNode;
        textContent: string;
        appendChild<T_2 extends Node>(node: T_2): T_2;
        cloneNode(deep?: boolean): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node): boolean;
        getRootNode(options?: GetRootNodeOptions): Node;
        hasChildNodes(): boolean;
        insertBefore<T_3 extends Node>(node: T_3, child: Node): T_3;
        isDefaultNamespace(namespace: string): boolean;
        isEqualNode(otherNode: Node): boolean;
        isSameNode(otherNode: Node): boolean;
        lookupNamespaceURI(prefix: string): string;
        lookupPrefix(namespace: string): string;
        normalize(): void;
        removeChild<T_4 extends Node>(child: T_4): T_4;
        replaceChild<T_5 extends Node>(node: Node, child: T_5): T_5;
        readonly ELEMENT_NODE: 1;
        readonly ATTRIBUTE_NODE: 2;
        readonly TEXT_NODE: 3;
        readonly CDATA_SECTION_NODE: 4;
        readonly ENTITY_REFERENCE_NODE: 5;
        readonly ENTITY_NODE: 6;
        readonly PROCESSING_INSTRUCTION_NODE: 7;
        readonly COMMENT_NODE: 8;
        readonly DOCUMENT_NODE: 9;
        readonly DOCUMENT_TYPE_NODE: 10;
        readonly DOCUMENT_FRAGMENT_NODE: 11;
        readonly NOTATION_NODE: 12;
        readonly DOCUMENT_POSITION_DISCONNECTED: 1;
        readonly DOCUMENT_POSITION_PRECEDING: 2;
        readonly DOCUMENT_POSITION_FOLLOWING: 4;
        readonly DOCUMENT_POSITION_CONTAINS: 8;
        readonly DOCUMENT_POSITION_CONTAINED_BY: 16;
        readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
        dispatchEvent(event: Event): boolean;
        ariaAtomic: string;
        ariaAutoComplete: string;
        ariaBusy: string;
        ariaChecked: string;
        ariaColCount: string;
        ariaColIndex: string;
        ariaColSpan: string;
        ariaCurrent: string;
        ariaDisabled: string;
        ariaExpanded: string;
        ariaHasPopup: string;
        ariaHidden: string;
        ariaInvalid: string;
        ariaKeyShortcuts: string;
        ariaLabel: string;
        ariaLevel: string;
        ariaLive: string;
        ariaModal: string;
        ariaMultiLine: string;
        ariaMultiSelectable: string;
        ariaOrientation: string;
        ariaPlaceholder: string;
        ariaPosInSet: string;
        ariaPressed: string;
        ariaReadOnly: string;
        ariaRequired: string;
        ariaRoleDescription: string;
        ariaRowCount: string;
        ariaRowIndex: string;
        ariaRowSpan: string;
        ariaSelected: string;
        ariaSetSize: string;
        ariaSort: string;
        ariaValueMax: string;
        ariaValueMin: string;
        ariaValueNow: string;
        ariaValueText: string;
        role: string;
        animate(keyframes: PropertyIndexedKeyframes | Keyframe[], options?: number | KeyframeAnimationOptions): Animation;
        getAnimations(options?: GetAnimationsOptions): Animation[];
        after(...nodes: (string | Node)[]): void;
        before(...nodes: (string | Node)[]): void;
        remove(): void;
        replaceWith(...nodes: (string | Node)[]): void;
        innerHTML: string;
        readonly nextElementSibling: Element;
        readonly previousElementSibling: Element;
        readonly childElementCount: number;
        readonly children: HTMLCollection;
        readonly firstElementChild: Element;
        readonly lastElementChild: Element;
        append(...nodes: (string | Node)[]): void;
        prepend(...nodes: (string | Node)[]): void;
        querySelector<K_10 extends keyof HTMLElementTagNameMap>(selectors: K_10): HTMLElementTagNameMap[K_10];
        querySelector<K_11 extends keyof SVGElementTagNameMap>(selectors: K_11): SVGElementTagNameMap[K_11];
        querySelector<K_12 extends keyof MathMLElementTagNameMap>(selectors: K_12): MathMLElementTagNameMap[K_12];
        querySelector<K_13 extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K_13): HTMLElementDeprecatedTagNameMap[K_13];
        querySelector<E_1 extends Element = Element>(selectors: string): E_1;
        querySelectorAll<K_14 extends keyof HTMLElementTagNameMap>(selectors: K_14): NodeListOf<HTMLElementTagNameMap[K_14]>;
        querySelectorAll<K_15 extends keyof SVGElementTagNameMap>(selectors: K_15): NodeListOf<SVGElementTagNameMap[K_15]>;
        querySelectorAll<K_16 extends keyof MathMLElementTagNameMap>(selectors: K_16): NodeListOf<MathMLElementTagNameMap[K_16]>;
        querySelectorAll<K_17 extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K_17): NodeListOf<HTMLElementDeprecatedTagNameMap[K_17]>;
        querySelectorAll<E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
        replaceChildren(...nodes: (string | Node)[]): void;
        readonly assignedSlot: HTMLSlotElement;
        readonly attributeStyleMap: StylePropertyMap;
        readonly style: CSSStyleDeclaration;
        contentEditable: string;
        enterKeyHint: string;
        inputMode: string;
        readonly isContentEditable: boolean;
        onabort: (this: GlobalEventHandlers, ev: UIEvent) => any;
        onanimationcancel: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onanimationend: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onanimationiteration: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onanimationstart: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onauxclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onbeforeinput: (this: GlobalEventHandlers, ev: InputEvent) => any;
        onblur: (this: GlobalEventHandlers, ev: FocusEvent) => any;
        oncancel: (this: GlobalEventHandlers, ev: Event) => any;
        oncanplay: (this: GlobalEventHandlers, ev: Event) => any;
        oncanplaythrough: (this: GlobalEventHandlers, ev: Event) => any;
        onchange: (this: GlobalEventHandlers, ev: Event) => any;
        onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onclose: (this: GlobalEventHandlers, ev: Event) => any;
        oncontextmenu: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        oncopy: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
        oncuechange: (this: GlobalEventHandlers, ev: Event) => any;
        oncut: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
        ondblclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        ondrag: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragend: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragenter: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragleave: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragover: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragstart: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondrop: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondurationchange: (this: GlobalEventHandlers, ev: Event) => any;
        onemptied: (this: GlobalEventHandlers, ev: Event) => any;
        onended: (this: GlobalEventHandlers, ev: Event) => any;
        onerror: OnErrorEventHandlerNonNull;
        onfocus: (this: GlobalEventHandlers, ev: FocusEvent) => any;
        onformdata: (this: GlobalEventHandlers, ev: FormDataEvent) => any;
        ongotpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        oninput: (this: GlobalEventHandlers, ev: Event) => any;
        oninvalid: (this: GlobalEventHandlers, ev: Event) => any;
        onkeydown: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
        onkeypress: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
        onkeyup: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
        onload: (this: GlobalEventHandlers, ev: Event) => any;
        onloadeddata: (this: GlobalEventHandlers, ev: Event) => any;
        onloadedmetadata: (this: GlobalEventHandlers, ev: Event) => any;
        onloadstart: (this: GlobalEventHandlers, ev: Event) => any;
        onlostpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onmousedown: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseenter: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseleave: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmousemove: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseout: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseover: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseup: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onpaste: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
        onpause: (this: GlobalEventHandlers, ev: Event) => any;
        onplay: (this: GlobalEventHandlers, ev: Event) => any;
        onplaying: (this: GlobalEventHandlers, ev: Event) => any;
        onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onprogress: (this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any;
        onratechange: (this: GlobalEventHandlers, ev: Event) => any;
        onreset: (this: GlobalEventHandlers, ev: Event) => any;
        onresize: (this: GlobalEventHandlers, ev: UIEvent) => any;
        onscroll: (this: GlobalEventHandlers, ev: Event) => any;
        onsecuritypolicyviolation: (this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any;
        onseeked: (this: GlobalEventHandlers, ev: Event) => any;
        onseeking: (this: GlobalEventHandlers, ev: Event) => any;
        onselect: (this: GlobalEventHandlers, ev: Event) => any;
        onselectionchange: (this: GlobalEventHandlers, ev: Event) => any;
        onselectstart: (this: GlobalEventHandlers, ev: Event) => any;
        onslotchange: (this: GlobalEventHandlers, ev: Event) => any;
        onstalled: (this: GlobalEventHandlers, ev: Event) => any;
        onsubmit: (this: GlobalEventHandlers, ev: SubmitEvent) => any;
        onsuspend: (this: GlobalEventHandlers, ev: Event) => any;
        ontimeupdate: (this: GlobalEventHandlers, ev: Event) => any;
        ontoggle: (this: GlobalEventHandlers, ev: Event) => any;
        ontouchcancel?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontouchend?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontouchmove?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontouchstart?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontransitioncancel: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        ontransitionend: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        ontransitionrun: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        ontransitionstart: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        onvolumechange: (this: GlobalEventHandlers, ev: Event) => any;
        onwaiting: (this: GlobalEventHandlers, ev: Event) => any;
        onwebkitanimationend: (this: GlobalEventHandlers, ev: Event) => any;
        onwebkitanimationiteration: (this: GlobalEventHandlers, ev: Event) => any;
        onwebkitanimationstart: (this: GlobalEventHandlers, ev: Event) => any;
        onwebkittransitionend: (this: GlobalEventHandlers, ev: Event) => any;
        onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
        autofocus: boolean;
        readonly dataset: DOMStringMap;
        nonce?: string;
        tabIndex: number;
        blur(): void;
        focus: (options?: FocusOptions) => void;
        href: string;
        target: string;
        download: string;
        ping: string;
        rel: string;
        hreflang: string;
        referrerPolicy: string;
        origin: string;
        protocol: string;
        username: string;
        password: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        hash: string;
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
        _pointerPressed: boolean;
        stateLayer: boolean;
        disabledState: boolean;
        hoveredState: boolean;
        focusedState: boolean;
        pressedState: boolean;
        touchedState: boolean;
        pointedState: boolean;
        stateTargetElement: import("../core/CustomElement.js").default & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        };
        _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
            hadRippleHeld: boolean;
            hadRippleReleased: boolean;
            rippleStarted: boolean;
        } & {
            rippleState: string;
            keepAlive: boolean;
            _positionX: number;
            _positionY: number;
            _radius: number;
            holdRipple: boolean;
        } & {
            _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                styles: {
                    minHeight: string;
                    minWidth: string;
                    boxShadow: string;
                    top: string;
                    left: string;
                };
            };
        } & {
            updatePosition(x?: number, y?: number, size?: number): void;
            handleRippleComplete(): void;
        }>;
        _rippleAdded: boolean;
        _lastRipple: import("../core/CustomElement.js").default & {
            hadRippleHeld: boolean;
            hadRippleReleased: boolean;
            rippleStarted: boolean;
        } & {
            rippleState: string;
            keepAlive: boolean;
            _positionX: number;
            _positionY: number;
            _radius: number;
            holdRipple: boolean;
        } & {
            _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                styles: {
                    minHeight: string;
                    minWidth: string;
                    boxShadow: string;
                    top: string;
                    left: string;
                };
            };
        } & {
            updatePosition(x?: number, y?: number, size?: number): void;
            handleRippleComplete(): void;
        };
        color: string;
        ink: string;
        typeStyle: string;
        showLabel: string;
        active: boolean;
        icon: string;
        src: string;
        badge: string;
        _anchorAriaCurrent(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }, { active }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }): string;
        _anchorAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }): string;
        _anchorHref(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }, { href }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }): string;
        iconVariation(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }, { active }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
        } & {
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        } & {
            origin: string;
            protocol: string;
            username: string;
            password: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
        } & object & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
            _pointerPressed: boolean;
            stateLayer: boolean;
        } & {
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        } & {
            stateTargetElement: import("../core/CustomElement.js").default & {
                disabled: boolean;
                focused: boolean;
                hovered: boolean;
                pressed: boolean;
                _lastInteraction: "key" | "mouse" | "touch" | "pen";
                _hovered: boolean;
                _focused: boolean;
                _focusedSynthetic: boolean;
                _keyPressed: boolean;
                _keyReleased: boolean;
                _pointerPressed: boolean;
                stateLayer: boolean;
            } & {
                disabledState: boolean;
                hoveredState: boolean;
                focusedState: boolean;
                pressedState: boolean;
                touchedState: boolean;
                pointedState: boolean;
            };
        } & {
            _lastRippleWeakRef: WeakRef<import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            }>;
            _rippleAdded: boolean;
        } & {
            _lastRipple: import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            addRipple(x?: number, y?: number, hold?: boolean): import("../core/CustomElement.js").default & {
                hadRippleHeld: boolean;
                hadRippleReleased: boolean;
                rippleStarted: boolean;
            } & {
                rippleState: string;
                keepAlive: boolean;
                _positionX: number;
                _positionY: number;
                _radius: number;
                holdRipple: boolean;
            } & {
                _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
                    styles: {
                        minHeight: string;
                        minWidth: string;
                        boxShadow: string;
                        top: string;
                        left: string;
                    };
                };
            } & {
                updatePosition(x?: number, y?: number, size?: number): void;
                handleRippleComplete(): void;
            };
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            stateLayer: boolean;
        } & {
            showLabel: string;
            active: boolean;
            icon: string;
            src: string;
            badge: string;
            ariaLabel: string;
        } & {
            focus(options?: FocusOptions): void;
        }): string;
    };
    elementName: string;
    readonly observedAttributes: Iterable<string>;
    _composition: import("../core/Composition.js").default<any>;
    _props: Map<string, import("../core/observe.js").ObserverConfiguration<any, any, any, any>>;
    _attrs: Map<string, import("../core/observe.js").ObserverConfiguration<any, any, any, any>>;
    _propChangedCallbacks: Map<string, Function[]>;
    _attributeChangedCallbacks: Map<string, Function[]>;
    _onComposeCallbacks: ((callback: import("../core/CustomElement.js").CallbackArguments<any, any>) => any)[];
    _onConnectedCallbacks: ((callback: import("../core/CustomElement.js").CallbackArguments<any, any>) => any)[];
    _onDisconnectedCallbacks: ((callback: import("../core/CustomElement.js").CallbackArguments<any, any>) => any)[];
    _onConstructedCallbacks: ((callback: import("../core/CustomElement.js").CallbackArguments<any, any>) => any)[];
    interpolatesTemplate: boolean;
    supportsElementInternals: boolean;
    supportsElementInternalsRole: boolean;
    templatable: boolean;
    defined: boolean;
    autoRegistration: boolean;
    registrations: Map<string, typeof import("../core/CustomElement.js").default>;
    expressions: <CLASS extends typeof import("../core/CustomElement.js").default, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends {
        [x: string]: (this: INSTANCE, data?: INSTANCE, state?: Record<string, any>) => string | boolean;
    }>(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>) => CLASS & import("../core/CustomElement.js").Class<PROPS, ARGS>;
    methods: typeof import("../core/CustomElement.js").default.set;
    overrides: <CLASS_1 extends typeof import("../core/CustomElement.js").default, ARGS_1 extends ConstructorParameters<CLASS_1>, INSTANCE_1 extends InstanceType<CLASS_1>, PROPS_1 extends Partial<INSTANCE_1>>(this: CLASS_1, source: PROPS_1 & ThisType<PROPS_1 & INSTANCE_1>, options?: Partial<PropertyDescriptor>) => CLASS_1 & import("../core/CustomElement.js").Class<PROPS_1, ARGS_1>;
    props: <CLASS_2 extends typeof import("../core/CustomElement.js").default, ARGS_2 extends ConstructorParameters<CLASS_2>, INSTANCE_2 extends InstanceType<CLASS_2>, KEY extends string, OPTIONS extends import("../core/observe.js").ObserverPropertyType | import("../core/CustomElement.js").ObserverOptions<import("../core/observe.js").ObserverPropertyType, unknown, INSTANCE_2> | ((this: INSTANCE_2, data: Partial<INSTANCE_2>, fn?: () => any) => any), VALUE extends Record<KEY, OPTIONS extends (...args2: any[]) => infer R ? R : OPTIONS extends import("../core/observe.js").ObserverPropertyType ? import("../core/observe.js").ParsedObserverPropertyType<OPTIONS> : OPTIONS extends {
        type: "object";
    } & import("../core/CustomElement.js").ObserverOptions<any, infer R_1 extends unknown, any> ? unknown extends R_1 ? object : R_1 : OPTIONS extends {
        type: import("../core/observe.js").ObserverPropertyType;
    } ? import("../core/observe.js").ParsedObserverPropertyType<OPTIONS["type"]> : OPTIONS extends import("../core/CustomElement.js").ObserverOptions<any, infer R_2 extends unknown, any> ? unknown extends R_2 ? string : R_2 : never>>(this: CLASS_2, name: KEY, options: OPTIONS) => CLASS_2 & import("../core/CustomElement.js").Class<VALUE, ARGS_2>;
    idl: typeof import("../core/CustomElement.js").default.prop;
    _addCallback<T_6 extends typeof import("../core/CustomElement.js").default, K_18 extends keyof T_6>(this: T_6, collection: K_18, callback: T_6[K_18] extends (infer R_3)[] ? R_3 : never): void;
    append<T_7 extends typeof import("../core/CustomElement.js").default>(this: T_7, ...parts: import("../core/Composition.js").CompositionPart<T>[]): T_7;
    recompose<T1 extends typeof import("../core/CustomElement.js").default, T2 extends InstanceType<T1>, T3 extends import("../core/CustomElement.js").CompositionCallback<T2, T2>["composed"]>(this: T1, callback: T3): T1;
    css<T1_1 extends typeof import("../core/CustomElement.js").default, T2_1 extends string | TemplateStringsArray | CSSStyleSheet | HTMLStyleElement>(this: T1_1, array: T2_1, ...rest: T2_1 extends string ? any : T2_1 extends TemplateStringsArray ? any[] : (CSSStyleSheet | HTMLStyleElement)[]): T1_1;
    autoRegister<T_8 extends typeof import("../core/CustomElement.js").default>(this: T_8, elementName: string): T_8;
    html<T_9 extends typeof import("../core/CustomElement.js").default>(this: T_9, string: TemplateStringsArray, ...substitutions: (string | Element | ((this: InstanceType<T_9>, data: InstanceType<T_9>, injections?: any) => any))[]): T_9;
    extend<T1_2 extends typeof import("../core/CustomElement.js").default, T2_2 extends T1_2>(this: T1_2, customExtender?: (Base: T1_2) => T2_2): T2_2;
    setStatic<T1_3 extends typeof import("../core/CustomElement.js").default, T2_3 extends {
        [x: string]: string | number | boolean | object | any[] | ((this: T1_3, ...args: any[]) => any);
    }>(this: T1_3, source: T2_3 & ThisType<T1_3 & T2_3>): T1_3 & T2_3;
    readonly<CLASS_3 extends typeof import("../core/CustomElement.js").default, ARGS_3 extends ConstructorParameters<CLASS_3>, INSTANCE_3 extends InstanceType<CLASS_3>, PROPS_2 extends object>(this: CLASS_3, source: PROPS_2 & ThisType<PROPS_2 & INSTANCE_3>, options?: Partial<PropertyDescriptor>): CLASS_3 & import("../core/CustomElement.js").Class<PROPS_2, ARGS_3>;
    set<CLASS_4 extends typeof import("../core/CustomElement.js").default, ARGS_4 extends ConstructorParameters<CLASS_4>, INSTANCE_4 extends InstanceType<CLASS_4>, PROPS_3 extends object>(this: CLASS_4, source: PROPS_3 & ThisType<PROPS_3 & INSTANCE_4>, options?: Partial<PropertyDescriptor>): CLASS_4 & import("../core/CustomElement.js").Class<PROPS_3, ARGS_4>;
    mixin<BASE extends typeof import("../core/CustomElement.js").default, FN extends (...args: any[]) => any, RETURN extends ReturnType<FN>, SUBCLASS extends RETURN>(this: BASE, mixin: FN): SUBCLASS & BASE;
    register<T_10 extends typeof import("../core/CustomElement.js").default>(this: T_10, elementName?: string, force?: boolean): T_10;
    readonly propList: Map<string, import("../core/observe.js").ObserverConfiguration<any, any, any, any>>;
    readonly attrList: Map<string, import("../core/observe.js").ObserverConfiguration<any, any, any, any>>;
    readonly propChangedCallbacks: Map<string, Function[]>;
    readonly attributeChangedCallbacks: Map<string, Function[]>;
    prop<CLASS_5 extends typeof import("../core/CustomElement.js").default, ARGS_5 extends ConstructorParameters<CLASS_5>, INSTANCE_5 extends InstanceType<CLASS_5>, KEY_1 extends string, OPTIONS_1 extends import("../core/observe.js").ObserverPropertyType | import("../core/CustomElement.js").ObserverOptions<import("../core/observe.js").ObserverPropertyType, unknown, INSTANCE_5> | ((this: INSTANCE_5, data: Partial<INSTANCE_5>, fn?: () => any) => any), VALUE_1 extends Record<KEY_1, OPTIONS_1 extends (...args2: any[]) => infer R_4 ? R_4 : OPTIONS_1 extends import("../core/observe.js").ObserverPropertyType ? import("../core/observe.js").ParsedObserverPropertyType<OPTIONS_1> : OPTIONS_1 extends {
        type: "object";
    } & import("../core/CustomElement.js").ObserverOptions<any, infer R_5 extends unknown, any> ? unknown extends R_5 ? object : R_5 : OPTIONS_1 extends {
        type: import("../core/observe.js").ObserverPropertyType;
    } ? import("../core/observe.js").ParsedObserverPropertyType<OPTIONS_1["type"]> : OPTIONS_1 extends import("../core/CustomElement.js").ObserverOptions<any, infer R_6 extends unknown, any> ? unknown extends R_6 ? string : R_6 : never>>(this: CLASS_5, name: KEY_1, options: OPTIONS_1): CLASS_5 & import("../core/CustomElement.js").Class<VALUE_1, ARGS_5>;
    define<CLASS_6 extends typeof import("../core/CustomElement.js").default, ARGS_6 extends ConstructorParameters<CLASS_6>, INSTANCE_6 extends InstanceType<CLASS_6>, PROPS_4 extends {
        [x: string]: {
            enumerable?: boolean;
            configurable?: boolean;
            writable?: boolean;
            value?: any;
            get?: (this: INSTANCE_6) => any;
            set?: (this: INSTANCE_6, value: any) => void;
        } | ((this: INSTANCE_6, ...args: any[]) => any);
    }, VALUE_2 extends { [KEY_2 in keyof PROPS_4]: PROPS_4[KEY_2] extends (...args2: any[]) => infer R_7 ? R_7 : PROPS_4[KEY_2] extends TypedPropertyDescriptor<infer R_8> ? R_8 : never; }>(this: CLASS_6, props: PROPS_4 & ThisType<PROPS_4 & INSTANCE_6>): CLASS_6 & import("../core/CustomElement.js").Class<VALUE_2, ARGS_6>;
    undefine(name: any): typeof import("../core/CustomElement.js").default;
    observe<CLASS_7 extends typeof import("../core/CustomElement.js").default, ARGS_7 extends ConstructorParameters<CLASS_7>, INSTANCE_7 extends InstanceType<CLASS_7>, PROPS_5 extends import("../core/CustomElement.js").IDLParameter<INSTANCE_7 & VALUE_3>, VALUE_3 extends { [KEY_3 in keyof PROPS_5]: PROPS_5[KEY_3] extends (...args2: any[]) => infer R_9 ? R_9 : PROPS_5[KEY_3] extends import("../core/observe.js").ObserverPropertyType ? import("../core/observe.js").ParsedObserverPropertyType<PROPS_5[KEY_3]> : PROPS_5[KEY_3] extends {
        type: "object";
    } & import("../core/CustomElement.js").ObserverOptions<any, infer R_10 extends unknown, any> ? unknown extends R_10 ? object : R_10 : PROPS_5[KEY_3] extends {
        type: import("../core/observe.js").ObserverPropertyType;
    } ? import("../core/observe.js").ParsedObserverPropertyType<PROPS_5[KEY_3]["type"]> : PROPS_5[KEY_3] extends import("../core/CustomElement.js").ObserverOptions<any, infer R_11 extends unknown, any> ? unknown extends R_11 ? string : R_11 : never; }>(this: CLASS_7, props: PROPS_5): CLASS_7 & import("../core/CustomElement.js").Class<VALUE_3, ARGS_7>;
    defineStatic<T1_4 extends typeof import("../core/CustomElement.js").default, T2_4 extends import("../core/CustomElement.js").IDLParameter<T1_4>>(this: T1_4, props: T2_4): T1_4 & import("../core/CustomElement.js").ParsedProps<T2_4>;
    events<T_11 extends typeof import("../core/CustomElement.js").default>(this: T_11, listeners?: import("../core/Composition.js").CompositionEventListenerObject<InstanceType<T_11>>, options?: Partial<import("../core/Composition.js").CompositionEventListener<InstanceType<T_11>, string>>): T_11;
    childEvents<T_12 extends typeof import("../core/CustomElement.js").default>(this: T_12, listenerMap: {
        [x: string]: import("../core/Composition.js").CompositionEventListenerObject<InstanceType<T_12>>;
    }, options?: Partial<import("../core/Composition.js").CompositionEventListener<InstanceType<T_12>, string>>): T_12;
    rootEvents<T_11 extends typeof import("../core/CustomElement.js").default>(this: T_11, listeners?: import("../core/Composition.js").CompositionEventListenerObject<InstanceType<T_11>>, options?: Partial<import("../core/Composition.js").CompositionEventListener<InstanceType<T_11>, string>>): T_11;
    on<T1_5 extends typeof import("../core/CustomElement.js").default, T2_5 extends InstanceType<T1_5>, T3_1 extends import("../core/CustomElement.js").CompositionCallback<T2_5, T2_5>, T4 extends keyof T3_1>(this: T1_5, name: T3_1 | T4, callbacks?: T3_1[T4] & ThisType<T2_5>): T1_5;
    onPropChanged<T1_6 extends typeof import("../core/CustomElement.js").default, T2_6 extends InstanceType<T1_6>>(this: T1_6, options: import("../core/CustomElement.js").ObjectOrObjectEntries<{ [P in keyof T2_6]?: (this: T2_6, oldValue: T2_6[P], newValue: T2_6[P], changes: any, element: T2_6) => void; }>): T1_6;
    onAttributeChanged<T1_7 extends typeof import("../core/CustomElement.js").default, T2_7 extends InstanceType<T1_7>>(this: T1_7, options: {
        [x: string]: (this: T2_7, oldValue: string, newValue: string, element: T2_7) => void;
    }): T1_7;
};
export default _default;
//# sourceMappingURL=NavBarItem.d.ts.map