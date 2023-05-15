import NavItem from './NavItem.js';
import Surface from './Surface.js';

export default Surface
  .extend()
  .css/* css */`
    /* https://m3.material.io/components/navigation-bar/specs */
    /* https://m3.material.io/components/navigation-drawer/specs */
    /* https://m3.material.io/components/navigation-rail/specs */

    :host {
      --mdw-ink: var(--mdw-color__on-surface);
      --mdw-bg: var(--mdw-color__surface);

      z-index:2;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-typescale__label-medium__font);
      letter-spacing: var(--mdw-typescale__label-medium__letter-spacing);
    }
  `
  .set({
    elevated: true,
    color: 'surface',
  })
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
  .autoRegister('mdw-nav');
