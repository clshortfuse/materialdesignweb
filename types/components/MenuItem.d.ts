declare const _default: typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
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
}, any[]> & {
    formAssociated: true;
} & import("../core/CustomElement.js").Class<{
    _ipcListener: EventListener;
    _ipcTarget: EventTarget;
    _files: FileList;
}, any[]> & import("../core/CustomElement.js").Class<{
    ariaControls: string;
    autocomplete: string;
    name: string;
    readOnly: boolean;
    formNoValidate: boolean;
    defaultChecked: boolean;
    _checkedDirty: boolean;
    _checked: boolean;
    required: boolean;
    type: string;
    _defaultValue: string;
    _value: string;
    _valueDirty: boolean;
    _userInteracted: boolean;
    _invalid: boolean;
    _badInput: boolean;
    _validationMessage: string;
    _formDisabled: boolean;
    _formReset: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    erroredState: boolean;
    defaultValue: string;
    _valueBehavior: "default" | "value" | "default/on" | "filename";
}, any[]> & import("../core/CustomElement.js").Class<{
    _onSetValue(value: string): void;
    _onSetChecked(checked: boolean): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    value: string;
    checked: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    form: HTMLFormElement;
    validity: ValidityState;
    validationMessage: string;
    willValidate: boolean;
    labels: NodeList;
}, any[]> & import("../core/CustomElement.js").Class<{
    disabledState: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(error: string): void;
    _notifyRadioChange(key: string, value: string): void;
    refreshFormAssociation(): void;
    formAssociatedCallback(form: HTMLFormElement | null): void;
    formIPCEvent(event: CustomEvent<[string, string]>): void;
    formDisabledCallback(disabled: boolean): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
    _updateFormAssociatedValue(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
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
    formDisabledCallback(formDisabled: boolean): void;
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
        formDisabledCallback(formDisabled: boolean): void;
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
        formDisabledCallback(formDisabled: boolean): void;
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
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }) => string>;
}, any[]> & import("../core/CustomElement.js").Class<{
    _cascadeTimeout: any;
    CASCADE_TIMEOUT: number;
    _cascading: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    type: "radio" | "checkbox";
}, any[]> & import("../core/CustomElement.js").Class<{
    cascades: string;
    _defaultValue: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    defaultValue: string;
    value: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    formIPCEvent(event: CustomEvent<[string, string]>): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    computeTrailingIcon: () => ReturnType<({ trailingIcon, cascades }: import("../index.js").CustomElement & {
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
        _files: FileList;
    } & {
        ariaControls: string;
        autocomplete: string;
        name: string;
        readOnly: boolean;
        formNoValidate: boolean;
        defaultChecked: boolean;
        _checkedDirty: boolean;
        _checked: boolean;
        required: boolean;
        type: string;
        _defaultValue: string;
        _value: string;
        _valueDirty: boolean;
        _userInteracted: boolean;
        _invalid: boolean;
        _badInput: boolean;
        _validationMessage: string;
        _formDisabled: boolean;
        _formReset: boolean;
    } & {
        erroredState: boolean;
        defaultValue: string;
        _valueBehavior: "default" | "value" | "default/on" | "filename";
    } & {
        _onSetValue(value: string): void;
        _onSetChecked(checked: boolean): void;
    } & {
        value: string;
        checked: boolean;
    } & {
        form: HTMLFormElement;
        validity: ValidityState;
        validationMessage: string;
        willValidate: boolean;
        labels: NodeList;
    } & {
        disabledState: boolean;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
        _notifyRadioChange(key: string, value: string): void;
        refreshFormAssociation(): void;
        formAssociatedCallback(form: HTMLFormElement | null): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
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
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    } & {
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
            formDisabledCallback(formDisabled: boolean): void;
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
            formDisabledCallback(formDisabled: boolean): void;
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
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }) => string>;
    } & {
        _cascadeTimeout: any;
        CASCADE_TIMEOUT: number;
        _cascading: boolean;
    } & {
        type: "radio" | "checkbox";
    } & {
        cascades: string;
        _defaultValue: string;
    } & {
        defaultValue: string;
        value: string;
    } & {
        formIPCEvent(event: CustomEvent<[string, string]>): void;
    }) => string>;
}, any[]> & import("../core/CustomElement.js").Class<{
    unscheduleCascade(): void;
    scheduleCascade(): void;
    cascade(): void;
}, any[]>;
export default _default;
//# sourceMappingURL=MenuItem.d.ts.map