import * as ListItem from '../../components/list/item';
import * as TextField from '../../components/textfield/index';
import SearchAdapter from '../../adapters/search/index';
import { iterateArrayLike, setTextNode } from '../../core/dom';
import { ListAdapter } from '../../index';

/** @typedef {{line1:string, line2:string}} CustomSearchResult */


/**
 * @param {string} [filter]
 * @return {CustomSearchResult[]}
 */
function performFakeSearch(filter) {
  const results = [];
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in window.navigator) {
    const value = navigator[key] && navigator[key].toString();
    if (!filter || key.indexOf(filter) !== -1 || (value && value.indexOf(filter) !== -1)) {
      results.push({ line1: key, line2: navigator[key] });
    }
  }
  return results;
}

/**
 * @param {HTMLLIElement} listItemElement
 * @param {CustomSearchResult} result
 * @return {void}
 */
function searchResultRenderer(listItemElement, result) {
  if (!listItemElement.children.length) {
    listItemElement.setAttribute('role', 'option'); // Important!
    const markup = `
    <div class="mdw-list__content">
      <div class="mdw-list__text">
        <div class="mdw-list__text-line"></div>
        <div class="mdw-list__text-line"></div>
      </div>
    </div>`;
    // eslint-disable-next-line no-param-reassign
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
  /** @type {HTMLElement} */
  const busyIndicator = (textfield.getElementsByClassName('custom-busy-indicator')[0]);

  // For purpose of this demo results are cached.
  // Actual filter is performed by SearchAdapter

  /** @type {ListAdapter<CustomSearchResult>} */
  const customListAdapter = new ListAdapter(list, [], searchResultRenderer);

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
    performSearch(input, resolve) {
      // Use precached results
      if (myCachedResults != null) {
        resolve(myCachedResults);
        return;
      }

      // Display a busy indicator
      busyIndicator.style.setProperty('display', '');

      // Add results to a cached search adapter
      myCachedResults = performFakeSearch();

      // Let busy indicator spin to illustrate loading
      setTimeout(() => {
        // Send back the search results
        resolve(myCachedResults);
      }, 2000);
    },
    updateList(searchResults, resolve) {
      // SearchAdapter signaling the UI is ready to update with search results

      if (customListAdapter.datasource === searchResults) {
        // Search results have already been mapped. Nothing to do.
        // SearchAdapter handles item filtering.
        resolve();
        return;
      }

      // Directly assign search results as ListAdapter's data source
      customListAdapter.datasource = searchResults;

      // Remove busy indicator
      busyIndicator.style.setProperty('display', 'none');

      // Tell ListAdapter to perform a full refresh
      customListAdapter.refresh();
      resolve();
    },
  });

  searchDocsCustom.list.addEventListener(ListItem.ACTIVATE_EVENT, (event) => {
    const el = /** @type {HTMLLIElement} */ (event.target);
    const selectedItem = customListAdapter.elementMap.get(el);
    const text = `${selectedItem.line1}:${selectedItem.line2}`;
    document.getElementById('search-result-custom1').textContent = text;
  });
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

/** @return {void} */
function buildCustomSearch2() {
  const textfield = document.getElementById('search-textfield-custom2');
  const list = document.getElementById('search-list-custom2');
  /** @type {HTMLElement} */
  const busyIndicator = (textfield.getElementsByClassName('custom-busy-indicator')[0]);
  /** @type {HTMLElement} */
  const noResultsIndicator = (textfield.getElementsByClassName('custom-no-results-indicator')[0]);

  /** @type {ListAdapter<CustomSearchResult>} */
  const customListAdapter = new ListAdapter(list, [], searchResultRenderer);

  // For purpose of this query is "searched" every time with no cache.
  // SearchAdapter performs no filter

  const searchDocsCustom = new SearchAdapter({
    textfield,
    list,
    debounce: 300,
    dropdown: true,
    filterItems: false,
    performSearch(searchTerm, resolve) {
      // Clear ListAdapter
      customListAdapter.clear();

      showElement(busyIndicator);
      hideElement(noResultsIndicator);

      const myData = performFakeSearch(searchTerm);
      setTimeout(() => {
        // Spin for 1000ms
        resolve(myData);
      }, 1000);
    },
    updateList(items, resolve) {
      hideElement(busyIndicator);

      if (!items.length) {
        showElement(noResultsIndicator);
        resolve();
        return;
      }

      // Assign results to ListAdapter
      customListAdapter.datasource = items;
      customListAdapter.refresh();

      resolve();
    },
  });
  searchDocsCustom.list.addEventListener(ListItem.ACTIVATE_EVENT, (event) => {
    const selectedItem = customListAdapter.elementMap.get(event.target);
    const text = `${selectedItem.line1}:${selectedItem.line2}`;
    document.getElementById('search-result-custom2').textContent = text;
  });
}

/** @return {void} */
function setupSearches() {
  const searchDocsSimple = new SearchAdapter({
    textfield: document.getElementById('search-textfield-simple'),
    list: document.getElementById('search-list-simple'),
  });
  const searchDocsMultiline = new SearchAdapter({
    textfield: document.getElementById('search-textfield-multiline'),
    list: document.getElementById('search-list-multiline'),
    suggestionMethod: 'none',
  });

  buildCustomSearch1();
  buildCustomSearch2();
}

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-textfield'), TextField.attach);
}

initializeMdwComponents();
setupSearches();
