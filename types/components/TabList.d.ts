declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scroller: WeakRef<HTMLElement | Window>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScroller: HTMLElement | Window;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerClear(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _semiStickyHeight: number;
    _semiStickyOffsetY: number;
    _semiStickyTranslateY: number;
    _semiStickyDuration: number;
    _semiStickyEasing: string;
    _semiStickyMeasured: boolean;
    stickyAlways: boolean;
    stickyParent: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _refreshSemiStickyMetrics(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
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
}, any[]> & import("../core/CustomElement.js").Class<{
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateTargetElement: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    color: string;
    ink: string;
    typeStyle: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
    outlined: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    pageIsRTL: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
    updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNav: string;
    _kbdFocusable: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
    ariaOrientationDefault: "horizontal" | "vertical";
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNavChildren: NodeListOf<HTMLElement>;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaOrientationIsVertical(): boolean;
    focusCurrentOrFirst(): HTMLElement;
    focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
    focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
    focus(options?: FocusOptions): void;
    refreshTabIndexes(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    scrollable: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @type {WeakRef<HTMLElement>} */
    _tabContentRef: WeakRef<HTMLElement>;
    /** Listener function attached to the tab content's `scroll` event. */
    _tabContentScrollListener: any;
    /** @type {HTMLCollectionOf<InstanceType<Tab>>} */
    _tabCollection: HTMLCollectionOf<InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
        delegatesFocus: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        href: string;
        target: string;
        download: string;
        ping: string;
        rel: string;
        hreflang: string;
        referrerPolicy: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<object, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerPositionX: number;
        _scrollListenerPositionY: number;
        _scrollListenerLastIdle: number;
        _scrollListenerLastScroll: number;
        _scrollListenerLastResize: number;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scroller: WeakRef<HTMLElement | Window>;
        _scrollerScrollListener: EventListener;
        _scrollerResizeListener: EventListener;
        _scrollDebounce: any;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerOnScrollIdle(): void;
        _scrollListenerOnScrollerScroll(event: Event): void;
        _scrollListenerOnScrollerResize(event: Event): void;
        startScrollListener(scroller?: EventTarget): boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerScroller: HTMLElement | Window;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerScrollerScrollHeight: any;
        _scrollListenerScrollerClientHeight: any;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerClear(scroller?: EventTarget): boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
        hoveredState: boolean;
        focusedState: boolean;
        pressedState: boolean;
        touchedState: boolean;
        pointedState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        stateTargetElement: HTMLElement;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
        _rippleAdded: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _lastRipple: CustomElement & {
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
    }, any[]> & import("../core/CustomElement.js").Class<{
        addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
    }, any[]> & import("../core/CustomElement.js").Class<{
        color: string;
        ink: string;
        typeStyle: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        stateTargetElement: HTMLElement;
    }, any[]> & import("../core/CustomElement.js").Class<{
        stateLayer: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        active: boolean;
        icon: string;
        src: string;
        ariaLabel: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        focus(options?: FocusOptions): void;
        computeLabelMetrics(): {
            width: number;
            left: number;
        };
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaControls: () => string;
        anchorAriaSelected: () => string;
        anchorAriaDisabled: () => string;
        anchorHref: () => string;
        iconIf: () => string;
        iconVariation: () => string;
    }, any[]>>>;
    /**
     * @type {{
     *  left:number,
     *  width:number,
     *  right:number,
     *  center: number,
     *  label: {left:number, width:number},
     *  tab: InstanceType<Tab>,
     *  index: number,
     * }[]}
     */
    _tabMetrics: {
        left: number;
        width: number;
        right: number;
        center: number;
        label: {
            left: number;
            width: number;
        };
        tab: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
            delegatesFocus: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        }, any[]> & import("../core/CustomElement.js").Class<{
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
        }, any[]> & import("../core/CustomElement.js").Class<object, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerPositionX: number;
            _scrollListenerPositionY: number;
            _scrollListenerLastIdle: number;
            _scrollListenerLastScroll: number;
            _scrollListenerLastResize: number;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scroller: WeakRef<HTMLElement | Window>;
            _scrollerScrollListener: EventListener;
            _scrollerResizeListener: EventListener;
            _scrollDebounce: any;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerOnScrollIdle(): void;
            _scrollListenerOnScrollerScroll(event: Event): void;
            _scrollListenerOnScrollerResize(event: Event): void;
            startScrollListener(scroller?: EventTarget): boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerScroller: HTMLElement | Window;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerScrollerScrollHeight: any;
            _scrollListenerScrollerClientHeight: any;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerClear(scroller?: EventTarget): boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
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
        }, any[]> & import("../core/CustomElement.js").Class<{
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            stateTargetElement: HTMLElement;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
            _rippleAdded: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _lastRipple: CustomElement & {
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
        }, any[]> & import("../core/CustomElement.js").Class<{
            addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
        }, any[]> & import("../core/CustomElement.js").Class<{
            color: string;
            ink: string;
            typeStyle: string;
        }, any[]> & import("../core/CustomElement.js").Class<{
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            stateTargetElement: HTMLElement;
        }, any[]> & import("../core/CustomElement.js").Class<{
            stateLayer: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            active: boolean;
            icon: string;
            src: string;
            ariaLabel: string;
        }, any[]> & import("../core/CustomElement.js").Class<{
            focus(options?: FocusOptions): void;
            computeLabelMetrics(): {
                width: number;
                left: number;
            };
        }, any[]> & import("../core/CustomElement.js").Class<{
            anchorAriaControls: () => string;
            anchorAriaSelected: () => string;
            anchorAriaDisabled: () => string;
            anchorHref: () => string;
            iconIf: () => string;
            iconVariation: () => string;
        }, any[]>>;
        index: number;
    }[];
    _isRTL: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    tabContent: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    tabContentId: string;
    active: boolean;
    secondary: boolean;
    _indicatorStyle: string;
    color: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    tabs: HTMLCollectionOf<CustomElement & {
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
        _scrollListenerPositionX: number;
        _scrollListenerPositionY: number;
        _scrollListenerLastIdle: number;
        _scrollListenerLastScroll: number;
        _scrollListenerLastResize: number;
    } & {
        _scroller: WeakRef<HTMLElement | Window>;
        _scrollerScrollListener: EventListener;
        _scrollerResizeListener: EventListener;
        _scrollDebounce: any;
    } & {
        _scrollListenerOnScrollIdle(): void;
        _scrollListenerOnScrollerScroll(event: Event): void;
        _scrollListenerOnScrollerResize(event: Event): void;
        startScrollListener(scroller?: EventTarget): boolean;
    } & {
        _scrollListenerScroller: HTMLElement | Window;
    } & {
        _scrollListenerScrollerScrollHeight: any;
        _scrollListenerScrollerClientHeight: any;
    } & {
        _scrollListenerClear(scroller?: EventTarget): boolean;
    } & {
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
        stateTargetElement: HTMLElement;
    } & {
        _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
        _rippleAdded: boolean;
    } & {
        _lastRipple: CustomElement & {
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
        addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
    } & {
        active: boolean;
        icon: string;
        src: string;
        ariaLabel: string;
    } & {
        focus(options?: FocusOptions): void;
        computeLabelMetrics(): {
            width: number;
            left: number;
        };
    } & {
        anchorAriaControls: () => string;
        anchorAriaSelected: () => string;
        anchorAriaDisabled: () => string;
        anchorHref: () => string;
        iconIf: () => string;
        iconVariation: () => string;
    }>;
}, any[]> & import("../core/CustomElement.js").Class<{
    _selectedIndex: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    kbdNavQuery: string;
    ariaOrientationDefault: "horizontal" | "vertical";
    childTabItems: NodeListOf<CustomElement & {
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
        _scrollListenerPositionX: number;
        _scrollListenerPositionY: number;
        _scrollListenerLastIdle: number;
        _scrollListenerLastScroll: number;
        _scrollListenerLastResize: number;
    } & {
        _scroller: WeakRef<HTMLElement | Window>;
        _scrollerScrollListener: EventListener;
        _scrollerResizeListener: EventListener;
        _scrollDebounce: any;
    } & {
        _scrollListenerOnScrollIdle(): void;
        _scrollListenerOnScrollerScroll(event: Event): void;
        _scrollListenerOnScrollerResize(event: Event): void;
        startScrollListener(scroller?: EventTarget): boolean;
    } & {
        _scrollListenerScroller: HTMLElement | Window;
    } & {
        _scrollListenerScrollerScrollHeight: any;
        _scrollListenerScrollerClientHeight: any;
    } & {
        _scrollListenerClear(scroller?: EventTarget): boolean;
    } & {
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
        stateTargetElement: HTMLElement;
    } & {
        _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
        _rippleAdded: boolean;
    } & {
        _lastRipple: CustomElement & {
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
        addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
    } & {
        active: boolean;
        icon: string;
        src: string;
        ariaLabel: string;
    } & {
        focus(options?: FocusOptions): void;
        computeLabelMetrics(): {
            width: number;
            left: number;
        };
    } & {
        anchorAriaControls: () => string;
        anchorAriaSelected: () => string;
        anchorAriaDisabled: () => string;
        anchorHref: () => string;
        iconIf: () => string;
        iconVariation: () => string;
    }>;
    tabMetrics: {
        left: number;
        width: number;
        right: number;
        center: number;
        label: {
            left: number;
            width: number;
        };
        tab: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
            delegatesFocus: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            href: string;
            target: string;
            download: string;
            ping: string;
            rel: string;
            hreflang: string;
            referrerPolicy: string;
        }, any[]> & import("../core/CustomElement.js").Class<{
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
        }, any[]> & import("../core/CustomElement.js").Class<object, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerPositionX: number;
            _scrollListenerPositionY: number;
            _scrollListenerLastIdle: number;
            _scrollListenerLastScroll: number;
            _scrollListenerLastResize: number;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scroller: WeakRef<HTMLElement | Window>;
            _scrollerScrollListener: EventListener;
            _scrollerResizeListener: EventListener;
            _scrollDebounce: any;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerOnScrollIdle(): void;
            _scrollListenerOnScrollerScroll(event: Event): void;
            _scrollListenerOnScrollerResize(event: Event): void;
            startScrollListener(scroller?: EventTarget): boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerScroller: HTMLElement | Window;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerScrollerScrollHeight: any;
            _scrollListenerScrollerClientHeight: any;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _scrollListenerClear(scroller?: EventTarget): boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
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
        }, any[]> & import("../core/CustomElement.js").Class<{
            disabledState: boolean;
            hoveredState: boolean;
            focusedState: boolean;
            pressedState: boolean;
            touchedState: boolean;
            pointedState: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            stateTargetElement: HTMLElement;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
            _rippleAdded: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            _lastRipple: CustomElement & {
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
        }, any[]> & import("../core/CustomElement.js").Class<{
            addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
        }, any[]> & import("../core/CustomElement.js").Class<{
            color: string;
            ink: string;
            typeStyle: string;
        }, any[]> & import("../core/CustomElement.js").Class<{
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            stateTargetElement: HTMLElement;
        }, any[]> & import("../core/CustomElement.js").Class<{
            stateLayer: boolean;
        }, any[]> & import("../core/CustomElement.js").Class<{
            active: boolean;
            icon: string;
            src: string;
            ariaLabel: string;
        }, any[]> & import("../core/CustomElement.js").Class<{
            focus(options?: FocusOptions): void;
            computeLabelMetrics(): {
                width: number;
                left: number;
            };
        }, any[]> & import("../core/CustomElement.js").Class<{
            anchorAriaControls: () => string;
            anchorAriaSelected: () => string;
            anchorAriaDisabled: () => string;
            anchorHref: () => string;
            iconIf: () => string;
            iconVariation: () => string;
        }, any[]>>;
        index: number;
    }[];
    selectedIndex: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    selectedItem: CustomElement & {
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
        _scrollListenerPositionX: number;
        _scrollListenerPositionY: number;
        _scrollListenerLastIdle: number;
        _scrollListenerLastScroll: number;
        _scrollListenerLastResize: number;
    } & {
        _scroller: WeakRef<HTMLElement | Window>;
        _scrollerScrollListener: EventListener;
        _scrollerResizeListener: EventListener;
        _scrollDebounce: any;
    } & {
        _scrollListenerOnScrollIdle(): void;
        _scrollListenerOnScrollerScroll(event: Event): void;
        _scrollListenerOnScrollerResize(event: Event): void;
        startScrollListener(scroller?: EventTarget): boolean;
    } & {
        _scrollListenerScroller: HTMLElement | Window;
    } & {
        _scrollListenerScrollerScrollHeight: any;
        _scrollListenerScrollerClientHeight: any;
    } & {
        _scrollListenerClear(scroller?: EventTarget): boolean;
    } & {
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
        stateTargetElement: HTMLElement;
    } & {
        _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
        _rippleAdded: boolean;
    } & {
        _lastRipple: CustomElement & {
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
        addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
    } & {
        active: boolean;
        icon: string;
        src: string;
        ariaLabel: string;
    } & {
        focus(options?: FocusOptions): void;
        computeLabelMetrics(): {
            width: number;
            left: number;
        };
    } & {
        anchorAriaControls: () => string;
        anchorAriaSelected: () => string;
        anchorAriaDisabled: () => string;
        anchorHref: () => string;
        iconIf: () => string;
        iconVariation: () => string;
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    /** Clear cached tab metrics (widths/positions). */
    clearCache(): void;
    /** Find and bind to the external `TabContent` element by id. */
    searchForTabContent(): void;
    /** Update the indicator position based on a specific `Tab`. */
    /** @param {InstanceType<Tab>} [tab] */
    updateIndicatorByTab(tab?: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
        delegatesFocus: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        href: string;
        target: string;
        download: string;
        ping: string;
        rel: string;
        hreflang: string;
        referrerPolicy: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<object, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerPositionX: number;
        _scrollListenerPositionY: number;
        _scrollListenerLastIdle: number;
        _scrollListenerLastScroll: number;
        _scrollListenerLastResize: number;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scroller: WeakRef<HTMLElement | Window>;
        _scrollerScrollListener: EventListener;
        _scrollerResizeListener: EventListener;
        _scrollDebounce: any;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerOnScrollIdle(): void;
        _scrollListenerOnScrollerScroll(event: Event): void;
        _scrollListenerOnScrollerResize(event: Event): void;
        startScrollListener(scroller?: EventTarget): boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerScroller: HTMLElement | Window;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerScrollerScrollHeight: any;
        _scrollListenerScrollerClientHeight: any;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _scrollListenerClear(scroller?: EventTarget): boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
        hoveredState: boolean;
        focusedState: boolean;
        pressedState: boolean;
        touchedState: boolean;
        pointedState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        stateTargetElement: HTMLElement;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _lastRippleWeakRef: WeakRef<InstanceType<import("../mixins/RippleMixin.js").Ripple>>;
        _rippleAdded: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _lastRipple: CustomElement & {
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
    }, any[]> & import("../core/CustomElement.js").Class<{
        addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
    }, any[]> & import("../core/CustomElement.js").Class<{
        color: string;
        ink: string;
        typeStyle: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        stateTargetElement: HTMLElement;
    }, any[]> & import("../core/CustomElement.js").Class<{
        stateLayer: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        active: boolean;
        icon: string;
        src: string;
        ariaLabel: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        focus(options?: FocusOptions): void;
        computeLabelMetrics(): {
            width: number;
            left: number;
        };
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaControls: () => string;
        anchorAriaSelected: () => string;
        anchorAriaDisabled: () => string;
        anchorHref: () => string;
        iconIf: () => string;
        iconVariation: () => string;
    }, any[]>>): void;
    /** Recompute and apply indicator; optionally disable animation when `animate` is false. */
    updateIndicator(animate?: boolean): void;
    /**
     * Update the indicator position by a floating `percentage` between 0..1
     * representing the scroll progress across tab panels.
     * @param {number} percentage
     */
    updateIndicatorByPosition(percentage: number): void;
    /** Update the indicator using a discrete tab index. */
    /** @param {number} index */
    updateIndicatorByIndex(index: number): void;
    /** Observe the bound TabContent scroll and update indicator accordingly. */
    observeTabContent(): void;
    /** Handler called when the element is resized; refresh cache and indicator. */
    onResizeObserved(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    ariaRole: string;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=TabList.d.ts.map