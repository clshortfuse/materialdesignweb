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
  for (const c of element.classList) {
    classes.push(c);
  }
  for (const attr of element.attributes) {
    if (attr.name === 'class') {
      continue;
    }
    if (attr.value.length) {
      attributes.push(`${attr.name}="${attr.value}"`);
    } else {
      attributes.push(attr.name);
    }
  }
  attributes.sort();
  const syntaxItems = [
    htmlType,
    classes.length ? `class="${classes.join(' ')}"` : '',
    attributes.join(' '),
  ];
  const openingHTMLLine = pug
    ? `${htmlType === 'div' && classes.length ? '' : htmlType}${classes.length ? `.${classes.join('.')}` : ''}${attributes.length ? `(${attributes.join(' ')})` : ''}`
    : `<${syntaxItems.filter(Boolean).join(' ').trim()}>`;
  const closingHTMLLine = pug ? '' : `</${htmlType}>`;
  const lines = [openingHTMLLine];
  /** @type {string[]} */
  const innerLines = [];
  let onlyText = true;
  for (const child of element.childNodes) {
    let lineText;
    if (child instanceof HTMLElement) {
      lineText = convertElementToCode(child, pug, `  ${linePrefix}`);
      if (lineText.trim()) {
        onlyText = false;
      }
    } else if (child.nodeValue && pug) {
      lineText = `  ${child.nodeValue}`;
    }
    if (lineText && lineText.trim()) {
      innerLines.push(lineText);
    }
  }
  if (onlyText) {
    if (pug) {
      return `${linePrefix + lines.join('')} ${innerLines.join('').trim()}`;
    }
    return linePrefix + lines.join('') + innerLines.join('').trim() + closingHTMLLine;
  }
  lines.push(...innerLines, linePrefix + closingHTMLLine);
  return linePrefix + lines.filter((line) => line.trim()).join('\n');
}

/**
 * @param {Element} element
 * @param {string} tagname
 * @return {Element}
 */
function changeElementTagName(element, tagname) {
  const newElement = document.createElement(tagname);
  let i = element.attributes.length;
  while (i--) {
    const attr = element.attributes.item(i);
    const clonedAttr = /** @type {Attr} */ (attr.cloneNode());
    newElement.attributes.setNamedItem(clonedAttr);
  }
  while (element.firstChild) {
    newElement.appendChild(element.firstChild);
  }

  element.replaceWith(newElement);
  return newElement;
}

export {
  convertElementToCode,
  changeElementTagName,
};
