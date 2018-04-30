import { Button } from '../../../components/button/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function initializeMdwComponents() {
  const buttons = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < buttons.length; i += 1) {
    Button.attach(buttons.item(i));
  }
}

/** @type {HTMLElement} */
let sampleComponent;
/**
 * 
 * @param {Element|NodeListOf<Element>} elements
 * @param {string} event
 * @param {Function} listener 
 */
function attachEventListener(elements, event, listener) {
  let elementList;
  if (elements instanceof Element) {
    elementList = [elementList];
  } else {
    elementList = elements;
  }
  for (let i = 0; i < elementList.length; i++) {
    const el = elementList[i];
    el.addEventListener(event, listener);
  }
}

function onOptionChange(event) {
  const name = event.target.name;
  const value = event.target.value;
  const checked = event.target.checked;
  switch (name) {
    case "elevation":
      switch (value) {
        default:
        case 'flat':
          sampleComponent.removeAttribute('mdw-raised');
          break;
        case 'raised':
          sampleComponent.setAttribute('mdw-raised', '');
          break;
        case 'raised-always':
          sampleComponent.setAttribute('mdw-raised', 'always');
          break;
      }
      break;
    case "disabled":
      if (checked) {
        sampleComponent.setAttribute('disabled', '');
      } else {
        sampleComponent.removeAttribute('disabled');
      }
      break;
    case "focus-ring":
      let focusRing = sampleComponent.getElementsByClassName('mdw-button__focus-ring')[0];
      if (checked) {
        if (!focusRing) {
          focusRing = document.createElement('div');
          focusRing.classList.add('mdw-button__focus-ring');
          sampleComponent.insertBefore(focusRing, sampleComponent.firstChild);
        }
      } else {
        if (focusRing) {
          focusRing.parentElement.removeChild(focusRing);
        }
      }
      break;
    case "content":
      switch (value) {
        case "text":
          sampleComponent.removeAttribute('mdw-icon');
          sampleComponent.classList.remove('material-icons')
          sampleComponent.textContent = 'Button';
          break;
        case "icon":
          sampleComponent.setAttribute('mdw-icon', '');
          sampleComponent.classList.add('material-icons')
          sampleComponent.textContent = 'favorite';
          break;
      }
      break;
    case "color":
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-theme-color');
          break;
        default:
          sampleComponent.setAttribute('mdw-theme-color', value);
          break;
      }
      break;
    case "fill":
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-theme-fill');
          break;
        default:
          sampleComponent.setAttribute('mdw-theme-fill', value);
          break;
      }
      break;
    case "htmltype":
      const newElement = document.createElement(value);
      while(sampleComponent.firstChild) {
        newElement.appendChild(sampleComponent.firstChild);
      }
      for (let i = sampleComponent.attributes.length - 1; i >= 0; i -= 1) {
        const attr = sampleComponent.attributes.item(i);
        newElement.attributes.setNamedItem(attr.cloneNode());
      }
      sampleComponent.parentElement.replaceChild(newElement, sampleComponent);
      sampleComponent = newElement;
      if (value === 'a') {
        sampleComponent.setAttribute('href', '#')
      } else {
        sampleComponent.removeAttribute('href');
      }
      break;
  }
  updateSampleCode();
}

function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-button');
  attachEventListener(
    document.querySelectorAll('input[name]'),
    'change',
    onOptionChange
  );
}

function updateSampleCode() {
  // Strip JS related elements and attributes
  Button.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const htmlType = sampleComponent.tagName.toLowerCase();;
  const attributes = [];
  for (let i = 0; i < sampleComponent.attributes.length; i += 1) {
    const attribute = sampleComponent.attributes.item(i);
    if (attribute.value.length) {
      attributes.push(`${attribute.name}="${attribute.value}"`);
    } else {
      attributes.push(attribute.name);
    }
  }
  const syntaxItems = [htmlType, attributes.join(' ')];
  const openingHTMLLine = `<${syntaxItems.filter(item => item).join(' ').trim()}>`;
  const closingHTMLLine = `</${htmlType}>`;
  const innerLines = sampleComponent.innerHTML.split('\n');
  const lines = [openingHTMLLine];
  innerLines
    .filter(line => line.trim())
    .map(line => `  ${line.trim()}`)
    .forEach((line) => lines.push(line));
  lines.push(closingHTMLLine);
  htmlCodeElement.textContent = lines.join('\n');

  // Reattach JS if requested
  if (document.querySelector('input[name="framework"][value="js"]').checked) {
    Button.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = "mdw.Button.attach(element);";
}

setupMenuOptions();

setupComponentOptions();
updateSampleCode();
