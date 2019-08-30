import { iterateArrayLike } from '../core/dom';


/**
 * @param {Element|HTMLElement} element
 * @param {boolean} [pug=false]
 * @param {string} [linePrefix='']
 * @return {string}
 */
function convertElementToCode(element, pug = false, linePrefix = '') {
  const htmlType = element.tagName.toLowerCase();
  /** @type {string[]} */
  const attributes = [];
  /** @type {string[]} */
  const classes = [];
  iterateArrayLike(element.classList, (c) => {
    classes.push(c);
  });
  iterateArrayLike(element.attributes, (attr) => {
    if (attr.name === 'class') {
      return;
    }
    if (attr.value.length) {
      attributes.push(`${attr.name}="${attr.value}"`);
    } else {
      attributes.push(attr.name);
    }
  });
  attributes.sort();
  const syntaxItems = [
    htmlType,
    classes.length ? `class="${classes.join(' ')}"` : '',
    attributes.join(' '),
  ];
  const openingHTMLLine = pug
    ? `${htmlType === 'div' && classes.length ? '' : htmlType}${classes.length ? `.${classes.join('.')}` : ''}${attributes.length ? `(${attributes.join(' ')})` : ''}`
    : `<${syntaxItems.filter((item) => item).join(' ').trim()}>`;
  const closingHTMLLine = pug ? '' : `</${htmlType}>`;
  const lines = [openingHTMLLine];
  /** @type {string[]} */
  const innerLines = [];
  let onlyText = true;
  iterateArrayLike(element.childNodes, (child) => {
    let lineText;
    if (child instanceof HTMLElement) {
      lineText = convertElementToCode(child, pug, `  ${linePrefix}`);
      if (lineText.trim()) {
        onlyText = false;
      }
    } else if (child.nodeValue) {
      if (pug) {
        lineText = `  ${child.nodeValue}`;
      }
    }
    if (lineText && lineText.trim()) {
      innerLines.push(lineText);
    }
  });
  if (onlyText) {
    if (pug) {
      return `${linePrefix + lines.join('')} ${innerLines.join('').trim()}`;
    }
    return linePrefix + lines.join('') + innerLines.join('').trim() + closingHTMLLine;
  }
  innerLines.forEach((line) => lines.push(line));
  lines.push(linePrefix + closingHTMLLine);
  return linePrefix + lines.filter((line) => line.trim()).join('\n');
}

/**
 * @param {Element} element
 * @param {string} tagname
 * @return {Element}
 */
function changeElementTagName(element, tagname) {
  const newElement = document.createElement(tagname);
  for (let i = element.attributes.length - 1; i >= 0; i -= 1) {
    const attr = element.attributes.item(i);
    /** @type {Attr} */
    const clonedAttr = (attr.cloneNode());
    newElement.attributes.setNamedItem(clonedAttr);
  }
  while (element.firstChild) {
    newElement.appendChild(element.firstChild);
  }

  element.parentElement.replaceChild(newElement, element);
  return newElement;
}

export {
  convertElementToCode,
  changeElementTagName,
};
