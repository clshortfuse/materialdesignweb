import { iterateArrayLike } from '../../components/common/dom';

/**
 * @param {Element|HTMLElement} element
 * @param {string=} linePrefix
 * @return {string}
 */
function convertElementToCode(element, linePrefix = '') {
  const htmlType = element.tagName.toLowerCase();
  const attributes = [];
  iterateArrayLike(element.attributes, (attr) => {
    if (attr.value.length) {
      attributes.push(`${attr.name}="${attr.value}"`);
    } else {
      attributes.push(attr.name);
    }
  });
  attributes.sort();
  const syntaxItems = [htmlType, attributes.join(' ')];
  const openingHTMLLine = `<${syntaxItems.filter(item => item).join(' ').trim()}>`;
  const closingHTMLLine = `</${htmlType}>`;
  const lines = [openingHTMLLine];
  const innerLines = [];
  let onlyText = true;
  iterateArrayLike(element.childNodes, (child) => {
    let lineText;
    if (child instanceof HTMLElement) {
      lineText = convertElementToCode(child, `  ${linePrefix}`);
      if (lineText.trim()) {
        onlyText = false;
      }
    } else if (child.nodeValue) {
      lineText = `  ${child.nodeValue}`;
    }
    if (lineText && lineText.trim()) {
      innerLines.push(lineText);
    }
  });
  if (onlyText) {
    return linePrefix + lines.join('') + innerLines.join('').trim() + closingHTMLLine;
  }
  innerLines
    .filter(line => line.trim())
    .forEach(line => lines.push(line));
  lines.push(linePrefix + closingHTMLLine);
  return linePrefix + lines.join('\n');
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
    newElement.attributes.setNamedItem(attr.cloneNode());
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
