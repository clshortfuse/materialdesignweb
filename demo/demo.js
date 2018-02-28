import * as mdw from '../components/index';

const crosshairs = {
};
let vOffset = 0;
let hOffset = 0;

Object.defineProperty(crosshairs, 'vOffset', {
  enumerable: true,
  configurable: false,
  get() {
    return vOffset;
  },
  set(val) {
    vOffset = val;
    document.getElementById('verticalLineLeft').style.left = `${val}px`;
    document.getElementById('verticalLineRight').style.left = `${parseInt(val, 0) - 376}px`;
  },
});


Object.defineProperty(crosshairs, 'hOffset', {
  enumerable: true,
  configurable: false,
  get() {
    return hOffset;
  },
  set(val) {
    hOffset = val;
    document.getElementById('horizontalLine').style.top = `${val}px`;
  },
});

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onTemplateImageClick(event) {
  crosshairs.hOffset = event.clientY;
  crosshairs.vOffset = event.clientX;
}

/** @return {void} */
function setupOptions() {
  document
    .querySelector('input[name="largeFontSize"]')
    .addEventListener('change', (event) => {
      const el = document.querySelector('html');
      if (event.target.checked) {
        el.style.setProperty('font-size', '24px');
      } else {
        el.style.setProperty('font-size', '');
      }
    });
  document
    .querySelector('input[name="rtl"]')
    .addEventListener('change', (event) => {
      const el = document.querySelector('html');
      if (event.target.checked) {
        el.setAttribute('dir', 'rtl');
      } else {
        el.setAttribute('dir', 'ltr');
      }
    });
}

/**
 * @param {HTMLElement} element
 * @param {string} classname
 * @return {boolean}
 */
function hasSomeParentHasClass(element, classname) {
  if (element.className && element.className.split(' ').indexOf(classname) >= 0) {
    return true;
  }
  return element.parentNode && hasSomeParentHasClass(element.parentNode, classname);
}

/**
 * @param {NodeList} nodelist
 * @param {Function} callback
 * @param {Object=} scope
 * @return {void}
 */
function forEachNode(nodelist, callback, scope) {
  for (let i = 0; i < nodelist.length; i += 1) {
    callback.call(scope, nodelist[i], i, nodelist);
  }
}

const myElementMap = new WeakMap();
/** @return {void} */
function start() {
  setupOptions();
  forEachNode(document.querySelectorAll('.mdw-textfield'), (element) => {
    myElementMap.set(element, new mdw.TextField(element));
  });
  forEachNode(document.querySelectorAll('.mdw-list'), (element) => {
    myElementMap.set(element, new mdw.List(element));
  });
  forEachNode(document.querySelectorAll('.mdw-list__row'), (element) => {
    myElementMap.set(element, new mdw.ListRow(element));
  });
  forEachNode(document.querySelectorAll('.mdw-button'), (element) => {
    if (!hasSomeParentHasClass(element, 'no-js')) {
      myElementMap.set(element, new mdw.Button(element));
    }
  });
  forEachNode(document.querySelectorAll('.mdw-progress-circle'), (element) => {
    myElementMap.set(element, new mdw.ProgressCircle(element));
  });
  forEachNode(document.querySelectorAll('.mdw-tab'), (element) => {
    myElementMap.set(element, new mdw.Tab(element));
  });
  forEachNode(document.querySelectorAll('.mdw-tab__action'), (element) => {
    myElementMap.set(element, new mdw.TabItem(element));
  });
  forEachNode(document.querySelectorAll('.target'), (element) => {
    element.addEventListener('click', onTemplateImageClick);
  });
  const sampleProgressCircle = myElementMap.get(document.querySelector('#progress-comparisons .mdw-progress-circle[mdw-determinate]'));
  setInterval(() => {
    sampleProgressCircle.setValue(Math.random() * 100);
  }, 2500);

  const searchDemoSimple = new mdw.Search({
    textfield: myElementMap.get(document.getElementById('search-textfield-simple')),
    list: myElementMap.get(document.getElementById('search-list-simple')),
  });
  const searchDemoMultiline = new mdw.Search({
    textfield: myElementMap.get(document.getElementById('search-textfield-multiline')),
    list: myElementMap.get(document.getElementById('search-list-multiline')),
    suggestionMethod: 'none',
  });
  buildCustomSearch1();
  buildCustomSearch2();
}

