/**
 * @param {HTMLElement} element
 * @param {string=} linePrefix
 * @return {string}
 */
function convertElementToCode(element, linePrefix = '') {
  const htmlType = element.tagName.toLowerCase();
  const attributes = [];
  for (let i = 0; i < element.attributes.length; i += 1) {
    const attribute = element.attributes.item(i);
    if (attribute.value.length) {
      attributes.push(`${attribute.name}="${attribute.value}"`);
    } else {
      attributes.push(attribute.name);
    }
  }
  attributes.sort();
  const syntaxItems = [htmlType, attributes.join(' ')];
  const openingHTMLLine = `<${syntaxItems.filter(item => item).join(' ').trim()}>`;
  const closingHTMLLine = `</${htmlType}>`;
  const lines = [openingHTMLLine];
  const innerLines = [];
  let onlyText = true;
  for (let i = 0; i < element.childNodes.length; i += 1) {
    const child = element.childNodes.item(i);
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
  }
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
 * @param {Element|NodeListOf<Element>} elements
 * @param {string} event
 * @param {Function} listener
 * @return {void}
 */
function attachEventListener(elements, event, listener) {
  let elementList;
  if (elements instanceof Element) {
    elementList = [elementList];
  } else {
    elementList = elements;
  }
  for (let i = 0; i < elementList.length; i += 1) {
    const el = elementList[i];
    el.addEventListener(event, listener);
  }
}

/**
 * @param {Element} node
 * @return {Node}
 */
function getChildTextNode(node) {
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const childNode = node.childNodes[i];
    if (childNode.nodeType === Node.TEXT_NODE) {
      return childNode;
    }
  }
  const textNode = document.createTextNode('');
  node.appendChild(textNode);
  return textNode;
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
  attachEventListener,
  getChildTextNode,
  changeElementTagName,
};
