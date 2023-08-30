declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerPositionX: number;
    _scrollListenerPositionY: number;
    _scrollListenerLastIdle: number;
    _scrollListenerLastScroll: number;
    _scrollListenerLastResize: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scroller: WeakRef<EventTarget>;
    _scrollerScrollListener: EventListener;
    _scrollerResizeListener: EventListener;
    _scrollDebounce: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerOnScrollIdle(): void;
    _scrollListenerOnScrollerScroll(event: Event): void;
    _scrollListenerOnScrollerResize(event: Event): void;
    startScrollListener(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScroller: HTMLElement | Window;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerScrollerScrollHeight: any;
    _scrollListenerScrollerClientHeight: any;
}, any[]> & import("../core/CustomElement.js").Class<{
    _scrollListenerClear(scroller?: EventTarget): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _semiStickyHeight: number;
    _semiStickyOffsetY: number;
    _semiStickyTranslateY: number;
    _semiStickyDuration: number;
    _semiStickyEasing: string;
    _semiStickyMeasured: boolean;
    stickyAlways: boolean;
    stickyParent: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _refreshSemiStickyMetrics(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            transform: string;
        };
        timing: {
            duration: number;
            easing: string;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    onConnectAriaValues: Map<string, string>;
    /**
     * Top App Bars should have a background-color that is identical to
     * `transparent`, though an explicit value allows updating the environment's
     * to match the app bar (eg: color system bar).
     *
     * Top corners are shaped when not scrolling to allow matching with pane, but
     * removed when raised
     */
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
    ariaOrientationDefault: string;
    _ariaRole: string;
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
    _raised: boolean;
    _headlineOpacity: number;
    headline: string;
    size: "small" | "medium" | "large";
    color: string;
    raisedColor: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _styles: string;
    _headlineStyle: import("../core/customTypes.js").ElementStylerOptions | {
        target: string;
        styles: {
            opacity: number;
        };
        timing: {
            duration: number;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    _companionIf({ size }: CustomElement & {
        delegatesFocus: boolean;
    } & {
        _scrollListenerPositionX: number;
        _scrollListenerPositionY: number;
        _scrollListenerLastIdle: number;
        _scrollListenerLastScroll: number;
        _scrollListenerLastResize: number;
    } & {
        _scroller: WeakRef<EventTarget>;
        _scrollerScrollListener: EventListener;
        _scrollerResizeListener: EventListener;
        _scrollDebounce: any;
    } & {
        _scrollListenerOnScrollIdle(): void;
        _scrollListenerOnScrollerScroll(event: Event): void;
        _scrollListenerOnScrollerResize(event: Event): void;
        startScrollListener(scroller?: EventTarget): boolean;
    } & {
        _scrollListenerScroller: HTMLElement | Window;
    } & {
        _scrollListenerScrollerScrollHeight: any;
        _scrollListenerScrollerClientHeight: any;
    } & {
        _scrollListenerClear(scroller?: EventTarget): boolean;
    } & {
        _semiStickyHeight: number;
        _semiStickyOffsetY: number;
        _semiStickyTranslateY: number;
        _semiStickyDuration: number;
        _semiStickyEasing: string;
        _semiStickyMeasured: boolean;
        stickyAlways: boolean;
        stickyParent: boolean;
    } & {
        _refreshSemiStickyMetrics(): void;
    } & {
        _semiStickyStyleStyle: import("../core/customTypes.js").ElementStylerOptions | {
            styles: {
                transform: string;
            };
            timing: {
                duration: number;
                easing: string;
            };
        };
    } & {
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        /**
         * Top App Bars should have a background-color that is identical to
         * `transparent`, though an explicit value allows updating the environment's
         * to match the app bar (eg: color system bar).
         *
         * Top corners are shaped when not scrolling to allow matching with pane, but
         * removed when raised
         */
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
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
        ariaOrientationDefault: string;
        _ariaRole: string;
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
        _raised: boolean;
        _headlineOpacity: number;
        headline: string;
        size: "small" | "medium" | "large";
        color: string;
        raisedColor: string;
    } & {
        _styles: string;
        _headlineStyle: import("../core/customTypes.js").ElementStylerOptions | {
            target: string;
            styles: {
                opacity: number;
            };
            timing: {
                duration: number;
            };
        };
    }): boolean;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=TopAppBar.d.ts.map