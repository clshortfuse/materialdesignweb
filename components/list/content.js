import { iterateArrayLike } from '../../core/dom';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function attach(listContentElement) {
  attachCore(listContentElement);
  const currentRole = listContentElement.getAttribute('role');
  if (currentRole === 'link'
    || (currentRole == null && listContentElement instanceof HTMLAnchorElement)) {
    if (!listContentElement.hasAttribute('mdw-no-overlay')) {
      listContentElement.classList.add('mdw-overlay');
      Overlay.attach(listContentElement);
    }
    if (!listContentElement.hasAttribute('mdw-no-ripple')) {
      listContentElement.classList.add('mdw-ripple');
      Ripple.attach(listContentElement);
    }
  }
}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function attachCore(listContentElement) {
  iterateArrayLike(listContentElement.getElementsByClassName('mdw-list__icon'), (el) => {
    el.setAttribute('aria-hidden', 'true');
  });
  iterateArrayLike(listContentElement.getElementsByClassName('mdw-list__avatar'), (el) => {
    el.setAttribute('aria-hidden', 'true');
  });
}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function detachCore(listContentElement) {

}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function detach(listContentElement) {
  detachCore(listContentElement);
  Ripple.detach(listContentElement);
  Overlay.detach(listContentElement);
}
