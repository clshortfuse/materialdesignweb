declare const _default: typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
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
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
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
    /** ARIA role applied to the host element (default: 'listbox'). */
    _ariaRole: string;
    /**
     * Lazily-constructed options collection proxy exposing `add`, indexed
     * access, and other `HTMLOptionsCollection` semantics.
     * @type {HTMLCollectionOf<InstanceType<typeof ListOption>> & HTMLOptionsCollection}
     */
    _optionsCollection: HTMLCollectionOf<InstanceType<typeof ListOption>> & HTMLOptionsCollection;
    /** Cached collection of selected options (HTMLCollection). */
    _selectedOptionsCollection: any;
    /** Internal guard to avoid reentrant selectedness updates. */
    _handlingSelectedness: boolean;
    /** When true, form resets are honored; toggled when form association changes. */
    _handleFormReset: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    options: HTMLCollectionOf<import("../index.js").CustomElement & {
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
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
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
    selectedOptions: HTMLCollectionOf<import("../index.js").CustomElement & {
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
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
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
    selectedIndex: number;
    value: string;
    add: (element: HTMLOptionElement | HTMLOptGroupElement, before?: HTMLElement | number | null) => void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _selectedOptionsGenerator(): Generator<import("../index.js").CustomElement & {
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
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
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
    [Symbol.iterator](): Generator<import("../index.js").CustomElement & {
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
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
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
    /**
     * @param {number} index
     * @return {InstanceType<typeof ListOption>|null}
     */
    item(index: number): InstanceType<typeof ListOption> | null;
    /**
     * @param {string} name ID of ListOption
     * @return {InstanceType<typeof ListOption>|null}
     */
    namedItem(name: string): InstanceType<typeof ListOption> | null;
    /** @param {Event} event */
    onListboxClick(event: Event): void;
}, any[]>;
export default _default;
import ListOption from './ListOption.js';
//# sourceMappingURL=Listbox.d.ts.map