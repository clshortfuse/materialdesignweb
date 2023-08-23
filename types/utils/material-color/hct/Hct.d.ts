/**
 * HCT, hue, chroma, and tone. A color system that provides a perceptually
 * accurate color measurement system that can also accurately render what colors
 * will appear as in different lighting environments.
 */
export default class Hct {
    /**
     * @param hue 0 <= hue < 360; invalid values are corrected.
     * @param chroma 0 <= chroma < ?; Informally, colorfulness. The color
     *     returned may be lower than the requested chroma. Chroma has a different
     *     maximum for any given hue and tone.
     * @param tone 0 <= tone <= 100; invalid values are corrected.
     * @return HCT representation of a color in default viewing conditions.
     */
    /**
     * @param {number} hue
     * @param {number} chroma
     * @param {number} tone
     * @return {Hct}
     */
    static from(hue: number, chroma: number, tone: number): Hct;
    /**
     * @param {number} argb ARGB representation of a color.
     * @return {Hct} HCT representation of a color in default viewing conditions
     */
    static fromInt(argb: number): Hct;
    /** @param {number} argb */
    constructor(argb: number);
    /** @type {number} */
    internalHue: number;
    /** @type {number} */
    internalChroma: number;
    /** @type {number} */
    internalTone: number;
    argb: number;
    /** @return {number} */
    toInt(): number;
    /**
     * @param {number} newHue 0 <= newHue < 360; invalid values are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set hue(arg: number);
    /**
     * A number, in degrees, representing ex. red, orange, yellow, etc.
     * Ranges from 0 <= hue < 360.
     * @return {number}
     */
    get hue(): number;
    /**
     * @param {number} newChroma 0 <= newChroma < ?
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set chroma(arg: number);
    /** @return {number} */
    get chroma(): number;
    /**
     * @param {number} newTone 0 <= newTone <= 100; invalid valids are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set tone(arg: number);
    /**
     * Lightness. Ranges from 0 to 100.
     * @return {number}
     */
    get tone(): number;
    /**
     * @private
     * @param {number} argb
     */
    private setInternalState;
    /**
     * Translates a color into different [ViewingConditions].
     *
     * Colors change appearance. They look different with lights on versus off,
     * the same color, as in hex code, on white looks different when on black.
     * This is called color relativity, most famously explicated by Josef Albers
     * in Interaction of Color.
     *
     * In color science, color appearance models can account for this and
     * calculate the appearance of a color in different settings. HCT is based on
     * CAM16, a color appearance model, and uses it to make these calculations.
     *
     * See [ViewingConditions.make] for parameters affecting color appearance.
     * @param {ViewingConditions} vc
     * @return {Hct}
     */
    inViewingConditions(vc: ViewingConditions): Hct;
}
import ViewingConditions from './ViewingConditions.js';
//# sourceMappingURL=Hct.d.ts.map