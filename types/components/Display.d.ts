declare const _default: typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    textTrim: boolean;
    textPadding: string;
    textPaddingTop: string;
    textLeading: string;
    textPaddingBottom: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _computedTextPaddingTop: string;
    _computedTextPaddingBottom: string;
    _computedTextLeading: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _beforeStyle: string;
    _afterStyle: string;
    _hostStyle: "" | ":host{margin-block:-1em}";
}, any[]> & import("../core/CustomElement.js").Class<{
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
    block: boolean;
    inline: boolean;
    row: boolean;
    x: string;
    y: string;
    gap: number;
    padding: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    color: string;
    ink: string;
    typeStyle: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    grid: boolean;
    columns: number;
    _autoColumns: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _computedColumns(this: import("../core/CustomElement.js").default & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: number;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        grid: boolean;
        columns: number;
        _autoColumns: number;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
    }, { columns, _autoColumns }: import("../core/CustomElement.js").default & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: number;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        grid: boolean;
        columns: number;
        _autoColumns: number;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
    }): string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _isFlex(this: import("../core/CustomElement.js").default & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: number;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        grid: boolean;
        columns: number;
        _autoColumns: number;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
    } & {
        _computedColumns(this: import("../core/CustomElement.js").default & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            block: boolean;
            inline: boolean;
            row: boolean;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            grid: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }, { columns, _autoColumns }: import("../core/CustomElement.js").default & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            block: boolean;
            inline: boolean;
            row: boolean;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            grid: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }): string;
    }, { block, grid }: import("../core/CustomElement.js").default & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
        observeResize(): void;
        unobserveResize(): void;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: number;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        grid: boolean;
        columns: number;
        _autoColumns: number;
    } & {
        _resizeObserverEnabled: boolean;
    } & {
        onResizeObserved(entry: ResizeObserverEntry): void;
    } & {
        _computedColumns(this: import("../core/CustomElement.js").default & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            block: boolean;
            inline: boolean;
            row: boolean;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            grid: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }, { columns, _autoColumns }: import("../core/CustomElement.js").default & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
            observeResize(): void;
            unobserveResize(): void;
        } & {
            block: boolean;
            inline: boolean;
            row: boolean;
            x: string;
            y: string;
            gap: number;
            padding: number;
        } & {
            color: string;
            ink: string;
            typeStyle: string;
        } & {
            grid: boolean;
            columns: number;
            _autoColumns: number;
        } & {
            _resizeObserverEnabled: boolean;
        } & {
            onResizeObserved(entry: ResizeObserverEntry): void;
        }): string;
    }): boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _ariaRole: string;
    _baseAriaLevel: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    ariaLevel: string;
    size: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _computedAriaLevel: string;
}, any[]>;
export default _default;
//# sourceMappingURL=Display.d.ts.map