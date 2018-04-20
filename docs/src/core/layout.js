import { setupMenuOptions } from '../menuoptions';


const spans = [
  '1',
  '25%', '50%', '75%', '100%',
  '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
];

/**
 * @param {Element} target
 * @return {void}
 */
function onLayoutItemClick(target) {
  let span = target.getAttribute('mdw-span') || '1';
  const index = spans.indexOf(span);
  span = spans[index + 1] || '1';
  target.setAttribute('mdw-span', span.toString());
  target.firstElementChild.textContent = span.toString();
}

/** @return {void} */
function setupSpanInteraction() {
  const layoutItems = document.getElementsByClassName('mdw-layout__item');
  for (let i = 0; i < layoutItems.length; i += 1) {
    const item = layoutItems.item(i);
    item.addEventListener('click', () => {
      onLayoutItemClick(item);
    });
  }
}

setupSpanInteraction();
setupMenuOptions();
