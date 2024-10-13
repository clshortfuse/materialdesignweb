/** @typedef {import('../components/Ripple.js').default} Ripple */
/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function RippleMixin(Base: ReturnType<typeof import("./StateMixin.js").default>): typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
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
    /** @type {WeakRef<InstanceType<Ripple>>} */
    _lastRippleWeakRef: WeakRef<InstanceType<Ripple>>;
    /** Flag set if ripple was added this event loop. */
    _rippleAdded: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
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
}, any[]> & import("../core/CustomElement.js").Class<{
    /**
     * @param {number} [x]
     * @param {number} [y]
     * @param {boolean} [hold]
     * @return {InstanceType<Ripple>}
     */
    addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
}, any[]>;
export type Ripple = typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
    hadRippleHeld: boolean;
    hadRippleReleased: boolean;
    rippleStarted: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    rippleState: string;
    keepAlive: boolean;
    _positionX: number;
    _positionY: number;
    _radius: number;
    holdRipple: boolean;
}, any[]> & import("../core/CustomElement.js").Class<{
    _positionStyle: import("../core/customTypes.js").ElementStylerOptions | {
        styles: {
            minHeight: string;
            minWidth: string;
            boxShadow: string;
            top: string;
            left: string;
        };
    };
}, any[]> & import("../core/CustomElement.js").Class<{
    updatePosition(x?: number, y?: number, size?: number): void;
    handleRippleComplete(): void;
}, any[]>;
//# sourceMappingURL=RippleMixin.d.ts.map