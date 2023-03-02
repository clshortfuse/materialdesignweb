import '../components/Icon.js';
import styles from './TextFieldMixin.css' assert { type: 'css' };

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

/**
 * @param {ReturnType<import('./ControlMixin.js').default>} Base
 */
export default function TextFieldMixin(Base) {
  return Base
    .extend()
    .css(styles)
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
      erroredState({ error, _invalid }) { return Boolean(error || _invalid); },
    })
    .expressions({
      computePlaceholder({ filled, outlined, label, placeholder }) {
        if (filled || outlined) return placeholder;
        return placeholder ?? label;
      },

      shouldShowSupporting({ _invalid, error, supporting }) {
        return _invalid || ((error ?? supporting) != null);
      },

      computeSupportingText({ error, _validationMessage, supporting }) {
        return (error || _validationMessage || supporting) ?? '';
      },

      populatedState({ value, _badInput }) {
        return !!value || _badInput;
      },
    })
    .on('composed', ({ template, $, html, inline }) => {
      const control = $('#control');
      control.setAttribute('type', 'text');
      control.setAttribute('placeholder', '{computePlaceholder}');
      control.setAttribute('aria-label', '{label}');
      control.setAttribute('input-suffix', '{inputSuffix}');
      control.setAttribute('errored', '{erroredState}');
      control.removeAttribute('aria-labelledby');
      control.classList.add('inline');

      const labelElement = $('#label');

      labelElement.setAttribute('filled', '{filled}');
      labelElement.setAttribute('color', '{color}');
      labelElement.setAttribute('icon', '{icon}');
      labelElement.setAttribute('trailingIcon', '{trailingIcon}');
      labelElement.setAttribute('populated', '{populatedState}');
      labelElement.setAttribute('outlined', '{outlined}');
      labelElement.setAttribute('focused', '{focusedState}');
      labelElement.setAttribute('hovered', '{hoveredState}');
      labelElement.setAttribute('label', '{label}');
      labelElement.setAttribute('shape-top', inline(({ shapeTop, filled }) => shapeTop || filled));
      labelElement.append(html`
        <mdw-icon _if={icon} id=icon aria-hidden=true disabled={disabledState}>{icon}</mdw-icon>
        <span _if={inputPrefix} class=inline id=prefix aria-hidden=true focused={focusedState} populated={populatedState}>{inputPrefix}</span>
        <span _if={inputSuffix} class=inline id=suffix aria-hidden=true focused={focusedState} populated={populatedState}>{inputSuffix}</span>
        <mdw-icon _if={trailingIcon} id=trailing-icon ink={trailingIconInk} aria-hidden=true disabled={disabledState}>{trailingIcon}</mdw-icon>
        <div id=indicator _if={filled} focused={focusedState} hovered={hoveredState} errored={erroredState} disabled={disabledState} ></div>
      `);

      const outline = $('#outline');
      outline.setAttribute('invalid', '{invalid}');
      outline.setAttribute('errored', '{erroredState}');
      outline.append(html`
        <div id=gap _if={label} label={label} populated={populatedState} focused={focusedState}>
          <div id="gap-slot" focused={focusedState}></div>
          <span id=gap-label>{label}</span>
        </div>
      `);

      $('#outline-left').setAttribute('focused', '{focusedState}');
      $('#outline-right').setAttribute('focused', '{focusedState}');

      $('#state').setAttribute('_if', '{!outlined}');

      template.append(html`
        <div id="label-text" _if=${({ label, filled, outlined }) => label && (filled || outlined)} aria-hidden="true"
          outlined={outlined}
          populated={populatedState}
          focused={focusedState}
          icon={icon}
          trailing-icon={trailingIcon}
          disabled={disabledState}
          errored={erroredState}>{label}</div>
        <div _if={shouldShowSupporting} id=supporting disabled={disabledState} errored={erroredState}>
          {computeSupportingText}
          <slot id=supporting-slot name=supporting></slot>
        </div>
      `);
      console.log(template);
    })
    .on('sizeChanged', (oldValue, newValue, element) => {
      element.refs.control.style.setProperty('--size', `${newValue}ch`);
    });
}
