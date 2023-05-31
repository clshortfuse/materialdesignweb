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
    .extend()
    .set({
      stateLayer: true,
    })
    .observe({
      type: { empty: 'text' },
      icon: 'string',
      label: 'string',
      filled: 'boolean',
      outlined: 'boolean',
      inputPrefix: 'string',
      inputSuffix: 'string',
      trailingIcon: 'string',
      trailingIconInk: 'string',
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
    .html`
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
    .on({
      composed({ html, inline }) {
        const { control, outline, shape, outlineLeft, outlineRight, state } = this.refs;
        control.setAttribute('placeholder', '{computePlaceholder}');
        control.setAttribute('aria-label', '{label}');
        control.setAttribute('input-suffix', '{inputSuffix}');
        control.setAttribute('errored', '{erroredState}');
        control.setAttribute('aria-describedby', 'supporting');
        control.removeAttribute('aria-labelledby');
        control.classList.add('inline');

        state.setAttribute('mdw-if', '{!outlined}');
        shape.setAttribute('role', 'none');
        shape.setAttribute('filled', '{filled}');
        shape.setAttribute('icon', '{icon}');
        shape.setAttribute('trailingIcon', '{trailingIcon}');
        shape.setAttribute('populated', '{populatedState}');
        shape.setAttribute('focused', '{focusedState}');
        shape.setAttribute('label', '{label}');
        shape.setAttribute('shape-top', inline(({ shapeTop, filled }) => shapeTop || filled));
        shape.append(
          state,
          outline,
          control,
          html`
            <mdw-icon mdw-if={icon} id=icon aria-hidden=true disabled={disabledState}>{icon}</mdw-icon>
            <span mdw-if={inputPrefix} class=inline id=prefix aria-hidden=true focused={focusedState} populated={populatedState}>{inputPrefix}</span>
            <span mdw-if={inputSuffix} class=inline id=suffix aria-hidden=true focused={focusedState} populated={populatedState}>{inputSuffix}</span>
            <mdw-icon mdw-if={trailingIcon} id=trailing-icon ink={trailingIconInk} aria-hidden=true disabled={disabledState}>{trailingIcon}</mdw-icon>
            <div mdw-if={filled} id=indicator aria-hidden=true focused={focusedState} hovered={hoveredState} errored={erroredState} disabled={disabledState}></div>
          `,
        );

        outline.setAttribute('label', '{label}');
        outline.setAttribute('errored', '{erroredState}');
        outlineLeft.after(html`
          <div id=gap mdw-if={label} label={label} populated={populatedState} focused={focusedState}>
            <div id=gap-slot focused={focusedState}></div>
            <span id=gap-label>{label}</span>
          </div>
        `);

        outlineLeft.setAttribute('focused', '{focusedState}');
        outlineRight.setAttribute('focused', '{focusedState}');
      },
      sizeChanged(oldValue, newValue) {
        this.refs.control.style.setProperty('--size', `${newValue}ch`);
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

        /* State layer */
        color: rgb(var(--mdw-color__on-surface));

        font: var(--mdw-type__font);
        letter-spacing: var(--mdw-type__letter-spacing);
      }

      :host([icon]) {
        --padding-inline-start: 12px;
      }

      :host([trailing-icon]) {
        --padding-inline-end: 12px;
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
        -webkit-mask-box-image-width: min(var(--mdw-shape__size), 12px);
      }

      #shape {
        position: relative;

        display: flex;

        align-items: center;
        overflow: visible;

        cursor: inherit;

        z-index: 0;

        background-color: transparent;

        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        letter-spacing: inherit;

        transition: none 200ms cubic-bezier(0.0, 0.0, 0.2, 1);
      }

      #shape:is([filled],[outlined]) {
        padding-inline: 16px;
      }

      #shape:is([filled],[color]) {
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

      #shape:is([filled],[outlined])[icon] {
        padding-inline-start: 12px;
      }

      #shape[trailing-icon] {
        padding-inline-end: 12px;
      }

      #shape[focused] {
        transition: none 100ms cubic-bezier(0.4, 0.0, 1, 1);
      }

      #shape[shape-top] {
        --mdw-shape__size__bottom-start-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
        --mdw-shape__mask: linear-gradient(transparent 50%, black 50%);
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

        display: inline;

        box-sizing: border-box;

        block-size: auto;
        min-block-size: none;
        inline-size: 100%;
        min-inline-size: none;
        flex: 1;
        border-block-start: solid var(--control__margin-top) transparent;
        border-block-end: solid var(--control__margin-bottom) transparent;
        padding-block: var(--control__padding-top) var(--control__padding-bottom);

        appearance: none;
        caret-color: rgb(var(--mdw-ink));
        cursor: auto;

        transform: none;

        visibility: visible;

        background-color: transparent;
        border-color: transparent;
        color: inherit;
        /* rgb(var(--mdw-color__on-surface)); */

        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        letter-spacing: inherit;

        transition-duration: inherit;
        transition-property: color;
        transition-timing-function: inherit;
      }

      #suffix,
      #prefix {
        /* Symmetrical to allow centering */
        margin-block: var(--control__margin-top) var(--control__margin-bottom);
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

        margin-inline-end: 16px;

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

        margin-inline-start: 16px;
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

      @supports(-webkit-mask-box-image: none) {
        #outline[focused] {
          /** Fake 2px outline */
          filter:
            drop-shadow(1px 0px 0px currentColor)
            drop-shadow(0px 1px 0px currentColor)
            drop-shadow(-1px 0px 0px currentColor)
            drop-shadow(0px -1px 0px currentColor);
        }

        #outline::before {
          content: '';

          position: absolute;
          inset: 0;

          grid-column: calc(2 - var(--mdw-dir, 1)) / span 1;
          /* stylelint-disable-next-line liberty/use-logical-spec */
          margin-right: -0.99px;
          border: none;

          background-color: currentColor;
          -webkit-mask-box-image: var(--mdw-shape__mask-image__edges)
            8 fill /
            auto
            stretch;
          -webkit-mask-box-image-width: auto 0 auto auto;
        }

        #outline::after {
          grid-column: calc(2 + var(--mdw-dir, 1)) / span 1;
          grid-row: 1;

          /* stylelint-disable-next-line liberty/use-logical-spec */
          margin-left: -0.99px;
          -webkit-mask-box-image-width: auto auto auto 0;
        }

        .outline-section {
          border: none;
        }

        #gap::after {
          border: none;

          background-color: currentColor;
          -webkit-mask-box-image: var(--mdw-shape__mask-image__edges)
            8 fill /
            auto
            stretch;
          -webkit-mask-box-image-width: 0 0 auto 0;
        }

        #gap-slot::before,
        #gap-slot::after {
          border: none;

          background-color: currentColor;

          -webkit-mask-box-image: var(--mdw-shape__mask-image__edges)
            8 fill /
            auto
            stretch;
          -webkit-mask-box-image-width: auto 0 0 0;
        }
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

      #shape[label][filled] {
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
