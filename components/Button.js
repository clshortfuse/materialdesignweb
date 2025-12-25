import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/* https://m3.material.io/components/buttons/specs */

/**
 * Buttons prompt most actions in a UI.
 * @see https://m3.material.io/components/buttons/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(DensityMixin)
  .mixin(StateMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .mixin(HyperlinkMixin)
  .define({
    /**
     * Returns the element used as the state target for visual states
     * (e.g., pressed/hover). Typically the internal control element.
     * @return {HTMLElement}
     */
    stateTargetElement() { return this.refs.control; },
  })
  .set({
    stateLayer: true,
    _allowedTypes: ['button', 'submit', 'reset', 'file'],
  })
  .observe({
    /** The underlying control `type` (button, submit, reset, file). */
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
    /** Bound to [elevated] specifying whether the element should be elevated. */
    elevated: 'boolean',
    /** Visual filled variant; may be "tonal" or boolean-filled token. */
    filled: 'string',
    /** Whether the button should render an outline. */
    outlined: 'boolean',
    /** Icon name (uses internal `mdw-icon` when set). */
    icon: 'string',
    /** Ink color override for the icon. */
    iconInk: 'string',
    // Overrides to string instead of DOMString
    /** Image source URL for an icon. */
    src: 'string',
    /** Inline SVG markup to render as icon. */
    svg: 'string',
    /** SVG `viewBox` attribute for inline SVG icons. */
    viewBox: 'string',
    /** Path data for an inline SVG icon. */
    svgPath: 'string',
  })
  .expressions({
    hasIcon({ icon, svg, src, svgPath } = this) {
      return icon ?? svg ?? src ?? svgPath;
    },
    iconVariation({ outlined } = this) {
      return outlined ? null : 'filled';
    },
  })
  .methods({
    /** @type {HTMLElement['focus']} */
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
      outlined={outlined} variation={iconVariation} aria-hidden=true svg={svg} src={src}
      svg-path={svgPath} view-box={viewBox} icon={icon}></mdw-icon>
    <slot id=slot disabled={disabledState} aria-hidden=true>{_defaultValue}</slot>
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
      transition: box-shadow 200ms;
      will-change: box-shadow;
    }

    /** Elevated Color Defaults */
    :host(:where([elevated])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      --mdw-ink: var(--mdw-color__primary);
      box-shadow: var(--mdw-elevation__box-shadow__1);
    }
    /** Filled Color Defaults */
    :host(:where([filled])) {
      --mdw-bg: var(--mdw-color__primary);
      --mdw-ink: var(--mdw-color__on-primary);
      box-shadow: var(--mdw-elevation__box-shadow__0);
    }

    :host(:where([elevated]:hover:not(:active))) {
      box-shadow: var(--mdw-elevation__box-shadow__2);
    }

    :host(:where([filled]:hover:not(:active))) {
      box-shadow: var(--mdw-elevation__box-shadow__1);
    }

    :host(:where([elevated]:disabled)) {
      box-shadow: var(--mdw-elevation__box-shadow__0);
    }

    :host(:where([filled]:disabled)) {
      box-shadow: var(--mdw-elevation__box-shadow__0);
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
        visibility: inherit;
      }
    }
  `
  .autoRegister('mdw-button');
