// https://www.w3.org/TR/wai-aria-practices/#menu

import './Icon.js';

import ListOption from './ListOption.js';
import styles from './MenuItem.css' assert { type: 'css' };

export default ListOption
  .extend()
  .set({
    _cascadeTimeout: null,
    CASCADE_TIMEOUT: 500,
  })
  .observe({
    /** ID of menu to cascade */
    cascades: 'string',
  })
  .expressions({
    computeTrailingIcon({ trailingIcon, cascades }) {
      if (!trailingIcon && cascades) return 'arrow_right';
      return trailingIcon;
    },
  })
  .methods({
    unscheduleCascade() {
      clearTimeout(this._cascadeTimeout);
      this._cascadeTimeout = null;
    },
    scheduleCascade() {
      if (this._cascadeTimeout) return;
      this._cascadeTimeout = setTimeout(this.cascade.bind(this), this.CASCADE_TIMEOUT);
    },
    cascade() {
      this.unscheduleCascade();
      document.getElementById(this.cascades)?.cascade?.(this);
    },
  })
  .css(styles)
  .events({
    mouseenter() {
      if (this.disabled) return;
      if (document.activeElement !== this) {
        this.focus();
      }
      if (!this.cascades) return;
      this.scheduleCascade();
    },
    mouseout: 'unscheduleCascade',
    '~click'() {
      if (this.disabled) return;
      if (this.checkbox != null || this.radio != null) {
        this.selected = !this.selected;
      }
      if (this.cascades) {
        this.cascade();
      }
    },
    keydown(event) {
      if (this.disabled) return;
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.stopPropagation();
          event.preventDefault();
          this.click();
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (!this.cascades) break;
          if (getComputedStyle(this).direction === 'rtl') {
            if (event.key === 'ArrowRight') break;
          } else if (event.key === 'ArrowLeft') break;
          event.stopPropagation();
          event.preventDefault();
          this.cascade();
          break;
        default:
      }
    },
    blur({ relatedTarget }) {
      if (!this.cascades) return;
      if (!relatedTarget) return;
      const submenuElement = document.getElementById(this.cascades);
      if (submenuElement.contains(relatedTarget)) return;
      submenuElement.close(false);
    },
  })
  .on({
    composed({ $, inline, html }) {
      $('#checkbox').remove();
      $('#radio').remove();

      const anchor = $('#anchor');
      anchor.setAttribute('role', inline(({ checkbox, radio }) => {
        if (checkbox != null) return 'menuitemcheckbox';
        if (radio != null) return 'menuitemradio';
        return 'menuitem';
      }));

      // MenuItems use checked instead of selected as in list items.
      anchor.removeAttribute('aria-selected');
      anchor.setAttribute('aria-checked', '{computeAriaSelected}');

      anchor.append(html`
        <mdw-icon id=selection
          _if=${({ checkbox, radio }) => checkbox ?? radio ?? false}
          class=${({ checkbox, radio }) => checkbox || radio || 'leading'}
          selected={selected}>check</mdw-icon>
      `);

      $('#trailing').setAttribute('type-style', 'label-large');
      const trailingIcon = $('#trailing-icon');
      trailingIcon.setAttribute('_if', '{computeTrailingIcon}');
      trailingIcon.textContent = '{computeTrailingIcon}';
    },
  })
  .autoRegister('mdw-menu-item');
