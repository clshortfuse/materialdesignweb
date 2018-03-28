import { List, ListRow, TextField, Search } from '../../../components/index';

const componentMap = new WeakMap();
/** @return {void} */
function buildCustomSearch1() {
  const textfield = componentMap.get(document.getElementById('search-textfield-custom1'));
  const list = componentMap.get(document.getElementById('search-list-custom1'));
  const busyIndicator = textfield.element.querySelector('.custom-busy-indicator');
  let resultsCache;
  let listUpdated = false;
  const customPerformSearch = () => {
    if (listUpdated) {
      return Promise.resolve();
    }
    if (resultsCache != null) {
      return Promise.resolve(resultsCache);
    }
    return new Promise((resolve) => {
      busyIndicator.style.setProperty('display', '');
      const myData = [];
      for(let key in window.navigator) {
        myData.push({ line1: key, line2: navigator[key] });
      }
      setTimeout(() => {
        resultsCache = myData;
        resolve(myData);
      }, 2000);
    });
  };
  const customUpdateList = (items) => {
    if (listUpdated) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      list.clear(componentMap);
      busyIndicator.style.setProperty('display', 'none');
      const markup = `
      <div class="mdw-list__text">
        <div class="mdw-list__text-line"></div>
        <div class="mdw-list__text-line"></div>
      </div>
      `.trim();
      items.forEach((item) => {
        const listRow = document.createElement('li');
        listRow.classList.add('mdw-list__row');
        listRow.innerHTML = markup;
        const lines = listRow.querySelectorAll('.mdw-list__text-line');
        lines[0].textContent = item.line1;
        lines[1].textContent = item.line2;
        componentMap.set(listRow, new ListRow(listRow));
        list.element.appendChild(listRow);
      });
      listUpdated = true;
      resolve();
    });
  };
  
  const searchDocsCustom = new Search({
    textfield,
    list,
    searchOnFocus: false,
    dropdown: true,
    textFilter: 'startsWith',
    suggestionMethod: 'append',
    performSearch: customPerformSearch,
    updateList: customUpdateList,
  });
}

/** @return {void} */
function buildCustomSearch2() {
  /**
   * @param {HTMLElement} element
   * @return {Promise}
   */
  function hideElement(element) {
    return new Promise((resolve) => {
      element.style.setProperty('display', 'none');
      resolve();
    });
  }
  /**
   * @param {HTMLElement} element
   * @return {Promise}
   */
  function showElement(element) {
    return new Promise((resolve) => {
      element.style.setProperty('display', '');
      resolve();
    });
  }
  const textfield = componentMap.get(document.getElementById('search-textfield-custom2'));
  const list = componentMap.get(document.getElementById('search-list-custom2'));
  const busyIndicator = textfield.element.querySelector('.custom-busy-indicator');
  const noResultsIndicator = textfield.element.querySelector('.custom-no-results-indicator');
  const customPerformSearch = (searchTerm) => {
    /**
     * @return {Promise}
     */
    function clearList() {
      return new Promise((resolve) => {
        list.clear(componentMap);
        resolve();
      });
    }
    /**
     * @param {string} searchTerm
     * @return {Promise}
     */
    function performSearch(searchTerm) {
      return new Promise((resolve) => {
        const myData = [];
        for(let key in window.navigator) {
          const value = navigator[key] && navigator[key].toString();
          if (key.indexOf(searchTerm) !== -1 || (value && value.indexOf(searchTerm) !== -1)) {
            myData.push({ line1: key, line2: navigator[key] });
          }
        }
        setTimeout(() => {
          resolve(myData);
        }, 1000);
      });
    }
    return clearList()
      .then(() => showElement(busyIndicator))
      .then(() => hideElement(noResultsIndicator))
      .then(() => performSearch(searchTerm))
      .catch((error) => {
        console.error(error);
      });
  };
  const customUpdateList = (items) => {
    return hideElement(busyIndicator).then(() => {
      if (!items.length) {
        return showElement(noResultsIndicator);
      }
      const markup = `
      <div class="mdw-list__text">
        <div class="mdw-list__text-line"></div>
        <div class="mdw-list__text-line"></div>
      </div>
      `.trim();
      items.forEach((item) => {
        const listRow = document.createElement('li');
        listRow.classList.add('mdw-list__row');
        listRow.innerHTML = markup;
        const lines = listRow.querySelectorAll('.mdw-list__text-line');
        lines[0].textContent = item.line1;
        lines[1].textContent = item.line2;
        componentMap.set(listRow, new ListRow(listRow));
        list.element.appendChild(listRow);
      });
      return Promise.resolve();
    });
  };
  const searchDocsCustom = new Search({
    textfield,
    list,
    debounce: 300,
    dropdown: true,
    filterRows: false,
    performSearch: customPerformSearch,
    updateList: customUpdateList,
  });
}

/** @return {void} */
function setupSearches() {
  const searchDocsSimple = new Search({
    textfield: componentMap.get(document.getElementById('search-textfield-simple')),
    list: componentMap.get(document.getElementById('search-list-simple')),
  });
  const searchDocsMultiline = new Search({
    textfield: componentMap.get(document.getElementById('search-textfield-multiline')),
    list: componentMap.get(document.getElementById('search-list-multiline')),
    suggestionMethod: 'none',
  });

  buildCustomSearch1();
  buildCustomSearch2();
}

/** @return {void} */
function initializeMdwComponents() {
  let components;

  components = document.querySelectorAll('.js .mdw-textfield');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new TextField(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-list');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new List(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-list__row');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new ListRow(components[i]));
  }
}

initializeMdwComponents();
setupSearches();

