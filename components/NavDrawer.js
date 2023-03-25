import NavRail from './NavRail.js';

export default NavRail
  .extend()
  .observe({
    shapeEnd: {
      type: 'boolean',
      empty: true,
    },
  })
  .css`
    /* https://m3.material.io/components/navigation-drawer/specs */

    :host([open]) {
      --mdw-surface__tint: var(--mdw-surface__tint__0);
      --mdw-surface__tint__raised: var(--mdw-surface__tint__1);
      --mdw-shape__size: var(--mdw-shape__large, 16px);
      --mdw-shape__size__top-start-size: 0px;
      --mdw-shape__size__bottom-start-size: 0px;

      --mdw-nav-item__badge__position: static;
      --mdw-nav-item__badge__transform: none;
      --mdw-nav-item__badge__grid-area: badge;
      --mdw-nav-item__label__padding-block: 18px;
      --mdw-nav-item__label__padding-inline: 52px 0;
      --mdw-nav-item__anchor__display: block;
      --mdw-nav-item__indicator__grid-area: auto;

      display: block;
      grid-template-rows: min-content;
      grid-template-columns: minmax(360px, min-content);

      min-inline-size: 360px;
      padding-inline: 12px;

      box-shadow: none;

    }

    #slot {
      gap: 0;
    }

  `
  .autoRegister('mdw-nav-drawer');
