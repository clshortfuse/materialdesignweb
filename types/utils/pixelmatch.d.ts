/**
 * @param {Uint8Array|Uint8ClampedArray} img1
 * @param {Uint8Array|Uint8ClampedArray} img2
 * @param {Uint8Array|Uint8ClampedArray} output
 * @param {number} width
 * @param {number} height
 * @param {typeof DEFAULT_OPTIONS} [options]
 * @return {number}
 */
export function pixelmatch(img1: Uint8Array | Uint8ClampedArray, img2: Uint8Array | Uint8ClampedArray, output: Uint8Array | Uint8ClampedArray, width: number, height: number, options?: typeof DEFAULT_OPTIONS): number;
type DEFAULT_OPTIONS = Object;
declare namespace DEFAULT_OPTIONS {
    let threshold: number;
    let includeAA: boolean;
    let alpha: number;
    let aaColor: number[];
    let diffColor: number[];
    let diffColorAlt: Array<number>;
    let diffMask: boolean;
}
export {};
//# sourceMappingURL=pixelmatch.d.ts.map