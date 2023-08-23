declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @type {InstanceType<TabPanel>[]} */
    _panelNodes: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
        _ariaRole: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _resizeObserverEnabled: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        flex: string;
        x: string;
        y: string;
        gap: number;
        padding: number;
    }, any[]> & import("../core/CustomElement.js").Class<{
        color: string;
        ink: string;
        typeStyle: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        inline: boolean;
        grid: boolean;
        contentPadding: boolean;
        block: boolean;
        columns: number;
        _autoColumns: number;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _resizeObserverEnabled: boolean;
    }, any[]> & import("../core/CustomElement.js").Class<{
        onResizeObserved(entry: ResizeObserverEntry): void;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _computedColumns(this: CustomElement & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            flex: string;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            inline: boolean;
            grid: boolean;
            contentPadding: boolean;
            block: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }, { columns, _autoColumns }: CustomElement & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            flex: string;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            inline: boolean;
            grid: boolean;
            contentPadding: boolean;
            block: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }): string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _ariaRole: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        active: boolean;
        peeking: boolean;
    }, any[]>>[];
    /**
     * @type {{
     *  left:number,
     *  width:number,
     *  right:number,
     *  center: number,
     *  index: number,
     * }[]}
     */
    _panelMetrics: {
        left: number;
        width: number;
        right: number;
        center: number;
        index: number;
    }[];
}, any[]> & import("../core/CustomElement.js").Class<{
    _selectedIndex: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    panels: (CustomElement & {
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    } & {
        flex: string;
        x: string;
        y: string;
        gap: number;
        padding: number;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        inline: boolean;
        grid: boolean;
        contentPadding: boolean;
        block: boolean;
        columns: number;
        _autoColumns: number;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
    } & {
        _computedColumns(this: CustomElement & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            flex: string;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            inline: boolean;
            grid: boolean;
            contentPadding: boolean;
            block: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }, { columns, _autoColumns }: CustomElement & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            flex: string;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            inline: boolean;
            grid: boolean;
            contentPadding: boolean;
            block: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }): string;
    } & {
        _ariaRole: string;
    } & {
        active: boolean;
        peeking: boolean;
    })[];
    panelMetrics: {
        left: number;
        width: number;
        right: number;
        center: number;
        index: number;
    }[];
}, any[]> & import("../core/CustomElement.js").Class<{
    selectedIndex: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    selectedPanel: CustomElement & {
        _ariaRole: string;
    } & {
        onConnectAriaValues: Map<string, string>;
        hasFiredConnected: boolean;
    } & {
        readAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role"): string | ShadowRoot;
        updateAriaProperty(name: "shadowRoot" | "ariaAtomic" | "ariaAutoComplete" | "ariaBusy" | "ariaChecked" | "ariaColCount" | "ariaColIndex" | "ariaColSpan" | "ariaCurrent" | "ariaDisabled" | "ariaExpanded" | "ariaHasPopup" | "ariaHidden" | "ariaInvalid" | "ariaKeyShortcuts" | "ariaLabel" | "ariaLevel" | "ariaLive" | "ariaModal" | "ariaMultiLine" | "ariaMultiSelectable" | "ariaOrientation" | "ariaPlaceholder" | "ariaPosInSet" | "ariaPressed" | "ariaReadOnly" | "ariaRequired" | "ariaRoleDescription" | "ariaRowCount" | "ariaRowIndex" | "ariaRowSpan" | "ariaSelected" | "ariaSetSize" | "ariaSort" | "ariaValueMax" | "ariaValueMin" | "ariaValueNow" | "ariaValueText" | "role", value: string): void;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    } & {
        flex: string;
        x: string;
        y: string;
        gap: number;
        padding: number;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        inline: boolean;
        grid: boolean;
        contentPadding: boolean;
        block: boolean;
        columns: number;
        _autoColumns: number;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
    } & {
        _computedColumns(this: CustomElement & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            flex: string;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            inline: boolean;
            grid: boolean;
            contentPadding: boolean;
            block: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }, { columns, _autoColumns }: CustomElement & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            flex: string;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            inline: boolean;
            grid: boolean;
            contentPadding: boolean;
            block: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }): string;
    } & {
        _ariaRole: string;
    } & {
        active: boolean;
        peeking: boolean;
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(): void;
    updatePanels(): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=TabContent.d.ts.map