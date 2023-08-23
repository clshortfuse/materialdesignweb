declare const _default: typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
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
    delegatesFocus: boolean;
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
    ariaLabel: string;
    _slotInnerText: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    focusableOnDisabled: boolean;
    controlTagName: string;
    controlVoidElement: boolean;
    _slotMutationObserver: any;
}, any[]> & import("../core/CustomElement.js").Class<{
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
    _computedAriaLabel(this: import("../core/CustomElement.js").default & {
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    }): string;
    _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    }, { ariaLabel }: import("../core/CustomElement.js").default & {
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    }): string;
}, any[]> & import("../core/CustomElement.js").Class<{
    accept: string;
    alt: string;
    dirName: string;
    _formAction: string;
    formEnctype: string;
    formMethod: string;
    formNoValidate: boolean;
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
    setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
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
    shapeTop: boolean;
    shapeBottom: boolean;
    shapeStart: boolean;
    shapeEnd: boolean;
    shapeStyle: string;
    outlined: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    density: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateTargetElement: HTMLElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateLayer: boolean;
    _allowedTypes: string[];
}, any[]> & import("../core/CustomElement.js").Class<{
    type: string;
    elevated: boolean;
    filled: string;
    outlined: boolean;
    icon: string;
    iconInk: string;
    src: string;
    svg: string;
    viewBox: string;
    svgPath: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    hasIcon(this: import("../core/CustomElement.js").default & {
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
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    } & {
        _computedAriaLabel(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
        _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
    } & {
        accept: string;
        alt: string;
        dirName: string;
        _formAction: string;
        formEnctype: string;
        formMethod: string;
        formNoValidate: boolean;
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
    } & {
        _input: HTMLInputElement;
    } & {
        indeterminate: boolean;
    } & {
        controlTagName: string;
    } & {
        _onSetChecked(checked: boolean): void;
        _onSetValue(value: string): void;
    } & {
        performImplicitSubmission(event: Event): void;
        _redispatchControlClickEvent(event: Event): boolean;
        _handleInputClick(event: MouseEvent): void;
    } & {
        setRangeText(replacement: string): void;
        setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
        setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
        showPicker(): void;
        stepDown(n?: number): void;
        stepUp(n?: number): void;
        select(): void;
    } & {
        files: FileList;
        selectionDirection: "none" | "forward" | "backward";
        selectionEnd: number;
        selectionStart: number;
        valueAsDate: Date;
        valueAsNumber: number;
        height: number;
        formAction: string;
        width: number;
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
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        density: number;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
        _allowedTypes: string[];
    } & {
        type: string;
        elevated: boolean;
        filled: string;
        outlined: boolean;
        icon: string;
        iconInk: string;
        src: string;
        svg: string;
        viewBox: string;
        svgPath: string;
    }, { icon, svg, src, svgPath }?: import("../core/CustomElement.js").default & {
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
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    } & {
        _computedAriaLabel(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
        _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
    } & {
        accept: string;
        alt: string;
        dirName: string;
        _formAction: string;
        formEnctype: string;
        formMethod: string;
        formNoValidate: boolean;
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
    } & {
        _input: HTMLInputElement;
    } & {
        indeterminate: boolean;
    } & {
        controlTagName: string;
    } & {
        _onSetChecked(checked: boolean): void;
        _onSetValue(value: string): void;
    } & {
        performImplicitSubmission(event: Event): void;
        _redispatchControlClickEvent(event: Event): boolean;
        _handleInputClick(event: MouseEvent): void;
    } & {
        setRangeText(replacement: string): void;
        setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
        setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
        showPicker(): void;
        stepDown(n?: number): void;
        stepUp(n?: number): void;
        select(): void;
    } & {
        files: FileList;
        selectionDirection: "none" | "forward" | "backward";
        selectionEnd: number;
        selectionStart: number;
        valueAsDate: Date;
        valueAsNumber: number;
        height: number;
        formAction: string;
        width: number;
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
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        density: number;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
        _allowedTypes: string[];
    } & {
        type: string;
        elevated: boolean;
        filled: string;
        outlined: boolean;
        icon: string;
        iconInk: string;
        src: string;
        svg: string;
        viewBox: string;
        svgPath: string;
    }): string;
    iconVariation(this: import("../core/CustomElement.js").default & {
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
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    } & {
        _computedAriaLabel(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
        _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
    } & {
        accept: string;
        alt: string;
        dirName: string;
        _formAction: string;
        formEnctype: string;
        formMethod: string;
        formNoValidate: boolean;
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
    } & {
        _input: HTMLInputElement;
    } & {
        indeterminate: boolean;
    } & {
        controlTagName: string;
    } & {
        _onSetChecked(checked: boolean): void;
        _onSetValue(value: string): void;
    } & {
        performImplicitSubmission(event: Event): void;
        _redispatchControlClickEvent(event: Event): boolean;
        _handleInputClick(event: MouseEvent): void;
    } & {
        setRangeText(replacement: string): void;
        setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
        setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
        showPicker(): void;
        stepDown(n?: number): void;
        stepUp(n?: number): void;
        select(): void;
    } & {
        files: FileList;
        selectionDirection: "none" | "forward" | "backward";
        selectionEnd: number;
        selectionStart: number;
        valueAsDate: Date;
        valueAsNumber: number;
        height: number;
        formAction: string;
        width: number;
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
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        density: number;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
        _allowedTypes: string[];
    } & {
        type: string;
        elevated: boolean;
        filled: string;
        outlined: boolean;
        icon: string;
        iconInk: string;
        src: string;
        svg: string;
        viewBox: string;
        svgPath: string;
    }, { outlined }?: import("../core/CustomElement.js").default & {
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
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    } & {
        _computedAriaLabel(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
        _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
    } & {
        accept: string;
        alt: string;
        dirName: string;
        _formAction: string;
        formEnctype: string;
        formMethod: string;
        formNoValidate: boolean;
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
    } & {
        _input: HTMLInputElement;
    } & {
        indeterminate: boolean;
    } & {
        controlTagName: string;
    } & {
        _onSetChecked(checked: boolean): void;
        _onSetValue(value: string): void;
    } & {
        performImplicitSubmission(event: Event): void;
        _redispatchControlClickEvent(event: Event): boolean;
        _handleInputClick(event: MouseEvent): void;
    } & {
        setRangeText(replacement: string): void;
        setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
        setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
        showPicker(): void;
        stepDown(n?: number): void;
        stepUp(n?: number): void;
        select(): void;
    } & {
        files: FileList;
        selectionDirection: "none" | "forward" | "backward";
        selectionEnd: number;
        selectionStart: number;
        valueAsDate: Date;
        valueAsNumber: number;
        height: number;
        formAction: string;
        width: number;
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
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        density: number;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
        _allowedTypes: string[];
    } & {
        type: string;
        elevated: boolean;
        filled: string;
        outlined: boolean;
        icon: string;
        iconInk: string;
        src: string;
        svg: string;
        viewBox: string;
        svgPath: string;
    }): string;
}, any[]> & import("../core/CustomElement.js").Class<{
    focus(options?: FocusOptions): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    suggestion: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    iconVariation(this: import("../core/CustomElement.js").default & {
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
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    } & {
        _computedAriaLabel(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
        _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
    } & {
        accept: string;
        alt: string;
        dirName: string;
        _formAction: string;
        formEnctype: string;
        formMethod: string;
        formNoValidate: boolean;
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
    } & {
        _input: HTMLInputElement;
    } & {
        indeterminate: boolean;
    } & {
        controlTagName: string;
    } & {
        _onSetChecked(checked: boolean): void;
        _onSetValue(value: string): void;
    } & {
        performImplicitSubmission(event: Event): void;
        _redispatchControlClickEvent(event: Event): boolean;
        _handleInputClick(event: MouseEvent): void;
    } & {
        setRangeText(replacement: string): void;
        setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
        setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
        showPicker(): void;
        stepDown(n?: number): void;
        stepUp(n?: number): void;
        select(): void;
    } & {
        files: FileList;
        selectionDirection: "none" | "forward" | "backward";
        selectionEnd: number;
        selectionStart: number;
        valueAsDate: Date;
        valueAsNumber: number;
        height: number;
        formAction: string;
        width: number;
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
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        density: number;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
        _allowedTypes: string[];
    } & {
        type: string;
        elevated: boolean;
        filled: string;
        outlined: boolean;
        icon: string;
        iconInk: string;
        src: string;
        svg: string;
        viewBox: string;
        svgPath: string;
    } & {
        hasIcon(this: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }, { icon, svg, src, svgPath }?: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }): string;
        iconVariation(this: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }, { outlined }?: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }): string;
    } & {
        focus(options?: FocusOptions): void;
    } & {
        suggestion: boolean;
    }, { elevated }: import("../core/CustomElement.js").default & {
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
        delegatesFocus: boolean;
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
        _ipcListener: EventListener;
        _ipcTarget: EventTarget;
    } & {
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
        formAssociatedCallback(form: HTMLFormElement): void;
        formIPCEvent(event: CustomEvent<[string, string]>): void;
        formDisabledCallback(disabled: boolean): void;
        formResetCallback(): void;
        formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
        _updateFormAssociatedValue(): void;
    } & {
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        onValueChangingContentAttribute(): void;
        focus(options?: FocusOptions): void;
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        setCustomValidity(error: string): void;
    } & {
        _computedAriaLabel(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
        _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }, { ariaLabel }: import("../core/CustomElement.js").default & {
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        }): string;
    } & {
        accept: string;
        alt: string;
        dirName: string;
        _formAction: string;
        formEnctype: string;
        formMethod: string;
        formNoValidate: boolean;
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
    } & {
        _input: HTMLInputElement;
    } & {
        indeterminate: boolean;
    } & {
        controlTagName: string;
    } & {
        _onSetChecked(checked: boolean): void;
        _onSetValue(value: string): void;
    } & {
        performImplicitSubmission(event: Event): void;
        _redispatchControlClickEvent(event: Event): boolean;
        _handleInputClick(event: MouseEvent): void;
    } & {
        setRangeText(replacement: string): void;
        setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
        setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
        showPicker(): void;
        stepDown(n?: number): void;
        stepUp(n?: number): void;
        select(): void;
    } & {
        files: FileList;
        selectionDirection: "none" | "forward" | "backward";
        selectionEnd: number;
        selectionStart: number;
        valueAsDate: Date;
        valueAsNumber: number;
        height: number;
        formAction: string;
        width: number;
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
        shapeTop: boolean;
        shapeBottom: boolean;
        shapeStart: boolean;
        shapeEnd: boolean;
        shapeStyle: string;
        outlined: boolean;
    } & {
        density: number;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        stateLayer: boolean;
        _allowedTypes: string[];
    } & {
        type: string;
        elevated: boolean;
        filled: string;
        outlined: boolean;
        icon: string;
        iconInk: string;
        src: string;
        svg: string;
        viewBox: string;
        svgPath: string;
    } & {
        hasIcon(this: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }, { icon, svg, src, svgPath }?: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }): string;
        iconVariation(this: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }, { outlined }?: import("../core/CustomElement.js").default & {
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
            delegatesFocus: boolean;
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
            _ipcListener: EventListener;
            _ipcTarget: EventTarget;
        } & {
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
            formAssociatedCallback(form: HTMLFormElement): void;
            formIPCEvent(event: CustomEvent<[string, string]>): void;
            formDisabledCallback(disabled: boolean): void;
            formResetCallback(): void;
            formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
            _updateFormAssociatedValue(): void;
        } & {
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            onValueChangingContentAttribute(): void;
            focus(options?: FocusOptions): void;
            click(): void;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            checkValidity(): boolean;
            reportValidity(): boolean;
            setCustomValidity(error: string): void;
        } & {
            _computedAriaLabel(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel, _slotInnerText }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
            _computedAriaLabelledby(this: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }, { ariaLabel }: import("../core/CustomElement.js").default & {
                delegatesFocus: boolean;
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
                _ipcListener: EventListener;
                _ipcTarget: EventTarget;
            } & {
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
                formAssociatedCallback(form: HTMLFormElement): void;
                formIPCEvent(event: CustomEvent<[string, string]>): void;
                formDisabledCallback(disabled: boolean): void;
                formResetCallback(): void;
                formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
                _updateFormAssociatedValue(): void;
            } & {
                ariaLabel: string;
                _slotInnerText: string;
            } & {
                focusableOnDisabled: boolean;
                controlTagName: string;
                controlVoidElement: boolean;
                _slotMutationObserver: any;
            } & {
                onValueChangingContentAttribute(): void;
                focus(options?: FocusOptions): void;
                click(): void;
            } & {
                stateTargetElement: HTMLElement;
            } & {
                checkValidity(): boolean;
                reportValidity(): boolean;
                setCustomValidity(error: string): void;
            }): string;
        } & {
            accept: string;
            alt: string;
            dirName: string;
            _formAction: string;
            formEnctype: string;
            formMethod: string;
            formNoValidate: boolean;
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
        } & {
            _input: HTMLInputElement;
        } & {
            indeterminate: boolean;
        } & {
            controlTagName: string;
        } & {
            _onSetChecked(checked: boolean): void;
            _onSetValue(value: string): void;
        } & {
            performImplicitSubmission(event: Event): void;
            _redispatchControlClickEvent(event: Event): boolean;
            _handleInputClick(event: MouseEvent): void;
        } & {
            setRangeText(replacement: string): void;
            setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
            setSelectionRange(start: number, end: number, direction?: "none" | "forward" | "backward"): void;
            showPicker(): void;
            stepDown(n?: number): void;
            stepUp(n?: number): void;
            select(): void;
        } & {
            files: FileList;
            selectionDirection: "none" | "forward" | "backward";
            selectionEnd: number;
            selectionStart: number;
            valueAsDate: Date;
            valueAsNumber: number;
            height: number;
            formAction: string;
            width: number;
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
            shapeTop: boolean;
            shapeBottom: boolean;
            shapeStart: boolean;
            shapeEnd: boolean;
            shapeStyle: string;
            outlined: boolean;
        } & {
            density: number;
        } & {
            stateTargetElement: HTMLElement;
        } & {
            stateLayer: boolean;
            _allowedTypes: string[];
        } & {
            type: string;
            elevated: boolean;
            filled: string;
            outlined: boolean;
            icon: string;
            iconInk: string;
            src: string;
            svg: string;
            viewBox: string;
            svgPath: string;
        }): string;
    } & {
        focus(options?: FocusOptions): void;
    } & {
        suggestion: boolean;
    }): string;
}, any[]>;
export default _default;
//# sourceMappingURL=Chip.d.ts.map