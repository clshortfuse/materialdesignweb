import NavItem from './NavItem.js';

export default NavItem
  .extend()
  .css`
    /* https://m3.material.io/components/navigation-bar/specs */
    /* https://m3.material.io/components/navigation-drawer/specs */
    /* https://m3.material.io/components/navigation-rail/specs */

    :host {
      grid-auto-rows: minmax(20px, min-content);
      grid-template-rows: [icon] minmax(32px, 1fr);
      grid-template-columns: auto [icon] minmax(56px, 1fr) auto;

      padding-block: 12px; /* Spec 16px bottom is based on 1em not 1lh */
    }

    #slot {
      display: block;
    }

    :host(:empty) {
      font-size: 0;
      line-height: 0;
    }

    #slot[show-label] {
      grid-column: 1 /4;

      grid-row: 2;

      opacity: 0;
    }

    #shape {
      grid-column: 2;
      grid-row: 1 / 1;
    }

    #slot[show-label="never"] {
      block-size: 0;
    }

    #slot[show-label="active"][active] {
      opacity: 1;
    }

  `
  .autoRegister('mdw-nav-bar-item');
