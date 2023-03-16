/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @yields composed CSSStyleSheet
 * @return {Generator<CSSStyleSheet>} composed CSSStyleSheet
 */
export function* generateCSSStyleSheets(styles) {
  for (const style of styles) {
    if (style instanceof HTMLStyleElement) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(style.textContent);
      yield sheet;
    } else if (style.ownerNode) {
      console.warn('Stylesheet is part of style');
      const sheet = new CSSStyleSheet();
      sheet.replaceSync([...style.cssRules].map((r) => r.cssText).join(''));
      yield sheet;
    } else {
      yield style;
    }
  }
}

/** @type {WeakMap<CSSStyleSheet, HTMLStyleElement>} */
const styleElementWrappers = new WeakMap();

/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @yields composed HTMLStyleElement
 * @return {Generator<HTMLStyleElement>} composed CSSStyleSheet
 */
export function* generateHTMLStyleElements(styles) {
  for (const style of styles) {
    if (style instanceof HTMLStyleElement) {
      yield style;
    } else if (style.ownerNode instanceof HTMLStyleElement) {
      // console.log('Cloning parent HTMLStyleElement instead');
      // @ts-ignore Skip cast
      yield style.ownerNode.cloneNode(true);
    } else {
      let styleElement = styleElementWrappers.get(style);
      if (!styleElement) {
        console.warn('Manually constructing HTMLStyleElement', [...style.cssRules].map((r) => r.cssText).join('\n'));
        styleElement = document.createElement('style');
        styleElement.textContent = [...style.cssRules].map((r) => r.cssText).join('');
        styleElementWrappers.set(style, styleElement);
      }
      // @ts-ignore Skip cast
      yield styleElement.cloneNode(true);
    }
  }
}
