import { iterateArrayLike } from '../common/dom';

import * as ListItem from './item';
import * as ListExpander from './expander';


/**
 * @param {Element} listElement
 * @return {void}
 */
export function attach(listElement) {
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.attach);
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__expander'), ListExpander.attach);
}

/**
 * @param {Element} listElement
 * @return {void}
 */
export function detach(listElement) {
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.detach);
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__expander'), ListExpander.detach);
}
