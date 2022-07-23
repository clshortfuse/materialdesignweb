// https://w3c.github.io/aria-practices/#Listbox

import * as Attributes from './attributes.js';
import * as Keyboard from './keyboard.js';
import * as RovingTabIndex from './rovingtabindex.js';

/**
 * Options should be focusable when disabled
 * @see https://w3c.github.io/aria-practices/#kbd_disabled_controls
 */
const QUERY_SELECTOR = '[role=option]';

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  event.stopPropagation();
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const currentItem = /** @type {HTMLElement} */ (event.target);
  RovingTabIndex.removeTabIndex(element.querySelectorAll(QUERY_SELECTOR), [currentItem]);
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
  if (element.getAttribute('aria-orientation') === 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  RovingTabIndex.selectPrevious(element.querySelectorAll(QUERY_SELECTOR));
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
  if (element.getAttribute('aria-orientation') !== 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  RovingTabIndex.selectPrevious(element.querySelectorAll(QUERY_SELECTOR));
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
  if (element.getAttribute('aria-orientation') === 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  RovingTabIndex.selectNext(element.querySelectorAll(QUERY_SELECTOR));
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
  if (element.getAttribute('aria-orientation') !== 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  RovingTabIndex.selectNext(element.querySelectorAll(QUERY_SELECTOR));
}

/**
 * @param {CustomEvent<{value:boolean}} event
 * @return {void}
 */
function onAriaSelectedEvent(event) {
  if (!event.detail.value) return;
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-multiselectable') === 'true') return;
  // Uncheck all others
  for (const el of element.querySelectorAll(QUERY_SELECTOR)) {
    if (el === event.target) continue;
    el.setAttribute('aria-selected', 'false');
  }
}

/**
 * @param {CustomEvent<{value:boolean}} event
 * @return {void}
 */
function onAriaCheckedEvent(event) {
  if (!event.detail.value) return;
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-multiselectable') === 'true') return;
  // Uncheck all others
  for (const el of element.querySelectorAll(QUERY_SELECTOR)) {
    if (el === event.target) continue;
    el.setAttribute('aria-checked', 'false');
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  if (element.hasAttribute('role') && element.getAttribute('role') !== 'listbox') return;
  element.setAttribute('role', 'listbox');
  RovingTabIndex.setupTabIndexes(element.querySelectorAll('[role="option"]'), true);
  Keyboard.attach(element);
  element.addEventListener(Keyboard.DOWN_ARROW_KEY, onDownArrowKey);
  element.addEventListener(Keyboard.UP_ARROW_KEY, onUpArrowKey);
  element.addEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
  element.addEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  element.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  element.addEventListener(Attributes.ARIA_SELECTED_EVENT, onAriaSelectedEvent);
  element.addEventListener(Attributes.ARIA_CHECKED_EVENT, onAriaCheckedEvent);
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
  element.removeEventListener(Attributes.ARIA_SELECTED_EVENT, onAriaSelectedEvent);
}
