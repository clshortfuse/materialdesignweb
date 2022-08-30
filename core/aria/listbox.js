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
 * @this {HTMLElement}
 * @return {void}
 */
function onTabIndexZeroed(event) {
  event.stopPropagation();
  const currentItem = /** @type {HTMLElement} */ (event.target);
  RovingTabIndex.removeTabIndex(this.querySelectorAll(QUERY_SELECTOR), [currentItem]);
}

/**
 * @param {CustomEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onUpArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  if (this.getAttribute('aria-orientation') === 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  this.ariaActiveDescendantElement = RovingTabIndex.selectPrevious(this.querySelectorAll(QUERY_SELECTOR));
}

/**
 * @param {CustomEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onBackArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  if (this.getAttribute('aria-orientation') !== 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  this.ariaActiveDescendantElement = RovingTabIndex.selectPrevious(this.querySelectorAll(QUERY_SELECTOR));
}

/**
 * @param {CustomEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onDownArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  if (this.getAttribute('aria-orientation') === 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  this.ariaActiveDescendantElement = RovingTabIndex.selectNext(this.querySelectorAll(QUERY_SELECTOR));
}

/**
 * @param {CustomEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onForwardArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  if (this.getAttribute('aria-orientation') !== 'horizontal') return;
  event.preventDefault();
  event.stopPropagation();
  this.ariaActiveDescendantElement = RovingTabIndex.selectNext(this.querySelectorAll(QUERY_SELECTOR));
}

/**
 * @param {CustomEvent<{value:'true'|'false'}>} event
 * @this {HTMLElement}
 * @return {void}
 */
function onAriaSelectedEvent(event) {
  if (!event.detail.value) return;
  if (event.detail.value === 'false' && this.getAttribute('aria-required') === 'true') {
    event.preventDefault();
    return;
  }
  if (!event.detail.value) return;
  if (this.getAttribute('aria-multiselectable') === 'true') return;
  // Uncheck all others
  for (const el of this.querySelectorAll(QUERY_SELECTOR)) {
    if (el === event.target) continue;
    el.setAttribute('aria-selected', 'false');
  }
}

/**
 * @param {CustomEvent<{value:boolean}>} event
 * @this {HTMLElement}
 * @return {void}
 */
function onAriaCheckedEvent(event) {
  if (!event.detail.value) return;
  if (this.getAttribute('aria-multiselectable') === 'true') return;
  // Uncheck all others
  for (const el of this.querySelectorAll(QUERY_SELECTOR)) {
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
  const items = element.querySelectorAll(QUERY_SELECTOR);
  RovingTabIndex.setupTabIndexes(items, true);
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
