import '../components/Icon.js';
import DensityMixin from './DensityMixin.js';
import ShapeMixin from './ShapeMixin.js';

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

/**
 * @param {ReturnType<import('./ControlMixin.js').default>} Base
 */
export default function TextFieldMixin(Base) {
  return Base
    .mixin(DensityMixin)
    .mixin(ShapeMixin)
    .set({
      stateLayer: true,
    })
    .observe({
      type: { empty: 'text' },
      icon: 'string',
      iconVariation: 'string',
      label: 'string',
      filled: 'boolean',
      outlined: 'boolean',
      inputPrefix: 'string',
      inputSuffix: 'string',
      trailingIcon: 'string',
      trailingIconInk: 'string',
      trailingIconLabel: 'string',
      supporting: 'string',
      error: 'string',
      placeholder: { nullParser: String }, // DOMString
    })
    .observe({
      erroredState({ error, _invalid, _userInteracted }) { return _userInteracted && Boolean(error || _invalid); },
    })
    .expressions({
      computePlaceholder({ filled, outlined, label, placeholder }) {
        if (filled || outlined) return placeholder;
        return placeholder ?? label;
      },

      shouldShowSupporting({ erroredState, supporting }) {
        return erroredState || (supporting != null);
      },

      computeSupportingText({ error, erroredState, _validationMessage, supporting }) {
        return (error || (erroredState && _validationMessage) || supporting) ?? '';
      },

      populatedState({ value, _badInput }) {
        return !!value || _badInput;
      },
      _showLabelText({ label, filled, outlined }) {
        return label && (filled || outlined);
      },
    })
    .expressions({
      _shapeShapeTop({ shapeTop, filled }) {
        return shapeTop || filled;
      },
      computedIconVariation({ iconVariation, outlined }) {
        return iconVariation ?? (outlined ? null : 'filled');
      },
    })
    .html`
      <div id=shape role=none filled={filled} icon={icon} trailing-icon={trailingIcon}
      populated={populatedState} focused={focusedState} label={label} outlined={outlined}
      shape-top={_shapeShapeTop}>
        <mdw-icon mdw-if={icon} id=icon aria-hidden=true disabled={disabledState} icon={icon} variation={computedIconVariation}></mdw-icon>
        <div id=inline role=none filled={filled} icon={icon} trailing-icon={trailingIcon}
          populated={populatedState} focused={focusedState} label={label} outlined={outlined}>
          <span mdw-if={inputPrefix} class=inline id=prefix aria-hidden=true focused={focusedState} populated={populatedState}>{inputPrefix}</span>
          <span mdw-if={inputSuffix} class=inline id=suffix aria-hidden=true focused={focusedState} populated={populatedState}>{inputSuffix}</span>
        </div>
        <mdw-icon-button tabindex=-1 disabled={disabledState} mdw-if={trailingIcon} id=trailing-icon ink={trailingIconInk} disabled={disabledState} icon={trailingIcon}>{trailingIconLabel}</mdw-icon-button>
        <div mdw-if={filled} id=indicator aria-hidden=true focused={focusedState} hovered={hoveredState} errored={erroredState} disabled={disabledState}></div>
      </div>
      <div id=label-text mdw-if={_showLabelText} aria-hidden=true
        outlined={outlined}
        populated={populatedState}
        focused={focusedState}
        icon={icon}
        trailing-icon={trailingIcon}
        disabled={disabledState}
        errored={erroredState}>{label}</div>
      <div mdw-if={shouldShowSupporting} id=supporting disabled={disabledState} errored={erroredState}>
        {computeSupportingText}
        <slot id=supporting-slot name=supporting></slot>
      </div>
      
    `
    .recompose(({ html, refs: { control, outline, state, shape, inline } }) => {
      control.setAttribute('placeholder', '{computePlaceholder}');
      control.setAttribute('aria-label', '{label}');
      control.setAttribute('input-suffix', '{inputSuffix}');
      control.setAttribute('errored', '{erroredState}');
      control.setAttribute('aria-describedby', 'supporting');
      control.removeAttribute('aria-labelledby');
      control.classList.add('inline');

      state.setAttribute('mdw-if', '{!outlined}');
      outline.append(html`
        <div id=outline-left class=outline-section focused={focusedState}></div>
        <div id=gap label={label} populated={populatedState} focused={focusedState}>
          <div id=gap-slot focused={focusedState}></div>
          <span id=gap-label>{label}</span>
        </div>
        <div id=outline-right class=outline-section focused={focusedState}></div>
      `);
      outline.setAttribute('label', '{label}');
      outline.setAttribute('errored', '{erroredState}');
      shape.prepend(outline, state);
      inline.prepend(control);
    })
    .on({
      // @ts-ignore TODO: Missing observable size property
      sizeChanged(oldValue, newValue) {
        // @ts-ignore TODO: Missing {this} context
        const control = /** @type {HTMLElement} */ (this.refs.control);
        control.style.setProperty('--size', `${newValue}ch`);
      },
    })
    .css`
      /* https://m3.material.io/components/text-fields/specs */

      /**
       * States:      Enabled            / Hover              / Focus              / Error              / Error Hover        / Error Focus
       * Input:       on-surface         / on-surface         / on-surface         / on-surface         / on-surface         / on-surface
       * Inline:      on-surface-variant / on-surface-variant / on-surface-variant / on-surface-variant / on-surface-variant / on-surface-variant
       * Label:       on-surface-variant / on-surface*        / ink                / error              / on-error-container / error
       * Indicator:   on-surface-variant / on-surface         / ink                / error              / on-error-container / error
       * Caret:       (any)              / (any)              / ink                / (any)              / (any)              / error
       * Outline:     outline            / on-surface         / ink                / error              / on-error-container / error
       * Selection:   on-*               / on-*               / ink                / error              / on-error-container / error
       *
       *
       * *Filled hovered unpopulated label may be on-surface-variant instead
       *
       * Input: Always on-surface
       * Inline: Always on-surface-variant
       * Indicator: same as label
       * Label: same as indicator
       * Outline: outline default, same as label+indicator on :hover or :focus
       * Caret: same as label+indicator+outline (cannot inherit color or use currentColor)
       * Selection:  (cannot inherit color or use currentColor)
       */

      :host {
        --mdw-shape__size: var(--mdw-shape__extra-small);
        /* --mdw-shape__size: 8px; */
        /* --mdw-shape__size__bottom-start-size: var(--mdw-shape__size); */
        /* --mdw-shape__size__bottom-end-size: var(--mdw-shape__size); */
        --mdw-text-field__ratio: calc(var(--mdw-density) * 0.125 + 1);

        --control__margin-top: calc(var(--mdw-typescale__body-small__line-height) / 2);
        --control__padding-top: calc((var(--mdw-text-field__ratio) * 16px) - calc(var(--mdw-typescale__body-small__line-height) / 2));
        --control__padding-bottom: calc(var(--mdw-text-field__ratio) * 16px);
        --control__margin-bottom: 0px;

        --inline-color: rgb(var(--mdw-color__on-surface-variant));

        --descriptor-opacity: 0.5;
        --mdw-ink: var(--mdw-color__primary);
        --mdw-bg: var(--mdw-color__surface-container-highest);

        --mdw-type__font: var(--mdw-typescale__body-large__font);
        --mdw-type__letter-spacing: var(--mdw-typescale__body-large__letter-spacing);

        display: inline-block;

        border-radius: 0;

        /* State layer */
        color: rgb(var(--mdw-color__on-surface));

        font: var(--mdw-type__font);
        letter-spacing: var(--mdw-type__letter-spacing);
      }

      :host(:is([color], [ink])) {
        background-color: transparent;
        color: rgb(var(--mdw-color__on-surface));
      }

      /** Guard against bleed */
      #shape[label][outlined] {
        --mdw-shape__size__top-start-size: min(var(--mdw-shape__size), 12px);
        --mdw-shape__size__bottom-start-size: min(var(--mdw-shape__size), 12px);
        --mdw-shape__size__top-end-size: min(var(--mdw-shape__size), 12px);
        --mdw-shape__size__bottom-end-size: min(var(--mdw-shape__size), 12px);
      }

      #shape {
        position: relative;

        display: flex;

        cursor: inherit;

        z-index: 0;

        background-color: transparent;

        border-start-start-radius: calc(var(--mdw-shape__size__top-start-size));
        border-start-end-radius: calc(var(--mdw-shape__size__top-end-size));
        border-end-start-radius: calc(var(--mdw-shape__size__bottom-start-size));
        border-end-end-radius: calc(var(--mdw-shape__size__bottom-end-size));

        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        letter-spacing: inherit;

        transition: none 200ms cubic-bezier(0.0, 0.0, 0.2, 1);
      }

      #inline {
        display: flex;

        align-items: center;
        overflow: visible;

        flex: 1;
        padding-block: var(--control__margin-top) var(--control__margin-bottom);

        cursor: inherit;

        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        letter-spacing: inherit;

        transition: none 200ms cubic-bezier(0.0, 0.0, 0.2, 1);
      }

      

      #shape:where([filled],[color]) {
        background-color: rgb(var(--mdw-bg));
        color: rgb(var(--mdw-color__on-surface));
      }

      #shape[outlined] {
        background-color: transparent;
      }

      #label-text,
      #indicator {
        color: rgb(var(--mdw-color__on-surface-variant))
      }

      :is(#label-text, #indicator)[focused] {
        color: rgb(var(--mdw-ink))
      }

      #shape[focused] {
        transition: none 100ms cubic-bezier(0.4, 0.0, 1, 1);
      }

      #shape[shape-top] {
        --mdw-shape__size__bottom-start-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
      }

      #prefix,
      #suffix,
      #control::placeholder {
        opacity: var(--descriptor-opacity);

        color: var(--inline-color);

        transition-duration: inherit;
        transition-property: opacity;
        transition-timing-function: inherit;
        will-change: opacity;
      }

      :host([label]:is([filled],[outlined])) {
        --descriptor-opacity: 0;
      }

      #control {
        position: relative;
        inset: auto;
        align-self: flex-start;

        display: inline-block;

        box-sizing: border-box;

        block-size: auto;
        min-block-size: 0;
        inline-size: 100%;
        min-inline-size: 0;
        flex: 1;
        border-block-end: solid var(--control__margin-bottom) transparent;
        padding-block: var(--control__padding-top) var(--control__padding-bottom);

        appearance: none;
        caret-color: rgb(var(--mdw-ink));
        cursor: auto;

        transform: none;

        visibility: inherit;

        background-color: transparent;
        border-color: transparent;
        color: inherit;
        /* rgb(var(--mdw-color__on-surface)); */

        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        letter-spacing: inherit;
        text-align: initial;

        transition-duration: inherit;
        transition-property: color;
        transition-timing-function: inherit;
      }

      #suffix,
      #prefix {
        /* Symmetrical to allow centering */
        padding-block: var(--control__padding-top) var(--control__padding-bottom);
      }

      /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
      #control::selection {
        background-color: rgb(var(--mdw-ink));
        color: rgb(var(--mdw-color__surface));
      }

      #state {
        --mdw-state__focused-opacity: 0;
        --mdw-state__pressed-opacity: 0;
      }

      mdw-icon {
        --mdw-icon__size: 24px;
        align-self: center;

        color: var(--inline-color);
      }

      #icon {
        order: -2;

        margin-inline-start: 12px;

        font-size: 24px;
      }

      #prefix {
        order: -1;
      }

      #suffix {
        order: 1;
      }

      #trailing-icon {
        order: 2;

        /* stylelint-disable-next-line declaration-property-value-disallowed-list */
        margin-inline-end: 12px;
      }

      #indicator {
        position: absolute;
        inset-block-end: 0;
        inset-inline: 0;

        border-block-end: 2px solid currentColor;

        pointer-events: none;

        transform: scaleY(0.5);
        z-index: 1; /* Force new layer to avoid repaint */

        transition-duration: inherit;
        transition-property: transform;
        transition-timing-function: inherit;
        will-change: transform;
      }

      #indicator[focused] {
        transform: scaleY(1);

      }

      /** Label Text **/

      #label-text {
        position: absolute;
        inset-block-start: 0;
        inset-inline: 0;

        display: block;
        overflow-x: clip;
        overflow-y: visible;

        padding-inline: 16px;

        pointer-events: none;

        opacity: 1;
        transform: translateY(calc((var(--control__margin-top) + var(--control__padding-top) + 100% + var(--control__padding-bottom) + var(--control__margin-bottom)) / 2)) translateY(-50%);
        z-index: 4;
        /* FireFox bug */

        color: rgb(var(--mdw-color__on-surface-variant));

        text-overflow: ellipsis;
        white-space: nowrap;

        transition-duration: 200ms;
        transition-property: inset-inline-start, font-size, transform;
        /* transition-timing-function: inherit; */
        /*Expand*/

        will-change: inset-inline-start, font-size, transform;
      }

      @supports (-moz-appearance:none ) {
        #label-text {
          /* Firefox clips Y as well as X */
          overflow-x: hidden;
        }
      }

      #label-text[focused] {
        color: rgb(var(--mdw-ink));
      }

      #label-text[icon] {
        inset-inline-start: calc(12px + 24px);
      }

      #label-text[trailing-icon] {
        inset-inline-end: calc(24px + 12px);
      }

      #label-text:is([focused], [populated]) {
        transform: translateY(calc(var(--mdw-text-field__ratio) * 8px));

        font: var(--mdw-typescale__body-small__font);
        /* Not spec: Should only use font-size and line-height */
        letter-spacing: var(--mdw-typescale__body-small__letter-spacing);
      }

      #label-text[outlined]:is([focused], [populated]) {
        inset-inline: 0;

        transform: translateY(-50%);
      }

      :is(#prefix, #suffix):is([focused], [populated]) {
        opacity: 1;
      }

      /* If no label */
      #control:is(:focus, :not(:placeholder-shown))::placeholder {
        opacity: 0.70;
      }

      #control[input-suffix] {
        text-align: end;
      }

      /** Outlined **/

      #outline {
        position: absolute;
        inset: 0;

        border-style: solid;
        border-width: 0px;

        pointer-events: none;

        border-color: currentColor;
        border-radius: inherit;
        color: rgb(var(--mdw-color__outline));
      }

      #outline:is([pressed],[focused]) {
        color: rgb(var(--mdw-ink));

        transition-delay: 0;
        transition-duration: 0;
      }
      
      #outline[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.12);
      }

      #outline::before {
        content: none;
      }

      .outline-section {
        position: relative;

        border: 1px solid currentColor;
      }

      .outline-section[focused] {
        border-width: 2px;
      }

      #outline-left {
        /* stylelint-disable-next-line liberty/use-logical-spec */
        border-right-width: 0;
        /* stylelint-disable-next-line liberty/use-logical-spec */
        border-top-left-radius: inherit;
        /* stylelint-disable-next-line liberty/use-logical-spec */
        border-bottom-left-radius: inherit;
      }

      #outline-right {
        /* stylelint-disable-next-line liberty/use-logical-spec */
        border-left-width: 0;
        /* stylelint-disable-next-line liberty/use-logical-spec */
        border-top-right-radius: inherit;
        /* stylelint-disable-next-line liberty/use-logical-spec */
        border-bottom-right-radius: inherit;
      }

      #outline {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr 0 1fr;

        color: rgb(var(--mdw-color__outline));
      }

      #outline[label] {
        grid-template-columns: 12px minmax(0,auto) minmax(12px, 1fr);
      }

      #outline[hovered] {
        color: rgb(var(--mdw-color__on-surface));
      }

      #outline[focused] {
        color: rgb(var(--mdw-ink));
      }

      .outline-section {
        min-inline-size: 12px;
      }

      .outline-section::before,
      .outline-section::after {
        max-inline-size: none;
      }

      .outline-left {
        grid-column: calc(2 - var(--mdw-dir, 1)) / span 1; /* 1 on LTR, 3 on RTL */
      }

      .outline-right {
        grid-column: calc(2 + var(--mdw-dir, 1)) / span 1;
      }

      #gap {
        position: relative;

        display: inline-block;
        overflow: clip hidden;

        max-inline-size: 100%;
        grid-column: 2;

        font: var(--mdw-typescale__body-small__font);
        /* Not spec: Should only use font-size and line-height */
        letter-spacing: var(--mdw-typescale__body-small__letter-spacing);

        /* Close gap */
        transition-duration: inherit;
        transition-property: padding;
        transition-timing-function: inherit;
      }

      #gap-label {
        display: inline-block;
        overflow: clip hidden;

        padding-inline: 4px;

        color:transparent;

        white-space: nowrap;
      }

      #gap::after {
        content: '';

        position: absolute;
        inset: 0;

        border-block-end: solid 1px currentColor;
      }

      #gap[focused]::after {
        border-block-end-width: 2px;
      }

      #gap-slot {
        position: absolute;
        inset: 0;

      }

      #gap-slot::before,
      #gap-slot::after {
        content: '';

        position: absolute;
        inset: 0;

        border-block-start: solid 1px currentColor;

        transition: transform 200ms;
        will-change: transform;
      }

      #gap-slot[focused]::before,
      #gap-slot[focused]::after {
        border-block-start-width: 2px;
      }

      #gap-slot::before {
        /* stylelint-disable-next-line liberty/use-logical-spec */
        margin-right: -0.99px;

        transform: var(--gap-transform, scaleX(0.5));
        transform-origin: 0 0;
      }

      #gap-slot::after {
        /* stylelint-disable-next-line liberty/use-logical-spec */
        margin-left: -0.99px;

        transform: var(--gap-transform, scaleX(0.5));
        transform-origin: 100% 0;
      }

      #gap:is([focused], [populated]) {
        /* Open gap */
        --gap-transform: scaleX(0);
      }

      #gap:empty {
        padding: 0;
      }

      #inline[label][filled] {
        align-items: flex-start;
      }

      :host([filled]) {
        --mdw-shape__size__bottom-start-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
        --mdw-text-field__ratio: calc(var(--mdw-density) * 0.25 + 1);
      }

      :host(:is([filled][label])) {
        --control__margin-top: calc((var(--mdw-text-field__ratio) * 8px) + var(--mdw-typescale__body-small__line-height));
        --control__padding-top: 0px;
        --control__padding-bottom: calc(var(--mdw-text-field__ratio) * 4px);
        --control__margin-bottom: calc(var(--mdw-text-field__ratio) * 4px);
      }

      #supporting {
        min-block-size: var(--mdw-typescale__body-small__line-height);
        margin-block-start: 4px;
        margin-inline: 16px;

        font-weight: var(--mdw-typescale__body-small__font-weight); /* Not spec */
        font-size: var(--mdw-typescale__body-small__font-size);
        line-height: var(--mdw-typescale__body-small__line-height);
        font-family: var(--mdw-typescale__body-small__font-family); /* Not spec */
        letter-spacing: var(--mdw-typescale__body-small__letter-spacing); /* Not spec */
      }

      /* Error States */

      #control[errored] {
        caret-color: rgb(var(--mdw-color__error));
      }

      #control[errored]::selection {
        background-color: rgb(var(--mdw-color__on-error-container));
      }

      :is(#indicator, #label-text, #supporting, #outline)[errored] {
        color: rgb(var(--mdw-color__error));
      }

      :is(#indicator, #label-text, #supporting, #outline)[errored]:where([hovered]) {
        color: rgb(var(--mdw-color__on-error-container));
      }

      :is(#indicator, #label-text, #supporting, #outline)[errored]:where([focused]) {
        color: rgb(var(--mdw-color__error));
      }

      /* stylelint-disable-next-line selector-max-compound-selectors */
      #shape[disabled],
      #shape[disabled] #control {
        cursor: not-allowed;
      }

      #outline[disabled] {
        color: rgba(var(--mdw-color__outline), 0.12);
      }

      #label-text[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.38);
      }

      #supporting[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.38);
      }

      .inline[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.38);
      }

      mdw-icon[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.38);
      }

      #shape[disabled] {
        background-color: rgba(var(--mdw-color__on-surface), calc(0.04));
        color: rgba(var(--mdw-color__on-surface), 0.38);
      }

      #indicator[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.38);
      }

      #shape[disabled][outlined] {
        background-color: transparent;
      }
    
    `;
}
