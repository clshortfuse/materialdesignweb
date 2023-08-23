/**
 * Represents a Material color scheme, a mapping of color roles to colors.
 */
export default class Scheme {
    /**
     * @param {number} argb  ARGB representation of a color.
     * @return {Scheme} Light Material color scheme, based on the color's hue.
     */
    static light(argb: number): Scheme;
    /**
     * @param {number} argb ARGB representation of a color.
     * @return {Scheme} Dark Material color scheme, based on the color's hue.
     */
    static dark(argb: number): Scheme;
    /**
     * @param {number} argb ARGB representation of a color.
     * @return {Scheme} Light Material content color scheme, based on the color's hue.
     */
    static lightContent(argb: number): Scheme;
    /**
     * @param {number} argb ARGB representation of a color.
     * @return {Scheme} Dark Material content color scheme, based on the color's hue.
     */
    static darkContent(argb: number): Scheme;
    /**
     * Light scheme from core palette
     * @param {CorePalette} core
     * @return {Scheme}
     */
    static lightFromCorePalette(core: CorePalette): Scheme;
    /**
     * Dark scheme from core palette
     * @param {CorePalette} core
     * @return {Scheme}
     */
    static darkFromCorePalette(core: CorePalette): Scheme;
    /**
     * @param {Object} props
     * @param {number} props.primary
     * @param {number} props.onPrimary
     * @param {number} props.primaryContainer
     * @param {number} props.onPrimaryContainer
     * @param {number} props.secondary
     * @param {number} props.onSecondary
     * @param {number} props.secondaryContainer
     * @param {number} props.onSecondaryContainer
     * @param {number} props.tertiary
     * @param {number} props.onTertiary
     * @param {number} props.tertiaryContainer
     * @param {number} props.onTertiaryContainer
     * @param {number} props.error
     * @param {number} props.onError
     * @param {number} props.errorContainer
     * @param {number} props.onErrorContainer
     * @param {number} props.background
     * @param {number} props.onBackground
     * @param {number} props.surface
     * @param {number} props.onSurface
     * @param {number} props.surfaceDim
     * @param {number} props.surfaceBright
     * @param {number} props.surfaceContainerLowest
     * @param {number} props.surfaceContainerLow
     * @param {number} props.surfaceContainer
     * @param {number} props.surfaceContainerHigh
     * @param {number} props.surfaceContainerHighest
     * @param {number} props.surfaceVariant
     * @param {number} props.onSurfaceVariant
     * @param {number} props.outline
     * @param {number} props.outlineVariant
     * @param {number} props.shadow
     * @param {number} props.scrim
     * @param {number} props.inverseSurface
     * @param {number} props.inverseOnSurface
     * @param {number} props.inversePrimary
     */
    constructor(props: {
        primary: number;
        onPrimary: number;
        primaryContainer: number;
        onPrimaryContainer: number;
        secondary: number;
        onSecondary: number;
        secondaryContainer: number;
        onSecondaryContainer: number;
        tertiary: number;
        onTertiary: number;
        tertiaryContainer: number;
        onTertiaryContainer: number;
        error: number;
        onError: number;
        errorContainer: number;
        onErrorContainer: number;
        background: number;
        onBackground: number;
        surface: number;
        onSurface: number;
        surfaceDim: number;
        surfaceBright: number;
        surfaceContainerLowest: number;
        surfaceContainerLow: number;
        surfaceContainer: number;
        surfaceContainerHigh: number;
        surfaceContainerHighest: number;
        surfaceVariant: number;
        onSurfaceVariant: number;
        outline: number;
        outlineVariant: number;
        shadow: number;
        scrim: number;
        inverseSurface: number;
        inverseOnSurface: number;
        inversePrimary: number;
    });
    props: {
        primary: number;
        onPrimary: number;
        primaryContainer: number;
        onPrimaryContainer: number;
        secondary: number;
        onSecondary: number;
        secondaryContainer: number;
        onSecondaryContainer: number;
        tertiary: number;
        onTertiary: number;
        tertiaryContainer: number;
        onTertiaryContainer: number;
        error: number;
        onError: number;
        errorContainer: number;
        onErrorContainer: number;
        background: number;
        onBackground: number;
        surface: number;
        onSurface: number;
        surfaceDim: number;
        surfaceBright: number;
        surfaceContainerLowest: number;
        surfaceContainerLow: number;
        surfaceContainer: number;
        surfaceContainerHigh: number;
        surfaceContainerHighest: number;
        surfaceVariant: number;
        onSurfaceVariant: number;
        outline: number;
        outlineVariant: number;
        shadow: number;
        scrim: number;
        inverseSurface: number;
        inverseOnSurface: number;
        inversePrimary: number;
    };
    /** @return {number} */
    get primary(): number;
    /** @return {number} */
    get onPrimary(): number;
    /** @return {number} */
    get primaryContainer(): number;
    /** @return {number} */
    get onPrimaryContainer(): number;
    /** @return {number} */
    get secondary(): number;
    /** @return {number} */
    get onSecondary(): number;
    /** @return {number} */
    get secondaryContainer(): number;
    /** @return {number} */
    get onSecondaryContainer(): number;
    /** @return {number} */
    get tertiary(): number;
    /** @return {number} */
    get onTertiary(): number;
    /** @return {number} */
    get tertiaryContainer(): number;
    /** @return {number} */
    get onTertiaryContainer(): number;
    /** @return {number} */
    get error(): number;
    /** @return {number} */
    get onError(): number;
    /** @return {number} */
    get errorContainer(): number;
    /** @return {number} */
    get onErrorContainer(): number;
    /** @return {number} */
    get background(): number;
    /** @return {number} */
    get onBackground(): number;
    /** @return {number} */
    get surface(): number;
    /** @return {number} */
    get onSurface(): number;
    /** @return {number} */
    get surfaceDim(): number;
    /** @return {number} */
    get surfaceBright(): number;
    /** @return {number} */
    get surfaceContainerLowest(): number;
    /** @return {number} */
    get surfaceContainerLow(): number;
    /** @return {number} */
    get surfaceContainer(): number;
    /** @return {number} */
    get surfaceContainerHigh(): number;
    /** @return {number} */
    get surfaceContainerHighest(): number;
    /** @return {number} */
    get surfaceVariant(): number;
    /** @return {number} */
    get onSurfaceVariant(): number;
    /** @return {number} */
    get outline(): number;
    /** @return {number} */
    get outlineVariant(): number;
    /** @return {number} */
    get shadow(): number;
    /** @return {number} */
    get scrim(): number;
    /** @return {number} */
    get inverseSurface(): number;
    /** @return {number} */
    get inverseOnSurface(): number;
    /** @return {number} */
    get inversePrimary(): number;
    toJSON(): {
        primary: number;
        onPrimary: number;
        primaryContainer: number;
        onPrimaryContainer: number;
        secondary: number;
        onSecondary: number;
        secondaryContainer: number;
        onSecondaryContainer: number;
        tertiary: number;
        onTertiary: number;
        tertiaryContainer: number;
        onTertiaryContainer: number;
        error: number;
        onError: number;
        errorContainer: number;
        onErrorContainer: number;
        background: number;
        onBackground: number;
        surface: number;
        onSurface: number;
        surfaceDim: number;
        surfaceBright: number;
        surfaceContainerLowest: number;
        surfaceContainerLow: number;
        surfaceContainer: number;
        surfaceContainerHigh: number;
        surfaceContainerHighest: number;
        surfaceVariant: number;
        onSurfaceVariant: number;
        outline: number;
        outlineVariant: number;
        shadow: number;
        scrim: number;
        inverseSurface: number;
        inverseOnSurface: number;
        inversePrimary: number;
    };
}
import CorePalette from '../palettes/CorePalette.js';
//# sourceMappingURL=Scheme.d.ts.map