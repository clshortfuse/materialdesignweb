/** @type {Map<string, CSSStyleSheet>} */
const cssStyleSheetsCache = new Map();

/**
 * @param {string} content
 * @param {boolean} [useCache=true]
 * @return {CSSStyleSheet}
 */
export function createCSSStyleSheet(content, useCache = true) {
  if (useCache && cssStyleSheetsCache.has(content)) {
    return cssStyleSheetsCache.get(content);
  }
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(content);
  if (useCache) {
    cssStyleSheetsCache.set(content, sheet);
  }
  return sheet;
}

/** @type {Map<string, HTMLStyleElement>} */
const styleElementCache = new Map();

/** @type {Document} */
let _inactiveDocument;

/**
 * @param {string} content
 * @param {boolean} [useCache=true]
 * @return {HTMLStyleElement}
 */
export function createHTMLStyleElement(content, useCache = true) {
  let style;
  if (useCache && styleElementCache.has(content)) {
    style = styleElementCache.get(content);
  } else {
    _inactiveDocument ??= document.implementation.createHTMLDocument();
    style = _inactiveDocument.createElement('style');
    style.textContent = content;
    if (useCache) {
      styleElementCache.set(content, style);
    }
  }
  return /** @type {HTMLStyleElement} */ (style.cloneNode(true));
}

/** @type {boolean} */
let _cssStyleSheetConstructable;

/**
 * @param {string} content
 * @param {boolean} [useCache=true]
 */
export function createCSS(content, useCache = true) {
  if (_cssStyleSheetConstructable == null) {
    try {
      const sheet = createCSSStyleSheet(content, useCache);
      _cssStyleSheetConstructable = true;
      return sheet;
    } catch {
      _cssStyleSheetConstructable = false;
    }
  }
  return _cssStyleSheetConstructable
    ? createCSSStyleSheet(content, useCache)
    : createHTMLStyleElement(content, useCache);
}

/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @param {boolean} [useCache=true]
 * @yields composed CSSStyleSheet
 * @return {Generator<CSSStyleSheet>} composed CSSStyleSheet
 */
export function* generateCSSStyleSheets(styles, useCache = true) {
  for (const style of styles) {
    if (style instanceof HTMLStyleElement) {
      yield createCSSStyleSheet(style.textContent, useCache);
    } else if (style.ownerNode) {
      console.warn('Stylesheet is part of style');
      yield createCSSStyleSheet([...style.cssRules].map((r) => r.cssText).join(''), useCache);
    } else {
      yield style;
    }
  }
}

/** @type {WeakMap<CSSStyleSheet, HTMLStyleElement>} */
const styleElementFromStyleSheetCache = new WeakMap();

/**
 * @param {Iterable<HTMLStyleElement|CSSStyleSheet>} styles
 * @param {boolean} [useCache=true]
 * @yields composed HTMLStyleElement
 * @return {Generator<HTMLStyleElement>} composed CSSStyleSheet
 */
export function* generateHTMLStyleElements(styles, useCache = true) {
  for (const style of styles) {
    if (style instanceof HTMLStyleElement) {
      yield style;
    } else if (style.ownerNode instanceof HTMLStyleElement) {
      // console.log('Cloning parent HTMLStyleElement instead');
      // @ts-ignore Skip cast
      yield style.ownerNode.cloneNode(true);
    } else if (useCache && styleElementFromStyleSheetCache.has(style)) {
      // @ts-ignore Skip cast
      yield styleElementWrappers.get(style).cloneNode(true);
    } else {
      console.warn('Manually constructing HTMLStyleElement', [...style.cssRules].map((r) => r.cssText).join('\n'));
      const styleElement = document.createElement('style');
      styleElement.textContent = [...style.cssRules].map((r) => r.cssText).join('');
      if (useCache) {
        styleElementFromStyleSheetCache.set(style, styleElement);
      }

      // @ts-ignore Skip cast
      yield styleElement.cloneNode(true);
    }
  }
}

/**
 * @param {TemplateStringsArray|string} array
 * @param  {...any} substitutions
 * @return {HTMLStyleElement|CSSStyleSheet}
 */
export function css(array, ...substitutions) {
  if (typeof array === 'string') return createCSS(array);
  return createCSS(String.raw({ raw: array }, ...substitutions));
}

/**
 * @param {TemplateStringsArray|string|HTMLStyleElement|CSSStyleSheet} styles
 * @param  {...any} substitutions
 * @return {HTMLStyleElement|CSSStyleSheet}
 */
export function addGlobalCss(styles, ...substitutions) {
  /** @type {HTMLStyleElement|CSSStyleSheet} */
  let compiled;
  if (typeof styles === 'string') {
    compiled = css(styles);
  } else if (Array.isArray(styles)) {
    compiled = css(/** @type {TemplateStringsArray} */ (styles), ...substitutions);
  } else {
    compiled = /** @type {HTMLStyleElement|CSSStyleSheet} */ (styles);
  }

  if (compiled instanceof HTMLStyleElement) {
    document.head.append(compiled);
  } else {
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      compiled,
    ];
  }
  return compiled;
}
