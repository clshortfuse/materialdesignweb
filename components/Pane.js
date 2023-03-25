import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .observe({
    columns: 'integer',
    flexible: 'boolean',
    fixed: 'boolean',
    split: 'boolean',
    navDrawer: 'boolean',
    navRail: 'boolean',
  })
  .html/* html */`
    <slot id=slot></slot>
  `
  .css`
    /* https://m2.material.io/design/layout/responsive-layout-grid.html#columns-gutters-and-margins */
    /*
    * Window breakpoints
    * Compact (0 <= width < 600px):
    *   * Single: 100vw - padding
    *   * Padding: 16px
    *   * Spacer: 0 (none)
    * Medium (600px <= width < 840px)
    *   * Single: 100vw - padding - (?navrail)
    *   * [Fixed]: 360px
    *   * [Flexable]: 100vw - 360px - spacer - padding
    *   * [Split] 50vw - ((padding + spacer) / 2)
    *   * Padding: 24px
    *   * Spacer: 24px
    * Expanded (840px <= width)
    *   * Single: 100vw - padding - (?navrail | ?navdrawer)
    *   * [Fixed] 360px
    *   * [Flexable] 100vw - 360px - spacer - padding - (?navrail | ?navdrawer)
    *   * [Split] 50vw - ((padding + spacer + (?navrail | ?navdrawer)) / 2)
    *   * Padding: 24px
    *   * Spacer: 24px
    *
    * | Screen size         | Margin  | Body    | Layout columns |
    * |---------------------|---------|---------|----------------|
    * | Extra-small (phone) |         |         |                |
    * | 0-631dp             | 16dp    | Scaling | 4              |
    * | 632 - 647           | Scaling | 600dp   | 8              |
    * | Small (tablet)      |         |         |                |
    * | 648-887             | 24dp    | Scaling | 8              |
    * | 888-1239            | Scaling | 840dp   | 12             |
    * | Medium (laptop)     |         |         |                |
    * | 1240-1439           | 200dp   | Scaling | 12             |
    * | Large (desktop)     |         |         |                |
    * | 1440+               | Scaling | 1040    | 12             |
    *
    *
    * Column count is pane-based, not window based requiring newly computed values.
    * Gutters are irrelevant to pane sizing.
    * Nav Rail is ~80px.
    * Nav Drawer is ~360px.
    * Padding and spacers are set by pane's parent.
    * Avoid using CSS Variables because panes are at top of document tree. https://bugs.chromium.org/p/chromium/issues/detail?id=1056209
    * Container queries would reduce code considerably.
    */

    /* Compact */
    :host {
      display: grid;
      align-content: flex-start;
      gap: 16px;
      grid-auto-flow: row;
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;

      flex: 1;

      transition-duration: 200ms;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      transition-property: visibility, width, max-inline-size;
    }

    /* Will set 8col when window is 600px + padding (2x16) */
    /* Will set 12col when window is 840px + padding (2x24) */
    @media screen and (min-width: 632px) { :host { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 888px) { :host { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) */
    @media screen and (min-width: 648px) { :host { max-inline-size: 840px } }
    @media screen and (min-width: 1240px) { :host { max-inline-size: 1040px; } }

    /* NAVRAIL */

    :host([nav-rail]) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + navrail (80)  */
    /* Will set 12col when window is 840px + padding (2x24) + navrail (80) */
    @media screen and (min-width: 728px) { :host([nav-rail]) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 968px) { :host([nav-rail]) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to  840px when window is 600px + padding (2x24px) + navrail (80) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + navrail (80) */
    @media screen and (min-width: 728px) { :host([nav-rail]) { max-inline-size: 840px } }
    @media screen and (min-width: 1320px) { :host([nav-rail]) { max-inline-size: 1040px; } }

    /* NAVDRAWER */

    :host([nav-drawer]) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + navdrawer (360)  */
    /* Will set 12col when window is 840px + padding (2x24) + navdrawer (360) */
    @media screen and (min-width: 1008px) { :host([nav-rail]) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 1248px) { :host([nav-rail]) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to  840px when window is 600px + padding (2x24px) + navrail (360) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + navrail (360) */
    @media screen and (min-width: 1008px) { :host([nav-rail]) { max-inline-size: 840px } }
    @media screen and (min-width: 1600px) { :host([nav-rail]) { max-inline-size: 1040px; } }

    /* FLEXIBLE */

    :host([flexible]) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + spacer (24) + fixed (360)  */
    /* Will set 12col when window is 840px + padding (2x24) + spacer (24) + fixed (360) */
    @media screen and (min-width: 1032px) { :host([flexible]) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 1272px) { :host([flexible]) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) + spacer (24) + fixed (360) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + spacer (24) + fixed (360) */
    @media screen and (min-width: 1032px) { :host([flexible]) { max-inline-size: 840px } }
    @media screen and (min-width: 1624px) { :host([flexible]) { max-inline-size: 1040px; } }

    /* FLEXIBLE + NAV RAIL */

    :host([flexible]:where([nav-rail])) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + spacer (24) + fixed (360) + navrail (80)   */
    /* Will set 12col when window is 840px + padding (2x24) + spacer (24) + fixed (360) + navrail (80) */
    @media screen and (min-width: 1112px) { :host([flexible]:where([nav-rail])) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 1352px) { :host([flexible]:where([nav-rail])) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) + spacer (24) + fixed (360) + navrail (80) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + spacer (24) + fixed (360) + navrail (80) */
    @media screen and (min-width: 1112px) { :host([flexible]:where([nav-rail])) { max-inline-size: 840px } }
    @media screen and (min-width: 1704px) { :host([flexible]:where([nav-rail])) { max-inline-size: 1040px; } }

    /* FLEXIBLE + NAV DRAWER */

    :host([flexible]:where([nav-drawer])) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + spacer (24) + fixed (360) + navdrawer (360)   */
    /* Will set 12col when window is 840px + padding (2x24) + spacer (24) + fixed (360) + navdrawer (360) */
    @media screen and (min-width: 1392px) { :host([flexible]:where([nav-drawer])) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 1632px) { :host([flexible]:where([nav-drawer])) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) + spacer (24) + fixed (360) + navdrawer (360) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + spacer (24) + fixed (360) + navdrawer (360) */
    @media screen and (min-width: 1392px) { :host([flexible]:where([nav-drawer])) { max-inline-size: 840px } }
    @media screen and (min-width: 1984px) { :host([flexible]:where([nav-drawer])) { max-inline-size: 1040px; } }

    /* SPLIT */

    :host([split]) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + spacer (24) + split (600)  */
    /* Will set 12col when window is 840px + padding (2x24) + spacer (24) + split (840) */
    @media screen and (min-width: 1272px) { :host([split]) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 1752px) { :host([split]) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) + spacer (24) + split (600) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + spacer (24) + split (840) */
    @media screen and (min-width: 1272px) { :host([split]) { max-inline-size: 840px } }
    @media screen and (min-width: 2104px) { :host([split]) { max-inline-size: 1040px; } }

    /* SPLIT + NAVRAIL */

    :host([split]:where([nav-rail])) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + spacer (24) + split (600) + navrail (80) */
    /* Will set 12col when window is 840px + padding (2x24) + spacer (24) + split (840) + navrail (80) */
    @media screen and (min-width: 1352px) { :host([split]:where([nav-rail])) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 1832px) { :host([split]:where([nav-rail])) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) + spacer (24) + split (600) + navrail (80) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + spacer (24) + split (840) + navrail (80) */
    @media screen and (min-width: 1352px) { :host([split]:where([nav-rail])) { max-inline-size: 840px } }
    @media screen and (min-width: 2184px) { :host([split]:where([nav-rail])) { max-inline-size: 1040px; } }

    /* SPLIT + NAVDRAWER */

    :host([split]:where([nav-drawer])) {
      grid-template-columns: repeat(4, 1fr);

      max-inline-size: 600px;
    }

    /* Will set  8col when window is 600px + padding (2x24) + spacer (24) + split (600) + navdrawer (360)  */
    /* Will set 12col when window is 840px + padding (2x24) + spacer (24) + split (840) + navdrawer (360) */
    @media screen and (min-width: 1632px) { :host([split]:where([nav-drawer])) { grid-template-columns: repeat(8, 1fr); } }
    @media screen and (min-width: 2112px) { :host([split]:where([nav-drawer])) { grid-template-columns: repeat(12, 1fr); } }

    /* Will cap to 840px when window is 600px + padding (2x24px) + spacer (24) + split (600) + navdrawer (360) */
    /* Will cap to 1040px when window is 840px + padding (2x200px) + spacer (24) + split (840) + navdrawer (360) */
    @media screen and (min-width: 1632px) { :host([split]:where([nav-drawer])) { max-inline-size: 840px } }
    @media screen and (min-width: 2464px) { :host([split]:where([nav-drawer])) { max-inline-size: 1040px; } }

    :host([full-width]) {
      max-inline-size: none;
    }

    /** FIXED **/

    :host([fixed]) {
      grid-template-columns: repeat(4, 1fr);

      inline-size:360px;
    }

    @media screen and (max-width: 600px) {
      :host(:nth-of-type(2)) {
        display: none;
      }
    }
    /* Will cap to 360px when window is 360px + padding (2x24px) + spacer (24) + 360px */
    @media screen and (min-width: 792px) {
      :host([fixed]) {
        max-inline-size: 360px
      }
    }

    #scrim {
      position: absolute;
      inset: 0;

      grid-area: auto;
    }

    #slot::slotted(*) { grid-column: 1 / none }
    #slot::slotted([colspan="1"]) { grid-column-end: span 1; }
    #slot::slotted([colspan="2"]) { grid-column-end: span 2; }
    #slot::slotted([colspan="3"]) { grid-column-end: span 3; }
    #slot::slotted([colspan="4"]) { grid-column-end: span 4; }
    #slot::slotted([colspan="5"]) { grid-column-end: span 5; }
    #slot::slotted([colspan="6"]) { grid-column-end: span 6; }
    #slot::slotted([colspan="7"]) { grid-column-end: span 7; }
    #slot::slotted([colspan="8"]) { grid-column-end: span 8; }
    #slot::slotted([colspan="9"]) { grid-column-end: span 9; }
    #slot::slotted([colspan="10"]) { grid-column-end: span 10; }
    #slot::slotted([colspan="11"]) { grid-column-end: span 11; }
    #slot::slotted([colspan="12"]) { grid-column-end: span 12; }

  `
  .autoRegister('mdw-pane');
