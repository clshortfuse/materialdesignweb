import { iterateArrayLike, setTextNode } from '../../core/dom';

const sampleComponent = document.getElementById('sample-component');

const colspans = [
  '1',
  '25%', '50%', '75%', '100%',
  '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
];

/**
 * @param {Element} target
 * @return {void}
 */
function onGridItemClick(target) {
  let colspan = target.getAttribute('mdw-colspan') || '1';
  const index = colspans.indexOf(colspan);
  colspan = colspans[index + 1] || '1';
  target.setAttribute('mdw-colspan', colspan.toString());
  setTextNode(target.firstElementChild, colspan.toString());
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  const grid = sampleComponent.getElementsByClassName('mdw-grid')[0];

  switch (name) {
    case 'default-margins':
      if (checked) {
        grid.removeAttribute('mdw-margin');
        grid.removeAttribute('mdw-gutter');
        grid.removeAttribute('mdw-margin-8col');
        grid.removeAttribute('mdw-gutter-8col');
        grid.removeAttribute('mdw-margin-4col');
        grid.removeAttribute('mdw-gutter-4col');
      } else {
        grid.setAttribute('mdw-margin', '40');
        grid.setAttribute('mdw-gutter', '40');
        grid.setAttribute('mdw-margin-8col', '8');
        grid.setAttribute('mdw-gutter-8col', '8');
        grid.setAttribute('mdw-margin-4col', '0');
        grid.setAttribute('mdw-gutter-4col', '0');
      }
      break;
    case 'top-margin':
      if (checked) {
        grid.setAttribute('mdw-margin-top', '');
      } else {
        grid.removeAttribute('mdw-margin-top');
      }
      break;
    case 'bottom-margin':
      if (checked) {
        grid.setAttribute('mdw-margin-bottom', '');
      } else {
        grid.removeAttribute('mdw-margin-bottom');
      }
      break;
    case 'stretch':
      if (checked) {
        grid.setAttribute('mdw-stretch', '');
      } else {
        grid.removeAttribute('mdw-stretch');
      }
      break;
    case 'center':
      if (checked) {
        grid.setAttribute('mdw-center', '');
      } else {
        grid.removeAttribute('mdw-center');
      }
      break;
    case 'style':
      switch (value) {
        case 'grid':
          grid.setAttribute('mdw-grid', '');
          break;
        case 'flex':
          grid.removeAttribute('mdw-grid');
          break;
        default:
      }
      break;
    case 'dense':
      if (checked) {
        grid.setAttribute('mdw-dense', '');
      } else {
        grid.removeAttribute('mdw-dense');
      }
      break;
    case 'columns':
      switch (value) {
        default:
        case '12':
          grid.removeAttribute('mdw-columns');
          break;
        case '8':
          grid.setAttribute('mdw-columns', '8');
          break;
        case '4':
          grid.setAttribute('mdw-columns', '4');
          break;
        case '1':
          grid.setAttribute('mdw-columns', '1');
          break;
      }
      break;
    default:
  }
}

/** @return {void} */
function setupInteractions() {
  iterateArrayLike(sampleComponent.getElementsByClassName('mdw-grid__item'), (item) => {
    item.addEventListener('click', () => {
      onGridItemClick(item);
    });
  });
  iterateArrayLike(document.querySelectorAll('[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

setupInteractions();
