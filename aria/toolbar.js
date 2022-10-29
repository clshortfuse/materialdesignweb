// https://w3c.github.io/aria-practices/#Listbox

import * as Keyboard from './keyboard.js';
import * as RovingTabIndex from './rovingtabindex.js';

const TOOLBAR_ITEM_SELECTOR = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]',
].join(', ');

/**
 * Toolbar items should be focusable when disabled
 * @see https://w3c.github.io/aria-practices/#kbd_disabled_controls
 */

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  event.stopPropagation();
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const currentItem = /** @type {HTMLElement} */ (event.target);
  RovingTabIndex.removeTabIndex(element.children, [currentItem]);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onUpArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-orientation') !== 'vertical') return;
  event.preventDefault();
  event.stopPropagation();
  const items = element.querySelectorAll(TOOLBAR_ITEM_SELECTOR);
  RovingTabIndex.selectPrevious(items);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onBackArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-orientation') === 'vertical') return;
  event.preventDefault();
  event.stopPropagation();
  const items = element.querySelectorAll(TOOLBAR_ITEM_SELECTOR);
  RovingTabIndex.selectPrevious(items);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onDownArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-orientation') !== 'vertical') return;
  event.preventDefault();
  event.stopPropagation();
  const items = element.querySelectorAll(TOOLBAR_ITEM_SELECTOR);
  RovingTabIndex.selectNext(items);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onForwardArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-orientation') === 'vertical') return;
  event.preventDefault();
  event.stopPropagation();
  const items = element.querySelectorAll(TOOLBAR_ITEM_SELECTOR);
  RovingTabIndex.selectNext(items);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  const items = element.querySelectorAll(TOOLBAR_ITEM_SELECTOR);
  RovingTabIndex.setupTabIndexes(items, true);
  Keyboard.attach(element);
  element.addEventListener(Keyboard.DOWN_ARROW_KEY, onDownArrowKey);
  element.addEventListener(Keyboard.UP_ARROW_KEY, onUpArrowKey);
  element.addEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
  element.addEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  element.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener(Keyboard.DOWN_ARROW_KEY, onDownArrowKey);
  element.removeEventListener(Keyboard.UP_ARROW_KEY, onUpArrowKey);
  element.removeEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
  element.removeEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  element.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}
