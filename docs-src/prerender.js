import {
  setRTLMode,
  setDarkMode,
  setFontSize,
  setupMenuOptions,
} from './menuoptions';
import { getStorageItem } from './storage';
import * as Layout from '../components/layout/index';
import * as List from '../components/list/index';


const useRTLMode = getStorageItem('rtlmode') === 'true';
const useDarkMode = getStorageItem('darkmode') === 'true';
const fontsize = getStorageItem('fontsize');


/** @return {void} */
function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
  setupMenuOptions();
  Layout.attach();
  List.attachAll(document.getElementsByClassName('mdw-layout__navdrawer')[0]);
}

setRTLMode(useRTLMode);
setDarkMode(useDarkMode);
setFontSize(fontsize);

Layout.onPrerender();

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
