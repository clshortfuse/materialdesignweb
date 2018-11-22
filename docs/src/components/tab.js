import { Tab } from '../../../components/tab/index';
import { setupMenuOptions } from '../menuoptions';
import { convertElementToCode, attachEventListener, changeElementTagName } from '../sample-utils';

/** @type {HTMLElement} */
let sampleComponent;

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
    Tab.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.Tab.attach(tabElement);';
}

/** @return {void} */
function initializeSampleComponents() {
  const tabs = document.querySelectorAll('.js .mdw-tab');
  for (let i = 0; i < tabs.length; i += 1) {
    Tab.attach(tabs.item(i));
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
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
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-tab');
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
