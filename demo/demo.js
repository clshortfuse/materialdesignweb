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
  });
  buildCustomSearch();
}

/** @return {void} */
function buildCustomSearch() {
  const searchDemoCustom = new mdw.Search({
    textfield: myElementMap.get(document.getElementById('search-textfield-custom')),
    list: myElementMap.get(document.getElementById('search-list-custom')),
  });
  let searchEvent;
  const progressCircle = searchDemoCustom.textfield.element.querySelector('.mdw-progress-circle');
  let searchPerformed = false;
  let searchBusy = false;
  const onEvent = (event) => {
    /** @return {Promise} */
    function showProgressCircle() {
      return new Promise((resolve, reject) => {
        progressCircle.style.setProperty('display', 'block');
        resolve();
      });
    }
    /** @return {Promise} */
    function hideProgressCircle() {
      return new Promise((resolve, reject) => {
        progressCircle.style.setProperty('display', 'none');
        resolve();
      });
    }
    /** @return {Promise} */
    function performSearch() {
      return new Promise((resolve, reject) => {
        searchEvent = event;
        const myData = [];
        for(let key in window.navigator) {
          myData.push({ line1: key, line2: navigator[key] });
        }
        setTimeout(() => {
          if (searchEvent === event) {
            resolve(myData);
          } else {
            reject(new Error('expired'));
          }
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
      searchDemoCustom.filterListRows();
      return;
    }
    if (searchBusy) {
      return;
    }
    searchBusy = true;
    searchDemoCustom.list.clear(myElementMap);
    showProgressCircle()
      .then(performSearch)
      .then(repopulateList)
      .then(hideProgressCircle)
      .then(() => {
        searchPerformed = true;
        searchBusy = false;
      })
      .then(() => {
        searchDemoCustom.filterListRows();
      })
      .catch((error) => {
        if (error.message === 'expired') {
          return;
        }
        console.error(error);
      });
  };

  searchDemoCustom.handleInputEvent = onEvent;
  searchDemoCustom.handleFocusEvent = onEvent;
}


start();
