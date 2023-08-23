/** @typedef {import('../components/Ripple.js').default} Ripple */
/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function RippleMixin(Base: ReturnType<typeof import("./StateMixin.js").default>): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    /** @type {WeakRef<InstanceType<Ripple>>} */
    _lastRippleWeakRef: WeakRef<InstanceType<Ripple>>;
    /** Flag set if ripple was added this event loop. */
    _rippleAdded: boolean;
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
    /** @type {WeakRef<InstanceType<Ripple>>} */
    _lastRippleWeakRef: WeakRef<InstanceType<Ripple>>;
    /** Flag set if ripple was added this event loop. */
    _rippleAdded: boolean;
} & {
    _lastRipple: import("../core/CustomElement.js").default & {
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
        _positionStyle: any;
    } & {
        updatePosition(x?: number, y?: number, size?: number): void;
        handleRippleComplete(): void;
    };
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
    /** @type {WeakRef<InstanceType<Ripple>>} */
    _lastRippleWeakRef: WeakRef<InstanceType<Ripple>>;
    /** Flag set if ripple was added this event loop. */
    _rippleAdded: boolean;
} & {
    _lastRipple: import("../core/CustomElement.js").default & {
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
        _positionStyle: any;
    } & {
        updatePosition(x?: number, y?: number, size?: number): void;
        handleRippleComplete(): void;
    };
} & {
    /**
     * @param {number} [x]
     * @param {number} [y]
     * @param {boolean} [hold]
     * @return {InstanceType<Ripple>}
     */
    addRipple(x?: number, y?: number, hold?: boolean): InstanceType<Ripple>;
});
export type Ripple = typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    hadRippleHeld: boolean;
    hadRippleReleased: boolean;
    rippleStarted: boolean;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    _positionStyle: any;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
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
    _positionStyle: any;
} & {
    updatePosition(x?: number, y?: number, size?: number): void;
    handleRippleComplete(): void;
});
import Ripple from '../components/Ripple.js';
//# sourceMappingURL=RippleMixin.d.ts.map