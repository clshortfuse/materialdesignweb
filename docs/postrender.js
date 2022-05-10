import * as Button from '../components/button/index.js';
import * as Layout from '../components/layout/index.js';
import * as ListContent from '../components/list/content.js';
import * as List from '../components/list/index.js';

const navDrawer = document.getElementsByClassName('mdw-layout__navdrawer')[0];
List.attachAll(navDrawer);
Layout.attach();
for (const element of document.querySelectorAll('.mdw-layout__appbar .mdw-button')) {
  Button.attach(element);
}

navDrawer.querySelector('[aria-current]').scrollIntoView({
  behavior: 'auto',
  block: 'center',
  inline: 'start',
});

/** @return {void} */
function clearCurrentPage() {
  for (const item of navDrawer.querySelectorAll('[aria-current]')) {
    item.removeAttribute('aria-current');
  }
}

navDrawer.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
  const item = /** @type {HTMLElement} */ (event.target);
  ListContent.setSelected(item, true);
  if (item instanceof HTMLAnchorElement) {
    if (item.hasAttribute('aria-current')) {
      return;
    }
    clearCurrentPage();
    item.setAttribute('aria-current', 'page');
    // Auto close if modal
    if (Layout.isNavDrawerModalShowing()) {
      Layout.hideNavDrawer();
    }
    window.location.href = item.href;
  }
});
