import CustomElement from '../core/CustomElement.js';

const WINDOW_COMPACT_COLUMNS = 4;
const WINDOW_COMPACT_PADDING = 16;
const WINDOW_PADDING = 24;
const SPACER_WIDTH = 24;

const WINDOW_MEDIUM_BREAKPOINT = 600;
const WINDOW_MEDIUM_COLUMNS = 8;
const WINDOW_EXPANDED_BREAKPOINT = 840;
const WINDOW_EXPANDED_COLUMNS = 12;
const WINDOW_EXPANDED_WIDTH_MAX = 1040;
const WINDOW_EXPANDED_PADDING_MAX = 200;

const PANE_FIXED = 360;
const NAV_RAIL_WIDTH = 80;
const NAV_DRAWER_WIDTH = 360;

export default CustomElement
  .extend()
  .observe({
    navRail: 'boolean',
    navDrawer: 'boolean',
    _oneFlexible: 'boolean',
    _oneFixed: 'boolean',
    _twoFlexible: 'boolean',
    _twoFixed: 'boolean',
  })
  .observe({
    hasTwo: {
      type: 'boolean',
      reflect: 'write',
      get({ _twoFlexible, _twoFixed }) {
        return _twoFlexible || _twoFixed;
      },
    },
  })
  .expressions({
    hasNav({ navRail, navDrawer }) {
      return navRail || navDrawer;
    },
  })
  .html/* html */`
    <slot id=slot-rail      name=rail                         nav-drawer={navDrawer} no-two={!hasTwo} has-two={hasTwo} no-two={!hasTwo} slotted={navRail}></slot>
    <slot id=slot-drawer    name=drawer    nav-rail={navRail}                                         has-two={hasTwo} no-two={!hasTwo} slotted={navDrawer}></slot>
    <slot id=slot                          nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav} has-two={hasTwo} no-two={!hasTwo} two-fixed={_twoFixed} two-flexible={_twoFlexible} slotted={_oneFlexible}></slot>
    <slot id=slot-fixed     name=fixed     nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav} has-two={hasTwo} no-two={!hasTwo}                       slotted={_oneFixed}></slot>
    <slot id=slot-two       name=two       nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav}                                   one-fixed={_oneFixed} one-flexible={_oneFlexible} slotted={_twoFlexible}></slot>
    <slot id=slot-two-fixed name=two-fixed nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav}                                                         slotted={_twoFixed}></slot>
  `
  .childEvents({
    slotRail: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.navRail = slotElement.assignedElements().length > 0;
      },
    },
    slotDrawer: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.navDrawer = slotElement.assignedElements().length > 0;
      },
    },
    slot: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this._oneFlexible = slotElement.assignedElements().length > 0;
      },
    },
    slotFixed: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this._oneFixed = slotElement.assignedElements().length > 0;
      },
    },
    slotTwo: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this._twoFlexible = slotElement.assignedElements().length > 0;
      },
    },
    slotTwoFixed: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this._twoFixed = slotElement.assignedElements().length > 0;
      },
    },
  })
  .css/* css */`
    /* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

    /* App bars may be full width or insize panes */

    :host {
      --mdw-pane__columns: 4;
      --mdw-content__max-width: ${WINDOW_MEDIUM_BREAKPOINT}px;
      --mdw-content__padding: ${WINDOW_COMPACT_PADDING}px;
      display: flex;
      /* QOL */
      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    #slot-rail {
      display: none;
    }

    #slot-drawer {
      display: none;
    }

    /* stylelint-disable order/properties-order */

    /* Page margins is based on screen size, not computed */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_PADDING)}px) {
      :host { --mdw-content__padding: ${WINDOW_PADDING}px; }
    }

    /** SINGLE PANE **/

    /** In all configurations, 600px starts at 632px (600+16+16) */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_COMPACT_PADDING)}px) {
      #slot[no-two] { --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS}; }
    }

    /** SINGLE PANE NO NAV */
    /** Once margins hit 24px, allow growth upto 840px */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_PADDING)}px) {
      #slot[no-two][no-nav] { --mdw-content__max-width: ${WINDOW_EXPANDED_BREAKPOINT}px; }
    }

    /** 840px (12-col) at (840 + 24 + 24) */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_PADDING)}px) {
      #slot[no-two][no-nav] { --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS}; }}
    
    /** Clamp at 1040px/200px margin */
    @media screen and (min-width: ${WINDOW_EXPANDED_WIDTH_MAX + (2 * WINDOW_EXPANDED_PADDING_MAX)}px) { 
      #slot[no-two][no-nav] {
        --mdw-content__max-width: ${WINDOW_EXPANDED_WIDTH_MAX}px;
        --mdw-content__padding: ${WINDOW_EXPANDED_PADDING_MAX}px;
      }
    }

    /** SINGLE PANE + NAV RAIL */

    /** If using nav-rail, don't show nav-rail until 600px pane fits (600 + 24 + 24 + 80), then allow growth */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_RAIL_WIDTH}px) {
      #slot-rail[no-two] {
        display: contents;
      }

      #slot[no-two][nav-rail] {
        --mdw-content__max-width: ${WINDOW_EXPANDED_BREAKPOINT}px;
      }
    }

    /** If using nav-rail, 840px (12-col) is reached at (840 + 24 + 24 + 80) */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_RAIL_WIDTH}px) { 
      #slot[no-two][nav-rail] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /** SINGLE PANE + NAV DRAWER - NAV RAIL */

    /** If using nav-drawer, don't show nav-drawer until 600px pane fits (600 + 24 + 24 + 360), then allow growth */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_DRAWER_WIDTH}px) {
      #slot-drawer[no-two]:not([nav-rail]) {
        display: contents;
      }

      #slot[no-two][nav-drawer]:not([nav-rail]) {
        --mdw-content__max-width: ${WINDOW_EXPANDED_BREAKPOINT}px;
      }
    }

    /** SINGLE PANE + NAV DRAWER + NAV RAIL */

    /** If using nav-drawer+nav-rail, don't show nav-drawer until 840px pane fits (840 + 24 + 24 + 360), then allow growth */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_DRAWER_WIDTH}px) { 
      #slot-rail[no-two][nav-drawer] {
        display: none;
      }

      #slot-drawer[no-two][nav-rail] {
        display: contents;
      }

      #slot[no-two][nav-drawer][nav-rail] { 
        --mdw-content__max-width: ${WINDOW_EXPANDED_BREAKPOINT}px;
      }
    }

    /** SINGLE PANE + NAV DRAWER +-NAV RAIL */

    /** If using nav-drawer, allow  nav-drawer until 840 pane fits (840 + 24 + 24 + 360), then allow growth */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_EXPANDED_WIDTH_MAX) + NAV_DRAWER_WIDTH}px) { 
      #slot[no-two][nav-drawer][nav-drawer] { 
        --mdw-content__padding: ${WINDOW_EXPANDED_PADDING_MAX}px;
        --mdw-content__max-width: ${WINDOW_EXPANDED_WIDTH_MAX}px;
      }
    }
    

    /** TWO-PANE */

    
    /** Inline-end pane is stickied */
    #slot-two, #slot-two-fixed {
      display: none;
      position: sticky;
      inset: 0;
      block-size: 100vh;
      overflow-y: auto;
      --mdw-content__padding: 0;
    }
    
    /** TWO-PANE does not kick in until 24 + 360 + 24 + 360 + 24 */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + (2 * PANE_FIXED)}px) { 
      /* Apply padding+spacer to host */
      :host([has-two]) {
        padding-inline: ${WINDOW_PADDING}px;
        gap: ${SPACER_WIDTH}px;
      }

      /* Remove padding from pane one */
      #slot[has-two], #slot-fixed {
        --mdw-content__padding: 0;
      }

      /* Stick pane two */
      #slot-two[slotted], #slot-two-fixed[slotted] {
        display: block;
      }

      /* Flexible */
      #slot[has-two], #slot-two {
        --mdw-content__max-width: 100vw;
        flex: 1;
      }

      /* Fixed */
      #slot-fixed, #slot-two-fixed {
        --mdw-pane__columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-content__max-width: ${PANE_FIXED}px;
      }

      #slot-fixed, #slot-two-fixed {
        --mdw-pane__min-width: ${PANE_FIXED}px;
        --mdw-pane__max-width: ${PANE_FIXED}px;
      }
    }

    /** TWO-PANE NO NAV */

    /* Flexible+Fixed Medium */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + PANE_FIXED + WINDOW_MEDIUM_BREAKPOINT}px) { 
      #slot[has-two][two-fixed][no-nav], #slot-two[one-fixed][no-nav] {
        --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Flexible+Fixed Expanded */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + PANE_FIXED + WINDOW_EXPANDED_BREAKPOINT}px) { 
      #slot[has-two][two-fixed][no-nav], #slot-two[one-fixed][no-nav] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /* Flexible+Flexible Medium */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + (2 * WINDOW_MEDIUM_BREAKPOINT)}px) { 
      #slot[has-two][two-flexible][no-nav], #slot-two[one-flexible][no-nav] {
        --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Flexible+Flexible Expanded */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + (2 * WINDOW_EXPANDED_BREAKPOINT)}px) { 
      #slot[has-two][two-flexible][no-nav], #slot-two[one-flexible][no-nav] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /** TWO PANE NAV RAIL */

    /* Flexible+Fixed+Rail Medium */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * PANE_FIXED) + NAV_RAIL_WIDTH}px) { 
      #slot-rail[has-two] {
        display: contents;
      }
      :host([nav-rail][has-two]) {
        padding-inline-start: 0;
      }
    }

    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_MEDIUM_BREAKPOINT + NAV_RAIL_WIDTH}px) { 
      #slot[has-two][two-fixed][nav-rail], #slot-two[one-fixed][nav-rail] {
        --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Flexible+Fixed+Rail Expanded */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_EXPANDED_BREAKPOINT + NAV_RAIL_WIDTH}px) { 
      #slot[has-two][two-fixed][nav-rail], #slot-two[one-fixed][nav-rail] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /* Flexible+Flexible+Rail Medium */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_MEDIUM_BREAKPOINT) + NAV_RAIL_WIDTH}px) { 
      #slot[has-two][two-flexible][nav-rail], #slot-two[one-flexible][nav-rail] {
        --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Flexible+Flexible+Rail Expanded */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_EXPANDED_BREAKPOINT) + NAV_RAIL_WIDTH}px) {
      #slot[has-two][two-flexible][nav-rail], #slot-two[one-flexible][nav-rail] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /** TWO PANE NAV DRAWER */

    /* Flexible+Fixed+Drawer Medium */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * PANE_FIXED) + NAV_DRAWER_WIDTH}px) { 
      #slot-rail[has-two][nav-drawer] {
        display: none;
      }
      #slot-drawer[has-two] {
        display: contents;
      }
      :host([nav-drawer][has-two]) {
        padding-inline-start: 0;
      }
    }

    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_MEDIUM_BREAKPOINT + NAV_DRAWER_WIDTH}px) { 
      #slot[has-two][two-fixed][nav-drawer], #slot-two[one-fixed][nav-drawer] {
        --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Flexible+Fixed+Drawer Expanded */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_EXPANDED_BREAKPOINT + NAV_DRAWER_WIDTH}px) { 
      #slot[has-two][two-fixed][nav-drawer], #slot-two[one-fixed][nav-drawer] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /* Flexible+Flexible+Drawer Medium */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_MEDIUM_BREAKPOINT) + NAV_DRAWER_WIDTH}px) { 
      #slot[has-two][two-flexible][nav-drawer], #slot-two[one-flexible][nav-drawer] {
        --mdw-pane__columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Flexible+Flexible+Drawer Expanded */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_EXPANDED_BREAKPOINT) + NAV_DRAWER_WIDTH}px) {
      #slot[has-two][two-flexible][nav-drawer], #slot-two[one-flexible][nav-drawer] {
        --mdw-pane__columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    

  `
  .autoRegister('mdw-layout');
