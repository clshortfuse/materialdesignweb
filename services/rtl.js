import { addGlobalCss } from '../core/css.js';

let globalStylesLoaded = false;

/** @return {void} */
export function loadGlobalStyles() {
  if (globalStylesLoaded) return;
  addGlobalCss('html[dir="rtl"]{--mdw-dir: -1;}');
  globalStylesLoaded = true;
}
