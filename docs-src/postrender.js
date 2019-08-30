import * as Button from '../components/button/index';
import * as Layout from '../components/layout/index';
import * as List from '../components/list/index';
import * as ListContent from '../components/list/content';
import { iterateArrayLike } from '../core/dom';

const navDrawer = document.getElementsByClassName('mdw-layout__navdrawer')[0];
List.attachAll(navDrawer);
Layout.attach();
iterateArrayLike(document.querySelectorAll('.mdw-layout__appbar .mdw-button'), Button.attach);

navDrawer.querySelector('[aria-current]').scrollIntoView({
  behavior: 'auto',
  block: 'center',
  inline: 'start',
});

/** @return {void} */
function clearCurrentPage() {
  iterateArrayLike(navDrawer.querySelectorAll('[aria-current]'), (item) => item.removeAttribute('aria-current'));
}


navDrawer.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
  /** @type {HTMLElement} */
  const item = (event.target);
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
