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
  iterateArrayLike(document.querySelectorAll('.mdw-dialog'), Dialog.attach);
}

/**
 * @param {string} inputName
 * @return {Element}
 */
function getInputElementByName(inputName) {
  return document.querySelector(`input[name="${inputName}"`);
}

/**
 * @param {string} inputName
 * @return {string}
 */
function getCheckedRadioValue(inputName) {
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
 * @param {string} inputName
 * @return {boolean}
 */
function getCheckedCheckboxValue(inputName) {
  const el = document.querySelector(`input[name="${inputName}"]`);
  if (el && el.checked) {
    return true;
  }
  return false;
}

/** @return {void} */
function refreshFabCut() {
  const enabled = getCheckedCheckboxValue('use-fab-mobile') && getCheckedCheckboxValue('fab-cut');
  if (!enabled) {
    App.getAppBarElement().removeAttribute('mdw-fab-cut');
    return;
  }
  const shown = getCheckedCheckboxValue('fab-show');
  const alignment = getCheckedRadioValue('fab-mobile');
  App.getAppBarElement().setAttribute('mdw-fab-cut', [shown ? 'open' : '', alignment].join(' ').trim());
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
        App.getAppBarElement().setAttribute('mdw-autohide', getCheckedRadioValue('appbar-autohide'));
      } else {
        App.getAppBarElement().removeAttribute('mdw-autohide');
      }
      App.resetScroll();
      break;
    case 'use-fab-mobile':
      iterateArrayLike(document.querySelectorAll('input[name="fab-mobile"]'),
        el => (checked ? el.removeAttribute('disabled') : el.setAttribute('disabled', '')));
      if (checked) {
        document.getElementsByClassName('mdw-app__fab')[0].setAttribute('mdw-mobile', getCheckedRadioValue('fab-mobile'));
      } else {
        document.getElementsByClassName('mdw-app__fab')[0].removeAttribute('mdw-mobile');
      }
      refreshFabCut();
      break;
    case 'use-fab-desktop':
      iterateArrayLike(document.querySelectorAll('input[name="fab-desktop"]'),
        el => (checked ? el.removeAttribute('disabled') : el.setAttribute('disabled', '')));
      if (checked) {
        document.getElementsByClassName('mdw-app__fab')[0].setAttribute('mdw-desktop', getCheckedRadioValue('fab-desktop'));
      } else {
        document.getElementsByClassName('mdw-app__fab')[0].removeAttribute('mdw-desktop');
      }
      break;
    case 'appbar-autohide':
      App.getAppBarElement().setAttribute('mdw-autohide', value);
      break;
    case 'appbar-autoraise':
      if (checked) {
        App.getAppBarElement().setAttribute('mdw-autoraise', '');
      } else {
        App.getAppBarElement().removeAttribute('mdw-autoraise');
      }
      break;
    case 'fab-mobile':
      document.getElementsByClassName('mdw-app__fab')[0].setAttribute('mdw-mobile', value);
      refreshFabCut();
      break;
    case 'fab-desktop':
      document.getElementsByClassName('mdw-app__fab')[0].setAttribute('mdw-desktop', value);
      break;
    case 'appbar-bottom':
      if (value === 'bottom') {
        App.getAppBarElement().setAttribute('mdw-bottom', '');
        getInputElementByName('fab-cut').removeAttribute('disabled');
      } else {
        App.getAppBarElement().removeAttribute('mdw-bottom');
        getInputElementByName('fab-cut').setAttribute('disabled', '');
      }
      break;
    case 'appbar-autoprominent':
      if (checked) {
        App.getAppBarElement().setAttribute('mdw-autoprominent', '');
      } else {
        App.getAppBarElement().removeAttribute('mdw-autoprominent');
      }
      break;
    case 'fab-cut':
      refreshFabCut();
      break;
    case 'fab-show':
      if (checked) {
        App.showFab();
      } else {
        App.hideFab();
      }
      break;
    case 'navdrawer-style':
    case 'navdrawer-toggle':
    case 'sidesheet-style':
    case 'sidesheet-toggle':
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
