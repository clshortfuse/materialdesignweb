// https://www.w3.org/TR/wai-aria-1.1/#tab

import * as AriaTab from '../../core/aria/tab';
import { iterateArrayLike, iterateElementSiblings } from '../../core/dom';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';
import { setSelected } from '../../core/aria/attributes';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-overlay');
  if (!element.hasAttribute('mdw-overlay-off')) {
    element.setAttribute('mdw-overlay-off', 'selected');
  }
  if (!element.hasAttribute('mdw-overlay-default')) {
    element.setAttribute('mdw-overlay-default', 'medium');
  }
  Overlay.attach(element);

  element.classList.add('mdw-ripple');
  Ripple.attach(element);

  attachCore(element);
}

/**
 * @param {Element} tabItemElement
 * @param {boolean} [deselectSiblings=true]
 * @param {boolean} [dispatchEvents=false]
 * @return {void}
 */
export function selectTabItem(tabItemElement, deselectSiblings = true, dispatchEvents = false) {
  setSelected(tabItemElement, 'true', dispatchEvents);
  if (deselectSiblings) {
    deselectTabItemSiblings(tabItemElement, dispatchEvents);
  }
}

/**
 * @param {Element} tabItemElement
 * @param {boolean} [dispatchEvent=false]
 * @return {void}
 */
export function deselectTabItem(tabItemElement, dispatchEvent) {
  setSelected(tabItemElement, 'false', dispatchEvent);
}

/**
 * @param {Element} selectedTabItemElement
 * @param {boolean} [dispatchEvents=false]
 * @return {void}
 */
export function deselectTabItemSiblings(selectedTabItemElement, dispatchEvents = false) {
  iterateElementSiblings(selectedTabItemElement, (sibling) => {
    if (sibling.classList.contains('mdw-tab__item')) {
      setSelected(sibling, 'false', dispatchEvents);
    }
  });
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachCore(element) {
  attachAria(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachAria(element) {
  AriaTab.attach(element);
  iterateArrayLike(element.getElementsByClassName('mdw-tab__icon'),
    el => el.setAttribute('aria-hidden', 'true'));
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachAria(element) {
  AriaTab.attach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachCore(element) {
  AriaTab.detach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  detachCore(element);
  Ripple.detach(element);
  Overlay.detach(element);
}
