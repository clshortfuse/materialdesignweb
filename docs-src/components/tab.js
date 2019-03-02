import { Tab } from '../../components/tab/index';
import { convertElementToCode, changeElementTagName } from '../sample-utils';
import { iterateArrayLike } from '../../components/common/dom';

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function onWindowResize() {
  Tab.onResize(sampleComponent);
}

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  Tab.detach(sampleComponent);

  if (jsRequired && sampleComponent instanceof HTMLDivElement === false) {
    sampleComponent = changeElementTagName(sampleComponent, 'div');
  } else if (!jsRequired && sampleComponent instanceof HTMLFormElement === false) {
    sampleComponent = changeElementTagName(sampleComponent, 'form');
  }

  const inputs = sampleComponent.getElementsByTagName('input');
  const tabItems = sampleComponent.getElementsByClassName('mdw-tab__item');

  if (jsRequired) {
    for (let i = inputs.length - 1; i >= 0; i -= 1) {
      const input = inputs.item(i);
      input.parentElement.removeChild(input);
    }
    for (let i = 0; i < tabItems.length; i += 1) {
      let item = tabItems.item(i);
      if (item instanceof HTMLDivElement === false) {
        item = changeElementTagName(item, 'div');
      }
      item.removeAttribute('for');
    }
  } else {
    const tabItemsElement = sampleComponent.getElementsByClassName('mdw-tab__items')[0];
    for (let i = 0; i < 3; i += 1) {
      let input = inputs.item(i);
      let tabItem = tabItems.item(i);
      if (!input) {
        input = document.createElement('input');
        input.checked = (i === 0);
        input.classList.add('mdw-tab__input');
        input.setAttribute('id', `tab${i + 1}`);
        input.setAttribute('name', 'tab');
        input.setAttribute('type', 'radio');
        sampleComponent.insertBefore(input, tabItemsElement);
      }
      if (tabItem instanceof HTMLLabelElement === false) {
        tabItem = changeElementTagName(tabItem, 'label');
      }
      tabItem.setAttribute('for', `tab${i + 1}`);
    }
  }

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const sampleContainer = document.querySelector('.component-sample__container').firstElementChild;
  htmlCodeElement.textContent = convertElementToCode(sampleContainer);

  // Reattach JS if requested
  if (useJS) {
    window.addEventListener('resize', onWindowResize);
    Tab.attach(sampleComponent);
  } else {
    window.removeEventListener('resize', onWindowResize);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = [
    'mdw.Tab.attach(tabElement);',
    '',
    "window.addEventListener('resize', () => mdw.Tab.onResize(tabElement));",
  ].join('\n');
}

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-tab'), Tab.attach);
  iterateArrayLike(document.getElementsByTagName('form'), (formElement) => {
    formElement.reset();
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  /** @type {HTMLInputElement} */
  const inputElement = (event.currentTarget);
  const { name, value, checked } = inputElement;
  const tabItemsElement = sampleComponent.querySelector('.mdw-tab__items');

  switch (name) {
    case 'framework':
      switch (value) {
        case 'javascript':
          break;
        case 'css':
          break;
        default:
      }
      break;
    case 'color':
      switch (value) {
        case 'default':
          tabItemsElement.removeAttribute('mdw-theme-color');
          break;
        default:
          tabItemsElement.setAttribute('mdw-theme-color', value);
          break;
      }
      break;
    case 'fill':
      switch (value) {
        case 'none':
          tabItemsElement.removeAttribute('mdw-theme-fill');
          break;
        default:
          tabItemsElement.setAttribute('mdw-theme-fill', value);
          break;
      }
      break;
    case 'tabs-scrollable':
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-tab__items')[0].setAttribute('mdw-scrollable', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-tab__items')[0].removeAttribute('mdw-scrollable');
      }
      break;
    case 'content-scrollable': {
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-tab__content')[0].setAttribute('mdw-scrollsnap', '');
        sampleComponent.getElementsByClassName('mdw-tab__items')[0].setAttribute('mdw-scrollsnap', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-tab__content')[0].removeAttribute('mdw-scrollsnap');
        sampleComponent.getElementsByClassName('mdw-tab__items')[0].removeAttribute('mdw-scrollsnap');
      }
      break;
    }
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-tab');
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
