/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';

export default CustomElement
  .extend()
  .observe({
    navBar: 'string',
    navRail: 'string',
    navDrawer: 'string',
    oneFlexible: 'boolean',
    oneFixed: 'boolean',
    twoFlexible: 'boolean',
    twoFixed: 'boolean',
    paneTwoActive: 'boolean',
    paneOneColumns: 'integer',
    paneTwoColumns: 'integer',
    padding: 'integer',
    panes: 'integer',
    _touchDeltaX: 'integer',
    _touchStartX: 'integer',
    _navDrawerTranslateX: {
      empty: '-100%',
    },
    _navDrawerDuration: {
      empty: 0,
    },
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
    _navDrawerStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ _navDrawerTranslateX, _navDrawerDuration }) {
        return {
          target: 'slot-nav-drawer',
          styles: {
            transform: `translateX(${_navDrawerTranslateX})`,
          },
          timing: {
            duration: _navDrawerDuration,
          },
        };
      },
    },
  })
  .set({
    /** @type {Map<string, MediaQueryList>} */
    registeredMediaQueries: null,
    refreshedOpenStatesFlag: false,
    _windowResizeListener: null,
  })
  /* Slots should follow tab order */
  .html`
    <slot id=slot-nav-drawer name=nav-drawer state={navDrawer}></slot>
    <div  id=scrim state={navDrawer}></div>
    <slot id=slot-nav-rail name=nav-rail state={navRail}></slot>
    <slot id=slot-app-bar name=app-bar></slot>
    <slot id=slot class="pane pane1" columns={paneOneColumns} slotted={oneFlexible}></slot>
    <slot id=slot-fixed name=fixed class="pane pane1" columns={paneOneColumns} slotted={oneFixed}   ></slot>
    <slot id=slot-two name=two class="pane pane2" panes={panes} columns={paneTwoColumns} slotted={twoFlexible}></slot>
    <slot id=slot-two-fixed name=two-fixed class="pane pane2" panes={panes} columns={paneTwoColumns} slotted={twoFixed}   ></slot>
    <slot id=slot-nav-bar name=nav-bar state={navBar}></slot>
  `
  .methods({
    refreshLayoutValues() {
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
       * - Rail      12col             80 | 840 |           80      0     840   968  If Single Pane
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
       * SORTED + FILTERED
       * - Nav       Pane1    Pane2    Columns             Nav Detail Content Width
       * - Modal     4col              x 0 x                 0      0       0     0
       * - Modal     8col              x 600 x               0      0     600   632
       * - Modal     8col              | 600 |               0      0     600   648
       * - Modal     12col             | 840 |               0      0     840   888
       * - Rail      8col              80 | 600 |           80      0     600   728
       * - Rail      12col             80 | 840 |           80      0     840   968
       * - Drawer    12col             360 | 840 |         360      0     840  1248
       * - Modal     4col     4col     | 360 | 360 |         0    360     720   792
       * - Modal     8col     8col     | 600 | 600 |         0    600    1200  1272
       * - Modal     12col    12col    | 840 | 840 |         0    840    1680  1752
       * - Modal     Fixed    4col     | 360 | 360 |         0    360     720   792
       * - Modal     Fixed    8col     | 360 | 600 |         0    600     960  1032
       * - Modal     Fixed    12col    | 360 | 840 |         0    840    1200  1272
       * - Drawer    8col     8col     360 | 600 | 600 |   360    600     720  1632
       * - Drawer    Fixed    8col     360 | 360 | 600 |   360    600     960  1392
       * - Rail      4col     4col     80 | 360 | 360 |     80    360     720   872
       * - Rail      8col     8col     80 | 600 | 600 |     80    600    1200  1352
       * - Rail      12col    12col    80 | 840 | 840 |     80    840    1680  1832
       * - Rail      Fixed    4col     80 | 360 | 360 |     80    360     720   872
       * - Rail      Fixed    8col     80 | 360 | 600 |     80    600     960  1112
       * - Rail      Fixed    12col    80 | 360 | 840 |     80    840    1200  1352
       * - Drawer    12col    12col    360 | 840 | 840 |   360    840    1680  2112
       * - Drawer    Fixed    12col    360 | 360 | 840 |   360    840    1200  1632
       */

      const { innerWidth } = window;
      /** @type {[number, 'modal'|'rail'|'drawer', 4|8|12|'fixed', number, number][]} */
      const breakpointTable = [
        [1632, 'drawer', 'fixed', 12, 24],
        [2112, 'drawer', 12, 12, 24],
        [1352, 'rail', 'fixed', 12, 24],
        [1112, 'rail', 'fixed', 8, 24],
        [872, 'rail', 'fixed', 4, 24],
        [1832, 'rail', 12, 12, 24],
        [1352, 'rail', 8, 8, 24],
        [872, 'rail', 4, 4, 24],
        [1392, 'drawer', 'fixed', 8, 24],
        [1632, 'drawer', 8, 8, 24],
        [1272, 'modal', 'fixed', 12, 24],
        [1032, 'modal', 'fixed', 8, 24],
        [792, 'modal', 'fixed', 4, 24],
        [1752, 'modal', 12, 12, 24],
        [1272, 'modal', 8, 8, 24],
        [792, 'modal', 4, 4, 24],
        [1248, 'drawer', 12, 0, 24],
        [960, 'rail', 12, 0, 24],
        [728, 'rail', 8, 0, 24],
        [888, 'modal', 12, 0, 24],
        [648, 'modal', 8, 0, 24],
        [632, 'modal', 8, 0, 16],
        [0, 'modal', 4, 0, 16],
      ];
      breakpointTable.some(([minWidth, nav, column1, column2, padding]) => {
        if (innerWidth < minWidth) return false;
        if (column2 && !this.hasTwo) return false;
        if (nav === 'rail') {
          if (!this.navRail) return false;
          this.navRail = 'fixed';
          if (this.navDrawer) this.navDrawer = 'closed';
          if (this.navBar) this.navBar = 'closed';
        } else if (nav === 'drawer') {
          if (!this.navDrawer) return false;
          if (this.navRail) this.navRail = 'closed';
          if (this.navBar) this.navBar = 'closed';
          this.navDrawer = 'fixed';
        } else {
          if (this.navRail) this.navRail = 'closed';
          if (this.navDrawer) this.navDrawer = 'closed';
          if (this.navBar) this.navBar = 'open';
        }
        this.padding = padding;
        if (column2) {
          this.panes = 2;
          if (this.oneFixed) {
            this.paneOneColumns = 4;
            this.paneTwoColumns = column2;
          } else if (this.twoFixed) {
            this.paneOneColumns = column2;
            this.paneTwoColumns = 4;
          }
        } else {
          this.panes = 1;
          this.paneOneColumns = /** @type {number} */ (column1);
          this.paneTwoColumns = this.hasTwo
            ? /** @type {number} */ (column1)
            : null;
        }
        return true;
      });
    },
    checkTouchFinished() {
      if (this.navDrawer !== 'open') return;
      const { _touchDeltaX, refs } = this;
      const clientWidth = refs.slotNavDrawer.clientWidth;
      const visibility = (_touchDeltaX + clientWidth) / clientWidth;
      if (visibility < 0.5) {
        this.navDrawer = 'closed';
      } else {
        this._navDrawerTranslateX = '0';
      }
    },
  })
  .events({
    '~touchstart'(event) {
      if (this.navDrawer !== 'open') return;
      if (!event.touches.length) return;
      const [touch] = event.touches;
      this._touchStartX = touch.clientX;
    },
    '~touchmove'(event) {
      if (this.navDrawer !== 'open') return;
      if (!event.touches.length) return;
      const [touch] = event.touches;
      const delta = Math.min(touch.clientX - this._touchStartX, 0);
      this._touchDeltaX = delta;
      this._navDrawerTranslateX = `${delta}px`;
    },
    touchcancel: 'checkTouchFinished',
    '~touchend': 'checkTouchFinished',
  })
  .rootEvents({
    slotchange({ target }) {
      const slotElement = /** @type HTMLSlotElement */ (target);
      const slotted = slotElement.assignedElements().length > 0;
      switch (slotElement.name) {
        case 'nav-rail':
          this.navRail = slotted ? 'closed' : null;
          break;
        case 'nav-bar':
          this.navBar = slotted ? 'closed' : null;
          break;
        case 'nav-drawer':
          this.navDrawer = slotted ? 'closed' : null;
          break;
        case 'fixed':
          this.oneFixed = slotted;
          break;
        case 'two':
          this.twoFlexible = slotted;
          break;
        case 'two-fixed':
          this.twoFixed = slotted;
          break;
        default:
          this.oneFlexible = slotted;
          break;
      }
      this.refreshLayoutValues();
    },
  })
  .childEvents({
    scrim: {
      click() {
        this.navDrawer = 'closed';
      },
    },
  })
  .on({
    navDrawerChanged(previous, current) {
      this._navDrawerTranslateX = current === 'closed' ? '-100%' : '0';
      this._navDrawerDuration = current === 'fixed' ? 0 : 200;
    },
    connected() {
      this._windowResizeListener = this.refreshLayoutValues.bind(this);
      window.addEventListener('resize', this._windowResizeListener);
    },
    disconnected() {
      window.removeEventListener('resize', this._windowResizeListener);
    },
  })
  .css`
    :host {
      --mdw-grid__columns: 4;
      --mdw-content__max-width: 1040px;
      --mdw-content__padding: 16px;
      --mdw-layout__spacer-width: 24px;
      --mdw-layout__nav-drawer__ratio: 0;
      --mdw-layout__nav-drawer-width: 360px;
      --mdw-layout__nav-rail__ratio: 0;
      --mdw-layout__nav-rail-width: 80px;
      --mdw-layout__pane1-width: minmax(0, 1fr);
      --mdw-layout__pane2-width: 0;
      --mdw-layout__window-padding: 16px;

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
      overflow-x: clip;

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    :host(:where([pane-two-active])) {
      grid-template-areas: 
        "nav-drawer nav-rail app-bar app-bar app-bar pane1 ."
        "nav-drawer nav-rail .       pane2   .       pane1 ."
        "nav-drawer nav-rail nav-bar nav-bar nav-bar nav-bar .";
    }

    :host(:where([panes="2"])) {
      --mdw-content__max-width: auto;
      --mdw-layout__pane2-width: 1fr;
      grid-template-columns:
        calc(var(--mdw-layout__nav-drawer-width) * var(--mdw-layout__nav-drawer__ratio))
        calc(var(--mdw-layout__nav-rail-width) * var(--mdw-layout__nav-rail__ratio))
        var(--mdw-layout__window-padding)
        var(--mdw-layout__pane1-width)
        var(--mdw-layout__spacer-width)
        var(--mdw-layout__pane2-width)
        var(--mdw-layout__window-padding);

      grid-template-areas: 
        "nav-drawer nav-rail app-bar app-bar app-bar pane2 ."
        "nav-drawer nav-rail .       pane1   .       pane2 ."
        "nav-drawer nav-rail nav-bar nav-bar nav-bar nav-bar .";
    }

    :host(:where([nav-rail="fixed"])) {
      --mdw-layout__nav-rail__ratio: 1;
    }

    :host(:where([nav-drawer="fixed"])) {
      --mdw-layout__nav-drawer__ratio: 1;
    }

    :host(:where([padding="24"])) {
      --mdw-layout__window-padding: 24px;
      --mdw-content__padding: 24px;
    }

    :host(:where([panes="2"][one-fixed])) {
      --mdw-layout__pane1-width: 360px;
    }

    :host(:where([panes="2"][two-fixed])) {
      --mdw-layout__pane2-width: 360px;
    }

    #scrim {
      position:fixed;
      inset: 0;

      pointer-events: none;

      opacity: 0;
      z-index: 25;

      background-color: rgb(var(--mdw-color__scrim));

      transition: opacity 200ms;
    }

    #scrim[state="open"] {
      pointer-events: auto;

      opacity: 0.38;
    }

    .pane {
      overflow: visible;
    }

    .pane[columns="8"] {
      /* stylelint-disable-next-line rule-selector-property-disallowed-list */
      --mdw-grid__columns: 8;
    }

    .pane[columns="12"] {
      /* stylelint-disable-next-line rule-selector-property-disallowed-list */
      --mdw-grid__columns: 12;
    }

    .pane1 {
      grid-area: pane1;

      box-sizing: content-box;
      inline-size: 100%;
      max-inline-size: var(--mdw-content__max-width, auto);
      margin-inline: auto;
    }

    .pane1[slotted] {
      display: block;
    }

    .pane2 {
      --mdw-content__padding: 0;
      grid-area: pane2;

      visibility: hidden;
    }

    .pane2[active] {
      inset-inline-end: 0;

      box-sizing: border-box;
      inline-size: 100%;
      padding-inline: var(--mdw-content__padding);

      visibility: visible;
    }

    .pane2[slotted] {
      display: block;
    }

    .pane2[panes="2"] {
      position: sticky;
      inset: 0;

      overflow-y: auto;

      block-size: 100vh;

      visibility: visible;
    }

    #slot-app-bar {
      display: contents; /* Allow sticky */

      z-index: 2;
    }

    #slot-nav-bar {
      display: contents;
      grid-area: nav-bar;
    }

    #slot-nav-bar[state="closed"] {
      display: none;
    }

    #slot-nav-rail {
      display: none;
      grid-area: nav-rail;

      z-index: 3;
    }

    #slot-nav-rail[state="fixed"] {
      display: block;
    }

    #slot-nav-drawer {
      position: fixed;

      display: block;
      grid-area: nav-drawer;

      /** Initially hidden */
      transform: translateX(-100%);
      visibility: hidden;
      z-index: 26;

      transition-delay: 0s, 200ms;
      transition-duration: 200ms, 0s;
      transition-property: transform, visibility;
      transition-timing-function: cubic-bezier(0.3, 0, 0.8, 0.15);
    }

    #slot-nav-drawer:is([state="open"],[state="fixed"]) {
      transform: translateX(0);
      visibility: visible;

      transition-delay: 0s, 0s;
      transition-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1); 
    }
  `
  .autoRegister('mdw-layout');
