import * as mdw from '../components/index';

import Comparison from './data/Comparison';
import { Template } from './data/Template';
import { templates as textFieldTemplates } from './textfield';


const crosshairs = {
};
let vOffset = 0;
let hOffset = 0;

Object.defineProperty(crosshairs, 'vOffset', {
  enumerable: true,
  configurable: false,
  get() {
    return vOffset;
  },
  set(val) {
    vOffset = val;
    document.getElementById('verticalLineLeft').style.left = `${val}px`;
    document.getElementById('verticalLineRight').style.left = `${parseInt(val, 0) - 376}px`;
  },
});

Object.defineProperty(crosshairs, 'hOffset', {
  enumerable: true,
  configurable: false,
  get() {
    return hOffset;
  },
  set(val) {
    hOffset = val;
    document.getElementById('horizontalLine').style.top = `${val}px`;
  },
});

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
  /** @type {Template[]} */
  const templates = [];
  templates.push(...textFieldTemplates);
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
  document.querySelectorAll('.mdw-text-field').forEach((element) => {
    const textfield = new mdw.TextField(element);
  });
}

start();
