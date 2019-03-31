import {
  setupMenuOptions,
} from './_menuoptions';
import * as Layout from '../components/layout/index';
import * as List from '../components/list/index';


/** @return {void} */
function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
  // Apply button states
  setupMenuOptions();
  Layout.attach();
  List.attachAll(document.getElementsByClassName('mdw-layout__navdrawer')[0]);
}

// Apply context first
setupMenuOptions();

Layout.onPrerender();

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
