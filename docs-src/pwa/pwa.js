import App from '../../components/app/index';
import { Button } from '../../components/button/index';
import { iterateArrayLike, iterateSomeOfArrayLike } from '../../components/common/dom';
import { List } from '../../components/list/index';
import { Dialog } from '../../components/dialog/index';
import { Menu } from '../../components/menu/index';

App.attach();

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.mdw-button'), Button.attach);
  iterateArrayLike(document.querySelectorAll('.mdw-list'), List.attach);
}

/**
 * @param {string} inputName
 * @return {string}
 */
function getCheckedValue(inputName) {
  let value = null;
  iterateSomeOfArrayLike(document.querySelectorAll(`input[name="${inputName}"]`), (el) => {
    if (el.checked) {
      value = el.value;
      return true;
    }
    return false;
  });
  return value;
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  /** @type {HTMLInputElement} */
  const inputElement = (event.currentTarget);
  const { name, value, checked } = inputElement;
  switch (name) {
    case 'use-appbar-autohide':
      iterateArrayLike(document.querySelectorAll('input[name="appbar-autohide"]'),
        el => (checked ? el.removeAttribute('disabled') : el.setAttribute('disabled', '')));
      if (checked) {
        document.documentElement.setAttribute('mdw-appbar-autohide', getCheckedValue('appbar-autohide'));
      } else {
        document.documentElement.removeAttribute('mdw-appbar-autohide');
      }
      App.resetScroll();
      break;
    case 'use-fab-mobile':
      iterateArrayLike(document.querySelectorAll('input[name="fab-mobile"]'),
        el => (checked ? el.removeAttribute('disabled') : el.setAttribute('disabled', '')));
      if (checked) {
        document.documentElement.setAttribute('mdw-fab-mobile', getCheckedValue('fab-mobile'));
      } else {
        document.documentElement.removeAttribute('mdw-fab-mobile');
      }
      break;
    case 'use-fab-desktop':
      iterateArrayLike(document.querySelectorAll('input[name="fab-desktop"]'),
        el => (checked ? el.removeAttribute('disabled') : el.setAttribute('disabled', '')));
      if (checked) {
        document.documentElement.setAttribute('mdw-fab-desktop', getCheckedValue('fab-desktop'));
      } else {
        document.documentElement.removeAttribute('mdw-fab-desktop');
      }
      break;
    case 'appbar-autohide':
    case 'fab-mobile':
    case 'fab-desktop':
      document.documentElement.setAttribute(`mdw-${name}`, value);
      break;
    case 'appbar-bottom':
      if (value === 'bottom') {
        document.documentElement.setAttribute(`mdw-${name}`, '');
      } else {
        document.documentElement.removeAttribute(`mdw-${name}`);
      }
      break;
    case 'appbar-autoraise':
    case 'appbar-autoprominent':
    case 'bottom-autoraise':
    case 'fab-mobile-cut':
    case 'fab-show':
      if (checked) {
        document.documentElement.setAttribute(`mdw-${name}`, '');
      } else {
        document.documentElement.removeAttribute(`mdw-${name}`);
      }
      break;
    case 'navdrawer-style':
    case 'navdrawer-toggle':
    case 'sidesheet-style':
    case 'sidesheet-toggle':
    case 'fab-align':
      if (value) {
        document.documentElement.setAttribute(`mdw-${name}`, value);
      } else {
        document.documentElement.removeAttribute(`mdw-${name}`);
      }
      break;
    default:
  }
  if (name.indexOf('appbar') === 0) {
    App.resetScroll();
  }
}

/** @return {void} */
function setupComponentOptions() {
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
  document.getElementById('dialog-alert-button').addEventListener('click', (event) => {
    Dialog.show(document.getElementById('dialog-alert'), event);
  });
  document.getElementById('menu-button').addEventListener('click', (event) => {
    Menu.show(document.getElementById('sample-menu'), event);
  });
}

initializeSampleComponents();
setupComponentOptions();
