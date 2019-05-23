import {
  iterateArrayLike,
} from '../../core/dom';
import * as Attributes from '../../core/aria/attributes';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';
import * as Layout from '../../components/layout/index';
import * as Button from '../../components/button/index';
import * as Dialog from '../../components/dialog/index';
import * as List from '../../components/list/index';
import * as ListContent from '../../components/list/content';
import * as ListSecondary from '../../components/list/secondary';
import * as Menu from '../../components/menu/index';
import * as Selection from '../../components/selection/index';
import * as SelectionRadioGroup from '../../components/selection/radiogroup';
import * as Snackbar from '../../components/snackbar/index';


/** @type {Element} */
let checkedAutoHideItem;
/** @type {Element} */
let checkedFabMobileItem;
/** @type {Element} */
let checkedFabDesktopItem;

Layout.attach();

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.getElementsByClassName('mdw-overlay'), Overlay.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-ripple'), Ripple.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-button'), Button.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-selection__radio-group'), SelectionRadioGroup.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-selection'), Selection.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-list'), List.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-dialog'), Dialog.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-menu'), Menu.attach);
}

/**
 * @param {string} name
 * @return {Element}
 */
function getListContentElementByName(name) {
  return document.querySelector(`[data-name="${name}"]`);
}

/**
 * @param {string} name
 * @return {string}
 */
function getCheckedValue(name) {
  return document.querySelector(`[data-name="${name}"][aria-checked="true"]`).dataset.value;
}

/**
 * @param {string} name
 * @return {boolean}
 */
function getIsChecked(name) {
  return Attributes.isChecked(getListContentElementByName(name));
}

