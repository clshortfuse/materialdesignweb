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
    computePlaceholder: () => ReturnType<({ filled, outlined, label, placeholder }: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
        delegatesFocus: boolean;
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
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        _onControlValue(value: string): void;
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
        _computedAriaLabel: string;
    } & {
        _computedAriaLabelledby: never;
    } & {
        stateLayer: boolean;
    } & {
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
    } & {
        erroredState: boolean;
    }) => string>;
    shouldShowSupporting: () => ReturnType<({ erroredState, supporting }: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
        delegatesFocus: boolean;
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
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        _onControlValue(value: string): void;
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
        _computedAriaLabel: string;
    } & {
        _computedAriaLabelledby: never;
    } & {
        stateLayer: boolean;
    } & {
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
    } & {
        erroredState: boolean;
    }) => boolean>;
    computeSupportingText: () => ReturnType<({ error, erroredState, _validationMessage, supporting }: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
        delegatesFocus: boolean;
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
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        _onControlValue(value: string): void;
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
        _computedAriaLabel: string;
    } & {
        _computedAriaLabelledby: never;
    } & {
        stateLayer: boolean;
    } & {
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
    } & {
        erroredState: boolean;
    }) => string>;
    populatedState: () => ReturnType<({ value, _badInput }: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
        delegatesFocus: boolean;
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
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        _onControlValue(value: string): void;
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
        _computedAriaLabel: string;
    } & {
        _computedAriaLabelledby: never;
    } & {
        stateLayer: boolean;
    } & {
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
    } & {
        erroredState: boolean;
    }) => boolean>;
    _showLabelText: never;
}, any[]> & import("../core/CustomElement.js").Class<{
    _shapeShapeTop: never;
    computedIconVariation: () => ReturnType<({ iconVariation, outlined }: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
        delegatesFocus: boolean;
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
        ariaLabel: string;
        _slotInnerText: string;
    } & {
        focusableOnDisabled: boolean;
        controlTagName: string;
        controlVoidElement: boolean;
        _slotMutationObserver: any;
    } & {
        _onControlValue(value: string): void;
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
        _computedAriaLabel: string;
    } & {
        _computedAriaLabelledby: never;
    } & {
        stateLayer: boolean;
    } & {
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
    } & {
        erroredState: boolean;
    } & {
        computePlaceholder: () => ReturnType<({ filled, outlined, label, placeholder }: CustomElement & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
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
            delegatesFocus: boolean;
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
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            _onControlValue(value: string): void;
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
            _computedAriaLabel: string;
        } & {
            _computedAriaLabelledby: never;
        } & {
            stateLayer: boolean;
        } & {
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
        } & {
            erroredState: boolean;
        }) => string>;
        shouldShowSupporting: () => ReturnType<({ erroredState, supporting }: CustomElement & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
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
            delegatesFocus: boolean;
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
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            _onControlValue(value: string): void;
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
            _computedAriaLabel: string;
        } & {
            _computedAriaLabelledby: never;
        } & {
            stateLayer: boolean;
        } & {
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
        } & {
            erroredState: boolean;
        }) => boolean>;
        computeSupportingText: () => ReturnType<({ error, erroredState, _validationMessage, supporting }: CustomElement & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
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
            delegatesFocus: boolean;
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
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            _onControlValue(value: string): void;
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
            _computedAriaLabel: string;
        } & {
            _computedAriaLabelledby: never;
        } & {
            stateLayer: boolean;
        } & {
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
        } & {
            erroredState: boolean;
        }) => string>;
        populatedState: () => ReturnType<({ value, _badInput }: CustomElement & {
            disabled: boolean;
            focused: boolean;
            hovered: boolean;
            pressed: boolean;
            _lastInteraction: "key" | "mouse" | "touch" | "pen";
            _hovered: boolean;
            _focused: boolean;
            _focusedSynthetic: boolean;
            _keyPressed: boolean;
            _keyReleased: boolean;
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
            delegatesFocus: boolean;
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
            ariaLabel: string;
            _slotInnerText: string;
        } & {
            focusableOnDisabled: boolean;
            controlTagName: string;
            controlVoidElement: boolean;
            _slotMutationObserver: any;
        } & {
            _onControlValue(value: string): void;
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
            _computedAriaLabel: string;
        } & {
            _computedAriaLabelledby: never;
        } & {
            stateLayer: boolean;
        } & {
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
        } & {
            erroredState: boolean;
        }) => boolean>;
        _showLabelText: never;
    }) => string>;
}, any[]> & import("../core/CustomElement.js").Class<{
    supportsCSSLineHeightUnit: boolean;
    type: string;
    _resizing: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    controlTagName: string;
    controlVoidElement: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    fixed: boolean;
    minRows: number;
    maxRows: number;
    _lineHeight: string;
    cols: number;
    dirName: string;
    maxLength: number;
    minLength: number;
    placeholder: string;
    rows: number;
    wrap: string;
    defaultValueAttr: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _textarea: HTMLTextAreaElement;
}, any[]> & import("../core/CustomElement.js").Class<{
    defaultValue: string;
    textLength: number;
    select: () => void;
    selectionDirection: "none" | "forward" | "backward";
    selectionStart: number;
    selectionEnd: number;
    setRangeText: {
        (replacement: string): void;
        (replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
    };
    setSelectionRange: (start: number | null, end: number | null, direction?: "forward" | "backward" | "none") => void;
}, any[]> & import("../core/CustomElement.js").Class<{
    resize(): void;
    onResizeObserved(): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=TextArea.d.ts.map