// https://www.w3.org/TR/wai-aria-practices/#Listbox

import { Ripple } from '../ripple/index';
import { iterateArrayLike } from '../common/dom';

class ChipItem {
  /**
   * @param {HTMLElement} element
   * @return {void}
   */
  static attach(element) {
    Ripple.attach(element);
  }


  static detach(element) {
    Ripple.detach(element);
  }
}

class Chip {
  /**
   * @param {HTMLElement} element
   * @return {void}
   */
  static attach(element) {
    iterateArrayLike(element.getElementsByClassName('mdw-chip__item'), (item) => {
      ChipItem.attach(item);
    });
  }


  static detach(element) {
    iterateArrayLike(element.getElementsByClassName('mdw-chip__item'), (item) => {
      ChipItem.detach(item);
    });
  }
}

export {
  Chip,
};
