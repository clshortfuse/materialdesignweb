/**
 * CAM16, a color appearance model. Colors are not just defined by their hex
 * code, but rather, a hex code and viewing conditions.
 *
 * CAM16 instances also have coordinates in the CAM16-UCS space, called J*, a*,
 * b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
 * specification, and should be used when measuring distances between colors.
 *
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 */
export default class Cam16 {
    /**
     * @param {number} argb ARGB representation of a color.
     * @return {Cam16} CAM16 color, assuming the color was viewed in default viewing
     *     conditions.
     */
    static fromInt(argb: number): Cam16;
    /**
     * @param {number} argb ARGB representation of a color.
     * @param {ViewingConditions} viewingConditions Information about the environment where the color
     *     was observed.
     * @return {Cam16} CAM16 color.
     */
    static fromIntInViewingConditions(argb: number, viewingConditions: ViewingConditions): Cam16;
    /**
     * @param {number} j CAM16 lightness
     * @param {number} c CAM16 chroma
     * @param {number} h CAM16 hue
     * @return {Cam16}
     */
    static fromJch(j: number, c: number, h: number): Cam16;
    /**
     * @param {number} j CAM16 lightness
     * @param {number} c CAM16 chroma
     * @param {number} h CAM16 hue
     * @param {ViewingConditions} viewingConditions Information about the environment where the color
     *     was observed.
     */
    static fromJchInViewingConditions(j: number, c: number, h: number, viewingConditions: ViewingConditions): Cam16;
    /**
     * @param {number} jstar CAM16-UCS lightness.
     * @param {number} astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param {number} bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     * @return {Cam16}
     */
    static fromUcs(jstar: number, astar: number, bstar: number): Cam16;
    /**
     * @param {number} jstar CAM16-UCS lightness.
     * @param {number} astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param {number} bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     * @param {ViewingConditions} viewingConditions Information about the environment where the color
     *     was observed.
     */
    static fromUcsInViewingConditions(jstar: number, astar: number, bstar: number, viewingConditions: ViewingConditions): Cam16;
    /**
     * Given color expressed in XYZ and viewed in [viewingConditions], convert to
     * CAM16.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {ViewingConditions} viewingConditions
     * @return {Cam16}
     */
    static fromXyzInViewingConditions(x: number, y: number, z: number, viewingConditions: ViewingConditions): Cam16;
    /**
     * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
     * the following combinations:
     *      -  {j or q} and {c, m, or s} and hue
     *      - jstar, astar, bstar
     * Prefer using a static method that constructs from 3 of those dimensions.
     * This constructor is intended for those methods to use to return all
     * possible dimensions.
     * @param {number} hue
     * @param {number} chroma informally, colorfulness / color intensity. like saturation
     *     in HSL, except perceptually accurate.
     * @param {number} j lightness
     * @param {number} q brightness; ratio of lightness to white point's lightness
     * @param {number} m colorfulness
     * @param {number} s saturation; ratio of chroma to white point's chroma
     * @param {number} jstar CAM16-UCS J coordinate
     * @param {number} astar CAM16-UCS a coordinate
     * @param {number} bstar CAM16-UCS b coordinate
     */
    constructor(hue: number, chroma: number, j: number, q: number, m: number, s: number, jstar: number, astar: number, bstar: number);
    /** @readonly */
    readonly hue: number;
    /** @readonly */
    readonly chroma: number;
    /** @readonly */
    readonly j: number;
    /** @readonly */
    readonly q: number;
    /** @readonly */
    readonly m: number;
    /** @readonly */
    readonly s: number;
    /** @readonly */
    readonly jstar: number;
    /** @readonly */
    readonly astar: number;
    /** @readonly */
    readonly bstar: number;
    /**
     * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
     * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
     * specification, and is used to measure distances between colors.
     * @param {Cam16} other
     * @return {number}
     */
    distance(other: Cam16): number;
    /**
     *  @return {number} ARGB representation of color, assuming the color was viewed in
     *     default viewing conditions, which are near-identical to the default
     *     viewing conditions for sRGB.
     */
    toInt(): number;
    /**
     * @param {ViewingConditions} viewingConditions Information about the environment where the color
     *     will be viewed.
     * @return {number} ARGB representation of color
     */
    viewed(viewingConditions: ViewingConditions): number;
    /**
     * XYZ representation of CAM16 seen in [viewingConditions].
     * @param {ViewingConditions} viewingConditions
     * @return {number[]}
     */
    xyzInViewingConditions(viewingConditions: ViewingConditions): number[];
}
import ViewingConditions from './ViewingConditions.js';
//# sourceMappingURL=Cam16.d.ts.map