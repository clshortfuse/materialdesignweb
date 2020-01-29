import * as Document from '../core/document/index';
import { setupMenuOptions } from './_menuoptions';


/** @return {void} */
function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
  // Apply button states
  setupMenuOptions();
}

// Apply context first
setupMenuOptions();
Document.onPrerender();

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
