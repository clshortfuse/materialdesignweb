import NavItem from './NavItem.js';

/**
 * A navigation drawer item represents a destination inside a navigation drawer,
 * showing an icon, label, and optional badge to help users navigate app sections.
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export default NavItem
  .extend()
  .css`
    /* https://m3.material.io/components/navigation-bar/specs */
    /* https://m3.material.io/components/navigation-drawer/specs */
    /* https://m3.material.io/components/navigation-rail/specs */

    :host {
      align-self: stretch;

      display: flex;
      align-items: center;
      gap: 12px;
      grid-template:
        "icon label badge" minmax(56px, min-content)
        / 24px 1fr minmax(0, min-content);
      justify-items: flex-start;

      min-block-size: 56px; 

      padding-inline: 16px 24px;
    }

    #icon {
      grid-area: icon;
    }

    #slot {
      display: block;

      text-align: start;
    }

    :host([active]) {
      color: rgb(var(--mdw-ink));
    }

    #shape {
      max-inline-size: none;
      grid-column: auto;
      grid-row: 1 / 2;
    }

    #badge-text {
      z-index: 1;
    }
  `
  .recompose(({ html, refs: { badge } }) => {
    badge.replaceWith(html`<span id="badge-text">{badge}</span>`);
  })
  .autoRegister('mdw-nav-drawer-item');
