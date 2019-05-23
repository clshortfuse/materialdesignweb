import DomAdapter from '../../adapters/dom/index';
import * as ListItem from '../../components/list/item';
import { iterateArrayLike } from '../../core/dom';
import { ListContent } from '../../index';

class CustomDataSourceItem {
  /** @param {number} i */
  constructor(i) {
    this.itemnumber = i;
    this.clickCount = 0;
    this.expanded = false;
  }
}

/** @type {CustomDataSourceItem[]} */
const datasource = [];

/** @type {HTMLElement} */
let sampleComponent;

/** @type {DomAdapter<CustomDataSourceItem, HTMLLIElement>} */
let domAdapter;

/** @return {void} */
function resetDatasource() {
  datasource.splice(0, datasource.length);
  for (let i = 0; i < 500; i += 1) {
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
}
/** @return {void} */
function setupComponentOptions() {
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
  sampleComponent = document.querySelector('.component-sample .mdw-list');
  resetDatasource();
  domAdapter = new DomAdapter({
    element: sampleComponent,
    datasource,
    recycle: {
      scroller: sampleComponent.parentElement,
      fastMeasure: true,
      block: true,
      deferRender: true,
      equalSize: false,
    },
    render(child, data, index) {
      const textLines = child.getElementsByClassName('mdw-list__text-line');
      textLines[0].textContent = `Item ${data.itemnumber}`;
      textLines[1].textContent = `Click count: #${data.clickCount}`;
      if (data.expanded) {
        child.style.setProperty('height', '128px');
        child.style.setProperty('background-color', 'red');
      } else {
        child.style.setProperty('height', '64px');
        child.style.removeProperty('background-color');
      }
      child.firstElementChild.setAttribute('aria-posinset', index.toString(10));
    },
    create(data) {
      // Create placeholder UI
      const listItem = document.createElement('li');
      if (!domAdapter.recycle.block) {
        listItem.style.setProperty('display', 'inline-flex');
        listItem.style.setProperty('width', '33.333%');
      }
      if (domAdapter.recycle.deferRender) {
        listItem.style.setProperty('min-height', '64px');
        if (data.expanded) {
          listItem.style.setProperty('height', '128px');
        }
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
  const buttons = document.querySelectorAll('.mdw-layout__content-page .mdw-button');
  buttons[0].addEventListener('click', () => {
    buttons[1].removeAttribute('aria-disabled');
    resetDatasource();
    domAdapter.refresh();
  });
  buttons[1].addEventListener('click', () => {
    if (buttons[1].getAttribute('aria-disabled') === 'true') {
      return;
    }
    const item = datasource[10];
    domAdapter.removeItem(item);
    datasource.splice(10, 1);

    // Alternatively, we can remove from datasource first and call invalidateAll()

    domAdapter.drawViewport();
    buttons[1].setAttribute('aria-disabled', 'true');
  });
  buttons[2].addEventListener('click', () => {
    const item = datasource.filter(d => d.itemnumber === 50)[0];
    item.clickCount += 1;
    // Element will not change size, therefore avoid possible invalidation
    // (When element is refreshed and not in DOM, adapter may assume sized change)
    domAdapter.refreshItem(item, { invalidate: false });
    domAdapter.drawViewport();
  });
  buttons[3].addEventListener('click', () => {
    const item = datasource.filter(d => d.itemnumber === 80)[0];
    item.expanded = !item.expanded;
    // Force invalidation from height change
    domAdapter.refreshItem(item, { invalidate: true });
    domAdapter.drawViewport();
  });
  sampleComponent.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
    /** @type {HTMLElement} */
    const listContent = (event.target);
    /** @type {HTMLLIElement} */
    const listItem = (listContent.parentElement);
    const dataItem = domAdapter.elementDataMap.get(listItem);
    dataItem.clickCount += 1;
    domAdapter.refreshItem(dataItem);
  });
}

setupComponentOptions();
