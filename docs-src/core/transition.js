import * as Transition from '../../core/transition/index';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';
import { iterateArrayLike } from '../../core/dom';

iterateArrayLike(document.getElementsByClassName('mdw-overlay'), Overlay.attach);
iterateArrayLike(document.getElementsByClassName('mdw-ripple'), Ripple.attach);


/** @type {HTMLElement} */
let target1;
/** @type {HTMLElement} */
let target2;

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onItemClick(event) {
  /** @type {HTMLElement} */
  const target = (event.currentTarget);
  if (target.hasAttribute('mdw-transition-busy')) {
    return;
  }
  if (!target1) {
    target1 = target;
    target1.setAttribute('aria-pressed', 'true');
    return;
  }
  if (target1 === (event.currentTarget)) {
    target1.setAttribute('aria-pressed', 'false');
    target1 = null;
    return;
  }
  if (!target2) {
    target2 = target;
  }
  target2.blur();
  target1.setAttribute('aria-pressed', 'false');
  Transition.transitionElement(
    target1, target2,
    target1.getElementsByTagName('span')[0], target2.getElementsByTagName('span')[0],
    1500,
    true
  );
  target1 = null;
  target2 = null;
}

iterateArrayLike(
  document.getElementsByClassName('demo-core-item'),
  item => item.addEventListener('click', onItemClick)
);
