import '../../components/Layout.js';
import '../../components/IconButton.js';
import '../../components/Menu.js';
import '../../components/Listbox.js';
import '../../components/MenuItem.js';
import '../../components/TopAppBar.js';
import '../../components/NavDrawer.js';
import '../../components/NavDrawerItem.js';

import CustomElement from '../../core/CustomElement.js';
import { generateFragment } from '../../core/template.js';
import NavigationListenerMixin from '../../mixins/NavigationListenerMixin.js';

/**
 * @param {string} href
 * @return {boolean}
 */
function isActive(href) {
  return (new URL(href, window.location.href)).href === window.location.href;
}

export default CustomElement
  .extend()
  .mixin(NavigationListenerMixin)
  .expressions({
    isRootPage() {
      const { pathname } = window.location;
      return pathname.endsWith('/') || pathname.endsWith('index.html');
    },
  })
  .observe({
    _title: {
      type: 'string',
      value: document.title,
    },
    _currentLocation: {
      type: 'string',
      value: '',
    },
  })
  .set({
    /** @type {HTMLLinkElement} */
    shapeLinkElement: null,
    /** @type {HTMLLinkElement} */
    altThemeLinkElement: null,
    /** @type {string} */
    currentPageId: null,
  })
  .css`
    #menu-form {
      display: contents;
    }
  `
  .html`
      <mdw-layout id=layout>
        <mdw-nav-drawer id=drawer slot=nav-drawer>
          <mdw-nav-drawer-item icon=palette href="/components/color.html">Color</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=rounded_corner href="/components/shape.html">Shape</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=font_download href="/components/typography.html">Typography</mdw-nav-drawer-item>
          <mdw-divider></mdw-divider>
          <mdw-nav-drawer-item icon=exposure_plus_1 href="/components/badge.html">Badges</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=call_to_action href="/components/bottomappbar.html">Bottom App Bar</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=crop_landscape href="/components/buttons.html">Buttons</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=view_comfy href="/components/cards.html">Cards</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=check_box href="/components/checkbox.html">Checkbox</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=edit_attributes href="/components/chips.html">Chips</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=select_all href="/components/dialogs.html">Dialogs</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=border_horizontal href="/components/dividers.html">Dividers</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=view_quilt href="/components/layout.html">Layout</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=list href="/components/list.html">Lists</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=checklist href="/components/listbox.html">Listbox</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=picture_in_picture href="/components/menus.html">Menus</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=video_label href="/components/navbar.html">Nav Bar</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=list_alt href="/components/navdrawer.html">Nav Drawer</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=more_vert href="/components/navrail.html">Nav Rail</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=rotate_right href="/components/progress.html">Progress</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=radio_button_checked href="/components/radio.html">Radio</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=search href="/components/search.html">Search</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=tune href="/components/sliders.html">Sliders</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=call_to_action href="/components/snackbar.html">Snackbar</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=toggle_on href="/components/switches.html">Switches</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=tab href="/components/tabs.html">Tabs</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=edit href="/components/textinput.html">Text Input</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=edit href="/components/select.html">Text Select</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=edit_note href="/components/textarea.html">Text Area</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=help href="/components/tooltip.html">Tooltips</mdw-nav-drawer-item>
          <mdw-nav-drawer-item icon=web_asset href="/components/topappbar.html">Top App Bar</mdw-nav-drawer-item>
        </mdw-nav-drawer>
        <mdw-top-app-bar headline={_title} color=none slot=app-bar>
            <mdw-icon-button color=surface id=menu-button slot=leading 
              icon=menu
              >Menu</mdw-icon-button>
            <mdw-icon-button color=surface id=settings slot=trailing icon=settings>Settings</mdw-icon-button>
            <mdw-icon-button color=surface slot=trailing href="https://github.com/clshortfuse/materialdesignweb" icon=invertocat>GitHub Page</mdw-icon-button>
          </mdw-top-app-bar>
        <slot role=main></slot>
    </mdw-layout>
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
  .css`
    #layout[nav-drawer="fixed"] #menu-button {
      display: none;
    }
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
    menuButton: {
      click() {
        this.refs.layout.navDrawer = 'open';
      },
    },
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
  .methods({
    /**
     * @param {URL} url
     * @return {Promise<void>}
     */
    async performInternalNavigation(url) {
      try {
        const fetchResult = await fetch(url);
        if (!fetchResult.ok) throw new Error(`${fetchResult.status} - ${fetchResult.statusText}`);
        const text = await fetchResult.text();
        const fragment = generateFragment(text);
        const demoPage = fragment.querySelector('demo-page');
        if (!demoPage) throw new Error('Does not contain <demo-page> element.');
        this.replaceChildren(...demoPage.children);
        const title = fragment.querySelector('title')?.textContent;
        // TODO: Ensure nav bar is closed before pushing state.
        // Allows Safari back-gesture to properly preview previous state.

        this.currentPageId = Math.random().toString(36).slice(2);
        window.history.pushState({
          _DEMOPAGEID: this.currentPageId,
          _DEMOPAGENAVCACHE: text,
          title,
        }, title, url.href);
        document.title = title;
        this._title = title;
        this._currentLocation = window.location.href;
      } catch (e) {
        console.error(e);
        window.location.href = url.href;
        // Fallback to normal navigation
      }
    },
    performInternalRefresh() {
      document.documentElement.scrollTop = 0;
    },
    /**
     * @param {PopStateEvent} event
     */
    onPopState(event) {
      const { state } = event;
      if (!state) return;
      const { _DEMOPAGEID, _DEMOPAGENAVCACHE } = state;
      if (!_DEMOPAGEID) return;
      if (this.currentPageId === _DEMOPAGEID) return;
      if (!_DEMOPAGENAVCACHE) return;

      // Handle and log trace
      const fragment = generateFragment(_DEMOPAGENAVCACHE);
      const demoPage = fragment.querySelector('demo-page');
      this.replaceChildren(...demoPage.children);
      const title = fragment.querySelector('title').textContent;
      document.title = title;
      this._title = title;
      this._currentLocation = window.location.href;
      this.currentPageId = _DEMOPAGEID;
    },
  })
  .events({
    'mdw:hyperlink'(event) {
      const current = new URL(window.location);
      const destination = new URL(event.detail.href, window.location);
      const isRefresh = current.href === destination.href;
      const isInternal = isRefresh || new URL('/', current).href === new URL('/', destination).href;
      const isHash = !isRefresh
        && isInternal
        && current.pathname === destination.pathname && current.hash !== destination.hash;
      if (!isInternal) return;
      if (isHash) return;
      if (isRefresh) {
        this.performInternalRefresh();
      } else {
        console.log('performing hyperlink stuff', current, destination);
        event.preventDefault();
        this.performInternalNavigation(destination);
      }
    },
  })
  .on({
    constructed() {
      window.addEventListener('popstate', this.onPopState.bind(this));
      if (window.location.hostname === 'clshortfuse.github.io') {
        for (const link of this.refs.drawer.children) {
          link.href = `/materialdesignweb${link.href}`;
        }
      }
      this._currentLocation = window.location.href;

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
    connected() {
      // Store initial state
      if (this.currentPageId) return;
      const callback = () => {
        this.currentPageId = Math.random().toString(36).slice(2);
        window.history.replaceState({
          _DEMOPAGEID: this.currentPageId,
          _DEMOPAGENAVCACHE: document.documentElement.outerHTML,
        }, document.title, window.location.href);
      };
      if (document.readyState === 'complete') {
        requestAnimationFrame(callback);
      } else {
        document.addEventListener('DOMContentLoaded', callback);
      }
    },
    _currentLocationChanged() {
      for (const link of this.refs.drawer.children) {
        link.active = isActive(link.href);
      }
    },
  })
  .autoRegister('demo-page');
