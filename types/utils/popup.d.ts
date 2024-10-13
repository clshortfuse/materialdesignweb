/**
 * @typedef {Object} DOMRectLike
 * @prop {number} left
 * @prop {number} right
 * @prop {number} top
 * @prop {number} bottom
 * @prop {number} width
 * @prop {number} height
 */
/**
 * @typedef {Object} CanAnchorPopUpOptions
 * @prop {Element|DOMRectLike} [anchor]
 * @prop {number|'left'|'center'|'right'} [clientX]
 * @prop {number|'top'|'center'|'bottom'} [clientY]
 * @prop {number} [pageX]
 * @prop {number} [pageY]
 * @prop {Element|{width:number, height:number}} [popup]
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
    styles: {
        top: string;
        bottom: string;
        left: string;
        right: string;
        maxWidth: string;
        maxHeight: string;
        transformOrigin: string;
    };
    anchor?: Element | DOMRectLike;
    clientX?: number | "left" | "center" | "right";
    clientY?: number | "top" | "center" | "bottom";
    pageX?: number;
    pageY?: number;
    popup?: Element | {
        width: number;
        height: number;
    };
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
    directionX?: "left" | "center" | "right";
    directionY?: "up" | "center" | "down";
    force?: boolean;
};
export type DOMRectLike = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
};
export type CanAnchorPopUpOptions = {
    anchor?: Element | DOMRectLike;
    clientX?: number | "left" | "center" | "right";
    clientY?: number | "top" | "center" | "bottom";
    pageX?: number;
    pageY?: number;
    popup?: Element | {
        width: number;
        height: number;
    };
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
    directionX?: "left" | "center" | "right";
    directionY?: "up" | "center" | "down";
    force?: boolean;
};
//# sourceMappingURL=popup.d.ts.map