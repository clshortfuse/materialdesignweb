declare const _default: typeof CustomElement & (new (...args: any[]) => CustomElement & {
    hadRippleHeld: boolean;
    hadRippleReleased: boolean;
    rippleStarted: boolean;
}) & (new (...args: any[]) => CustomElement & {
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
}) & (new (...args: any[]) => CustomElement & {
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
}) & (new (...args: any[]) => CustomElement & {
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
    /**
     * @param {number} [x] offsetX
     * @param {number} [y] offsetY
     * @param {number} [size]
     * @return {void}
     */
    updatePosition(x?: number, y?: number, size?: number): void;
    handleRippleComplete(): void;
});
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Ripple.d.ts.map