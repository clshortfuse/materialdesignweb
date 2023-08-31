declare const _default: typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
    updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
}, any[]> & import("../core/CustomElement.js").Class<{
    ariaControls: string;
    autocomplete: string;
    name: string;
    readOnly: boolean;
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
    formAssociatedCallback(form: HTMLFormElement): void;
    formIPCEvent(event: CustomEvent<[string, string]>): void;
    formDisabledCallback(disabled: boolean): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
    _updateFormAssociatedValue(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    density: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    block: boolean;
    inline: boolean;
    row: boolean;
    x: string;
    y: string;
    gap: number;
    padding: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    color: string;
    ink: string;
    typeStyle: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
    color: {
        empty: string;
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    multiple: boolean;
    size: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
    /** @type {HTMLCollectionOf<ListOption> & HTMLOptionsCollection} */
    _optionsCollection: HTMLCollectionOf<typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]>> & HTMLOptionsCollection;
    /** @type {HTMLCollectionOf<ListOption>} */
    _selectedOptionsCollection: HTMLCollectionOf<typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]>>;
    _handlingSelectedness: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    options: HTMLCollectionOf<typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]>> & HTMLOptionsCollection;
    selectedOptions: HTMLCollectionOf<typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]>>;
    type: string;
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    length: number;
    selectedIndex: any;
    value: any;
    add: (element: HTMLOptGroupElement | HTMLOptionElement, before?: number | HTMLElement) => void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _selectedOptionsGenerator(): Generator<typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]> & HTMLOptionElement, void, unknown>;
    [Symbol.iterator](): Generator<typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]> & HTMLOptionElement, void, unknown>;
    focus(): void;
    /**
     * @param {number} index
     * @return {ListOption|null}
     */
    item(index: number): (typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]>) | null;
    /**
     * @param {string} name ID of ListOption
     * @return {ListOption|null}
     */
    namedItem(name: string): (typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
    }, any[]> & import("../core/CustomElement.js").Class<{
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
        divider: boolean;
        video: boolean;
        lines: number;
        _supportingSlotted: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        disabledState: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        isInteractive({ href }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): boolean;
        hasSupporting(): boolean;
        checkboxClass(): string;
        radioClass(): string;
        computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        }): string;
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
        form: any;
        label: string;
        value: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        anchorAriaLabelledBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        anchorAriaDescribedBy({ _label }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
        computedIconVariation({ iconVariation, selected }: import("../core/CustomElement.js").default & {
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
            readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
            updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
            divider: boolean;
            video: boolean;
            lines: number;
            _supportingSlotted: boolean;
        } & {
            disabledState: boolean;
        } & {
            isInteractive({ href }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): boolean;
            hasSupporting(): boolean;
            checkboxClass(): string;
            radioClass(): string;
            computedIconVariation({ iconVariation }: import("../core/CustomElement.js").default & {
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
                readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
                updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
                divider: boolean;
                video: boolean;
                lines: number;
                _supportingSlotted: boolean;
            } & {
                disabledState: boolean;
            }): string;
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
            form: any;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        }): string;
    }, any[]>) | null;
    /** @param {Event} event */
    onListboxClick(event: Event): void;
}, any[]>;
export default _default;
//# sourceMappingURL=Listbox.d.ts.map