/**
 * @typedef {Object} CanAnchorPopUpOptions
 * @prop {Element|DOMRect} [anchor]
 * @prop {number|'left'|'center'|'right'} [clientX]
 * @prop {number|'top'|'center'|'bottom'} [clientY]
 * @prop {number} [pageX]
 * @prop {number} [pageY]
 * @prop {Element|DOMRect} [popup]
 * @prop {number} [width]
 * @prop {number} [height]
 * @prop {number} [offsetX] Offset from anchor
 * @prop {number} [offsetY] Offset from anchor
 * @prop {number} [margin] Margin from page
 * @prop {'left'|'center'|'right'} [directionX='right']
 * @prop {'up'|'center'|'down'} [directionY='down']
 * @prop {boolean} [force=false]
 */
/** @param {CanAnchorPopUpOptions} options */
export function canAnchorPopup(options: CanAnchorPopUpOptions): {
    top: number;
    right: number;
    bottom: number;
    left: number;
    visibility: number;
    transformOriginX: string;
    transformOriginY: string;
    anchor?: Element | DOMRect;
    clientX?: number | 'left' | 'center' | 'right';
    clientY?: number | 'top' | 'center' | 'bottom';
    pageX?: number;
    pageY?: number;
    popup?: Element | DOMRect;
    width?: number;
    height?: number;
    /**
     * Offset from anchor
     */
    offsetX?: number;
    /**
     * Offset from anchor
     */
    offsetY?: number;
    /**
     * Margin from page
     */
    margin?: number;
    directionX?: 'left' | 'center' | 'right';
    directionY?: 'up' | 'center' | 'down';
    force?: boolean;
};
export type CanAnchorPopUpOptions = {
    anchor?: Element | DOMRect;
    clientX?: number | 'left' | 'center' | 'right';
    clientY?: number | 'top' | 'center' | 'bottom';
    pageX?: number;
    pageY?: number;
    popup?: Element | DOMRect;
    width?: number;
    height?: number;
    /**
     * Offset from anchor
     */
    offsetX?: number;
    /**
     * Offset from anchor
     */
    offsetY?: number;
    /**
     * Margin from page
     */
    margin?: number;
    directionX?: 'left' | 'center' | 'right';
    directionY?: 'up' | 'center' | 'down';
    force?: boolean;
};
//# sourceMappingURL=popup.d.ts.map