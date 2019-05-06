import DomAdapter from '../../adapters/dom/index';
import * as ListItem from '../../components/list/item';
import { iterateArrayLike } from '../../core/dom';

class CustomDataSourceItem {
  /** @param {number} i */
  constructor(i) {
    this.itemnumber = i;
  }
}

/** @type {CustomDataSourceItem[]} */
const datasource = [];

/** @type {HTMLElement} */
let sampleComponent;

/** @type {DomAdapter<CustomDataSourceItem, HTMLLIElement>} */
let domAdapter;

/** @return {void} */
function fillDatasource() {
  for (let i = 0; i < 100; i += 1) {
    datasource.push(new CustomDataSourceItem(i));
  }
}
/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = /** @type {HTMLInputElement} */ (event.target);
  domAdapter.recycle[name] = checked;
  domAdapter.refresh();
  console.log(name, checked);
}
/** @return {void} */
function setupComponentOptions() {
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
  sampleComponent = document.querySelector('.component-sample .mdw-list');
  fillDatasource();
  domAdapter = new DomAdapter({
    element: sampleComponent,
    datasource,
    recycle: {
      scroller: sampleComponent.parentElement,
      fastMeasure: true,
      equalSize: true,
      block: true,
      deferRender: true,
    },
    render(child, sourceItem) {
      const textLines = child.getElementsByClassName('mdw-list__text-line');
      textLines[0].textContent = `Item ${sourceItem.itemnumber}`;
      textLines[1].textContent = `Description for item #${sourceItem.itemnumber}`;
    },
    create(data) {
      // Create placeholder UI
      const listItem = document.createElement('li');
      if (!domAdapter.recycle.block) {
        listItem.style.setProperty('display', 'inline-flex');
        listItem.style.setProperty('width', '33.333%');
      }
      if (domAdapter.recycle.deferRender) {
        listItem.style.setProperty('height', '64px');
        listItem.style.setProperty('max-height', '64px');
      }
      listItem.className = 'mdw-list__item';
      listItem.innerHTML = `
        <a class="mdw-list__content">
          <div class="mdw-list__text">
            <div class="mdw-list__text-line">Item ${data.itemnumber}</div>
            <div class="mdw-list__text-line mdw-theme" mdw-ink="medium">Waiting for idle...</div>
          </div>
        </a>
      `;
      ListItem.attach(listItem);
      return listItem;
    },
  });
  domAdapter.refresh();
  const button = document.querySelector('.mdw-layout__content-page .mdw-button');
  window.addEventListener('resize', () => {
    // Pre-draw resize event
    requestAnimationFrame(() => {
      // Fires on same frame as pre-resize
      requestAnimationFrame(() => {
        // First Post resize frame
        domAdapter.refresh();
      });
    });
  });
  button.addEventListener('click', () => domAdapter.refresh());
}

setupComponentOptions();
