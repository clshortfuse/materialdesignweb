/**
 * @param {typeof TYPOGRAPHY_DEFAULT} config
 * @return {string}
 */
export function generateTypographyCSS(config?: typeof TYPOGRAPHY_DEFAULT): string;
/** @return {string} */
export function generateTypographyGlobalCSS(): string;
/**
 * @param {typeof SHAPE_ROUNDED_DEFAULT} [config]
 * @return {string}
 */
export function generateShapeCSS(config?: typeof SHAPE_ROUNDED_DEFAULT): string;
/**
 * @param {ThemeOptions} options
 * @return {string}
 */
export function generateColorCSS({ color, custom, lightness }: ThemeOptions): string;
/**
 * @param {ThemeOptions} options
 * @return {void}
 */
export function setupTheme({ color, custom, lightness }: ThemeOptions): void;
/**
 * @param {URLSearchParams} searchParams
 * @return {ThemeOptions}
 */
export function themeOptionsFromSearchParams(searchParams: URLSearchParams): ThemeOptions;
/**
 * @param {ThemeOptions} options
 * @return {string}
 */
export function generateThemeCSS({ color, custom, lightness }: ThemeOptions): string;
export const PALETTES: string[];
export const TYPE_STYLES: string[];
export type ThemeOptions = {
    color?: string;
    /**
     * Map()
     */
    custom?: Iterable<[string, string?]>;
    lightness?: "auto" | "light" | "dark";
};
import { TYPOGRAPHY_DEFAULT } from '../constants/typography.js';
import { SHAPE_ROUNDED_DEFAULT } from '../constants/shapes.js';
//# sourceMappingURL=theme.d.ts.map