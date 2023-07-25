import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/* https://m3.material.io/components/buttons/specs */

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(DensityMixin)
  .mixin(StateMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .mixin(HyperlinkMixin)
  .define({
    stateTargetElement() { return this.refs.control; },
  })
  .set({
    stateLayer: true,
    _allowedTypes: ['button', 'submit', 'reset'],
  })
  .observe({
    type: {
      empty: 'button',
      /**
       * @param {string} value
       * @param {*} internalSet
       */
      set(value, internalSet) {
        const enumeratedValue = value?.toLowerCase() ?? 'button';
        internalSet(
          this._allowedTypes.includes(enumeratedValue)
            ? enumeratedValue
            : 'button',
        );
      },
    },
    elevated: 'boolean',
    filled: 'string',
    outlined: 'boolean',
    icon: 'string',
    iconInk: 'string',
    src: 'string',
    svg: 'string',
    viewBox: 'string',
    svgPath: 'string',
  })
  .observe({
    _elevation({ elevation, elevated, filled }) {
      if (elevation != null) return elevation;
      if (elevated) return 1;
      if (filled != null) return 0;
      return null;
    },
    _elevationRaised({ elevationRaised, elevated, filled }) {
      if (elevationRaised != null) return elevationRaised;
      if (elevated) return 2;
      if (filled != null) return 1;
      return null;
    },
  })
  .observe({
    _secondaryFilter({ disabledState }) {
      return disabledState ? 'grayScale()' : null;
    },
  })
  .expressions({
    hasIcon({ icon, svg, src, svgPath }) {
      return icon ?? svg ?? src ?? svgPath;
    },
  })
  .methods({
    focus(...options) {
      if (this.href) {
        this.refs.anchor.focus(...options);
      } else {
        this.refs.control.focus(...options);
      }
    },
  })
  .html`
    <mdw-icon mdw-if={hasIcon} id=icon ink={iconInk} disabled={disabledState}
      outlined={outlined} aria-hidden=true svg={svg} src={src}
      svg-path={svgPath} view-box={viewBox} icon={icon}></mdw-icon>
    <slot id=slot disabled={disabledState} aria-hidden=true>{value}</slot>
  `
  .recompose(({ refs: { anchor, control } }) => {
    control.setAttribute('mdw-if', '{!href}');
    control.setAttribute('role', 'button');
    anchor.setAttribute('mdw-if', '{href}');
    anchor.setAttribute('aria-label', '{_computedAriaLabel}');
    anchor.setAttribute('aria-labelledby', '{_computedAriaLabelledby}');
  })
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-ink: var(--mdw-color__primary);

      --mdw-type__font: var(--mdw-typescale__label-large__font);
      --mdw-type__letter-spacing: var(--mdw-typescale__label-large__letter-spacing);

      display: inline-flex;

      align-items: center;
      gap: 0;
      justify-content: center;
      vertical-align: middle;

      /* box-sizing: border-box; */
      min-block-size: 24px;
      min-inline-size: 24px;

      padding-block: calc(8px + (var(--mdw-density) * 2px));
      padding-inline: calc(12px + (var(--mdw-density) * 2px));

      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }

    :host(:where([elevated],[filled])) {
      will-change: filter;
    }

    /** Elevated Color Defaults */
    :host(:where([elevated])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-ink: var(--mdw-color__primary);
    }
    /** Filled Color Defaults */
    :host(:where([filled])) {
      --mdw-bg: var(--mdw-color__primary);
      --mdw-ink: var(--mdw-color__on-primary);
    }
    /** Filled Tonal Color Defaults */
    :host(:where([filled="tonal"])) {
      --mdw-bg: var(--mdw-color__secondary-container);
      --mdw-ink: var(--mdw-color__on-secondary-container);
    }
    /** Outlined Color Defaults */
    :host(:where([outlined])) {
      --mdw-ink: var(--mdw-color__primary);
    }

    :host(:where([icon])) {
      gap: 8px;

      padding-inline: calc(12px + (var(--mdw-density) * 2px)) calc(16px + (var(--mdw-density) * 2px));
    }

    :host(:where([outlined], [elevated], [filled])) {
      padding-inline: calc(24px + (var(--mdw-density) * 2px));
    }

    :host(:where([icon]):where([outlined], [elevated], [filled])) {
      gap: 8px;

      padding-inline: calc(16px + (var(--mdw-density) * 2px)) calc(24px + (var(--mdw-density) * 2px));
    }

    :host(:where([elevated],[filled],[color])) {
      background-color: rgb(var(--mdw-bg));
    }

    #slot {
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
    }

    #control {
      cursor: pointer;
    }

    #anchor {
      position: absolute;
      inset: 0;

      cursor: pointer;
      outline: none;
    }

    :host([disabled]) {
      /* cursor: not-allowed; */

      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    :host([disabled]:is([elevated], [filled])) {
      background-color: rgba(var(--mdw-color__on-surface), 0.12);
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    #slot[disabled] {
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    #icon {
      font-size: calc(18/14 * 1em);
      font-variation-settings: 'FILL' 1;
    }

    #icon[outlined] {
      font-variation-settings: 'FILL' 0;
    }

    #icon[disabled] {
      opacity: 0.38;

      color: rgba(var(--mdw-color__on-surface));
    }

    #control[form-disabled] {
      cursor: not-allowed;
    }

    @media (any-pointer: coarse) {
      #touch-target {
        visibility: visible;
      }
    }
  `
  .autoRegister('mdw-button');
