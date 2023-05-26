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
    navBar: 'boolean',
    navRail: 'boolean',
    navDrawer: 'boolean',
    oneFlexible: 'boolean',
    oneFixed: 'boolean',
    twoFlexible: 'boolean',
    twoFixed: 'boolean',
    paneTwoActive: 'boolean',
  })
  .observe({
    hasTwo: {
      type: 'boolean',
      reflect: 'write',
      get({ twoFlexible, twoFixed }) {
        return twoFlexible || twoFixed;
      },
    },
    singlePane: {
      type: 'boolean',
      reflect: 'write',
      get({ oneFlexible, oneFixed, twoFlexible, twoFixed }) {
        return (oneFlexible || oneFixed) && !(twoFlexible || twoFixed);
      },
    },
  })
  .expressions({
    hasNav({ navRail, navDrawer, navBar }) {
      return navRail || navDrawer || navBar;
    },
  })
  .html/* html */`
    <slot id=slot-nav-rail  name=rail      nav-drawer={navDrawer}                  has-two={hasTwo} single-pane={singlePane}                                                 slotted={navRail}    ></slot>
    <slot id=slot-drawer    name=drawer    nav-rail={navRail}                                         has-two={hasTwo} single-pane={singlePane}                                                 slotted={navDrawer}  ></slot>
    <slot id=slot-app-bar   name=app-bar   nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav} has-two={hasTwo} single-pane={singlePane} two-fixed={twoFixed} two-flexible={twoFlexible}                      ></slot>
    <slot id=slot                          nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav} has-two={hasTwo} single-pane={singlePane} two-fixed={twoFixed} two-flexible={twoFlexible} slotted={oneFlexible}></slot>
    <slot id=slot-fixed     name=fixed     nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav} has-two={hasTwo} single-pane={singlePane}                                                 slotted={oneFixed}   ></slot>
    <slot id=slot-two       name=two       nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav}                                           one-fixed={oneFixed} one-flexible={oneFlexible} slotted={twoFlexible}></slot>
    <slot id=slot-two-fixed name=two-fixed nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav}                                                                                           slotted={twoFixed}   ></slot>
    <slot id=slot-nav-bar   name=nav-bar   nav-rail={navRail} nav-drawer={navDrawer} no-nav={!hasNav} has-two={hasTwo} single-pane={singlePane} two-fixed={twoFixed} two-flexible={twoFlexible}></slot>
  `
  .childEvents({
    slotNavRail: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.navRail = slotElement.assignedElements().length > 0;
      },
    },
    slotNavBar: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.navBar = slotElement.assignedElements().length > 0;
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
        this.oneFlexible = slotElement.assignedElements().length > 0;
      },
    },
    slotFixed: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.oneFixed = slotElement.assignedElements().length > 0;
      },
    },
    slotTwo: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.twoFlexible = slotElement.assignedElements().length > 0;
      },
    },
    slotTwoFixed: {
      slotchange({ target }) {
        const slotElement = /** @type {HTMLSlotElement} */ (target);
        this.twoFixed = slotElement.assignedElements().length > 0;
      },
    },
  })
  .css/* css */`
    /* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

    /* App bars may be full width or insize panes */

    /** Simple block layout on compact */

    :host {
      --mdw-grid__columns: ${WINDOW_COMPACT_COLUMNS};
      --mdw-layout__pane1-columns: 4;
      --mdw-layout__pane2-columns: 4;
      --mdw-content__max-width: ${WINDOW_EXPANDED_WIDTH_MAX}px;
      --mdw-content__padding: ${WINDOW_COMPACT_PADDING}px;
      --mdw-layout__spacer-width: ${SPACER_WIDTH}px;
      --mdw-layout__nav-drawer__ratio: 0;
      --mdw-layout__nav-drawer-width: ${NAV_DRAWER_WIDTH}px;
      --mdw-layout__nav-rail__ratio: 0;
      --mdw-layout__nav-rail-width: ${NAV_RAIL_WIDTH}px;
      --mdw-layout__pane1-width: 1fr;
      --mdw-layout__pane2-width: 0;
      --mdw-layout__pane2-visibility: hidden;
      --mdw-layout__window-padding: ${WINDOW_COMPACT_PADDING}px;
      --mdw-layout__nav-drawer__visibility: hidden;

      display: grid;
      grid-template-rows: auto 1fr auto;
      grid-template-columns:
        calc(var(--mdw-layout__nav-drawer-width) * var(--mdw-layout__nav-drawer__ratio))
        calc(var(--mdw-layout__nav-rail-width) * var(--mdw-layout__nav-rail__ratio))
        var(--mdw-layout__window-padding)
        var(--mdw-layout__pane1-width)
        var(--mdw-layout__window-padding)
        var(--mdw-layout__pane2-width) 0;
      grid-template-areas: 
        "nav-drawer nav-rail app-bar app-bar app-bar pane2 ."
        "nav-drawer nav-rail .       pane1   .       pane2 ."
        "nav-drawer nav-rail nav-bar nav-bar nav-bar nav-bar .";
      overflow-x: hidden;

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    

    #slot-app-bar {
      display: contents; /* Allow sticky */
    }

    #slot-nav-bar {
      display: var(--mdw-layout__nav-bar__display, contents);
      grid-area: nav-bar;
    }

    #slot, #slot-fixed {
      --mdw-grid__columns: var(--mdw-layout__pane1-columns);
      box-sizing: content-box;
      inline-size: 100%;
      max-inline-size: var(--mdw-content__max-width, auto);
      margin-inline: auto;
      grid-area: pane1;
    }

    

    #slot-nav-rail {
      display: var(--mdw-layout__nav-rail__display, none);
      grid-area: nav-rail;
    }

    #slot-drawer {
      display: block;
      grid-area: nav-drawer;

      visibility: var(--mdw-layout__nav-drawer__visibility);
    }

    #slot[slotted], #slot-fixed[slotted] {
      display: block;
    }

    #slot-two, #slot-two-fixed {
      --mdw-content__padding: 0;
      --mdw-grid__columns: var(--mdw-layout__pane2-columns);
      grid-area: pane2;

      visibility: var(--mdw-layout__pane2-visibility);
    }

    :host(:where([pane-two-active])) {
      --mdw-layout__pane2-visibility: visible;
      grid-template-areas: 
        "nav-drawer nav-rail app-bar app-bar app-bar pane1 ."
        "nav-drawer nav-rail .       pane2   .       pane1 ."
        "nav-drawer nav-rail nav-bar nav-bar nav-bar nav-bar .";
    }

    #slot-two[active], #slot-two-fixed[active] {
      inset-inline-end: 0;

      box-sizing: border-box;
      inline-size: 100%;
      padding-inline: var(--mdw-content__padding);

      visibility: visible;
    }

    #slot-two[slotted], #slot-two-fixed[slotted] {
      display: block;
    }

    /* stylelint-disable order/properties-order */

    /**
    * Prefer content to navigation (eg: Don't shrink content for nav)
    * Prefer 2nd pane always
    * Breakpoints ( x = 16,  | = 24 )
    * - Nav       Pane1    Pane2    Columns             Nav Detail Content Width  Use?
    * - Modal     4col              x 0 x                 0      0       0     0  YES
    * - Rail      4col              80 x 360 x           80      0     360   472  NO
    * - Modal     8col              x 600 x               0      0     600   632  YES
    * - Modal     8col              | 600 |               0      0     600   648  YES
    * - Rail      8col              80 | 600 |           80      0     600   728  YES
    * - Drawer    4col              360 | 360 |         360      0     360   768  NO
    * - Modal     4col     4col     | 360 | 360 |       360    360     720   792  YES
    * - Modal     Fixed    4col     | 360 | 360 |       360    360     720   792  YES
    * - Rail      4col     4col     80 | 360 | 360 |     80    360     720   872  YES
    * - Rail      Fixed    4col     80 | 360 | 360 |     80    360     720   872  YES
    * - Modal     12col             | 840 |               0      0     840   888  If Single Pane + No Rail
    * - Rail      12col             80 | 840 |           80      0     840   920  If Single Pane
    * - Drawer    8col              360 | 600 |         360      0     600  1008  NO (Loses Content)
    * - Modal     Fixed    8col     | 360 | 600 |         0    600     960  1032  If No Rail
    * - Rail      Fixed    8col     80 | 360 | 600 |     80    600     960  1112  YES
    * - Drawer    4col     4col     360 | 360 | 360 |   360    360     720  1152  NO (Modal 4/4 has more content)
    * - Drawer    Fixed    4col     360 | 360 | 360 |   360    360     720  1152  NO (Modal F/8 has more content)
    * - Drawer    12col             360 | 840 |         360      0     840  1248  If Single Pane
    * - Modal     8col     8col     | 600 | 600 |         0    600    1200  1272  *If No Rail
    * - Modal     Fixed    12col    | 360 | 840 |         0    840    1200  1272  *If No Rail
    * - Rail      8col     8col     80 | 600 | 600 |     80    600    1200  1352  YES
    * - Rail      Fixed    12col    80 | 360 | 840 |     80    840    1200  1352  YES
    * - Drawer    Fixed    8col     360 | 360 | 600 |   360    600     960  1392  *If No Rail
    * - Drawer    8col     8col     360 | 600 | 600 |   360    600     720  1632  *If No Rail
    * - Drawer    Fixed    12col    360 | 360 | 840 |   360    840    1200  1632  YES
    * - Modal     12col    12col    | 840 | 840 |         0    840    1680  1752  If No Rail + No Nav Drawer
    * - Rail      12col    12col    80 | 840 | 840 |     80    840    1680  1832  If No Drawer
    * - Drawer    12col    12col    360 | 840 | 840 |   360    840    1680  2112  YES
    */

    
    /**
    * SORTED
    * - Nav       Pane1    Pane2    Columns             Nav Detail Content Width  Use?
    * - Modal     4col              x 0 x                 0      0       0     0  YES
    * - Modal     8col              x 600 x               0      0     600   632  YES
    * - Modal     8col              | 600 |               0      0     600   648  YES
    * - Modal     12col             | 840 |               0      0     840   888  If Single Pane + No Rail
    * - Rail      4col              80 x 360 x           80      0     360   472  NO
    * - Rail      8col              80 | 600 |           80      0     600   728  YES
    * - Rail      12col             80 | 840 |           80      0     840   920  If Single Pane
    * - Drawer    4col              360 | 360 |         360      0     360   768  NO
    * - Drawer    8col              360 | 600 |         360      0     600  1008  NO (Loses Content)
    * - Drawer    12col             360 | 840 |         360      0     840  1248  If Single Pane
    * - Modal     4col     4col     | 360 | 360 |       360    360     720   792  YES
    * - Modal     8col     8col     | 600 | 600 |         0    600    1200  1272  *If No Rail
    * - Modal     12col    12col    | 840 | 840 |         0    840    1680  1752  If No Rail + No Nav Drawer
    * - Modal     Fixed    4col     | 360 | 360 |       360    360     720   792  YES
    * - Modal     Fixed    8col     | 360 | 600 |         0    600     960  1032  If No Rail
    * - Modal     Fixed    12col    | 360 | 840 |         0    840    1200  1272  *If No Rail
    * - Drawer    4col     4col     360 | 360 | 360 |   360    360     720  1152  NO (Modal 4/4 has more content)
    * - Drawer    8col     8col     360 | 600 | 600 |   360    600     720  1632  *If No Rail
    * - Drawer    Fixed    8col     360 | 360 | 600 |   360    600     960  1392  *If No Rail
    * - Rail      4col     4col     80 | 360 | 360 |     80    360     720   872  YES
    * - Rail      8col     8col     80 | 600 | 600 |     80    600    1200  1352  YES
    * - Rail      12col    12col    80 | 840 | 840 |     80    840    1680  1832  If No Drawer
    * - Rail      Fixed    4col     80 | 360 | 360 |     80    360     720   872  YES
    * - Rail      Fixed    8col     80 | 360 | 600 |     80    600     960  1112  YES
    * - Rail      Fixed    12col    80 | 360 | 840 |     80    840    1200  1352  YES
    * - Drawer    12col    12col    360 | 840 | 840 |   360    840    1680  2112  YES
    * - Drawer    Fixed    4col     360 | 360 | 360 |   360    360     720  1152  NO (Modal F/8 has more content)
    * - Drawer    Fixed    12col    360 | 360 | 840 |   360    840    1200  1632  YES
    */

    /* Single Pane Modal */

    /** Modal 8 (632) */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_COMPACT_PADDING)}px) {
      :host {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Modal 8 (648) */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_PADDING)}px) {
      :host { 
        --mdw-layout__window-padding: ${WINDOW_PADDING}px;
        --mdw-content__padding: ${WINDOW_PADDING}px;
        /* --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS}; */
      }
    }

    /** Modal 12 (888) */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_PADDING)}px) {
      :host {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /** Rail 8 (728) */
    @media screen and (min-width: ${WINDOW_MEDIUM_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_RAIL_WIDTH}px) {
      :host(:where([nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-drawer__visibility: hidden;
        --mdw-layout__nav-drawer__ratio: 0;
        --mdw-layout__nav-rail__display: block;
        --mdw-layout__nav-rail__ratio: 1;
      }
    }

    /** Rail 12 (920) */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_RAIL_WIDTH}px) {
      :host(:where([nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-rail__display: block;
        --mdw-layout__nav-rail__ratio: 1;
      }
    }

    /** Drawer 12 (1248) */
    @media screen and (min-width: ${WINDOW_EXPANDED_BREAKPOINT + (2 * WINDOW_PADDING) + NAV_DRAWER_WIDTH}px) {
      :host(:where([nav-drawer])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-drawer__visibility: visible;
        --mdw-layout__nav-drawer__ratio: 1;
        --mdw-layout__nav-rail__display: none;
        --mdw-layout__nav-rail__ratio: 0;
      }
    }

    /* Modal 4 / 4 (792) */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + (2 * PANE_FIXED)}px) { 
      /* Apply padding+spacer to host */
      :host(:where([has-two])) {
        --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__nav-bar__display: contents;
        --mdw-layout__nav-drawer__visibility: hidden;
        --mdw-layout__nav-drawer__ratio: 0;
        --mdw-layout__nav-rail__display: none;
        --mdw-layout__nav-rail__ratio: 0;
        --mdw-layout__pane2-width: 1fr;
        --mdw-layout__pane2-visibility: visible;

        grid-template-areas: 
        "nav-drawer nav-rail app-bar app-bar app-bar pane2 ."
        "nav-drawer nav-rail .       pane1   .       pane2 ."
        "nav-drawer nav-rail nav-bar nav-bar nav-bar nav-bar .";
        grid-template-columns:
          calc(var(--mdw-layout__nav-drawer-width) * var(--mdw-layout__nav-drawer__ratio))
          calc(var(--mdw-layout__nav-rail-width) * var(--mdw-layout__nav-rail__ratio))
          var(--mdw-layout__window-padding)
          var(--mdw-layout__pane1-width)
          var(--mdw-layout__spacer-width)
          var(--mdw-layout__pane2-width)
          var(--mdw-layout__window-padding);
      }

      #slot-two, #slot-two-fixed {
        visibility: var(--mdw-layout__pane2-visibility);
        position: sticky;
        inset: 0;
        block-size: 100vh;
        overflow-y: auto;
      }

      /* Modal Fixed / 4 (792) */
      :host(:where([has-two][one-fixed])) {
        --mdw-layout__pane1-width: ${PANE_FIXED}px;
      }

      :host(:where([has-two][two-fixed])) {
        --mdw-layout__pane2-width: ${PANE_FIXED}px;
      }
    }

    /* Modal 8 / 8  (1272) */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + (2 * WINDOW_MEDIUM_BREAKPOINT)}px) {
      :host(:where([has-two])) {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Modal 12 / 12 (1752) */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + (2 * WINDOW_EXPANDED_BREAKPOINT)}px) {
      :host(:where([has-two])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }
    

    /* Modal Fixed / 8 (1032) */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + PANE_FIXED + WINDOW_MEDIUM_BREAKPOINT}px) {
      :host(:where([has-two][one-fixed])) {
        --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_MEDIUM_COLUMNS};
      }

      :host(:where([has-two][two-fixed])) {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS};
      }
    }

    /* Modal Fixed / 12 (1272) */
    @media screen and (min-width: ${(2 * WINDOW_PADDING) + SPACER_WIDTH + PANE_FIXED + WINDOW_EXPANDED_BREAKPOINT}px) {
      :host(:where([has-two][one-fixed])) {
        /* --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS}; */
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
      }

      :host(:where([has-two][two-fixed])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        /* --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS}; */
      }
    }

    /* Drawer 8 / 8 (872) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_MEDIUM_BREAKPOINT) + NAV_DRAWER_WIDTH}px) { 
      :host(:where([has-two][nav-drawer])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-drawer__visibility: visible;
        --mdw-layout__nav-drawer__ratio: 1;
      }
    }

    /* Drawer Fixed / 8 (1032) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_MEDIUM_BREAKPOINT + NAV_DRAWER_WIDTH}px) {
      :host(:where([has-two][one-fixed][nav-drawer])) {
        --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_MEDIUM_COLUMNS};
      }

      :host(:where([has-two][two-fixed][nav-drawer])) {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS};
      }
    }

    /* Rail 4 / 4 (872) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * PANE_FIXED) + NAV_RAIL_WIDTH}px) { 
      :host(:where([has-two][nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-drawer__visibility: hidden;
        --mdw-layout__nav-drawer__ratio: 0;
        --mdw-layout__nav-rail__display: block;
        --mdw-layout__nav-rail__ratio: 1;
      }
    }

    /* Rail 8 / 8 (872) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_MEDIUM_BREAKPOINT) + NAV_RAIL_WIDTH}px) { 
      :host(:where([has-two][nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_MEDIUM_COLUMNS};
      }
    }

    /* Rail 12 / 12 (872) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_EXPANDED_BREAKPOINT) + NAV_RAIL_WIDTH}px) { 
      :host(:where([has-two][nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

    /* Rail Fixed / 8 (1032) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_MEDIUM_BREAKPOINT + NAV_RAIL_WIDTH}px) {
      :host(:where([has-two][one-fixed][nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_MEDIUM_COLUMNS};
      }

      :host(:where([has-two][two-fixed][nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS};
      }
    }

    /* Rail Fixed / 12 (1032) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_EXPANDED_BREAKPOINT + NAV_RAIL_WIDTH}px) {
      :host(:where([has-two][one-fixed][nav-rail])) {
        /* --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS}; */
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
      }

      :host(:where([has-two][two-fixed][nav-rail])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        /* --mdw-layout__pane2-columns: ${WINDOW_COMPACT_COLUMNS}; */
      }
    }

    /* Drawer 12 / 12 (872) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + (2 * WINDOW_EXPANDED_BREAKPOINT) + NAV_DRAWER_WIDTH}px) { 
      :host(:where([has-two][nav-drawer])) {
        --mdw-layout__pane1-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-drawer__visibility: visible;
        --mdw-layout__nav-drawer__ratio: 1;
        --mdw-layout__nav-rail__display: none;
        --mdw-layout__nav-rail__ratio: 0;
      }
    }

    /* Drawer Fixed / 12 (1032) */
    @media screen and (min-width: ${WINDOW_PADDING + (2 * SPACER_WIDTH) + PANE_FIXED + WINDOW_EXPANDED_BREAKPOINT + NAV_DRAWER_WIDTH}px) {
      :host(:where([has-two][nav-drawer])) {
        --mdw-layout__nav-bar__display: none;
        --mdw-layout__nav-drawer__visibility: visible;
        --mdw-layout__nav-drawer__ratio: 1;
        --mdw-layout__nav-rail__display: none;
        --mdw-layout__nav-rail__ratio: 0;
      }

      :host(:where([has-two][one-fixed][nav-drawer])) {
        /* --mdw-layout__pane1-columns: ${WINDOW_COMPACT_COLUMNS}; */
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
      }

      :host(:where([has-two][two-fixed][nav-drawer])) {
        /* --mdw-layout__pane1-columns: ${WINDOW_MEDIUM_COLUMNS}; */
        --mdw-layout__pane2-columns: ${WINDOW_EXPANDED_COLUMNS};
      }
    }

  `
  .autoRegister('mdw-layout');
