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
    .css`
      :host([color="primary"]) {
        --mdw-bg: var(--mdw-color__primary);
        --mdw-ink: var(--mdw-color__on-primary);
      }
      
      :host([color="primary-container"]) {
        --mdw-bg: var(--mdw-color__primary-container);
        --mdw-ink: var(--mdw-color__on-primary-container);
      }
      
      :host([color="secondary"]) {
        --mdw-bg: var(--mdw-color__secondary);
        --mdw-ink: var(--mdw-color__on-secondary);
      }
      
      :host([color="secondary-container"]) {
        --mdw-bg: var(--mdw-color__secondary-container);
        --mdw-ink: var(--mdw-color__on-secondary-container);
      }
      
      :host([color="tertiary"]) {
        --mdw-bg: var(--mdw-color__tertiary);
        --mdw-ink: var(--mdw-color__on-tertiary);
      }
      
      :host([color="tertiary-container"]) {
        --mdw-bg: var(--mdw-color__tertiary-container);
        --mdw-ink: var(--mdw-color__on-tertiary-container);
      }
      
      :host([color="error"]) {
        --mdw-bg: var(--mdw-color__error);
        --mdw-ink: var(--mdw-color__on-error);
      }
      
      :host([color="error-container"]) {
        --mdw-bg: var(--mdw-color__error-container);
        --mdw-ink: var(--mdw-color__on-error-container);
      }
      
      :host([color="background"]) {
        --mdw-bg: var(--mdw-color__background);
        --mdw-ink: var(--mdw-color__on-background);
      }
      
      :host([color^="surface"]) {
        --mdw-bg: var(--mdw-color__surface);
        --mdw-ink: var(--mdw-color__on-surface);
      }

      :host([color="surface-dim"]) {
        --mdw-bg: var(--mdw-color__surface-dim);
      }

      :host([color="surface-bright"]) {
        --mdw-bg: var(--mdw-color__surface-bright);
      }

      :host([color="surface-container"]) {
        --mdw-bg: var(--mdw-color__surface-container);
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
      
      :host([ink="inverse-primary"]) {
        --mdw-ink: var(--mdw-color__inverse-primary);
      }
      
      :host([ink="primary"]) {
        --mdw-ink: var(--mdw-color__primary);
      }
      
      :host([ink="on-primary-container"]) {
        --mdw-ink: var(--mdw-color__on-primary-container);
      }
      
      :host([ink="secondary"]) {
        --mdw-ink: var(--mdw-color__secondary);
      }
      
      :host([ink="on-secondary-container"]) {
        --mdw-ink: var(--mdw-color__on-secondary-container);
      }
      
      :host([ink="tertiary"]) {
        --mdw-ink: var(--mdw-color__tertiary);
      }
      
      :host([ink="on-tertiary-container"]) {
        --mdw-ink: var(--mdw-color__on-tertiary-container);
      }
      
      :host([ink="error"]) {
        --mdw-ink: var(--mdw-color__error);
      }
      
      :host([ink="outline"]) {
        --mdw-ink: var(--mdw-color__outline);
      }
      
      :host([ink="on-surface"]) {
        --mdw-ink: var(--mdw-color__on-surface);
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
      
      :host([type-style|="display"]) {
        --mdw-type__font: var(--mdw-typescale__display-large__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__display-large__letter-spacing);
      }
      
      :host([type-style="display-medium"]) {
        --mdw-type__font: var(--mdw-typescale__display-medium__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__display-medium__letter-spacing);
      }
      
      :host([type-style="display-small"]) {
        --mdw-type__font: var(--mdw-typescale__display-small__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__display-small__letter-spacing);
      }
      
      :host([type-style|="headline"]) {
        --mdw-type__font: var(--mdw-typescale__headline-large__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__headline-large__letter-spacing);
      }
      
      :host([type-style="headline-medium"]) {
        --mdw-type__font: var(--mdw-typescale__headline-medium__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__headline-medium__letter-spacing);
      }
      
      :host([type-style="headline-small"]) {
        --mdw-type__font: var(--mdw-typescale__headline-small__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__headline-small__letter-spacing);
      }
      
      :host([type-style|="title"]) {
        --mdw-type__font: var(--mdw-typescale__title-large__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__title-large__letter-spacing);
      }
      
      :host([type-style="title-medium"]) {
        --mdw-type__font: var(--mdw-typescale__title-medium__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__title-medium__letter-spacing);
      }
      
      :host([type-style="title-small"]) {
        --mdw-type__font: var(--mdw-typescale__title-small__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__title-small__letter-spacing);
      }
      
      :host([type-style|="label"]) {
        --mdw-type__font: var(--mdw-typescale__label-large__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__label-large__letter-spacing);
      }
      
      :host([type-style="label-medium"]) {
        --mdw-type__font: var(--mdw-typescale__label-medium__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__label-medium__letter-spacing);
      }
      
      :host([type-style="label-small"]) {
        --mdw-type__font: var(--mdw-typescale__label-small__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__label-small__letter-spacing);
      }
      
      :host([type-style|="body"]) {
        --mdw-type__font: var(--mdw-typescale__body-large__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
      }
      
      :host([type-style="body-medium"]) {
        --mdw-type__font: var(--mdw-typescale__body-medium__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);
      }
      
      :host([type-style="body-small"]) {
        --mdw-type__font: var(--mdw-typescale__body-small__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__body-small__letter-spacing);
      }    
    `;
}
