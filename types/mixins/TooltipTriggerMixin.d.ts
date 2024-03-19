/** @typedef {import('../components/Tooltip.js').default} Tooltip */
/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function TooltipTriggerMixin(Base: ReturnType<typeof import("./StateMixin.js").default>): typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
    disabled: boolean;
    focused: boolean;
    hovered: boolean;
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
    TOOLTIP_MOUSE_IDLE_MS: number;
    TOOLTIP_TOUCH_IDLE_MS: number;
    /** @type {any} */
    _idleDebounce: any;
    /** @type {HTMLElement[]} */
    _watchedParents: HTMLElement[];
    /** @type {ResizeObserver} */
    _resizeObserver: ResizeObserver;
    /** @type {IntersectionObserver} */
    _intersectObserver: IntersectionObserver;
    _parentScrollListener: any;
    tooltipSlotId: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    tooltip: string;
    autoTooltip: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    cancelShowTooltip(): void;
    /** @param {'mouse'|'touch'|'keyboard'} type */
    scheduleHideTooltip(type: 'mouse' | 'touch' | 'keyboard'): void;
    /** @param {'mouse'|'touch'|'keyboard'} type */
    scheduleShowTooltip(type: 'mouse' | 'touch' | 'keyboard'): void;
    showTooltip(): void;
    hideTooltip(cancelSchedule?: boolean): void;
    /**
     * TODO: Throttle multiple calls
     * @param {DOMRect} [domRect]
     * @return {void}
     */
    updateTooltipPosition(domRect?: DOMRect): void;
    recloneTooltip(): void;
    closeIfNotHovered(): void;
}, any[]>;
export type Tooltip = typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    hasFiredConnected: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDescription" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
    updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDescription" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
    _ariaRole: string; /** @type {any} */
}, any[]> & import("../core/CustomElement.js").Class<{
    open: boolean;
}, any[]>;
//# sourceMappingURL=TooltipTriggerMixin.d.ts.map