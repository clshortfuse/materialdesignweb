/** eslint-env browser */

export const FRAGMENT_TAG = '$FRAGMENT';

// https://github.com/reactjs/rfcs/pull/107
// https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js

/**
 * @param {string} tagName
 * @param {Record<string, any> & { children: HTMLElement[], style:string|CSSStyleDeclaration }} attrs
 * @return {HTMLElement|DocumentFragment}
 */
function createElementStatic(tagName, attrs) {
  const { children } = attrs;
  if (!children) throw new Error('Static elements much have children');

  if (tagName === FRAGMENT_TAG) {
    const fragment = document.createDocumentFragment();
    fragment.append(...children);
    return fragment;
  }

  const element = document.createElement(tagName);
  for (const [key, value] of Object.entries(attrs)) {
    switch (key) {
      case 'children':
        element.append(...value);
        break;
      case 'class':
        if (typeof value === 'string') {
          element.classList.add(...(value.split(' ')));
        } else {
          element.classList.add(...value);
        }
        break;
      case 'style':
        if (typeof value === 'string') {
          element.setAttribute('style', value);
        } else {
          Object.assign(element.style, value);
        }
        break;
      default:
        if (key in element) {
          // @ts-ignore Default assignment
          element[key] = value;
        } else if (key.startsWith('data-')) {
          element.dataset[key.slice('data-'.length)] = value;
        } else {
          element.setAttribute(key, value ?? '');
        }
    }
  }
  return element;
}

/**
 * @param {string} tagName
 * @param {{ children?: DocumentFragment|string } & Record<string, any>} attrs
 * @return {HTMLElement|DocumentFragment}
 */
function createElementDynamic(tagName, attrs = {}) {
  if (tagName === FRAGMENT_TAG) {
    const fragment = document.createDocumentFragment();
    const { children } = attrs;
    if (children == null) return fragment;
    fragment.append(children);
    return fragment;
  }

  const element = document.createElement(tagName);
  for (const [key, value] of Object.entries(attrs)) {
    switch (key) {
      case 'children':
        element.append(value);
        break;
      case 'class':
        if (typeof value === 'string') {
          element.classList.add(...(value.split(' ')));
        } else {
          element.classList.add(...value);
        }
        break;
      case 'style':
        if (typeof value === 'string') {
          element.setAttribute('style', value);
        } else {
          Object.assign(element.style, value);
        }
        break;
      default:
        if (key in element) {
          // @ts-ignore Default assignment
          element[key] = value;
        } else if (key.startsWith('data-')) {
          element.dataset[key.slice('data-'.length)] = value;
        } else {
          element.setAttribute(key, value ?? '');
        }
    }
  }
  return element;
}

export const jsx = createElementDynamic;
export const jsxs = createElementStatic;
