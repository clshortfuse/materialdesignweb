import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Button.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(DensityMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .extend()
  .define({
    stateTargetElement() { return this.refs.control; },
  })
  .set({
    stateLayer: true,
    delegatesFocus: true,
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
    <mdw-icon _if={hasIcon} id=icon ink={iconInk} disabled={disabledState} outlined={outlined} aria-hidden=true svg={svg} src={src} svg-path={svgPath}>{icon}</mdw-icon>
    <slot id=slot disabled={disabledState}></slot>
  `
  .on({
    composed() {
      const {
        shape, surfaceTint, state, rippleContainer,
        surface, control, label, slot,
        icon,
      } = this.refs;
      surface.append(shape);
      shape.append(state, rippleContainer, surfaceTint);
      label.append(icon, slot);

      shape.setAttribute('filled', '{filled}');
      control.setAttribute('role', 'button');
      control.setAttribute('type', 'button');
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
