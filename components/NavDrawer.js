import SideSheet from './SideSheet.js';

export default SideSheet
  .extend()
  .observe({
    shapeEnd: {
      type: 'boolean',
      empty: true,
    },
    autoOpen: {
      type: 'float',
      empty: 1248,
    },
    modalBreakpoint: {
      type: 'float',
      empty: 1248,
    },
  })
  .css`
    /* https://m3.material.io/components/navigation-drawer/specs */
    :host {
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
      --mdw-bg: var(--mdw-color__surface-container-low);

      display:inline-block;

      inline-size: 360px;
      max-inline-size: calc(100vw - 56px);
      padding-inline: 12px;
    }

    ::slotted(mdw-divider) {
      padding-inline: 16px;
    }

  `
  .autoRegister('mdw-nav-drawer');
