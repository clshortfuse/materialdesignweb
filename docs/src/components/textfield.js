import { TextField } from '../../../components/textfield/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function initializeSampleComponents() {
  const textfields = document.querySelectorAll('.js .mdw-textfield');
  for (let i = 0; i < textfields.length; i += 1) {
    TextField.attach(textfields.item(i));
  }
}

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
  TextField.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const htmlType = sampleComponent.tagName.toLowerCase();
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
    TextField.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.TextField.attach(element);';
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  const inputElement = sampleComponent.getElementsByClassName('mdw-textfield__input')[0];
  let desiredTagName = inputElement.tagName.toLowerCase();
  let helperText;
  let errorText;
  let prefixText;
  let suffixText;
  let iconElement;
  switch (name) {
    case 'field-type':
      switch (value) {
        default:
        case 'single-type':
          sampleComponent.removeAttribute('mdw-multiline');
          sampleComponent.removeAttribute('mdw-textarea');
          desiredTagName = 'input';
          break;
        case 'multi-line':
          sampleComponent.setAttribute('mdw-multiline', '');
          sampleComponent.removeAttribute('mdw-textarea');
          desiredTagName = 'textarea';
          break;
        case 'text-area':
          sampleComponent.removeAttribute('mdw-multiline');
          sampleComponent.setAttribute('mdw-textarea', '');
          desiredTagName = 'textarea';
          break;
      }
      break;
    case 'box':
      if (checked) {
        sampleComponent.setAttribute('mdw-box', '');
      } else {
        sampleComponent.removeAttribute('mdw-box');
      }
      break;
    case 'disabled':
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].setAttribute('disabled', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].removeAttribute('disabled');
      }
      break;
    case 'required':
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].setAttribute('required', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].removeAttribute('required');
      }
      break;
    case 'prefix':
      prefixText = sampleComponent.getElementsByClassName('mdw-textfield__prefix')[0];
      if (checked) {
        if (!prefixText) {
          prefixText = document.createElement('div');
          prefixText.classList.add('mdw-textfield__prefix');
          prefixText.textContent = '$';
          sampleComponent.appendChild(prefixText);
        }
      } else if (prefixText) {
        prefixText.parentElement.removeChild(prefixText);
      }
      break;
    case 'suffix':
      suffixText = sampleComponent.getElementsByClassName('mdw-textfield__suffix')[0];
      if (checked) {
        if (!suffixText) {
          suffixText = document.createElement('div');
          suffixText.classList.add('mdw-textfield__suffix');
          suffixText.textContent = 'lbs';
          sampleComponent.appendChild(suffixText);
        }
      } else if (suffixText) {
        suffixText.parentElement.removeChild(suffixText);
      }
      break;
    case 'icon':
      iconElement = sampleComponent.getElementsByClassName('mdw-textfield__icon')[0];
      if (checked) {
        if (!iconElement) {
          iconElement = document.createElement('div');
          iconElement.classList.add('mdw-textfield__icon');
          iconElement.classList.add('material-icons');
          iconElement.textContent = 'security';
          sampleComponent.insertBefore(iconElement, inputElement);
        }
      } else if (iconElement) {
        iconElement.parentElement.removeChild(iconElement);
      }
      break;
    case 'helper-text':
      helperText = sampleComponent.getElementsByClassName('mdw-textfield__helper-text')[0];
      if (checked) {
        if (!helperText) {
          helperText = document.createElement('div');
          helperText.classList.add('mdw-textfield__helper-text');
          helperText.textContent = 'Helper text.';
          sampleComponent.appendChild(helperText);
        }
      } else if (helperText) {
        helperText.parentElement.removeChild(helperText);
      }
      break;
    case 'error-text':
      errorText = sampleComponent.getElementsByClassName('mdw-textfield__error-text')[0];
      if (checked) {
        if (!errorText) {
          errorText = document.createElement('div');
          errorText.classList.add('mdw-textfield__error-text');
          errorText.textContent = 'Error text.';
          sampleComponent.appendChild(errorText);
        }
      } else if (errorText) {
        errorText.parentElement.removeChild(errorText);
      }
      break;
    case 'content':
      switch (value) {
        case 'text':
          sampleComponent.removeAttribute('mdw-icon');
          sampleComponent.classList.remove('material-icons');
          sampleComponent.textContent = 'Button';
          break;
        case 'icon':
          sampleComponent.setAttribute('mdw-icon', '');
          sampleComponent.classList.add('material-icons');
          sampleComponent.textContent = 'favorite';
          break;
        default:
      }
      break;
    case 'color':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-theme-color');
          break;
        default:
          sampleComponent.setAttribute('mdw-theme-color', value);
          break;
      }
      break;
    case 'fill':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-theme-fill');
          break;
        default:
          sampleComponent.setAttribute('mdw-theme-fill', value);
          break;
      }
      break;
    default:
  }

  if (inputElement.tagName.toLowerCase() !== desiredTagName) {
    const newElement = document.createElement(desiredTagName);
    while (inputElement.firstChild) {
      newElement.appendChild(inputElement.firstChild);
    }
    for (let i = inputElement.attributes.length - 1; i >= 0; i -= 1) {
      const attr = inputElement.attributes.item(i);
      newElement.attributes.setNamedItem(attr.cloneNode());
    }
    inputElement.parentElement.replaceChild(newElement, inputElement);
  }
  inputElement.removeAttribute('rows');
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-textfield');
  attachEventListener(
    document.querySelectorAll('input[name]'),
    'change',
    onOptionChange
  );
}

initializeSampleComponents();
setupMenuOptions();
setupComponentOptions();
updateSampleCode();
