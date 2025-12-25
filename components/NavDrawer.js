import SideSheet from './SideSheet.js';

/**
 * Navigation drawers provide access to destinations and app-level navigation
 * in a side panel. They can be modal, dismissible, or permanent depending on
 * viewport and application needs.
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export default SideSheet
  .extend()
  .observe({
    /** When true, apply drawer shape at the end edge (RTL-aware). */
    shapeEnd: {
      type: 'boolean',
      empty: true,
    },

    /**
     * Viewport width in pixels at or above which the drawer auto-opens.
     * Use `-1` to disable auto-open. Default: 1248.
     */
    autoOpen: {
      type: 'float',
      empty: 1248,
    },

    /**
     * Fixed layout breakpoint in pixels for permanent/dismissible drawer modes.
     * Default: 1248.
     */
    fixedBreakpoint: {
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
