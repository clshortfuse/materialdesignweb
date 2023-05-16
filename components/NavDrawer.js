import NavRail from './NavRail.js';

export default NavRail
  .extend()
  .observe({
    shapeEnd: {
      type: 'boolean',
      empty: true,
    },
  })
  .css/* css */`
    /* https://m3.material.io/components/navigation-drawer/specs */
    :host {
      --mdw-shape__size: var(--mdw-shape__large, 16px);
      --mdw-shape__size__top-start-size: 0px;

      --mdw-nav-item__badge__position: static;
      --mdw-nav-item__badge__transform: none;
      --mdw-nav-item__badge__grid-area: badge;
      --mdw-nav-item__label__padding-block: 18px;
      --mdw-nav-item__label__padding-inline: 52px 0;
      --mdw-nav-item__anchor__display: block;
      --mdw-nav-item__indicator__grid-area: auto;
      --mdw-bg: var(--mdw-color__surface-container-low);

      display: inline-grid;
      grid-template-columns: 1fr;

      min-inline-size: 360px;
      max-inline-size: 360px;
      padding-inline: 0;

      box-shadow: none;
    }

    #slot {
      gap: 0;

      inline-size: auto;
      padding-inline: 12px;
    }

  `
  .autoRegister('mdw-nav-drawer');
