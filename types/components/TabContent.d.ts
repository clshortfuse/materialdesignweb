declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    _resizeObserverEnabled: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    onResizeObserved(entry: ResizeObserverEntry): void;
    observeResize(): void;
    unobserveResize(): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * Internal list of `TabPanel` nodes currently assigned to the slot.
     * @type {InstanceType<TabPanel>[]}
     */
    _panelNodes: InstanceType<typeof CustomElement & import("../core/CustomElement.js").Class<{
        _ariaRole: string;
    }, any[]> & import("../core/CustomElement.js").Class<{
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
    }, any[]> & import("../core/CustomElement.js").Class<{
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
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
    }, any[]> & import("../core/CustomElement.js").Class<{
        active: boolean;
        peeking: boolean;
    }, any[]>>[];
    /**
     * Cached metrics for each panel used to determine visibility and
     * which panel is active based on scroll position. Each entry contains
     * `{ left, width, right, center, index }` in pixels.
     * @type {{left:number,width:number,right:number,center:number,index:number}[]|null}
     */
    _panelMetrics: {
        left: number;
        width: number;
        right: number;
        center: number;
        index: number;
    }[] | null;
}, any[]> & import("../core/CustomElement.js").Class<{
    _selectedIndex: number;
}, any[]> & import("../core/CustomElement.js").Class<{
    panels: (CustomElement & {
        _ariaRole: string;
    } & {
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: string;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
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
        _onConnectAriaValues: Map<import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>, ARIAMixin[import("../mixins/AriaReflectorMixin.js").StringKeyOfARIAMixin<keyof ARIAMixin>]>;
    } & {
        readAriaProperty(name: keyof HTMLElement & keyof ElementInternals): string | ShadowRoot | Element | readonly Element[];
        updateAriaProperty<K extends StringKeyOfARIAMixin<keyof ARIAMixin>>(name: K, value: ARIAMixin[K]): void;
    } & {
        block: boolean;
        inline: boolean;
        row: boolean;
        x: string;
        y: string;
        gap: number;
        padding: string;
    } & {
        color: string;
        ink: string;
        typeStyle: string;
    } & {
        _ariaRole: string;
    } & {
        active: boolean;
        peeking: boolean;
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    /** Called when the component observes a resize; clears cached metrics. */
    onResizeObserved(): void;
    /**
     * Recompute which panels are visible based on scroll position and
     * activate the panel whose visible percentage is >= 50%.
     */
    updatePanels(): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=TabContent.d.ts.map