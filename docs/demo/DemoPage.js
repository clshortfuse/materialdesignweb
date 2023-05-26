import '../../components/Layout.js';
import '../../components/IconButton.js';
import '../../components/Menu.js';
import '../../components/Listbox.js';
import '../../components/MenuItem.js';
import '../../components/TopAppBar.js';

import CustomElement from '../../core/CustomElement.js';

/**
 * @param {string} href
 * @return {boolean}
 */
function isActive(href) {
  return (new URL(href, window.location.href)).href === window.location.href;
}

const links = [
  { icon: 'palette', href: '/components/color.html', text: 'Color' },
  { icon: 'rounded_corner', href: '/components/shape.html', text: 'Shape' },
  { icon: 'font_download', href: '/components/typography.html', text: 'Typography' },
  { icon: 'exposure_plus_1', href: '/components/badge.html', text: 'Badges' },
  { icon: 'call_to_action', href: '/components/bottomappbar.html', text: 'Bottom App Bar' },
  { icon: 'crop_landscape', href: '/components/buttons.html', text: 'Buttons' },
  { icon: 'view_comfy', href: '/components/cards.html', text: 'Cards' },
  { icon: 'check_box', href: '/components/checkbox.html', text: 'Checkbox' },
  { icon: 'edit_attributes', href: '/components/chips.html', text: 'Chips' },
  { icon: 'select_all', href: '/components/dialogs.html', text: 'Dialogs' },
  { icon: 'border_horizontal', href: '/components/dividers.html', text: 'Dividers' },
  { icon: 'view_quilt', href: '/components/layout.html', text: 'Layout' },
  { icon: 'list', href: '/components/list.html', text: 'Lists' },
  { icon: 'checklist', href: '/components/listbox.html', text: 'Listbox' },
  { icon: 'picture_in_picture', href: '/components/menus.html', text: 'Menus' },
  { icon: 'video_label', href: '/components/navbar.html', text: 'Nav Bar' },
  { icon: 'list_alt', href: '/components/navdrawer.html', text: 'Nav Drawer' },
  { icon: 'more_vert', href: '/components/navrail.html', text: 'Nav Rail' },
  { icon: 'rotate_right', href: '/components/progress.html', text: 'Progress' },
  { icon: 'radio_button_checked', href: '/components/radio.html', text: 'Radio' },
  { icon: 'search', href: '/components/search.html', text: 'Search' },
  { icon: 'tune', href: '/components/sliders.html', text: 'Sliders' },
  { icon: 'call_to_action', href: '/components/snackbar.html', text: 'Snackbar' },
  { icon: 'toggle_on', href: '/components/switches.html', text: 'Switches' },
  { icon: 'tab', href: '/components/tabs.html', text: 'Tabs' },
  { icon: 'edit', href: '/components/textinput.html', text: 'Input' },
  { icon: 'search', href: '/components/search.html', text: 'Search' },
  { icon: 'edit', href: '/components/select.html', text: 'Select' },
  { icon: 'edit_note', href: '/components/textarea.html', text: 'Textarea' },
  { icon: 'web_asset', href: '/components/tooltip.html', text: 'Tooltips' },
  { icon: 'web_asset', href: '/components/topappbar.html', text: 'Top App Bar' },
];

for (const link of links) {
  // Lazy link fix
  if (window.location.hostname === 'clshortfuse.github.io') {
    link.href = `/materialdesignweb${link.href}`;
  }
}

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
    #back-button {
      transform: scaleX(var(--mdw-dir));
    }
  `
  .html/* html */`
      <mdw-layout>
        <!--         
        <mdw-nav-rail>
          <mdw-nav-rail-item mdw-for="{link of links}" active=${(data, { link }) => isActive(link?.href)} icon={link.icon} href={link.href}>{link.text}</mdw-nav-rail-item>
        </mdw-nav-rail>
         -->
        <mdw-nav-drawer slot=drawer>
          <mdw-nav-drawer-item mdw-for="{link of links}" active=${(data, { link }) => isActive(link?.href)} icon={link.icon} href={link.href}>{link.text}</mdw-nav-drawer-item>
        </mdw-nav-drawer>
        <mdw-top-app-bar headline=${() => document.title} color=none slot=app-bar>
            <mdw-icon-button color=surface id=back-button mdw-if={!isRootPage} slot=leading 
              href="../"
              icon=arrow_back
              >Back</mdw-icon-button>
            <mdw-icon-button color=surface id=settings slot=trailing icon=settings>Settings</mdw-icon-button>
            <mdw-icon-button color=surface slot=trailing href="https://github.com/clshortfuse/materialdesignweb" icon=invertocat>GitHub Page</mdw-icon-button>
          </mdw-top-app-bar>
        <slot role=main></slot>
        <!-- <mdw-pane>
          <mdw-card color=surface elevated>
            <mdw-headline style="padding:12px">Theming Options</mdw-headline>
            <mdw-listbox>
              <mdw-list-option checkbox name="alt-theme">Alt Theme</mdw-list-item>
            </mdw-listbox>
          </mdw-card>
        </mdw-pane> -->
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
      const data = { links };
      this.render(data, data);

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
