declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    delegatesFocus: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    href: string;
    target: string;
    download: string;
    ping: string;
    rel: string;
    hreflang: string;
    referrerPolicy: string;
}, any[]> & import("../core/CustomElement.js").Class<{
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
}, any[]> & import("../core/CustomElement.js").Class<object, any[]> & import("../core/CustomElement.js").Class<{
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
    _lastRippleWeakRef: WeakRef<CustomElement & {
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
    }>;
    _rippleAdded: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _lastRipple: CustomElement & {
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
}, any[]> & import("../core/CustomElement.js").Class<{
    addRipple(x?: number, y?: number, hold?: boolean): CustomElement & {
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
}, any[]> & import("../core/CustomElement.js").Class<{
    color: string;
    ink: string;
    typeStyle: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    stateLayer: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    showLabel: string;
    active: boolean;
    icon: string;
    src: string;
    badge: string;
    ariaLabel: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** @type {HTMLElement['focus']} */
    focus(options?: FocusOptions): void;
}, any[]> & import("../core/CustomElement.js").Class<{
    _anchorAriaCurrent: never;
    _anchorAriaLabelledby: never;
    _anchorHref: never;
    iconVariation: () => string;
}, any[]>;
export default _default;
export type DeprecatedHTMLAnchorElementProperties = 'charset' | 'coords' | 'name' | 'shape';
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=NavItem.d.ts.map