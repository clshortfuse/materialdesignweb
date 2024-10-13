declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
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
    color: string;
    ink: string;
    typeStyle: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateLayer: boolean;
    type: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    ticks: string;
    _valueAsText: string;
    thumbLabel: string;
    _roundedValue: number;
    _isHoveringThumb: boolean;
    _lastDispatchedChangeValue: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlMouseOrTouch(event: (MouseEvent | TouchEvent) & {
        currentTarget: HTMLInputElement;
    }): void;
    /** @param {Event} event */
    onLeaveEvent({ currentTarget }: Event): void;
    /**
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlFinish(event: (MouseEvent | TouchEvent) & {
        currentTarget: HTMLInputElement;
    }): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    computeTrackStyle: () => ReturnType<({ ticks, _valueAsText, min, max }: CustomElement & {
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
    } & {
        _useFormImplicitSubmission: boolean;
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
        setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none"): void;
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
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        stateLayer: boolean;
        type: string;
    } & {
        ticks: string;
        _valueAsText: string;
        thumbLabel: string;
        _roundedValue: number;
        _isHoveringThumb: boolean;
        _lastDispatchedChangeValue: string;
    } & {
        /**
         * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
         * @return {void}
         */
        onControlMouseOrTouch(event: (MouseEvent | TouchEvent) & {
            currentTarget: HTMLInputElement;
        }): void;
        /** @param {Event} event */
        onLeaveEvent({ currentTarget }: Event): void;
        /**
         * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
         * @return {void}
         */
        onControlFinish(event: (MouseEvent | TouchEvent) & {
            currentTarget: HTMLInputElement;
        }): void;
    }) => string>;
    _thumbLabelHidden: never;
    _computedThumbLabel: never;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Slider.d.ts.map