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

/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @yields composed HTMLStyleElement
 * @return {Generator<HTMLStyleElement>} composed CSSStyleSheet
 */
export function* generateHTMLStyleElements(styles) {
  for (const style of styles) {
    if (style instanceof HTMLStyleElement) {
      yield style;
    } else {
      const el = document.createElement('style');
      el.textContent = [...style.cssRules].map((r) => r.cssText).join('\n');
      yield el;
    }
  }
}