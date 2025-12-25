/**
 * Adds CSS properties for elevation via shadows or underlighting.
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function ElevationMixin(Base: ReturnType<typeof import("./StateMixin.js").default> & ReturnType<typeof import("./ThemableMixin.js").default>): typeof import("../index.js").CustomElement & import("../core/CustomElement.js").Class<{
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
}, any[]>;
//# sourceMappingURL=ElevationMixin.d.ts.map