import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

import styles from './Button.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(DensityMixin)
  .mixin(InputMixin) // Label as root
  .mixin(SurfaceMixin) // Surface as root
  .mixin(ShapeMixin) // Surface as root
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(TouchTargetMixin)
  .extend()
  .define({
    stateTargetElement() { return this.refs.control; },
  })
  .set({
    stateLayer: true,
  })
  .observe({
    type: { value: 'button' },
    elevated: 'boolean',
    filled: 'string',
    outlined: 'boolean',
    icon: 'string',
    iconInk: 'string',
    src: 'string',
    svg: 'string',
    svgPath: 'string',
  })
  .expressions({
    hasIcon({ icon, svg, src, svgPath }) {
      return icon ?? svg ?? src ?? svgPath;
    },
  })
  .css(styles)
  .html/* html */`
    <mdw-icon _if={hasIcon} id=icon ink={iconInk} disabled={disabledState} outlined={outlined} aria-hidden="true" svg={svg} src="{src}" svg-path={svgPath}>{icon}</mdw-icon>
    <slot id=slot disabled={disabledState}></slot>
  `
  .on({
    composed() {
      const { label, surfaceTint, outline, surface, control, touchTarget, shape } = this.refs;
      label.classList.add('surface');

      label.setAttribute('raised', '{_raised}');
      label.setAttribute('hovered', '{hoveredState}');
      label.setAttribute('pressed', '{pressedState}');
      label.append(shape);

      outline.before(surfaceTint);

      surface.remove();

      // slot.before(icon);
      // slot.setAttribute('disabled', '{disabledState}');
      shape.setAttribute('ink', '{ink}');
      shape.setAttribute('type-style', '{typeStyle}');
      shape.setAttribute('icon', '{hasIcon}');
      shape.setAttribute('color', '{color}');
      // label.setAttribute('elevated', '{elevated}');
      shape.setAttribute('filled', '{filled}');
      shape.setAttribute('disabled', '{disabledState}');
      shape.setAttribute('outlined', '{outlined}');
      control.setAttribute('role', 'button');
      control.setAttribute('type', 'button');
      shape.before(touchTarget);
      touchTarget.append(control);
    },
  })
  .childEvents({
    control: {
    /**
     * Duplicates button for form submission
     * @see https://github.com/WICG/webcomponents/issues/814
     * @param {{currentTarget:HTMLInputElement}} event
     * @type {any}
     */
      '~click'({ currentTarget }) {
        if (currentTarget.disabled) return;
        if (currentTarget.type !== 'submit') return;
        if (this.disabled) return;
        const { value } = currentTarget;
        const form = this.elementInternals?.form;
        if (!form) return;
        this.elementInternals.setFormValue(value);
        if ((currentTarget.type ?? 'submit') !== 'submit') return;
        const duplicatedButton = /** @type {HTMLInputElement} */ (currentTarget.cloneNode());
        duplicatedButton.hidden = true;
        form.append(duplicatedButton);
        if ('requestSubmit' in form) {
          form.requestSubmit(duplicatedButton);
        } else {
          duplicatedButton.click();
        }
        duplicatedButton.remove();
      },
    },
  })
  .autoRegister('mdw-button');
