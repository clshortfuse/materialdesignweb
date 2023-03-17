import '../../components/Layout.js';
import '../../components/IconButton.js';
import '../../components/Menu.js';
import '../../components/ListSelect.js';
import '../../components/MenuItem.js';
import '../../components/TopAppBar.js';
import '../../components/Pane.js';

import CustomElement from '../../core/CustomElement.js';

export default CustomElement
  .extend()
  .expressions({
    isRootPage() {
      const { pathname } = window.location;
      return pathname.endsWith('/') || pathname.endsWith('index.html');
    },
  })
  .set({
    /** @type {HTMLLinkElement} */
    shapeLinkElement: null,
    /** @type {HTMLLinkElement} */
    altThemeLinkElement: null,
  })
  .css/* css */`
    #menu-form {
      display: contents;
    }
    main {
      padding: 8px;
    }
    #back-button {
      transform: scaleX(var(--mdw-dir));
    }
  `
  .html/* html */`
    <mdw-layout>
      <mdw-top-app-bar slot=top hide-on-scroll headline=${() => document.title}>
        <mdw-icon-button id=back-button _if={!isRootPage}
          slot=leading 
          on-click=${() => window.history.back()}
          icon=arrow_back
          >Back</mdw-icon-button>
        <mdw-icon-button id=settings slot=trailing icon=settings>Settings</mdw-icon-button>
        <mdw-icon-button slot=trailing
          on-click=${() => { window.location.href = 'https://github.com/clshortfuse/materialdesignweb/tree/native'; }}
          svg-path="m12 0c-6.63 0-12 5.37-12 12 0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57 4.74-1.59 8.175-6.09 8.175-11.385 0-6.63-5.37-12-12-12z" 
        >GitHub Page</mdw-icon-button>
      </mdw-top-app-bar>
      <mdw-pane>
        <main><slot></slot></main>
      </mdw-pane>
      <!-- <mdw-pane fixed>
        <mdw-card color=surface elevated>
          <mdw-headline style="padding:12px">Theming Options</mdw-headline>
          <mdw-list-select>
            <mdw-list-option checkbox name="alt-theme">Alt Theme</mdw-list-item>
          </mdw-list-select>
        </mdw-card>
      </mdw-pane> -->
    <mdw-menu id=menu>
      <mdw-menu-item checkbox name=alt-theme>Alt Theme</mdw-menu-item>
      <mdw-divider></mdw-divider>
      <mdw-menu-item checkbox name=rtl>RTL</mdw-menu-item>
      <mdw-divider></mdw-divider>
      <mdw-menu-item radio name=font-size value=0.75>75% Font-Size</mdw-menu-item>
      <mdw-menu-item radio name=font-size value=1>100% Font-Size</mdw-menu-item>
      <mdw-menu-item radio name=font-size value=1.5>150% Font-Size</mdw-menu-item>
      <mdw-menu-item radio name=font-size value=2>200% Font-Size</mdw-menu-item>
      <mdw-divider></mdw-divider>
      <mdw-menu-item radio name=shape value="">Circle Shape</mdw-menu-item>
      <mdw-menu-item radio name=shape value="../shape-diamond.css">Diamond Shape</mdw-menu-item>
      <mdw-menu-item radio name=shape value="../shape-squircle.css">Squircle Shape</mdw-menu-item>
    </mdw-menu>
  `
  .methods({
    setAltTheme(load = false) {
      if (!load) {
        if (this.altThemeLinkElement) {
          this.altThemeLinkElement.remove();
          this.altThemeLinkElement = null;
        }
        return;
      }
      if (!this.altThemeLinkElement) {
        this.altThemeLinkElement = document.createElement('link');
        this.altThemeLinkElement.rel = 'stylesheet';
        if (this.shapeLinkElement) {
          this.shapeLinkElement.before(this.altThemeLinkElement);
        } else {
          document.head.append(this.altThemeLinkElement);
        }
      }
      // TODO: Fix relative paths
      this.altThemeLinkElement.href = '../alt-theme.css';
    },
    setRTL(rtl = false) {
      console.log('setrtl', rtl);
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    },
    /** @param {string} href */
    loadShape(href) {
      if (!href) {
        if (this.shapeLinkElement) {
          this.shapeLinkElement.remove();
          this.shapeLinkElement = null;
        }
        return;
      }
      if (!this.shapeLinkElement) {
        this.shapeLinkElement = document.createElement('link');
        this.shapeLinkElement.rel = 'stylesheet';
        document.head.appendChild(this.shapeLinkElement);
      }
      // TODO: Fix relative paths
      this.shapeLinkElement.href = href;
    },
  })
  .childEvents({
    settings: {
      click(event) {
        this.refs.menu.showModal(event.currentTarget);
      },
    },
    menu: {
      change({ target }) {
        const { name, value } = target;
        switch (name) {
          case 'alt-theme':
            this.setAltTheme(target.selected);
            sessionStorage.setItem('altTheme', target.selected ? 'true' : 'false');
            break;
          case 'font-size':
            document.documentElement.style.setProperty('font-size', `${Number.parseFloat(value) * 100}%`);
            sessionStorage.setItem('fontSize', value);
            break;
          case 'shape':
            this.loadShape(value);
            sessionStorage.setItem('shape', value);
            break;
          case 'rtl':
            this.setRTL(target.selected);
            break;
          default:
        }
      },
      click({ currentTarget }) {
        currentTarget.close();
      },
    },
  })
  .events({})
  .on({
    constructed() {
      const useraltTheme = sessionStorage.getItem('altTheme') ?? 'false';
      if (useraltTheme === 'true') {
        for (const el of this.shadowRoot.querySelectorAll('[name="alt-theme"]')) {
          el.selected = true;
        }
        this.setAltTheme(true);
      }

      const isRTL = document.documentElement.dir === 'rtl';
      if (isRTL) {
        this.shadowRoot
          .querySelector('mdw-menu-item[name="rtl"]')
          .selected = true;
        this.setRTL(true);
      }

      const userFontSize = sessionStorage.getItem('fontSize') ?? '1';
      const fontSizeElement = this.shadowRoot.querySelector(`mdw-menu-item[name="font-size"][value="${userFontSize}"]`);
      if (fontSizeElement) {
        fontSizeElement.selected = true;
        document.documentElement.style.setProperty('font-size', `${Number.parseFloat(userFontSize) * 100}%`);
      } else {
        this.shadowRoot.querySelector('mdw-menu-item[name="font-size"][value="1"]').selected = true;
      }

      const userShape = sessionStorage.getItem('shape') ?? '';
      const matchingElement = this.shadowRoot.querySelector(`mdw-menu-item[name="shape"][value="${userShape}"]`);
      if (matchingElement) {
        matchingElement.selected = true;
        this.loadShape(userShape);
      } else {
        this.shadowRoot.querySelector('mdw-menu-item[name="font-size"][value="1"]').selected = true;
      }
    },
  })
  .autoRegister('demo-page');
