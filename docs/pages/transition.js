import * as Overlay from '../../core/overlay/index.js';
import * as Ripple from '../../core/ripple/index.js';
import * as Transition from '../../core/transition/index.js';

for (const element of document.getElementsByClassName('mdw-overlay')) { Overlay.attach(element); }
for (const element of document.getElementsByClassName('mdw-ripple')) { Ripple.attach(element); }

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
  Transition.transitionElement({
    fromShapeElement: target1,
    toShapeElement: target2,
    fromContentElement: target1.getElementsByClassName('demo-core-content')[0],
    toContentElement: target2.getElementsByClassName('demo-core-content')[0],
    duration: 3000,
    revertFrom: true,
  });
  target1 = null;
  target2 = null;
}

for (const item of document.getElementsByClassName('demo-core-item')) {
  item.addEventListener('click', onItemClick);
}
