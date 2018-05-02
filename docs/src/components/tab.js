import { Tab } from '../../../components/tab/index';
import { setupMenuOptions } from '../menuoptions';
import { convertElementToCode } from '../codegenerator';

/** @type {HTMLElement} */
let sampleComponent;

/**
 * @param {Element|NodeListOf<Element>} elements
 * @param {string} event
 * @param {Function} listener
 * @return {void}
 */
function attachEventListener(elements, event, listener) {
  let elementList;
  if (elements instanceof Element) {
    elementList = [elementList];
  } else {
    elementList = elements;
  }
  for (let i = 0; i < elementList.length; i += 1) {
    const el = elementList[i];
    el.addEventListener(event, listener);
  }
}

/** @return {void} */
function updateSampleCode() {
  // Strip JS related elements and attributes
  Tab.detach(sampleComponent);


  const useJS = document.querySelector('input[name="framework"][value="js"]').checked;
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
    case 'color':
      switch (value) {
        case 'none':
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
