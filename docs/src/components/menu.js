import { Menu } from '../../../components/menu/index';
import { setupMenuOptions } from '../menuoptions';
import { convertElementToCode, attachEventListener, changeElementTagName } from '../sample-utils';

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
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  Menu.detach(sampleComponent);
  let button = document.querySelector('.component-sample .mdw-button');
  let closer = document.querySelector('.component-sample .mdw-menu__close');
  button.removeEventListener('click', onSampleButtonClick);
  const tabIndexElements = sampleComponent.querySelectorAll('[tabindex]');
  for (let i = 0; i < tabIndexElements.length; i += 1) {
    tabIndexElements.item(i).removeAttribute('tabindex');
  }

  if (closer) {
    if (jsRequired || (closer instanceof HTMLAnchorElement === false)) {
      closer.parentElement.removeChild(closer);
      closer = null;
    }
  }

  if (jsRequired) {
    sampleComponent.removeAttribute('id');
    button.removeAttribute('href');
    if (button instanceof HTMLAnchorElement) {
      button = changeElementTagName(button, 'button');
    }
  } else {
    sampleComponent.setAttribute('id', 'sample-menu');
    button.setAttribute('href', '#sample-menu');
    if (button instanceof HTMLButtonElement) {
      button = changeElementTagName(button, 'a');
    }
    if (!closer) {
      closer = document.createElement('a');
      closer.classList.add('mdw-menu__close');
      closer.setAttribute('href', '#');
      sampleComponent.insertBefore(closer, sampleComponent.firstElementChild);
    }
  }


  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const sampleContainer = document.querySelector('.component-sample__container');
  const htmlCodeBlocks = [];
  let el = sampleContainer.firstElementChild;
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
  ].join('\n');
}

/** @return {void} */
function initializeSampleComponents() {
  const button = document.querySelector('.js .mdw-button');
  const menu = document.querySelector('.js .mdw-menu');
  button.addEventListener('click', (event) => {
    Menu.show(menu, event);
  });
  const menuItems = menu.querySelectorAll('.mdw-menu__item');
  for (let i = 0; i < menuItems.length; i += 1) {
    const menuItem = menuItems.item(i);
    menuItem.addEventListener('click', () => {
      if (menuItem.hasAttribute('disabled')) {
        return;
      }
      Menu.hide(menu);
    });
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  let mdwPosition = sampleComponent.getAttribute('mdw-position') || '';

  switch (name) {
    case 'hposition':
      mdwPosition = mdwPosition
        .replace('end', '')
        .replace('left', '')
        .replace('right', '')
        .trim();
      switch (value) {
        case 'start':
          break;
        default:
          mdwPosition = `${value} ${mdwPosition}`.trim();
          break;
      }
      break;
    case 'vposition':
      mdwPosition = mdwPosition
        .replace('top', '')
        .replace('bottom', '')
        .trim();
      switch (value) {
        case 'auto':
          break;
        default:
          mdwPosition = `${mdwPosition} ${value}`.trim();
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
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-menu');
  attachEventListener(
    document.querySelectorAll('input[name]'),
    'change',
    onOptionChange
  );
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();

setupMenuOptions();

