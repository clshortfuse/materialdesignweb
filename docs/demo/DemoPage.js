import '../../components/IconButton.js';
import '../../components/TopAppBar.js';
import '../../components/MenuItem.js';
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
  `
  .html/* html */`
    <mdw-top-app-bar hide-on-scroll headline=${() => document.title}>
      <mdw-icon-button slot=leading
        _if={!isRootPage}
        on-click=${() => window.history.back()}
        icon=arrow_back
        >Back</mdw-icon-button>
      <mdw-icon-button id=settings slot=trailing icon=settings>Settings</mdw-icon-button>
      <mdw-icon-button slot=trailing
        on-click=${() => { window.location.href = 'https://github.com/clshortfuse/materialdesignweb/tree/native'; }}
      >GitHub Page
      <svg slot=svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path 
          id="invertocat" transform="scale(1.5)"
          fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        />
      </svg>
      </mdw-icon-button>
    </mdw-top-app-bar>
    <main><slot></slot></main>
    <mdw-menu id=menu>
      <mdw-menu-item checkbox name="alt-theme">Alt Theme</mdw-menu-item>
      <mdw-divider></mdw-divider>
      <mdw-menu-item radio name="font-size" value="0.75">75% Font-Size</mdw-menu-item>
      <mdw-menu-item radio name="font-size" value="1">100% Font-Size</mdw-menu-item>
      <mdw-menu-item radio name="font-size" value="1.5">150% Font-Size</mdw-menu-item>
      <mdw-menu-item radio name="font-size" value="2">200% Font-Size</mdw-menu-item>
      <mdw-divider></mdw-divider>
      <mdw-menu-item radio name="shape" value="">Circle Shape</mdw-menu-item>
      <mdw-menu-item radio name="shape" value="../shape-diamond.css">Diamond Shape</mdw-menu-item>
      <mdw-menu-item radio name="shape" value="../shape-squircle.css">Squircle Shape</mdw-menu-item>
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
          default:
        }
      },
      click({ currentTarget }) {
        currentTarget.close();
      },
    },
  })
  .on({
    constructed() {
      const useraltTheme = sessionStorage.getItem('altTheme') ?? 'false';
      if (useraltTheme === 'true') {
        this.shadowRoot
          .querySelector('mdw-menu-item[name="alt-theme"]')
          .selected = true;
        this.setAltTheme(true);
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
