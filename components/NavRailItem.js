/* https://m3.material.io/components/navigation-rail/specs */

import NavItem from './NavItem.js';

/**
 * A navigation rail item represents a destination within a navigation rail,
 * showing an icon and optional label for vertical navigation on larger screens.
 * @see https://m3.material.io/components/navigation-rail/specs
 */
export default NavItem
  .extend()
  .css`
    :host {
      grid-auto-flow: row;
      grid-auto-rows: minmax(20px, auto);
      grid-template-rows: [icon] minmax(32px, 1fr);
      grid-template-columns: [icon] minmax(72px, 1fr);

      min-block-size: 56px;
      flex: none;
      padding-inline: 4px;

      font: var(--mdw-typescale__label-medium__font);
      letter-spacing: var(--mdw-typescale__label-medium__letter-spacing);
    }

    #slot {
      display: contents;
      overflow-wrap: anywhere;

      word-break: break-all;
      word-break: break-word;
    }

    #badge {
      max-inline-size:40px;
      grid-column: 1 / 2;
    }
  `
  .autoRegister('mdw-nav-rail-item');
