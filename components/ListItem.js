// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import './CheckboxIcon.js';
import './RadioIcon.js';
import './Divider.js';
import './Icon.js';

import CustomElement from '../core/CustomElement.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(AriaReflectorMixin)
  .set({
    _ariaRole: 'listitem',
    delegatesFocus: false,
    stateLayer: true,
  })
  .observe({
    leading: 'string',
    avatar: 'string',
    avatarColor: { value: 'primary-container' },
    avatarSrc: 'string',
    src: 'string',
    alt: 'string',
    icon: 'string',
    href: 'string',
    iconInk: 'string',
    iconSrc: 'string',
    checkbox: 'string',
    radio: 'string',
    selectionColor: { value: 'primary' },
    selected: 'boolean',
    supporting: 'string',
    trailing: 'string',
    trailingIcon: 'string',
    trailingIconInk: 'string',
    trailingIconSrc: 'string',
    divider: 'boolean',
    video: 'boolean',
    lines: 'integer',
    _supportingSlotted: 'boolean',
  })
  .observe({
    // Alias since not form-associated
    disabledState({ disabled }) {
      return disabled;
    },

  })
  .expressions({
    isInteractive({ href }) {
      return href != null;
    },
    hasSupporting() {
      return Boolean(this.supporting || this._supportingSlotted);
    },
    checkboxClass() {
      return this.checkbox || 'leading';
    },
    radioClass() {
      return this.radio || 'leading';
    },
  })
  .html`
    <a id=anchor mdw-if={href} href={href} disabled={disabledState} aria-labelledby=content></a>
    <mdw-checkbox-icon id=checkbox mdw-if={checkbox} aria-hidden=true class={checkboxClass} color={selectionColor} disabled={disabledState} icon=check selected={selected}></mdw-checkbox-icon>
    <mdw-radio-icon id=radio mdw-if={radio} aria-hidden=true class={radioClass} disabled={disabledState} ink={selectionColor} selected={selected}></mdw-radio-icon>
    <mdw-box mdw-if={avatar} id=avatar color={avatarColor} type-style=title-medium src={AvatarSrc}
      aria-hidden=true>{avatar}</mdw-box>
    <mdw-icon mdw-if={icon} id=icon ink={iconInk} src={iconSrc} aria-hidden=true icon={icon}></mdw-icon>
    <img id=img mdw-if={src} src={src} alt={alt} video={video} />
    <slot name=leading>{leading}</slot>
    <div id=content has-supporting={hasSupporting} lines={lines}>
      <slot id=slot></slot>
      <slot id=supporting name=supporting class=text lines={lines}>{supporting}</slot>
    </div>
    <mdw-icon mdw-if={trailingIcon} id=trailing-icon ink={trailingIconInk} src={trailingIconSrc} aria-hidden=true icon={trailingIcon}></mdw-icon>
    <slot id=trailing name=trailing role=note>{trailing}</slot>
    <mdw-divider mdw-if={divider} id=divider divder={divider}></mdw-divider>
  `
  .recompose(({ refs: { state, rippleContainer, anchor } }) => {
    anchor.append(
      state,
      rippleContainer,
    );
    state.setAttribute('state-disabled', 'focus hover');
  })
  .on({
    disabledStateChanged(oldValue, newValue) {
      this.updateAriaProperty('ariaDisabled', newValue ? 'true' : 'false');
    },
  })
  .css`
    /* https://m3.material.io/components/lists/specs */

    :host {
      --mdw-shape__size: 0px;
      /* Grid does not auto collapse columns, leaving gaps */

      display: flex;
      align-items: center;
      gap: 16px;

      border: none;
      padding-block: 8px;
      padding-inline: 16px 24px;

      cursor: auto;

      outline: none;

      color: inherit;

      text-decoration: none;
    }

    :host([href]) {
      cursor: pointer;
    }

    #anchor {
      position: absolute;
      inset: 0;

      outline: none;

      color: inherit;

    }

    :host([video]) {
      padding-inline-start: 0;
    }

    :host([lines="3"]) {
      align-items: flex-start;

      padding-block: 12px;
    }

    #content {
      display: inline-flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;

      flex: 1;

      padding-block: calc(8px + (var(--mdw-density) * 2px));
    }

    #content:is([has-supporting], [lines="2"]) {
      box-sizing: border-box;
      min-block-size: calc(8px + calc(48px + var(--mdw-density) * 2px));
      padding-block: calc(4px + var(--mdw-density) * 2px);
    }

    #content:is([lines="3"]) {
      box-sizing: border-box;
      min-block-size: calc(8px + calc(48px + var(--mdw-density) * 2px));
      padding-block: calc(0 + var(--mdw-density) * 2px);
    }

    #icon {
      font-size: 24px;
    }

    #trailing-icon {
      font-size: 24px;
    }

    #divider {
      position: absolute;
      inset-block-end: 0;

      display: block;

      color: rgb(var(--mdw-color__surface-container-highest));
    }

    #divider[divider="inset"] {
      padding-inline: 16px 24px;
    }

    #slot {
      max-block-size: var(--mdw-typescale__body-large__line-height) * 2;

      /* background-color: rgba(255,0,0,0.10); */

      color: var(--mdw-color__on-surface);

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    #supporting {
      max-block-size: calc(var(--mdw-typescale__body-medium__line-height) * 2);

      /* background-color: rgba(0,255,0,0.10); */

      color: var(--mdw-color__on-surface-variant);

      font: var(--mdw-typescale__body-medium__font);
      letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);
    }

    #trailing {
      color: var(--mdw-color__on-surface-variant);

      font: var(--mdw-typescale__body-medium__font);
      letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);
    }

    #slot, #supporting {
      display: block;
      overflow-x: hidden;
      overflow-y: hidden;

      text-align: start;
      text-overflow: ellipsis;
      text-transform: none;
      white-space: normal;
      word-break: break-word;
    }

    #supporting[lines="2"] {
      min-block-size: var(--mdw-typescale__body-medium__line-height);
      max-block-size: var(--mdw-typescale__body-medium__line-height);
    }

    #supporting[lines="3"] {
      min-block-size: calc(var(--mdw-typescale__body-medium__line-height) * 2);
      max-block-size: calc(var(--mdw-typescale__body-medium__line-height) * 2);
    }

    @supports(width: 1lh) {
      #slot {
        max-block-size: 1lh;
      }

      #supporting {
        max-block-size: 2lh;
      }

      #supporting[lines="2"] {
        min-block-size: 1lh;
        max-block-size: 1lh;
      }

      #supporting[lines="3"] {
        min-block-size: 2lh;
        max-block-size: 2lh;
      }
    }

    @supports(-webkit-line-clamp:1) {
      #slot {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      #supporting {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      #supporting[lines="2"] {
        -webkit-line-clamp: 1;
      }
    }

    #avatar {
      display: flex;
      align-items: center;
      justify-content: center;

      block-size: 40px;
      inline-size: 40px;

      border-radius: 50%;
    }

    #img {
      block-size: 56px;
      max-block-size: 56px;
      inline-size: 56px;
      max-inline-size: 56px;

      object-fit: cover;
      object-position: center center;
    }

    #img[video] {
      block-size: 64px;
      max-block-size: 64px;
      inline-size: 114px;
      max-inline-size: 114px;
    }

    #checkbox {
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin: 3px;
    }

    #radio {
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin: 2px;
    }

    .trailing {
      order: 1;
    }

    :host([disabled]) {
      opacity: 0.38;

      color: rgb(var(--mdw-color__on-surface));
    }
  `
  .childEvents({
    supporting: {
      /** @param {Event & {currentTarget: HTMLSlotElement}} event */
      slotchange({ currentTarget }) {
        this._supportingSlotted = currentTarget.assignedNodes().length !== 0;
      },
    },
  })
  .autoRegister('mdw-list-item');
