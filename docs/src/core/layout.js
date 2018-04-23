import { setupMenuOptions } from '../menuoptions';


const colspans = [
  '1',
  '25%', '50%', '75%', '100%',
  '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
];

/**
 * @param {Element} target
 * @return {void}
 */
function onLayoutItemClick(target) {
  let colspan = target.getAttribute('mdw-colspan') || '1';
  const index = colspans.indexOf(colspan);
  colspan = colspans[index + 1] || '1';
  target.setAttribute('mdw-colspan', colspan.toString());
  target.firstElementChild.textContent = colspan.toString();
}

/** @return {void} */
function setupInteractions() {
  const layoutItems = document.getElementsByClassName('mdw-layout__item');
  for (let i = 0; i < layoutItems.length; i += 1) {
    const item = layoutItems.item(i);
    item.addEventListener('click', () => {
      onLayoutItemClick(item);
    });
  }
  const layout = document.querySelector('.mdw-layout.docs-layout');
  const [
    useDefaultsCheckbox,
    useFlexRadio,
    useStretchCheckbox,
    useCenterCheckbox,
    useGridRadio,
    useDenseCheckbox,
  ] = document.querySelectorAll('.mdw-navdrawer__content input');

  useDefaultsCheckbox.addEventListener('change', () => {
    if (useDefaultsCheckbox.checked) {
      layout.removeAttribute('mdw-margin');
      layout.removeAttribute('mdw-gutter');
      layout.removeAttribute('mdw-margin-tablet');
      layout.removeAttribute('mdw-gutter-tablet');
      layout.removeAttribute('mdw-margin-mobile');
      layout.removeAttribute('mdw-gutter-mobile');
    } else {
      layout.setAttribute('mdw-margin', '24');
      layout.setAttribute('mdw-gutter', '24');
      layout.setAttribute('mdw-margin-tablet', '16');
      layout.setAttribute('mdw-gutter-tablet', '16');
      layout.setAttribute('mdw-margin-mobile', '8');
      layout.setAttribute('mdw-gutter-mobile', '8');
    }
  });

  useStretchCheckbox.addEventListener('change', () => {
    if (useStretchCheckbox.checked) {
      layout.setAttribute('mdw-stretch', '');
    } else {
      layout.removeAttribute('mdw-stretch');
    }
  });

  useCenterCheckbox.addEventListener('change', () => {
    if (useCenterCheckbox.checked) {
      layout.setAttribute('mdw-center', '');
    } else {
      layout.removeAttribute('mdw-center');
    }
  });

  useFlexRadio.addEventListener('change', () => {
    if (useFlexRadio.checked) {
      layout.removeAttribute('mdw-grid');
    } else {
      layout.setAttribute('mdw-grid', '');
    }
  });

  useGridRadio.addEventListener('change', () => {
    if (useGridRadio.checked) {
      layout.setAttribute('mdw-grid', '');
    } else {
      layout.removeAttribute('mdw-grid');
    }
  });

  useDenseCheckbox.addEventListener('change', () => {
    if (useDenseCheckbox.checked) {
      layout.setAttribute('mdw-dense', '');
    } else {
      layout.removeAttribute('mdw-dense');
    }
  });

  
}

setupInteractions();
setupMenuOptions();
