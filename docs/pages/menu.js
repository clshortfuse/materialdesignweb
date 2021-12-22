import * as Menu from '../../components/menu/index.js';
import * as MenuItem from '../../components/menu/item.js';
import { iterateArrayLike } from '../../core/dom.js';
import { convertElementToCode } from '../_sample-utils.js';

/** @type {HTMLElement} */
let sampleComponent;

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onSampleButtonClick(event) {
  Menu.show(sampleComponent, event);
}

/** @return {void} */
function updateSampleCode() {
  /** @type {HTMLInputElement} */
  const jsRequiredElement = (document.querySelector('input[name="javascript"][value="required"]'));
  const jsRequired = jsRequiredElement.checked;
  /** @type {HTMLInputElement} */
  const jsOptionalElement = (document.querySelector('input[name="javascript"][value="optional"]'));
  const jsOptional = jsOptionalElement.checked;
  const useJS = jsRequired || jsOptional;

  if (jsRequired) {
    document.querySelector('[name="vdirection"][value="vcenter"]').removeAttribute('disabled');
    document.querySelector('[name="hdirection"][value="hcenter"]').removeAttribute('disabled');
  } else {
    document.querySelector('[name="vdirection"][value="vcenter"]').setAttribute('disabled', '');
    document.querySelector('[name="hdirection"][value="hcenter"]').setAttribute('disabled', '');
  }

  // Strip JS related elements and attributes
  Menu.detach(sampleComponent);
  const button = document.querySelector('.component-sample .mdw-button');
  let closer = document.querySelector('.component-sample .mdw-menu__close');
  button.removeEventListener('click', onSampleButtonClick);
  iterateArrayLike(sampleComponent.querySelectorAll('[tabindex]'), (el) => el.removeAttribute('tabindex'));

  if (closer) {
    if (jsRequired || (closer instanceof HTMLAnchorElement === false)) {
      closer.parentElement.removeChild(closer);
      closer = null;
    }
  }

  if (jsRequired) {
    sampleComponent.removeAttribute('id');
    button.removeAttribute('href');
  } else {
    sampleComponent.setAttribute('id', 'sample-menu');
    button.setAttribute('id', '#sample-menu-button');
    button.setAttribute('href', '#sample-menu');
    if (!closer) {
      closer = document.createElement('a');
      closer.classList.add('mdw-menu__close');
      closer.setAttribute('href', '#sample-menu-button');
      sampleComponent.insertBefore(closer, sampleComponent.firstElementChild);
    }
  }

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const sampleContainer = document.querySelector('.component-sample__container');
  const htmlCodeBlocks = [];
  let el = sampleContainer.firstElementChild;
  if (jsRequired) {
    el = el.firstElementChild;
  }
  while (el) {
    const htmlCode = convertElementToCode(el).trim();
    if (htmlCode) {
      htmlCodeBlocks.push(htmlCode);
    }
    el = el.nextElementSibling;
  }
  htmlCodeElement.textContent = htmlCodeBlocks.join('\n');

  // Reattach JS if requested
  if (useJS) {
    Menu.attach(sampleComponent);
    button.addEventListener('click', onSampleButtonClick);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = [
    "buttonElement.addEventListener('click', (event) => {",
    '  mdw.Menu.show(menuElement, event);',
    '});',
    'menuElement.addEventListener(MenuItem.ACTIVATE_EVENT, (event) => {',
    '  const menuItem = event.target;',
    '  handleMenuItem(menuItem);',
    '  mdw.Menu.hide(menuElement)',
    '});',
  ].join('\n');
}

/** @return {void} */
function initializeSampleComponents() {
  const button = document.querySelector('.js .mdw-button');
  const menu = document.querySelector('.js .mdw-menu');
  button.addEventListener('click', (/** @type {MouseEvent|PointerEvent} */ event) => {
    Menu.show(menu, event);
  });

  // Close on activation
  menu.addEventListener(MenuItem.ACTIVATE_EVENT, () => Menu.hide(menu));
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  /** @type {HTMLInputElement} */
  const { name, value } = (event.target);
  let mdwDirection = sampleComponent.getAttribute('mdw-direction') || '';
  let mdwPosition = sampleComponent.getAttribute('mdw-position') || '';

  switch (name) {
    case 'vposition':
      mdwPosition = mdwPosition
        .replace('bottom', '')
        .replace('top', '')
        .replace('vcenter', '')
        .trim();
      switch (value) {
        case 'auto':
          break;
        default:
          mdwPosition = `${value} ${mdwPosition}`.trim();
          break;
      }
      break;
    case 'hposition':
      mdwPosition = mdwPosition
        .replace('start', '')
        .replace('end', '')
        .replace('left', '')
        .replace('right', '')
        .replace('hcenter', '')
        .trim();
      switch (value) {
        case 'auto':
          break;
        default:
          mdwPosition = `${mdwPosition} ${value}`.trim();
          break;
      }
      break;
    case 'vdirection':
      mdwDirection = mdwDirection
        .replace('down', '')
        .replace('up', '')
        .replace('vcenter', '')
        .trim();
      switch (value) {
        case 'auto':
          break;
        default:
          mdwDirection = `${value} ${mdwDirection}`.trim();
          break;
      }
      break;
    case 'hdirection':
      mdwDirection = mdwDirection
        .replace('normal', '')
        .replace('reverse', '')
        .replace('ltr', '')
        .replace('rtl', '')
        .replace('hcenter', '')
        .trim();
      switch (value) {
        case 'auto':
          break;
        default:
          mdwDirection = `${mdwDirection} ${value}`.trim();
          break;
      }
      break;
    case 'width':
      switch (value) {
        case 'auto':
          sampleComponent.removeAttribute('mdw-width-units');
          break;
        default:
          sampleComponent.setAttribute('mdw-width-units', value);
          break;
      }
      break;
    default:
  }
  if (!mdwPosition) {
    sampleComponent.removeAttribute('mdw-position');
  } else if (sampleComponent.getAttribute('mdw-position') !== mdwPosition) {
    sampleComponent.setAttribute('mdw-position', mdwPosition);
  }
  if (!mdwDirection) {
    sampleComponent.removeAttribute('mdw-direction');
  } else if (sampleComponent.getAttribute('mdw-direction') !== mdwDirection) {
    sampleComponent.setAttribute('mdw-direction', mdwDirection);
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-menu');
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
