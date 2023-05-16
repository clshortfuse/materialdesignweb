import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    _navRail: 'boolean',
    _twoPanes: 'boolean',
    _navDrawer: 'boolean',
    _navBar: 'boolean',
    _topAppBar: 'boolean',
    _single: 'boolean',
    _noNav: 'boolean',
    flexibleFixed: 'boolean',
    fixedFlexible: 'boolean',
  })
  .expressions({
    splitPane({ flexibleFixed, fixedFlexable, _twoPanes }) {
      return _twoPanes && !flexibleFixed && !fixedFlexable;
    },
  })
  .html/* html */`
    <slot id=slot
      nav-rail={_navRail} nav-bar={_navBar} no-nav={_noNav} top-app-bar={_topAppBar}
      nav-drawer={_navDrawer} single={_single}
      flexible-fixed={flexibleFixed} fixed-flexible={fixedFlexible} split-pane={splitPane}
      two-panes={_twoPanes}
      ></slot>
  `
  .childEvents({
    slot: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        let onePane = false;
        let _navRail = false;
        let _twoPanes = false;
        let _navBar = false;
        let _navDrawer = false;
        let _topAppBar = false;
        let _single = false;
        let _noNav = true;

        for (const el of slotElement.assignedElements()) {
          switch (el.tagName) {
            case 'MDW-NAV-RAIL':
              _navRail = true;
              _single = false;
              _noNav = false;
              break;
            case 'MDW-PANE':
              _twoPanes = onePane;
              onePane = true;
              _single = !_twoPanes;
              break;
            case 'MDW-NAV-BAR':
              _navBar = true;
              _single = false;
              _noNav = false;
              break;
            case 'MDW-NAV-DRAWER':
              _navDrawer = true;
              _single = false;
              _noNav = false;
              break;
            case 'MDW-TOP-APP-BAR':
              _topAppBar = true;
              break;
            default:
          }
        }
        Object.assign(this, {
          _navDrawer,
          _navRail,
          _twoPanes,
          _navBar,
          _topAppBar,
          _single,
          _noNav,
        });
      },
    },
  })
  .css/* css */`
    /* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

    /* App bars may be full width or insize panes */

    :host {
      --mdw-pane__columns: 4;
      --mdw-content__max-width: 600px;
      --mdw-content__padding: 16px;
      display: flex;
      /* QOL */
      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    #slot[nav-rail]::slotted(mdw-nav-rail) {
      display: none;
    }

    #slot[nav-drawer]::slotted(mdw-nav-drawer) {
      display: none;
      position: sticky;
    }

    /* stylelint-disable order/properties-order */

    /* 
     * Pane is 600px (8 col) when:
     *   632 - padding-inline-start (16) + pane (600) + padding-inline-end (16)
     *   728 - navrail (80) + gap (24) + pane (600) + padding-inline-end (24)
     *   1008 - navdrawer (360) + gap (24) + pane (600) + padding-inline-end (24)

     *   1032 - padding-inline-start (24) + pane (600) + gap (24) + fixed (360) + padding-inline-end (24)
     *   1112 - navrail (80) + gap (24) + pane (600) + gap (24) + fixed (360) + padding-inline-end (24)
     *   1392 - navdrawer (360) + gap (24) + pane (600) + gap (24) + fixed (360) + padding-inline-end (24)

     *   1272 - padding-inline-start (24) + pane (600) + gap (24) + pane (600) + padding-inline-end (24)
     *   1352 - navrail (80) + gap (24) + pane (600) + gap (24) + pane (600) + padding-inline-end (24)
     *   1632 - navdrawer (360) + gap (24) + pane (600) + gap (24) + pane (600) + padding-inline-end (24)
     */

    /* Page margins is based on screen size, not computed */
    @media screen and (min-width: 648px) {
      #slot[single]::slotted(mdw-pane) {
        --mdw-content__padding: 24px;
      }
    }

    /** SINGLE PANE **/

    /** In all configurations, 600px starts at 632px (600+16+16) */
    @media screen and (min-width: 632px) { #slot[single]::slotted(mdw-pane) { --mdw-pane__columns: 8; } }

    /** SINGLE PANE NO NAV */
    /** Once margins hit 24px, allow growth upto 840px */
    @media screen and (min-width: 648px) { #slot[single][no-nav]::slotted(mdw-pane) { --mdw-content__max-width: 840px; } }

    /** 840px (12-col) at (840 + 24 + 24) */
    @media screen and (min-width: 888px) { #slot[single][no-nav]::slotted(mdw-pane) {  
      --mdw-pane__columns: 12;
    }}
    
    /** Clamp at 1040px/200px margin */
    @media screen and (min-width: 1240px) { #slot[single][no-nav]::slotted(mdw-pane) { 
      --mdw-content__max-width: 1040px;
      --mdw-content__padding: 200px;
    }}

    /** SINGLE PANE + NAV RAIL */

    /** If using nav-rail, don't show nav-rail until 600px pane fits (600 + 24 + 24 + 80), then allow growth */
    @media screen and (min-width: 728px) { 
      #slot[single][nav-rail]::slotted(mdw-nav-rail) {
        display: grid;
      }

      #slot[single][nav-rail]::slotted(mdw-pane) { 
        --mdw-content__max-width: 840px;
      }
    }

    /** If using nav-rail, 840px (12-col) is reached at (840 + 24 + 24 + 80) */
    @media screen and (min-width: 968px) { 
      #slot[single][nav-rail]::slotted(mdw-pane) { 
        --mdw-pane__columns: 12;
      }
    }

    /** SINGLE PANE + NAV DRAWER - NAV RAIL */

    /** If using nav-drawer, don't show nav-drawer until 600px pane fits (600 + 24 + 24 + 360), then allow growth */
    @media screen and (min-width: 1008px) { 
      #slot[single][nav-drawer]:not([nav-rail])::slotted(mdw-nav-drawer) {
        display: grid;
      }

      #slot[single][nav-drawer]:not([nav-rail])::slotted(mdw-pane) { 
        --mdw-content__max-width: 840px;
      }
    }

    /** SINGLE PANE + NAV DRAWER + NAV RAIL */

    /** If using nav-drawer+nav-rail, don't show nav-drawer until 840px pane fits (840 + 24 + 24 + 360), then allow growth */
    @media screen and (min-width: 1248px) { 
      #slot[single][nav-drawer][nav-rail]::slotted(mdw-nav-rail) {
        display: none;
      }

      #slot[single][nav-drawer][nav-rail]::slotted(mdw-nav-drawer) {
        display: grid;
      }

      #slot[single][nav-drawer][nav-rail]::slotted(mdw-pane) { 
        --mdw-content__max-width: 840px;
      }
    }

    /** SINGLE PANE + NAV DRAWER +-NAV RAIL */

    /** If using nav-drawer, allow  nav-drawer until 840 pane fits (840 + 24 + 24 + 360), then allow growth */
    @media screen and (min-width: 1600px) { 
      #slot[single][nav-drawer][nav-drawer]::slotted(mdw-pane) { 
        --mdw-content__padding: 200px;
        --mdw-content__max-width: 1040px;
      }
    }
    
    /** TWO-PANE FLEX+FIXED */

    /** TWO-PANE NO-NAV */

    
    /** Inline-end pane is stickied */
    #slot[two-panes]::slotted(mdw-pane:last-of-type) {
      display: none;
      position: sticky;
      inset: 0;
      block-size: 100vh;
      overflow-y: auto;
      margin-inline-end: 24px;
    }
    
    /** TWO-PANE does not kick in until 24 + 360 + 24 + 360 + 24 */
    @media screen and (min-width: 792px) { 
      #slot[two-panes]::slotted(mdw-pane:last-of-type) {
        display: block;
      }

      #slot[flexible-fixed]::slotted(mdw-pane:first-of-type),
      #slot[fixed-flexible]::slotted(mdw-pane:last-of-type) {
        --mdw-content__padding: 24px;
        --mdw-content__max-width: 100vw;
      }

      #slot[flexible-fixed]::slotted(mdw-pane:last-of-type),
      #slot[fixed-flexible]::slotted(mdw-pane:first-of-type) {
        
        --mdw-pane__columns: 4;
        --mdw-content__max-width: 360px;
        --mdw-content__padding: 0;
        max-inline-size: 360px;
        flex-basis: 360px;
      }
    }

  `
  .autoRegister('mdw-layout');
