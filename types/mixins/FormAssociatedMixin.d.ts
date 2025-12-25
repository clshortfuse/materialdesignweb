/**
 * Implements form-associated element behavior (internals, validity, files, value handling).
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function FormAssociatedMixin(Base: ReturnType<typeof import("./StateMixin.js").default>): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
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
    /** @type {EventListener} */
    _ipcListener: EventListener;
    /** @type {EventTarget} */
    _ipcTarget: EventTarget;
    /** @type {FileList} */
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
    /**
     * Default behavior should likely be overridden
     * @param {string} value
     */
    _onSetValue(value: string): void;
    /**
     * Default behavior should likely be overridden
     * @param {boolean} checked
     */
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
    /**
     * @param {string} error
     * @return {void}
     */
    setCustomValidity(error: string): void;
    /**
     * @param {string} key
     * @param {string} value
     * @return {void}
     */
    _notifyRadioChange(key: string, value: string): void;
    refreshFormAssociation(): void;
    /**
     * New lifecycle callback. This is called when association with
     * <form> is changed.
     * @param {HTMLFormElement?} form
     * @return {void}
     */
    formAssociatedCallback(form: HTMLFormElement | null): void;
    /**
     * @param {CustomEvent<[string, string]>} event
     * @return {void}
     */
    formIPCEvent(event: CustomEvent<[string, string]>): void;
    /** @param {boolean} disabled */
    formDisabledCallback(disabled: boolean): void;
    formResetCallback(): void;
    /**
     * @param {string|FormData} state
     * @param {'autocomplete'|'restore'} mode
     */
    formStateRestoreCallback(state: string | FormData, mode: "autocomplete" | "restore"): void;
    _updateFormAssociatedValue(): void;
}, any[]>;
export type HTMLControlElement = HTMLElement & {
    value: string;
};
export type CustomElement = import("../core/CustomElement.js").default;
//# sourceMappingURL=FormAssociatedMixin.d.ts.map