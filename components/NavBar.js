import SemiStickyMixin from '../mixins/SemiStickyMixin.js';

import Nav from './Nav.js';

export default Nav
  .extend()
  .mixin(SemiStickyMixin)
  .observe({
    _semiStickyAnchor: { empty: 'bottom' },
  })
  .css`
    /* https://m3.material.io/components/navigation-bar/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container);
      
      position: sticky;
      inset-block-end: 0;
      order:1; /* Nav Bars are at top of tab order, but bottom of page */

      display: grid;
      align-content: flex-start;
      align-items: flex-start;
      gap: 8px;

      grid-area: nav-bar;
      grid-auto-columns: minmax(48px, 1fr);
      grid-auto-flow: column;

      overflow: hidden; /* Don't expand viewport when contents translates */

      box-sizing: border-box;
      min-block-size: 80px;
      inline-size: 100%;

      flex-shrink: 0;
      margin-block-start: auto;

      transform: translateY(0);

      text-align: center;

      will-change: transform;
    }

    #slot {
      pointer-events: auto;
    }

  `
  .autoRegister('mdw-nav-bar');
