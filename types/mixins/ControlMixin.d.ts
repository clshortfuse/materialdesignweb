/** @typedef {import('../core/CustomElement.js').default} CustomElement */
/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */
/** @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} HTMLControlElement */
/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function ControlMixin(Base: ReturnType<typeof import("./StateMixin.js").default>): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    delegatesFocus: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
} & {
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & {
    formAssociated: true;
} & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /** @type {HTMLElement['focus']} */
    focus(options?: FocusOptions): void;
    /** Redirect click requests to control itself */
    click(): void;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /** @type {HTMLElement['focus']} */
    focus(options?: FocusOptions): void;
    /** Redirect click requests to control itself */
    click(): void;
} & {
    stateTargetElement: HTMLElement;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /** @type {HTMLElement['focus']} */
    focus(options?: FocusOptions): void;
    /** Redirect click requests to control itself */
    click(): void;
} & {
    stateTargetElement: HTMLElement;
} & {
    checkValidity(): boolean;
    reportValidity(): boolean;
    /**
     * @param {string} error
     * @return {void}
     */
    setCustomValidity(error: string): void;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /** @type {HTMLElement['focus']} */
    focus(options?: FocusOptions): void;
    /** Redirect click requests to control itself */
    click(): void;
} & {
    stateTargetElement: HTMLElement;
} & {
    checkValidity(): boolean;
    reportValidity(): boolean;
    /**
     * @param {string} error
     * @return {void}
     */
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
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
        /** Redirect click requests to control itself */
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        /**
         * @param {string} error
         * @return {void}
         */
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
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
        /** Redirect click requests to control itself */
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        /**
         * @param {string} error
         * @return {void}
         */
        setCustomValidity(error: string): void;
    } & T2): string;
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
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
        /** Redirect click requests to control itself */
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        /**
         * @param {string} error
         * @return {void}
         */
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
        /** @type {HTMLElement['focus']} */
        focus(options?: FocusOptions): void;
        /** Redirect click requests to control itself */
        click(): void;
    } & {
        stateTargetElement: HTMLElement;
    } & {
        checkValidity(): boolean;
        reportValidity(): boolean;
        /**
         * @param {string} error
         * @return {void}
         */
        setCustomValidity(error: string): void;
    } & T2): string;
});
export type CustomElement = import('../core/CustomElement.js').default;
export type DeprecatedHTMLInputElementProperties = 'align' | 'useMap';
export type HTMLControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
//# sourceMappingURL=ControlMixin.d.ts.map