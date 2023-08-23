declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
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
    /**
     * @param {number} [x] offsetX
     * @param {number} [y] offsetY
     * @param {number} [size]
     * @return {void}
     */
    updatePosition(x?: number, y?: number, size?: number): void;
    handleRippleComplete(): void;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Ripple.d.ts.map