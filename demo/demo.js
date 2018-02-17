import * as mdw from '../components/index';

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

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onTemplateImageClick(event) {
  crosshairs.hOffset = event.clientY;
  crosshairs.vOffset = event.clientX;
}

/** @return {void} */
function setupOptions() {
  document
    .querySelector('input[name="largeFontSize"]')
    .addEventListener('change', (event) => {
      const el = document.querySelector('html');
      if (event.target.checked) {
        el.style.setProperty('font-size', '24px');
      } else {
        el.style.setProperty('font-size', '');
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

/**
 * @param {HTMLElement} element
 * @param {string} classname
 * @return {boolean}
 */
function hasSomeParentTheClass(element, classname) {
  if (element.className && element.className.split(' ').indexOf(classname) >= 0) {
    return true;
  }
  return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}

/** @return {void} */
function start() {
  setupOptions();
  document.querySelectorAll('.mdw-textfield').forEach((element) => {
    new mdw.TextField(element);
  });
  document.querySelectorAll('.mdw-button').forEach((element) => {
    if (!hasSomeParentTheClass(element, 'no-js')) {
      new mdw.Button(element);
    }
  });
  document.querySelectorAll('.target').forEach((element) => {
    element.addEventListener('click', onTemplateImageClick);
  });
}

start();
