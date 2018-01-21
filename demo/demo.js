import * as mdw from '../components/index';

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

const templates = [
  {
    id: 'components_textfields_labels1',
    img:
      'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3UHZpZjVsYjRHcXc/components_textfields_labels1.png',
    statusBarColor: '#303F9F',
    toolbar: {
      color: '#3F51B5',
      title: 'Application',
      start: 'arrow_back',
      end: 'more_vert',
    },
  },
  {
    id: 'components-lists-keylines-two8',
    img:
      'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B6Okdz75tqQsWGQ4OWVWREpLNkU/components-lists-keylines-two8.png',
    statusBarColor: '#0097a7',
    toolbar: {
      color: '#00bcd4',
      title: 'Inbox',
      start: 'menu',
      end: 'search',
    },
  },
  {
    id: 'single-line-text-field-1',
    img:
      'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3dUVPRTdfUXlZWnM/components_textfields_single1.png',
    statusBarColor: '#00796B',
    toolbar: {
      color: '#009688',
      start: 'arrow_back',
      end: 'done',
    },
  },
  {
    id: 'single-line-text-field-2',
    img:
      'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3TVJMNzF0Z3BhZjQ/components_textfields_single2.png',
    theme: 'paletteindigo',
    primaryPalette: 'indigo',
    statusBarColor: 700,
  },
  {
    id: 'components_textfields_multiline2',
    img:
      'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3VktWaDEtaTZ5ZzQ/components_textfields_multiline2.png',
    theme: 'paletteindigo',
    primaryPalette: 'indigo',
    statusBarColor: 700,
  },
  {
    id: 'components_textfields_counter1',
    img:
      'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3WUlMaC1qemQ4WDA/components_textfields_counter1.png',
    theme: 'paletteteal',
    primaryPalette: 'teal',
    statusBarColor: 700,
  },
  {
    id: 'patterns_errors_userinput19',
    img:
      'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3dEZTUF9idzBHMWc/patterns_errors_userinput19.png',
    theme: 'palettered',
    primaryPalette: 'red',
    statusBarColor: 700,
  },
];

class Comparison {
  constructor(options) {
    this.element = document.createElement('div');
    this.element.classList.add('comparison');
    const androidStatusBarMarkup = `
        <div>12:30</div>
        <i class="material-icons">&#xE1BA;&#xE1C8;&#xE1A4;</i>       
      `;
    const toolbarMarkUp = `
        <div class="mdc-toolbar__row">
          <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
          </section>
          <section class="mdc-toolbar__section mdc-toolbar__section--align-end"/>
          </section>
        </div>
      `;
    const androidNavBarMarkup = `
        <i class="material-icons back-button">&#xE3C8;</i>
        <i class="material-icons">&#xE836;</i>
        <i class="material-icons">&#xE835;</i>
      `;
    this.element = document.createElement('div');
    this.element.classList.add('comparison');
    let render = document.getElementById(options.id);
    if (render) {
      if (render.remove) {
        render.remove();
      } else { // ie
        render.parentNode.removeChild(render);
      }
      render.classList.add('render');
    } else {
      render = document.createElement('div');
    }
    render.classList.add('render');
    this.element.appendChild(render);

    if (!render.querySelector('.androidnavbar')) {
      const element = document.createElement('div');
      element.classList.add('androidnavbar');
      element.innerHTML = androidNavBarMarkup;
      render.appendChild(element);
    }
    if (!render.querySelector('.content')) {
      const element = document.createElement('div');
      element.classList.add('content');
      element.innerHTML = options.content || '';
      render.insertBefore(element, render.querySelector('.androidnavbar'));
    }
    if (options.toolbar) {
      if (!render.querySelector('.mdc-toolbar')) {
        const element = document.createElement('header');
        element.classList.add('mdc-toolbar');
        element.innerHTML = toolbarMarkUp;
        render.insertBefore(element, render.querySelector('.content'));
      }
      if (options.toolbar.color) {
        render.querySelector('.mdc-toolbar').style.backgroundColor =
          options.toolbar.color;
      }
      if (options.toolbar.start) {
        const startIcon = document.createElement('a');
        startIcon.setAttribute('href', '#');
        startIcon.classList.add('material-icons', 'mdc-toolbar__menu-icon');
        startIcon.textContent = options.toolbar.start;
        render
          .querySelector('.mdc-toolbar__section--align-start')
          .appendChild(startIcon);
      }
      if (options.toolbar.title) {
        const title = document.createElement('span');
        title.classList.add('mdc-toolbar__title');
        title.textContent = options.toolbar.title;
        render
          .querySelector('.mdc-toolbar__section--align-start')
          .appendChild(title);
      }
      if (options.toolbar.end) {
        const endIcon = document.createElement('a');
        endIcon.setAttribute('href', '#');
        endIcon.classList.add('material-icons', 'mdc-toolbar__menu-icon');
        endIcon.textContent = options.toolbar.end;
        render
          .querySelector('.mdc-toolbar__section--align-end')
          .appendChild(endIcon);
      }
    }
    if (!render.querySelector('.androidstatusbar')) {
      const element = document.createElement('div');
      element.classList.add('androidstatusbar');
      element.innerHTML = androidStatusBarMarkup;
      render.insertBefore(element, render.childNodes[0]);
    }
    render.querySelector('.androidstatusbar').style.backgroundColor =
      options.statusBarColor;
    const img = document.createElement('img');
    img.classList.add('target');
    img.src = options.img;
    img.addEventListener('click', (event) => {
      crosshairs.hOffset = event.clientY;
      crosshairs.vOffset = event.clientX;
    });
    this.element.appendChild(img);
  }
}

const comparisonMap = new WeakMap();
/** @return {void} */
function setupTemplates() {
  const el = document.getElementById('comparisons');
  templates.forEach((template) => {
    const comparison = new Comparison(template);
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
