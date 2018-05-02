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

export {
  convertElementToCode,
};
