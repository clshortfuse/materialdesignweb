import * as mdw from '../components/index';

import Comparison from './data/Comparison';
import { templates as textFieldTemplates } from './textfield';

const crosshairs = new Proxy(
  { hOffset: 0, vOffset: 0 },
  {
    set(obj, prop, val) {
      Reflect.set(obj, prop, val);
      if (prop === 'vOffset') {
        document.getElementById('verticalLineLeft').style.left = `${val}px`;
        document.getElementById('verticalLineRight').style.left = `${parseInt(val, 0) - 376}px`;
      } else if (prop === 'hOffset') {
        document.getElementById('horizontalLine').style.top = `${val}px`;
      }
      return true;
    },
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
  }
);

const comparisonMap = new WeakMap();

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onTemplateImageClick(event) {
  crosshairs.hOffset = event.clientY;
  crosshairs.vOffset = event.clientX;
}

/** @return {void} */
function setupTemplates() {
  const templates = []
    .concat(textFieldTemplates);
  const el = document.getElementById('comparisons');
  templates.forEach((template) => {
    const comparison = new Comparison(Object.assign(template, {
      onImageClick: onTemplateImageClick,
    }));
    comparisonMap.set(comparison, template);
    el.appendChild(comparison.element);
  });
}

/** @return {void} */
function setupOptions() {
  document
    .querySelector('input[name="applyFixes"]')
    .addEventListener('change', (event) => {
      const el = document.getElementById('comparisons');
      if (event.target.checked) {
        el.classList.add('fixed');
      } else {
        el.classList.remove('fixed');
      }
    });
  document
    .querySelector('input[name="debug"]')
    .addEventListener('change', (event) => {
      const el = document.getElementById('comparisons');
      if (event.target.checked) {
        el.classList.add('debug');
      } else {
        el.classList.remove('debug');
      }
    });
  document
    .querySelector('input[name="rtl"]')
    .addEventListener('change', (event) => {
      const el = document.querySelector('html');
      if (event.target.checked) {
        el.setAttribute('dir', 'rtl');
      } else {
        el.setAttribute('dir', 'ltr');
      }
    });
}

/** @return {void} */
function start() {
  setupTemplates();
  setupOptions();
}

start();
