import { executeServerCommand } from '@web/test-runner-commands';

/**
 * @param {import('./axTreePlugin.js').AxTreePayload} [options]
 * @return {Promise<ReturnType<import('playwright').Accessibility['snapshot']>>}
 */
export function axTree(options) {
  return executeServerCommand('ax-tree', options);
}

/**
 * @template {Awaited<ReturnType<import('playwright').Accessibility['snapshot']>>} T
 * @param {T} rootAXNode
 * @yields {T}
 * @return {Generator<T>}
 */
export function* iterateMeaningfulAXNodes(rootAXNode) {
  switch (rootAXNode.role) {
    case 'toggle button':
      // Firefox uses "toggle button" role instead
      rootAXNode.role = 'button';
      // Fallthrough
    case 'alert':
    case 'alertdialog':
    case 'application':
    case 'article':
    case 'banner':
    case 'blockquote':
    case 'button':
    case 'cell':
    case 'checkbox':
    case 'columnheader':
    case 'combobox':
    case 'command':
    case 'complementary':
    case 'composite':
    case 'contentinfo':
    case 'definition':
    case 'dialog':
    case 'directory':
    case 'document':
    case 'feed':
    case 'figure':
    case 'form':
    case 'grid':
    case 'gridcell':
    // case 'group':
    case 'heading':
    case 'img':
    case 'input':
    case 'landmark':
    case 'link':
    case 'list':
    case 'listbox':
    case 'listitem':
    case 'log':
    case 'main':
    case 'marquee':
    case 'math':
    case 'meter':
    case 'menu':
    case 'menubar':
    case 'menuitem':
    case 'menuitemcheckbox':
    case 'menuitemradio':
    case 'navigation':
    case 'note':
    case 'option':
    case 'progressbar':
    case 'radio':
    case 'radiogroup':
    case 'range':
    case 'region':
    case 'row':
    case 'rowgroup':
    case 'rowheader':
    case 'scrollbar':
    case 'search':
    case 'searchbox':
    case 'sectionhead':
    case 'select':
    case 'separator':
    case 'slider':
    case 'spinbutton':
    case 'status':
    case 'switch':
    case 'tab':
    case 'table':
    case 'tablist':
    case 'tabpanel':
    case 'term':
    case 'textbox':
    case 'time':
    case 'timer':
    case 'toolbar':
    case 'tooltip':
    case 'tree':
    case 'treegrid':
    case 'treeitem':
    case 'window':
      yield rootAXNode;
      break;
    default:
  }
  if (!rootAXNode.children) return;
  for (const child of rootAXNode.children) {
    for (const axNode of iterateMeaningfulAXNodes(child)) {
      yield axNode;
    }
  }
}
