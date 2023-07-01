import { executeServerCommand, resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';

/**
 * @param {Element} element
 * @return {{width:number, height:number}}
 */
export function getElementContentSize(element) {
  const {
    height, width,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    boxSizing,
  } = window.getComputedStyle(element);
  if (boxSizing === 'content-box') return { height: Number.parseFloat(height), width: Number.parseFloat(width) };
  return {
    height: Number.parseFloat(height) - Number.parseFloat(paddingTop) - Number.parseFloat(paddingBottom),
    width: Number.parseFloat(width) - Number.parseFloat(paddingLeft) - Number.parseFloat(paddingRight),
  };
}

/**
 * @template {HTMLElement} T1
 * @template {new (...args:any[]) => T1} T2
 * @param {T2} Constructor
 * @param {boolean} appendToDOM
 * @return {T1}
 */
export function makeFromConstructor(Constructor, appendToDOM = true) {
  const element = new Constructor();
  if (appendToDOM) {
    document.body.append(element);
  }
  // @ts-ignore Skip cast
  return element;
}

/**
 * @param {string} tagName
 * @param {boolean} appendToDOM
 * @return {HTMLElement}
 */
export function makeFromTagName(tagName, appendToDOM = true) {
  const element = document.createElement(tagName);
  if (appendToDOM) {
    document.body.append(element);
  }
  // @ts-ignore Skip cast
  return element;
}

/**
 * @param {string} fromString
 * @param {boolean} appendToDOM
 * @return {HTMLElement}
 */
export function makeFromString(fromString, appendToDOM = true) {
  const fragment = document.createRange().createContextualFragment(fromString);
  const { firstElementChild } = fragment;
  if (appendToDOM) {
    document.body.append(fragment);
  }
  // @ts-ignore Skip cast
  return firstElementChild;
}

/**
 * @template {HTMLElement} T
 * @param {TemplateStringsArray} strings
 * @param  {...(string|number|boolean)} substitutions
 * @return {T}
 */
export function html(strings, ...substitutions) {
  const content = String.raw({ raw: strings }, ...substitutions);
  return /** @type {T} */ (makeFromString(content));
}

/**
 * @param {import('./axTreePlugin.js').AxTreePayload} [options]
 * @return {Promise<ReturnType<import('playwright').Accessibility['snapshot']>>}
 */
export function axTree(options) {
  return executeServerCommand('ax-tree', options);
}

/**
 * @template {Awaited<ReturnType<import('playwright').Accessibility['snapshot']>>} T
 * @param {T} rootAXNode
 * @yields {T}
 * @return {Generator<T>}
 */
export function* iterateMeaningfulAXNodes(rootAXNode) {
  switch (rootAXNode.role) {
    case 'toggle button':
      // Firefox uses "toggle button" role instead
      rootAXNode.role = 'button';
      // Fallthrough
    case 'alert':
    case 'alertdialog':
    case 'application':
    case 'article':
    case 'banner':
    case 'blockquote':
    case 'button':
    case 'cell':
    case 'checkbox':
    case 'columnheader':
    case 'combobox':
    case 'command':
    case 'complementary':
    case 'composite':
    case 'contentinfo':
    case 'definition':
    case 'dialog':
    case 'directory':
    case 'document':
    case 'feed':
    case 'figure':
    case 'form':
    case 'grid':
    case 'gridcell':
    case 'group':
    case 'heading':
    case 'img':
    case 'input':
    case 'landmark':
    case 'link':
    case 'list':
    case 'listbox':
    case 'listitem':
    case 'log':
    case 'main':
    case 'marquee':
    case 'math':
    case 'meter':
    case 'menu':
    case 'menubar':
    case 'menuitem':
    case 'menuitemcheckbox':
    case 'menuitemradio':
    case 'navigation':
    case 'note':
    case 'option':
    case 'progressbar':
    case 'radio':
    case 'radiogroup':
    case 'range':
    case 'region':
    case 'row':
    case 'rowgroup':
    case 'rowheader':
    case 'scrollbar':
    case 'search':
    case 'searchbox':
    case 'sectionhead':
    case 'select':
    case 'separator':
    case 'slider':
    case 'spinbutton':
    case 'status':
    case 'switch':
    case 'tab':
    case 'table':
    case 'tablist':
    case 'tabpanel':
    case 'term':
    case 'textbox':
    case 'time':
    case 'timer':
    case 'toolbar':
    case 'tooltip':
    case 'tree':
    case 'treegrid':
    case 'treeitem':
    case 'window':
      yield rootAXNode;
      break;
    default:
  }
  if (!rootAXNode.children) return;
  for (const child of rootAXNode.children) {
    for (const axNode of iterateMeaningfulAXNodes(child)) {
      yield axNode;
    }
  }
}

/**
 * @param {HTMLElement} element
 */
function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

/**
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export async function leftClickElement(element) {
  const { x, y } = getMiddleOfElement(element);

  await sendMouse({ type: 'click', position: [x, y], button: 'left' });
  await resetMouse();
}

/**
 * @param {string} press
 * @return {Promise<void>}
 */
export async function sendKeypress(press) {
  await sendKeys({ press });
}

/**
 * @param {string} down
 * @return {Promise<void>}
 */
export async function sendKeydown(down) {
  await sendKeys({ down });
}

/**
 * @param {string} up
 * @return {Promise<void>}
 */
export async function sendKeyup(up) {
  await sendKeys({ up });
}

/**
 * @param {string} type
 * @return {Promise<void>}
 */
export async function typeKeys(type) {
  await sendKeys({ type });
}
