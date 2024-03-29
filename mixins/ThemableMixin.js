import { PALETTES, TYPE_STYLES } from '../services/theme.js';

const colorAttributeCSS = PALETTES.map((palette) => [
  `:host([color="${palette}"]){`,
  `--mdw-bg: var(--mdw-color__${palette});`,
  `--mdw-ink: var(--mdw-color__on-${palette});`,
  '}',
  `:host([color="${palette}-container"]){`,
  `--mdw-bg: var(--mdw-color__${palette}-container);`,
  `--mdw-ink: var(--mdw-color__on-${palette}-container);`,
  '}',
].join('')).join('');

const inkAttributeCSS = PALETTES.map((palette) => [
  `:host([ink="${palette}"]){`,
  `--mdw-ink: var(--mdw-color__${palette});`,
  '}',
  `:host([ink="on-${palette}"]){`,
  `--mdw-ink: var(--mdw-color__on-${palette});`,
  '}',
  `:host([ink="on-${palette}-container"]){`,
  `--mdw-ink: var(--mdw-color__on-${palette}-container);`,
  '}',
].join('')).join('');

const typeStyleAttributeCSS = TYPE_STYLES.map((typeStyle) => [
  `:host([type-style|="${typeStyle}"]) {`,
  `--mdw-type__font: var(--mdw-typescale__${typeStyle}-large__font);`,
  `--mdw-type__letter-spacing: var(--mdw-typescale__${typeStyle}-large__letter-spacing);`,
  '}',
  `:host([type-style="${typeStyle}-medium"]) {`,
  `--mdw-type__font: var(--mdw-typescale__${typeStyle}-medium__font);`,
  `--mdw-type__letter-spacing: var(--mdw-typescale__${typeStyle}-medium__letter-spacing);`,
  '}',
  `:host([type-style="${typeStyle}-small"]) {`,
  `--mdw-type__font: var(--mdw-typescale__${typeStyle}-small__font);`,
  `--mdw-type__letter-spacing: var(--mdw-typescale__${typeStyle}-small__letter-spacing);`,
  '}',
].join('')).join('');

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ThemableMixin(Base) {
  return Base
    .observe({
      color: 'string',
      ink: 'string',
      typeStyle: 'string',
    })
    .css(colorAttributeCSS)
    .css`
      :host([color="background"]) {
        --mdw-bg: var(--mdw-color__background);
        --mdw-ink: var(--mdw-color__on-background);
      }

      :host([color="surface-dim"]) {
        --mdw-bg: var(--mdw-color__surface-dim);
      }

      :host([color="surface-bright"]) {
        --mdw-bg: var(--mdw-color__surface-bright);
      }

      :host([color="surface-container-lowest"]) {
        --mdw-bg: var(--mdw-color__surface-container-lowest);
      }

      :host([color="surface-container-low"]) {
        --mdw-bg: var(--mdw-color__surface-container-low);
      }

      :host([color="surface-container-high"]) {
        --mdw-bg: var(--mdw-color__surface-container-high);
      }
      
      :host([color="surface-container-highest"]) {
        --mdw-bg: var(--mdw-color__surface-container-highest);
      }
      
      /* Quality-of-life */
      :host([color="surface-primary"]) {
        --mdw-bg: var(--mdw-color__surface);
        --mdw-ink: var(--mdw-color__primary);
      }
      
      :host([color$="variant"]) {
        --mdw-bg: var(--mdw-color__surface-container-highest);
        --mdw-ink: var(--mdw-color__on-surface-variant);
      }
      
      :host([color^="inverse"]) {
        --mdw-bg: var(--mdw-color__inverse-surface);
        --mdw-ink: var(--mdw-color__inverse-on-surface);
      }
      
      :host([color="inverse-primary"]) {
        --mdw-ink: var(--mdw-color__inverse-primary);
      }
      `
    .css(inkAttributeCSS)
    .css`
      :host([ink="inverse-primary"]) {
        --mdw-ink: var(--mdw-color__inverse-primary);
      }

      :host([ink="outline"]) {
        --mdw-ink: var(--mdw-color__outline);
      }
      
      :host([ink="surface-container-highest"]) {
        --mdw-ink: var(--mdw-color__surface-container-highest);
      }
      
      :host([ink="on-surface-variant"]) {
        --mdw-ink: var(--mdw-color__on-surface-variant);
      }
      
      :host([ink="inverse-on-surface"]) {
        --mdw-ink: var(--mdw-color__inverse-on-surface);
      }
      
      :host([ink="inherit"]) {
        --mdw-ink: inherit;
      }
    `
    .css(typeStyleAttributeCSS);
}