/** @return {void} */
function refreshFabCut() {
  const enabled = getIsChecked('use-fab-mobile') && getIsChecked('fab-cut');
  if (!enabled) {
    Layout.getAppBarElement().removeAttribute('mdw-fab-cut');
    return;
  }
  const shown = getIsChecked('fab-show');
  const alignment = getCheckedValue('fab-mobile');
  Layout.getAppBarElement().setAttribute('mdw-fab-cut', [shown ? 'open' : '', alignment].join(' ').trim());
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onCheckChange(event) {
  /** @type {HTMLElement} */
  const listContentElement = (event.target);
  const checked = event.detail.value === 'true';
  const { name, value } = listContentElement.dataset;
  switch (name) {
    case 'use-appbar-autohide':
      updateAutoHideOption();
      break;
    case 'use-fab-mobile':
      updateFabMobileOption();
      break;
    case 'use-fab-desktop':
      updateFabDesktopOption();
      break;
    case 'appbar-autohide':
      Layout.getAppBarElement().setAttribute('mdw-autohide', value);
      break;
    case 'appbar-autoraise':
      if (checked) {
        Layout.getAppBarElement().setAttribute('mdw-autoraise', '');
      } else {
        Layout.getAppBarElement().removeAttribute('mdw-autoraise');
      }
      break;
    case 'appbar-bottom':
      if (checked) {
        Layout.getAppBarElement().setAttribute('mdw-bottom', '');
        getListContentElementByName('fab-cut').setAttribute('aria-disabled', 'false');
      } else {
        Layout.getAppBarElement().removeAttribute('mdw-bottom');
        getListContentElementByName('fab-cut').setAttribute('aria-disabled', 'true');
      }
      break;
    case 'appbar-autoprominent':
      if (checked) {
        Layout.getAppBarElement().setAttribute('mdw-autoprominent', '');
      } else {
        Layout.getAppBarElement().removeAttribute('mdw-autoprominent');
      }
      break;
    case 'fab-cut':
      refreshFabCut();
      break;
    case 'fab-show':
      if (checked) {
        Layout.showFab();
      } else {
        Layout.hideFab();
      }
      break;
    case 'navdrawer-style':
    case 'navdrawer-toggle':
    case 'sidesheet-style':
    case 'sidesheet-toggle':
      if (value) {
        document.body.setAttribute(`mdw-${name}`, value);
      } else {
        document.body.removeAttribute(`mdw-${name}`);
      }
      break;
    default:
  }
  if (name.indexOf('appbar') === 0) {
    Layout.resetScroll();
  }
}

/** @return {void} */
function setupComponentOptions() {
  document.addEventListener(ListSecondary.SECONDARY_ACTION_EVENT, (event) => {
    /** @type {HTMLElement} */
    const secondaryElement = (event.target);
    const selectionElement = secondaryElement.parentElement;
    // inverse check
    const newValue = !Attributes.isChecked(selectionElement);
    Selection.setChecked(selectionElement, newValue, true);
  });
  document.addEventListener(Selection.CHECKED_CHANGE_EVENT, onCheckChange);
  document.getElementById('dialog-alert-button').addEventListener('click', (event) => {
    Dialog.show(document.getElementById('dialog-alert'), event);
  });
  document.getElementById('dialog-confirm-button').addEventListener('click', (event) => {
    Dialog.show(document.getElementById('dialog-confirm'), event);
  });
  document.getElementById('menu-button').addEventListener('click', (event) => {
    Menu.show(document.getElementById('sample-menu'), event);
  });
}

initializeSampleComponents();
setupComponentOptions();

/** @return {void} */
function updateAutoHideOption() {
  const switchItem = document.querySelector('[data-name="use-appbar-autohide"]');
  const descriptionElement = switchItem.querySelector('.mdw-list__text-line:nth-child(2)');
  const oldDescription = descriptionElement.textContent;
  let newDescription = 'Off';
  if (switchItem.getAttribute('aria-checked') === 'true') {
    const checkedItem = document.querySelector('[data-name="appbar-autohide"][aria-checked="true"]');
    newDescription = checkedItem.querySelector('.mdw-list__text-line').textContent;
    Layout.getAppBarElement().setAttribute('mdw-autohide', checkedItem.dataset.value);
  } else {
    Layout.getAppBarElement().removeAttribute('mdw-autohide');
  }
  if (newDescription !== oldDescription) {
    Layout.resetScroll();
    descriptionElement.textContent = newDescription;
    Snackbar.create({
      text: `Auto hide is set to: ${newDescription}.`,
      parent: document.getElementsByClassName('mdw-snackbar__container')[0],
    });
  }
}

/** @return {void} */
function updateFabMobileOption() {
  const switchItem = document.querySelector('[data-name="use-fab-mobile"]');
  const descriptionElement = switchItem.querySelector('.mdw-list__text-line:nth-child(2)');
  const oldDescription = descriptionElement.textContent;
  let newDescription = 'Off';
  if (switchItem.getAttribute('aria-checked') === 'true') {
    const checkedItem = document.querySelector('[data-name="fab-mobile"][aria-checked="true"]');
    newDescription = checkedItem.querySelector('.mdw-list__text-line').textContent;
    document.getElementsByClassName('mdw-layout__fab')[0].setAttribute('mdw-mobile', checkedItem.dataset.value);
  } else {
    document.getElementsByClassName('mdw-layout__fab')[0].removeAttribute('mdw-mobile');
  }
  if (newDescription !== oldDescription) {
    refreshFabCut();
    descriptionElement.textContent = newDescription;
    Snackbar.create({
      text: `Mobile Fab is set to: ${newDescription}.`,
      parent: document.getElementsByClassName('mdw-snackbar__container')[0],
    });
  }
}

/** @return {void} */
function updateFabDesktopOption() {
  const switchItem = document.querySelector('[data-name="use-fab-desktop"]');
  const descriptionElement = switchItem.querySelector('.mdw-list__text-line:nth-child(2)');
  const oldDescription = descriptionElement.textContent;
  let newDescription = 'Off';
  if (switchItem.getAttribute('aria-checked') === 'true') {
    const checkedItem = document.querySelector('[data-name="fab-desktop"][aria-checked="true"]');
    newDescription = checkedItem.querySelector('.mdw-list__text-line').textContent;
    document.getElementsByClassName('mdw-layout__fab')[0].setAttribute('mdw-desktop', checkedItem.dataset.value);
  } else {
    document.getElementsByClassName('mdw-layout__fab')[0].removeAttribute('mdw-desktop');
  }
  if (newDescription !== oldDescription) {
    descriptionElement.textContent = newDescription;
    Snackbar.create({
      text: `Desktop Fab is set to: ${newDescription}.`,
      parent: document.getElementsByClassName('mdw-snackbar__container')[0],
    });
  }
}

document.addEventListener(Dialog.CONFIRM_EVENT, (event) => {
  /** @type {HTMLElement} */
  const dialog = (event.target);
  switch (dialog.id) {
    case 'dialog-autohide-options':
      updateAutoHideOption();
      break;
    case 'dialog-fabmobile-options':
      updateFabMobileOption();
      break;
    case 'dialog-fabdesktop-options':
      updateFabDesktopOption();
      break;
    default:
  }
});
// Dialog was cancelled
document.addEventListener(Dialog.CANCEL_EVENT, (event) => {
  /** @type {HTMLElement} */
  const dialog = (event.target);
  // Revert selection
  switch (dialog.id) {
    case 'dialog-autohide-options':
      iterateArrayLike(document.querySelectorAll('[data-name="appbar-autohide"]'), (item) => {
        item.setAttribute('aria-checked', (item === checkedAutoHideItem) ? 'true' : 'false');
      });
      break;
    case 'dialog-fabmobile-options':
      iterateArrayLike(document.querySelectorAll('[data-name="fab-mobile"]'), (item) => {
        item.setAttribute('aria-checked', (item === checkedFabMobileItem) ? 'true' : 'false');
      });
      break;
    case 'dialog-fabdesktop-options':
      iterateArrayLike(document.querySelectorAll('[data-name="fab-desktop"]'), (item) => {
        item.setAttribute('aria-checked', (item === checkedFabDesktopItem) ? 'true' : 'false');
      });
      break;
    default:
  }
});

document.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
  /** @type {HTMLElement} */
  const listContentElement = (event.target);

  // Before opening dialog, remember which item was checked
  switch (listContentElement.dataset.name) {
    case 'use-appbar-autohide':
      checkedAutoHideItem = document.querySelector('[data-name="appbar-autohide"][aria-checked="true"]');
      Dialog.show(document.getElementById('dialog-autohide-options'), event);
      break;
    case 'use-fab-mobile':
      checkedFabMobileItem = document.querySelector('[data-name="fab-mobile"][aria-checked="true"]');
      Dialog.show(document.getElementById('dialog-fabmobile-options'), event);
      break;
    case 'use-fab-desktop':
      checkedFabDesktopItem = document.querySelector('[data-name="fab-desktop"][aria-checked="true"]');
      Dialog.show(document.getElementById('dialog-fabdesktop-options'), event);
      break;
    default:
  }
});
