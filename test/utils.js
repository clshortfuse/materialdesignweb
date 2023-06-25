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
  const { firstElementChild } = document.createRange().createContextualFragment(fromString);
  if (appendToDOM) {
    document.body.append(firstElementChild);
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
