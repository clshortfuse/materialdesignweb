declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
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
    density: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
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
    ariaLabel: string;
    _slotInnerText: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    focusableOnDisabled: boolean;
    controlTagName: string;
    controlVoidElement: boolean;
    _slotMutationObserver: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _onControlValue(value: string): void;
    onValueChangingContentAttribute(): void;
    focus(options?: FocusOptions): void;
    click(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateTargetElement: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(error: string): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _computedAriaLabel: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _computedAriaLabelledby: never;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateLayer: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    type: string;
    icon: string;
    iconVariation: string;
    label: string;
    filled: boolean;
    outlined: boolean;
    inputPrefix: string;
    inputSuffix: string;
    trailingIcon: string;
    trailingIconInk: string;
    trailingIconLabel: string;
    supporting: string;
    error: string;
    placeholder: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    erroredState: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    computePlaceholder: () => string;
    shouldShowSupporting: () => boolean;
    computeSupportingText: () => string;
    populatedState: () => boolean;
    _showLabelText: never;
}, any[]> & import("../core/CustomElement.js").Class<{
    _shapeShapeTop: never;
    computedIconVariation: () => string;
}, any[]> & import("../core/CustomElement.js").Class<{
    accept: string;
    alt: string;
    dirName: string;
    _formAction: string;
    formEnctype: string;
    formMethod: string;
    formTarget: string;
    _height: number;
    _indeterminate: boolean;
    max: string;
    maxLength: number;
    min: string;
    minLength: number;
    multiple: boolean;
    pattern: string;
    placeholder: string;
    size: number;
    src: string;
    step: string;
    _width: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _useFormImplicitSubmission: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _input: HTMLInputElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    indeterminate: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    controlTagName: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _onSetChecked(checked: boolean): void;
    _onSetValue(value: string): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    performImplicitSubmission(event: Event): void;
    _redispatchControlClickEvent(event: Event): boolean;
    _handleInputClick(event: MouseEvent): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    setRangeText(replacement: string): void;
    setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
    setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none"): void;
    showPicker(): void;
    stepDown(n?: number): void;
    stepUp(n?: number): void;
    select(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    files: FileList;
    selectionDirection: "none" | "forward" | "backward";
    selectionEnd: number;
    selectionStart: number;
    valueAsDate: Date;
    valueAsNumber: number;
    height: number;
    formAction: string;
    width: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    autocompleteInline: boolean;
    autocompleteList: string;
    autosuggestInline: boolean;
    autoSelect: boolean;
    _expanded: boolean;
    acceptOnEscape: boolean;
    _listbox: CustomElement & {
        delegatesFocus: boolean;
    } & {
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
    } & {
        kbdNav: string;
        _kbdFocusable: boolean;
    } & {
        kbdNavQuery: string;
        kbdNavFocusableWhenDisabled: boolean;
        ariaOrientationDefault: "horizontal" | "vertical";
    } & {
        kbdNavChildren: NodeListOf<HTMLElement>;
    } & {
        _ariaOrientationIsVertical(): boolean;
        focusCurrentOrFirst(): HTMLElement;
        focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
        focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
        focus(options?: FocusOptions): void;
        refreshTabIndexes(): void;
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
        density: number;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: string;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        _ariaRole: string;
        color: {
            empty: string;
        };
    } & {
        multiple: boolean;
        size: number;
    } & {
        _ariaRole: string;
        _optionsCollection: HTMLCollectionOf<InstanceType<typeof import("./ListOption.js").default>> & HTMLOptionsCollection;
        _selectedOptionsCollection: HTMLCollectionOf<InstanceType<typeof import("./ListOption.js").default>>;
        _handlingSelectedness: boolean;
        _handleFormReset: boolean;
    } & {
        options: HTMLCollectionOf<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        }> & HTMLOptionsCollection;
        selectedOptions: HTMLCollectionOf<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        }>;
        type: "select-one" | "select-multiple";
        kbdNavQuery: string;
        kbdNavFocusableWhenDisabled: boolean;
    } & {
        length: number;
        selectedIndex: any;
        value: string;
        add: (element: HTMLOptionElement | HTMLOptGroupElement, before?: HTMLElement | number | null) => void;
    } & {
        _selectedOptionsGenerator(): Generator<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        } & HTMLOptionElement, void, unknown>;
        [Symbol.iterator](): Generator<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        } & HTMLOptionElement, void, unknown>;
        focus(): void;
        item(index: number): InstanceType<typeof import("./ListOption.js").default> | null;
        namedItem(name: string): InstanceType<typeof import("./ListOption.js").default> | null;
        onListboxClick(event: Event): void;
    };
    _focusedValue: string;
    _focusedPosInSet: number;
    _listboxSize: number;
    _draftInput: string;
    _hasSuggestion: boolean;
    _listboxValue: string;
    _lastComputedListboxValue: string;
    _values: any[];
    _chipSelected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _hasListbox: boolean;
    _isSelect: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    listbox: CustomElement & {
        delegatesFocus: boolean;
    } & {
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
    } & {
        kbdNav: string;
        _kbdFocusable: boolean;
    } & {
        kbdNavQuery: string;
        kbdNavFocusableWhenDisabled: boolean;
        ariaOrientationDefault: "horizontal" | "vertical";
    } & {
        kbdNavChildren: NodeListOf<HTMLElement>;
    } & {
        _ariaOrientationIsVertical(): boolean;
        focusCurrentOrFirst(): HTMLElement;
        focusNext(current?: HTMLElement, loop?: boolean, reverse?: boolean): HTMLElement;
        focusPrevious(current?: HTMLElement, loop?: boolean): HTMLElement;
        focus(options?: FocusOptions): void;
        refreshTabIndexes(): void;
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
        density: number;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: string;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        _ariaRole: string;
        color: {
            empty: string;
        };
    } & {
        multiple: boolean;
        size: number;
    } & {
        _ariaRole: string;
        _optionsCollection: HTMLCollectionOf<InstanceType<typeof import("./ListOption.js").default>> & HTMLOptionsCollection;
        _selectedOptionsCollection: HTMLCollectionOf<InstanceType<typeof import("./ListOption.js").default>>;
        _handlingSelectedness: boolean;
        _handleFormReset: boolean;
    } & {
        options: HTMLCollectionOf<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        }> & HTMLOptionsCollection;
        selectedOptions: HTMLCollectionOf<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        }>;
        type: "select-one" | "select-multiple";
        kbdNavQuery: string;
        kbdNavFocusableWhenDisabled: boolean;
    } & {
        length: number;
        selectedIndex: any;
        value: string;
        add: (element: HTMLOptionElement | HTMLOptGroupElement, before?: HTMLElement | number | null) => void;
    } & {
        _selectedOptionsGenerator(): Generator<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        } & HTMLOptionElement, void, unknown>;
        [Symbol.iterator](): Generator<CustomElement & {
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
            onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
            hasFiredConnected: boolean;
        } & {
            readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
            updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
            isInteractive: () => boolean;
            hasSupporting: () => boolean;
            checkboxClass: () => string;
            radioClass: () => string;
            computedIconVariation: () => string;
        } & {
            _ariaRole: string;
            _index: number;
            _selectedDirty: boolean;
            isInteractive: boolean;
        } & {
            _label: string;
            _text: string;
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
            text: string;
            label: string;
            value: string;
        } & {
            formDisabledCallback(formDisabled: boolean): void;
            focus(options?: FocusOptions): void;
        } & {
            anchorAriaLabelledBy: () => string;
            anchorAriaDescribedBy: () => string;
            computedIconVariation: () => string;
        } & HTMLOptionElement, void, unknown>;
        focus(): void;
        item(index: number): InstanceType<typeof import("./ListOption.js").default> | null;
        namedItem(name: string): InstanceType<typeof import("./ListOption.js").default> | null;
        onListboxClick(event: Event): void;
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @type {EventListener} */
    _onListboxChangeListener: EventListener;
    /** @type {EventListener} */
    _onListboxClickListener: EventListener;
    /** @type {EventListener} */
    _onPopupFocusoutListener: EventListener;
    _suggestionText: string;
    _suggestionValue: string;
    /** @type {Pick<HTMLOptionElement, 'label'|'value'|'selected'>} */
    _suggestionOption: Pick<HTMLOptionElement, "label" | "value" | "selected">;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateTargetElement: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(): void;
    /**
     * Listbox should close if clicking own selection
     * @param {Event} event
     */
    onListboxClick(event: Event): void;
    /**
     * @param {Event} event
     */
    onListboxChange(event: Event): void;
    /** @param {FocusEvent} Event */
    onPopupFocusout({ relatedTarget }: FocusEvent): void;
    applyAutocompleteList(): void;
    showListbox(): void;
    closeListbox(): void;
    toggleListbox(): void;
    /**
     * @param {Pick<HTMLOptionElement, 'label'|'value'|'selected'>} option
     * @return {void}
     */
    suggestOption(option: Pick<HTMLOptionElement, "label" | "value" | "selected">): void;
    acceptSuggestion(emitChange?: boolean): void;
    /**
     * @param {Object} options
     * @param {boolean} [options.first] first option
     * @param {boolean} [options.last] first option
     * @param {boolean} [options.next] next fosuable option
     * @param {boolean} [options.previous] previous focusable option
     * @param {string} [options.startsWith] option label starsWith
     * @param {string} [options.value] matches option value
     * @param {string} [options.label] matches option label
     */
    changeSuggestion({ first, last, next, previous, startsWith, value, label }: {
        first?: boolean;
        last?: boolean;
        next?: boolean;
        previous?: boolean;
        startsWith?: string;
        value?: string;
        label?: string;
    }): void;
    resetSuggestion(): void;
    refreshMultiple(): void;
    populateInputFromListbox(): void;
    /** @param {CloseEvent & {currentTarget: HTMLElement}} event */
    onChipClose({ currentTarget }: CloseEvent & {
        currentTarget: HTMLElement;
    }): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    showTrailingIcon: () => string;
    computedTrailingIcon: () => string;
    controlTypeAttrValue: () => string;
    controlReadonlyAttrValue: () => boolean;
    controlIsSelect: () => boolean;
    ariaExpandedAttrValue: () => string;
    ariaControlsAttrValue: () => string;
    ariaAutocompleteAttrValue: () => "inline" | "both";
    ariaActiveDescendantAttrValue: () => "" | "aria-active";
    controlRoleAttrValue: () => string;
    populatedState: () => boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _onSetValue(value: string): void;
    _onControlValue(value: string): void;
}, any[]>;
export default _default;
export type Listbox = typeof CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
    hasFiredConnected: boolean;
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
    _optionsCollection: HTMLCollectionOf<InstanceType<typeof import("./ListOption.js").default>> & HTMLOptionsCollection;
    _selectedOptionsCollection: HTMLCollectionOf<InstanceType<typeof import("./ListOption.js").default>>;
    _handlingSelectedness: boolean;
    _handleFormReset: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    options: HTMLCollectionOf<CustomElement & {
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
        onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
        isInteractive: () => boolean;
        hasSupporting: () => boolean;
        checkboxClass: () => string;
        radioClass: () => string;
        computedIconVariation: () => string;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        _text: string;
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
        text: string;
        label: string;
        value: string;
    } & {
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    } & {
        anchorAriaLabelledBy: () => string;
        anchorAriaDescribedBy: () => string;
        computedIconVariation: () => string;
    }> & HTMLOptionsCollection;
    selectedOptions: HTMLCollectionOf<CustomElement & {
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
        onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
        isInteractive: () => boolean;
        hasSupporting: () => boolean;
        checkboxClass: () => string;
        radioClass: () => string;
        computedIconVariation: () => string;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        _text: string;
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
        text: string;
        label: string;
        value: string;
    } & {
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    } & {
        anchorAriaLabelledBy: () => string;
        anchorAriaDescribedBy: () => string;
        computedIconVariation: () => string;
    }>;
    type: "select-one" | "select-multiple";
    kbdNavQuery: string;
    kbdNavFocusableWhenDisabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    length: number;
    selectedIndex: any;
    value: string;
    add: (element: HTMLOptionElement | HTMLOptGroupElement, before?: HTMLElement | number | null) => void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _selectedOptionsGenerator(): Generator<CustomElement & {
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
        onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
        isInteractive: () => boolean;
        hasSupporting: () => boolean;
        checkboxClass: () => string;
        radioClass: () => string;
        computedIconVariation: () => string;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        _text: string;
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
        text: string;
        label: string;
        value: string;
    } & {
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    } & {
        anchorAriaLabelledBy: () => string;
        anchorAriaDescribedBy: () => string;
        computedIconVariation: () => string;
    } & HTMLOptionElement, void, unknown>;
    [Symbol.iterator](): Generator<CustomElement & {
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
        onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
        isInteractive: () => boolean;
        hasSupporting: () => boolean;
        checkboxClass: () => string;
        radioClass: () => string;
        computedIconVariation: () => string;
    } & {
        _ariaRole: string;
        _index: number;
        _selectedDirty: boolean;
        isInteractive: boolean;
    } & {
        _label: string;
        _text: string;
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
        text: string;
        label: string;
        value: string;
    } & {
        formDisabledCallback(formDisabled: boolean): void;
        focus(options?: FocusOptions): void;
    } & {
        anchorAriaLabelledBy: () => string;
        anchorAriaDescribedBy: () => string;
        computedIconVariation: () => string;
    } & HTMLOptionElement, void, unknown>;
    focus(): void;
    item(index: number): InstanceType<typeof import("./ListOption.js").default> | null;
    namedItem(name: string): InstanceType<typeof import("./ListOption.js").default> | null;
    onListboxClick(event: Event): void;
}, any[]>;
export type RippleMixin = typeof import("../mixins/RippleMixin.js").default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Input.d.ts.map