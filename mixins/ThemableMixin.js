/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ThemableMixin(Base) {
  return Base
    .extend()
    .observe({
      color: 'string',
      ink: 'string',
      block: 'boolean',
      typeStyle: 'string',
    })
    .css`${
    ThemableMixin.PALETTES.map((palette) => [
      `:host([color="${palette}"]){`,
      `--mdw-bg: var(--mdw-color__${palette});`,
      `--mdw-ink: var(--mdw-color__on-${palette});`,
      '}',
      `:host([color="${palette}-container"]){`,
      `--mdw-bg: var(--mdw-color__${palette}-container);`,
      `--mdw-ink: var(--mdw-color__on-${palette}-container);`,
      '}',
    ].join('')).join('')}`
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
      
      :host([color][disabled]) {
        /* background-color: rgba(var(--mdw-color__on-surface), 0.12); */
        /* color: rgba(var(--mdw-color__on-surface), 0.38); */
      }
      `
    .css`${
    ThemableMixin.PALETTES.map((palette) => [
      `:host([ink="${palette}"]){`,
      `--mdw-ink: var(--mdw-color__${palette});`,
      '}',
      `:host([ink="on-${palette}-container"]){`,
      `--mdw-ink: var(--mdw-color__on-${palette}-container);`,
      '}',
    ].join('')).join('')}`
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
    .css`${
    ThemableMixin.TYPE_STYLES.map((typeStyle) => [
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
    ].join(''))}`;
}

ThemableMixin.PALETTES = [
  'primary',
  'secondary',
  'tertiary',
  'error',
  'surface',
];

ThemableMixin.TYPE_STYLES = [
  'display',
  'headline',
  'title',
  'label',
  'body',
];
