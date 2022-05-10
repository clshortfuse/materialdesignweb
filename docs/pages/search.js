import ListAdapter from '../../adapters/list/index.js';
import SearchAdapter from '../../adapters/search/index.js';
import * as ListContent from '../../components/list/content.js';
import * as ListItem from '../../components/list/item.js';
import * as TextField from '../../components/textfield/index.js';
import { setTextNode } from '../../core/dom.js';

/** @typedef {{line1:string, line2:string}} CustomSearchResult */

/** @type {SearchAdapter<any>} */
let searchDocsSimple;
/** @type {SearchAdapter<any>} */
let searchDocsMultiline;

/**
 * @param {string} [filter]
 * @return {CustomSearchResult[]}
 */
function performFakeSearch(filter) {
  const results = [];
  // eslint-disable-next-line guard-for-in
  for (const key in navigator) {
    const navKey = /** @type {keyof Navigator} */ (key);
    const value = navigator[navKey] && navigator[navKey].toString();
    if (!filter || key.includes(filter) || (value && value.includes(filter))) {
      results.push({ line1: key, line2: value });
    }
  }
  return results;
}

/**
 * @param {HTMLElement} element
 * @return {void}
 */
function hideElement(element) {
  element.style.setProperty('display', 'none');
}
/**
 * @param {HTMLElement} element
 * @return {void}
 */
function showElement(element) {
  element.style.setProperty('display', '');
}

/**
 * @param {HTMLLIElement} listItemElement
 * @param {CustomSearchResult} result
 * @return {void}
 */
function searchResultRenderer(listItemElement, result) {
  if (!listItemElement.hasChildNodes()) {
    const markup = `
    <div class="mdw-list__content mdw-theme" mdw-ink="secondary" aria-selected="false">
      <div class="mdw-list__text">
        <div class="mdw-list__text-line"></div>
        <div class="mdw-list__text-line"></div>
      </div>
    </div>`;
    listItemElement.innerHTML = markup;
    ListItem.attach(listItemElement);
  }
  const lines = listItemElement.getElementsByClassName('mdw-list__text-line');
  setTextNode(lines[0], result.line1);
  setTextNode(lines[1], result.line2);
}

/** @return {void} */
function buildCustomSearch1() {
  const textfield = document.getElementById('search-textfield-custom1');
  const list = document.getElementById('search-list-custom1');
  const busyIndicator = /** @type {HTMLElement} */ (textfield.getElementsByClassName('custom-busy-indicator')[0]);

  // For purpose of this demo results are cached.
  // Actual filter is performed by SearchAdapter

  /** @type {ListAdapter<CustomSearchResult>} */
  const customListAdapter = new ListAdapter({
    element: list,
    datasource: [],
    render: searchResultRenderer,
  });

  /** @type {CustomSearchResult[]} */
  let myCachedResults = null;

  /** @type {SearchAdapter<CustomSearchResult>} */
  const searchDocsCustom = new SearchAdapter({
    textfield,
    list,
    searchOnFocus: false,
    dropdown: true,
    textFilter: 'startsWith',
    suggestionMethod: 'append',
    performSearch: async (input) => {
      // Use precached results
      if (myCachedResults != null) {
        return myCachedResults;
      }

      // Display a busy indicator
      showElement(busyIndicator);

      // Add results to a cached search adapter
      myCachedResults = performFakeSearch();

      // Let busy indicator spin to illustrate loading
      await setTimeout(() => { /* noop */ }, 2000);
      return myCachedResults;
    },
    updateList: (searchResults) => {
      // SearchAdapter signaling the UI is ready to update with search results

      if (customListAdapter.datasource === searchResults) {
        // Search results have already been mapped. Nothing to do.
        // SearchAdapter handles item filtering.
        return;
      }

      // Directly assign search results as ListAdapter's data source
      customListAdapter.datasource = searchResults;

      // Remove busy indicator
      hideElement(busyIndicator);

      // Tell ListAdapter to perform a full refresh
      customListAdapter.refresh();
    },
  });

  searchDocsCustom.list.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
    const listContentElement = /** @type {HTMLElement} */ (event.target);
    const listItemElement = /** @type {HTMLLIElement} */ (listContentElement.parentElement);
    const selectedItem = customListAdapter.elementDataMap.get(listItemElement);
    if (!selectedItem) throw new Error('Missing item!');
    const text = `${selectedItem.line1}:${selectedItem.line2}`;
    document.getElementById('search-result-custom1').textContent = text;
  });
}

/** @return {void} */
function buildCustomSearch2() {
  const textfield = document.getElementById('search-textfield-custom2');
  const list = document.getElementById('search-list-custom2');
  const busyIndicator = /** @type {HTMLElement} */ (textfield.getElementsByClassName('custom-busy-indicator')[0]);
  const noResultsIndicator = /** @type {HTMLElement} */ (textfield.getElementsByClassName('custom-no-results-indicator')[0]);

  /** @type {ListAdapter<CustomSearchResult>} */
  const customListAdapter = new ListAdapter({
    element: list,
    datasource: [],
    render: searchResultRenderer,
  });

  // For purpose of this query is "searched" every time with no cache.
  // SearchAdapter performs no filter

  /** @type {SearchAdapter<CustomSearchResult>} */
  const searchDocsCustom = new SearchAdapter({
    textfield,
    list,
    debounce: 300,
    dropdown: true,
    filterItems: false,
    performSearch: async (searchTerm) => {
      // Clear ListAdapter
      customListAdapter.clear();

      showElement(busyIndicator);
      hideElement(noResultsIndicator);

      const myData = performFakeSearch(searchTerm);
      // Spin for 1000ms
      await setTimeout(() => { /* noop */ }, 1000);
      return myData;
    },
    updateList: (items) => {
      hideElement(busyIndicator);

      if (!items.length) {
        showElement(noResultsIndicator);
        return;
      }

      // Assign results to ListAdapter
      customListAdapter.datasource = items;
      customListAdapter.refresh();
    },
  });
  searchDocsCustom.list.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
    const listContentElement = /** @type {HTMLElement} */ (event.target);
    const listItemElement = /** @type {HTMLLIElement} */ (listContentElement.parentElement);
    const selectedItem = customListAdapter.elementDataMap.get(listItemElement);
    const text = `${selectedItem.line1}:${selectedItem.line2}`;
    document.getElementById('search-result-custom2').textContent = text;
  });
}

/** @return {void} */
function setupSearches() {
  if (!searchDocsSimple) {
    searchDocsSimple = new SearchAdapter({
      textfield: document.getElementById('search-textfield-simple'),
      list: document.getElementById('search-list-simple'),
    });
  }
  if (!searchDocsMultiline) {
    searchDocsMultiline = new SearchAdapter({
      textfield: document.getElementById('search-textfield-multiline'),
      list: document.getElementById('search-list-multiline'),
      suggestionMethod: 'none',
    });
  }

  buildCustomSearch1();
  buildCustomSearch2();
}

/** @return {void} */
function initializeMdwComponents() {
  for (const element of document.querySelectorAll('.js .mdw-textfield')) { TextField.attach(element); }
}

initializeMdwComponents();
setupSearches();
