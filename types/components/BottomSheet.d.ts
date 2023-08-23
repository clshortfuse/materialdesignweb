declare const _default: typeof CustomElement & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}) & (new (...args: any[]) => CustomElement & {
    delegatesFocus: boolean;
}) & (new (...args: any[]) => CustomElement & {
    _ariaRole: string;
}) & (new (...args: any[]) => CustomElement & {
    _ariaRole: string;
} & {
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}) & (new (...args: any[]) => CustomElement & {
    _ariaRole: string;
} & {
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
} & {
    readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
    updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
}) & (new (...args: any[]) => CustomElement & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
}) & (new (...args: any[]) => CustomElement & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
    _pointerPressed: boolean;
    stateLayer: boolean;
} & {
    disabledState: boolean;
    hoveredState: boolean;
    focusedState: boolean;
    pressedState: boolean;
    touchedState: boolean;
    pointedState: boolean;
}) & (new (...args: any[]) => CustomElement & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
}) & (new (...args: any[]) => CustomElement & {
    color: string;
    ink: string;
    typeStyle: string;
}) & (new (...args: any[]) => CustomElement & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
}) & (new (...args: any[]) => CustomElement & {
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
}) & (new (...args: any[]) => CustomElement & {
    color: string;
    ink: string;
    typeStyle: string;
}) & (new (...args: any[]) => CustomElement & {
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
} & {
    color: string;
    ink: string;
    typeStyle: string;
}) & (new (...args: any[]) => CustomElement & {
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
    _lastInteraction: "key" | "mouse" | "touch" | "pen";
    _hovered: boolean;
    _focused: boolean;
    _focusedSynthetic: boolean;
    _keyPressed: boolean;
    _keyReleased: boolean;
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
}) & (new (...args: any[]) => CustomElement & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
}) & (new (...args: any[]) => CustomElement & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
} & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
} & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
} & {
    shapeTop: boolean;
    modal: boolean;
    open: boolean;
    expanded: boolean;
    _lastComputedBlockSize: number;
    _lastOffsetTop: number;
    _animationDuration: number;
    _animationEasing: string;
    _translateY: string;
    _lastChildScrollTime: number;
    _ariaValueNow: number;
    dragHandle: boolean;
    onopen: any;
    onclose: any;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
} & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
} & {
    shapeTop: boolean;
    modal: boolean;
    open: boolean;
    expanded: boolean;
    _lastComputedBlockSize: number;
    _lastOffsetTop: number;
    _animationDuration: number;
    _animationEasing: string;
    _translateY: string;
    _lastChildScrollTime: number;
    _ariaValueNow: number;
    dragHandle: boolean;
    onopen: any;
    onclose: any;
} & {
    _hasCheckedResize: boolean;
    /** @type {InstanceType<Scrim>} */
    _scrim: InstanceType<typeof CustomElement & (new (...args: any[]) => CustomElement & {
        hidden: boolean;
    })>;
    _dragTimestamp: number;
    /** @type {number} */
    _dragDeltaY: number;
    /** @type {number} */
    _dragStartY: number;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
} & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
} & {
    shapeTop: boolean;
    modal: boolean;
    open: boolean;
    expanded: boolean;
    _lastComputedBlockSize: number;
    _lastOffsetTop: number;
    _animationDuration: number;
    _animationEasing: string;
    _translateY: string;
    _lastChildScrollTime: number;
    _ariaValueNow: number;
    dragHandle: boolean;
    onopen: any;
    onclose: any;
} & {
    _hasCheckedResize: boolean;
    /** @type {InstanceType<Scrim>} */
    _scrim: InstanceType<typeof CustomElement & (new (...args: any[]) => CustomElement & {
        hidden: boolean;
    })>;
    _dragTimestamp: number;
    /** @type {number} */
    _dragDeltaY: number;
    /** @type {number} */
    _dragStartY: number;
} & {
    hostStyles: any;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
} & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
} & {
    shapeTop: boolean;
    modal: boolean;
    open: boolean;
    expanded: boolean;
    _lastComputedBlockSize: number;
    _lastOffsetTop: number;
    _animationDuration: number;
    _animationEasing: string;
    _translateY: string;
    _lastChildScrollTime: number;
    _ariaValueNow: number;
    dragHandle: boolean;
    onopen: any;
    onclose: any;
} & {
    _hasCheckedResize: boolean;
    /** @type {InstanceType<Scrim>} */
    _scrim: InstanceType<typeof CustomElement & (new (...args: any[]) => CustomElement & {
        hidden: boolean;
    })>;
    _dragTimestamp: number;
    /** @type {number} */
    _dragDeltaY: number;
    /** @type {number} */
    _dragStartY: number;
} & {
    hostStyles: any;
} & {
    checkForScrim(animate?: boolean): void;
    checkDragFinished(): void;
    /** @param {PointerEvent} event */
    onDragHandleActive(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onDragHandleInactive(event: PointerEvent): void;
    /** @param {PointerEvent|TouchEvent} event */
    onPointerOrTouchMove(event: PointerEvent | TouchEvent): void;
}) & (new (...args: any[]) => CustomElement & {
    _resizeObserverEnabled: boolean;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
} & {
    delegatesFocus: boolean;
} & {
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
    stateTargetElement: CustomElement & {
        disabled: boolean;
        focused: boolean;
        hovered: boolean;
        pressed: boolean;
        _lastInteraction: "key" | "mouse" | "touch" | "pen";
        _hovered: boolean;
        _focused: boolean;
        _focusedSynthetic: boolean;
        _keyPressed: boolean;
        _keyReleased: boolean;
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
    flex: string;
    x: string;
    y: string;
    gap: number;
    padding: number;
} & {
    shapeTop: boolean;
    modal: boolean;
    open: boolean;
    expanded: boolean;
    _lastComputedBlockSize: number;
    _lastOffsetTop: number;
    _animationDuration: number;
    _animationEasing: string;
    _translateY: string;
    _lastChildScrollTime: number;
    _ariaValueNow: number;
    dragHandle: boolean;
    onopen: any;
    onclose: any;
} & {
    _hasCheckedResize: boolean;
    /** @type {InstanceType<Scrim>} */
    _scrim: InstanceType<typeof CustomElement & (new (...args: any[]) => CustomElement & {
        hidden: boolean;
    })>;
    _dragTimestamp: number;
    /** @type {number} */
    _dragDeltaY: number;
    /** @type {number} */
    _dragStartY: number;
} & {
    hostStyles: any;
} & {
    checkForScrim(animate?: boolean): void;
    checkDragFinished(): void;
    /** @param {PointerEvent} event */
    onDragHandleActive(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onDragHandleInactive(event: PointerEvent): void;
    /** @param {PointerEvent|TouchEvent} event */
    onPointerOrTouchMove(event: PointerEvent | TouchEvent): void;
} & {
    onResizeObserved(entry: ResizeObserverEntry): void;
});
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=BottomSheet.d.ts.map