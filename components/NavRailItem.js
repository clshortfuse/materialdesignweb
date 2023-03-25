/* https://m3.material.io/components/navigation-rail/specs */

import NavItem from './NavItem.js';

export default NavItem
  .extend()
  .css`
    :host {
      grid-auto-flow: row;
      grid-auto-rows: minmax(20px, min-content);
      grid-template-rows: [icon] minmax(32px, 1fr);
      grid-template-columns: [icon] minmax(56px, 1fr);

      padding-inline: 12px;
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
