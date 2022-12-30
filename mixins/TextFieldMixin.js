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
    .observe({
      type: { empty: 'text' },
      icon: 'string',
      label: 'string',
      filled: 'boolean',
      outlined: 'boolean',
      inputPrefix: 'string',
      inputSuffix: 'string',
      trailingIcon: 'string',
      supporting: 'string',
      error: 'string',
      _populated: { attr: 'populated', type: 'boolean' },
      placeholder: { nullParser: String }, // DOMString
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
    })
    .on('composed', ({ template, $, html }) => {
      const control = $('#control');
      control.setAttribute('type', 'text');
      control.setAttribute('placeholder', '{computePlaceholder}');
      control.setAttribute('aria-labelledby', 'label-text');
      control.classList.add('inline');

      $('#label').append(html`
        <mdw-icon _if={icon} id=icon aria-hidden=true>{icon}</mdw-icon>
        <span _if={inputPrefix} class=inline id=prefix aria-hidden=true>{inputPrefix}</span>
        <span _if={inputSuffix} class=inline id=suffix aria-hidden=true>{inputSuffix}</span>
        <mdw-icon _if={trailingIcon} id=trailing-icon aria-hidden=true>{trailingIcon}</mdw-icon>
        <div _if={filled} id=indicator></div>
        <div id=outline>
          <div id=gap>
            <div _if=${({ label, filled, outlined }) => label && (filled || outlined)} id=label-text>
              {label}
              ${$('#slot')}
            </div>
          </div>
        </div>
      `);

      template.append(html`
        <div _if={shouldShowSupporting} id=supporting>
          {computeSupportingText}
          <slot id=supporting-slot name=supporting></slot>
        </div>
      `);

      $('#ripple').remove();
    })
    .on('valueChanged', (oldValue, newValue, element) => {
      element._populated = !!element.value || element._badInput;
    })
    .on('_badInputChanged', (oldValue, newValue, element) => {
      element._populated = !!element.value || element._badInput;
    })
    .on('sizeChanged', (oldValue, newValue, element) => {
      element.refs.control.style.setProperty('--size', `${newValue}ch`);
    });
}
