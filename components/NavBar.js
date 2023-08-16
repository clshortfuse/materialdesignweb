import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import NavItem from './NavItem.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .set({
    color: 'surface-container',
    _ariaRole: 'navigation',
  })
  .html`<slot id=slot></slot>`
  .css`
    /* https://m3.material.io/components/navigation-bar/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);

      display: grid;
      align-content: flex-start;
      align-items: flex-start;
      gap: 8px;

      grid-auto-columns: minmax(48px, 1fr);
      grid-auto-flow: column;

      overflow: hidden; /* Don't expand viewport when contents translates */

      box-sizing: border-box;
      min-block-size: 80px;
      inline-size: 100%;

      background-color: rgb(var(--mdw-bg));

      color: rgb(var(--mdw-ink));

      font: var(--mdw-typescale__label-medium__font);
      letter-spacing: var(--mdw-typescale__label-medium__letter-spacing);

      text-align: center;
    }
  `
  .events({
    '~click'(event) {
      // Abort if not child
      if (event.target === this) return;
      if (event.target instanceof NavItem === false) return;
      for (const el of this.querySelectorAll('*')) {
        if (el instanceof NavItem === false) continue;
        el.active = (el === event.target);
      }
    },
  })
  .autoRegister('mdw-nav-bar');