/** @return {void} */
function buildCustomSearch1() {
  const searchDemoCustom = new mdw.Search({
    textfield: myElementMap.get(document.getElementById('search-textfield-custom1')),
    list: myElementMap.get(document.getElementById('search-list-custom1')),
    dropdown: true,
    textFilter: 'startsWith',
    suggestionMethod: 'append',
    filterRows: false,
  });
  const busyIndicator = searchDemoCustom.textfield.element.querySelector('.custom-busy-indicator');
  let searchPerformed = false;
  let searchBusy = false;
  const onEvent = (event) => {
    /** @return {Promise} */
    function showBusyIndicator() {
      return new Promise((resolve) => {
        busyIndicator.style.setProperty('display', '');
        resolve();
      });
    }
    /** @return {Promise} */
    function hideBusyIndicator() {
      return new Promise((resolve) => {
        busyIndicator.style.setProperty('display', 'none');
        resolve();
      });
    }
    /**
     * @return {Promise}
     */
    function clearList() {
      return new Promise((resolve) => {
        searchDemoCustom.list.clear(myElementMap);
        resolve();
      });
    }
    /** @return {Promise} */
    function performSearch() {
      return new Promise((resolve, reject) => {
        const myData = [];
        for(let key in window.navigator) {
          myData.push({ line1: key, line2: navigator[key] });
        }
        setTimeout(() => {
          resolve(myData);
        }, 2000);
      });
    }
    /**
     * @param {{line1:string, line2:string}[]} items
     * @return {Promise}
     */
    function repopulateList(items) {
      return new Promise((resolve) => {
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
          myElementMap.set(listRow, new mdw.ListRow(listRow));
          searchDemoCustom.list.element.appendChild(listRow);
        });
        resolve();
      });
    }
    if (searchPerformed) {
      // Do no extra processing
      return;
    }
    event.stopPropagation();
    if (searchBusy) {
      return;
    }
    searchBusy = true;
    clearList()
      .then(showBusyIndicator)
      .then(() => {
        searchDemoCustom.showDropDown();
      })
      .then(performSearch)
      .then(repopulateList)
      .then(hideBusyIndicator)
      .then(() => {
        searchPerformed = true;
        searchBusy = false;
      })
      .then(() => {
        searchDemoCustom.filterListRows();
        searchDemoCustom.filterRows = true;
      });
  };

  searchDemoCustom.textfield.input.addEventListener('input', onEvent, true);
}

/** @return {void} */
function buildCustomSearch2() {
  const searchDemoCustom = new mdw.Search({
    textfield: myElementMap.get(document.getElementById('search-textfield-custom2')),
    list: myElementMap.get(document.getElementById('search-list-custom2')),
    dropdown: true,
    filterRows: false,
  });
  let currentSearchTerm;
  const busyIndicator = searchDemoCustom.textfield.element.querySelector('.custom-busy-indicator');
  const noResultsIndicator = searchDemoCustom.textfield.element.querySelector('.custom-no-results-indicator');
  const onEvent = () => {
    /**
     * @param {string} searchTerm
     * @param {number} milliseconds
     * @return {Promise}
     */
    function debounce(searchTerm, milliseconds) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (searchTerm !== currentSearchTerm) {
            reject(new Error('debounce'));
            return;
          }
          resolve();
        }, milliseconds);
      });
    }
    /**
     * @return {Promise}
     */
    function clearList() {
      return new Promise((resolve) => {
        searchDemoCustom.list.clear(myElementMap);
        resolve();
      });
    }
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
    /**
     * @param {string} searchTerm
     * @return {Promise}
     */
    function performSearch(searchTerm) {
      return new Promise((resolve, reject) => {
        const myData = [];
        for(let key in window.navigator) {
          const value = navigator[key] && navigator[key].toString();
          if (key.indexOf(searchTerm) !== -1 || (value && value.indexOf(searchTerm) !== -1)) {
            myData.push({ line1: key, line2: navigator[key] });
          }
        }
        setTimeout(() => {
          if (searchTerm === currentSearchTerm) {
            resolve(myData);
          } else {
            reject(new Error('expired'));
          }
        }, 1000);
      });
    }
    /**
     * @param {{line1:string, line2:string}[]} items
     * @return {Promise}
     */
    function repopulateList(items) {
      return new Promise((resolve) => {
        if (!items.length) {
          showElement(noResultsIndicator).then(resolve);
          return;
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
          myElementMap.set(listRow, new mdw.ListRow(listRow));
          searchDemoCustom.list.element.appendChild(listRow);
        });
        resolve();
      });
    }
    const searchTerm = searchDemoCustom.textfield.input.value;
    if (searchTerm === searchDemoCustom.suggestedInput) {
      return;
    }
    if (!searchTerm) {
      currentSearchTerm = null;
      searchDemoCustom.hideDropDown();
      return;
    }
    currentSearchTerm = searchTerm;
    debounce(searchTerm, 300)
      .then(clearList)
      .then(() => showElement(busyIndicator))
      .then(() => hideElement(noResultsIndicator))
      .then(() => performSearch(searchTerm))
      .then(repopulateList)
      .then(() => hideElement(busyIndicator))
      .catch((error) => {
        if (error.message === 'debounce') {
          console.log('Input debounce', searchTerm);
          return;
        }
        if (error.message === 'expired') {
          console.log('Search expired', searchTerm);
          return;
        }
        console.error(error);
      });
  };
  searchDemoCustom.textfield.input.addEventListener('input', onEvent, true);
}


start();
