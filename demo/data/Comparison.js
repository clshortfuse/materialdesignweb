import { Template } from './Template';

export default class Comparison {
  /**
   * @param {Template} options
   */
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
        startIcon.textContent = options.toolbar.start.join(' ');
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
        endIcon.textContent = options.toolbar.end.join(' ');
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
    if (options.onImageClick) {
      this.onImageClick = options.onImageClick;
      img.addEventListener('click', (event) => {
        this.onImageClick(event);
      });
    }
    this.element.appendChild(img);
  }
}
