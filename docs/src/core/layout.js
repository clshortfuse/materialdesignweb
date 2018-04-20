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
  const checkbox = document.querySelector('.mdw-navdrawer__content input');
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      layout.setAttribute('mdw-grid', '');
    } else {
      layout.removeAttribute('mdw-grid');
    }
  });
}

setupInteractions();
setupMenuOptions();
