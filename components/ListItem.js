// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import checkboxIconStyles from './CheckboxIcon.css' assert { type: 'css'};
import styles from './ListItem.css' assert { type: 'css' };
import radioIconStyles from './RadioIcon.css' assert { type: 'css'};
import Ripple from './Ripple.js';

export default class ListItem extends Ripple {
  static elementName = 'mdw-list-item';

  static ariaRole = 'listitem';

  static delegatesFocus = true;

  static styles = [...super.styles, checkboxIconStyles, radioIconStyles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <a id=anchor href={href}>
        <mdw-container _if={checkbox} class="leading checkbox-box" id=checkbox color={selectionColor} aria-hidden="true">
          <mdw-icon id=checkbox-icon class="checkbox-icon" selected={_selected} disabled={disabled}>check</mdw-icon>
        </mdw-container>
        <mdw-text _if={radio} id=radio class=radio-icon selected={_selected} disabled={disabled} ink={selectionColor}
          aria-hidden="true"></mdw-text>
        <mdw-container _if={avatar} class=leading id=avatar color={avatarColor} type-style=title-medium src={AvatarSrc}
          aria-hidden="true">{avatar}</mdw-container>
        <mdw-icon _if={icon} class=leading id=icon ink={iconInk} src={iconSrc} aria-hidden=true>{icon}</mdw-icon>
        <img id=img _if={src} class=leading src={src} alt={alt} />
        <slot id=leading-slot name=leading><span _if={leading} id=leading-text class=leading>{leading}</span></slot>
        <div id=content href={href}>
          <mdw-text block id=headline type-style=body-large ink=on-surface>
            <slot id=headline-slot name=headline><span id=headline-text class=text>{text}</span></slot>
          </mdw-text>
          <mdw-text block id=supporting type-style=body-medium ink=on-surface-variant>
            <slot id=supporting-slot name=supporting><span _if={supporting} id=supporting-text class=text>{supporting}</span>
            </slot>
          </mdw-text>
        </div>
        <mdw-icon _if={trailingIcon} class=trailing id=trailing-icon ink={trailingIconInk} src={trailingIconSrc}
          aria-hidden=true>{trailingIcon}</mdw-icon>
        <mdw-text block id=trailing type-style=label-small ink=on-surface-variant>
          <slot id=trailing-slot name=trailing><span _if={trailing} id=trailing-text class="trailing text">{trailing}</span>
          </slot>
        </mdw-text>
      </a>
      <mdw-divider _if={divider} id=divider></mdw-divider>
    `,
  ];

  static get template() {
    const template = super.template;
    template.getElementById('headline-text').append(
      template.getElementById('slot'),
    );
    template.getElementById('overlay').setAttribute('overlay-disabled', 'focus hover');
    return template;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'checkbox':
        if (newValue) {
          this.setAttribute('aria-selected', String(this.hasAttribute('selected')));
        } else {
          this.removeAttribute('aria-selected');
        }
        break;
      case 'checked':
        // /** @type {Checkbox} */ (this.refs.checkbox) = newValue;
        this.setAttribute('aria-selected', String(newValue));
        break;
      default:
    }
  }
}

ListItem.prototype.leading = ListItem.idl('leading');

ListItem.prototype.avatar = ListItem.idl('avatar');
ListItem.prototype.avatarColor = ListItem.idl('avatarColor', { default: 'primary-container' });
ListItem.prototype.avatarSrc = ListItem.idl('avatarSrc');
ListItem.prototype.src = ListItem.idl('src');
ListItem.prototype.alt = ListItem.idl('alt');
ListItem.prototype.text = ListItem.idl('text', { onNullish: String });
ListItem.prototype.icon = ListItem.idl('icon');
ListItem.prototype.href = ListItem.idl('href');
ListItem.prototype.iconInk = ListItem.idl('iconInk');
ListItem.prototype.iconSrc = ListItem.idl('iconSrc');
ListItem.prototype.checkbox = ListItem.idl('checkbox', { type: 'boolean' });
ListItem.prototype.radio = ListItem.idl('radio', { type: 'boolean' });
ListItem.prototype.selectionColor = ListItem.idl('selectionColor', { default: 'primary' });
ListItem.prototype.checked = ListItem.idl('checked', { attr: 'selected', type: 'boolean' });

ListItem.prototype.supporting = ListItem.idl('supporting');
ListItem.prototype.trailing = ListItem.idl('trailing');
ListItem.prototype.trailingIcon = ListItem.idl('trailingIcon');
ListItem.prototype.trailingIconSrc = ListItem.idl('trailingIconSrc');
ListItem.prototype.divider = ListItem.idl('divider', { type: 'boolean' });
