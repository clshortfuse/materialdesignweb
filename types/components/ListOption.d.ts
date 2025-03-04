declare const _default: typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
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
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
    updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
    _lastRipple: import("../index.js").CustomElement & {
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
    _ariaRole: string;
    stateLayer: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    leading: string;
    avatar: string;
    avatarColor: string;
    avatarSrc: string;
    src: string;
    alt: string;
    icon: string;
    iconInk: string;
    iconSrc: string;
    iconVariation: string;
    checkbox: string;
    radio: string;
    selectionColor: string;
    selected: boolean;
    supporting: string;
    trailing: string;
    trailingIcon: string;
    trailingIconInk: string;
    trailingIconSrc: string;
    divider: string;
    video: boolean;
    lines: number;
    _supportingSlotted: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    disabledState: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    isInteractive: () => ReturnType<({ href }: import("../index.js").CustomElement & {
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
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
        updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
        _lastRipple: import("../index.js").CustomElement & {
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
        _ariaRole: string;
        stateLayer: boolean;
    } & {
        leading: string;
        avatar: string;
        avatarColor: string;
        avatarSrc: string;
        src: string;
        alt: string;
        icon: string;
        iconInk: string;
        iconSrc: string;
        iconVariation: string;
        checkbox: string;
        radio: string;
        selectionColor: string;
        selected: boolean;
        supporting: string;
        trailing: string;
        trailingIcon: string;
        trailingIconInk: string;
        trailingIconSrc: string;
        divider: string;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    } & {
        disabledState: boolean;
    }) => boolean>;
    hasSupporting: () => ReturnType<() => boolean>;
    checkboxClass: () => ReturnType<() => string>;
    radioClass: () => ReturnType<() => string>;
    computedIconVariation: () => ReturnType<({ iconVariation }: import("../index.js").CustomElement & {
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
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
        updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
        _lastRipple: import("../index.js").CustomElement & {
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
        _ariaRole: string;
        stateLayer: boolean;
    } & {
        leading: string;
        avatar: string;
        avatarColor: string;
        avatarSrc: string;
        src: string;
        alt: string;
        icon: string;
        iconInk: string;
        iconSrc: string;
        iconVariation: string;
        checkbox: string;
        radio: string;
        selectionColor: string;
        selected: boolean;
        supporting: string;
        trailing: string;
        trailingIcon: string;
        trailingIconInk: string;
        trailingIconSrc: string;
        divider: string;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    } & {
        disabledState: boolean;
    }) => string>;
}, any[]> & {
    formAssociated: true;
} & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
    _index: number;
    _selectedDirty: boolean;
    isInteractive: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _label: string;
    defaultSelected: boolean;
    _selected: boolean;
    _value: string;
    _formDisabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    selected: boolean;
    disabledState: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    index: number;
    form: HTMLFormElement;
    label: string;
    value: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @param {boolean} formDisabled  */
    formDisabledCallback(formDisabled: boolean): void;
    /** @type {HTMLElement['focus']} */
    focus(options?: FocusOptions): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    anchorAriaLabelledBy: () => ReturnType<({ _label }: import("../index.js").CustomElement & {
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
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
        updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
        _lastRipple: import("../index.js").CustomElement & {
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
        _ariaRole: string;
        stateLayer: boolean;
    } & {
        leading: string;
        avatar: string;
        avatarColor: string;
        avatarSrc: string;
        src: string;
        alt: string;
        icon: string;
        iconInk: string;
        iconSrc: string;
        iconVariation: string;
        checkbox: string;
        radio: string;
        selectionColor: string;
        selected: boolean;
        supporting: string;
        trailing: string;
        trailingIcon: string;
        trailingIconInk: string;
        trailingIconSrc: string;
        divider: string;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    } & {
        disabledState: boolean;
    } & {
        isInteractive: () => ReturnType<({ href }: import("../index.js").CustomElement & {
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
            _ariaRole: string;
        } & {
            onConnectAriaValues: Map<string, string>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
            updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
            _lastRipple: import("../index.js").CustomElement & {
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
            _ariaRole: string;
            stateLayer: boolean;
        } & {
            leading: string;
            avatar: string;
            avatarColor: string;
            avatarSrc: string;
            src: string;
            alt: string;
            icon: string;
            iconInk: string;
            iconSrc: string;
            iconVariation: string;
            checkbox: string;
            radio: string;
            selectionColor: string;
            selected: boolean;
            supporting: string;
            trailing: string;
            trailingIcon: string;
            trailingIconInk: string;
            trailingIconSrc: string;
            divider: string;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }) => boolean>;
        hasSupporting: () => ReturnType<() => boolean>;
        checkboxClass: () => ReturnType<() => string>;
        radioClass: () => ReturnType<() => string>;
        computedIconVariation: () => ReturnType<({ iconVariation }: import("../index.js").CustomElement & {
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
            _ariaRole: string;
        } & {
            onConnectAriaValues: Map<string, string>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
            updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
            _lastRipple: import("../index.js").CustomElement & {
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
            _ariaRole: string;
            stateLayer: boolean;
        } & {
            leading: string;
            avatar: string;
            avatarColor: string;
            avatarSrc: string;
            src: string;
            alt: string;
            icon: string;
            iconInk: string;
            iconSrc: string;
            iconVariation: string;
            checkbox: string;
            radio: string;
            selectionColor: string;
            selected: boolean;
            supporting: string;
            trailing: string;
            trailingIcon: string;
            trailingIconInk: string;
            trailingIconSrc: string;
            divider: string;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }) => string>;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        defaultSelected: boolean;
        _selected: boolean;
        _value: string;
        _formDisabled: boolean;
    } & {
        selected: boolean;
        disabledState: boolean;
    } & {
        index: number;
        form: HTMLFormElement;
        label: string;
        value: string;
    } & {
        /** @param {boolean} formDisabled  */
        formDisabledCallback(formDisabled: boolean): void;
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
    }) => string>;
    anchorAriaDescribedBy: () => ReturnType<({ _label }: import("../index.js").CustomElement & {
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
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
        updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
        _lastRipple: import("../index.js").CustomElement & {
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
        _ariaRole: string;
        stateLayer: boolean;
    } & {
        leading: string;
        avatar: string;
        avatarColor: string;
        avatarSrc: string;
        src: string;
        alt: string;
        icon: string;
        iconInk: string;
        iconSrc: string;
        iconVariation: string;
        checkbox: string;
        radio: string;
        selectionColor: string;
        selected: boolean;
        supporting: string;
        trailing: string;
        trailingIcon: string;
        trailingIconInk: string;
        trailingIconSrc: string;
        divider: string;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    } & {
        disabledState: boolean;
    } & {
        isInteractive: () => ReturnType<({ href }: import("../index.js").CustomElement & {
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
            _ariaRole: string;
        } & {
            onConnectAriaValues: Map<string, string>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
            updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
            _lastRipple: import("../index.js").CustomElement & {
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
            _ariaRole: string;
            stateLayer: boolean;
        } & {
            leading: string;
            avatar: string;
            avatarColor: string;
            avatarSrc: string;
            src: string;
            alt: string;
            icon: string;
            iconInk: string;
            iconSrc: string;
            iconVariation: string;
            checkbox: string;
            radio: string;
            selectionColor: string;
            selected: boolean;
            supporting: string;
            trailing: string;
            trailingIcon: string;
            trailingIconInk: string;
            trailingIconSrc: string;
            divider: string;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }) => boolean>;
        hasSupporting: () => ReturnType<() => boolean>;
        checkboxClass: () => ReturnType<() => string>;
        radioClass: () => ReturnType<() => string>;
        computedIconVariation: () => ReturnType<({ iconVariation }: import("../index.js").CustomElement & {
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
            _ariaRole: string;
        } & {
            onConnectAriaValues: Map<string, string>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
            updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
            _lastRipple: import("../index.js").CustomElement & {
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
            _ariaRole: string;
            stateLayer: boolean;
        } & {
            leading: string;
            avatar: string;
            avatarColor: string;
            avatarSrc: string;
            src: string;
            alt: string;
            icon: string;
            iconInk: string;
            iconSrc: string;
            iconVariation: string;
            checkbox: string;
            radio: string;
            selectionColor: string;
            selected: boolean;
            supporting: string;
            trailing: string;
            trailingIcon: string;
            trailingIconInk: string;
            trailingIconSrc: string;
            divider: string;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }) => string>;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        defaultSelected: boolean;
        _selected: boolean;
        _value: string;
        _formDisabled: boolean;
    } & {
        selected: boolean;
        disabledState: boolean;
    } & {
        index: number;
        form: HTMLFormElement;
        label: string;
        value: string;
    } & {
        /** @param {boolean} formDisabled  */
        formDisabledCallback(formDisabled: boolean): void;
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
    }) => string>;
    computedIconVariation: () => ReturnType<({ iconVariation, selected }: import("../index.js").CustomElement & {
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
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
        updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
        _lastRipple: import("../index.js").CustomElement & {
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
        _ariaRole: string;
        stateLayer: boolean;
    } & {
        leading: string;
        avatar: string;
        avatarColor: string;
        avatarSrc: string;
        src: string;
        alt: string;
        icon: string;
        iconInk: string;
        iconSrc: string;
        iconVariation: string;
        checkbox: string;
        radio: string;
        selectionColor: string;
        selected: boolean;
        supporting: string;
        trailing: string;
        trailingIcon: string;
        trailingIconInk: string;
        trailingIconSrc: string;
        divider: string;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    } & {
        disabledState: boolean;
    } & {
        isInteractive: () => ReturnType<({ href }: import("../index.js").CustomElement & {
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
            _ariaRole: string;
        } & {
            onConnectAriaValues: Map<string, string>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
            updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
            _lastRipple: import("../index.js").CustomElement & {
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
            _ariaRole: string;
            stateLayer: boolean;
        } & {
            leading: string;
            avatar: string;
            avatarColor: string;
            avatarSrc: string;
            src: string;
            alt: string;
            icon: string;
            iconInk: string;
            iconSrc: string;
            iconVariation: string;
            checkbox: string;
            radio: string;
            selectionColor: string;
            selected: boolean;
            supporting: string;
            trailing: string;
            trailingIcon: string;
            trailingIconInk: string;
            trailingIconSrc: string;
            divider: string;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }) => boolean>;
        hasSupporting: () => ReturnType<() => boolean>;
        checkboxClass: () => ReturnType<() => string>;
        radioClass: () => ReturnType<() => string>;
        computedIconVariation: () => ReturnType<({ iconVariation }: import("../index.js").CustomElement & {
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
            _ariaRole: string;
        } & {
            onConnectAriaValues: Map<string, string>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot;
            updateAriaProperty(name: keyof HTMLElement & keyof ElementInternals, value: string): void;
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
            _lastRipple: import("../index.js").CustomElement & {
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
            _ariaRole: string;
            stateLayer: boolean;
        } & {
            leading: string;
            avatar: string;
            avatarColor: string;
            avatarSrc: string;
            src: string;
            alt: string;
            icon: string;
            iconInk: string;
            iconSrc: string;
            iconVariation: string;
            checkbox: string;
            radio: string;
            selectionColor: string;
            selected: boolean;
            supporting: string;
            trailing: string;
            trailingIcon: string;
            trailingIconInk: string;
            trailingIconSrc: string;
            divider: string;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }) => string>;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        defaultSelected: boolean;
        _selected: boolean;
        _value: string;
        _formDisabled: boolean;
    } & {
        selected: boolean;
        disabledState: boolean;
    } & {
        index: number;
        form: HTMLFormElement;
        label: string;
        value: string;
    } & {
        /** @param {boolean} formDisabled  */
        formDisabledCallback(formDisabled: boolean): void;
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
    }) => string>;
}, any[]>;
export default _default;
//# sourceMappingURL=ListOption.d.ts.map